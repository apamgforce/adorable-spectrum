// Transactional email through Resend (https://resend.com). One key, no extra packages.
// Everything here is a quiet no-op until RESEND_API_KEY is set, so the site never breaks without it.

const FROM = process.env.EMAIL_FROM || "VTO Greenforce Foundation Africa <volunteers@greenforceafrica.com>";
const MAIN_GROUP = "https://chat.whatsapp.com/Fit8eH747BLAna15s6RE92?s=cl&p=a&ilr=0";

export const emailEnabled = () => !!process.env.RESEND_API_KEY;

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));

export async function sendEmail(to: string | null | undefined, subject: string, html: string, text: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key || !to) return false;
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 6000);
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: [to], subject, html, text, reply_to: process.env.EMAIL_REPLY_TO || undefined }),
      signal: ctl.signal,
    });
    return r.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

type Parts = { heading: string; paragraphs: string[]; highlight?: string; button?: { label: string; url: string }; links?: { label: string; url: string }[] };

function render(p: Parts) {
  const para = p.paragraphs.map((t) => `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#2b3a2e">${t}</p>`).join("");
  const hi = p.highlight ? `<div style="margin:8px 0 22px;padding:18px;background:#e8f2e7;border-radius:10px;text-align:center"><div style="font-size:12px;letter-spacing:.18em;color:#4a8c52;text-transform:uppercase">Your volunteer ID</div><div style="font-size:30px;font-weight:700;letter-spacing:.14em;color:#1a3d1f;margin-top:4px">${esc(p.highlight)}</div></div>` : "";
  const btn = p.button ? `<p style="margin:8px 0 22px"><a href="${p.button.url}" style="display:inline-block;background:#2d6a35;color:#ffffff;text-decoration:none;padding:14px 26px;border-radius:8px;font-weight:600">${esc(p.button.label)}</a></p>` : "";
  const links = (p.links || []).map((l) => `<p style="margin:0 0 8px;font-size:15px"><a href="${l.url}" style="color:#2d6a35">${esc(l.label)}</a></p>`).join("");
  const html = `<!doctype html><html><body style="margin:0;background:#f3f6f0;font-family:Arial,Helvetica,sans-serif"><table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px"><table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden"><tr><td style="background:#1a3d1f;padding:22px 28px;color:#ffffff"><div style="font-size:12px;letter-spacing:.2em;color:#7bc47f">VTO GREENFORCE</div><div style="font-size:20px;font-weight:700;margin-top:2px">Foundation Africa</div></td></tr><tr><td style="padding:28px"><h1 style="margin:0 0 16px;font-size:24px;color:#1a3d1f">${esc(p.heading)}</h1>${para}${hi}${btn}${links}</td></tr><tr><td style="padding:18px 28px;background:#f3f6f0;font-size:12px;color:#6b7c6e">VTO Greenforce Foundation Africa · greenforceafrica.com</td></tr></table></td></tr></table></body></html>`;
  const text = [p.heading, "", ...p.paragraphs.map((t) => t.replace(/<[^>]+>/g, "")), p.highlight ? `Your volunteer ID: ${p.highlight}` : "", p.button ? `${p.button.label}: ${p.button.url}` : "", ...(p.links || []).map((l) => `${l.label}: ${l.url}`)].filter(Boolean).join("\n");
  return { html, text };
}

const first = (name: string) => esc(name.trim().split(" ")[0] || "friend");

export function sendApplicationReceived(to: string, name: string) {
  const { html, text } = render({
    heading: `Thank you, ${first(name)}`,
    paragraphs: [
      "We have received your application to volunteer with VTO Greenforce Foundation Africa.",
      "<b>What happens next</b><br>1. Our team reviews your application.<br>2. Once approved, you are added to the <b>Active Volunteers</b> group.<br>3. You receive your personal volunteer ID by email and in the group.",
      "Tasks are shared every Monday and are due by Friday. Most of the work is remote and takes 30 minutes to an hour a week.",
    ],
    button: { label: "Join our community group", url: MAIN_GROUP },
  });
  return sendEmail(to, "We received your volunteer application", html, text);
}

export function sendApproved(to: string, name: string, code: string, origin: string, activeGroup: string) {
  const { html, text } = render({
    heading: `You are approved, ${first(name)}!`,
    paragraphs: [
      "Welcome to the team. Use your personal ID to open the volunteer portal, see your tasks and mark them done. Keep it safe, it is your key.",
      "After you mark a task done in the portal, type <b>DONE</b> in the Active Volunteers group so the team can see it.",
    ],
    highlight: code,
    button: { label: "Open the volunteer portal", url: `${origin}/volunteer/portal` },
    links: [{ label: "Start with the volunteer training", url: `${origin}/volunteer/training` }, ...(activeGroup ? [{ label: "Join the Active Volunteers group", url: activeGroup }] : [])],
  });
  return sendEmail(to, "You are approved: your Greenforce volunteer ID", html, text);
}

export function sendCertificate(to: string, name: string, token: string, origin: string) {
  const { html, text } = render({
    heading: `Your certificate is ready, ${first(name)}`,
    paragraphs: ["Thank you for your faithful service with VTO Greenforce Foundation Africa. Your Certificate of Service is ready to view and download as a PDF. You can use it for your career and personal records."],
    button: { label: "View and download", url: `${origin}/certificate/${token}` },
    links: [{ label: "Open your volunteer portal to share your Verified Volunteer badge", url: `${origin}/volunteer/portal` }],
  });
  return sendEmail(to, "Your Greenforce Certificate of Service", html, text);
}
