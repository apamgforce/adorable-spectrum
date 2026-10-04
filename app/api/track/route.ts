import { NextResponse } from "next/server";
import { sql, ensureSchema } from "../../lib/volunteer-db";

export const dynamic = "force-dynamic";

const KINDS = new Set(["pageview", "donate_click", "givesendgo_click", "whatsapp_click", "apply_click", "apply_submit", "volunteer_submit", "contact_submit"]);
const BOT = /bot|crawl|spider|preview|monitor|lighthouse|headless/i;

// Cookie-free counting: one row per day, kind and page. No IP address, no personal data.
export async function POST(request: Request) {
  try {
    if (BOT.test(request.headers.get("user-agent") || "")) return new NextResponse(null, { status: 204 });
    const body = await request.json();
    const kind = String(body.kind || "");
    const path = String(body.path || "/").split("?")[0].slice(0, 100);
    if (!KINDS.has(kind) || !path.startsWith("/")) return new NextResponse(null, { status: 204 });
    await ensureSchema();
    await sql`INSERT INTO site_events (day, kind, path, n) VALUES (CURRENT_DATE, ${kind}, ${path}, 1)
      ON CONFLICT (day, kind, path) DO UPDATE SET n = site_events.n + 1`;
    return new NextResponse(null, { status: 204 });
  } catch {
    return new NextResponse(null, { status: 204 });
  }
}
