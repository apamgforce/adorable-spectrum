"use client";
import { useState, useEffect, useRef } from "react";

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  const WHATSAPP_NUMBER = "+23320000000"; 
  const DEFAULT_GREETING = "Hello! Welcome to Greenforce Foundation. How can we help you plant a seed of change today?";

  // Format link for wa.me based on custom message or quick direct link
  const getWhatsAppLink = (customText?: string) => {
    const textToSend = customText || "Hello Greenforce Foundation, I would like to learn more about your projects.";
    return `https://wa.me/${WHATSAPP_NUMBER.replace(/[+\s]/g, "")}?text=${encodeURIComponent(textToSend)}`;
  };

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // Open WhatsApp with the user's custom typed message
    window.open(getWhatsAppLink(message), "_blank", "noopener,noreferrer");
    setMessage("");
    setIsOpen(false);
  };

  return (
    <div style={{ position: "fixed", bottom: "32px", right: "32px", zIndex: 9999, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>
      
      {/* ── FLOATING CHAT BOX MODAL ── */}
      {isOpen && (
        <div 
          ref={modalRef}
          style={{
            position: "absolute",
            bottom: "80px",
            right: "0",
            width: "360px",
            maxWidth: "calc(100vw - 40px)",
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            animation: "waFadeIn 0.25s ease-out forwards"
          }}
        >
          {/* WhatsApp Header Strip */}
          <div style={{ backgroundColor: "#075e54", padding: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Greenforce Custom Avatar placeholder */}
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#e4dccf", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "#1e3d1a", fontSize: "16px" }}>
              GF
            </div>
            <div>
              <h4 style={{ margin: 0, color: "#fff", fontSize: "15px", fontWeight: 600 }}>Greenforce Foundation</h4>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.75)", fontSize: "12px" }}>Typically replies within minutes</p>
            </div>
          </div>

          {/* Chat Dynamic Window Background */}
          <div style={{ 
            backgroundColor: "#e5ddd5", 
            padding: "20px", 
            flexGrow: 1, 
            minHeight: "180px", 
            maxHeight: "300px", 
            overflowY: "auto", 
            backgroundImage: "linear-gradient(rgba(229, 221, 213, 0.6), rgba(229, 221, 213, 0.6)), url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')",
            backgroundBlendMode: "overlay"
          }}>
            
            {/* Official Greeting Bubble (Simulated inbound agent message) */}
            <div style={{ backgroundColor: "#fff", padding: "10px 14px", borderRadius: "0px 8px 8px 8px", maxWidth: "85%", marginBottom: "16px", boxShadow: "0 1px 1px rgba(0,0,0,0.1)", position: "relative" }}>
              <p style={{ margin: 0, fontSize: "14px", color: "#303030", lineHeight: "1.4" }}>
                {DEFAULT_GREETING}
              </p>
              <span style={{ fontSize: "10px", color: "#999", float: "right", marginTop: "4px" }}>Just now</span>
            </div>

            {/* Quick-action bypass link */}
            <div style={{ textAlign: "center", margin: "12px 0 4px" }}>
              <a 
                href={getWhatsAppLink()} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ fontSize: "12px", background: "rgba(7, 94, 84, 0.1)", color: "#075e54", padding: "6px 12px", borderRadius: "20px", fontWeight: 500, textDecoration: "none", display: "inline-block", transition: "background 0.2s" }}
                onMouseOver={(e) => e.currentTarget.style.background = "rgba(7, 94, 84, 0.15)"}
                onMouseOut={(e) => e.currentTarget.style.background = "rgba(7, 94, 84, 0.1)"}
              >
                ⚡ Skip typing & open direct chat
              </a>
            </div>
          </div>

          {/* Form Action Input Bar */}
          <form onSubmit={handleSubmit} style={{ display: "flex", backgroundColor: "#f0f0f0", padding: "10px", alignItems: "center", gap: "8px", borderTop: "1px solid #e0e0e0" }}>
            <input 
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your inquiry here..."
              style={{ flexGrow: 1, border: "none", padding: "10px 14px", borderRadius: "20px", fontSize: "14px", outline: "none", backgroundColor: "#fff" }}
            />
            <button 
              type="submit" 
              disabled={!message.trim()}
              style={{
                background: message.trim() ? "#075e54" : "#b0b0b0",
                color: "#fff",
                border: "none",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                cursor: message.trim() ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s"
              }}
            >
              {/* Clean inline vector arrow pointing right */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* ── MAIN FLOATING ACTION BUTTON TRIGGER ── */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#25d366",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 16px rgba(37, 211, 102, 0.4)",
          transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          color: "#fff"
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.08)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        title="Chat on WhatsApp"
      >
        {/* Custom inline SVG WhatsApp Brand Logo layout */}
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.454 5.709 1.455h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </button>

      {/* Embedded micro-animation rule specifically scoped for the opening event */}
      <style>{`
        @keyframes waFadeIn {
          from { opacity: 0; transform: translateY(12px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

    </div>
  );
}
