import { HUBSPOT_TRACK, HUBSPOT_HOURS } from "./tracks";

// Server-side HubSpot sync for volunteers.
// 1) Always submits the HubSpot form (keeps form analytics and anything triggered by the form, e.g. the Make confirmation email).
// 2) If HUBSPOT_ACCESS_TOKEN is set, also writes the contact directly, so phone, track, hours and mode
//    are saved even if a field is missing from the HubSpot form. Admin edits are pushed the same way.

const PORTAL_ID = process.env.HUBSPOT_PORTAL_ID || "149113634";
const FORM_ID = process.env.HUBSPOT_FORM_ID || "478982e9-0966-4030-a24d-8402a1c04c9f";
const REGION = process.env.HUBSPOT_REGION || "eu1";

export type HsVolunteer = {
  name: string; email: string | null; whatsapp: string | null;
  track: string | null; hours: string | null; mode: string | null;
  hubspotId?: string | null;
};

function props(v: HsVolunteer) {
  const parts = v.name.trim().split(/\s+/);
  const p: Record<string, string> = { firstname: parts[0] || "", lastname: parts.slice(1).join(" ") };
  if (v.email) p.email = v.email;
  if (v.whatsapp) { p.mobilephone = v.whatsapp; p.phone = v.whatsapp; }
  if (v.track) p.volunteer_track = HUBSPOT_TRACK[v.track] || v.track;
  if (v.hours) p.hours_per_month = HUBSPOT_HOURS[v.hours] || v.hours;
  if (v.mode) p.engagement_mode = v.mode;
  return p;
}

async function timed(url: string, init: RequestInit) {
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), 8000);
  try { return await fetch(url, { ...init, signal: c.signal }); } finally { clearTimeout(t); }
}

export async function submitHubSpotForm(v: HsVolunteer, pageUri?: string): Promise<string | null> {
  try {
    const fields = Object.entries(props(v)).filter(([, val]) => val).map(([name, value]) => ({ name, value }));
    const r = await timed(`https://api-${REGION}.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_ID}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields, context: { pageUri: pageUri || "https://greenforceafrica.com/volunteer", pageName: "Volunteer Application Page" } }),
    });
    return r.ok ? null : `Form ${r.status}: ${(await r.text()).slice(0, 300)}`;
  } catch (e) { return `Form: ${(e as Error).message}`; }
}

// Returns { id } on success, { error } on failure, or {} when no token is configured.
export async function upsertHubSpotContact(v: HsVolunteer): Promise<{ id?: string; error?: string }> {
  const token = process.env.HUBSPOT_ACCESS_TOKEN;
  if (!token) return {};
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
  const p = props(v);
  try {
    let r: Response;
    if (v.hubspotId) {
      r = await timed(`https://api.hubapi.com/crm/v3/objects/contacts/${v.hubspotId}`, { method: "PATCH", headers, body: JSON.stringify({ properties: p }) });
      if (r.status !== 404) {
        const j = await r.json().catch(() => ({}));
        return r.ok ? { id: String(j.id || v.hubspotId) } : { error: `HubSpot ${r.status}: ${j.message || ""}`.slice(0, 300) };
      }
    }
    if (!v.email) return { error: "No email, so HubSpot can't match this person" };
    r = await timed("https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert", {
      method: "POST", headers,
      body: JSON.stringify({ inputs: [{ idProperty: "email", id: v.email, properties: p }] }),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) return { error: `HubSpot ${r.status}: ${j.message || ""}`.slice(0, 300) };
    return { id: j.results?.[0]?.id ? String(j.results[0].id) : undefined };
  } catch (e) { return { error: `HubSpot: ${(e as Error).message}` }; }
}

export const hubspotDirectEnabled = () => !!process.env.HUBSPOT_ACCESS_TOKEN;
