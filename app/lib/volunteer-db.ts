import { neon } from "@neondatabase/serverless";

export const sql = neon(process.env.POSTGRES_URL!);

import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto";

// Self-provisioning schema: first request creates the tables, no manual migration.
let ready: Promise<void> | null = null;
export function ensureSchema(): Promise<void> {
  if (!ready) {
    ready = (async () => {
      await sql`CREATE TABLE IF NOT EXISTS vol_volunteers (
        id SERIAL PRIMARY KEY,
        code TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        whatsapp TEXT,
        track TEXT,
        status TEXT NOT NULL DEFAULT 'active',
        hubspot_id TEXT,
        last_login TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
      await sql`ALTER TABLE vol_volunteers ADD COLUMN IF NOT EXISTS badge_token TEXT`;
      await sql`ALTER TABLE vol_volunteers ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ`;
      await sql`ALTER TABLE vol_volunteers ADD COLUMN IF NOT EXISTS hours TEXT`;
      await sql`ALTER TABLE vol_volunteers ADD COLUMN IF NOT EXISTS mode TEXT`;
      await sql`ALTER TABLE vol_volunteers ADD COLUMN IF NOT EXISTS notes TEXT`;
      await sql`ALTER TABLE vol_volunteers ADD COLUMN IF NOT EXISTS hubspot_synced_at TIMESTAMPTZ`;
      await sql`ALTER TABLE vol_volunteers ADD COLUMN IF NOT EXISTS hubspot_error TEXT`;
      await sql`CREATE TABLE IF NOT EXISTS vol_tasks (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        details TEXT,
        track TEXT,
        week_of DATE NOT NULL DEFAULT CURRENT_DATE,
        due_date DATE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
      await sql`CREATE TABLE IF NOT EXISTS vol_assignments (
        id SERIAL PRIMARY KEY,
        task_id INT NOT NULL REFERENCES vol_tasks(id) ON DELETE CASCADE,
        volunteer_id INT NOT NULL REFERENCES vol_volunteers(id) ON DELETE CASCADE,
        status TEXT NOT NULL DEFAULT 'assigned',
        done_at TIMESTAMPTZ,
        group_confirmed_at TIMESTAMPTZ,
        verified_at TIMESTAMPTZ,
        note TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        UNIQUE (task_id, volunteer_id)
      )`;
      await sql`CREATE TABLE IF NOT EXISTS vol_events (
        id SERIAL PRIMARY KEY,
        volunteer_id INT,
        assignment_id INT,
        kind TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
      await sql`CREATE TABLE IF NOT EXISTS vol_submissions (
        id SERIAL PRIMARY KEY,
        assignment_id INT NOT NULL REFERENCES vol_assignments(id) ON DELETE CASCADE,
        kind TEXT NOT NULL,
        url TEXT,
        filename TEXT,
        content_type TEXT,
        text TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
      await sql`CREATE TABLE IF NOT EXISTS site_events (
        day DATE NOT NULL,
        kind TEXT NOT NULL,
        path TEXT NOT NULL,
        n INT NOT NULL DEFAULT 0,
        PRIMARY KEY (day, kind, path)
      )`;
      await sql`CREATE TABLE IF NOT EXISTS vol_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      )`;
      await sql`CREATE TABLE IF NOT EXISTS vol_certificates (
        id SERIAL PRIMARY KEY,
        volunteer_id INT NOT NULL REFERENCES vol_volunteers(id) ON DELETE CASCADE,
        kind TEXT NOT NULL DEFAULT 'service',
        token TEXT UNIQUE NOT NULL,
        tasks_done INT NOT NULL DEFAULT 0,
        issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        UNIQUE (volunteer_id)
      )`;
      await sql`CREATE TABLE IF NOT EXISTS vol_gallery_ops (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        salt TEXT NOT NULL,
        hash TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;

      await sql`ALTER TABLE vol_gallery_ops ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'gallery'`;
    })().catch((e) => {
      ready = null;
      throw e;
    });
  }
  return ready;
}

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
export function makeCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(5));
  return "GF-" + Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}

export function isAdmin(request: Request): boolean {
  const token = process.env.ADMIN_SECURE_TOKEN;
  return !!token && request.headers.get("Authorization") === `Bearer ${token}`;
}

export async function getSetting(key: string): Promise<string> {
  const [r] = await sql`SELECT value FROM vol_settings WHERE key = ${key}`;
  return r?.value ?? "";
}

export function hashPassword(password: string, salt = randomBytes(16).toString("hex")) {
  return { salt, hash: scryptSync(password, salt, 32).toString("hex") };
}

// Gallery-only logins that never learn the main admin password.
export const isGalleryOperator = (auth: string | null) => hasRole(auth, "gallery");

// Helper logins created from the admin. Each one is limited to a single role.
export async function hasRole(auth: string | null, role: "gallery" | "insights"): Promise<boolean> {
  if (!auth?.startsWith("Bearer ")) return false;
  const cred = auth.slice(7);
  const i = cred.indexOf(":");
  if (i < 1) return false;
  try {
    await ensureSchema();
    const [row] = await sql`SELECT salt, hash FROM vol_gallery_ops WHERE username = ${cred.slice(0, i)} AND role = ${role}`;
    if (!row) return false;
    const a = Buffer.from(hashPassword(cred.slice(i + 1), row.salt).hash);
    const b = Buffer.from(row.hash);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
