import { NextResponse } from "next/server";
import { sql, ensureSchema } from "../../lib/volunteer-db";

export const dynamic = "force-dynamic";

// Short verification link printed on certificates: greenforceafrica.com/v/AB12CD34
export async function GET(req: Request, { params }: { params: Promise<{ short: string }> }) {
  const { short } = await params;
  const code = short.toLowerCase().replace(/[^a-f0-9]/g, "").slice(0, 8);
  if (code.length < 8) return new NextResponse("Not found", { status: 404 });
  await ensureSchema();
  const [c] = await sql`SELECT token FROM vol_certificates WHERE token LIKE ${code + "%"} LIMIT 1`;
  if (!c) return new NextResponse("Certificate not found", { status: 404 });
  return NextResponse.redirect(new URL(`/certificate/${c.token}`, req.url));
}
