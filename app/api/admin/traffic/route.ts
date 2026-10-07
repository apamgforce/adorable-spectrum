import { NextResponse } from "next/server";
import { sql, ensureSchema, checkLogin, hasRole } from "../../../lib/volunteer-db";

export const dynamic = "force-dynamic";

// Insights has its own login (set by the owner in Settings, or INSIGHTS_SECURE_TOKEN as the starting one).
// The main admin login and any "Insights viewer" helper login created in Settings also work.
async function allowed(request: Request): Promise<boolean> {
  const auth = request.headers.get("Authorization");
  return (await checkLogin(auth, "insights")) || (await checkLogin(auth, "owner")) || (await hasRole(auth, "insights"));
}

export async function GET(request: Request) {
  if (!(await allowed(request))) return NextResponse.json({ error: "Access denied" }, { status: 401 });
  try {
    await ensureSchema();
    const totals = await sql`
      SELECT kind,
        COALESCE(SUM(n) FILTER (WHERE day > CURRENT_DATE - 7), 0)::int AS d7,
        COALESCE(SUM(n) FILTER (WHERE day > CURRENT_DATE - 30), 0)::int AS d30
      FROM site_events WHERE day > CURRENT_DATE - 30 GROUP BY kind`;
    const pages = await sql`
      SELECT path, SUM(n)::int AS n FROM site_events
      WHERE kind = 'pageview' AND day > CURRENT_DATE - 30 GROUP BY path ORDER BY n DESC LIMIT 12`;
    const daily = await sql`
      SELECT to_char(day, 'YYYY-MM-DD') AS day, SUM(n)::int AS n FROM site_events
      WHERE kind = 'pageview' AND day > CURRENT_DATE - 14 GROUP BY day ORDER BY day`;
    return NextResponse.json({ totals, pages, daily });
  } catch {
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}
