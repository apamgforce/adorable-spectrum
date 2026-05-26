import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.POSTGRES_URL!);

export async function GET() {
  try {
    // 1. Create the database table structure
    await sql`
      CREATE TABLE IF NOT EXISTS gallery_images (
        id SERIAL PRIMARY KEY,
        src TEXT NOT NULL,
        caption TEXT NOT NULL,
        category TEXT NOT NULL
      );
    `;

    // 2. Check if the table is already populated so we don't duplicate rows
    const existing = await sql`SELECT COUNT(*) FROM gallery_images`;
    const count = parseInt(existing[0].count, 10);

    if (count === 0) {
      // 3. Inject your 11 original seed images
      await sql`
        INSERT INTO gallery_images (src, caption, category) VALUES
        ('hostellers.png', 'Youth agri-training in Apam', 'Training'),
        ('sitting.jpg', 'Greenhouse at Apam SHS', 'Greenhouse'),
        ('hunger.png', 'Students in Gomoa West', 'Community'),
        ('twoboys.jpg', 'Classroom learning', 'Education'),
        ('/beansharvest.jpg', 'Harvest season — Central Ghana', 'Harvest'),
        ('kidsgathering.jpg', 'Community gathering', 'Community'),
        ('students.jpg', 'Greenforce students', 'Training'),
        ('https://images.unsplash.com/photo-1500076656116-558758c991c1?w=800&q=80&auto=format&fit=crop', 'Farmland in Gomoa West', 'Community'),
        ('agritrain.jpg', 'Agri-training weekend', 'Training'),
        ('manyfarming.jpg', 'Students preparing for harvest', 'Harvest'),
        ('commfarm.jpg', 'Community farming support', 'Community');
      `;
      return NextResponse.json({ success: true, message: "Table created and seeded perfectly!" });
    }

    return NextResponse.json({ success: true, message: "Table already exists and has data." });

  } catch (error: any) {
    console.error("Database setup error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
