import { NextResponse } from "next/server";
import { sql, ensureSchema, makeCode, isAdmin, getSetting, hashPassword } from "../../../lib/volunteer-db";
import { normalizeWhatsApp } from "../../../lib/phone";
import { TRACKS, HOURS, MODES } from "../../../lib/tracks";
import { upsertHubSpotContact, hubspotDirectEnabled } from "../../../lib/hubspot";

const pick = (v: unknown, allowed: string[]) => { const s = String(v ?? "").trim(); return allowed.includes(s) ? s : null; };

// Push one volunteer's current details to HubSpot and record the outcome on their row.
async function syncOne(id: number) {
  if (!hubspotDirectEnabled()) return;
  const [v] = await sql`SELECT name, email, whatsapp, track, hours, mode, hubspot_id FROM vol_volunteers WHERE id = ${id}`;
  if (!v) return;
  const r = await upsertHubSpotContact({ name: v.name, email: v.email, whatsapp: v.whatsapp, track: v.track, hours: v.hours, mode: v.mode, hubspotId: v.hubspot_id });
  await sql`UPDATE vol_volunteers SET hubspot_id = COALESCE(${r.id ?? null}, hubspot_id),
    hubspot_synced_at = CASE WHEN ${!r.error} THEN now() ELSE hubspot_synced_at END, hubspot_error = ${r.error ?? null} WHERE id = ${id}`;
}

export const dynamic = "force-dynamic";
const deny = () => NextResponse.json({ error: "Access denied" }, { status: 401 });

