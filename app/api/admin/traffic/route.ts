import { NextResponse } from "next/server";
import { sql, ensureSchema, isAdmin, hasRole } from "../../../lib/volunteer-db";

export const dynamic = "force-dynamic";

// Insights has its own login: INSIGHTS_SECURE_TOKEN ("username:password") in the environment.
// The main admin login and any "Insights viewer" helper login created in Settings also work.
async function allowed(request: Request): Promise<boolean> {
  const auth = request.headers.get("Authorization");
  const own = process.env.INSIGHTS_SECURE_TOKEN;
  if (own && auth === `Bearer ${own}`) return true;
  return isAdmin(request) || (await hasRole(auth, "insights"));
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
