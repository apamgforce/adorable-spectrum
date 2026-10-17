import type { Metadata } from "next";
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
  { n: "27", t: "students housed, fed and kept in school" },
  { n: "40", t: "WASSCE candidates registered since 2021" },
  { n: "32", t: "widows on a monthly stipend" },
  { n: "16", t: "years of service in Ghana and The Gambia" },
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

function SectionHead({ label, title, light }: { label: string; title: string; light?: boolean }) {
  return (
    <>
      <span style={{ ...eyebrow, color: light ? "#e8b84b" : gold }}>{label}</span>
      <h2 style={{ ...display, fontSize: "clamp(30px,4.2vw,46px)", fontWeight: 300, lineHeight: 1.15, color: light ? "#fff" : forest, margin: "14px 0 36px" }}>{title}</h2>
    </>
  );
}

export default function PartnerPage() {
  return (
    <main style={{ background: "#faf8f3", color: ink, overflowX: "hidden" }}>
      <style>{`
        .pt-sec{padding:110px 60px}
        .pt-wrap{max-width:1100px;margin:0 auto}
        .pt-impact{display:grid;grid-template-columns:repeat(4,1fr);gap:40px}
        .pt-two{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center}
        .pt-ways{display:grid;grid-template-columns:1fr 1fr;column-gap:64px}
        .pt-way{padding:24px 0;border-bottom:1px solid ${sand}}
        .pt-btn{display:inline-block;padding:16px 32px;background:${gold};color:#fff;text-decoration:none;font-family:'DM Sans',sans-serif;font-size:12px;letter-spacing:.18em;text-transform:uppercase;font-weight:500;transition:opacity .2s}
        .pt-btn:hover{opacity:.88}
        .pt-btn-ghost{background:transparent;border:1px solid rgba(255,255,255,.6)}
        .pt-photo{width:100%;height:100%;min-height:440px;object-fit:cover;display:block}
        .pt-list{list-style:none;padding:0;margin:0}
        .pt-list li{padding:14px 0;border-bottom:1px solid ${sand}}
        .pt-drop::first-letter{float:left;font-family:'Playfair Display',Georgia,serif;font-size:64px;line-height:.9;padding:6px 10px 0 0;color:${gold}}
        @media(max-width:991px){.pt-impact{grid-template-columns:1fr 1fr}}
        @media(max-width:760px){.pt-impact,.pt-two,.pt-ways{grid-template-columns:1fr}.pt-two{gap:36px}.pt-sec{padding:72px 20px}.pt-hero{padding:140px 20px 90px!important;min-height:auto!important}.pt-photo{min-height:300px}}
      `}</style>

      {/* Hero */}
      <section
        className="pt-hero"
        style={{
          position: "relative",
          minHeight: "92vh",
          display: "flex",
          alignItems: "flex-end",
          padding: "160px 60px 110px",
          color: "#fff",
          backgroundImage: `linear-gradient(to top, rgba(14,30,12,.92) 10%, rgba(14,30,12,.45) 60%, rgba(14,30,12,.25)), url(/hostellers.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
        }}
      >
        <div className="pt-wrap" style={{ width: "100%" }}>
          <span style={{ ...eyebrow, color: "#e8b84b" }}>Partner with us</span>
          <h1 style={{ ...display, fontSize: "clamp(40px,6.4vw,80px)", fontWeight: 300, lineHeight: 1.08, margin: "20px 0 28px", letterSpacing: "-0.02em", maxWidth: 900 }}>
            Some of Ghana&apos;s brightest children are <em style={{ color: "#e8b84b" }}>one fee away</em> from their future.
          </h1>
          <p style={{ ...body, fontSize: 19, maxWidth: 640, color: "rgba(255,255,255,.88)" }}>
            A bed. A meal. An exam seat. Put your name on the moment a child&apos;s life turns.
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 40 }}>
            <a href="#partner-form" className="pt-btn">Become a partner</a>
            <a href="#ways" className="pt-btn pt-btn-ghost">See how you can help</a>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="pt-sec">
        <div className="pt-wrap pt-two">
          <div>
            <SectionHead label="Why this matters" title="Talent is everywhere. Opportunity is not." />
            <p className="pt-drop" style={{ ...body, fontSize: 17, color: muted, marginBottom: 20 }}>
              In Gomoa West, a student can study hard, pass every test, and still miss the exam that decides their whole future, because the registration fee never came.
            </p>
            <p style={{ ...body, fontSize: 17, color: muted, marginBottom: 20 }}>
              We refuse to let that be the end of the story. We pay the fee. We give them a bed, food and a quiet place to learn. And we walk with them all the way to the exam hall.
            </p>
            <p style={{ ...body, fontSize: 17, color: muted }}>
              We do this quietly, every year, since 2010. Now we are asking you to stand with us.
            </p>
          </div>
          <img src="/students.jpg" alt="Students in a GreenForce-supported classroom" className="pt-photo" />
        </div>
      </section>

      {/* Impact */}
      <section className="pt-sec" style={{ background: forest, color: "#fff" }}>
        <div className="pt-wrap">
          <SectionHead label="What love has already done" title="Small gifts. Changed lives." light />
          <div className="pt-impact">
            {impact.map((i) => (
              <div key={i.t} style={{ borderTop: "1px solid rgba(255,255,255,.2)", paddingTop: 24 }}>
                <div style={{ ...display, fontSize: "clamp(48px,6vw,68px)", fontWeight: 300, color: "#e8b84b", lineHeight: 1 }}>{i.n}</div>
                <p style={{ ...body, fontSize: 15, color: "rgba(255,255,255,.78)", marginTop: 14 }}>{i.t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Greenhouse */}
      <section className="pt-sec" style={{ background: "#fff" }}>
        <div className="pt-wrap pt-two">
          <img src="/greenhouse.png" alt="The GreenForce greenhouse at Botsio" className="pt-photo" />
          <div>
            <SectionHead label="The Botsio greenhouse" title="Where the soil feeds the school." />
            <p style={{ ...body, fontSize: 17, color: muted, marginBottom: 20 }}>
              At Botsio, our greenhouse grows the food our students eat. It also teaches them to grow it themselves, so a child who once went hungry leaves with a skill no one can take away.
            </p>
            <p style={{ ...body, fontSize: 17, color: muted }}>
              Partner here, and the greenhouse carries your name. Every harvest feeds a child today and trains a farmer for tomorrow.
            </p>
          </div>
        </div>
      </section>

      {/* Priorities */}
      <section className="pt-sec">
        <div className="pt-wrap">
          <SectionHead label="Where we need you most" title="Two gifts that change everything" />
          <div className="pt-two" style={{ alignItems: "start" }}>
            {priorities.map((p) => (
              <div key={p.t} style={{ borderLeft: `2px solid ${gold}`, paddingLeft: 28 }}>
                <h3 style={{ ...display, fontSize: 30, fontWeight: 400, color: forest, marginBottom: 12 }}>{p.t}</h3>
                <p style={{ ...body, fontSize: 16, color: muted }}>{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section
        style={{
          padding: "140px 20px",
          textAlign: "center",
          color: "#fff",
          backgroundImage: `linear-gradient(rgba(14,30,12,.78), rgba(14,30,12,.78)), url(/hero.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <p style={{ ...display, fontSize: "clamp(26px,3.6vw,42px)", fontWeight: 300, fontStyle: "italic", maxWidth: 820, margin: "0 auto", lineHeight: 1.35 }}>
          &ldquo;He that hath pity upon the poor lendeth unto the Lord.&rdquo;
        </p>
        <span style={{ ...eyebrow, color: "#e8b84b", display: "block", marginTop: 24 }}>Proverbs 19:17</span>
      </section>

      {/* Ways */}
      <section id="ways" className="pt-sec" style={{ scrollMarginTop: 64 }}>
        <div className="pt-wrap">
          <SectionHead label="Ways to partner" title="Choose what carries your name" />
          <div className="pt-ways">
            {ways.map((w) => (
              <div key={w.t} className="pt-way">
                <h3 style={{ ...display, fontSize: 22, fontWeight: 400, color: forest, marginBottom: 6 }}>{w.t}</h3>
                <p style={{ ...body, fontSize: 15, color: muted }}>{w.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gifts + receives */}
      <section className="pt-sec" style={{ background: "#fff" }}>
        <div className="pt-wrap pt-two" style={{ alignItems: "start" }}>
          <div>
            <SectionHead label="Every gift counts" title="It starts with GHS 200." />
            <p style={{ ...body, fontSize: 17, color: muted, marginBottom: 20 }}>
              A learning kit. A month of care for a widow. An exam seat. A hostel term. A full scholar year. Every cedi goes to something you can see.
            </p>
            <p style={{ ...body, fontSize: 17, color: muted }}>
              Individuals, families, churches, small businesses and companies are all welcome.
            </p>
          </div>
          <div>
            <SectionHead label="What every partner receives" title="Proof, and your name on it." />
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
          <p style={{ ...display, fontSize: "clamp(26px,3.4vw,36px)", fontWeight: 300, color: forest, textAlign: "center", marginBottom: 40, lineHeight: 1.3 }}>
            One child. One name. One decision.<br /><em style={{ color: gold }}>Let it be yours.</em>
          </p>
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
