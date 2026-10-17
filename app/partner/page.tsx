import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "../components/ContactForm";

export const metadata: Metadata = {
  title: "Partner With Us | VTO Greenforce Foundation Africa",
  description:
    "Put your name on a child's future. Fund a scholar, an exam seat, a classroom or a greenhouse with VTO Greenforce Foundation Africa.",
  alternates: { canonical: "/partner" },
};

const gold = "#c9992a";
const forest = "#1e3d1a";
const sand = "#e4dccf";
const ink = "#0d0d0b";
const display = { fontFamily: "'Playfair Display', Georgia, serif" } as const;
const eyebrow = { fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 500 } as const;
const body = { fontFamily: "'DM Sans', sans-serif", fontWeight: 300, lineHeight: 1.8 } as const;
const muted = "rgba(13,13,11,.68)";

const impact = [
  { n: "27", t: "students fully supported: fees, food, hostel and essentials." },
  { n: "10", t: "WASSCE candidates registered in 2026, up from 6 a year since 2021." },
  { n: "32", t: "widows receiving a monthly stipend." },
  { n: "2010", t: "registered in Ghana and The Gambia since." },
];

const priorities = [
  {
    t: "Scholars",
    d: "Fund a bright student's hostel place, food and essentials for a term or a full year. Your student becomes a named Scholar, writes to you, and you get an update every term.",
  },
  {
    t: "Exam Sponsors",
    d: "Pay WASSCE registration for a bright student who cannot afford the fee. When results are out, you get a report on how your candidates did.",
  },
];

const ways = [
  { t: "Your Scholars", d: "One student, a group, or a whole year group, carrying your name." },
  { t: "Your Exam Class", d: "A named group of WASSCE candidates, such as “The Fidelity Exam Class of 2027”." },
  { t: "Your Excellence Award", d: "A yearly prize in your name for the best WASSCE result among our students." },
  { t: "Your Greenhouse", d: "A greenhouse that carries your name, like ours at Botsio, where students learn farming and food production." },
  { t: "Your Classroom", d: "Help build the free school for orphans in Apam, with a plaque at the classroom door. Building materials welcome." },
  { t: "Your Reading Corner", d: "Books and maths sets for students, with a named shelf." },
  { t: "Your Care Circle", d: "Monthly stipends for a group of widows for a full year." },
  { t: "Your Health Cover", d: "NHIS registration or renewal for the widows we support." },
  { t: "Your Feeding Term", d: "Feed our students for a full school term." },
];

const receives = [
  "Your name on what you funded: a sign, a plaque or a title.",
  "Photos and a short impact report every term.",
  "A thank-you feature on our social media.",
  "A certificate of partnership with a public verification link.",
  "A place on our Supporters Wall.",
  "An invitation to the handover or award event.",
];

function SectionHead({ label, title }: { label: string; title: string }) {
  return (
    <>
      <span style={{ ...eyebrow, color: gold }}>{label}</span>
      <h2 style={{ ...display, fontSize: "clamp(30px,4vw,40px)", fontWeight: 300, color: forest, margin: "12px 0 40px" }}>{title}</h2>
    </>
  );
}

