"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

// Updated high-end Unsplash imagery matching agriculture, youth, and West African infrastructure themes
const ABOUT_HERO = "/aboutbanner.jpg";
const COOPERATIVE_IMG = "/unbroken.jpg";
const FOUNDER_IMG = "/founder.png"; 

const s = {
  eyebrow: { fontFamily: "'DM Sans', sans-serif", fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase" as const, fontWeight: 500 },
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

export default function AboutPage() {
  return (
    <main style={{ background: s.cream, color: s.ink, overflowX: "hidden" }}>
      
      {/* ── RESPONSIVE ENGINE & SYSTEM STYLES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        
        /* Layout Structure Sets */
        .flex-row-split { display: flex; flex-direction: row; gap: 60px; width: 100%; }
        .flex-col-stack { display: flex; flex-direction: column; }
        
        .half-width { width: 50%; }
        .third-width { width: 33.33%; }
        .two-thirds-width { width: 66.66%; }
        .quarter-width { width: 25%; }
        
        /* Mandate Item Typographical Adjustments */
        .mandate-block { padding: 60px 0; border-bottom: 1px solid rgba(13,13,11,0.1); }
        .mandate-text-large { font-size: clamp(24px, 3.5vw, 40px); line-height: 1.25; font-weight: 300; color: #0d0d0b; margin-bottom: 16px; }

        /* Media Queries across standard Viewports */
        @media (max-width: 991px) {
          .flex-row-split { flex-direction: column !important; gap: 40px !important; }
          .half-width, .third-width, .two-thirds-width, .quarter-width { width: 100% !important; }
          .side-padding-override { padding-left: 0 !important; }
          .asymmetric-spacer { margin-top: 40px !important; }
        }
        
        @media (max-width: 767px) {
          .section-padding { padding: 80px 24px !important; }
          .hero-padding { padding: 0 24px 60px !important; }
          .pillar-stack { gap: 48px !important; }
        }
      `}</style>

      {/* ══════════════════════════════
          SECTION 1: CINEMATIC HERO
          ══════════════════════════════ */}
      <section style={{ position: "relative", height: "80vh", minHeight: 550, display: "flex", alignItems: "flex-end", overflow: "hidden", background: s.ink }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <img
            src={ABOUT_HERO}
            alt="West African Agricultural Community Landscape"
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }}
          />
        </div>
        
        <div className="hero-padding" style={{ position: "relative", zIndex: 10, maxWidth: 1280, width: "100%", margin: "0 auto", padding: "0 60px 80px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <div style={{ width: 40, height: 1, background: s.gold }} />
            <span style={{ ...s.eyebrow, color: s.amber }}>Established September 2010</span>
          </div>
          <h1 style={{ ...s.display, fontSize: "clamp(42px, 6vw, 84px)", fontWeight: 300, color: s.white, lineHeight: 1.1, letterSpacing: "-0.02em", maxWidth: 900 }}>
            Discipline grows <br />
            to <em style={{ color: s.amber, fontStyle: "italic", fontWeight: 400 }}>dignity.</em>
          </h1>
        </div>
      </section>

      {/* ══════════════════════════════
          SECTION 2: BACKGROUND PERSPECTIVE & STANDOUT MISSION / VISION
          ══════════════════════════════ */}
      <section className="section-padding" style={{ padding: "140px 60px", maxWidth: 1280, margin: "0 auto" }}>
        <div className="flex-row-split">
          <div className="third-width">
            <span style={{ ...s.eyebrow, color: s.forest, display: "block", marginBottom: 16 }}>01 // Core Directives</span>
            <h2 style={{ ...s.display, fontSize: 32, fontWeight: 400, color: s.forest, lineHeight: 1.35 }}>
              What started as helping a single school hostel farm has grown into a West African mission.
            </h2>
            <p style={{ ...s.body, fontSize: 15, color: "rgba(13,13,11,0.6)", marginTop: 24 }}>
              Greenforce Foundation Africa was founded in 2010 out of a burden seen in Apam, Gomoa West. For over 15 years, we have stood by development, open administration, culture, and love. From classrooms to regional farms, true internal structural reformation precedes external elevation.
            </p>
          </div>
          
          <div className="two-thirds-width side-padding-override" style={{ paddingLeft: "60px", display: "flex", flexDirection: "column", gap: "40px" }}>
            
            {/* High-Impact Mission Box */}
            <div style={{ background: s.white, borderLeft: `4px solid ${s.forest}`, padding: "40px", boxShadow: "0 10px 30px rgba(0,0,0,0.02)", borderTop: `1px solid ${s.sand}`, borderRight: `1px solid ${s.sand}`, borderBottom: `1px solid ${s.sand}` }}>
              <span style={{ ...s.eyebrow, color: s.gold, display: "block", marginBottom: 12 }}>Our Mission</span>
              <p style={{ ...s.display, fontSize: "26px", color: s.ink, fontWeight: 400, lineHeight: 1.4, marginBottom: 16 }}>
                “Greenforce Foundation Africa exists to equip students, youth, and communities in Ghana and The Gambia with green skills, education, and character that create food security, income, and dignity.”
              </p>
              <p style={{ ...s.body, fontSize: 14, color: "rgba(13,13,11,0.5)", fontStyle: "italic" }}>
                Training hands, transforming hearts, growing dignity through green action.
              </p>
            </div>

            {/* High-Impact Vision Box */}
            <div style={{ background: s.forest, color: s.white, padding: "40px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
              <span style={{ ...s.eyebrow, color: s.amber, display: "block", marginBottom: 12 }}>Our Vision</span>
              <p style={{ ...s.display, fontSize: "26px", fontWeight: 300, lineHeight: 1.4, marginBottom: 16 }}>
                “Our vision is an Africa where every school is a centre of food production, and every young person, widow, and aged person lives with skill, dignity, and hope.”
              </p>
              <p style={{ ...s.body, fontSize: 14, color: "rgba(255,255,255,0.6)", fontStyle: "italic" }}>
                Discipline Grows to Dignity – From Apam to Africa.
              </p>
            </div>
            
            <div style={{ paddingTop: 20 }}>
              <blockquote style={{ ...s.display, fontSize: 22, fontStyle: "italic", color: s.forest, lineHeight: 1.5 }}>
                “No discipline seems pleasant at the time, but painful. Later on, however, it produces a harvest of righteousness and peace for those who have been trained by it.”
              </blockquote>
              <span style={{ ...s.eyebrow, color: s.gold, fontSize: 10, display: "block", marginTop: 12 }}>— Hebrews 12:11</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          SECTION 3: IMAGE BANNER INTERLUDE
          ══════════════════════════════ */}
      <section className="section-padding" style={{ padding: "0 60px 140px", maxWidth: 1280, margin: "0 auto" }}>
        <div className="flex-row-split" style={{ alignItems: "center" }}>
          <div className="half-width" style={{ height: "450px", position: "relative", overflow: "hidden" }}>
            <img 
              src={COOPERATIVE_IMG} 
              alt="Community action and regional collaboration" 
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div className="half-width asymmetric-spacer" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <span style={{ ...s.eyebrow, color: s.gold, display: "block", marginBottom: 12 }}>Continuous Infrastructure</span>
            <h3 style={{ ...s.display, fontSize: 28, color: s.ink, marginBottom: 16, fontWeight: 400 }}>A Real, Unbroken Regional Presence</h3>
            <p style={{ ...s.body, fontSize: 16, color: "rgba(13,13,11,0.65)" }}>
              We avoid seasonal intervention. Since late 2010, our physical operational presence has remained completely unbroken across the central regions of Ghana and regional Gambia.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          SECTION 4: SEQUENTIAL ACTION MANDATES
          ══════════════════════════════ */}
      <section className="section-padding" style={{ background: s.dust, padding: "140px 60px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 60 }}>
            <span style={{ ...s.eyebrow, color: "rgba(13,13,11,0.5)", display: "block", marginBottom: 12 }}>02 // Strategic Framework</span>
            <h2 style={{ ...s.display, fontSize: 44, fontWeight: 300, color: s.ink }}>The 7 Areas of Action</h2>
            <p style={{ ...s.eyebrow, color: s.gold, fontSize: 10, marginTop: 6 }}>Matthew 25:35-36 — “For I was hungry and you gave me food…”</p>
          </div>

          <div style={{ borderTop: "1px solid rgba(13,13,11,0.15)", marginTop: 40 }}>
            {[
              { num: "01", title: "Education For All", verse: "Proverbs 22:6", desc: "School support, scholarship funds, hostel improvements, and tailored teacher training. We believe no child in Apam or Banjul should be left behind." },
              { num: "02", title: "Agriculture", verse: "Genesis 2:15", desc: "School greenhouses, the Botsio Building Integrated Farm, and thriving community gardens. Training youth to sustainably feed themselves and their nation." },
              { num: "03", title: "Vocational Training", verse: "Deuteronomy 28:12", desc: "Equipping SHS leavers and dropouts with practical skills in farming, carpentry, catering, and ICT. Reclaiming personal dignity through the work of their hands." },
              { num: "04", title: "Health Care", verse: "3 John 1:2", desc: "Organizing targeted medical outreaches, providing vital NHIS registration support, and embedding hygiene education across local schools and hostels." },
              { num: "05", title: "Care for the Aged & Widows", verse: "James 1:27", desc: "Monthly food allocations, dedicated home visitations, and community dignity projects tailored for the elderly and widows in Apam and rural Gambia." },
              { num: "06", title: "Sport for Discipline", verse: "1 Corinthians 9:25", desc: "Utilizing football, track and field, and our annual GFA Inter-School Gala to teach teamwork, build healthy habits, and shield youth from vices." },
              { num: "07", title: "Evangelism for All Souls", verse: "Mark 16:15", desc: "Sharing the transformative love of Jesus Christ is at the center of all we do. We walk out our faith directly through school fellowships, regular hostel devotions, and vibrant community crusades." }
            ].map((m, i) => (
              <div key={i} className="mandate-block flex-row-split">
                <div className="third-width" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <span style={{ fontFamily: "monospace", fontSize: 14, color: s.gold, fontWeight: "600" }}>{m.num}</span>
                  <h3 className="mandate-text-large" style={{ ...s.display }}>{m.title}</h3>
                  <span style={{ ...s.eyebrow, fontSize: 10, color: "rgba(13,13,11,0.4)" }}>{m.verse}</span>
                </div>
                <div className="two-thirds-width style-body-override" style={{ display: "flex", alignItems: "center" }}>
                  <p style={{ ...s.body, fontSize: 18, color: "rgba(13,13,11,0.7)" }}>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          SECTION 5: REGIONAL MATRIX
          ══════════════════════════════ */}
      <section className="section-padding" style={{ padding: "140px 60px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ marginBottom: 60 }}>
          <span style={{ ...s.eyebrow, color: s.forest, display: "block", marginBottom: 12 }}>03 // Operational Matrix</span>
          <h2 style={{ ...s.display, fontSize: 40, fontWeight: 300, color: s.forest }}>Geographic Footprint</h2>
        </div>

        <div className="flex-row-split">
          <div className="half-width" style={{ background: s.white, padding: "40px", border: `1px solid ${s.sand}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: `1px solid ${s.sand}`, paddingBottom: 16, marginBottom: 24 }}>
              <h3 style={{ ...s.display, fontSize: 24, color: s.ink }}>Ghana Head Office</h3>
              <span style={{ ...s.eyebrow, color: "rgba(13,13,11,0.4)" }}>Est. Sept 2010</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <span style={{ ...s.eyebrow, fontSize: 9, color: s.gold }}>Headquarters Location</span>
                <p style={{ ...s.body, fontWeight: 500, fontSize: 15, marginTop: 2 }}>Apam, Gomoa West District, Central Region</p>
              </div>
              <div>
                <span style={{ ...s.eyebrow, fontSize: 9, color: s.gold }}>Flagship Infrastructure</span>
                <p style={{ ...s.body, fontSize: 14, color: "rgba(13,13,11,0.6)", marginTop: 2 }}>Apam Hostel Greenhouse – training 60 students yearly in modern farming tracks.</p>
              </div>
              <div>
                <span style={{ ...s.eyebrow, fontSize: 9, color: s.gold }}>Monthly Outreach Directive</span>
                <p style={{ ...s.body, fontSize: 14, color: "rgba(13,13,11,0.6)", marginTop: 2 }}>Dignity Packs allocated to 35 aged individuals and widows in Gomoa West.</p>
              </div>
              <div>
                <span style={{ ...s.eyebrow, fontSize: 9, color: s.gold }}>Primary State Partner</span>
                <p style={{ ...s.body, fontSize: 14, color: "rgba(13,13,11,0.6)", marginTop: 2 }}>Ghana Education Service (GES) Gomoa West District</p>
              </div>
            </div>
          </div>

          <div className="half-width" style={{ background: s.white, padding: "40px", border: `1px solid ${s.sand}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: `1px solid ${s.sand}`, paddingBottom: 16, marginBottom: 24 }}>
              <h3 style={{ ...s.display, fontSize: 24, color: s.ink }}>The Gambia Operations</h3>
              <span style={{ ...s.eyebrow, color: "rgba(13,13,11,0.4)" }}>Est. Dec 2010</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <span style={{ ...s.eyebrow, fontSize: 9, color: s.gold }}>Regional Scope</span>
                <p style={{ ...s.body, fontWeight: 500, fontSize: 15, marginTop: 2 }}>Banjul Region (Operational since December 2010)</p>
              </div>
              <div>
                <span style={{ ...s.eyebrow, fontSize: 9, color: s.gold }}>Core Directive</span>
                <p style={{ ...s.body, fontSize: 14, color: "rgba(13,13,11,0.6)", marginTop: 2 }}>Vocational training tracks, youth infrastructure development, and localized dignity deployment platforms.</p>
              </div>
              <div>
                <span style={{ ...s.eyebrow, fontSize: 9, color: s.gold }}>Primary State Partner</span>
                <p style={{ ...s.body, fontSize: 14, color: "rgba(13,13,11,0.6)", marginTop: 2 }}>Local Municipal Councils & Grassroots Ecclesiastical Bodies</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          SECTION 6: STACKED BRAND PILLARS
          ══════════════════════════════ */}
      <section className="section-padding" style={{ background: s.white, padding: "100px 60px", borderTop: `1px solid ${s.sand}`, borderBottom: `1px solid ${s.sand}` }}>
        <div className="flex-row-split pillar-stack" style={{ maxWidth: 1280, margin: "0 auto", gap: "24px" }}>
          {[
            { title: "Development", text: "We turn land, talent, and time into lasting progress. We build capable, structural self-sufficiency within communities.", verse: "Deuteronomy 28:12" },
            { title: "Open Administration", text: "Every single unit of localized currency (cedi or dalasi) remains completely accounted for. Transparency builds long-term trust.", verse: "Luke 16:10" },
            { title: "Culture", text: "We honor and preserve our beautiful Apam and Gambian heritage while simultaneously teaching modern agricultural innovation." },
            { title: "Love", text: "Discipline without love breaks; we correct to build up. The foundational mechanism supporting our entire network.", verse: "1 Corinthians 13:13" }
          ].map((val, i) => (
            <div key={i} className="quarter-width" style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ ...s.display, fontSize: 36, color: "rgba(30,61,26,0.12)", fontWeight: 700, lineHeight: 1 }}>0{i+1}</span>
              <h4 style={{ ...s.display, fontSize: 19, fontWeight: 500, color: s.forest, marginTop: 12, marginBottom: 6 }}>{val.title}</h4>
              {val.verse && <span style={{ ...s.eyebrow, color: s.gold, fontSize: 9, marginBottom: 8 }}>{val.verse}</span>}
              <p style={{ ...s.body, fontSize: 14, color: "rgba(13,13,11,0.6)" }}>{val.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════
          SECTION 7: LEADERSHIP ECOSYSTEM
          ══════════════════════════════ */}
      <section className="section-padding" style={{ padding: "140px 60px", maxWidth: 1280, margin: "0 auto" }}>
        <div className="flex-row-split" style={{ alignItems: "flex-start" }}>
          <div className="half-width">
            <div style={{ 
              position: "relative", 
              width: "100%", 
              aspectRatio: "4/5", 
              background: s.sand,
              WebkitClipPath: "polygon(12% 0%, 100% 0%, 100% 88%, 88% 100%, 0% 100%, 0% 12%)",
              clipPath: "polygon(12% 0%, 100% 0%, 100% 88%, 88% 100%, 0% 100%, 0% 12%)",
              overflow: "hidden" 
            }}>
              <img
                src={FOUNDER_IMG}
                alt="Victor Tokunbo Ogundipe - Executive Director"
                style={{ 
                  width: "100%", 
                  height: "100%", 
                  objectFit: "cover"
                }}
              />
            </div>

            {/* Practical Operational Contact Specs */}
            <div style={{ marginTop: "32px", padding: "24px", border: `1px solid ${s.sand}`, background: "rgba(255,255,255,0.3)" }}>
              <span style={{ ...s.eyebrow, color: s.gold, fontSize: 10, display: "block", marginBottom: 12 }}>Executive Contacts</span>
              <p style={{ ...s.body, fontSize: 14, color: s.ink, marginBottom: 6 }}>
                <strong>Office:</strong> Near Botsio Building, Apam, Central Region, Ghana
              </p>
              <p style={{ ...s.body, fontSize: 14, color: s.ink, marginBottom: 6 }}>
                <strong>Email:</strong> info@greenforceafrica.org
              </p>
              <p style={{ ...s.body, fontSize: 14, color: s.ink }}>
                <strong>Availability:</strong> Saturdays 8am - 11am GMT for structured project visits
              </p>
            </div>
          </div>

          <div className="half-width side-padding-override" style={{ display: "flex", flexDirection: "column", gap: "20px", paddingLeft: "40px" }}>
            <span style={{ ...s.eyebrow, color: s.forest }}>04 // Leadership Profile</span>
            <h2 style={{ ...s.display, fontSize: 40, fontWeight: 400, color: s.forest, marginBottom: 0 }}>Victor Tokunbo Ogundipe</h2>
            <p style={{ ...s.eyebrow, color: s.gold, fontSize: 11, letterSpacing: "0.15em", marginTop: -5 }}>
              Founder & Executive Director // Educationist | Administrator | Humanitarian Worker
            </p>
            
            <div style={{ width: 48, height: 1, background: s.sand, margin: "4px 0" }} />
            
            <div style={{ ...s.body, fontSize: 15, color: "rgba(13,13,11,0.65)", display: "flex", flexDirection: "column", gap: 14 }}>
              <p>
                Victor Tokunbo Ogundipe is the Founder and Executive Director of Greenforce Foundation Africa. For over 15 years, he has served communities across Ghana and The Gambia through synchronized actions in education, agriculture, humanitarian care, and strategic youth development tracks.
              </p>
              <p>
                <strong>Current Statutory Role:</strong> He acts as the Assistant Head of Department for Languages within the framework of the Ghana Education Service (GES), Gomoa West District, Central Region. He elegantly combines classroom teaching with cross-border humanitarian leadership to raise students with both deep academic excellence and practical lifestyle skills.
              </p>
              
              <h4 style={{ ...s.display, fontSize: 18, color: s.forest, marginTop: 10, fontWeight: 500 }}>Professional Background & Governance Roles</h4>
              <ul style={{ paddingLeft: 20, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                <li><strong>Language Instruction:</strong> Veteran Language Teacher across Junior and Senior High Schools.</li>
                <li><strong>GES Leadership Mandates:</strong> Assistant HOD of the Language Department, Head of the Discipline Committee, Head of Internal & External Examinations, and Head of Records & Recovery.</li>
                <li><strong>School & Hostel Management:</strong> Former Head of Charity International Senior High School & Hostel Manager.</li>
                <li><strong>Development Work Frameworks:</strong> Former Labour Officer for an international Construction Company, specializing in cross-functional project management and manual workforce training.</li>
              </ul>
            </div>

            <div style={{ background: s.forest, color: s.white, padding: "28px 32px", marginTop: 8 }}>
              <p style={{ ...s.display, fontSize: 18, fontStyle: "italic", lineHeight: 1.5, marginBottom: 8 }}>
                “We are not just running an NGO. We are raising a generation that works the land and walks in love.”
              </p>
              <span style={{ ...s.eyebrow, color: s.amber, fontSize: 10 }}>— Victor T. Ogundipe</span>
            </div>

            <div style={{ marginTop: 8 }}>
              <p style={{ ...s.body, fontSize: 14, color: "rgba(13,13,11,0.6)" }}>
                <strong>Philosophical Approach:</strong> Victor firmly believes Africa’s strategic transformation begins when schools become vibrant, productive centres of food production and rigorous character formation. To truly “train up a child” (Proverbs 22:6) means giving them a functional certificate in one hand and a practical skill in the other.
              </p>
            </div>

            <Link href="/contact" style={{ ...s.eyebrow, color: s.ink, fontSize: 11, marginTop: 16, display: "inline-flex", alignItems: "center", gap: 8 }}>
              Request Consultation & Site Access <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          SECTION 8: REGULATORY PROFILE
          ══════════════════════════════ */}
      <section className="section-padding" style={{ background: s.white, borderTop: `1px solid ${s.sand}`, padding: "60px" }}>
        <div className="flex-row-split" style={{ maxWidth: 1280, margin: "0 auto", alignItems: "center" }}>
          <div className="two-thirds-width">
            <p style={{ ...s.body, fontSize: 12, color: "rgba(13,13,11,0.45)", lineHeight: 1.6 }}>
              <strong>STATUTORY COMPLIANCE NOTICE:</strong> Greenforce Foundation Africa holds valid independent non-governmental organization (NGO) corporate charters within the sovereign registries of the Republic of Ghana (Inception: Sept 2010) and the Republic of The Gambia (Inception: Dec 2010). All regional operations are verified in strict accordance with cross-border NGO validation frameworks and Open Administration accountability standards.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          SECTION 9: MONOLITHIC CALL TO ACTION
          ══════════════════════════════ */}
      <section className="section-padding" style={{ background: s.forest, color: s.white, padding: "120px 60px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20, alignItems: "center" }}>
          <h2 style={{ ...s.display, fontSize: 48, fontWeight: 300 }}>Support Our Mission</h2>
          <p style={{ ...s.body, fontSize: 16, color: "rgba(255,255,255,0.5)" }}>
            Operational capital directly drives infrastructure, educational scaling, and targeted human rights protections across West Africa.
          </p>
          <Link href="/donate" style={{
            background: s.amber, color: s.ink, padding: "18px 44px", marginTop: "16px",
            ...s.eyebrow, fontSize: 12, fontWeight: 500, letterSpacing: "0.2em", textDecoration: "none"
          }}>
            Support Our Mission
          </Link>
        </div>
      </section>

    </main>
  );
}
