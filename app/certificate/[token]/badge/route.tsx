import { ImageResponse } from "next/og";
import { sql, ensureSchema } from "../../../lib/volunteer-db";

export const dynamic = "force-dynamic";

async function logoDataUri(origin: string): Promise<string | null> {
  try {
    const r = await fetch(`${origin}/logo.jpg`);
    if (!r.ok) return null;
    return `data:image/jpeg;base64,${Buffer.from(await r.arrayBuffer()).toString("base64")}`;
  } catch {
    return null;
  }
}

async function boldFont(): Promise<ArrayBuffer | null> {
  try {
    const r = await fetch("https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-normal.woff");
    return r.ok ? await r.arrayBuffer() : null;
  } catch {
    return null;
  }
}

// Shareable 1080x1080 PNG badge for volunteers who hold a certificate.
export async function GET(req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  let name = "Sample Volunteer", issued = new Date(), serial = "GF-SAMPLE00";

  if (token !== "sample") {
    await ensureSchema();
    const [c] = await sql`
      SELECT c.issued_at, c.token, v.name FROM vol_certificates c
      JOIN vol_volunteers v ON v.id = c.volunteer_id WHERE c.token = ${token}`;
    if (!c) return new Response("Not found", { status: 404 });
    name = c.name; issued = new Date(c.issued_at); serial = `GF-${String(c.token).slice(0, 8).toUpperCase()}`;
  }

  const [logo, font] = await Promise.all([logoDataUri(new URL(req.url).origin), boldFont()]);
  const month = issued.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  const nameSize = name.length > 26 ? 44 : name.length > 18 ? 54 : 66;
  const fontFamily = font ? "Inter" : "sans-serif";

  return new ImageResponse(
    (
      <div style={{ width: 1080, height: 1080, display: "flex", alignItems: "center", justifyContent: "center", background: "#f3f8f3", fontFamily }}>
        <div style={{ width: 960, height: 960, borderRadius: 480, background: "#7bc47f", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 930, height: 930, borderRadius: 465, background: "#1a3d1f", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 860, height: 860, borderRadius: 430, border: "4px solid #4a8c52", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 70px" }}>
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logo} width={170} height={170} alt="" style={{ borderRadius: 24, border: "6px solid #ffffff", background: "#ffffff" }} />
              ) : null}
              <div style={{ display: "flex", marginTop: 26, fontSize: 70, fontWeight: 700, color: "#ffffff", letterSpacing: 6 }}>GREENFORCE</div>
              <div style={{ display: "flex", alignItems: "center", marginTop: 10 }}>
                <div style={{ display: "flex", width: 54, height: 54, borderRadius: 27, background: "#7bc47f", alignItems: "center", justifyContent: "center", marginRight: 16 }}>
                  <svg width="32" height="32" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7" stroke="#1a3d1f" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <div style={{ display: "flex", fontSize: 38, fontWeight: 700, color: "#7bc47f", letterSpacing: 4 }}>VERIFIED VOLUNTEER</div>
              </div>
              <div style={{ display: "flex", width: 160, height: 4, background: "#7bc47f", marginTop: 34, marginBottom: 34 }} />
              <div style={{ display: "flex", fontSize: nameSize, fontWeight: 700, color: "#ffffff", textAlign: "center" }}>{name}</div>
              <div style={{ display: "flex", marginTop: 22, fontSize: 28, color: "#b8deba" }}>VTO Greenforce Foundation Africa</div>
              <div style={{ display: "flex", marginTop: 8, fontSize: 24, color: "#8fbf93" }}>{month} · {serial}</div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1080,
      fonts: font ? [{ name: "Inter", data: font, weight: 700, style: "normal" }] : undefined,
      headers: { "Content-Disposition": `inline; filename="Greenforce-Verified-Volunteer-Badge.png"` },
    },
  );
}
