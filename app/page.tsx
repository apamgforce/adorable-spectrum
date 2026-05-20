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
  // Typography helpers
  eyebrow: { fontFamily: "'DM Sans', sans-serif", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase" as const, fontWeight: 500 },
  display: { fontFamily: "'Playfair Display', Georgia, serif" },
  body: { fontFamily: "'DM Sans', sans-serif", fontWeight: 300, lineHeight: 1.75 },
  // Colors
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
    <main style={{ background: s.cream, overflowX: "hidden" }}>

      {/* ── GLOBAL STYLES injected once ── */}
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
        @media(max-width:768px){
          .hide-mobile{display:none!important}
          .hero-title{font-size:clamp(48px,10vw,80px)!important}
          .two-col{grid-template-columns:1fr!important}
          .three-col{grid-template-columns:1fr!important}
          .nav-inner{padding:20px 24px!important}
          .hero-content{padding:0 24px 80px!important}
          .section-pad{padding:80px 24px!important}
          .section-pad-sm{padding:60px 24px!important}
        }
      `}</style>


{/* ══════════════════════════════
          HERO — full bleed, editorial
      ══════════════════════════════ */}
      <br />
      <section style={{ position: "relative", height: "100vh", minHeight: 700, display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        {/* Background */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          <img src={IMGS.hero} alt="" className={heroLoaded ? "kb" : ""} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 35%" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,20,8,0.92) 0%, rgba(10,20,8,0.5) 40%, rgba(10,20,8,0.1) 100%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(10,20,8,0.5) 0%, transparent 60%)" }} />
        </div>

        {/* Vertical label */}
        <div className="hide-mobile" style={{ position: "absolute", right: 48, top: "50%", transform: "translateY(-50%) rotate(90deg)", display: "flex", alignItems: "center", gap: 16, transformOrigin: "center center" }}>
          <div style={{ width: 40, height: 1, background: "rgba(255,255,255,0.2)" }} />
          <span style={{ ...s.eyebrow, fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: "0.25em" }}>Apam · Gomoa West · Ghana</span>
        </div>

        {/* Content */}
        <div className="hero-content" style={{ position: "relative", zIndex: 10, maxWidth: 1280, width: "100%", margin: "0 auto", padding: "0 60px 100px" }}>

          <div className="fi1" style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
            <div className="divider" />
            <span style={{ ...s.eyebrow, color: s.amber, fontSize: 11 }}>West Africa · Agriculture · Education</span>
          </div>

          <h1 className="hero-title su1" style={{ ...s.display, fontSize: "clamp(56px,7vw,104px)", fontWeight: 400, color: s.white, lineHeight: 1.03, marginBottom: 32, maxWidth: 700 }}>
            From Seed<br />
            to <em style={{ color: s.amber, fontStyle: "italic" }}>Scholarship.</em><br />
            <span style={{ fontWeight: 700 }}>Every child</span><br />
            <span style={{ fontWeight: 300, color: "rgba(255,255,255,0.6)" }}>deserves both.</span>
          </h1>

          <p className="su2" style={{ ...s.body, color: "rgba(255,255,255,0.6)", fontSize: 16, maxWidth: 420, marginBottom: 48 }}>
            Greenforce Foundation trains youth in Africa to grow food, earn dignity, and break generational poverty — one harvest at a time.
          </p>

          <div className="su3" style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            <Link href="/projects" className="btn-main">See Our Work <ArrowRight size={15} /></Link>
            <Link href="/donate" className="btn-ghost">Sponsor a Child</Link>
          </div>

          {/* Stat tickers */}
          <div className="su4 hide-mobile" style={{ display: "flex", gap: 48, marginTop: 72, paddingTop: 48, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            {[{ n: 340, s: "+", l: "Students Trained" }, { n: 12, s: "", l: "Greenhouses Built" }, { n: 87, s: "+", l: "Scholarships Active" }].map(x => (
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


      {/* ── ══════════════════════════════
          EDITORIAL DIPTYCH — The Problem
      ══════════════════════════════ */}
      <section style={{ background: s.cream }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "80vh" }} className="two-col">

          {/* Left — image */}
          <div style={{ position: "relative", overflow: "hidden", minHeight: 560 }}>
            <img src={IMGS.hunger} alt="Child facing hunger" className="img-hover" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,10,4,0.85), transparent 50%)" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "40px 48px" }}>
              <span style={{ ...s.eyebrow, fontSize: 10, color: s.amber, display: "block", marginBottom: 12 }}>The Reality</span>
              <p style={{ ...s.display, fontSize: "clamp(22px,2.5vw,32px)", fontStyle: "italic", color: s.white, lineHeight: 1.3, fontWeight: 400 }}>
                "Every empty plate<br />is a stolen dream."
              </p>
            </div>
          </div>

          {/* Right — copy */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px 72px", background: s.forest }}>
            <Reveal>
              <div className="divider" style={{ marginBottom: 32 }} />
              <p style={{ ...s.display, fontSize: "clamp(28px,3vw,44px)", color: s.white, lineHeight: 1.25, fontWeight: 400, marginBottom: 28 }}>
                In West Africa,<br />
                <em style={{ color: s.amber }}>40% of children</em> attend<br />
                school on empty stomachs.
              </p>
              <p style={{ ...s.body, color: "rgba(255,255,255,0.5)", fontSize: 15, marginBottom: 40, maxWidth: 400 }}>
                Their potential doesn't disappear — it waits. Waits for someone to plant a seed in ground that is already there, already fertile, already ready. The soil exists. The hunger is real. The distance between them is solvable.
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

      {/* ══════════════════════════════
          SCRIPTURE BREAK
      ══════════════════════════════ */}
      <section style={{ background: s.dust, padding: "100px 60px" }} className="section-pad">
        <Reveal style={{ maxWidth: 840, margin: "0 auto", textAlign: "center" }}>
          <p style={{ ...s.display, fontSize: "clamp(22px,3vw,40px)", fontStyle: "italic", fontWeight: 400, color: s.forest, lineHeight: 1.4, marginBottom: 24 }}>
            "He who works his land will have abundant food,<br />but he who chases fantasies lacks judgment."
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <div className="divider-sm" />
            <span style={{ ...s.eyebrow, color: s.gold, fontSize: 11 }}>Proverbs 12 : 11</span>
            <div className="divider-sm" />
          </div>
          <p style={{ ...s.body, color: "rgba(30,61,26,0.5)", fontSize: 14, marginTop: 24, maxWidth: 480, margin: "24px auto 0" }}>
            This is not merely charity. It is discipleship — rooting the next generation in values that outlast any harvest.
          </p>
        </Reveal>
      </section>
      
      {/* ══════════════════════════════
    CORE OPERATIONAL FOCUS
══════════════════════════════ */}
<section style={{ background: "#faf8f3", padding: "100px 40px" }}>
  <div style={{ maxWidth: 1000, margin: "0 auto" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
      <div className="divider" />
      <span style={{ ...s.eyebrow, color: s.gold, fontSize: 11 }}>What We Do</span>
    </div>

    <h2 style={{ ...s.display, fontSize: "clamp(36px,5vw,60px)", lineHeight: 1.1, color: s.forest, marginBottom: 40, fontWeight: 400 }}>
      Training hands, transforming hearts,<br />
      growing dignity through <em style={{ color: s.gold, fontStyle: "italic" }}>green action.</em>
    </h2>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start" }}>
      <p style={{ ...s.body, color: "rgba(13,13,11,0.65)", fontSize: 16, margin: 0 }}>
        Greenforce Foundation Africa exists to equip students, youth, and communities in Ghana and The Gambia with green skills, education, and character that create food security, income, and dignity.
      </p>
      <p style={{ ...s.body, color: "rgba(13,13,11,0.65)", fontSize: 16, margin: 0 }}>
        Our work spans <strong style={{ fontWeight: 500, color: s.forest }}>Education, Agriculture, Vocational Training, Health Care, Care for the Aged &amp; Widows, Sport, and Evangelism</strong> — ensuring lack of resources never forces a choice between livelihood and learning.
      </p>
    </div>
  </div>
</section>

{/* ══════════════════════════════
    REGIONAL IMPACT
══════════════════════════════ */}
<section style={{ background: s.dust, padding: "100px 40px" }}>
  <div style={{ maxWidth: 1000, margin: "0 auto" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
      <div className="divider" />
      <span style={{ ...s.eyebrow, color: s.gold, fontSize: 11 }}>Regional Impact</span>
    </div>

    <h2 style={{ ...s.display, fontSize: "clamp(32px,4vw,52px)", lineHeight: 1.15, color: s.forest, marginBottom: 40, fontWeight: 400 }}>
      Building self-reliant<br />
      <em style={{ fontStyle: "italic", fontWeight: 300, color: "rgba(30,61,26,0.6)" }}>communities.</em>
    </h2>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start" }}>
      <p style={{ ...s.body, color: "rgba(13,13,11,0.6)", fontSize: 16, margin: 0 }}>
        We envision an Africa where every school serves as a center of food production and every young person, widow, and aged person lives with skill and purpose.
      </p>
      <p style={{ ...s.body, color: "rgba(13,13,11,0.6)", fontSize: 16, margin: 0 }}>
        In communities like Apam and Banjul, we are establishing models where schools feed themselves and graduates emerge as skilled, disciplined individuals who choose self-reliance over dependency.
      </p>
    </div>
  </div>
</section>

      {/* ══════════════════════════════
          THREE PILLARS — large cards
      ══════════════════════════════ */}
      <section style={{ background: s.cream, padding: "120px 60px" }} className="section-pad">
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>

          <Reveal style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 72, flexWrap: "wrap", gap: 24 }}>
            <div>
              <span style={{ ...s.eyebrow, color: s.sage, display: "block", marginBottom: 16 }}>What We Do</span>
              <h2 style={{ ...s.display, fontSize: "clamp(36px,4.5vw,64px)", color: s.forest, lineHeight: 1.1, fontWeight: 400 }}>
                Three pillars.<br /><em>One mission.</em>
              </h2>
            </div>
            <Link href="/projects" style={{ ...s.eyebrow, color: s.moss, fontSize: 11, display: "flex", alignItems: "center", gap: 8 }}>
              All Projects <ArrowRight size={13} />
            </Link>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2 }} className="three-col">
            {[
              { img: IMGS.greenhouse, no: "01", tag: "Flagship", title: "School Greenhouses", sub: "We build productive greenhouse environments directly behind school residential quarters. Students complete full farming cycles — seedling, harvest, market — and their dining halls eat the results.", verse: "Prov. 12:11" },
              { img: IMGS.bloom, no: "02", tag: "Youth Program", title: "Youth Agri-Training", sub: "Holiday and weekend training for SHS students in Apam. From soil science to sales records — the discipline of farming becomes the discipline of life.", verse: "Prov. 22:6" },
              { img: IMGS.community, no: "03", tag: "Community", title: "Community Farming", sub: "Partnering with PTAs, churches, and GES Gomoa West to transform idle school land into productive farms feeding entire communities.", verse: "Prov. 29:18" },
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

      {/* ══════════════════════════════
          FULL-BLEED HARVEST
      ══════════════════════════════ */}
      <section style={{ position: "relative", height: "70vh", minHeight: 500, display: "flex", alignItems: "center", overflow: "hidden" }}>
        <img src={IMGS.harvest} alt="Harvest" className="img-hover" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, rgba(10,20,8,0.9) 0%, rgba(10,20,8,0.55) 55%, rgba(10,20,8,0.15) 100%)" }} />
        <div style={{ position: "relative", zIndex: 10, maxWidth: 1280, margin: "0 auto", padding: "0 60px", width: "100%" }} className="section-pad">
          <Reveal style={{ maxWidth: 560 }}>
            <span style={{ ...s.eyebrow, color: s.amber, display: "block", marginBottom: 20 }}>Education Sponsorship</span>
            <h2 style={{ ...s.display, fontSize: "clamp(32px,4vw,60px)", color: s.white, lineHeight: 1.15, fontWeight: 400, marginBottom: 24 }}>
              Some children can't<br />afford to dream.
              <em style={{ color: s.amber, display: "block", marginTop: 4 }}>We change that.</em>
            </h2>
            <p style={{ ...s.body, color: "rgba(255,255,255,0.55)", fontSize: 15, marginBottom: 40, maxWidth: 420 }}>
              Our scholarship program directly sponsors students who cannot afford school fees, uniforms, or books. No child who wants to learn should be turned away by poverty.
            </p>
            <Link href="/donate" className="btn-gold">Sponsor a Child <Heart size={14} /></Link>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════
          STATS ROW
      ══════════════════════════════ */}
      <section style={{ background: s.forest, padding: "100px 60px" }} className="section-pad">
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 80 }}>
            <span style={{ ...s.eyebrow, color: "rgba(232,184,75,0.6)", display: "block", marginBottom: 16 }}>The Impact So Far</span>
            <h2 style={{ ...s.display, fontSize: "clamp(32px,4vw,56px)", color: s.white, fontWeight: 400 }}>Numbers that breathe.</h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1px", background: "rgba(255,255,255,0.06)" }} className="two-col">
            {[
              { n: 340, suf: "+", label: "Students Trained", sub: "in agri-skills & discipline" },
              { n: 12, suf: "", label: "Greenhouses Built", sub: "in schools & hostels" },
              { n: 87, suf: "+", label: "Scholarships", sub: "active sponsorships" },
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

      {/* ══════════════════════════════
          STORY — Ama
      ══════════════════════════════ */}
      <section style={{ background: s.cream, padding: "120px 60px" }} className="section-pad">
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 100, alignItems: "center" }} className="two-col">

          {/* Left copy */}
          <Reveal>
            <span style={{ ...s.eyebrow, color: s.sage, display: "block", marginBottom: 20 }}>A Life Changed</span>
            <div className="divider" style={{ marginBottom: 32 }} />
            <blockquote style={{ ...s.display, fontSize: "clamp(26px,3vw,44px)", color: s.forest, lineHeight: 1.25, fontWeight: 400, marginBottom: 32 }}>
              "I thought farming was for the poor.
              <em style={{ color: s.sage, display: "block", marginTop: 6 }}>Now it sets me free."</em>
            </blockquote>
            <p style={{ ...s.body, color: "rgba(30,61,26,0.55)", fontSize: 15, marginBottom: 16, lineHeight: 1.85 }}>
              Ama was fourteen when she joined Greenforce's holiday training in Apam. Her family couldn't afford the following term's fees.
            </p>
            <p style={{ ...s.body, color: "rgba(30,61,26,0.55)", fontSize: 15, marginBottom: 48, lineHeight: 1.85 }}>
              Today, she manages a quarter-acre plot, teaches younger students, and her school fees are fully covered by the harvest proceeds. Across Gomoa West, there are hundreds more like Ama — waiting for a seed, a hand, and someone who believes in what they can grow.
            </p>
            <Link href="/projects" className="btn-main">Read More Stories <ArrowRight size={15} /></Link>
          </Reveal>

          {/* Right — staggered images */}
          <Reveal delay={200}>
            <div style={{ position: "relative", height: 600 }}>
              <div style={{ position: "absolute", top: 0, left: 0, width: "64%", height: "68%", overflow: "hidden" }}>
                <img src={IMGS.kids} alt="Students" className="img-hover" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ position: "absolute", bottom: 0, right: 0, width: "58%", height: "60%", overflow: "hidden", border: `6px solid ${s.cream}` }}>
                <img src={IMGS.farm} alt="Farming" className="img-hover" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              {/* Accent block */}
              <div style={{ position: "absolute", bottom: "28%", left: 0, background: s.forest, padding: "24px 28px", zIndex: 10 }}>
                <p style={{ ...s.display, fontSize: 32, fontWeight: 700, color: s.amber, lineHeight: 1 }}>10</p>
                <p style={{ ...s.eyebrow, fontSize: 10, color: "rgba(255,255,255,0.5)", marginTop: 6 }}>Girls sponsored<br />WASSCE 2026</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════
          MARQUEE
      ══════════════════════════════ */}
      <div style={{ background: s.forest, borderTop: "1px solid rgba(232,184,75,0.15)", borderBottom: "1px solid rgba(232,184,75,0.15)", overflow: "hidden", padding: "18px 0" }}>
        <div className="marquee-track" style={{ display: "flex", whiteSpace: "nowrap", width: "max-content" }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} style={{ display: "flex", gap: 0 }}>
              {["🌱 School Greenhouses in SHS", "📚 Education Sponsorships", "🤝 Community Farming Partnerships", "🌾 Youth Agri-Training in Apam", "✝ Proverbs 22:6 — Every Step", "🇬🇭 Gomoa West · Central Region · Ghana"].map(t => (
                <span key={t} style={{ ...s.eyebrow, fontSize: 11, color: "rgba(255,255,255,0.3)", padding: "0 40px" }}>{t}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════
          GRID — Gallery taste
      ══════════════════════════════ */}
      <section style={{ background: s.dust, padding: "120px 60px" }} className="section-pad">
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

      {/* ══════════════════════════════
          FINAL CTA
      ══════════════════════════════ */}
      <section style={{ position: "relative", overflow: "hidden", background: s.forest, padding: "140px 60px" }} className="section-pad">
        {/* Decorative typography */}
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
              A child is waiting for<br />
              <em style={{ color: s.amber }}>your harvest.</em>
            </h2>
            <p style={{ ...s.body, color: "rgba(255,255,255,0.45)", fontSize: 16, maxWidth: 520, margin: "0 auto 56px", lineHeight: 1.85 }}>
              Every cedi, pound, or dollar you give plants a seed in a child's future. Sponsor their education. Fund a greenhouse. Change a family's story forever.
            </p>
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 16, marginBottom: 64 }}>
              <Link href="/donate" className="btn-gold">Donate Now <Heart size={14} /></Link>
              <Link href="/contact" className="btn-ghost">Partner With Us</Link>
            </div>
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 40, paddingTop: 40, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              {["Registered Non-Profit", "100% Transparent Spending", "Direct Community Impact", "Faith-Based Values"].map(t => (
                <span key={t} style={{ ...s.eyebrow, fontSize: 10, color: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: s.amber }}>✓</span> {t}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
      <WhatsAppButton />

    </main>
  );
}

