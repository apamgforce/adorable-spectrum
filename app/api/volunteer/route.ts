import { NextResponse } from "next/server";
import { sql, ensureSchema, getSetting } from "../../lib/volunteer-db";

export const dynamic = "force-dynamic";

async function load(code: string) {
  const [v] = await sql`SELECT id, code, name, track, status FROM vol_volunteers
    WHERE code = ${code} AND status = 'active'`;
  if (!v) return null;
  const assignments = await sql`
    SELECT a.id, a.status, a.done_at, a.group_confirmed_at, a.verified_at,
           t.title, t.details, t.track, t.week_of, t.due_date
    FROM vol_assignments a JOIN vol_tasks t ON t.id = a.task_id
    WHERE a.volunteer_id = ${v.id}
    ORDER BY (a.status = 'assigned') DESC, t.due_date NULLS LAST, a.id DESC
    LIMIT 100`;
  const [cert] = await sql`SELECT token, kind FROM vol_certificates WHERE volunteer_id = ${v.id}`;
  return {
    volunteer: { name: v.name, code: v.code, track: v.track },
    assignments,
    certificate: cert ?? null,
    activeGroup: await getSetting("active_group"),
  };
}

// Login / refresh
export async function POST(request: Request) {
  try {
    await ensureSchema();
    const { code, action, assignmentId, note } = await request.json();
    const clean = String(code || "").trim().toUpperCase();
    const [v] = await sql`SELECT id FROM vol_volunteers WHERE code = ${clean} AND status = 'active'`;
    if (!v) return NextResponse.json({ error: "We couldn't find that ID. Check your message from the coordinator." }, { status: 404 });

    if (action === "done") {
      await sql`UPDATE vol_assignments SET status = 'done', done_at = COALESCE(done_at, now()), note = ${note ? String(note).slice(0, 500) : null}
        WHERE id = ${Number(assignmentId)} AND volunteer_id = ${v.id} AND status = 'assigned'`;
      await sql`INSERT INTO vol_events (volunteer_id, assignment_id, kind) VALUES (${v.id}, ${Number(assignmentId)}, 'marked_done')`;
    } else if (action === "group_confirmed") {
      await sql`UPDATE vol_assignments SET group_confirmed_at = COALESCE(group_confirmed_at, now())
        WHERE id = ${Number(assignmentId)} AND volunteer_id = ${v.id} AND status IN ('done','verified')`;
      await sql`INSERT INTO vol_events (volunteer_id, assignment_id, kind) VALUES (${v.id}, ${Number(assignmentId)}, 'group_confirmed')`;
    } else if (action === "undo") {
      await sql`UPDATE vol_assignments SET status = 'assigned', done_at = NULL, group_confirmed_at = NULL
        WHERE id = ${Number(assignmentId)} AND volunteer_id = ${v.id} AND status = 'done'`;
    } else {
      await sql`UPDATE vol_volunteers SET last_login = now() WHERE id = ${v.id}`;
    }
    return NextResponse.json(await load(clean));
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
