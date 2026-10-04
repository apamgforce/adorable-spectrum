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
      <div className="w-full max-w-4xl aspect-[1.414/1] bg-white relative shadow-2xl print:shadow-none overflow-hidden flex">
        {/* Green sidebar */}
        <div className="relative w-[20%] bg-forest flex flex-col items-center pt-[8%] text-center overflow-hidden shrink-0">
          <div className="absolute -left-[40%] -bottom-[10%] w-[180%] aspect-square rounded-full bg-white/[0.06]" />
          <div className="absolute -left-[10%] bottom-[2%] w-[100%] aspect-square rounded-full bg-white/[0.08]" />
          <div className="relative bg-white p-[6%] border-2 border-lime w-[72%]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.jpg" alt="VTO Greenforce Foundation Africa" className="w-full aspect-square object-cover" />
          </div>
          <p className="relative text-[7px] sm:text-[11px] font-bold text-white mt-3 sm:mt-5 leading-snug tracking-wide">VTO GREENFORCE<br />FOUNDATION<br /><span className="text-lime">AFRICA</span></p>
          <div className="relative w-10 h-px bg-lime my-2 sm:my-3" />
          <p className="relative text-[6px] sm:text-[9px] italic text-white/70">Ghana · The Gambia</p>
          <p className="absolute bottom-3 text-[6px] sm:text-[9px] text-white/70">greenforceafrica.com</p>
        </div>
        <div className="w-1 sm:w-1.5 bg-lime shrink-0" />

        {/* Content */}
        <div className="flex-1 p-2 sm:p-5">
          <div className="relative h-full border border-lime flex flex-col items-center justify-center text-center px-4 sm:px-12">
            <span className="absolute top-0 left-0 w-4 h-4 sm:w-7 sm:h-7 border-t-[3px] border-l-[3px] border-leaf" />
            <span className="absolute top-0 right-0 w-4 h-4 sm:w-7 sm:h-7 border-t-[3px] border-r-[3px] border-leaf" />
            <span className="absolute bottom-0 left-0 w-4 h-4 sm:w-7 sm:h-7 border-b-[3px] border-l-[3px] border-leaf" />
            <span className="absolute bottom-0 right-0 w-4 h-4 sm:w-7 sm:h-7 border-b-[3px] border-r-[3px] border-leaf" />

            <h1 className="font-display text-3xl sm:text-7xl text-forest font-bold leading-none">Certificate</h1>
            <div className="flex items-center gap-2 sm:gap-3 mt-1 sm:mt-2">
              <span className="w-6 sm:w-14 h-px bg-lime" />
              <span className="text-[8px] sm:text-sm tracking-[0.4em] font-bold text-leaf">OF SERVICE</span>
              <span className="w-6 sm:w-14 h-px bg-lime" />
            </div>
            <p className="text-[9px] sm:text-base text-slate-500 italic mt-3 sm:mt-7">This certificate is proudly presented to</p>
            <p className="font-headline italic font-bold text-xl sm:text-5xl text-forest mt-1 sm:mt-2">{c.name}</p>
            <div className="relative w-3/4 h-px bg-lime mt-1 sm:mt-3"><span className="absolute left-1/2 -translate-x-1/2 -top-px w-10 sm:w-20 h-[3px] bg-leaf" /></div>
            <p className="text-[8px] sm:text-[15px] text-slate-600 mt-2 sm:mt-5 max-w-lg leading-relaxed">
              in recognition of faithful and dedicated service as a volunteer{c.track ? ` in ${c.track}` : ""}, and for generously
              giving their time in support of school greenhouses, education and community care in Ghana and The Gambia.
            </p>
            <div className="absolute bottom-2 sm:bottom-5 left-3 sm:left-8 text-left">
              <p className="text-[6px] sm:text-[9px] font-bold text-leaf">DATE ISSUED</p>
              <p className="font-display font-bold text-[9px] sm:text-sm text-forest">{date}</p>
              <p className="text-[6px] sm:text-[9px] font-bold text-leaf mt-1 sm:mt-2">CERTIFICATE ID</p>
              <p className="text-[8px] sm:text-xs text-forest">{serial}</p>
            </div>
            <div className="absolute bottom-2 sm:bottom-5 right-3 sm:right-8 w-9 h-9 sm:w-[72px] sm:h-[72px] rounded-full bg-leaf flex flex-col items-center justify-center text-white ring-2 ring-offset-0 ring-lime">
              <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-8 sm:h-8" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7" /></svg>
              <span className="text-[4px] sm:text-[8px] font-bold tracking-wider">VERIFIED</span>
            </div>
          </div>
        </div>
      </div>
      <a href={`/certificate/${token}/pdf`} className="no-print btn-shimmer px-8 py-4 rounded-xl text-white text-lg font-medium">Download PDF</a>
      <p className="no-print text-sm text-slate-500">Verified by VTO Greenforce Foundation Africa</p>
    </main>
  );
}
