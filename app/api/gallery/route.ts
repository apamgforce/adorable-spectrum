import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { put, del } from "@vercel/blob";

// Automatically grabs the hidden Vercel database key
const sql = neon(process.env.POSTGRES_URL!);

// 1. GET ALL IMAGES
export async function GET() {
  try {
    const data = await sql`SELECT * FROM gallery_images ORDER BY id DESC`;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

// 2. UPLOAD NEW IMAGE
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const caption = formData.get("caption") as string;
    const category = formData.get("category") as string;

    if (!file || !caption || !category) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Upload file directly to Vercel Blob storage
    const blob = await put(file.name, file, { access: "public" });

    // Save image reference data into Postgres database
    await sql`
      INSERT INTO gallery_images (src, caption, category) 
      VALUES (${blob.url}, ${caption}, ${category})
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

// 3. DELETE IMAGE
export async function DELETE(request: Request) {
  try {
    const { id, src } = await request.json();
    
    // Delete from database
    await sql`DELETE FROM gallery_images WHERE id = ${id}`;

    // If it's a Vercel Blob URL, delete the file asset too
    if (src.includes("public.blob.vercel-storage.com")) {
      await del(src);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
