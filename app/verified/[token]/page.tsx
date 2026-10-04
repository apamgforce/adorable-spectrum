import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck } from "lucide-react";
import { sql, ensureSchema } from "../../lib/volunteer-db";

export const dynamic = "force-dynamic";

async function load(token: string) {
  if (token === "sample") return { name: "Sample Volunteer", track: "Social Media Posting", since: new Date().toISOString(), cert: null as string | null };
  await ensureSchema();
  const [c] = await sql`
    SELECT v.name, v.track, COALESCE(v.approved_at, v.created_at) AS since,
      (SELECT token FROM vol_certificates WHERE volunteer_id = v.id) AS cert
    FROM vol_volunteers v WHERE v.badge_token = ${token} AND v.status = 'active'`;
  return c || null;
}

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const { token } = await params;
  const c = await load(token);
  if (!c) return { title: "Verification" };
  const title = `${c.name} is a Greenforce Verified Volunteer`;
  const description = "Verified volunteer with VTO Greenforce Foundation Africa, serving school greenhouses, education and community care.";
  const image = `/verified/${token}/badge`;
  return {
    title,
    description,
    openGraph: { title, description, images: [{ url: image, width: 1080, height: 1080 }], type: "website" },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function VerifiedPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const c = await load(token);
  if (!c) notFound();
  const date = new Date(c.since).toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  return (
    <main className="min-h-screen pt-28 pb-16 px-6 bg-gradient-to-b from-mist to-cream flex flex-col items-center text-center">
      <div className="max-w-md w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/verified/${token}/badge`} alt="Greenforce Verified Volunteer badge" className="w-72 h-72 mx-auto rounded-full shadow-2xl" />
        <p className="mt-8 inline-flex items-center gap-2 text-leaf text-base font-medium"><BadgeCheck size={20} /> Verified</p>
        <h1 className="font-display text-4xl text-forest mt-2">{c.name}</h1>
        <p className="text-lg text-slate-600 mt-3">is a verified volunteer with VTO Greenforce Foundation Africa{c.track ? `, serving in ${c.track}` : ""}.</p>
        <p className="text-base text-slate-500 mt-2">Verified since {date}</p>
        {c.cert && <Link href={`/certificate/${c.cert}`} className="btn-shimmer inline-block mt-8 px-8 py-4 rounded-xl text-white text-lg font-medium">View certificate</Link>}
        <p className="text-sm text-slate-400 mt-6">This page confirms the volunteer&apos;s record with the foundation.</p>
      </div>
    </main>
  );
}
