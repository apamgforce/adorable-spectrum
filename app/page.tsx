"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Heart, ChevronDown } from "lucide-react";
import WhatsAppButton from "./components/WhatsappButton";

const IMGS = {
  hero: "/hero.jpg",
  hunger: "/hunger.jpg",
  bloom: "/bloom.png",
  greenhouse: "/greenhouse.png",
  harvest: "/harvest.jpg",
  kids: "/hostellers.png",
  farm: "/ama.png",
  community: "/community.jpg",
  ama: "https://images.unsplash.com/photo-1530099486328-e021101a494a?w=1200&q=85&auto=format&fit=crop",
  sitting: "/sitting.jpg",
};

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );

    obs.observe(el);

    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

function Reveal({
  children,
  delay = 0,
  style = {},
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const { ref, visible } = useInView();

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.9s ease ${delay}ms, transform 0.9s ease ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function CountUp({
  target,
  suffix = "",
}: {
  target: number;
  suffix?: string;
}) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;

          let current = 0;
          const steps = 50;
          const inc = target / steps;

          const t = setInterval(() => {
            current += inc;

            if (current >= target) {
              setN(target);
              clearInterval(t);
            } else {
              setN(Math.floor(current));
            }
          }, 2000 / steps);
        }
      },
      { threshold: 0.5 }
    );

    obs.observe(el);

    return () => obs.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {n.toLocaleString()}
      {suffix}
    </span>
  );
}

