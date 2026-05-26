import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { put, del } from "@vercel/blob";

// FORCES Vercel to treat this as a live, dynamic server route
export const dynamic = "force-dynamic";

const sql = neon(process.env.POSTGRES_URL!);

// 1. GET ALL IMAGES
export async function GET() {
  try {
    const data = await sql`SELECT * FROM gallery_images ORDER BY id DESC`;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Fetch failed" }, { status: 500 });
  }
}

// 2. UPLOAD NEW IMAGE (With deep diagnostic logging)
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const caption = formData.get("caption") as string;
    const category = formData.get("category") as string;

    if (!file || !caption || !category) {
      return NextResponse.json({ error: "Missing fields in form data" }, { status: 400 });
    }

    // Safety check to ensure we actually got a raw file binary
    if (file.size === 0) {
      return NextResponse.json({ error: "File buffer is completely empty" }, { status: 400 });
    }

    // Generate clean unique identifier
    const uniqueFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;

    // Upload to Vercel Blob Store
    let blob;
    try {
      blob = await put(uniqueFilename, file, { access: "public" });
    } catch (blobErr: any) {
      return NextResponse.json({ 
        error: "Vercel Blob rejected file. Check if BLOB_READ_WRITE_TOKEN is linked.",
        details: blobErr.message 
      }, { status: 500 });
    }

    // Save mapping index to Neon Postgres
    try {
      await sql`
        INSERT INTO gallery_images (src, caption, category) 
        VALUES (${blob.url}, ${caption}, ${category})
      `;
    } catch (dbErr: any) {
      // If DB fails, try to cleanup the stranded blob we just uploaded
      if (blob?.url) await del(blob.url);
      return NextResponse.json({ 
        error: "Blob saved, but writing to Postgres failed.",
        details: dbErr.message 
      }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ 
      error: "Global API Crash caught inside runtime handler", 
      details: error.message 
    }, { status: 500 });
  }
}

// 3. DELETE IMAGE
export async function DELETE(request: Request) {
  try {
    const { id, src } = await request.json();
    await sql`DELETE FROM gallery_images WHERE id = ${id}`;

    if (src.includes("public.blob.vercel-storage.com")) {
      await del(src);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Delete failed" }, { status: 500 });
  }
}
