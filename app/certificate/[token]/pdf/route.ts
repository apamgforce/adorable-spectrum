import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { sql, ensureSchema } from "../../../lib/volunteer-db";

export const dynamic = "force-dynamic";

const GOLD = rgb(0.788, 0.635, 0.153);
const FOREST = rgb(0.102, 0.239, 0.122);
const SAGE = rgb(0.29, 0.549, 0.322);
const GREY = rgb(0.35, 0.35, 0.35);

export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  let name = "Sample Volunteer", track: string | null = "Volunteer Service", done = 12, issued = new Date(), serial = "GF-SAMPLE00";

  if (token !== "sample") {
    await ensureSchema();
    const [c] = await sql`
      SELECT c.issued_at, c.tasks_done, c.token, v.name, v.track
      FROM vol_certificates c JOIN vol_volunteers v ON v.id = c.volunteer_id WHERE c.token = ${token}`;
    if (!c) return new Response("Not found", { status: 404 });
    name = c.name; track = c.track; done = c.tasks_done; issued = new Date(c.issued_at);
    serial = `GF-${String(c.token).slice(0, 8).toUpperCase()}`;
  }

  const pdf = await PDFDocument.create();
  const W = 842, H = 595; // A4 landscape
  const page = pdf.addPage([W, H]);
  const serif = await pdf.embedFont(StandardFonts.TimesRoman);
  const serifBold = await pdf.embedFont(StandardFonts.TimesRomanBold);
  const italic = await pdf.embedFont(StandardFonts.TimesRomanItalic);
  const sans = await pdf.embedFont(StandardFonts.Helvetica);

  page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: rgb(0.98, 0.973, 0.953) });
  page.drawRectangle({ x: 22, y: 22, width: W - 44, height: H - 44, borderColor: GOLD, borderWidth: 5 });
  page.drawRectangle({ x: 34, y: 34, width: W - 68, height: H - 68, borderColor: GOLD, borderWidth: 1 });

  const center = (text: string, y: number, size: number, font = serif, color = FOREST) => {
    const w = font.widthOfTextAtSize(text, size);
    page.drawText(text, { x: (W - w) / 2, y, size, font, color });
  };

  center("VTO GREENFORCE FOUNDATION AFRICA", 480, 13, sans, SAGE);
  center("Certificate of Service", 415, 50, serifBold, FOREST);
  page.drawLine({ start: { x: W / 2 - 60, y: 392 }, end: { x: W / 2 + 60, y: 392 }, thickness: 1.5, color: GOLD });
  center("This certificate is proudly presented to", 358, 15, italic, GREY);
  center(name, 300, 40, serifBold, FOREST);

  const line1 = "in recognition of faithful and dedicated service as a volunteer" + (track ? ` in ${track}` : "") + ",";
  const line2 = `having completed ${done} tasks in support of school greenhouses, education`;
  const line3 = "and community care in Ghana and The Gambia.";
  center(line1, 252, 15, serif, GREY);
  center(line2, 230, 15, serif, GREY);
  center(line3, 208, 15, serif, GREY);

  page.drawLine({ start: { x: 90, y: 112 }, end: { x: 270, y: 112 }, thickness: 0.8, color: GREY });
  page.drawText("Programme Coordinator", { x: 120, y: 96, size: 11, font: sans, color: GREY });
  page.drawLine({ start: { x: W - 270, y: 112 }, end: { x: W - 90, y: 112 }, thickness: 0.8, color: GREY });
  page.drawText("Founder", { x: W - 200, y: 96, size: 11, font: sans, color: GREY });
  center(`Issued ${issued.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`, 120, 12, sans, GREY);
  center(`Certificate ID ${serial}`, 100, 10, sans, GREY);

  const bytes = await pdf.save();
  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="Greenforce-Certificate-${name.replace(/[^a-zA-Z0-9]+/g, "-")}.pdf"`,
      "X-Robots-Tag": "noindex",
    },
  });
}
