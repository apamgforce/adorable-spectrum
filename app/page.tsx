"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Heart, ChevronDown } from "lucide-react";
import WhatsAppButton from "./components/WhatsappButton";

const IMGS = {
  hero: "/hero.jpg",
  hunger: "/hunger.jpg",
  bloom: "/bloom.png",
  greenhouse: "greenhouse.png",
  harvest: "/harvest.jpg",
  kids: "hostellers.png",
  farm: "ama.png",
  community: "/community.jpg",
  ama: "https://images.unsplash.com/photo-1530099486328-e021101a494a?w=1200&q=85&auto=format&fit=crop",
  sitting: "sitting.jpg",
  founder: "founder.png",
};

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Reveal({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const { ref, visible } = useInView();
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(40px)", transition: `opacity 0.9s ease ${delay}ms, transform 0.9s ease ${delay}ms`, ...style }}>
      {children}
    </div>
  );
}

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        let current = 0; const steps = 50; const inc = target / steps;
        const t = setInterval(() => { current += inc; if (current >= target) { setN(target); clearInterval(t); } else setN(Math.floor(current)); }, 2000 / steps);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>;
}

const s = {
  eyebrow: { fontFamily: "'DM Sans', sans-serif", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase" as const, fontWeight: 500 },
  display: { fontFamily: "'Playfair Display', Georgia, serif" },
  body: { fontFamily: "'DM Sans', sans-serif", fontWeight: 300, lineHeight: 1.75 },
  ink: "#0d0d0b",
  cream: "#faf8f3",
  dust: "#f2ede3",
  sand: "#e4dccf",
  gold: "#c9992a",
  amber: "#e8b84b",
  sage: "#5a7a4a",
  moss: "#3a5c2e",
  forest: "#1e3d1a",
  white: "#ffffff",
};

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const img = new Image(); img.src = IMGS.hero; img.onload = () => setHeroLoaded(true);
  }, []);

  return (
    <main style={{ background: s.cream, overflowX: "hidden", position: "relative" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        html{scroll-behavior:smooth}
        *{margin:0;padding:0;box-sizing:border-box}
        body{overflow-x:hidden}
        img{display:block}
        a{text-decoration:none;color:inherit}
        @keyframes kenburns{0%{transform:scale(1.08)}100%{transform:scale(1)}}
        @keyframes fadein{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideup{from{opacity:0;transform:translateY(48px)}to{opacity:1;transform:translateY(0)}}
        @keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        .kb{animation:kenburns 12s ease-out forwards}
        .fi1{animation:fadein .8s ease .2s both}
        .fi2{animation:fadein .8s ease .5s both}
        .su1{animation:slideup .9s ease .3s both}
        .su2{animation:slideup .9s ease .5s both}
        .su3{animation:slideup .9s ease .7s both}
        .su4{animation:slideup .9s ease .9s both}
        .su5{animation:slideup .9s ease 1.1s both}
        .marquee-track{animation:marquee 30s linear infinite}
        .float{animation:float 4s ease-in-out infinite}
        .img-hover{transition:transform .7s ease,filter .5s ease}
        .img-hover:hover{transform:scale(1.04);filter:brightness(1.05)}
        .btn-main{display:inline-flex;align-items:center;gap:10px;background:#1e3d1a;color:#faf8f3;padding:16px 36px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;border:none;transition:all .3s;text-decoration:none}
        .btn-main:hover{background:#3a5c2e;gap:16px}
        .btn-outline{display:inline-flex;align-items:center;gap:10px;background:transparent;color:#1e3d1a;padding:16px 36px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;border:1.5px solid #1e3d1a;transition:all .3s;text-decoration:none}
        .btn-outline:hover{background:#1e3d1a;color:#faf8f3}
        .btn-gold{display:inline-flex;align-items:center;gap:10px;background:#c9992a;color:#fff;padding:16px 36px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;border:none;transition:all .3s;text-decoration:none}
        .btn-gold:hover{background:#e8b84b;gap:16px}
        .btn-ghost{display:inline-flex;align-items:center;gap:10px;background:transparent;color:rgba(255,255,255,.8);padding:16px 36px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;border:1.5px solid rgba(255,255,255,.3);transition:all .3s;text-decoration:none}
        .btn-ghost:hover{background:rgba(255,255,255,.1);color:#fff;border-color:rgba(255,255,255,.6)}
        .divider{width:48px;height:1.5px;background:#c9992a}
        .divider-sm{width:32px;height:1px;background:#c9992a}
        .intervention-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:1px}
        @media(max-width:768px){
          .hide-mobile{display:none!important}
          .hero-title{font-size:clamp(48px,10vw,80px)!important}
          .two-col{grid-template-columns:1fr!important}
          .three-col{grid-template-columns:1fr!important}
          .intervention-row{grid-template-columns:1fr!important}
          .nav-inner{padding:20px 24px!important}
          .hero-content{padding:0 24px 80px!important}
          .section-pad{padding:80px 24px!important}
          .section-pad-sm{padding:60px 24px!important}
        }
      `}</style>


      {/* ── HERO ── */}
      <br />
      <section style={{ position: "relative", height: "100vh", minHeight: 700, display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          <img src={IMGS.hero} alt="" className={heroLoaded ? "kb" : ""} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 35%" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,20,8,0.92) 0%, rgba(10,20,8,0.5) 40%, rgba(10,20,8,0.1) 100%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(10,20,8,0.5) 0%, transparent 60%)" }} />
        </div>

        <div className="hide-mobile" style={{ position: "absolute", right: 48, top: "50%", transform: "translateY(-50%) rotate(90deg)", display: "flex", alignItems: "center", gap: 16, transformOrigin: "center center" }}>
          <div style={{ width: 40, height: 1, background: "rgba(255,255,255,0.2)" }} />
          <span style={{ ...s.eyebrow, fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: "0.25em" }}>Apam · Gomoa West · Ghana</span>
        </div>

        <div className="hero-content" style={{ position: "relative", zIndex: 10, maxWidth: 1280, width: "100%", margin: "0 auto", padding: "0 60px 100px" }}>

          <div className="fi1" style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
            <div className="divider" />
            <span style={{ ...s.eyebrow, color: s.amber, fontSize: 11 }}>West Africa · Agriculture · Education</span>
          </div>

          <h1 className="hero-title su1" style={{ ...s.display, fontSize: "clamp(56px,7vw,104px)", fontWeight: 400, color: s.white, lineHeight: 1.03, marginBottom: 32, maxWidth: 760 }}>
            To be seen.<br />
            To be heard.<br />
            <em style={{ color: s.amber, fontStyle: "italic" }}>To stay in school.</em>
          </h1>

          <p className="su2" style={{ ...s.body, color: "rgba(255,255,255,0.6)", fontSize: 16, maxWidth: 480, marginBottom: 48 }}>
            We don't watch from afar. Greenforce Foundation protects the vulnerable, ensuring poverty never cuts a child's story short.
          </p>

          <div className="su3" style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            <Link href="/projects" className="btn-main">See Our Work <ArrowRight size={15} /></Link>
            <Link href="/donate" className="btn-ghost">Support a Child</Link>
          </div>

          <div className="su4 hide-mobile" style={{ display: "flex", gap: 48, marginTop: 72, paddingTop: 48, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            {[{ n: 340, s: "+", l: "Students Supported" }, { n: 87, s: "+", l: "Scholarships Active" }, { n: 12, s: "", l: "Greenhouses Built" }].map(x => (
              <div key={x.l}>
                <p style={{ ...s.display, fontSize: 36, fontWeight: 500, color: s.amber, lineHeight: 1 }}><CountUp target={x.n} suffix={x.s} /></p>
                <p style={{ ...s.eyebrow, fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 6 }}>{x.l}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <span style={{ ...s.eyebrow, fontSize: 9, color: "rgba(255,255,255,0.3)" }}>Scroll</span>
          <ChevronDown size={14} style={{ color: "rgba(255,255,255,0.3)", animation: "pulse 2s ease infinite" }} />
        </div>
      </section>


      {/* ── EDITORIAL DIPTYCH — The Problem ── */}
      <section style={{ background: s.cream }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "80vh" }} className="two-col">
          <div style={{ position: "relative", overflow: "hidden", minHeight: 560 }}>
            <img src={IMGS.hunger} alt="Child facing hunger" className="img-hover" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,10,4,0.85), transparent 50%)" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "40px 48px" }}>
              <span style={{ ...s.eyebrow, fontSize: 10, color: s.amber, display: "block", marginBottom: 12 }}>The Reality</span>
              <p style={{ ...s.display, fontSize: "clamp(22px,2.5vw,32px)", fontStyle: "italic", color: s.white, lineHeight: 1.3, fontWeight: 400 }}>
                "No child simply chooses to drift away."
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px 72px", background: s.forest }}>
            <Reveal>
              <div className="divider" style={{ marginBottom: 32 }} />
              <p style={{ ...s.display, fontSize: "clamp(28px,3vw,44px)", color: s.white, lineHeight: 1.25, fontWeight: 400, marginBottom: 28 }}>
                Potential is everywhere.<br />
                <em style={{ color: s.amber }}>Belief is rare.</em><br />We protect the spaces in between.
              </p>
              <p style={{ ...s.body, color: "rgba(255,255,255,0.5)", fontSize: 15, marginBottom: 40, maxWidth: 400 }}>
                A missed fee, an unsubmitted paper, or an empty stomach shouldn't dictate a destiny. The system forgets them quietly—one overlooked need at a time. We protect their placement, keeping paths clear so they can simply learn.
              </p>
              <Link href="/about" style={{ ...s.eyebrow, color: s.amber, display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11, transition: "gap .3s" }}
                onMouseEnter={e => (e.currentTarget.style.gap = "16px")}
                onMouseLeave={e => (e.currentTarget.style.gap = "8px")}>
                Our Origin Story <ArrowRight size={13} />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>


      {/* ── SCRIPTURE BREAK ── */}
      <section style={{ background: s.dust, padding: "100px 60px" }} className="section-pad">
        <Reveal style={{ maxWidth: 840, margin: "0 auto", textAlign: "center" }}>
          <p style={{ ...s.display, fontSize: "clamp(22px,3vw,40px)", fontStyle: "italic", fontWeight: 400, color: s.forest, lineHeight: 1.4, marginBottom: 24 }}>
            "Train up a child in the way he should go;<br />even when he is old he will not depart from it."
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <div className="divider-sm" />
            <span style={{ ...s.eyebrow, color: s.gold, fontSize: 11 }}>Proverbs 22 : 6</span>
            <div className="divider-sm" />
          </div>
          <p style={{ ...s.body, color: "rgba(30,61,26,0.5)", fontSize: 14, marginTop: 24, maxWidth: 480, margin: "24px auto 0" }}>
            This is not merely charity. It is a long-term investment in a person — from registration to graduation, from an empty stomach to a full life.
          </p>
        </Reveal>
      </section>


      {/* ── WHAT WE ACTUALLY DO — Interventions ── */}
      <section style={{ background: s.forest, padding: "120px 60px" }} className="section-pad">
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 72 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
              <div className="divider" />
              <span style={{ ...s.eyebrow, color: "rgba(232,184,75,0.6)", fontSize: 11 }}>How We Show Up</span>
            </div>
            <h2 style={{ ...s.display, fontSize: "clamp(36px,4.5vw,64px)", color: s.white, lineHeight: 1.1, fontWeight: 400, maxWidth: 700 }}>
              Every need has a name.<br />
              <em style={{ color: s.amber }}>We know them all.</em>
            </h2>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "rgba(255,255,255,0.04)" }} className="three-col">
            {[
              {
                title: "School Registration & Enrollment",
                body: "We walk students through the paperwork, fees, and bureaucracy that quietly disqualify thousands every year. A form shouldn't determine a child's future.",
                verse: "Isaiah 1:17"
              },
              {
                title: "WAEC & BECE Exam Support",
                body: "Exam registration fees, revision materials, coaching — we make sure that when the exam comes, the only thing missing is a pen. Not preparation, not funding, not confidence.",
                verse: "Prov. 2:6"
              },
              {
                title: "Hostel & Residential Support",
                body: "No hostel, no school — it's that simple for rural students. We provide and maintain residential quarters so geography doesn't end an education.",
                verse: "Ps. 68:5–6"
              },
              {
                title: "Feeding & Nutrition",
                body: "We run feeding programs directly in schools and hostels. A child who eats can think. Everything else builds on that foundation.",
                verse: "Matt. 25:35"
              },
              {
                title: "Agriculture & Vocational Skills",
                body: "Greenhouses, farm cycles, soil science, market sense. Students who grow food build discipline, earn income, and graduate with more than a certificate.",
                verse: "Prov. 12:11"
              },
              {
                title: "Community & Family Interventions",
                body: "Care for the aged, support for widows, health outreach. We don't stop at the school gate — we follow the need wherever it lives.",
                verse: "James 1:27"
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 80} style={{ background: "rgba(255,255,255,0.03)", padding: "48px 40px" }}>
                <h3 style={{ ...s.display, fontSize: 20, color: s.white, marginBottom: 16, fontWeight: 500, lineHeight: 1.25 }}>{item.title}</h3>
                <p style={{ ...s.body, color: "rgba(255,255,255,0.45)", fontSize: 14, lineHeight: 1.85, marginBottom: 28 }}>{item.body}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="divider-sm" />
                  <span style={{ ...s.eyebrow, color: "rgba(232,184,75,0.5)", fontSize: 10 }}>{item.verse}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>


      {/* ── FULL-BLEED — Scholarship / Fees ── */}
      <section style={{ position: "relative", height: "70vh", minHeight: 500, display: "flex", alignItems: "center", overflow: "hidden" }}>
        <img src={IMGS.harvest} alt="Students" className="img-hover" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, rgba(10,20,8,0.9) 0%, rgba(10,20,8,0.55) 55%, rgba(10,20,8,0.15) 100%)" }} />
        <div style={{ position: "relative", zIndex: 10, maxWidth: 1280, margin: "0 auto", padding: "0 60px", width: "100%" }} className="section-pad">
          <Reveal style={{ maxWidth: 560 }}>
            <span style={{ ...s.eyebrow, color: s.amber, display: "block", marginBottom: 20 }}>Education Sponsorship</span>
            <h2 style={{ ...s.display, fontSize: "clamp(32px,4vw,60px)", color: s.white, lineHeight: 1.15, fontWeight: 400, marginBottom: 24 }}>
              Some children can't<br />afford to dream.
              <em style={{ color: s.amber, display: "block", marginTop: 4 }}>We change that.</em>
            </h2>
            <p style={{ ...s.body, color: "rgba(255,255,255,0.55)", fontSize: 15, marginBottom: 24, maxWidth: 440 }}>
              School fees. Uniforms. Books. Exam registration. Hostel accommodation. We cover what families cannot, because none of these should be the reason a bright child stays home.
            </p>
            <p style={{ ...s.body, color: "rgba(255,255,255,0.35)", fontSize: 14, marginBottom: 40, maxWidth: 440 }}>
              87 students are currently under active sponsorship. There are hundreds more waiting.
            </p>
            <Link href="/donate" className="btn-gold">Sponsor a Child <Heart size={14} /></Link>
          </Reveal>
        </div>
      </section>


      {/* ── STATS ROW ── */}
      <section style={{ background: s.forest, padding: "100px 60px" }} className="section-pad">
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 80 }}>
            <span style={{ ...s.eyebrow, color: "rgba(232,184,75,0.6)", display: "block", marginBottom: 16 }}>The Impact So Far</span>
            <h2 style={{ ...s.display, fontSize: "clamp(32px,4vw,56px)", color: s.white, fontWeight: 400 }}>Numbers that breathe.</h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1px", background: "rgba(255,255,255,0.06)" }} className="two-col">
            {[
              { n: 340, suf: "+", label: "Students Supported", sub: "fees, hostel, feeding & skills" },
              { n: 87, suf: "+", label: "Active Scholarships", sub: "full & partial sponsorships" },
              { n: 12, suf: "", label: "Greenhouses Built", sub: "in schools & hostels" },
              { n: 5, suf: "", label: "Communities", sub: "Apam, Gomoa West & beyond" },
            ].map((st, i) => (
              <Reveal key={st.label} delay={i * 100} style={{ background: s.forest, padding: "52px 40px", textAlign: "center" }}>
                <p style={{ ...s.display, fontSize: "clamp(48px,5vw,80px)", fontWeight: 500, color: s.amber, lineHeight: 1, marginBottom: 12 }}>
                  <CountUp target={st.n} suffix={st.suf} />
                </p>
                <p style={{ ...s.eyebrow, color: s.white, fontSize: 12, marginBottom: 8 }}>{st.label}</p>
                <p style={{ ...s.body, color: "rgba(255,255,255,0.35)", fontSize: 12 }}>{st.sub}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>


      {/* ── THREE PILLARS — Programs ── */}
      <section style={{ background: s.cream, padding: "120px 60px" }} className="section-pad">
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>

          <Reveal style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 72, flexWrap: "wrap", gap: 24 }}>
            <div>
              <span style={{ ...s.eyebrow, color: s.sage, display: "block", marginBottom: 16 }}>Our Programs</span>
              <h2 style={{ ...s.display, fontSize: "clamp(36px,4.5vw,64px)", color: s.forest, lineHeight: 1.1, fontWeight: 400 }}>
                The full picture.<br /><em>One foundation.</em>
              </h2>
            </div>
            <Link href="/projects" style={{ ...s.eyebrow, color: s.moss, fontSize: 11, display: "flex", alignItems: "center", gap: 8 }}>
              All Projects <ArrowRight size={13} />
            </Link>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2 }} className="three-col">
            {[
              {
                img: IMGS.kids,
                no: "01",
                tag: "Education",
                title: "Full Student Support",
                sub: "From the day a student enrolls to the day they sit their finals — fees, registration, materials, hostel, and ongoing mentorship. We plug every gap the system leaves.",
                verse: "Prov. 22:6"
              },
              {
                img: IMGS.greenhouse,
                no: "02",
                tag: "Agriculture",
                title: "School Greenhouses",
                sub: "Productive greenhouse environments built behind school residential quarters. Students farm through full cycles — seedling, harvest, market — and their dining halls eat the results.",
                verse: "Prov. 12:11"
              },
              {
                img: IMGS.community,
                no: "03",
                tag: "Community",
                title: "Community & Family Care",
                sub: "Care for the aged, support for widows, health interventions, sport, and evangelism. We believe a child's dignity is inseparable from the dignity of the community around them.",
                verse: "James 1:27"
              },
            ].map((card, i) => (
              <Reveal key={card.no} delay={i * 120}>
                <div style={{ background: s.white, overflow: "hidden", height: "100%" }}>
                  <div style={{ position: "relative", height: 320, overflow: "hidden" }}>
                    <img src={card.img} alt={card.title} className="img-hover" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,20,8,0.6), transparent 60%)" }} />
                    <div style={{ position: "absolute", top: 24, left: 24, background: "rgba(10,20,8,0.5)", backdropFilter: "blur(8px)", padding: "6px 14px" }}>
                      <span style={{ ...s.eyebrow, fontSize: 9, color: s.amber }}>{card.tag}</span>
                    </div>
                    <div style={{ position: "absolute", bottom: 20, left: 24 }}>
                      <span style={{ ...s.display, fontSize: 64, fontWeight: 700, color: "rgba(255,255,255,0.07)", lineHeight: 1 }}>{card.no}</span>
                    </div>
                  </div>
                  <div style={{ padding: "36px 36px 40px" }}>
                    <h3 style={{ ...s.display, fontSize: 24, color: s.forest, marginBottom: 14, fontWeight: 500 }}>{card.title}</h3>
                    <p style={{ ...s.body, color: "rgba(30,61,26,0.55)", fontSize: 14, lineHeight: 1.8, marginBottom: 24 }}>{card.sub}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 24, borderTop: `1px solid ${s.sand}` }}>
                      <div className="divider-sm" />
                      <span style={{ ...s.eyebrow, color: s.gold, fontSize: 10 }}>{card.verse}</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>


      {/* ── STORY — Ama ── */}
      <section style={{ background: s.dust, padding: "120px 60px" }} className="section-pad">
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 100, alignItems: "center" }} className="two-col">

          <Reveal>
            <span style={{ ...s.eyebrow, color: s.sage, display: "block", marginBottom: 20 }}>A Life Changed</span>
            <div className="divider" style={{ marginBottom: 32 }} />
            <blockquote style={{ ...s.display, fontSize: "clamp(26px,3vw,44px)", color: s.forest, lineHeight: 1.25, fontWeight: 400, marginBottom: 32 }}>
              "I thought no one<br />
              would come for me.
              <em style={{ color: s.sage, display: "block", marginTop: 6 }}>Then Greenforce did."</em>
            </blockquote>
            <p style={{ ...s.body, color: "rgba(30,61,26,0.55)", fontSize: 15, marginBottom: 16, lineHeight: 1.85 }}>
              Ama was fourteen when her family couldn't cover the following term's fees. Exam registration was a month away and she had already accepted she wouldn't sit it.
            </p>
            <p style={{ ...s.body, color: "rgba(30,61,26,0.55)", fontSize: 15, marginBottom: 48, lineHeight: 1.85 }}>
              Greenforce covered her fees, got her registered, and placed her in a hostel close to school. She sat her exams, passed, and now manages a quarter-acre training plot while mentoring younger students. Across Gomoa West, there are hundreds more like Ama — waiting for someone to simply show up.
            </p>
            <Link href="/projects" className="btn-main">Read More Stories <ArrowRight size={15} /></Link>
          </Reveal>

          <Reveal delay={200}>
            <div style={{ position: "relative", height: 600 }}>
              <div style={{ position: "absolute", top: 0, left: 0, width: "64%", height: "68%", overflow: "hidden" }}>
                <img src={IMGS.kids} alt="Students" className="img-hover" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ position: "absolute", bottom: 0, right: 0, width: "58%", height: "60%", overflow: "hidden", border: `6px solid ${s.dust}` }}>
                <img src={IMGS.farm} alt="Farming" className="img-hover" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ position: "absolute", bottom: "28%", left: 0, background: s.forest, padding: "24px 28px", zIndex: 10 }}>
                <p style={{ ...s.display, fontSize: 32, fontWeight: 700, color: s.amber, lineHeight: 1 }}>10</p>
                <p style={{ ...s.eyebrow, fontSize: 10, color: "rgba(255,255,255,0.5)", marginTop: 6 }}>Girls sponsored<br />WASSCE 2026</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>


      {/* ── MARQUEE ── */}
      <div style={{ background: s.forest, borderTop: "1px solid rgba(232,184,75,0.15)", borderBottom: "1px solid rgba(232,184,75,0.15)", overflow: "hidden", padding: "18px 0" }}>
        <div className="marquee-track" style={{ display: "flex", whiteSpace: "nowrap", width: "max-content" }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} style={{ display: "flex", gap: 0 }}>
              {["📋 School Registration & Enrollment", "🏠 Hostel & Residential Support", "📝 WAEC & BECE Exam Registration", "🍽️ Feeding Programs", "🌱 Agriculture & Vocational Training", "🤝 Widows · Aged · Community Care", "✝ Proverbs 22:6 — Every Step", "🇬🇭 Gomoa West · Central Region · Ghana"].map(t => (
                <span key={t} style={{ ...s.eyebrow, fontSize: 11, color: "rgba(255,255,255,0.3)", padding: "0 40px" }}>{t}</span>
              ))}
            </div>
          ))}
        </div>
      </div>


      {/* ── GALLERY GRID ── */}
      <section style={{ background: s.cream, padding: "120px 60px" }} className="section-pad">
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Reveal style={{ marginBottom: 64 }}>
            <span style={{ ...s.eyebrow, color: s.sage, display: "block", marginBottom: 16 }}>From the Field</span>
            <h2 style={{ ...s.display, fontSize: "clamp(32px,4vw,56px)", color: s.forest, fontWeight: 400 }}>Ground-level truth.</h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gridTemplateRows: "300px 300px", gap: 4 }} className="three-col">
            {[
              { img: IMGS.kids, style: { gridRow: "1 / 3" } },
              { img: IMGS.greenhouse, style: {} },
              { img: IMGS.sitting, style: {} },
              { img: IMGS.community, style: {} },
              { img: IMGS.farm, style: {} },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 80} style={{ overflow: "hidden", ...item.style }}>
                <img src={item.img} alt="" className="img-hover" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </Reveal>
            ))}
          </div>
          <Reveal style={{ textAlign: "center", marginTop: 48 }}>
            <Link href="/gallery" className="btn-outline">View Full Gallery <ArrowRight size={14} /></Link>
          </Reveal>
        </div>
      </section>

      {/* ── FOUNDER'S SECTION ── */}
<section style={{ background: "#f2ede3", padding: "120px 60px", borderTop: "1px solid #e4dccf" }} className="section-pad">
  <div style={{ maxWidth: 1280, margin: "0 auto" }}>
    <div className="founder-grid">
      
      {/* Left Column: Visual Portrait & Top Affiliations */}
      <Reveal>
        <div style={{ position: "relative", overflow: "hidden", height: 500, marginBottom: 32 }}>
          <img src="/founder.png" alt="Victor Tokunbo Ogundipe" className="img-hover" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(30,61,26,0.95), transparent)", padding: "32px" }}>
            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, color: "#ffffff", fontWeight: 500, marginBottom: 4 }}>Victor Tokunbo Ogundipe</p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 500, color: "#e8b84b" }}>Educationist · Administrator · Humanitarian</p>
          </div>
        </div>
        
        <div style={{ background: "#ffffff", padding: "32px", borderLeft: "3px solid #c9992a" }}>
          <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontStyle: "italic", color: "#1e3d1a", lineHeight: 1.5, marginBottom: 16 }}>
            "Show love. Give hope. Offer encouragement — and it shall be well with us all."
          </p>
          <div className="divider-sm" />
        </div>
      </Reveal>

      {/* Right Column: Narrative & Formal Footprint */}
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <Reveal>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 500, color: "#5a7a4a", display: "block", marginBottom: 16 }}>Leadership & Mission</span>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(32px,4vw,48px)", color: "#1e3d1a", lineHeight: 1.2, fontWeight: 400, marginBottom: 28 }}>
            Meeting Our Founder
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, lineHeight: 1.75, color: "#0d0d0b", fontSize: 15, marginBottom: 20 }}>
            I am Victor Tokunbo Ogundipe, a Ghanaian Educationist and Administrator with a Bachelor’s Degree in Education and a Master’s Degree in Public Administration. Born into a humble background and raised by teachers, I was instilled with values of discipline, dignity, love, and service from an early age. Having experienced life without much, I developed a deep empathy for the less privileged and a burning passion to serve humanity.
          </p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, lineHeight: 1.75, color: "rgba(13,13,11,0.7)", fontSize: 14, marginBottom: 28 }}>
            With over two decades of experience in the education sector, I have served as a teacher in basic and senior high schools, holding leadership milestones including Head of the Language Department, Internal Examinations, Disciplinary, and Counseling Committees. These foundational spaces proved that while resources are vital, genuine encouragement and mentorship are what truly unlock human potential.
          </p>

          <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, color: "#1e3d1a", marginTop: 40, marginBottom: 8, fontWeight: 500 }}>Current Regional Directorships</h3>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, lineHeight: 1.75, color: "rgba(13,13,11,0.6)", fontSize: 13, marginBottom: 16 }}>
            Driving structural educational systems, community reach-out, and youth support networks across West African boundaries:
          </p>

          <table className="org-table">
            <tbody>
              <tr>
                <td style={{ width: "40%", paddingRight: 16 }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 500, color: "#1e3d1a", display: "block" }}>Greenforce Foundation Africa</span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, lineHeight: 1.75, fontSize: 12, color: "rgba(0,0,0,0.4)" }}>CEO & Executive Director</span>
                </td>
                <td style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, lineHeight: 1.75, fontSize: 13, color: "rgba(13,13,11,0.7)" }}>
                  Registered in Ghana and The Gambia since September 2010. Protecting vulnerable households and providing structural care frameworks.
                </td>
              </tr>
              <tr>
                <td style={{ width: "40%", paddingRight: 16 }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 500, color: "#1e3d1a", display: "block" }}>Billion Child Foundation (BCF)</span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, lineHeight: 1.75, fontSize: 12, color: "rgba(0,0,0,0.4)" }}>Regional Director West Africa</span>
                </td>
                <td style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, lineHeight: 1.75, fontSize: 13, color: "rgba(13,13,11,0.7)" }}>
                  Overseeing large-scale regional operations focused on developmental equality, children's empowerment, and fundamental instructional liberties.
                </td>
              </tr>
              <tr>
                <td style={{ width: "40%", paddingRight: 16 }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 500, color: "#1e3d1a", display: "block" }}>Charity International SHS</span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, lineHeight: 1.75, fontSize: 12, color: "rgba(0,0,0,0.4)" }}>Headmaster & Hostel Lead</span>
                </td>
                <td style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, lineHeight: 1.75, fontSize: 13, color: "rgba(13,13,11,0.7)" }}>
                  Directing holistic academic progress, structural operations, and protective student boarding spaces in Apam, Central Region of Ghana.
                </td>
              </tr>
            </tbody>
          </table>

          <div style={{ marginTop: 40, display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
            <Link href="/about" className="btn-main">Full Bio & History</Link>
            <Link href="/contact" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 500, color: "#3a5c2e", display: "inline-flex", alignItems: "center", gap: 8 }}>
              Partner With Our Vision <ArrowRight size={13} />
            </Link>
          </div>
        </Reveal>
      </div>

    </div>
  </div>
</section>

{/* ── TESTIMONIALS SECTION ── */}
<section style={{ background: s.cream, padding: "120px 60px" }} className="section-pad">
  <div style={{ maxWidth: 1280, margin: "0 auto" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 64, flexWrap: "wrap", gap: 24 }}>
      <Reveal>
        <span style={{ ...s.eyebrow, color: s.sage, display: "block", marginBottom: 16 }}>Voices of Impact</span>
        <h2 style={{ ...s.display, fontSize: "clamp(40px,5vw,72px)", color: s.forest, fontWeight: 400, lineHeight: 1.1 }}>
          The community speaks.
        </h2>
      </Reveal>
      <div style={{ display: "flex", gap: 16 }}>
        <button 
          onClick={() => {
            const el = document.getElementById('testi-scroll');
            if (el) {
              const items = el.children;
              const currentIdx = Math.round(el.scrollLeft / items[0].getBoundingClientRect().width);
              const nextIdx = currentIdx === 0 ? items.length - 1 : currentIdx - 1;
              (items[nextIdx] as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
            }
          }}
          style={{ width: 50, height: 50, borderRadius: "50%", border: `1px solid ${s.forest}`, background: "transparent", color: s.forest, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
        >&lt;</button>
        <button 
          onClick={() => {
            const el = document.getElementById('testi-scroll');
            if (el) {
              const items = el.children;
              const currentIdx = Math.round(el.scrollLeft / items[0].getBoundingClientRect().width);
              const nextIdx = currentIdx >= items.length - 1 ? 0 : currentIdx + 1;
              (items[nextIdx] as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
            }
          }}
          style={{ width: 50, height: 50, borderRadius: "50%", border: `1px solid ${s.forest}`, background: s.forest, color: s.cream, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
        >&gt;</button>
      </div>
    </div>

    <div 
      id="testi-scroll"
      style={{ 
        display: "flex", 
        gap: "32px", 
        overflowX: "auto", 
        scrollBehavior: "smooth", 
        paddingBottom: "40px",
        scrollbarWidth: "none",
        scrollSnapType: "x mandatory"
      }}
    >
      {[
        { q: "Our school was on the verge of losing twelve final-year candidates. Greenforce didn't just pay the balance; they assigned supervisors to track their welfare. All twelve successfully sat their papers.", a: "Dr. Emmanuel K. Baidoo", r: "Headmaster, Gomoa District" },
        { q: "When my husband passed, the farm was left unattended. The team rehabilitated the land, provided high-yield vegetable crops, and put my daughter back into a residential hostel within weeks.", a: "Comfort Nana Osei", r: "Parent, Apam" },
        { q: "The greenhouse projects attached to our quarters aren't minor decorative patches. They teach precision farming. Our school dining hall saves significantly on fresh grocery supply because the children supply their own kitchens.", a: "Elder Silas Boateng", r: "Board Chairman" },
        { q: "I thought dropping out was my final step. Missing two full assessment marks means you are effectively out of the system. Greenforce settled the administration desk and gave me a technical plot.", a: "Abigail Naa Darkoa", r: "Student, Apam" }
      ]
      .sort(() => Math.random() - 0.5) // Randomizes order on every render
      .map((t, i) => (
        <div key={i} style={{ 
          minWidth: "calc(100% - 32px)", 
          maxWidth: "600px", 
          padding: "48px", 
          background: s.white, 
          border: `1px solid ${s.sand}`, 
          display: "flex", 
          flexDirection: "column", 
          justifyContent: "space-between",
          scrollSnapAlign: "start"
        }}>
          <p style={{ ...s.body, color: s.ink, fontSize: "clamp(18px, 2vw, 22px)", lineHeight: 1.7, fontStyle: "italic", marginBottom: 48 }}>"{t.q}"</p>
          <div style={{ borderTop: `1px solid ${s.dust}`, paddingTop: 24 }}>
            <p style={{ ...s.display, fontSize: 18, color: s.forest, fontWeight: 500 }}>{t.a}</p>
            <p style={{ ...s.eyebrow, fontSize: 10, color: s.gold, marginTop: 8 }}>{t.r}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>


      {/* ── FINAL CTA ── */}
      <section style={{ position: "relative", overflow: "hidden", background: s.forest, padding: "140px 60px" }} className="section-pad">
        <div style={{ position: "absolute", top: -40, right: -40, ...s.display, fontSize: 400, fontWeight: 700, color: "rgba(255,255,255,0.025)", lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>
          G
        </div>
        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 2 }}>
          <Reveal style={{ textAlign: "center" }}>
            <div className="float" style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(201,153,42,0.15)", border: "1px solid rgba(201,153,42,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 40px" }}>
              <Heart size={22} style={{ color: s.amber }} strokeWidth={1.5} />
            </div>
            <span style={{ ...s.eyebrow, color: "rgba(232,184,75,0.5)", display: "block", marginBottom: 24 }}>Make a Difference</span>
            <h2 style={{ ...s.display, fontSize: "clamp(36px,5vw,80px)", color: s.white, fontWeight: 400, lineHeight: 1.1, marginBottom: 28 }}>
              A child is waiting<br />
              for <em style={{ color: s.amber }}>you to show up.</em>
            </h2>
            <p style={{ ...s.body, color: "rgba(255,255,255,0.45)", fontSize: 16, maxWidth: 540, margin: "0 auto 56px", lineHeight: 1.85 }}>
              Every cedi, pound, or dollar you give pays a school fee, registers a child for their exams, puts food in front of a student who would otherwise sit hungry in class. Change a family's story forever.
            </p>
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 16, marginBottom: 40 }}>
              <Link href="/donate" className="btn-gold">Donate Now <Heart size={14} /></Link>
              <Link href="/contact" className="btn-ghost">Partner With Us</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── GLOBAL FLOATING ACTION BUTTON ── */}
      <div style={{ position: "fixed", bottom: "32px", right: "32px", zIndex: 100 }}>
        <WhatsAppButton />
      </div>

    </main>
  );
}
