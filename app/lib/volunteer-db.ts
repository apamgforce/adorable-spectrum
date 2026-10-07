import { neon } from "@neondatabase/serverless";

export const sql = neon(process.env.POSTGRES_URL!);

import { scryptSync, randomBytes, timingSafeEqual, createHash } from "node:crypto";

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

      await sql`CREATE TABLE IF NOT EXISTS vol_news (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        body TEXT NOT NULL,
        track TEXT,
        pinned BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;

      await sql`CREATE TABLE IF NOT EXISTS vol_accounts (
        role TEXT PRIMARY KEY,
        username TEXT NOT NULL,
        salt TEXT NOT NULL,
        hash TEXT NOT NULL,
        env_fp TEXT NOT NULL DEFAULT '',
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
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

// Dashboard logins. Day to day they live in the database so they can be changed from the site.
// The Vercel variable (username:password) is the starting login and the way back in: while it is
// unchanged since the last in-site change, the site password rules; edit the variable and it wins again.
export type LoginRole = "owner" | "coordinator" | "insights";
const ENV_NAME: Record<LoginRole, string> = { owner: "ADMIN_SECURE_TOKEN", coordinator: "COORDINATOR_SECURE_TOKEN", insights: "INSIGHTS_SECURE_TOKEN" };
const envToken = (role: LoginRole) => process.env[ENV_NAME[role]] || "";
const fingerprint = (s: string) => (s ? createHash("sha256").update(s).digest("hex") : "");
const same = (a: string, b: string) => {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

async function siteAccount(role: LoginRole) {
  await ensureSchema();
  const [row] = await sql`SELECT username, salt, hash, env_fp FROM vol_accounts WHERE role = ${role}`;
  return row && (!envToken(role) || same(fingerprint(envToken(role)), row.env_fp)) ? row : null;
}

export async function checkLogin(auth: string | null, role: LoginRole): Promise<boolean> {
  if (!auth?.startsWith("Bearer ")) return false;
  const cred = auth.slice(7);
  const i = cred.indexOf(":");
  try {
    const row = await siteAccount(role);
    if (row) return i > 0 && same(cred.slice(0, i), row.username) && same(hashPassword(cred.slice(i + 1), row.salt).hash, row.hash);
  } catch {
    return false;
  }
  const env = envToken(role);
  return !!env && same(cred, env);
}

export async function setLogin(role: LoginRole, username: string, password: string) {
  const { salt, hash } = hashPassword(password);
  await ensureSchema();
  await sql`INSERT INTO vol_accounts (role, username, salt, hash, env_fp) VALUES (${role}, ${username}, ${salt}, ${hash}, ${fingerprint(envToken(role))})
    ON CONFLICT (role) DO UPDATE SET username = EXCLUDED.username, salt = EXCLUDED.salt, hash = EXCLUDED.hash, env_fp = EXCLUDED.env_fp, updated_at = now()`;
}

// Where each login currently comes from, for the owner's Settings.
export async function loginStatus(role: LoginRole): Promise<{ role: LoginRole; username: string | null; source: "site" | "vercel" | "none" }> {
  const row = await siteAccount(role);
  if (row) return { role, username: row.username, source: "site" };
  const env = envToken(role);
  return env ? { role, username: env.split(":")[0], source: "vercel" } : { role, username: null, source: "none" };
}

// Owner: the full admin. Coordinator: runs volunteers day to day, with no access to settings or logins.
export type AdminRole = "owner" | "coordinator";
export async function adminRole(request: Request): Promise<AdminRole | null> {
  const auth = request.headers.get("Authorization");
  if (await checkLogin(auth, "owner")) return "owner";
  if (await checkLogin(auth, "coordinator")) return "coordinator";
  return null;
}

export const isAdmin = async (request: Request) => (await adminRole(request)) === "owner";

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
