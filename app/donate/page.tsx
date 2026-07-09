"use client";

import { useEffect, useState } from "react";
import { Heart, BookOpen, TreePine, Users, Globe, Smartphone, Copy, Check, CreditCard } from "lucide-react";

const DONATE_HERO = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1800&q=85&auto=format&fit=crop";
const GIVESENDGO_LINK = "https://www.givesendgo.com/greenforcefoundation?utm_source=sharelink&utm_medium=copy_link&utm_campaign=greenforcefoundation";

const s = {
  eyebrow: { fontFamily: "'DM Sans', sans-serif", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase" as const, fontWeight: 500 },
  display: { fontFamily: "'Playfair Display', Georgia, serif" },
  body: { fontFamily: "'DM Sans', sans-serif", fontWeight: 300 },
  forest: "#1e3d1a",
  sage: "#4a8c52",
  cream: "#faf8f3",
  mist: "#f2ede3",
  gold: "#c9992a",
  ink: "#0d0d0b",
  white: "#ffffff",
  amber: "#f59e0b"
};

const STATS = [
  { icon: <TreePine size={24} style={{ color: s.sage }} />, label: "Agricultural Support", value: "Soil, Infrastructure & Seeds" },
  { icon: <BookOpen size={24} style={{ color: s.sage }} />, label: "Hostel Living", value: "Nutritional Security & Equipment" },
  { icon: <Users size={24} style={{ color: s.sage }} />, label: "Direct Impact", value: "100% Accountable Channel" }
];

function ClipboardButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="p-2 rounded-lg transition-colors duration-200 shrink-0 hover:bg-neutral-100 flex items-center justify-center"
      title="Copy to clipboard"
    >
      {copied ? <Check size={16} style={{ color: s.sage }} /> : <Copy size={16} className="text-neutral-400" />}
    </button>
  );
}

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