export async function GET(request: Request) {
  if (!isAdmin(request)) return deny();
  try {
    await ensureSchema();
    const volunteers = await sql`
      SELECT v.id, v.code, v.name, v.email, v.whatsapp, v.track, v.hours, v.mode, v.notes, v.status, v.last_login,
        v.created_at, v.approved_at, v.hubspot_id, v.hubspot_error, c.token AS cert_token,
        MAX(a.done_at) AS last_done,
        COUNT(a.id)::int AS assigned,
        COUNT(a.id) FILTER (WHERE a.status IN ('done','verified'))::int AS done,
        COUNT(a.id) FILTER (WHERE a.group_confirmed_at IS NOT NULL)::int AS confirmed
      FROM vol_volunteers v LEFT JOIN vol_assignments a ON a.volunteer_id = v.id
      LEFT JOIN vol_certificates c ON c.volunteer_id = v.id
      GROUP BY v.id, c.id ORDER BY v.created_at DESC`;
    const tasks = await sql`
      SELECT t.id, t.title, t.details, t.track, t.week_of, t.due_date, t.created_at,
        COUNT(a.id)::int AS assigned,
        COUNT(a.id) FILTER (WHERE a.status IN ('done','verified'))::int AS done,
        COALESCE(json_agg(json_build_object('id', a.id, 'volunteer_id', v.id, 'name', v.name, 'whatsapp', v.whatsapp, 'status', a.status)
          ORDER BY v.name) FILTER (WHERE a.id IS NOT NULL), '[]'::json) AS people
      FROM vol_tasks t LEFT JOIN vol_assignments a ON a.task_id = t.id LEFT JOIN vol_volunteers v ON v.id = a.volunteer_id
      GROUP BY t.id ORDER BY t.created_at DESC LIMIT 100`;
    const queue = await sql`
      SELECT a.id, v.name, v.code, v.whatsapp, t.title, a.status, a.done_at, a.group_confirmed_at, a.note,
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
    const news = await sql`SELECT id, title, body, track, pinned, created_at FROM vol_news ORDER BY pinned DESC, created_at DESC LIMIT 100`;
    const galleryOps = await sql`SELECT id, username, role, created_at FROM vol_gallery_ops ORDER BY id`;
    const activeGroup = await getSetting("active_group");
    return NextResponse.json({ volunteers, tasks, queue, kpi, byTrack, eligible, news, galleryOps, activeGroup, hubspotDirect: hubspotDirectEnabled() });
  } catch {
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isAdmin(request)) return deny();
  try {
    await ensureSchema();
    const body = await request.json();

    if (body.action === "add_volunteer" || body.action === "update_volunteer") {
      const name = String(body.name || "").trim().replace(/\s+/g, " ").slice(0, 120);
      const email = String(body.email || "").trim().toLowerCase().slice(0, 160) || null;
      const rawPhone = String(body.whatsapp || "").trim();
      const whatsapp = normalizeWhatsApp(rawPhone);
      if (name.length < 2) return NextResponse.json({ error: "Enter the volunteer's full name." }, { status: 400 });
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return NextResponse.json({ error: "That email address doesn't look right." }, { status: 400 });
      if (rawPhone && !whatsapp) return NextResponse.json({ error: "That WhatsApp number doesn't look right. Use 024 123 4567 or +233 24 123 4567." }, { status: 400 });
      if (email) {
        const [dupe] = await sql`SELECT name FROM vol_volunteers WHERE email = ${email} AND id <> ${Number(body.volunteerId) || 0}`;
        if (dupe) return NextResponse.json({ error: `${dupe.name} already uses that email.` }, { status: 400 });
      }
      const track = pick(body.track, TRACKS), hours = pick(body.hours, HOURS), mode = pick(body.mode, MODES.map((m) => m.value));
      const notes = String(body.notes || "").trim().slice(0, 2000) || null;
      if (body.action === "add_volunteer") {
        const code = makeCode();
        const [row] = await sql`INSERT INTO vol_volunteers (code, name, email, whatsapp, track, hours, mode, notes, status, approved_at)
          VALUES (${code}, ${name}, ${email}, ${whatsapp}, ${track}, ${hours}, ${mode}, ${notes}, 'active', now()) RETURNING id`;
        await syncOne(row.id);
        return NextResponse.json({ success: true, code, id: row.id });
      }
      const id = Number(body.volunteerId);
      await sql`UPDATE vol_volunteers SET name = ${name}, email = ${email}, whatsapp = ${whatsapp}, track = ${track},
        hours = ${hours}, mode = ${mode}, notes = ${notes} WHERE id = ${id}`;
      await syncOne(id);
      return NextResponse.json({ success: true });
    }

    if (body.action === "sync_hubspot") {
      if (!hubspotDirectEnabled()) return NextResponse.json({ error: "HubSpot direct sync isn't switched on yet. See the setup guide." }, { status: 400 });
      const rows = await sql`SELECT id FROM vol_volunteers WHERE hubspot_synced_at IS NULL OR hubspot_error IS NOT NULL ORDER BY id LIMIT 40`;
      for (const r of rows) await syncOne(r.id);
      const [{ n }] = await sql`SELECT COUNT(*)::int AS n FROM vol_volunteers WHERE hubspot_error IS NOT NULL`;
      return NextResponse.json({ success: true, count: rows.length, failed: n });
    }

    if (body.action === "delete_task") {
      await sql`DELETE FROM vol_tasks WHERE id = ${Number(body.taskId)}`;
      return NextResponse.json({ success: true });
    }

    if (body.action === "unassign") {
      await sql`DELETE FROM vol_assignments WHERE id = ${Number(body.assignmentId)} AND status = 'assigned'`;
      return NextResponse.json({ success: true });
    }

    if (body.action === "add_to_task") {
      const ids: number[] = (body.volunteerIds || []).map(Number).filter(Boolean);
      await sql`INSERT INTO vol_assignments (task_id, volunteer_id) SELECT ${Number(body.taskId)}, UNNEST(${ids}::int[]) ON CONFLICT DO NOTHING`;
      return NextResponse.json({ success: true, count: ids.length });
    }

    if (body.action === "assign") {
      const ids: number[] = (body.volunteerIds || []).map(Number).filter(Boolean);
      if (body.dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(String(body.dueDate))) return NextResponse.json({ error: "Pick a valid due date" }, { status: 400 });
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
      const status = ["active", "inactive", "pending"].includes(body.status) ? body.status : "active";
      await sql`UPDATE vol_volunteers SET status = ${status},
        approved_at = CASE WHEN ${status === "active"} THEN COALESCE(approved_at, now()) ELSE approved_at END
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

    if (body.action === "post_news") {
      const title = String(body.title || "").trim().slice(0, 150);
      const text = String(body.body || "").trim().slice(0, 5000);
      if (!title || !text) return NextResponse.json({ error: "Add a headline and the update itself." }, { status: 400 });
      await sql`INSERT INTO vol_news (title, body, track, pinned)
        VALUES (${title}, ${text}, ${pick(body.track, TRACKS)}, ${!!body.pinned})`;
      return NextResponse.json({ success: true });
    }

    if (body.action === "pin_news") {
      await sql`UPDATE vol_news SET pinned = ${!!body.pinned} WHERE id = ${Number(body.newsId)}`;
      return NextResponse.json({ success: true });
    }

    if (body.action === "delete_news") {
      await sql`DELETE FROM vol_news WHERE id = ${Number(body.newsId)}`;
      return NextResponse.json({ success: true });
    }

    if (body.action === "add_gallery_op") {
      const username = String(body.username || "").trim();
      const password = String(body.password || "");
      if (username.length < 3 || username.includes(":") || password.length < 8)
        return NextResponse.json({ error: "Username 3+ characters (no colon) and password 8+ characters" }, { status: 400 });
      const { salt, hash } = hashPassword(password);
      const role = body.role === "insights" ? "insights" : "gallery";
      await sql`INSERT INTO vol_gallery_ops (username, salt, hash, role) VALUES (${username}, ${salt}, ${hash}, ${role})
        ON CONFLICT (username) DO UPDATE SET salt = EXCLUDED.salt, hash = EXCLUDED.hash, role = EXCLUDED.role`;
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
  } catch (e) {
    const m = String((e as Error)?.message || "");
    if (m.includes("unique")) return NextResponse.json({ error: "That already exists (same email or username)." }, { status: 400 });
    return NextResponse.json({ error: "That didn't save. Check your connection and try again." }, { status: 500 });
  }
}