export default function PartnerPage() {
  return (
    <main style={{ background: "#faf8f3", color: ink, overflowX: "hidden" }}>
      <style>{`
        .pt-sec{padding:96px 60px;border-top:1px solid ${sand}}
        .pt-wrap{max-width:1100px;margin:0 auto}
        .pt-impact{display:grid;grid-template-columns:repeat(4,1fr);gap:40px}
        .pt-two{display:grid;grid-template-columns:1fr 1fr;gap:56px}
        .pt-ways{display:grid;grid-template-columns:1fr 1fr;column-gap:64px}
        .pt-way{padding:22px 0;border-bottom:1px solid ${sand}}
        .pt-btn{display:inline-block;padding:16px 32px;background:${gold};color:#fff;text-decoration:none;font-family:'DM Sans',sans-serif;font-size:12px;letter-spacing:.18em;text-transform:uppercase;font-weight:500}
        .pt-btn-ghost{background:transparent;border:1px solid rgba(255,255,255,.5)}
        .pt-list{list-style:none;padding:0;margin:0}
        .pt-list li{padding:14px 0;border-bottom:1px solid ${sand}}
        @media(max-width:991px){.pt-impact{grid-template-columns:1fr 1fr}}
        @media(max-width:700px){.pt-impact,.pt-two,.pt-ways{grid-template-columns:1fr}.pt-two{gap:32px}.pt-sec{padding:64px 20px}.pt-hero{padding:130px 20px 80px!important}}
      `}</style>

      {/* Hero */}
      <section className="pt-hero" style={{ background: forest, color: "#fff", padding: "160px 60px 110px" }}>
        <div className="pt-wrap">
          <span style={{ ...eyebrow, color: "#e8b84b" }}>Partner with us</span>
          <h1 style={{ ...display, fontSize: "clamp(40px,6vw,72px)", fontWeight: 300, lineHeight: 1.1, margin: "20px 0 28px", letterSpacing: "-0.02em" }}>
            Put your name on<br />a child&apos;s future.
          </h1>
          <p style={{ ...body, fontSize: 18, maxWidth: 680, color: "rgba(255,255,255,.82)" }}>
            Partner with VTO Greenforce Foundation Africa and fund something real: a scholar, an exam seat, a classroom, a greenhouse. Every partnership carries your name, and every gift comes with proof of what it did.
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 40 }}>
            <a href="#partner-form" className="pt-btn">Become a partner</a>
            <Link href="/about" className="pt-btn pt-btn-ghost">See our impact</Link>
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="pt-sec" style={{ borderTop: "none" }}>
        <div className="pt-wrap">
          <SectionHead label="Our impact" title="What your support builds on" />
          <div className="pt-impact">
            {impact.map((i) => (
              <div key={i.n}>
                <div style={{ ...display, fontSize: 56, fontWeight: 300, color: forest, lineHeight: 1 }}>{i.n}</div>
                <p style={{ ...body, fontSize: 15, color: muted, marginTop: 12 }}>{i.t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Priorities */}
      <section className="pt-sec" style={{ background: "#fff" }}>
        <div className="pt-wrap">
          <SectionHead label="Where we need you most" title="Two places your gift goes furthest" />
          <div className="pt-two">
            {priorities.map((p) => (
              <div key={p.t}>
                <h3 style={{ ...display, fontSize: 28, fontWeight: 400, color: forest, marginBottom: 12 }}>{p.t}</h3>
                <p style={{ ...body, fontSize: 16, color: muted }}>{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ways */}
      <section className="pt-sec">
        <div className="pt-wrap">
          <SectionHead label="Ways to partner" title="Choose what carries your name" />
          <div className="pt-ways">
            {ways.map((w) => (
              <div key={w.t} className="pt-way">
                <h3 style={{ ...display, fontSize: 21, fontWeight: 400, color: forest, marginBottom: 6 }}>{w.t}</h3>
                <p style={{ ...body, fontSize: 15, color: muted }}>{w.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gifts + receives */}
      <section className="pt-sec" style={{ background: "#fff" }}>
        <div className="pt-wrap pt-two">
          <div>
            <SectionHead label="Every gift counts" title="Start from GHS 200" />
            <p style={{ ...body, fontSize: 16, color: muted }}>
              Every amount goes to something specific: a learning kit, a month of care for a widow, an exam seat, a hostel term or a full scholar year. Individuals, small businesses and companies are all welcome.
            </p>
          </div>
          <div>
            <SectionHead label="What every partner receives" title="Proof, and your name on it" />
            <ul className="pt-list">
              {receives.map((r) => (
                <li key={r} style={{ ...body, fontSize: 15, color: muted }}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Form */}
      <section id="partner-form" className="pt-sec" style={{ scrollMarginTop: 64 }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm">
            <ContactForm
              heading="Let's talk about your partnership"
              intro="Tell us who you are and what you would like to fund. We will reply with the next steps."
              subjectLabel="Which area interests you?"
              subjectPlaceholder="Select an area..."
              options={[...ways.map((w) => w.t), "Not sure yet"]}
              subjectPrefix="Partnership"
              successTitle="Thank you."
              successText="Thank you for choosing to partner with us. We will get back to you shortly."
              messagePlaceholder="Tell us about your organisation and what you have in mind..."
            />
          </div>
        </div>
      </section>
    </main>
  );
}
