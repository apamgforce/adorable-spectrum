import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { sql, ensureSchema } from "../../../lib/volunteer-db";

export const dynamic = "force-dynamic";

const FOREST = rgb(0.102, 0.239, 0.122);
const LEAF = rgb(0.176, 0.416, 0.208);
const LIME = rgb(0.482, 0.769, 0.498);
const GREY = rgb(0.33, 0.37, 0.34);

async function loadLogo(origin: string): Promise<Uint8Array | null> {
  try {
    const r = await fetch(`${origin}/logo.jpg`);
    if (r.ok) return new Uint8Array(await r.arrayBuffer());
  } catch {}
  try {
    const { readFile } = await import("node:fs/promises");
    return new Uint8Array(await readFile(`${process.cwd()}/public/logo.jpg`));
  } catch {}
  return null;
}

export async function GET(req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  let name = "Sample Volunteer", track: string | null = "Social Media Posting", issued = new Date(), serial = "GF-SAMPLE00";

  if (token !== "sample") {
    await ensureSchema();
    const [c] = await sql`
      SELECT c.issued_at, c.token, v.name, v.track
      FROM vol_certificates c JOIN vol_volunteers v ON v.id = c.volunteer_id WHERE c.token = ${token}`;
    if (!c) return new Response("Not found", { status: 404 });
    name = c.name; track = c.track; issued = new Date(c.issued_at);
    serial = `GF-${String(c.token).slice(0, 8).toUpperCase()}`;
  }

  const pdf = await PDFDocument.create();
  const W = 842, H = 595; // A4 landscape
  const page = pdf.addPage([W, H]);
  const serif = await pdf.embedFont(StandardFonts.TimesRoman);
  const serifBold = await pdf.embedFont(StandardFonts.TimesRomanBold);
  const italic = await pdf.embedFont(StandardFonts.TimesRomanItalic);
  const sans = await pdf.embedFont(StandardFonts.Helvetica);
  const sansBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  // White page, green bands and borders
  page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: rgb(1, 1, 1) });
  page.drawRectangle({ x: 0, y: H - 26, width: W, height: 26, color: FOREST });
  page.drawRectangle({ x: 0, y: 0, width: W, height: 26, color: FOREST });
  page.drawRectangle({ x: 28, y: 40, width: W - 56, height: H - 80, borderColor: LEAF, borderWidth: 2.5 });
  page.drawRectangle({ x: 36, y: 48, width: W - 72, height: H - 96, borderColor: LIME, borderWidth: 0.8 });

  const center = (text: string, y: number, size: number, font = serif, color = FOREST) => {
    const w = font.widthOfTextAtSize(text, size);
    page.drawText(text, { x: (W - w) / 2, y, size, font, color });
  };

  // Logo
  const logoBytes = await loadLogo(new URL(req.url).origin);
  if (logoBytes) {
    try {
      const logo = await pdf.embedJpg(logoBytes);
      const size = 74;
      page.drawCircle({ x: W / 2, y: 478, size: size / 2 + 3, color: LEAF });
      page.drawImage(logo, { x: W / 2 - size / 2, y: 478 - size / 2, width: size, height: size });
      page.drawCircle({ x: W / 2, y: 478, size: size / 2 + 1.5, borderColor: rgb(1, 1, 1), borderWidth: 3 });
    } catch {}
  }

  center("VTO GREENFORCE FOUNDATION AFRICA", 420, 13, sansBold, LEAF);
  center("Certificate of Service", 365, 46, serifBold, FOREST);
  page.drawLine({ start: { x: W / 2 - 70, y: 345 }, end: { x: W / 2 + 70, y: 345 }, thickness: 2, color: LIME });
  center("This certificate is proudly presented to", 312, 15, italic, GREY);
  center(name, 262, 38, serifBold, FOREST);

  center(`in recognition of faithful and dedicated service as a volunteer${track ? ` in ${track}` : ""},`, 220, 15, serif, GREY);
  center("and for generously giving their time in support of school greenhouses,", 198, 15, serif, GREY);
  center("education and community care in Ghana and The Gambia.", 176, 15, serif, GREY);

  // Seal
  page.drawCircle({ x: W / 2, y: 112, size: 30, color: LEAF });
  page.drawCircle({ x: W / 2, y: 112, size: 26, borderColor: rgb(1, 1, 1), borderWidth: 1 });
  const seal = (t: string, y: number, size: number) => {
    const w = sansBold.widthOfTextAtSize(t, size);
    page.drawText(t, { x: W / 2 - w / 2, y, size, font: sansBold, color: rgb(1, 1, 1) });
  };
  seal("VTO", 115, 9);
  seal("GREENFORCE", 105, 5.5);

  page.drawText(`Issued ${issued.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`, { x: 70, y: 118, size: 12, font: sans, color: GREY });
  page.drawText(`Certificate ID ${serial}`, { x: 70, y: 100, size: 10, font: sans, color: GREY });
  const verify = `Verify: greenforceafrica.com/certificate/${token}`;
  const vw = sans.widthOfTextAtSize(verify, 8);
  page.drawText(verify, { x: W - 70 - vw, y: 100, size: 8, font: sans, color: GREY });

  const bytes = await pdf.save();
  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="Greenforce-Certificate-${name.replace(/[^a-zA-Z0-9]+/g, "-")}.pdf"`,
      "X-Robots-Tag": "noindex",
    },
  });
}
