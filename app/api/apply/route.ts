import { NextResponse } from "next/server";
import { normalizeWhatsApp } from "../../lib/phone";
import { timed } from "../../lib/hubspot";

// Support application (/apply). Sent to HubSpot from the server so the phone number is cleaned up
// and, when HUBSPOT_ACCESS_TOKEN is set, written straight onto the contact as well as via the form.
// Only standard HubSpot contact properties are used (no custom objects).

const PORTAL_ID = process.env.HUBSPOT_PORTAL_ID || "149113634";
const FORM_ID = process.env.HUBSPOT_APPLY_FORM_ID || "33c0e56b-9a54-4315-a0e0-6a9c80255b95";
const REGION = process.env.HUBSPOT_REGION || "eu1";

const clean = (v: unknown, max: number) => String(v ?? "").trim().replace(/[ \t]+/g, " ").slice(0, max);
const COUNTRIES = ["Ghana", "The Gambia"];

export async function POST(request: Request) {
  try {
    const b = await request.json();
    const email = clean(b.email, 160).toLowerCase();
    const firstname = clean(b.firstname, 80), lastname = clean(b.lastname, 80);
    const phone = normalizeWhatsApp(b.phone);
    const country = COUNTRIES.includes(clean(b.country, 40)) ? clean(b.country, 40) : "";

    if (!firstname || !lastname) return NextResponse.json({ error: "Please enter your first and last name." }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    if (!phone) return NextResponse.json({ error: "Please enter a valid phone number, e.g. 024 123 4567 or +233 24 123 4567." }, { status: 400 });

    const props: Record<string, string> = {
      email, firstname, lastname, phone,
      gender: clean(b.gender, 40), city: clean(b.city, 80), school_name: clean(b.school_name, 160),
      country, message: clean(b.message, 5000),
    };
    const dob = clean(b.date_of_birth, 10);
    if (/^\d{4}-\d{2}-\d{2}$/.test(dob)) props.date_of_birth = dob;

    // 1) HubSpot form (keeps form reports and any workflows that start from it)
    let formError: string | null = null;
    try {
      const fields = Object.entries(props).filter(([, v]) => v).map(([name, value]) => ({ objectTypeId: "0-1", name, value }));
      const r = await timed(`https://api-${REGION}.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_ID}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields, context: { pageUri: request.headers.get("referer") || "https://greenforceafrica.com/apply", pageName: "Apply for Support" } }),
      });
      if (!r.ok) formError = `Form ${r.status}: ${(await r.text()).slice(0, 300)}`;
    } catch (e) { formError = `Form: ${(e as Error).message}`; }

    // 2) Direct contact write (only when a token is configured)
    let directOk = false;
    const token = process.env.HUBSPOT_ACCESS_TOKEN;
    if (token) {
      try {
        const direct = { ...props, mobilephone: phone };
        const r = await timed("https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert", {
          method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ inputs: [{ idProperty: "email", id: email, properties: direct }] }),
        });
        directOk = r.ok;
        if (!r.ok) console.error("HubSpot apply upsert", r.status, (await r.text()).slice(0, 300));
      } catch (e) { console.error("HubSpot apply upsert", e); }
    }

    if (formError && !directOk) {
      console.error("HubSpot apply form", formError);
      return NextResponse.json({ error: "We couldn't submit your application right now. Please check your details and try again." }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "We couldn't submit your application right now. Please try again." }, { status: 500 });
  }
}
