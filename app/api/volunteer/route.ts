import { NextResponse } from "next/server";
import { sql, ensureSchema, getSetting } from "../../lib/volunteer-db";
import { TRACKS } from "../../lib/tracks";
import { upsertHubSpotContact } from "../../lib/hubspot";

export const dynamic = "force-dynamic";

async function load(code: string) {
  const [v] = await sql`SELECT id, code, name, track, status, on_break FROM vol_volunteers
    WHERE code = ${code} AND status = 'active'`;
  if (!v) return null;
  const assignments = await sql`
    SELECT a.id, a.status, a.done_at, (SELECT COUNT(*)::int FROM vol_submissions s WHERE s.assignment_id = a.id) AS attachments, a.group_confirmed_at, a.verified_at,
           t.title, t.details, t.track, t.week_of, t.due_date
    FROM vol_assignments a JOIN vol_tasks t ON t.id = a.task_id
    WHERE a.volunteer_id = ${v.id}
    ORDER BY (a.status = 'assigned') DESC, t.due_date NULLS LAST, a.id DESC
    LIMIT 100`;
  const [badge] = await sql`UPDATE vol_volunteers SET badge_token = COALESCE(badge_token, gen_random_uuid()::text)
    WHERE id = ${v.id} RETURNING badge_token AS token, COALESCE(approved_at, created_at) AS since`;
  const [cert] = await sql`SELECT token, kind, issued_at FROM vol_certificates WHERE volunteer_id = ${v.id}`;
  const news = await sql`SELECT id, title, body, track, pinned, created_at FROM vol_news
    WHERE track IS NULL OR track = ${v.track ?? ""}
    ORDER BY pinned DESC, created_at DESC LIMIT 20`;
  return {
    volunteer: { name: v.name, code: v.code, track: v.track, onBreak: !!v.on_break },
    assignments,
    news,
    certificate: cert ?? null,
    badge: badge ?? null,
    activeGroup: await getSetting("active_group"),
  };
}

// Login / refresh
export async function POST(request: Request) {
  try {
    await ensureSchema();
    const { code, action, assignmentId, text, track } = await request.json();
    const clean = String(code || "").trim().toUpperCase();
    const [v] = await sql`SELECT id FROM vol_volunteers WHERE code = ${clean} AND status = 'active'`;
    if (!v) return NextResponse.json({ error: "We couldn't find that ID. Check your message from the coordinator." }, { status: 404 });

    if (action === "done") {
      const done = await sql`UPDATE vol_assignments SET status = 'done', done_at = COALESCE(done_at, now())
        WHERE id = ${Number(assignmentId)} AND volunteer_id = ${v.id} AND status = 'assigned' RETURNING id`;
      const clean = String(text || "").trim().slice(0, 5000);
      if (done.length && clean) {
        await sql`INSERT INTO vol_submissions (assignment_id, kind, text) VALUES (${Number(assignmentId)}, 'text', ${clean})`;
      }
      await sql`INSERT INTO vol_events (volunteer_id, assignment_id, kind) VALUES (${v.id}, ${Number(assignmentId)}, 'marked_done')`;
    } else if (action === "group_confirmed") {
      await sql`UPDATE vol_assignments SET group_confirmed_at = COALESCE(group_confirmed_at, now())
        WHERE id = ${Number(assignmentId)} AND volunteer_id = ${v.id} AND status IN ('done','verified')`;
      await sql`INSERT INTO vol_events (volunteer_id, assignment_id, kind) VALUES (${v.id}, ${Number(assignmentId)}, 'group_confirmed')`;
    } else if (action === "break" || action === "resume") {
      await sql`UPDATE vol_volunteers SET on_break = ${action === "break"} WHERE id = ${v.id}`;
      await sql`INSERT INTO vol_events (volunteer_id, kind) VALUES (${v.id}, ${action === "break" ? "took_break" : "resumed"})`;
    } else if (action === "change_track") {
      if (!TRACKS.includes(String(track))) return NextResponse.json({ error: "Choose a task type from the list." }, { status: 400 });
      const [row] = await sql`UPDATE vol_volunteers SET track = ${String(track)} WHERE id = ${v.id}
        RETURNING name, email, whatsapp, track, hours, mode, hubspot_id`;
      await sql`INSERT INTO vol_events (volunteer_id, kind) VALUES (${v.id}, 'changed_track')`;
      upsertHubSpotContact({ name: row.name, email: row.email, whatsapp: row.whatsapp, track: row.track, hours: row.hours, mode: row.mode, hubspotId: row.hubspot_id }).catch(() => {});
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
