import { NextResponse } from "next/server";
import { sql, ensureSchema, makeCode } from "../../../lib/volunteer-db";
import { normalizeWhatsApp } from "../../../lib/phone";
import { TRACKS, HOURS, MODES } from "../../../lib/tracks";
import { submitHubSpotForm, upsertHubSpotContact } from "../../../lib/hubspot";

export const dynamic = "force-dynamic";

const pick = (v: unknown, allowed: string[]) => { const s = String(v || "").trim(); return allowed.includes(s) ? s : null; };

// Public volunteer form. Our database is saved first (so no application is ever lost),
// then HubSpot is updated. New applicants are "pending" until the coordinator approves them.
export async function POST(request: Request) {
  try {
    await ensureSchema();
    const b = await request.json();
    const name = String(b.name || "").trim().replace(/\s+/g, " ").slice(0, 120);
    const email = String(b.email || "").trim().toLowerCase().slice(0, 160);
    const whatsapp = normalizeWhatsApp(b.whatsapp);
    const track = pick(b.track, TRACKS);
    const hours = pick(b.hours, HOURS);
    const mode = pick(b.mode, MODES.map((m) => m.value));

    if (name.length < 2) return NextResponse.json({ error: "Please enter your full name." }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    if (!whatsapp) return NextResponse.json({ error: "Please enter a valid WhatsApp number, e.g. 024 123 4567 or +233 24 123 4567." }, { status: 400 });

    const [existing] = await sql`SELECT id, status, hubspot_id FROM vol_volunteers WHERE email = ${email}`;
    let id: number; let hubspotId: string | null = null; let returning = false;
    if (existing) {
      // Same person applying again: refresh their details, never touch their status or ID.
      await sql`UPDATE vol_volunteers SET name = ${name}, whatsapp = ${whatsapp},
        track = COALESCE(${track}, track), hours = COALESCE(${hours}, hours), mode = COALESCE(${mode}, mode)
        WHERE id = ${existing.id}`;
      id = existing.id; hubspotId = existing.hubspot_id; returning = existing.status !== "pending";
    } else {
      const [row] = await sql`INSERT INTO vol_volunteers (code, name, email, whatsapp, track, hours, mode, status)
        VALUES (${makeCode()}, ${name}, ${email}, ${whatsapp}, ${track}, ${hours}, ${mode}, 'pending') RETURNING id`;
      id = row.id;
    }

    const v = { name, email, whatsapp, track, hours, mode, hubspotId };
    const [formErr, direct] = await Promise.all([submitHubSpotForm(v, request.headers.get("referer") || undefined), upsertHubSpotContact(v)]);
    const error = direct.error || (direct.id ? null : formErr);
    await sql`UPDATE vol_volunteers SET hubspot_id = COALESCE(${direct.id ?? null}, hubspot_id),
      hubspot_synced_at = CASE WHEN ${!error} THEN now() ELSE hubspot_synced_at END, hubspot_error = ${error}
      WHERE id = ${id}`;

    return NextResponse.json({ ok: true, returning });
  } catch {
    return NextResponse.json({ error: "We couldn't save your application. Please try again in a minute." }, { status: 500 });
  }
}
