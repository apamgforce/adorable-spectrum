import { notFound } from "next/navigation";
import { sql, ensureSchema } from "../../lib/volunteer-db";

export const dynamic = "force-dynamic";

export default async function CertificatePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  await ensureSchema();
  const [c] = token === "sample"
    ? [{ issued_at: new Date().toISOString(), token: "SAMPLE000", name: "Sample Volunteer", track: "Social Media Posting" }]
    : await sql`
        SELECT c.issued_at, c.token, v.name, v.track
        FROM vol_certificates c JOIN vol_volunteers v ON v.id = c.volunteer_id
        WHERE c.token = ${token}`;
  if (!c) notFound();

  const date = new Date(c.issued_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const serial = `GF-${String(c.token).slice(0, 8).toUpperCase()}`;

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 bg-mist flex flex-col items-center gap-6 print:p-0 print:bg-white">
      <div className="w-full max-w-4xl aspect-[1.414/1] bg-white relative shadow-2xl print:shadow-none overflow-hidden border-[3px] border-forest">
        <div className="absolute inset-x-0 top-0 h-3 sm:h-5 bg-forest" />
        <div className="absolute inset-x-0 bottom-0 h-3 sm:h-5 bg-forest" />
        <div className="absolute inset-3 sm:inset-6 border border-lime flex flex-col items-center justify-center text-center px-6 sm:px-16">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.jpg" alt="VTO Greenforce Foundation Africa" className="w-12 h-12 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-leaf" />
          <p className="text-[9px] sm:text-sm tracking-[0.3em] uppercase text-leaf mt-2 sm:mt-3 font-medium">VTO Greenforce Foundation Africa</p>
          <h1 className="font-display text-3xl sm:text-6xl text-forest mt-1 sm:mt-3 leading-tight font-semibold">Certificate of Service</h1>
          <div className="w-24 h-0.5 bg-lime my-2 sm:my-4" />
          <p className="text-[10px] sm:text-base text-slate-500 italic">This certificate is proudly presented to</p>
          <p className="font-headline text-2xl sm:text-5xl text-forest mt-1 sm:mt-3">{c.name}</p>
          <p className="text-[10px] sm:text-lg text-slate-600 mt-2 sm:mt-5 max-w-2xl leading-relaxed">
            in recognition of faithful and dedicated service as a volunteer{c.track ? ` in ${c.track}` : ""}, and for generously
            giving their time in support of school greenhouses, education and community care in Ghana and The Gambia.
          </p>
          <div className="mt-3 sm:mt-8 text-[9px] sm:text-sm text-slate-500">
            <p>Issued {date}</p>
            <p className="font-mono mt-0.5">Certificate ID {serial}</p>
          </div>
        </div>
      </div>
      <a href={`/certificate/${token}/pdf`} className="no-print btn-shimmer px-8 py-4 rounded-xl text-white text-lg font-medium">Download PDF</a>
      <p className="no-print text-sm text-slate-500">Verified by VTO Greenforce Foundation Africa</p>
    </main>
  );
}
