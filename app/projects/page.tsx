"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Heart, ArrowRight, Home, Leaf, ShieldCheck, GraduationCap, ClipboardList } from "lucide-react";

// Asset URLs
const PROJ_HERO = "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1800&q=85&auto=format&fit=crop";
const GH1 = "/hostel.jpg";
const YOUTH2 = "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&q=85&auto=format&fit=crop";
const YOUTH1 = "/farmland.png";
const GH2 = "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&q=85&auto=format&fit=crop";
const EDU1 = "/agriedu.jpg";
const EDU2 = "/smilingboy.jpg";

const s = {
  eyebrow: { fontFamily: "'DM Sans', sans-serif", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase" as const, fontWeight: 500 },
  display: { fontFamily: "'Playfair Display', Georgia, serif" },
  body: { fontFamily: "'DM Sans', sans-serif", fontWeight: 300, lineHeight: 1.8 },
  ink: "#0d0d0b",
  cream: "#faf8f3",
  dust: "#f2ede3",
  sand: "#e4dccf",
  gold: "#c9992a",
  amber: "#e8b84b",
  forest: "#1e3d1a",
  white: "#ffffff",
};

function useRevealAll() {
  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export default function ProjectsPage() {
  useRevealAll();

  return (
    <main style={{ background: s.cream, color: s.ink, overflowX: "hidden" }}>
      
      {/* ── RESPONSIVE ENGINE & SYSTEM STYLES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght=0,300;0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        
        .flex-row-split { display: flex; flex-direction: row; gap: 60px; width: 100%; align-items: center; }
        .half-width { width: 50%; }
        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
        .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px; }
        
        /* Table layout styling */
        .table-container { width: 100%; overflow-x: auto; margin-top: 24px; border: 1px solid ${s.sand}; background: ${s.white}; }
        .custom-table { width: 100%; border-collapse: collapse; text-align: left; font-family: 'DM Sans', sans-serif; font-size: 14px; }
        .custom-table th { background: ${s.dust}; padding: 16px; font-weight: 500; color: ${s.forest}; border-bottom: 1px solid ${s.sand}; }
        .custom-table td { padding: 16px; border-bottom: 1px solid ${s.dust}; color: rgba(13,13,11,0.8); }
        .custom-table tr:last-child td { border-bottom: none; font-weight: bold; background: ${s.dust}; }

        /* Reveal Animation Engine */
        .reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .reveal.visible { opacity: 1; transform: translateY(0); }

        /* Timeline Connector Accents */
        .timeline-bar { position: relative; }
        .timeline-bar::after { content: ''; position: absolute; left: 50%; bottom: -60px; width: 1px; height: 60px; background: ${s.sand}; transform: translateX(-50%); }

        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.5; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.5; }
        }

        /* Media Query Viewport Adaptations */
        @media (max-width: 991px) {
          .flex-row-split { flex-direction: column !important; gap: 50px !important; }
          .half-width { width: 100% !important; }
          .responsive-order-swap { order: 2 !important; }
          .image-cluster-offset { margin-top: 0 !important; }
          .grid-3, .grid-2 { grid-template-columns: 1fr !important; gap: 24px !important; }
          .timeline-bar::after { display: none; }
        }
        
        @media (max-width: 767px) {
          .section-padding { padding: 80px 24px !important; }
          .hero-padding { padding: 0 24px 60px !important; }
        }
      `}</style>

      {/* ══════════════════════════════
          HERO SECTION
          ══════════════════════════════ */}
      <section style={{ position: "relative", height: "80vh", minHeight: 600, display: "flex", alignItems: "flex-end", overflow: "hidden", background: s.ink }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <img
            src={PROJ_HERO}
            alt="Apam agricultural development and community care"
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.45 }}
          />
        </div>
        
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,13,11,0.95), rgba(13,13,11,0.3) 70%, transparent)" }} />
        
        <div className="hero-padding" style={{ position: "relative", zIndex: 10, maxWidth: 1280, width: "100%", margin: "0 auto", padding: "0 60px 80px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <div style={{ width: 40, height: 1, background: s.gold }} />
            <span style={{ ...s.eyebrow, color: s.amber }}>Apam • Banjul • Africa</span>
          </div>
          <h1 style={{ ...s.display, fontSize: "clamp(36px, 5vw, 72px)", fontWeight: 300, color: s.white, lineHeight: 1.15, letterSpacing: "-0.02em", maxWidth: 1000 }}>
            We house them. We feed them. <br />
            We train them. <br />
            <em style={{ color: s.amber, fontStyle: "italic", fontWeight: 400 }}>Sending them out with dignity.</em>
          </h1>
        </div>
      </section>
      
      {/* ── LIVE DATA BULLETIN ACCENT BAR ── */}
      <section style={{ background: s.forest, color: s.white, padding: "28px 24px", position: "relative", zIndex: 11 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ display: "inline-block", width: 8, height: 8, background: s.amber, borderRadius: "50%", animation: "pulse 2s infinite" }} />
            <span style={{ ...s.eyebrow, color: s.amber }}>Current 2026 Milestone Tracker</span>
          </div>
          <p style={{ ...s.body, fontSize: "15px", margin: 0, flex: "1 1 500px", opacity: 0.9 }}>
            Our top-tier cohort of <strong>10 female candidates</strong> from Charity International Hostel are currently completing their final lap sitting for the <strong>WASSCE examinations this May/June 2026</strong>.
          </p>
          <div style={{ borderLeft: `1px solid rgba(255,255,255,0.2)`, paddingLeft: "20px" }}>
            <span style={{ ...s.display, fontSize: "14px", fontStyle: "italic", color: s.amber }}>100% Retained in Education</span>
          </div>
        </div>
      </section>

      {/* ── CHAPTER 01: THE SAFE FOUNDATION (HOSTEL OPERATION) ── */}
      <section className="section-padding timeline-bar" style={{ padding: "120px 60px", maxWidth: 1280, margin: "0 auto" }}>
        <div className="flex-row-split reveal">
          
          <div className="half-width">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <span style={{ ...s.display, fontSize: "18px", color: s.gold, fontStyle: "italic" }}>Chapter 01</span>
              <div style={{ width: 24, height: 1, background: s.sand }} />
              <span style={{ ...s.eyebrow, color: s.forest }}>Sustenance & Shelter</span>
            </div>
            
            <h2 style={{ ...s.display, fontSize: "clamp(32px, 3.8vw, 48px)", color: s.forest, lineHeight: 1.15, marginBottom: 24 }}>
              Charity International Hostel: <br />Eliminating the Distance Barrier
            </h2>
            
            <div style={{ ...s.body, fontSize: "16px", color: "rgba(13,13,11,0.75)", display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
              <p>
                To learn, a child must first be safe. Bright minds from isolated outer villages in Gomoa West drop out at alarming rates simply because secondary schools are miles away, leaving paths exposed to economic exploitation or dangerous daily commutes.
              </p>
              <p>
                We serve as a protective sanctuary. The Hostel removes the physical vulnerabilities of poverty, allowing chosen scholars to place full, undivided focus on their educational outcomes.
              </p>
            </div>

            <div style={{ background: s.white, border: `1px solid ${s.sand}`, padding: "28px", borderRadius: 4, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }} className="grid-2">
              <div>
                <h4 style={{ ...s.eyebrow, fontSize: 10, color: s.gold, marginBottom: 8 }}>Absolute Care Setups</h4>
                <p style={{ ...s.body, fontSize: 14, margin: 0, color: "rgba(13,13,11,0.7)" }}>Secure boarding utilities, 3 warm nutritional meals daily, curriculum textbooks, and dedicated evening study prep modules.</p>
              </div>
              <div>
                <h4 style={{ ...s.eyebrow, fontSize: 10, color: s.gold, marginBottom: 8 }}>Character Building</h4>
                <p style={{ ...s.body, fontSize: 14, margin: 0, color: "rgba(13,13,11,0.7)" }}>Daily value-driven devotions, mental counseling avenues, and emotional mentorship under dedicated volunteer care supervisors.</p>
              </div>
            </div>
          </div>

          <div className="half-width" style={{ position: "relative" }}>
            <img 
              src={GH1} 
              alt="Safe sanctuary and community housing" 
              style={{ width: "100%", height: "500px", objectFit: "cover", borderRadius: 4, boxShadow: "0 20px 40px rgba(0,0,0,0.04)" }} 
            />
            <div style={{ position: "absolute", bottom: -24, left: -24, background: s.forest, color: s.white, padding: "24px", maxWidth: "280px", borderRadius: 4 }}>
              <p style={{ ...s.display, fontSize: "15px", fontStyle: "italic", margin: 0, opacity: 0.85, lineHeight: 1.4 }}>
                “I was a stranger and you invited me in.”
              </p>
              <span style={{ ...s.eyebrow, fontSize: "9px", color: s.amber, display: "block", marginTop: 8 }}>— Matthew 25:35</span>
            </div>
          </div>

        </div>
      </section>

      {/* ── CHAPTER 02: THE PRODUCTION SKILL (THE CONTROLLED GREENHOUSE) ── */}
      <section style={{ background: s.dust, width: "100%" }}>
        <div className="section-padding timeline-bar" style={{ padding: "120px 60px", maxWidth: 1280, margin: "0 auto" }}>
          <div className="flex-row-split reveal">
            
            <div className="half-width responsive-order-swap" style={{ position: "relative" }}>
              <img 
                src={GH2} 
                alt="Students running controlled modern farming systems" 
                style={{ width: "100%", height: "520px", objectFit: "cover", borderRadius: 4 }} 
              />
              <div style={{ position: "absolute", top: 24, left: 24, background: s.amber, color: s.ink, padding: "12px 20px", borderRadius: 4 }}>
                <span style={{ ...s.eyebrow, fontSize: 10, fontWeight: "bold" }}>Location: Botsio Premises</span>
              </div>
            </div>

            <div className="half-width">
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <span style={{ ...s.display, fontSize: "18px", color: s.gold, fontStyle: "italic" }}>Chapter 02</span>
                <div style={{ width: 24, height: 1, background: s.sand }} />
                <span style={{ ...s.eyebrow, color: s.forest }}>Applied Technical Training</span>
              </div>
              
              <h2 style={{ ...s.display, fontSize: "clamp(32px, 3.8vw, 48px)", color: s.forest, lineHeight: 1.15, marginBottom: 24 }}>
                The Apam Greenhouse System: <br />From Survival to Mastery
              </h2>
              
              <div style={{ ...s.body, fontSize: "16px", color: "rgba(13,13,11,0.75)", display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
                <p>
                  Shelter keeps a child safe today; skills make them independent tomorrow. Stationed right on our facility grounds, our 30m × 12m climate-controlled greenhouse turns abstract science into direct business enterprise management.
                </p>
                <p>
                  Hostel students don't just consume food—they learn how to orchestrate its growth cycle. By handling automated drip machinery and biological soil controls, they step completely out of traditional, low-yield manual labor models.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ background: s.white, color: s.forest, padding: 8, borderRadius: "50%" }}><Leaf size={18} /></div>
                  <div>
                    <h4 style={{ ...s.body, fontWeight: "bold", margin: "0 0 4px 0", fontSize: 15 }}>Circular Farm-to-Table Economy</h4>
                    <p style={{ ...s.body, fontSize: 14, margin: 0, color: "rgba(13,13,11,0.7)" }}>High-nutrient agricultural yields grown in the greenhouse flow straight into the student dining hall kitchen, cutting project overhead costs.</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ background: s.white, color: s.forest, padding: 8, borderRadius: "50%" }}><ClipboardList size={18} /></div>
                  <div>
                    <h4 style={{ ...s.body, fontWeight: "bold", margin: "0 0 4px 0", fontSize: 15 }}>Operational Literacy</h4>
                    <p style={{ ...s.body, fontSize: 14, margin: 0, color: "rgba(13,13,11,0.7)" }}>Students run logbook tracking systems, calculate crop weight inputs vs financial market evaluations, and practice supply chain distribution.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── THE HUMAN CORE: LIVING TESTIMONY ── */}
      <section className="section-padding" style={{ padding: "100px 24px", background: s.white, textAlign: "center" }}>
        <div style={{ maxWidth: 850, margin: "0 auto" }} className="reveal">
          <span style={{ ...s.eyebrow, color: s.gold }}>The Narrative Proof</span>
          <p style={{ ...s.display, fontSize: "clamp(24px, 3.2vw, 36px)", fontStyle: "italic", lineHeight: 1.45, color: s.ink, marginTop: 16, marginBottom: 32 }}>
            “Before discovering GFA Hostel, I spent 2 hours every morning trekking to campus under the hot sun. I was constantly exhausted, hungry, and falling behind. Now I live footsteps away, receive proper nourishment, and run crop cycles inside the greenhouse. I hold a clear vision to graduate as an Agricultural Officer.”
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <div style={{ width: 16, height: 1, background: s.gold }} />
            <span style={{ ...s.eyebrow, fontSize: 12, color: s.forest, transform: "none" }}>Ama · SHS Grade 2 Scholar</span>
          </div>
        </div>
      </section>

      {/* ── TRANSPARENT INVESTOR BUDGET GRID ── */}
      <section className="section-padding" style={{ padding: "100px 60px", maxWidth: 1280, margin: "0 auto" }}>
        <div className="reveal" style={{ marginBottom: 48 }}>
          <span style={{ ...s.eyebrow, color: s.gold }}>Financial Stewardship Ledger</span>
          <h2 style={{ ...s.display, fontSize: "36px", color: s.forest, marginTop: 8, marginBottom: 16 }}>Unified Sponsorship Allocations</h2>
          <p style={{ ...s.body, fontSize: "16px", color: "rgba(13,13,11,0.7)", maxWidth: 720, margin: 0 }}>
            Every allocation serves a dual human purpose. GHS 2,400 funds a student's safety matrix (Hostel) while resourcing their technical workspace infrastructure (Greenhouse) for a full calendar year.
          </p>
        </div>

        <div className="table-container reveal">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Programmatic Segment</th>
                <th>Per Term / Scholar</th>
                <th>Annual Ledger Total (60 Scholar Cap)</th>
                <th>Direct Functional Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Hostel Structural Placement</strong></td>
                <td>GHS 400</td>
                <td>GHS 24,000</td>
                <td>Handles utility overheads, facilities upkeep, and secure living space provisions.</td>
              </tr>
              <tr>
                <td><strong>Nutritional Controls</strong></td>
                <td>GHS 600</td>
                <td>GHS 36,000</td>
                <td>Guarantees 3 healthy daily meals per scholar across complete educational calendar terms.</td>
              </tr>
              <tr>
                <td><strong>Academic Supplies</strong></td>
                <td>GHS 100</td>
                <td>GHS 6,000</td>
                <td>Secures core WAEC syllabus textbooks, reference files, and learning stationery sets.</td>
              </tr>
              <tr>
                <td><strong>Clinical Guardrails & Guidance</strong></td>
                <td>GHS 100</td>
                <td>GHS 6,000</td>
                <td>Covers emergency health medical buffers, clinic access runs, and structural mentorship.</td>
              </tr>
              <tr>
                <td><strong>Greenhouse Applied Training</strong></td>
                <td>GHS 1,200</td>
                <td>GHS 72,000</td>
                <td>Secures high-grade heirloom seed lots, drip line valves, and technical advisory support.</td>
              </tr>
              <tr style={{ fontWeight: "bold", background: s.dust }}>
                <td>COMBINED OPERATIONAL TARGET</td>
                <td>GHS 2,400</td>
                <td>GHS 144,000</td>
                <td>The Complete Ecosystem: Total Child Custody + Advanced Enterprise Skill Acquisition.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginTop: "32px" }} className="grid-2 reveal">
          <div style={{ background: s.white, padding: "24px", borderLeft: `4px solid ${s.gold}`, borderRadius: 4 }}>
            <p style={{ ...s.body, margin: 0, fontSize: "14px", color: "rgba(13,13,11,0.8)" }}>
              <strong>GHS 1,200 Impact:</strong> Establishes 1 full year of absolute residential protection OR finances a student's complete practical agronomy lab toolkit.
            </p>
          </div>
          <div style={{ background: s.white, padding: "24px", borderLeft: `4px solid ${s.forest}`, borderRadius: 4 }}>
            <p style={{ ...s.body, margin: 0, fontSize: "14px", color: "rgba(13,13,11,0.8)" }}>
              <strong>GHS 100 Impact:</strong> Completely provides all nutritional food inputs for a student across two continuous weeks of intensive study prep.
            </p>
          </div>
        </div>
      </section>

      {/* ── CHAPTER 03: THE HORIZON EXTENSIONS (COMMUNITY PIPELINES) ── */}
      <section style={{ background: s.dust, width: "100%" }}>
        <div className="section-padding" style={{ padding: "120px 60px", maxWidth: 1280, margin: "0 auto" }}>
          
          <div style={{ textAlign: "center", marginBottom: "80px" }} className="reveal">
            <span style={{ ...s.display, fontSize: "18px", color: s.gold, fontStyle: "italic" }}>Chapter 03</span>
            <h2 style={{ ...s.display, fontSize: "clamp(32px, 4vw, 52px)", color: s.forest, marginTop: 8 }}>
              Community Scaling: Transforming the Whole Region
            </h2>
            <div style={{ width: 40, height: 1, background: s.gold, margin: "24px auto" }} />
          </div>

          {/* EXTENSION SUB-PROJECT A */}
          <div className="flex-row-split reveal" style={{ marginBottom: "120px" }}>
            <div className="half-width">
              <span style={{ ...s.eyebrow, color: s.gold }}>Project Extension 02 // Infrastructure Focus</span>
              <h3 style={{ ...s.display, fontSize: "28px", color: s.forest, marginTop: 12, marginBottom: 20 }}>
                Botsio Building Integrated Farm Complex
              </h3>
              <p style={{ ...s.body, color: "rgba(13,13,11,0.7)", fontSize: "16px", marginBottom: 24 }}>
                Dignity must stretch outward. Bordering our main residential layout properties, we are actively setting foundations for a 2-acre agricultural extension designed to blend diverse organic systems with vocational training loops.
              </p>
              <ul style={{ ...s.body, paddingLeft: 20, margin: "0 0 32px 0", display: "flex", flexDirection: "column", gap: 12, color: "rgba(13,13,11,0.75)" }}>
                <li><strong>Open Field Modules:</strong> Local leafy green production areas to expand local food supply access points.</li>
                <li><strong>Small Livestock Coops:</strong> Safe poultry blocks providing hands-on knowledge of livestock care.</li>
                <li><strong>Composting Stations:</strong> Transforming facility kitchen scrap directly into high-yield organic manure layers.</li>
              </ul>
              <Link href="/donate" style={{ display: "inline-flex", alignItems: "center", gap: 12, ...s.eyebrow, color: s.forest, textDecoration: "none", fontWeight: "bold" }}>
                Partner with the Extension <ArrowRight size={14} />
              </Link>
            </div>
            
            <div className="half-width" style={{ display: "flex", gap: "20px" }}>
              <img src={YOUTH1} alt="Farm blueprint setup" style={{ width: "50%", height: "380px", objectFit: "cover", borderRadius: 4, marginTop: "40px" }} className="image-cluster-offset" />
              <img src={YOUTH2} alt="Livestock production blocks" style={{ width: "50%", height: "380px", objectFit: "cover", borderRadius: 4 }} />
            </div>
          </div>

          {/* EXTENSION SUB-PROJECT B */}
          <div className="flex-row-split reveal">
            <div className="half-width" style={{ display: "flex", gap: "20px" }}>
              <img src={EDU2} alt="Vocational student training sessions" style={{ width: "50%", height: "380px", objectFit: "cover", borderRadius: 4 }} />
              <img src={EDU1} alt="Practical technology labs" style={{ width: "50%", height: "380px", objectFit: "cover", borderRadius: 4, marginTop: "40px" }} className="image-cluster-offset" />
            </div>

            <div className="half-width">
              <span style={{ ...s.eyebrow, color: s.gold }}>Project Extension 03 // Programmatic Sessions</span>
              <h3 style={{ ...s.display, fontSize: "28px", color: s.forest, marginTop: 12, marginBottom: 20 }}>
                Youth Agri-Business Bootcamp Framework
              </h3>
              <p style={{ ...s.body, color: "rgba(13,13,11,0.7)", fontSize: "16px", marginBottom: 24 }}>
                We believe in planting seeds during recess. Every August and December, we activate a multi-week technical training incubator for local JHS and SHS youth across Apam to combat youth unemployment.
              </p>
              <p style={{ ...s.body, color: "rgba(13,13,11,0.7)", fontSize: "16px", marginBottom: 32 }}>
                Attending cohorts step away from text-heavy theory, practicing high-density vertical backyard farming using recycled sacks, budget spreadsheets, and local market transaction models.
              </p>
              <Link href="/donate" style={{ background: s.forest, color: s.white, padding: "16px 32px", borderRadius: 4, ...s.eyebrow, textDecoration: "none", display: "inline-block" }}>
                Sponsor Bootcamp Training Seats
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ── SYSTEM POLICIES & ACCOUNTABILITY ── */}
      <section className="section-padding" style={{ padding: "100px 60px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ background: s.white, border: `1px solid ${s.sand}`, padding: "48px", borderRadius: 4 }} className="reveal">
          <h4 style={{ ...s.display, fontSize: "24px", color: s.forest, marginTop: 0, marginBottom: 32 }}>Our System Management Warranties</h4>
          <div className="grid-3">
            <div>
              <h5 style={{ ...s.body, fontWeight: "bold", margin: "0 0 10px 0", fontSize: 16 }}>100% Direct Utilization</h5>
              <p style={{ ...s.body, fontSize: 14, margin: 0, color: "rgba(13,13,11,0.65)", lineHeight: 1.7 }}>Zero structural administrative cuts. Every single coin donated funds field installations and student upkeep under volunteer tracking supervision.</p>
            </div>
            <div>
              <h5 style={{ ...s.body, fontWeight: "bold", margin: "0 0 10px 0", fontSize: 16 }}>Continuous Reporting</h5>
              <p style={{ ...s.body, fontSize: 14, margin: 0, color: "rgba(13,13,11,0.65)", lineHeight: 1.7 }}>Sponsors receive direct academic report cards linked with structured photographic logs of their assigned scholar's agronomic growth progress.</p>
            </div>
            <div>
              <h5 style={{ ...s.body, fontWeight: "bold", margin: "0 0 10px 0", fontSize: 16 }}>Open Site Auditing</h5>
              <p style={{ ...s.body, fontSize: 14, margin: 0, color: "rgba(13,13,11,0.65)", lineHeight: 1.7 }}>Donors hold permanent open permission rights to inspect our greenhouses and living quarters in Apam in person every Saturday morning.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER BLUEPRINT STRIP ── */}
      <section className="section-padding" style={{ padding: "0 60px 100px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ background: s.forest, padding: "60px", color: s.white, borderRadius: 4 }} className="reveal">
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "32px", flexDirection: "row" }} className="flex-row-split">
            <div>
              <h3 style={{ ...s.display, fontSize: "28px", color: s.white, margin: "0 0 12px 0" }}>Ready to play a role in this ecosystem?</h3>
              <p style={{ ...s.body, color: "rgba(255,255,255,0.6)", margin: 0, fontSize: "15px" }}>Join us on the ground to turn systemic poverty into generational self-reliance.</p>
            </div>
            <Link href="/contact" style={{ background: s.amber, color: s.ink, padding: "16px 36px", borderRadius: 4, ...s.eyebrow, fontWeight: "bold", textDecoration: "none", whiteSpace: "nowrap" }}>
              Connect with us
            </Link>
          </div>
          <div style={{ height: "1px", background: "rgba(255,255,255,0.1)", margin: "40px 0 24px 0" }} />
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "16px", opacity: 0.7, fontSize: "13px" }}>
            <span>Greenforce Foundation Africa • Est. Ghana & The Gambia 2010</span>
            <span style={{ fontStyle: "italic", color: s.amber }}>Child + Skill + Food = Unbreakable Future.</span>
          </div>
        </div>
      </section>

    </main>
  );
}
