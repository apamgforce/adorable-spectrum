"use client";

import { useEffect, useState } from "react";
import { Users, MapPin, Send, CheckCircle, AlertCircle, Clock } from "lucide-react";

const VOLUNTEER_IMG = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=900&q=85&auto=format&fit=crop";

// HubSpot Credentials
const HUBSPOT_PORTAL_ID = "149113634";
const HUBSPOT_FORM_ID = "478982e9-0966-4030-a24d-8402a1c04c9f";
const HUBSPOT_REGION = "eu1";
const WHATSAPP_GROUP_LINK = "https://chat.whatsapp.com/Fit8eH747BLAna15s6RE92?s=cl&p=a&ilr=0";

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

export default function VolunteerPage() {
  const [form, setForm] = useState({ 
    fullName: "", 
    whatsapp: "", 
    email: "", 
    track: "", 
    hours: "", 
    mode: "" 
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  useRevealAll();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    // Split Full Name into First and Last Name for HubSpot
    const nameParts = form.fullName.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "N/A";

    // Prepare HubSpot Forms API Payload
    const portalData = {
      fields: [
        { name: "firstname", value: firstName },
        { name: "lastname", value: lastName },
        { name: "email", value: form.email },
        { name: "mobilephone", value: form.whatsapp },
        { name: "volunteer_track", value: form.track },
        { name: "hours_per_month", value: form.hours },
        { name: "engagement_mode", value: form.mode }
      ],
      context: {
        pageUri: window.location.href,
        pageName: "Volunteer Application Page"
      }
    };

    try {
      const response = await fetch(
        `https://api-${HUBSPOT_REGION}.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_ID}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(portalData),
        }
      );

      if (response.ok) {
        setStatus("success");
        setForm({ fullName: "", whatsapp: "", email: "", track: "", hours: "", mode: "" });
        
        // Auto-redirect to WhatsApp group after 2 seconds
        setTimeout(() => {
          window.open(WHATSAPP_GROUP_LINK, "_blank");
        }, 2000);
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <main>
      {/* HEADER */}
      <section className="pt-32 pb-16 px-6" style={{ background: 'var(--cream)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="reveal max-w-2xl">
            <span className="text-xs tracking-[0.25em] uppercase font-medium" style={{ color: 'var(--sage)' }}>Learn + Impact from Home</span>
            <h1 className="font-display text-5xl lg:text-6xl font-light mt-2 leading-tight" style={{ color: 'var(--forest)' }}>
              Become a <br />
              <em style={{ color: 'var(--sage)' }}>Greenforce Advocate.</em>
            </h1>
            <p className="text-slate-600 mt-4 text-base leading-relaxed">
              No experience needed. We&apos;ll train you. 2-8hrs/month. Certificate + T-shirt + Network.
            </p>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="pb-24 px-6" style={{ background: 'var(--cream)' }}>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">

          {/* LEFT — Info */}
          <div className="reveal">
            <div className="relative rounded-3xl overflow-hidden mb-10" style={{ height: '300px' }}>
              <img src={VOLUNTEER_IMG} alt="Greenforce Volunteers" className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,61,31,0.85), transparent 50%)' }} />
              <div className="absolute bottom-6 left-6">
                <p className="font-display text-2xl italic text-white">Volunteer from anywhere.</p>
                <p className="text-white/60 text-sm mt-1">Virtual + Physical Options</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex gap-4 items-start p-5 rounded-2xl" style={{ background: 'var(--mist)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(74,140,82,0.12)' }}>
                  <Users size={18} style={{ color: 'var(--sage)' }} />
                </div>
                <div>
                  <p className="font-medium text-sm" style={{ color: 'var(--forest)' }}>Volunteer Tracks</p>
                  <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                    Media & Content, Field Operations, Community Outreach, Grant Writing, Graphic Design, Video Editing, Local Translations
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-5 rounded-2xl" style={{ background: 'var(--mist)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(74,140,82,0.12)' }}>
                  <Clock size={18} style={{ color: 'var(--sage)' }} />
                </div>
                <div>
                  <p className="font-medium text-sm" style={{ color: 'var(--forest)' }}>Time Commitment</p>
                  <p className="text-slate-500 text-sm mt-1">2-8 hours per month. Flexible. You choose weekly tasks.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-5 rounded-2xl" style={{ background: 'var(--mist)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(74,140,82,0.12)' }}>
                  <MapPin size={18} style={{ color: 'var(--sage)' }} />
                </div>
                <div>
                  <p className="font-medium text-sm" style={{ color: 'var(--forest)' }}>Location</p>
                  <p className="text-slate-500 text-sm mt-1">Virtual from anywhere + Physical in Ghana & The Gambia</p>
                </div>
              </div>
            </div>

            <div className="scripture mt-8 px-6 py-5 rounded-2xl">
              <p className="font-display text-lg italic" style={{ color: 'var(--forest)' }}>
                &ldquo;The earth is the Lord&apos;s, and everything in it.&rdquo;
              </p>
              <span className="text-sm mt-2 block" style={{ color: 'var(--gold)' }}>— Psalm 24:1</span>
            </div>
          </div>

          {/* RIGHT — Form */}
          <div className="reveal">
            <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm">
              {status === "success" ? (
                <div className="text-center py-12">
                  <CheckCircle size={48} className="mx-auto mb-4" style={{ color: 'var(--sage)' }} />
                  <h3 className="font-display text-3xl font-light mb-3" style={{ color: 'var(--forest)' }}>Application sent!</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4">
                    Thank you for joining Greenforce. We&apos;ve logged your details. 
                    Redirecting you to our active WhatsApp group now...
                  </p>
                  <a 
                    href={WHATSAPP_GROUP_LINK}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium" style={{ color: 'var(--leaf)' }}
                  >
                    Click here if not redirected automatically →
                  </a>
                </div>
              ) : (
                <>
                  <h2 className="font-display text-3xl font-light mb-2" style={{ color: 'var(--forest)' }}>Apply in 1 minute</h2>
                  <p className="text-slate-400 text-sm mb-8">We&apos;ll train you. Just bring your passion and make a positive impact.</p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="text-xs font-medium tracking-wide uppercase mb-1.5 block" style={{ color: 'var(--forest)' }}>Full Name</label>
                      <input
                        required
                        value={form.fullName}
                        onChange={e => setForm({ ...form, fullName: e.target.value })}
                        placeholder="Your full name"
                        disabled={status === "submitting"}
                        className="w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 transition-all disabled:opacity-50"
                        style={{ borderColor: 'rgba(74,140,82,0.2)', background: 'var(--mist)' }}
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-xs font-medium tracking-wide uppercase mb-1.5 block" style={{ color: 'var(--forest)' }}>WhatsApp Number</label>
                        <input
                          required
                          value={form.whatsapp}
                          onChange={e => setForm({ ...form, whatsapp: e.target.value })}
                          placeholder="+233 24 123 4567"
                          disabled={status === "submitting"}
                          className="w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 transition-all disabled:opacity-50"
                          style={{ borderColor: 'rgba(74,140,82,0.2)', background: 'var(--mist)' }}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium tracking-wide uppercase mb-1.5 block" style={{ color: 'var(--forest)' }}>Email</label>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={e => setForm({ ...form, email: e.target.value })}
                          placeholder="your@email.com"
                          disabled={status === "submitting"}
                          className="w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 transition-all disabled:opacity-50"
                          style={{ borderColor: 'rgba(74,140,82,0.2)', background: 'var(--mist)' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium tracking-wide uppercase mb-1.5 block" style={{ color: 'var(--forest)' }}>Primary Volunteer Track</label>
                      <select
                        required
                        value={form.track}
                        onChange={e => setForm({ ...form, track: e.target.value })}
                        disabled={status === "submitting"}
                        className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all disabled:opacity-50"
                        style={{ borderColor: 'rgba(74,140,82,0.2)', background: 'var(--mist)', color: form.track ? 'var(--charcoal)' : '#94a3b8' }}
                      >
                        <option value="">Select your primary skill / focus...</option>
                        <option value="Media & Creative">Media, Graphic Design & Video Editing</option>
                        <option value="Community Mobilization">Community Mobilization & Field Operations</option>
                        <option value="Research & Writing">Research, Grant Writing & Fundraising</option>
                        <option value="Translation">Translation (Twi, Hausa, Ga, Fante)</option>
                        <option value="Event Support">Event Planning & On-Ground Hype</option>
                      </select>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-xs font-medium tracking-wide uppercase mb-1.5 block" style={{ color: 'var(--forest)' }}>Hours / Month</label>
                        <select
                          required
                          value={form.hours}
                          onChange={e => setForm({ ...form, hours: e.target.value })}
                          disabled={status === "submitting"}
                          className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all disabled:opacity-50"
                          style={{ borderColor: 'rgba(74,140,82,0.2)', background: 'var(--mist)', color: form.hours ? 'var(--charcoal)' : '#94a3b8' }}
                        >
                          <option value="">Select...</option>
                          <option value="2-4 hours">2-4 hours</option>
                          <option value="5-6 hours">5-6 hours</option>
                          <option value="7-8 hours">7-8 hours</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium tracking-wide uppercase mb-1.5 block" style={{ color: 'var(--forest)' }}>Engagement Mode</label>
                        <select
                          required
                          value={form.mode}
                          onChange={e => setForm({ ...form, mode: e.target.value })}
                          disabled={status === "submitting"}
                          className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all disabled:opacity-50"
                          style={{ borderColor: 'rgba(74,140,82,0.2)', background: 'var(--mist)', color: form.mode ? 'var(--charcoal)' : '#94a3b8' }}
                        >
                          <option value="">Select...</option>
                          <option value="Virtual (Remote)">Virtual / Remote</option>
                          <option value="On-Site (Ghana)">On-Site (Ghana)</option>
                          <option value="On-Site (Gambia)">On-Site (The Gambia)</option>
                          <option value="Hybrid">Hybrid</option>
                        </select>
                      </div>
                    </div>

                    {status === "error" && (
                      <div className="p-4 rounded-xl bg-red-50 text-red-700 text-xs font-medium flex items-center gap-2.5 border-red-100">
                        <AlertCircle size={16} className="shrink-0" />
                        <span>Submission failed. Please check your connection and try again.</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="btn-shimmer w-full text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 text-sm tracking-wide disabled:opacity-50 disabled:pointer-events-none"
                    >
                      {status === "submitting" ? (
                        <>Sending Application...</>
                      ) : (
                        <>
                          Join Greenforce <Send size={15} />
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
