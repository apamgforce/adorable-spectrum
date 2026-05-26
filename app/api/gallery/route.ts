import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { put, del } from "@vercel/blob";

export const dynamic = "force-dynamic";
const sql = neon(process.env.POSTGRES_URL!);

// Helper: Directly matches incoming temporary request credentials against Vercel env variable
function isAuthorized(request: Request): boolean {
  const authHeader = request.headers.get("Authorization");
  const secureToken = process.env.ADMIN_SECURE_TOKEN; // e.g., "greenforce_admin:Apam_Greenhouse_2026"
  
  if (!authHeader || !secureToken) return false;
  return authHeader === `Bearer ${secureToken}`;
}

// 1. GET ALL IMAGES (Public)
export async function GET() {
  try {
    const data = await sql`SELECT * FROM gallery_images ORDER BY id DESC`;
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

// 2. UPLOAD IMAGE ROUTE (Authenticated on-demand)
export async function POST(request: Request) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "Access Denied: Invalid Credentials" }, { status: 401 });
  
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const caption = formData.get("caption") as string;
    const category = formData.get("category") as string;

    if (!file || !caption || !category) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const uniqueFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
    const blob = await put(uniqueFilename, file, { access: "public" });

    await sql`INSERT INTO gallery_images (src, caption, category) VALUES (${blob.url}, ${caption}, ${category})`;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

// 3. EDIT/UPDATE ROUTE (Authenticated on-demand)
export async function PUT(request: Request) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "Access Denied: Invalid Credentials" }, { status: 401 });
  
  try {
    const { id, caption, category } = await request.json();
    await sql`UPDATE gallery_images SET caption = ${caption}, category = ${category} WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// 4. DELETE ROUTE (Authenticated on-demand)
export async function DELETE(request: Request) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "Access Denied: Invalid Credentials" }, { status: 401 });
  
  try {
    const { id, src } = await request.json();
    await sql`DELETE FROM gallery_images WHERE id = ${id}`;
    if (src.includes("public.blob.vercel-storage.com")) await del(src);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
