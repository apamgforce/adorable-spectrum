import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const s = {
  ink: "#0d0d0b",
  cream: "#faf8f3",
  dust: "#f2ede3",
  sand: "#e4dccf",
  gold: "#c9992a",
  amber: "#e8b84b",
  forest: "#1e3d1a",
  white: "#ffffff",
};

export default function Footer() {
  return (
    <footer style={{ background: s.ink, color: s.white }}>
      {/* CSS Hover Injector Engine */}
      <style>{`
        .footer-social-icon-btn {
          display: flex; align-items: center; justify-content: center;
          width: 44px; height: 44px; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.15); 
          color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.03);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .footer-social-icon-btn:hover {
          border-color: ${s.amber} !important; 
          color: ${s.ink} !important; 
          background: ${s.amber} !important;
          transform: translateY(-3px);
        }
        .footer-nav-link {
          font-family: 'DM Sans', sans-serif; text-decoration: none; 
          color: rgba(255,255,255,0.6); font-size: 0.875rem; transition: color 0.3s ease;
        }
        .footer-nav-link:hover {
          color: ${s.white} !important;
        }
        .footer-btn-cta {
          display: inline-block; margin-top: 24px; background: ${s.forest}; 
          color: ${s.white}; font-size: 0.875rem; font-weight: 500; 
          font-family: 'DM Sans', sans-serif; padding: 10px 20px; 
          border-radius: 9999px; text-decoration: none; border: 1px solid ${s.white}; 
          transition: all 0.3s ease;
        }
        .footer-btn-cta:hover {
          background: ${s.amber} !important; color: ${s.ink} !important; border-color: ${s.amber} !important;
        }
        .footer-attribution-link {
          color: rgba(255,255,255,0.4);
          text-decoration: none;
          transition: color 0.3s ease;
        }
        .footer-attribution-link:hover {
          color: ${s.amber} !important;
        }
      `}</style>

      {/* ── SCRIPTURE BANNER ── */}
      <div style={{ background: `linear-gradient(90deg, ${s.forest} 0%, ${s.gold} 50%, ${s.amber} 100%)`, padding: "20px 24px" }}>
        <p style={{ textAlign: "center", fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.25rem", fontStyle: "italic", color: "rgba(255,255,255,0.95)", maxWidth: "48rem", margin: "0 auto", lineHeight: 1.5 }}>
          &ldquo;Train up a child in the way he should go; even when he is old he will not depart from it.&rdquo;
          <span style={{ display: "block", fontSize: "0.875rem", fontFamily: "'DM Sans', sans-serif", fontStyle: "normal", marginTop: "4px", color: "rgba(255,255,255,0.8)" }}>
            — Proverbs 22:6
          </span>
        </p>
      </div>

      {/* ── MAIN CONTENT GRID ── */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "64px 24px 40px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "48px" }}>
        
        {/* Brand Column */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "6px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <img 
                src="/logo.jpg" 
                alt="VTO Greenforce Foundation Africa Logo" 
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            <div>
              <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.125rem", fontWeight: 600, color: s.white, display: "block", lineHeight: 1.2 }}>
                VTO Greenforce
              </span>
              <span style={{ fontSize: "0.75rem", display: "block", color: "rgba(255,255,255,0.6)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                Foundation Africa
              </span>
            </div>
          </div>

          {/* VISIBLE & LOUD MOTTO BRANDING EDGE */}
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", fontWeight: 600, color: s.gold, letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 16px 0", lineHeight: 1.4 }}>
            Connecting opportunities to outstanding possibilities
          </p>

          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.8, margin: 0 }}>
            Rooting youth in purpose — through agriculture, education, and the timeless values that grow lasting communities across West Africa.
          </p>
        </div>

        {/* Links Column */}
        <div>
          <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: s.amber, marginBottom: "20px" }}>
            Navigate
          </h3>
          <ul style={{ listStyleType: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { href: "/", label: "Home" },
              { href: "/about", label: "About Us" },
              { href: "/projects", label: "Our Projects" },
              { href: "/gallery", label: "Gallery" },
              { href: "/contact", label: "Contact" },
              { href: "/donate", label: "Donate Now" },
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="footer-nav-link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Programs Column */}
        <div>
          <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: s.amber, marginBottom: "20px" }}>
            Programs
          </h3>
          <ul style={{ listStyleType: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              "Charity International Hostel",
              "Apam Hostel Greenhouse",
              "Youth Agri-Business Bootcamp",
              "Botsio Integrated Farm",
              "Education Sponsorships",
              "GES Gomoa West Initiatives",
            ].map((p) => (
              <li key={p}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.6)", fontSize: "0.875rem" }}>
                  {p}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Column */}
        <div>
          <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: s.amber, marginBottom: "20px" }}>
            Reach Us
          </h3>

          <ul style={{ listStyleType: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
            <li style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <MapPin size={16} style={{ color: s.amber, marginTop: "2px", flexShrink: 0 }} />
              <span style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.6)", fontSize: "0.875rem", lineHeight: 1.5 }}>
                Near Botsio Building, Apam, Gomoa West, Central Region, Ghana
              </span>
            </li>

            <li style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <Mail size={16} style={{ color: s.amber, flexShrink: 0 }} />
              <a
                href="mailto:info@greenforceafrica.com"
                style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.6)", fontSize: "0.875rem", textDecoration: "none", transition: "color 0.3s ease" }}
                className="footer-nav-link"
              >
                info@greenforceafrica.com
              </a>
            </li>

            <li style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <Phone size={16} style={{ color: s.amber, flexShrink: 0 }} />
              <span 
                style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.6)", fontSize: "0.875rem", direction: "ltr" }}
                aria-label="Call +233 50 917 0770"
              >
                <span>+233</span> <span>(0) 50</span> <span>917</span> <span>0770</span>
              </span>
            </li>
          </ul>

          <Link href="/donate" className="footer-btn-cta">
            Sponsor a Student Today
          </Link>
        </div>
      </div>

      {/* ── DEDICATED SOCIAL ICON ZONE ── */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px 32px 24px" }}>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "32px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
          <span style={{ fontSize: "0.65rem", fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.35)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            Connect With Our Mission
          </span>
          
          <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
            {/* X (formerly Twitter) */}
            <a
              href="https://x.com/greenforceafric"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (formerly Twitter)"
              className="footer-social-icon-btn"
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/vtogreenforcefoundation"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="footer-social-icon-btn"
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.8z"/></svg>
            </a>

            {/* YouTube */}
            <a
              href="https://youtube.com/@VTOgreenforce"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="footer-social-icon-btn"
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.002 3.002 0 0 0 2.11 2.11C4.483 20.455 12 20.455 12 20.455s7.517 0 9.388-.508a3.002 3.002 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/vto-greenforce-foundation-africa-0613809a"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="footer-social-icon-btn"
            >
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 23.227 22.225 0h.003z"/></svg>
            </a>
          </div>
        </div>
      </div>

      {/* ── LOWER META STRIP ── */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.4)", fontSize: "0.75rem", margin: 0 }}>
          © {new Date().getFullYear()} VTO Greenforce Foundation Africa. All rights reserved.
        </p>

        <div style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.4)", fontSize: "0.75rem", margin: 0, textAlign: "right" }}>
          <p style={{ margin: "0 0 4px 0" }}>Registered NGO • Transforming Communities Through Agriculture & Care</p>
          <p style={{ margin: 0 }}>
            Developed by{" "}
            <a 
              href="https://wa.me/233535899952" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-attribution-link"
            >
              Allace Consult
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
