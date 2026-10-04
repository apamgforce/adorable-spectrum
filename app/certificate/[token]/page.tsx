import { notFound } from "next/navigation";
import { sql, ensureSchema } from "../../lib/volunteer-db";
import PrintButton from "./PrintButton";

export const dynamic = "force-dynamic";

export default async function CertificatePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  await ensureSchema();
  const [c] = await sql`
    SELECT c.kind, c.issued_at, c.tasks_done, c.token, v.name, v.track, v.code,
      (SELECT MIN(created_at) FROM vol_assignments WHERE volunteer_id = v.id) AS since
    FROM vol_certificates c JOIN vol_volunteers v ON v.id = c.volunteer_id
    WHERE c.token = ${token}`;
  if (!c) notFound();

  const honour = c.kind === "honour";
  const date = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const serial = `GF-${String(c.token).slice(0, 8).toUpperCase()}`;

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 bg-mist flex flex-col items-center gap-6 print:p-0 print:bg-white">
      <div className="w-full max-w-4xl aspect-[1.414/1] bg-cream relative shadow-2xl print:shadow-none" style={{ border: "14px double #c9a227" }}>
        <div className="absolute inset-3 border border-gold/40 flex flex-col items-center justify-center text-center px-6 sm:px-16">
          <p className="text-[10px] sm:text-xs tracking-[0.35em] uppercase text-sage">VTO Greenforce Foundation Africa</p>
          <h1 className="font-display text-3xl sm:text-6xl text-forest mt-2 sm:mt-4 leading-tight">
            Certificate of {honour ? "Honour" : "Service"}
          </h1>
          <div className="w-24 h-px bg-gold my-3 sm:my-6" />
          <p className="text-xs sm:text-sm text-slate-500">This certificate is proudly presented to</p>
          <p className="font-headline text-2xl sm:text-5xl text-forest mt-2 sm:mt-4">{c.name}</p>
          <p className="text-xs sm:text-base text-slate-600 mt-3 sm:mt-6 max-w-xl leading-relaxed">
            {honour
              ? "in honour of outstanding dedication and exceptional service as a volunteer"
              : "in recognition of faithful and dedicated service as a volunteer"}
            {c.track ? ` in ${c.track}` : ""}, having completed {c.tasks_done} tasks in support of school greenhouses,
            education and community care in Ghana and The Gambia.
          </p>
          <div className="flex justify-between items-end w-full mt-6 sm:mt-12 text-[10px] sm:text-xs text-slate-500">
            <div className="text-center"><div className="w-28 sm:w-44 border-t border-slate-400 pt-1">Programme Coordinator</div></div>
            <div className="text-center">
              <p>Issued {date(c.issued_at)}</p>
              <p className="font-mono mt-0.5">{serial}</p>
            </div>
            <div className="text-center"><div className="w-28 sm:w-44 border-t border-slate-400 pt-1">Founder</div></div>
          </div>
        </div>
      </div>
      <PrintButton />
      <p className="no-print text-xs text-slate-400">Certificate ID {serial} · Verified by VTO Greenforce Foundation Africa</p>
    </main>
  );
}