const s = {
  eyebrow: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "11px",
    letterSpacing: "0.18em",
    textTransform: "uppercase" as const,
    fontWeight: 500,
  },

  display: {
    fontFamily: "'Playfair Display', Georgia, serif",
  },

  body: {
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 300,
    lineHeight: 1.75,
  },

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
    const img = new Image();

    img.src = IMGS.hero;
    img.onload = () => setHeroLoaded(true);
  }, []);

  return (
    <main style={{ background: s.cream, overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

        html {
          scroll-behavior: smooth;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          overflow-x: hidden;
        }

        img {
          display: block;
        }

        a {
          text-decoration: none;
          color: inherit;
        }

        @keyframes kenburns {
          0% {
            transform: scale(1.08);
          }

          100% {
            transform: scale(1);
          }
        }

        @keyframes fadein {
          from {
            opacity: 0;
            transform: translateY(24px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideup {
          from {
            opacity: 0;
            transform: translateY(48px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }

          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }

          50% {
            opacity: 0.4;
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-8px);
          }
        }

        .kb {
          animation: kenburns 12s ease-out forwards;
        }

        .fi1 {
          animation: fadein 0.8s ease 0.2s both;
        }

        .fi2 {
          animation: fadein 0.8s ease 0.5s both;
        }

        .su1 {
          animation: slideup 0.9s ease 0.3s both;
        }

        .su2 {
          animation: slideup 0.9s ease 0.5s both;
        }

        .su3 {
          animation: slideup 0.9s ease 0.7s both;
        }

        .su4 {
          animation: slideup 0.9s ease 0.9s both;
        }

        .su5 {
          animation: slideup 0.9s ease 1.1s both;
        }

        .marquee-track {
          animation: marquee 30s linear infinite;
        }

        .float {
          animation: float 4s ease-in-out infinite;
        }

        .img-hover {
          transition: transform 0.7s ease, filter 0.5s ease;
        }

        .img-hover:hover {
          transform: scale(1.04);
          filter: brightness(1.05);
        }

        .btn-main {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #1e3d1a;
          color: #faf8f3;
          padding: 16px 36px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          border: none;
          transition: all 0.3s;
          text-decoration: none;
        }

        .btn-main:hover {
          background: #3a5c2e;
          gap: 16px;
        }

        .btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: transparent;
          color: #1e3d1a;
          padding: 16px 36px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          border: 1.5px solid #1e3d1a;
          transition: all 0.3s;
          text-decoration: none;
        }

        .btn-outline:hover {
          background: #1e3d1a;
          color: #faf8f3;
        }

        .btn-gold {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #c9992a;
          color: #fff;
          padding: 16px 36px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          border: none;
          transition: all 0.3s;
          text-decoration: none;
        }

        .btn-gold:hover {
          background: #e8b84b;
          gap: 16px;
        }

        .btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: transparent;
          color: rgba(255,255,255,0.8);
          padding: 16px 36px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          border: 1.5px solid rgba(255,255,255,0.3);
          transition: all 0.3s;
          text-decoration: none;
        }

        .btn-ghost:hover {
          background: rgba(255,255,255,0.1);
          color: #fff;
          border-color: rgba(255,255,255,0.6);
        }

        .divider {
          width: 48px;
          height: 1.5px;
          background: #c9992a;
        }

        .divider-sm {
          width: 32px;
          height: 1px;
          background: #c9992a;
        }

        @media(max-width:768px) {
          .hide-mobile {
            display: none !important;
          }

          .hero-title {
            font-size: clamp(48px,10vw,80px) !important;
          }

          .two-col {
            grid-template-columns: 1fr !important;
          }

          .three-col {
            grid-template-columns: 1fr !important;
          }

          .nav-inner {
            padding: 20px 24px !important;
          }

          .hero-content {
            padding: 0 24px 80px !important;
          }

          .section-pad {
            padding: 80px 24px !important;
          }

          .section-pad-sm {
            padding: 60px 24px !important;
          }
        }
      `}</style>

      <section
        style={{
          position: "relative",
          height: "100vh",
          minHeight: 700,
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
          }}
        >
          <img
            src={IMGS.hero}
            alt=""
            className={heroLoaded ? "kb" : ""}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 35%",
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(10,20,8,0.92) 0%, rgba(10,20,8,0.5) 40%, rgba(10,20,8,0.1) 100%)",
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to right, rgba(10,20,8,0.5) 0%, transparent 60%)",
            }}
          />
        </div>

        <div
          className="hide-mobile"
          style={{
            position: "absolute",
            right: 48,
            top: "50%",
            transform: "translateY(-50%) rotate(90deg)",
            display: "flex",
            alignItems: "center",
            gap: 16,
            transformOrigin: "center center",
          }}
        >
          <div
            style={{
              width: 40,
              height: 1,
              background: "rgba(255,255,255,0.2)",
            }}
          />

          <span
            style={{
              ...s.eyebrow,
              fontSize: 10,
              color: "rgba(255,255,255,0.35)",
              letterSpacing: "0.25em",
            }}
          >
            Apam · Gomoa West · Ghana
          </span>
        </div>

        <div
          className="hero-content"
          style={{
            position: "relative",
            zIndex: 10,
            maxWidth: 1280,
            width: "100%",
            margin: "0 auto",
            padding: "0 60px 100px",
          }}
        >
          <div
            className="fi1"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 28,
            }}
          >
            <div className="divider" />

            <span
              style={{
                ...s.eyebrow,
                color: s.amber,
                fontSize: 11,
              }}
            >
              West Africa · Agriculture · Education · Humanitarian Care
            </span>
          </div>

          <h1
            className="hero-title su1"
            style={{
              ...s.display,
              fontSize: "clamp(56px,7vw,104px)",
              fontWeight: 400,
              color: s.white,
              lineHeight: 1.03,
              marginBottom: 32,
              maxWidth: 760,
            }}
          >
            Feeding futures.<br />
            Opening schools.<br />
            <em style={{ color: s.amber, fontStyle: "italic" }}>
              Restoring dignity.
            </em>
          </h1>

          <p
            className="su2"
            style={{
              ...s.body,
              color: "rgba(255,255,255,0.65)",
              fontSize: 16,
              maxWidth: 520,
              marginBottom: 48,
            }}
          >
            Greenforce Foundation supports vulnerable children and families
            through education sponsorships, hostel support, feeding
            interventions, youth empowerment, and sustainable agriculture across
            Ghana and West Africa.
          </p>

          <div
            className="su3"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <Link href="/projects" className="btn-main">
              See Our Work <ArrowRight size={15} />
            </Link>

            <Link href="/donate" className="btn-ghost">
              Support a Child
            </Link>
          </div>

          <div
            className="su4 hide-mobile"
            style={{
              display: "flex",
              gap: 48,
              marginTop: 72,
              paddingTop: 48,
              borderTop: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {[
              {
                n: 340,
                s: "+",
                l: "Students Supported",
              },
              {
                n: 120,
                s: "+",
                l: "Exam Registrations Funded",
              },
              {
                n: 87,
                s: "+",
                l: "Scholarships Active",
              },
            ].map((x) => (
              <div key={x.l}>
                <p
                  style={{
                    ...s.display,
                    fontSize: 36,
                    fontWeight: 500,
                    color: s.amber,
                    lineHeight: 1,
                  }}
                >
                  <CountUp target={x.n} suffix={x.s} />
                </p>

                <p
                  style={{
                    ...s.eyebrow,
                    fontSize: 10,
                    color: "rgba(255,255,255,0.4)",
                    marginTop: 6,
                  }}
                >
                  {x.l}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 32,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              ...s.eyebrow,
              fontSize: 9,
              color: "rgba(255,255,255,0.3)",
            }}
          >
            Scroll
          </span>

          <ChevronDown
            size={14}
            style={{
              color: "rgba(255,255,255,0.3)",
              animation: "pulse 2s ease infinite",
            }}
          />
        </div>
      </section>

      <section style={{ background: s.cream }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            minHeight: "80vh",
          }}
          className="two-col"
        >
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              minHeight: 560,
            }}
          >
            <img
              src={IMGS.hunger}
              alt="Child facing hardship"
              className="img-hover"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(5,10,4,0.85), transparent 50%)",
              }}
            />

            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "40px 48px",
              }}
            >
              <span
                style={{
                  ...s.eyebrow,
                  fontSize: 10,
                  color: s.amber,
                  display: "block",
                  marginBottom: 12,
                }}
              >
                The Reality
              </span>

              <p
                style={{
                  ...s.display,
                  fontSize: "clamp(22px,2.5vw,32px)",
                  fontStyle: "italic",
                  color: s.white,
                  lineHeight: 1.3,
                  fontWeight: 400,
                }}
              >
                "Some children are not failing because they lack intelligence.
                <br />
                They are simply unsupported."
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "80px 72px",
              background: s.forest,
            }}
          >
            <Reveal>
              <div className="divider" style={{ marginBottom: 32 }} />

              <p
                style={{
                  ...s.display,
                  fontSize: "clamp(28px,3vw,44px)",
                  color: s.white,
                  lineHeight: 1.25,
                  fontWeight: 400,
                  marginBottom: 28,
                }}
              >
                Behind every unpaid fee,
                <br />
                missed exam registration,
                <br />
                or abandoned hostel room
                <br />
                is a child whose future
                <em style={{ color: s.amber }}> deserves protection.</em>
              </p>

              <p
                style={{
                  ...s.body,
                  color: "rgba(255,255,255,0.5)",
                  fontSize: 15,
                  marginBottom: 40,
                  maxWidth: 430,
                }}
              >
                Greenforce Foundation exists for students at the edge of being
                left behind. We step into the gap with sponsorships, feeding
                support, hostel interventions, mentorship, and practical
                empowerment programs that restore stability to families and
                hope to children.
              </p>

              <Link
                href="/about"
                style={{
                  ...s.eyebrow,
                  color: s.amber,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 11,
                  transition: "gap .3s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.gap = "16px")}
                onMouseLeave={(e) => (e.currentTarget.style.gap = "8px")}
              >
                Our Story <ArrowRight size={13} />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section
        style={{
          background: s.dust,
          padding: "100px 60px",
        }}
        className="section-pad"
      >
        <Reveal
          style={{
            maxWidth: 840,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <p
            style={{
              ...s.display,
              fontSize: "clamp(22px,3vw,40px)",
              fontStyle: "italic",
              fontWeight: 400,
              color: s.forest,
              lineHeight: 1.4,
              marginBottom: 24,
            }}
          >
            "Defend the weak and the fatherless;
            <br />
            uphold the cause of the poor and oppressed."
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
            }}
          >
            <div className="divider-sm" />

            <span
              style={{
                ...s.eyebrow,
                color: s.gold,
                fontSize: 11,
              }}
            >
              Psalm 82 : 3
            </span>

            <div className="divider-sm" />
          </div>

          <p
            style={{
              ...s.body,
              color: "rgba(30,61,26,0.5)",
              fontSize: 14,
              marginTop: 24,
              maxWidth: 520,
              margin: "24px auto 0",
            }}
          >
            Compassion is not separate from development. For us, care and
            empowerment belong together.
          </p>
        </Reveal>
      </section>

      <section
        style={{
          background: "#faf8f3",
          padding: "100px 40px",
        }}
      >
        <div
          style={{
            maxWidth: 1000,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 32,
            }}
          >
            <div className="divider" />

            <span
              style={{
                ...s.eyebrow,
                color: s.gold,
                fontSize: 11,
              }}
            >
              What We Do
            </span>
          </div>

          <h2
            style={{
              ...s.display,
              fontSize: "clamp(36px,5vw,60px)",
              lineHeight: 1.1,
              color: s.forest,
              marginBottom: 40,
              fontWeight: 400,
            }}
          >
            Humanitarian care rooted
            <br />
            in <em style={{ color: s.gold, fontStyle: "italic" }}>practical action.</em>
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 60,
              alignItems: "start",
            }}
          >
            <p
              style={{
                ...s.body,
                color: "rgba(13,13,11,0.65)",
                fontSize: 16,
                margin: 0,
              }}
            >
              Greenforce Foundation Africa supports students, widows, vulnerable
              families, and underserved communities through educational
              sponsorships, feeding support, youth empowerment, healthcare
              interventions, mentorship, and emergency assistance.
            </p>

            <p
              style={{
                ...s.body,
                color: "rgba(13,13,11,0.65)",
                fontSize: 16,
                margin: 0,
              }}
            >
              Agriculture remains one of our strongest empowerment tools, but
              our mission extends far beyond farming. We help children remain in
              school, support exam registrations, provide hostel assistance,
              sponsor learning opportunities, and create systems that restore
              dignity and stability to families.
            </p>
          </div>
        </div>
      </section>

      <WhatsAppButton />
    </main>
  );
}
