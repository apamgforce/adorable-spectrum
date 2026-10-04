import { NextResponse } from "next/server";
import { sql, ensureSchema, makeCode, isAdmin, getSetting, hashPassword } from "../../../lib/volunteer-db";

export const dynamic = "force-dynamic";
const deny = () => NextResponse.json({ error: "Access denied" }, { status: 401 });

export async function GET(request: Request) {
  if (!isAdmin(request)) return deny();
  try {
    await ensureSchema();
    const volunteers = await sql`
      SELECT v.id, v.code, v.name, v.email, v.whatsapp, v.track, v.status, v.last_login, c.token AS cert_token,
        COUNT(a.id)::int AS assigned,
        COUNT(a.id) FILTER (WHERE a.status IN ('done','verified'))::int AS done,
        COUNT(a.id) FILTER (WHERE a.group_confirmed_at IS NOT NULL)::int AS confirmed
      FROM vol_volunteers v LEFT JOIN vol_assignments a ON a.volunteer_id = v.id
      LEFT JOIN vol_certificates c ON c.volunteer_id = v.id
      GROUP BY v.id, c.id ORDER BY v.created_at DESC`;
    const tasks = await sql`
      SELECT t.id, t.title, t.track, t.week_of, t.due_date,
        COUNT(a.id)::int AS assigned,
        COUNT(a.id) FILTER (WHERE a.status IN ('done','verified'))::int AS done
      FROM vol_tasks t LEFT JOIN vol_assignments a ON a.task_id = t.id
      GROUP BY t.id ORDER BY t.created_at DESC LIMIT 50`;
    const queue = await sql`
      SELECT a.id, v.name, v.code, t.title, a.status, a.done_at, a.group_confirmed_at, a.note,
        (SELECT COALESCE(json_agg(json_build_object('kind', s.kind, 'url', s.url, 'name', s.filename, 'type', s.content_type, 'text', s.text) ORDER BY s.id), '[]'::json)
         FROM vol_submissions s WHERE s.assignment_id = a.id) AS subs
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
    // Certificate eligibility: 60+ days since first task, at least 4 tasks, half or more completed.
    const eligible = await sql`
      SELECT v.id, v.name, v.email, v.whatsapp, v.code,
        COUNT(a.id)::int AS assigned,
        COUNT(a.id) FILTER (WHERE a.status IN ('done','verified'))::int AS done,
        MIN(a.created_at) AS first_task,
        (c.id IS NOT NULL) AS issued, c.token, c.kind
      FROM vol_volunteers v
      JOIN vol_assignments a ON a.volunteer_id = v.id
      LEFT JOIN vol_certificates c ON c.volunteer_id = v.id
      WHERE v.status = 'active'
      GROUP BY v.id, c.id
      HAVING MIN(a.created_at) <= now() - interval '60 days'
        AND COUNT(a.id) >= 4
        AND COUNT(a.id) FILTER (WHERE a.status IN ('done','verified')) * 2 >= COUNT(a.id)
      ORDER BY (c.id IS NOT NULL), done DESC`;
    const galleryOps = await sql`SELECT id, username, created_at FROM vol_gallery_ops ORDER BY id`;
    const activeGroup = await getSetting("active_group");
    return NextResponse.json({ volunteers, tasks, queue, kpi, byTrack, eligible, galleryOps, activeGroup });
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
      await sql`UPDATE vol_volunteers SET status = ${body.status === "inactive" ? "inactive" : "active"},
        approved_at = CASE WHEN ${body.status === "inactive"} THEN approved_at ELSE COALESCE(approved_at, now()) END
        WHERE id = ${Number(body.volunteerId)}`;
      return NextResponse.json({ success: true });
    }

    if (body.action === "set_active_group") {
      const link = String(body.link || "").trim();
      if (link && !/^https:\/\/chat\.whatsapp\.com\//.test(link)) return NextResponse.json({ error: "Paste a WhatsApp group invite link (https://chat.whatsapp.com/...)" }, { status: 400 });
      await sql`INSERT INTO vol_settings (key, value) VALUES ('active_group', ${link})
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`;
      return NextResponse.json({ success: true });
    }

    if (body.action === "add_gallery_op") {
      const username = String(body.username || "").trim();
      const password = String(body.password || "");
      if (username.length < 3 || username.includes(":") || password.length < 8)
        return NextResponse.json({ error: "Username 3+ characters (no colon) and password 8+ characters" }, { status: 400 });
      const { salt, hash } = hashPassword(password);
      await sql`INSERT INTO vol_gallery_ops (username, salt, hash) VALUES (${username}, ${salt}, ${hash})
        ON CONFLICT (username) DO UPDATE SET salt = EXCLUDED.salt, hash = EXCLUDED.hash`;
      return NextResponse.json({ success: true });
    }

    if (body.action === "remove_gallery_op") {
      await sql`DELETE FROM vol_gallery_ops WHERE id = ${Number(body.id)}`;
      return NextResponse.json({ success: true });
    }

    if (body.action === "issue_certificate") {
      const kind = "service";
      const [row] = await sql`
        SELECT COUNT(*) FILTER (WHERE status IN ('done','verified'))::int AS done
        FROM vol_assignments WHERE volunteer_id = ${Number(body.volunteerId)}`;
      await sql`INSERT INTO vol_certificates (volunteer_id, kind, token, tasks_done)
        VALUES (${Number(body.volunteerId)}, ${kind}, ${crypto.randomUUID()}, ${row?.done ?? 0})
        ON CONFLICT (volunteer_id) DO UPDATE SET kind = EXCLUDED.kind`;
      return NextResponse.json({ success: true });
    }

    if (body.action === "delete_volunteer") {
      await sql`DELETE FROM vol_volunteers WHERE id = ${Number(body.volunteerId)}`;
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
