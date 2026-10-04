import { neon } from "@neondatabase/serverless";

export const sql = neon(process.env.POSTGRES_URL!);

export const WHATSAPP_GROUP_LINK =
  "https://chat.whatsapp.com/Fit8eH747BLAna15s6RE92?s=cl&p=a&ilr=0";

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
