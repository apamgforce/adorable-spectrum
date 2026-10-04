import { NextResponse } from "next/server";
import { sql, ensureSchema, makeCode } from "../../../lib/volunteer-db";

export const dynamic = "force-dynamic";

// Called by the public volunteer form after the HubSpot submission succeeds,
// so every signup gets a volunteer ID automatically (no HubSpot token needed).
export async function POST(request: Request) {
  try {
    await ensureSchema();
    const b = await request.json();
    const name = String(b.name || "").trim().slice(0, 120);
    const email = String(b.email || "").trim().toLowerCase().slice(0, 160);
    if (!name || !email.includes("@")) return NextResponse.json({ ok: false }, { status: 400 });
    await sql`INSERT INTO vol_volunteers (code, name, email, whatsapp, track)
      VALUES (${makeCode()}, ${name}, ${email}, ${String(b.whatsapp || "").slice(0, 40) || null}, ${String(b.track || "").slice(0, 60) || null})
      ON CONFLICT (email) DO UPDATE SET
        name = EXCLUDED.name,
        track = COALESCE(EXCLUDED.track, vol_volunteers.track),
        whatsapp = COALESCE(EXCLUDED.whatsapp, vol_volunteers.whatsapp)`;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
