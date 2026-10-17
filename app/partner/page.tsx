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
        .pt-wrap{max-width:1200px;margin:0 auto}
        .pt-impact{display:grid;grid-template-columns:repeat(4,1fr);gap:40px}
        .pt-two{display:grid;grid-template-columns:1fr 1fr;gap:72px;align-items:center}
        .pt-ways{display:grid;grid-template-columns:1fr 1fr;column-gap:80px}
        .pt-way{display:flex;gap:28px;padding:36px 0;border-bottom:1px solid ${sand}}
        .pt-way-n{font-family:'Playfair Display',Georgia,serif;font-size:52px;font-weight:300;line-height:1;color:${gold};min-width:72px}
        .pt-way h3{font-family:'Playfair Display',Georgia,serif;font-size:clamp(26px,2.6vw,34px);font-weight:400;color:${forest};line-height:1.15;margin:0 0 10px}
        .pt-way p{font-family:'DM Sans',sans-serif;font-weight:300;font-size:18px;line-height:1.7;color:${muted};margin:0}
        .pt-big{font-family:'DM Sans',sans-serif;font-weight:300;font-size:clamp(19px,1.7vw,22px);line-height:1.75;color:${muted}}
        .pt-btn{display:inline-block;padding:18px 36px;background:${gold};color:#fff;text-decoration:none;font-family:'DM Sans',sans-serif;font-size:13px;letter-spacing:.18em;text-transform:uppercase;font-weight:500;transition:opacity .2s}
        .pt-btn:hover{opacity:.88}
        .pt-btn-ghost{background:transparent;border:1px solid rgba(255,255,255,.6)}
        .pt-photo{width:100%;height:100%;min-height:460px;object-fit:cover;display:block}
        .pt-list{list-style:none;padding:0;margin:0}
        .pt-list li{display:flex;gap:18px;padding:20px 0;border-bottom:1px solid ${sand};font-family:'DM Sans',sans-serif;font-weight:300;font-size:clamp(18px,1.6vw,21px);line-height:1.5;color:${ink}}
        .pt-list li::before{content:"";flex:none;width:10px;height:10px;margin-top:10px;border-radius:50%;background:${gold}}
        @media(max-width:991px){.pt-impact{grid-template-columns:1fr 1fr}.pt-ways{column-gap:48px}}
        @media(max-width:760px){.pt-impact,.pt-two,.pt-ways{grid-template-columns:1fr}.pt-two{gap:40px}.pt-sec{padding:72px 20px}.pt-hero{padding:140px 20px 90px!important;min-height:auto!important}.pt-photo{min-height:300px}.pt-way{gap:18px;padding:28px 0}.pt-way-n{font-size:40px;min-width:52px}}
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
          <span style={{ ...eyebrow, fontSize: 13, color: "#e8b84b" }}>Partner with us</span>
          <h1 style={{ ...display, fontSize: "clamp(42px,6.6vw,84px)", fontWeight: 300, lineHeight: 1.06, margin: "20px 0 28px", letterSpacing: "-0.02em", maxWidth: 950 }}>
            Some of Ghana&apos;s brightest children are <em style={{ color: "#e8b84b" }}>one fee away</em> from their future.
          </h1>
          <p style={{ ...body, fontSize: "clamp(19px,1.8vw,23px)", maxWidth: 660, color: "rgba(255,255,255,.9)" }}>
            A bed. A meal. An exam seat. Put your name on the moment a child&apos;s life turns.
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 40 }}>
            <a href="#ways" className="pt-btn">Choose your gift</a>
            <a href="#partner-form" className="pt-btn pt-btn-ghost">Talk to us</a>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="pt-sec">
        <div className="pt-wrap pt-two">
          <div>
            <span style={{ ...eyebrow, fontSize: 13, color: gold }}>Why this matters</span>
            <h2 style={{ ...display, fontSize: "clamp(36px,4.8vw,58px)", fontWeight: 300, lineHeight: 1.1, color: forest, margin: "16px 0 28px" }}>
              Talent is everywhere.<br /><em style={{ color: gold }}>Opportunity is not.</em>
            </h2>
            <p className="pt-big" style={{ marginBottom: 20 }}>
              In Gomoa West, a bright student can do everything right and still miss the exam that decides their future, because the fee never came.
            </p>
            <p className="pt-big" style={{ color: forest, fontWeight: 400 }}>
              We pay it. We give them a bed, a meal and a way to the exam hall. Stand with us.
            </p>
          </div>
          <img src="/students.jpg" alt="Students in a GreenForce-supported classroom" className="pt-photo" />
        </div>
      </section>

      {/* Ways */}
      <section id="ways" className="pt-sec" style={{ background: "#fff", scrollMarginTop: 64 }}>
        <div className="pt-wrap">
          <span style={{ ...eyebrow, fontSize: 13, color: gold }}>Ways to partner</span>
          <h2 style={{ ...display, fontSize: "clamp(40px,5.6vw,72px)", fontWeight: 300, lineHeight: 1.05, color: forest, margin: "16px 0 20px", letterSpacing: "-0.02em" }}>
            Choose what carries <em style={{ color: gold }}>your name.</em>
          </h2>
          <p className="pt-big" style={{ maxWidth: 680, marginBottom: 24 }}>
            Every gift becomes something a child can touch. Pick one, or bring your own idea.
          </p>
          <div className="pt-ways">
            {ways.map((w, i) => (
              <div key={w.t} className="pt-way">
                <span className="pt-way-n">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{w.t}</h3>
                  <p>{w.d}</p>
                </div>
              </div>
            ))}
            <div className="pt-way">
              <span className="pt-way-n">10</span>
              <div>
                <h3>Your own idea</h3>
                <p>Have something else on your heart? Tell us, and we will make it happen together.</p>
                <a href="#partner-form" style={{ display: "inline-block", marginTop: 14, color: gold, fontFamily: "'DM Sans',sans-serif", fontSize: 14, letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 500, textDecoration: "none" }}>Suggest it &rarr;</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="pt-sec" style={{ background: forest, color: "#fff" }}>
        <div className="pt-wrap">
          <SectionHead label="What love has already done" title="Small gifts. Changed lives." light />
          <div className="pt-impact">
            {impact.map((i) => (
              <div key={i.t} style={{ borderTop: "1px solid rgba(255,255,255,.2)", paddingTop: 24 }}>
                <div style={{ ...display, fontSize: "clamp(56px,7vw,84px)", fontWeight: 300, color: "#e8b84b", lineHeight: 1 }}>{i.n}</div>
                <p style={{ ...body, fontSize: 18, color: "rgba(255,255,255,.82)", marginTop: 14 }}>{i.t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Greenhouse */}
      <section className="pt-sec">
        <div className="pt-wrap pt-two">
          <img src="/greenhouse.png" alt="The GreenForce greenhouse at Botsio" className="pt-photo" />
          <div>
            <span style={{ ...eyebrow, fontSize: 13, color: gold }}>The Botsio greenhouse</span>
            <h2 style={{ ...display, fontSize: "clamp(36px,4.8vw,58px)", fontWeight: 300, lineHeight: 1.1, color: forest, margin: "16px 0 28px" }}>
              Where the soil <em style={{ color: gold }}>feeds the school.</em>
            </h2>
            <p className="pt-big" style={{ marginBottom: 20 }}>
              Our greenhouse grows the food our students eat, and teaches them to grow it themselves.
            </p>
            <p className="pt-big" style={{ color: forest, fontWeight: 400 }}>
              Partner here, and it carries your name. Every harvest feeds a child today and trains a farmer for tomorrow.
            </p>
          </div>
        </div>
      </section>

      {/* Gifts + receives */}
      <section className="pt-sec" style={{ background: "#fff" }}>
        <div className="pt-wrap pt-two" style={{ alignItems: "start" }}>
          <div>
            <span style={{ ...eyebrow, fontSize: 13, color: gold }}>Every gift counts</span>
            <h2 style={{ ...display, fontSize: "clamp(40px,5.6vw,72px)", fontWeight: 300, lineHeight: 1.05, color: forest, margin: "16px 0 28px", letterSpacing: "-0.02em" }}>
              It starts with <em style={{ color: gold }}>GHS&nbsp;200.</em>
            </h2>
            <p className="pt-big" style={{ marginBottom: 20 }}>
              A learning kit. A month of care for a widow. An exam seat. A hostel term. A full scholar year. Every cedi goes to something you can see.
            </p>
            <p className="pt-big" style={{ color: forest, fontWeight: 400 }}>
              Individuals, families, churches, small businesses and companies are all welcome.
            </p>
          </div>
          <div>
            <span style={{ ...eyebrow, fontSize: 13, color: gold }}>What every partner receives</span>
            <h2 style={{ ...display, fontSize: "clamp(36px,4.6vw,56px)", fontWeight: 300, lineHeight: 1.1, color: forest, margin: "16px 0 24px" }}>
              Proof, and <em style={{ color: gold }}>your name on it.</em>
            </h2>
            <ul className="pt-list">
              {receives.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
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
        <p style={{ ...display, fontSize: "clamp(30px,4.2vw,52px)", fontWeight: 300, fontStyle: "italic", maxWidth: 900, margin: "0 auto", lineHeight: 1.3 }}>
          &ldquo;He that hath pity upon the poor lendeth unto the Lord.&rdquo;
        </p>
        <span style={{ ...eyebrow, fontSize: 13, color: "#e8b84b", display: "block", marginTop: 24 }}>Proverbs 19:17</span>
      </section>

      {/* Form */}
      <section id="partner-form" className="pt-sec" style={{ scrollMarginTop: 64 }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{ ...display, fontSize: "clamp(32px,4.4vw,52px)", fontWeight: 300, color: forest, textAlign: "center", marginBottom: 44, lineHeight: 1.2 }}>
            One child. One name. One decision.<br /><em style={{ color: gold }}>Let it be yours.</em>
          </p>
          <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm">
            <ContactForm
              heading="Let's talk about your partnership"
              intro="Tell us who you are and what you would like to fund, or share your own idea."
              subjectLabel="Which area interests you?"
              subjectPlaceholder="Select an area..."
              options={[...ways.map((w) => w.t), "My own idea", "Not sure yet"]}
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
