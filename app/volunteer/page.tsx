"use client";

import { useEffect, useState } from "react";
import { Users, MapPin, Send, CheckCircle, AlertCircle, Clock } from "lucide-react";

const VOLUNTEER_IMG = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=900&q=85&auto=format&fit=crop";

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
    name: "", 
    whatsapp: "", 
    email: "", 
    role: "", 
    hours: "", 
    area: "" 
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  useRevealAll();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "84b28010-14e6-4d41-8b6c-7da6f3580552",
          name: form.name,
          whatsapp: form.whatsapp,
          email: form.email,
          role: form.role,
          hours: form.hours,
          area: form.area,
          subject: `GFA Volunteer Application: ${form.role}`,
          message: `New Volunteer Application\n\nName: ${form.name}\nWhatsApp: ${form.whatsapp}\nEmail: ${form.email}\nRole: ${form.role}\nHours/Month: ${form.hours}\nArea: ${form.area}\n\nJoin WhatsApp Group: https://chat.whatsapp.com/Fit8eH747BLAna15s6RE92?s=cl&p=a&ilr=0`,
          from_name: "Greenforce Foundation Africa Web"
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus("success");
        setForm({ name: "", whatsapp: "", email: "", role: "", hours: "", area: "" });
        // Auto redirect to WhatsApp group after 2 seconds
        setTimeout(() => {
          window.open("https://chat.whatsapp.com/Fit8eH747BLAna15s6RE92?s=cl&p=a&ilr=0", "_blank");
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
                  <p className="font-medium text-sm" style={{ color: 'var(--forest)' }}>Volunteer Roles</p>
                  <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                    Content Creator, Community Mobilizer, Research, Fundraising, Graphic Design, 
                    Video Editor, Translation, Event Hype
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
                  <p className="text-slate-500 text-sm mt-1">Virtual from anywhere + Physical in Ghana</p>
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
                    Thank you for joining Greenforce. We&apos;ll email you within 3 days. 
                    Redirecting you to our WhatsApp group now...
                  </p>
                  <a 
                    href="https://chat.whatsapp.com/Fit8eH747BLAna15s6RE92?s=cl&p=a&ilr=0"
                    target="_blank"
                    className="text-sm font-medium" style={{ color: 'var(--leaf)' }}
                  >
                    Join WhatsApp Group →
                  </a>
                </div>
              ) : (
                <>
                  <h2 className="font-display text-3xl font-light mb-2" style={{ color: 'var(--forest)' }}>Apply in 1 minute</h2>
                  <p className="text-slate-400 text-sm mb-8">We&apos;ll train you. Just bring your passion for climate action.</p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="text-xs font-medium tracking-wide uppercase mb-1.5 block" style={{ color: 'var(--forest)' }}>Full Name</label>
                      <input
                        required
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
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
                      <label className="text-xs font-medium tracking-wide uppercase mb-1.5 block" style={{ color: 'var(--forest)' }}>Volunteer Role</label>
                      <select
                        required
                        value={form.role}
                        onChange={e => setForm({ ...form, role: e.target.value })}
                        disabled={status === "submitting"}
                        className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all disabled:opacity-50"
                        style={{ borderColor: 'rgba(74,140,82,0.2)', background: 'var(--mist)', color: form.role ? 'var(--charcoal)' : '#94a3b8' }}
                      >
                        <option value="">Select a role...</option>
                        <option>Content Creator Advocate</option>
                        <option>Community Mobilizer Advocate</option>
                        <option>Research Advocate</option>
                        <option>Fundraising Advocate</option>
                        <option>Graphic Design Advocate</option>
                        <option>Video/Status Editor Advocate</option>
                        <option>Translation Advocate - Twi/Hausa/Ga</option>
                        <option>Event Hype Advocate</option>
                      </select>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-xs font-medium tracking-wide uppercase mb-1.5 block" style={{ color: 'var(--forest)' }}>Hours per Month</label>
                        <select
                          required
                          value={form.hours}
                          onChange={e => setForm({ ...form, hours: e.target.value })}
                          disabled={status === "submitting"}
                          className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all disabled:opacity-50"
                          style={{ borderColor: 'rgba(74,140,82,0.2)', background: 'var(--mist)', color: form.hours ? 'var(--charcoal)' : '#94a3b8' }}
                        >
                          <option value="">Select...</option>
                          <option>2-4 hours</option>
                          <option>5-6 hours</option>
                          <option>7-8 hours</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium tracking-wide uppercase mb-1.5 block" style={{ color: 'var(--forest)' }}>Advocate Area</label>
                        <select
                          required
                          value={form.area}
                          onChange={e => setForm({ ...form, area: e.target.value })}
                          disabled={status === "submitting"}
                          className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all disabled:opacity-50"
                          style={{ borderColor: 'rgba(74,140,82,0.2)', background: 'var(--mist)', color: form.area ? 'var(--charcoal)' : '#94a3b8' }}
                        >
                          <option value="">Select...</option>
                          <option>Physical</option>
                          <option>Graphic</option>
                          <option>Content</option>
                          <option>Video</option>
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
