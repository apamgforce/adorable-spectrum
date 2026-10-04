import { NextResponse } from "next/server";
import { sql, ensureSchema, makeCode } from "../../../lib/volunteer-db";

export const dynamic = "force-dynamic";

const tail = (v: string | null | undefined) => String(v || "").replace(/\D/g, "").slice(-9);

// Called by the public volunteer form after the HubSpot submission succeeds.
// New volunteers get their ID straight away. Someone re-registering gets the same ID back
// only if the WhatsApp number matches the one on file, so IDs can't be fished out with just an email.
export async function POST(request: Request) {
  try {
    await ensureSchema();
    const b = await request.json();
    const name = String(b.name || "").trim().slice(0, 120);
    const email = String(b.email || "").trim().toLowerCase().slice(0, 160);
    const whatsapp = String(b.whatsapp || "").trim().slice(0, 40) || null;
    const track = String(b.track || "").trim().slice(0, 60) || null;
    if (!name || !email.includes("@")) return NextResponse.json({ ok: false }, { status: 400 });

    const [existing] = await sql`SELECT code, whatsapp FROM vol_volunteers WHERE email = ${email}`;
    if (existing) {
      if (tail(whatsapp).length >= 7 && tail(whatsapp) === tail(existing.whatsapp)) {
        await sql`UPDATE vol_volunteers SET name = ${name}, track = COALESCE(${track}, track) WHERE email = ${email}`;
        return NextResponse.json({ ok: true, code: existing.code, returning: true });
      }
      return NextResponse.json({ ok: true, code: null, existing: true });
    }

    const code = makeCode();
    await sql`INSERT INTO vol_volunteers (code, name, email, whatsapp, track)
      VALUES (${code}, ${name}, ${email}, ${whatsapp}, ${track}) ON CONFLICT (email) DO NOTHING`;
    return NextResponse.json({ ok: true, code });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