export default function DonatePage() {
  const [activeTab, setActiveTab] = useState<"momo" | "bank" | "givesendgo">("momo");
  useRevealAll();

  return (
    <main style={{ background: s.cream, color: s.ink, minHeight: "100vh" }}>
      {/* Structural Styles Injection */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght=0,300;0,400;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .reveal.visible { opacity: 1; transform: translateY(0); }
      `}</style>

      {/* HERO */}
      <section className="relative flex items-center justify-center overflow-hidden py-20" style={{ minHeight: "80vh" }}>
        <img src={DONATE_HERO} alt="Apam student waiting for opportunity" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(13,13,11,0.3), rgba(26,61,31,0.95))" }} />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <span className="mb-4 block" style={{ ...s.eyebrow, color: s.amber }}>
            Apam • Banjul • Africa
          </span>

          <h1 style={s.display} className="text-5xl lg:text-7xl font-light text-white leading-tight mb-6">
            Your gift trains a student,<br />
            feeds a hostel,<br />
            <em style={{ color: s.amber, fontStyle: "italic", fontWeight: "400" }}>and builds Greenforce.</em>
          </h1>

          <p style={s.body} className="text-white/80 text-lg font-light leading-relaxed max-w-2xl mx-auto mb-8">
            “He who supplies seed to the sower… will increase your store of seed.” — 2 Corinthians 9:10.  
            Every donation directly powers food security, vocational dignity, and agricultural literacy for young people across the Central Region.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href={GIVESENDGO_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-xl text-sm font-medium tracking-wide transition-all duration-300 transform hover:-translate-y-0.5 inline-flex items-center gap-2"
              style={{ background: s.amber, color: s.ink, fontFamily: "'DM Sans', sans-serif" }}
            >
              <Heart size={16} fill={s.ink} /> Support via GiveSendGo
            </a>
            <a 
              href="#credentials"
              className="px-8 py-4 rounded-xl text-sm font-medium tracking-wide transition-all duration-300 border border-white/30 text-white hover:bg-white/10"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              View Local Credentials
            </a>
          </div>
        </div>
      </section>

      {/* THREE PILLAR IMPACT GRAPHIC */}
      <section className="relative z-20 -mt-12 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {STATS.map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-md flex items-center gap-4 border border-neutral-100 reveal">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(74,140,82,0.08)' }}>
                {stat.icon}
              </div>
              <div>
                <p style={s.eyebrow} className="text-neutral-400">{stat.label}</p>
                <p className="text-base font-medium mt-0.5" style={{ ...s.body, color: s.forest }}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CENTRAL TRANSACTION DESK */}
      <section id="credentials" className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-start">
          
          {/* LEFT PHILOSOPHY HUB */}
          <div className="lg:col-span-5 reveal">
            <span style={{ ...s.eyebrow, color: s.sage }}>Why Give</span>
            <h2 className="text-4xl lg:text-5xl font-light mt-2 mb-6" style={{ ...s.display, color: s.forest }}>
              Your impact is <br /><em style={{ color: s.gold, fontStyle: "italic", fontWeight: "400" }}>local, visible, and lasting.</em>
            </h2>
            <p style={s.body} className="text-slate-600 leading-relaxed mb-8 text-base">
              We operate with rigorous administrative transparency and local accountability structures. 
              100% of financial resources flow directly into fueling Apam hostel farms, high-yield greenhouse infrastructure, and student vocational provisions.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ background: s.gold }} />
                <div>
                  <h4 className="font-semibold text-sm" style={{ ...s.body, color: s.forest }}>100% Direct Channel</h4>
                  <p style={s.body} className="text-xs text-slate-500 mt-0.5">Every donation matches field operations directly. No middle layers. (Luke 16:10)</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ background: s.gold }} />
                <div>
                  <h4 className="font-semibold text-sm" style={{ ...s.body, color: s.forest }}>Double Harvest Paradigm</h4>
                  <p style={s.body} className="text-xs text-slate-500 mt-0.5">We combine structural local food production output with disciplined, identity-focused mentoring.</p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 rounded-2xl" style={{ background: s.mist }}>
              <p className="text-lg italic" style={{ ...s.display, color: s.forest }}>
                &ldquo;Whoever is generous to the poor lends to the Lord, and he will repay him for his deed.&rdquo;
              </p>
              <span className="text-xs mt-3 block" style={{ ...s.eyebrow, color: s.gold }}>— Proverbs 19:17</span>
            </div>
          </div>

          {/* RIGHT CTA CREDENTIALS BOX */}
          <div className="lg:col-span-7 reveal">
            <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-neutral-100">
              <h3 className="text-3xl font-light mb-2" style={{ ...s.display, color: s.forest }}>Transfer Credentials</h3>
              <p style={s.body} className="text-slate-400 text-sm mb-8">Please use the verified official channels below to safely forward your contributions.</p>

              {/* TABS SWITCHER */}
              <div className="flex p-1.5 rounded-xl mb-8 gap-1" style={{ background: s.mist }}>
                <button
                  onClick={() => setActiveTab("momo")}
                  className="flex-1 py-3 rounded-lg text-xs md:text-sm font-medium flex items-center justify-center gap-1.5 transition-all duration-200"
                  style={{
                    background: activeTab === "momo" ? s.white : "transparent",
                    color: activeTab === "momo" ? s.forest : "#64748b",
                    boxShadow: activeTab === "momo" ? "0 4px 12px rgba(0,0,0,0.03)" : "none"
                  }}
                >
                  <Smartphone size={16} /> Mobile Money
                </button>
                <button
                  onClick={() => setActiveTab("bank")}
                  className="flex-1 py-3 rounded-lg text-xs md:text-sm font-medium flex items-center justify-center gap-1.5 transition-all duration-200"
                  style={{
                    background: activeTab === "bank" ? s.white : "transparent",
                    color: activeTab === "bank" ? s.forest : "#64748b",
                    boxShadow: activeTab === "bank" ? "0 4px 12px rgba(0,0,0,0.03)" : "none"
                  }}
                >
                  <Globe size={16} /> Bank Wire
                </button>
                <button
                  onClick={() => setActiveTab("givesendgo")}
                  className="flex-1 py-3 rounded-lg text-xs md:text-sm font-medium flex items-center justify-center gap-1.5 transition-all duration-200"
                  style={{
                    background: activeTab === "givesendgo" ? s.white : "transparent",
                    color: activeTab === "givesendgo" ? s.forest : "#64748b",
                    boxShadow: activeTab === "givesendgo" ? "0 4px 12px rgba(0,0,0,0.03)" : "none"
                  }}
                >
                  <CreditCard size={16} /> GiveSendGo
                </button>
              </div>

              {/* INFORMATION CHANNELS */}
              {activeTab === "momo" && (
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl flex items-center justify-between border border-neutral-100" style={{ background: s.cream }}>
                    <div>
                      <span style={s.eyebrow} className="text-xs text-neutral-400 font-semibold block">Telecel</span>
                      <p className="text-2xl font-light mt-1 tracking-tight" style={{ ...s.display, color: s.forest }}>050 094 0262</p>
                      <p style={s.body} className="text-xs text-slate-400 mt-1">Greenforce Foundation Africa</p>
                    </div>
                    <ClipboardButton text="0500940262" />
                  </div>

                  <div className="p-5 rounded-2xl flex items-center justify-between border border-neutral-100" style={{ background: s.cream }}>
                    <div>
                      <span style={s.eyebrow} className="text-xs text-neutral-400 font-semibold block">MTN Mobile Money</span>
                      <p className="text-2xl font-light mt-1 tracking-tight" style={{ ...s.display, color: s.forest }}>025 659 4150</p>
                      <p style={s.body} className="text-xs text-slate-400 mt-1">VTO Greenforce Foundation Africa</p>
                    </div>
                    <ClipboardButton text="0256594150" />
                  </div>
                </div>
              )}

              {activeTab === "bank" && (
                <div className="space-y-6">
                  {/* MAIN ACCOUNT IDENTIFIER */}
                  <div className="p-6 rounded-2xl border border-neutral-100 space-y-4" style={{ background: s.cream }}>
                    <div>
                      <span style={s.eyebrow} className="text-xs text-neutral-400 block">Beneficiary Name</span>
                      <p className="text-base font-medium mt-0.5" style={{ ...s.body, color: s.forest }}>Greenforce Foundation Africa</p>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-200/50">
                      <div>
                        <span style={s.eyebrow} className="text-xs text-neutral-400 block">Bank Name</span>
                        <p className="text-sm font-medium mt-0.5" style={{ ...s.body, color: s.forest }}>Gomoa Community Bank PLC</p>
                      </div>
                      <div>
                        <span style={s.eyebrow} className="text-xs text-neutral-400 block">Branch / Hub</span>
                        <p className="text-sm font-medium mt-0.5" style={{ ...s.body, color: s.forest }}>Apam</p>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-200/50">
                      <div>
                        <span style={s.eyebrow} className="text-xs text-neutral-400 block">Correspondent Bank</span>
                        <p className="text-sm font-medium mt-0.5" style={{ ...s.body, color: s.forest }}>Ghana International Bank</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span style={s.eyebrow} className="text-xs text-neutral-400 block">SWIFT Code</span>
                          <p className="text-sm font-semibold tracking-wide mt-0.5" style={{ ...s.body, color: s.forest }}>GHIBGB2L</p>
                        </div>
                        <ClipboardButton text="GHIBGB2L" />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-neutral-200/50 flex items-center justify-between">
                      <div>
                        <span style={s.eyebrow} className="text-xs text-neutral-400 block">Primary Account Number</span>
                        <p className="text-xl tracking-wide mt-0.5" style={{ ...s.display, color: s.forest }}>2081520000491151</p>
                      </div>
                      <ClipboardButton text="2081520000491151" />
                    </div>
                  </div>

                  {/* INTERNATIONAL SUB-ACCOUNT CARDS */}
                  <div>
                    <span style={s.eyebrow} className="text-xs text-neutral-400 mb-3 block">Corresponding Foreign Currencies (A/C NOS.)</span>
                    <div className="grid sm:grid-cols-3 gap-3">
                      {[
                        { label: "USD Sub-Account", val: "10122002" },
                        { label: "GBP Sub-Account", val: "10122001" },
                        { label: "EUR Sub-Account", val: "10122003" }
                      ].map((acc) => (
                        <div key={acc.label} className="p-4 rounded-xl border border-neutral-100 bg-white flex items-center justify-between shadow-sm">
                          <div>
                            <span style={s.eyebrow} className="text-[10px] text-neutral-400 block">{acc.label}</span>
                            <span className="text-sm font-semibold tracking-wide block mt-0.5" style={{ ...s.body, color: s.forest }}>{acc.val}</span>
                          </div>
                          <ClipboardButton text={acc.val} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "givesendgo" && (
                <div className="space-y-4">
                  <div className="p-6 rounded-2xl text-center border border-neutral-100" style={{ background: s.cream }}>
                    <span style={s.eyebrow} className="text-xs text-neutral-400 block mb-2">Global Crowdfunding Campaign</span>
                    <h4 className="text-xl font-light mb-4" style={{ ...s.display, color: s.forest }}>Free School for Orphans & Vulnerable Children</h4>
                    <p style={s.body} className="text-slate-500 text-sm max-w-md mx-auto mb-6 leading-relaxed">
                      Perfect for international credit card gifts, processing card payments safely from anywhere across the globe.
                    </p>
                    <a 
                      href={GIVESENDGO_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-4 rounded-xl text-sm font-medium tracking-wide transition-all duration-300 transform hover:-translate-y-0.5 inline-flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                      style={{ background: s.forest, color: s.white, fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Go to GiveSendGo Campaign <Globe size={14} />
                    </a>
                  </div>
                </div>
              )}
              
              <div className="mt-8 pt-6 border-t border-dashed border-neutral-200 text-center">
                <p style={s.body} className="text-xs text-neutral-400">
                  For confirmation receipts, tax documentation, or corporate sponsorship agreements, please touch base directly via <a href="mailto:greenforceafricaconsult@gmail.com" className="font-semibold underline" style={{ color: s.sage }}>greenforceafricaconsult@gmail.com</a>
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FIELD INVESTMENT SCALE */}
      <section className="py-24 px-6" style={{ background: s.forest }}>
        <div className="max-w-5xl mx-auto text-center reveal">
          <span style={{ ...s.eyebrow, color: s.amber }}>Resource Deployment Matrix</span>
          <h2 style={s.display} className="text-4xl lg:text-5xl text-white font-light mt-2 mb-12">
            What your seed becomes in Apam
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
            {[
              { a: "GH₵ 50", d: "5 bags of dynamic structural organic compost for soil enrichment schemes." },
              { a: "GH₵ 100", d: "Direct distribution pressure-drip irrigation lines serving 10 active student beds." },
              { a: "GH₵ 500", d: "A comprehensive academic term cycle of expert technical agri-training sponsorship." },
              { a: "GH₵ 2,000", d: "High-grade 2000L vertical water infrastructure storage system integration." },
              { a: "GH₵ 10,000", d: "A fully dedicated, custom-labeled greenhouse parcel situated within the Botsio Building Farm complex." }
            ].map((x, idx) => (
              <div 
                key={x.a} 
                className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.01] ${idx === 4 ? "sm:col-span-2 lg:col-span-3 bg-neutral-900/40 border-amber-500/30" : "bg-white/5 border-white/10"}`}
              >
                <p style={s.display} className={`text-2xl font-light ${idx === 4 ? "text-amber-400" : "text-white"}`}>{x.a}</p>
                <p style={s.body} className="text-white/70 text-sm mt-2 leading-relaxed">{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
