import { NextResponse } from "next/server";
import { sql, ensureSchema, makeCode } from "../../../lib/volunteer-db";

export const dynamic = "force-dynamic";

const tail = (v: string | null | undefined) => String(v || "").replace(/\D/g, "").slice(-9);

// Called by the public volunteer form after the HubSpot submission succeeds.
// Signups are stored as "pending". The coordinator approves them in the admin, which is when they
// receive their ID. Re-registering with a matching WhatsApp number just refreshes name and track.
export async function POST(request: Request) {
  try {
    await ensureSchema();
    const b = await request.json();
    const name = String(b.name || "").trim().slice(0, 120);
    const email = String(b.email || "").trim().toLowerCase().slice(0, 160);
    const whatsapp = String(b.whatsapp || "").trim().slice(0, 40) || null;
    const track = String(b.track || "").trim().slice(0, 60) || null;
    if (!name || !email.includes("@")) return NextResponse.json({ ok: false }, { status: 400 });

    const [existing] = await sql`SELECT whatsapp FROM vol_volunteers WHERE email = ${email}`;
    if (existing) {
      if (tail(whatsapp).length >= 7 && tail(whatsapp) === tail(existing.whatsapp)) {
        await sql`UPDATE vol_volunteers SET name = ${name}, track = COALESCE(${track}, track) WHERE email = ${email}`;
      }
      return NextResponse.json({ ok: true });
    }

    await sql`INSERT INTO vol_volunteers (code, name, email, whatsapp, track, status)
      VALUES (${makeCode()}, ${name}, ${email}, ${whatsapp}, ${track}, 'pending') ON CONFLICT (email) DO NOTHING`;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
