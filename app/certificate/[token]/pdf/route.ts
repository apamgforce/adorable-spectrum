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
  const SB = 170; // green sidebar width
  const CX = SB + (W - SB) / 2; // centre of the white content area
  const page = pdf.addPage([W, H]);
  const serif = await pdf.embedFont(StandardFonts.TimesRoman);
  const serifBold = await pdf.embedFont(StandardFonts.TimesRomanBold);
  const serifBoldItalic = await pdf.embedFont(StandardFonts.TimesRomanBoldItalic);
  const italic = await pdf.embedFont(StandardFonts.TimesRomanItalic);
  const sans = await pdf.embedFont(StandardFonts.Helvetica);
  const sansBold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const WHITE = rgb(1, 1, 1);

  const centerAt = (cx: number, text: string, y: number, size: number, font = serif, color = FOREST) => {
    const w = font.widthOfTextAtSize(text, size);
    page.drawText(text, { x: cx - w / 2, y, size, font, color });
  };
  const spaced = (cx: number, text: string, y: number, size: number, font = sansBold, color = LEAF, gap = 4) => {
    const total = [...text].reduce((n, ch) => n + font.widthOfTextAtSize(ch, size) + gap, -gap);
    let x = cx - total / 2;
    for (const ch of text) { page.drawText(ch, { x, y, size, font, color }); x += font.widthOfTextAtSize(ch, size) + gap; }
  };

  // Page + green sidebar
  page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: WHITE });
  page.drawRectangle({ x: 0, y: 0, width: SB, height: H, color: FOREST });
  page.drawRectangle({ x: SB, y: 0, width: 5, height: H, color: LIME });
  for (const [r, op] of [[150, 0.05], [105, 0.07], [60, 0.09]] as const)
    page.drawCircle({ x: 20, y: 70, size: r, color: WHITE, opacity: op });
  page.drawCircle({ x: 10, y: H - 10, size: 60, color: LEAF, opacity: 0.45 });

  // Logo tile + organisation name
  page.drawRectangle({ x: 25, y: 405, width: 120, height: 120, color: WHITE });
  page.drawRectangle({ x: 25, y: 405, width: 120, height: 120, borderColor: LIME, borderWidth: 2 });
  const logoBytes = await loadLogo(new URL(req.url).origin);
  if (logoBytes) {
    try {
      const logo = await pdf.embedJpg(logoBytes);
      page.drawImage(logo, { x: 33, y: 413, width: 104, height: 104 });
    } catch {}
  }
  centerAt(85, "VTO GREENFORCE", 372, 12, sansBold, WHITE);
  centerAt(85, "FOUNDATION", 356, 12, sansBold, WHITE);
  centerAt(85, "AFRICA", 340, 12, sansBold, LIME);
  page.drawLine({ start: { x: 55, y: 326 }, end: { x: 115, y: 326 }, thickness: 1.5, color: LIME });
  centerAt(85, "Ghana  ·  The Gambia", 308, 9, italic, rgb(0.8, 0.9, 0.82));
  centerAt(85, "greenforceafrica.com", 40, 9, sans, rgb(0.8, 0.9, 0.82));

  // Frame with corner accents
  const fx = SB + 24, fy = 24, fw = W - SB - 48, fh = H - 48;
  page.drawRectangle({ x: fx, y: fy, width: fw, height: fh, borderColor: LIME, borderWidth: 1 });
  const L = 26;
  for (const [x, y, dx, dy] of [[fx, fy, 1, 1], [fx + fw, fy, -1, 1], [fx, fy + fh, 1, -1], [fx + fw, fy + fh, -1, -1]] as const) {
    page.drawLine({ start: { x, y }, end: { x: x + dx * L, y }, thickness: 3.5, color: LEAF });
    page.drawLine({ start: { x, y }, end: { x, y: y + dy * L }, thickness: 3.5, color: LEAF });
  }

  // Title
  centerAt(CX, "Certificate", 448, 58, serifBold, FOREST);
  page.drawLine({ start: { x: CX - 150, y: 424 }, end: { x: CX - 70, y: 424 }, thickness: 1.2, color: LIME });
  page.drawLine({ start: { x: CX + 70, y: 424 }, end: { x: CX + 150, y: 424 }, thickness: 1.2, color: LIME });
  spaced(CX, "OF SERVICE", 419, 14, sansBold, LEAF, 5);

  // Recipient
  centerAt(CX, "This certificate is proudly presented to", 372, 15, italic, GREY);
  let nameSize = 44;
  while (serifBoldItalic.widthOfTextAtSize(name, nameSize) > fw - 60 && nameSize > 24) nameSize -= 2;
  centerAt(CX, name, 318, nameSize, serifBoldItalic, FOREST);
  page.drawLine({ start: { x: CX - 190, y: 304 }, end: { x: CX + 190, y: 304 }, thickness: 0.8, color: LIME });
  page.drawLine({ start: { x: CX - 40, y: 304 }, end: { x: CX + 40, y: 304 }, thickness: 3, color: LEAF });

  // Citation
  centerAt(CX, `in recognition of faithful and dedicated service as a volunteer${track ? ` in ${track}` : ""},`, 266, 14.5, serif, GREY);
  centerAt(CX, "and for generously giving their time in support of school greenhouses,", 245, 14.5, serif, GREY);
  centerAt(CX, "education and community care in Ghana and The Gambia.", 224, 14.5, serif, GREY);

  // Footer: date + ID (left), seal (right)
  const dateText = issued.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  page.drawText("DATE ISSUED", { x: fx + 30, y: 115, size: 8, font: sansBold, color: LEAF });
  page.drawText(dateText, { x: fx + 30, y: 98, size: 13, font: serifBold, color: FOREST });
  page.drawText("CERTIFICATE ID", { x: fx + 30, y: 72, size: 8, font: sansBold, color: LEAF });
  page.drawText(serial, { x: fx + 30, y: 56, size: 12, font: sans, color: FOREST });

  const sx = fx + fw - 80, sy = 98;
  page.drawCircle({ x: sx, y: sy, size: 44, color: LEAF });
  page.drawCircle({ x: sx, y: sy, size: 38, borderColor: WHITE, borderWidth: 1.5 });
  page.drawCircle({ x: sx, y: sy, size: 33, borderColor: LIME, borderWidth: 0.8 });
  page.drawLine({ start: { x: sx - 12, y: sy + 2 }, end: { x: sx - 3, y: sy - 8 }, thickness: 4, color: WHITE });
  page.drawLine({ start: { x: sx - 3, y: sy - 8 }, end: { x: sx + 14, y: sy + 12 }, thickness: 4, color: WHITE });
  centerAt(sx, "VERIFIED", sy - 26, 6.5, sansBold, WHITE);

  const verify = `Verify this certificate at greenforceafrica.com/certificate/${token}`;
  centerAt(CX, verify, 38, 8, sans, GREY);

  const bytes = await pdf.save();
  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="Greenforce-Certificate-${name.replace(/[^a-zA-Z0-9]+/g, "-")}.pdf"`,
      "X-Robots-Tag": "noindex",
    },
  });
}
