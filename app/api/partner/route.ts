import { NextResponse } from "next/server";
import { timed } from "../../lib/hubspot";

export const dynamic = "force-dynamic";

// Partner enquiries from /partner go into HubSpot as a contact, marked as a new lead,
// with the chosen area and their message saved in the contact's Message field.
export async function POST(request: Request) {
  const token = process.env.HUBSPOT_ACCESS_TOKEN;
  if (!token) return NextResponse.json({ ok: false, error: "HubSpot not connected" }, { status: 503 });
  try {
    const b = await request.json();
    const name = String(b.name || "").trim().replace(/\s+/g, " ").slice(0, 120);
    const email = String(b.email || "").trim().toLowerCase().slice(0, 160);
    const area = String(b.area || "").trim().slice(0, 80) || "Not sure yet";
    const message = String(b.message || "").trim().slice(0, 5000);
    if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return NextResponse.json({ ok: false, error: "Invalid name or email" }, { status: 400 });
    }
    const parts = name.split(" ");
    const properties: Record<string, string> = {
      firstname: parts[0],
      lastname: parts.slice(1).join(" "),
      email,
      message: `PARTNERSHIP ENQUIRY (${new Date().toISOString().slice(0, 10)})\nArea: ${area}\n\n${message}`,
      hs_lead_status: "NEW",
    };
    const r = await timed("https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ inputs: [{ idProperty: "email", id: email, properties }] }),
    });
    if (!r.ok) return NextResponse.json({ ok: false, error: `HubSpot ${r.status}` }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Failed" }, { status: 500 });
  }
}
