import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sprout, GraduationCap, HeartHandshake, Building2, Landmark, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Partnerships | VTO Greenforce Foundation Africa",
  description:
    "Partner with VTO Greenforce Foundation Africa to advance agricultural training, dignity outreach and youth development in Ghana and The Gambia.",
  alternates: { canonical: "/partnerships" },
};

const gold = "#c9992a";
const forest = "#1e3d1a";
const sand = "#e4dccf";
const ink = "#0d0d0b";
const display = { fontFamily: "'Playfair Display', Georgia, serif" } as const;
const eyebrow = { fontFamily: "'DM Sans', sans-serif", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 500 } as const;
const body = { fontFamily: "'DM Sans', sans-serif", fontWeight: 300, lineHeight: 1.8 } as const;

const ways = [
  { icon: Sprout, title: "Agricultural Training", text: "Fund or equip the Apam Hostel Greenhouse, which trains 60 students every year in modern farming tracks." },
  { icon: HeartHandshake, title: "Dignity Outreach", text: "Sponsor monthly Dignity Packs for 35 aged individuals and widows across Gomoa West." },
  { icon: Building2, title: "Infrastructure", text: "Help build the Botsio 2-acre integrated farm: leafy green fields, poultry coops and composting stations." },
  { icon: GraduationCap, title: "Education & Mentorship", text: "Work with us to bring vocational skills, mentoring and learning resources to young people." },
  { icon: Users, title: "Volunteer Teams", text: "Send skilled volunteers or organise a group service day with our coordinators." },
  { icon: Landmark, title: "Institutional Alliances", text: "Churches, schools, councils and NGOs: co-design programmes with shared goals and open reporting." },
];

const steps = [
  { n: "01", t: "Introduce", d: "Tell us who you are and what you hope to achieve." },
  { n: "02", t: "Align", d: "We match your goals to a programme and agree scope together." },
  { n: "03", t: "Launch", d: "We deploy on the ground in Ghana or The Gambia." },
  { n: "04", t: "Report", d: "Every cedi and dalasi accounted for, with regular updates." },
];

const partners = [
  { name: "Ghana Education Service", note: "Gomoa West District. Primary state partner in Ghana." },
  { name: "Municipal Councils", note: "Local government partners in The Gambia (Banjul Region)." },
  { name: "Grassroots Church Bodies", note: "Community and ecclesiastical partners across both countries." },
];

export default function PartnershipsPage() {
  return (
    <main style={{ background: "#faf8f3", color: ink, overflowX: "hidden" }}>
      <style>{`
        .p-grid{display:grid;gap:24px;grid-template-columns:repeat(3,1fr)}
        .p-grid4{display:grid;gap:24px;grid-template-columns:repeat(4,1fr)}
        .p-card{background:#fff;border:1px solid ${sand};padding:36px;transition:transform .25s,box-shadow .25s}
        .p-card:hover{transform:translateY(-4px);box-shadow:0 14px 32px rgba(30,61,26,.1)}
        .p-btn{display:inline-flex;align-items:center;gap:10px;padding:16px 32px;background:${gold};color:#fff;text-decoration:none;font-family:'DM Sans',sans-serif;font-size:12px;letter-spacing:.18em;text-transform:uppercase;font-weight:500}
        .p-btn-ghost{background:transparent;border:1px solid rgba(255,255,255,.5)}
        @media(max-width:991px){.p-grid,.p-grid4{grid-template-columns:1fr 1fr}}
        @media(max-width:640px){.p-grid,.p-grid4{grid-template-columns:1fr}.p-sec{padding:72px 24px!important}}
      `}</style>

      <section style={{ background: forest, color: "#fff", padding: "160px 60px 110px" }} className="p-sec">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <span style={{ ...eyebrow, color: "#e8b84b" }}>Partnerships</span>
          <h1 style={{ ...display, fontSize: "clamp(40px,6vw,76px)", fontWeight: 300, lineHeight: 1.1, margin: "20px 0 28px", letterSpacing: "-0.02em" }}>
            Build lasting dignity,<br />together.
          </h1>
          <p style={{ ...body, fontSize: 18, maxWidth: 680, color: "rgba(255,255,255,.8)" }}>
            Since 2010, VTO Greenforce Foundation Africa has turned land, talent and time into lasting progress in Ghana and The Gambia. We work best alongside people and organisations who share the vision of service.
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 40 }}>
            <Link href="/contact" className="p-btn">Become a Partner <ArrowRight size={14} /></Link>
            <Link href="/projects" className="p-btn p-btn-ghost">See Our Projects</Link>
          </div>
        </div>
      </section>

      <section className="p-sec" style={{ padding: "100px 60px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <span style={{ ...eyebrow, color: gold }}>Ways to Partner</span>
          <h2 style={{ ...display, fontSize: 40, fontWeight: 300, color: forest, margin: "12px 0 48px" }}>Choose how you make impact</h2>
          <div className="p-grid">
            {ways.map(({ icon: Icon, title, text }) => (
              <div key={title} className="p-card">
                <Icon size={28} color={gold} />
                <h3 style={{ ...display, fontSize: 22, margin: "20px 0 10px" }}>{title}</h3>
                <p style={{ ...body, fontSize: 14, color: "rgba(13,13,11,.65)" }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="p-sec" style={{ background: "#fff", padding: "100px 60px", borderTop: `1px solid ${sand}`, borderBottom: `1px solid ${sand}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <span style={{ ...eyebrow, color: gold }}>How It Works</span>
          <h2 style={{ ...display, fontSize: 40, fontWeight: 300, color: forest, margin: "12px 0 48px" }}>A simple, transparent process</h2>
          <div className="p-grid4">
            {steps.map((s) => (
              <div key={s.n}>
                <div style={{ ...display, fontSize: 48, color: gold, fontWeight: 300 }}>{s.n}</div>
                <h3 style={{ ...display, fontSize: 22, margin: "8px 0" }}>{s.t}</h3>
                <p style={{ ...body, fontSize: 14, color: "rgba(13,13,11,.65)" }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="p-sec" style={{ padding: "100px 60px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <span style={{ ...eyebrow, color: gold }}>Our Partners</span>
          <h2 style={{ ...display, fontSize: 40, fontWeight: 300, color: forest, margin: "12px 0 48px" }}>Trusted alliances on the ground</h2>
          <div className="p-grid">
            {partners.map((p) => (
              <div key={p.name} className="p-card">
                <h3 style={{ ...display, fontSize: 22, marginBottom: 10 }}>{p.name}</h3>
                <p style={{ ...body, fontSize: 14, color: "rgba(13,13,11,.65)" }}>{p.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: ink, color: "#fff", padding: "100px 60px", textAlign: "center" }} className="p-sec">
        <h2 style={{ ...display, fontSize: "clamp(30px,4vw,48px)", fontWeight: 300, marginBottom: 20 }}>Let&apos;s start the conversation</h2>
        <p style={{ ...body, maxWidth: 560, margin: "0 auto 36px", color: "rgba(255,255,255,.7)" }}>
          Tell us about your organisation and we will respond with a partnership proposal.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/contact" className="p-btn">Contact Us <ArrowRight size={14} /></Link>
          <a href="mailto:info@greenforceafrica.com" className="p-btn p-btn-ghost">info@greenforceafrica.com</a>
        </div>
      </section>
    </main>
  );
}
