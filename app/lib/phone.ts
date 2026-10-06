// WhatsApp numbers arrive in many shapes: "024 123 4567", "+233241234567", "00233...", "7123456" (Gambia).
// We store them in international form ("+233241234567") so wa.me links always work.

const DEFAULT_COUNTRY = "233"; // Ghana

export function normalizeWhatsApp(raw: string | null | undefined): string | null {
  let d = String(raw || "").trim();
  if (!d) return null;
  const hadPlus = d.startsWith("+");
  d = d.replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  else if (!hadPlus) {
    if (d.length === 10 && d.startsWith("0")) d = DEFAULT_COUNTRY + d.slice(1); // Ghana local: 024xxxxxxx
    else if (d.length === 9 && /^[2-5]/.test(d)) d = DEFAULT_COUNTRY + d; // Ghana without the 0
    else if (d.length === 7) d = "220" + d; // The Gambia local
  }
  if (d.length < 8 || d.length > 15) return null;
  return "+" + d;
}

export function waLink(raw: string | null | undefined, text?: string): string | null {
  const n = normalizeWhatsApp(raw);
  if (!n) return null;
  return `https://wa.me/${n.slice(1)}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

export function prettyPhone(raw: string | null | undefined): string {
  const n = normalizeWhatsApp(raw);
  if (!n) return raw || "";
  if (n.startsWith("+233") && n.length === 13) return `+233 ${n.slice(4, 6)} ${n.slice(6, 9)} ${n.slice(9)}`;
  return n;
}
