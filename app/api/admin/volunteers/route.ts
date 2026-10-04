import { NextResponse } from "next/server";
import { sql, ensureSchema, makeCode, isAdmin } from "../../../lib/volunteer-db";

export const dynamic = "force-dynamic";
const deny = () => NextResponse.json({ error: "Access denied" }, { status: 401 });

export async function GET(request: Request) {
  if (!isAdmin(request)) return deny();
  try {
    await ensureSchema();
    const volunteers = await sql`
      SELECT v.id, v.code, v.name, v.email, v.whatsapp, v.track, v.status, v.last_login,
        COUNT(a.id)::int AS assigned,
        COUNT(a.id) FILTER (WHERE a.status IN ('done','verified'))::int AS done,
        COUNT(a.id) FILTER (WHERE a.group_confirmed_at IS NOT NULL)::int AS confirmed
      FROM vol_volunteers v LEFT JOIN vol_assignments a ON a.volunteer_id = v.id
      GROUP BY v.id ORDER BY v.created_at DESC`;
    const tasks = await sql`
      SELECT t.id, t.title, t.track, t.week_of, t.due_date,
        COUNT(a.id)::int AS assigned,
        COUNT(a.id) FILTER (WHERE a.status IN ('done','verified'))::int AS done
      FROM vol_tasks t LEFT JOIN vol_assignments a ON a.task_id = t.id
      GROUP BY t.id ORDER BY t.created_at DESC LIMIT 50`;
    const queue = await sql`
      SELECT a.id, v.name, v.code, t.title, a.status, a.done_at, a.group_confirmed_at, a.note
      FROM vol_assignments a
      JOIN vol_volunteers v ON v.id = a.volunteer_id JOIN vol_tasks t ON t.id = a.task_id
      WHERE a.status = 'done' ORDER BY a.done_at DESC LIMIT 100`;
    const [kpi] = await sql`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE a.status IN ('done','verified'))::int AS done,
        COUNT(*) FILTER (WHERE a.status = 'verified')::int AS verified,
        COUNT(*) FILTER (WHERE a.status = 'assigned' AND t.due_date < CURRENT_DATE)::int AS overdue,
        COUNT(*) FILTER (WHERE a.status IN ('done','verified') AND a.group_confirmed_at IS NULL)::int AS missing_group,
        ROUND(AVG(EXTRACT(EPOCH FROM (a.done_at - a.created_at)) / 3600) FILTER (WHERE a.done_at IS NOT NULL))::int AS avg_hours
      FROM vol_assignments a JOIN vol_tasks t ON t.id = a.task_id`;
    const byTrack = await sql`
      SELECT COALESCE(t.track, 'General') AS track, COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE a.status IN ('done','verified'))::int AS done
      FROM vol_assignments a JOIN vol_tasks t ON t.id = a.task_id GROUP BY 1 ORDER BY 2 DESC`;
    return NextResponse.json({ volunteers, tasks, queue, kpi, byTrack });
  } catch {
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isAdmin(request)) return deny();
  try {
    await ensureSchema();
    const body = await request.json();

    if (body.action === "add_volunteer") {
      const name = String(body.name || "").trim();
      if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });
      const code = makeCode();
      await sql`INSERT INTO vol_volunteers (code, name, email, whatsapp, track)
        VALUES (${code}, ${name}, ${body.email || null}, ${body.whatsapp || null}, ${body.track || null})`;
      return NextResponse.json({ success: true, code });
    }

    if (body.action === "assign") {
      const ids: number[] = (body.volunteerIds || []).map(Number).filter(Boolean);
      const title = String(body.title || "").trim();
      if (!title || !ids.length) return NextResponse.json({ error: "Task title and at least one volunteer required" }, { status: 400 });
      const [t] = await sql`INSERT INTO vol_tasks (title, details, track, due_date)
        VALUES (${title}, ${body.details || null}, ${body.track || null}, ${body.dueDate || null}) RETURNING id`;
      await sql`INSERT INTO vol_assignments (task_id, volunteer_id)
        SELECT ${t.id}, UNNEST(${ids}::int[]) ON CONFLICT DO NOTHING`;
      return NextResponse.json({ success: true, count: ids.length });
    }

    if (body.action === "verify") {
      await sql`UPDATE vol_assignments SET status = 'verified', verified_at = now()
        WHERE id = ${Number(body.assignmentId)} AND status = 'done'`;
      return NextResponse.json({ success: true });
    }

    if (body.action === "reopen") {
      await sql`UPDATE vol_assignments SET status = 'assigned', done_at = NULL, group_confirmed_at = NULL, verified_at = NULL
        WHERE id = ${Number(body.assignmentId)}`;
      return NextResponse.json({ success: true });
    }

    if (body.action === "set_status") {
      await sql`UPDATE vol_volunteers SET status = ${body.status === "inactive" ? "inactive" : "active"}
        WHERE id = ${Number(body.volunteerId)}`;
      return NextResponse.json({ success: true });
    }

    // Pull new signups from HubSpot (needs HUBSPOT_ACCESS_TOKEN: a private-app token with crm.objects.contacts.read)
    if (body.action === "sync_hubspot") {
      const token = process.env.HUBSPOT_ACCESS_TOKEN;
      if (!token) return NextResponse.json({ error: "Add HUBSPOT_ACCESS_TOKEN in your environment variables to enable sync." }, { status: 400 });
      let after: string | undefined;
      let added = 0;
      for (let page = 0; page < 20; page++) {
        const url = new URL("https://api.hubapi.com/crm/v3/objects/contacts");
        url.searchParams.set("limit", "100");
        url.searchParams.set("properties", "firstname,lastname,email,mobilephone,volunteer_track");
        if (after) url.searchParams.set("after", after);
        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) return NextResponse.json({ error: "HubSpot rejected the request. Check the token scopes." }, { status: 502 });
        const data = await res.json();
        for (const c of data.results || []) {
          const p = c.properties || {};
          if (!p.email || !p.volunteer_track) continue; // only people who used the volunteer form
          const name = [p.firstname, p.lastname].filter(Boolean).join(" ").trim() || p.email;
          const r = await sql`INSERT INTO vol_volunteers (code, name, email, whatsapp, track, hubspot_id)
            VALUES (${makeCode()}, ${name}, ${p.email}, ${p.mobilephone || null}, ${p.volunteer_track}, ${c.id})
            ON CONFLICT (email) DO NOTHING RETURNING id`;
          added += r.length;
        }
        after = data.paging?.next?.after;
        if (!after) break;
      }
      return NextResponse.json({ success: true, added });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
