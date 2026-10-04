import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { sql, ensureSchema } from "../../../lib/volunteer-db";

export const dynamic = "force-dynamic";

const MAX_BYTES = 4 * 1024 * 1024; // Vercel request bodies are capped at ~4.5MB
const MAX_FILES = 8;
const ALLOWED = [/^image\//, /^application\/pdf$/, /^text\/plain$/, /^application\/msword$/, /^application\/vnd\.openxmlformats-officedocument\./, /^application\/vnd\.ms-(excel|powerpoint)/];

// One file per request so large photo sets never hit the body size limit.
export async function POST(request: Request) {
  try {
    await ensureSchema();
    const form = await request.formData();
    const code = String(form.get("code") || "").trim().toUpperCase();
    const assignmentId = Number(form.get("assignmentId"));
    const file = form.get("file") as File | null;
    if (!file || !assignmentId) return NextResponse.json({ error: "Missing file" }, { status: 400 });
    if (file.size > MAX_BYTES) return NextResponse.json({ error: `${file.name} is too large (max 4MB)` }, { status: 413 });
    if (!ALLOWED.some((re) => re.test(file.type))) return NextResponse.json({ error: `${file.name}: this file type isn't allowed` }, { status: 415 });

    const [a] = await sql`
      SELECT a.id FROM vol_assignments a JOIN vol_volunteers v ON v.id = a.volunteer_id
      WHERE a.id = ${assignmentId} AND v.code = ${code} AND v.status = 'active' AND a.status = 'assigned'`;
    if (!a) return NextResponse.json({ error: "Task not found" }, { status: 404 });

    const [{ n }] = await sql`SELECT COUNT(*)::int AS n FROM vol_submissions WHERE assignment_id = ${a.id} AND kind = 'file'`;
    if (n >= MAX_FILES) return NextResponse.json({ error: `Maximum ${MAX_FILES} files per task` }, { status: 400 });

    const safe = file.name.replace(/[^a-zA-Z0-9.]/g, "_").slice(-80);
    const blob = await put(`volunteer-submissions/${a.id}-${Date.now()}-${safe}`, file, { access: "public", addRandomSuffix: true });
    await sql`INSERT INTO vol_submissions (assignment_id, kind, url, filename, content_type)
      VALUES (${a.id}, 'file', ${blob.url}, ${file.name.slice(0, 120)}, ${file.type})`;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}
