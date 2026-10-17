"use client";

import { FormEvent, useEffect, useState } from "react";
import { CheckCircle, GraduationCap, Leaf, HeartHandshake, Send, AlertCircle } from "lucide-react";

// Same Web3Forms key the Contact page uses, so applications are emailed with no extra setup.
const WEB3FORMS_KEY = "84b28010-14e6-4d41-8b6c-7da6f3580552";

const EMPTY = { email: "", firstname: "", lastname: "", date_of_birth: "", phone: "", gender: "", city: "", school_name: "", country: "", message: "" };
const INPUT = "w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 transition-all disabled:opacity-50";
const INPUT_STYLE = { borderColor: "rgba(74,140,82,0.2)", background: "var(--mist)", "--tw-ring-color": "rgba(74,140,82,0.3)" } as React.CSSProperties;

const AREAS = [
  { icon: GraduationCap, title: "Education", text: "School support, scholarships and learning materials." },
  { icon: Leaf, title: "Skills & Opportunity", text: "Agriculture, vocational training and youth opportunities." },
  { icon: HeartHandshake, title: "Community Care", text: "Support for vulnerable people and community wellbeing." },
];

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-xs font-medium tracking-wide uppercase mb-1.5 block" style={{ color: "var(--forest)" }}>
      {children}
    </label>
  );
}

export default function ApplyPage() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    const fullName = `${form.firstname} ${form.lastname}`.trim();
    const details = [
      ["Name", fullName], ["Email", form.email], ["Phone", form.phone], ["Gender", form.gender],
      ["Date of birth", form.date_of_birth], ["City", form.city], ["Country", form.country],
      ["School", form.school_name || "—"],
    ].map(([k, v]) => `${k}: ${v}`).join("\n");

    // Email the team (browser -> Web3Forms) and record in HubSpot (server) in parallel.
    const [mail, crm] = await Promise.allSettled([
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          name: fullName,
          email: form.email,
          subject: `GFA Support Application: ${fullName}`,
          message: `${details}\n\nWhat support is needed and why:\n${form.message}`,
          from_name: "GreenForce Support Application",
        }),
      }).then(async (r) => r.ok && (await r.json()).success === true),
      fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }).then(async (r) => {
        if (r.ok) return { ok: true as const };
        const j = await r.json().catch(() => null);
        return { ok: false as const, error: j?.error as string | undefined };
      }),
    ]);

    const mailOk = mail.status === "fulfilled" && mail.value;
    const crmRes = crm.status === "fulfilled" ? crm.value : { ok: false as const, error: undefined };

    if (mailOk || crmRes.ok) {
      setStatus("success");
      setForm(EMPTY);
    } else {
      setError(crmRes.error || "We couldn't submit your application right now. Please check your details and try again.");
      setStatus("error");
    }
  };

  const busy = status === "submitting";

  return (
    <main>
      {/* HEADER */}
      <section className="pt-32 pb-16 px-6" style={{ background: "var(--cream)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="reveal max-w-xl">
            <span className="text-xs tracking-[0.25em] uppercase font-medium" style={{ color: "var(--sage)" }}>
              Request Support
            </span>
            <h1 className="font-display text-5xl lg:text-6xl font-light mt-2 leading-tight" style={{ color: "var(--forest)" }}>
              Need support?
              <br />
              <em style={{ color: "var(--sage)" }}>Start here.</em>
            </h1>
            <p className="text-slate-500 mt-5 leading-relaxed">
              Tell us a little about your situation. Our team will review your application and get back to you if we
              need more information or are able to provide support.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-24 px-6" style={{ background: "var(--cream)" }}>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
          {/* LEFT */}
          <div className="reveal">
            <div className="space-y-5">
              {AREAS.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex gap-4 items-start p-5 rounded-2xl" style={{ background: "var(--mist)" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(74,140,82,0.12)" }}>
                    <Icon size={18} style={{ color: "var(--sage)" }} />
                  </div>
                  <div>
                    <p className="font-medium text-sm" style={{ color: "var(--forest)" }}>{title}</p>
                    <p className="text-slate-500 text-sm mt-1 leading-relaxed">{text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="scripture mt-8 px-6 py-5 rounded-2xl">
              <p className="font-display text-lg italic" style={{ color: "var(--forest)" }}>
                &ldquo;Two are better than one... if either of them falls down, one can help the other up.&rdquo;
              </p>
              <span className="text-sm mt-2 block" style={{ color: "var(--gold)" }}>— Ecclesiastes 4:9–10</span>
            </div>
          </div>

          {/* FORM */}
          <div className="reveal">
            <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm">
              {status === "success" ? (
                <div className="text-center py-12">
                  <CheckCircle size={48} className="mx-auto mb-4" style={{ color: "var(--sage)" }} />
                  <h3 className="font-display text-3xl font-light mb-3" style={{ color: "var(--forest)" }}>
                    Application received.
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Thank you for reaching out to GreenForce Foundation Africa. Our team will review your request and
                    contact you if we need more information or are able to provide support.
                  </p>
                  <button onClick={() => setStatus("idle")} className="mt-6 text-sm font-medium" style={{ color: "var(--leaf)" }}>
                    Submit another application
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="font-display text-3xl font-light mb-2" style={{ color: "var(--forest)" }}>
                    Beneficiary application
                  </h2>
                  <p className="text-slate-400 text-sm mb-8">All fields are required unless marked optional.</p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <Label htmlFor="firstname">First name</Label>
                        <input id="firstname" name="firstname" required value={form.firstname} onChange={set} disabled={busy} placeholder="Your first name" className={INPUT} style={INPUT_STYLE} />
                      </div>
                      <div>
                        <Label htmlFor="lastname">Last name</Label>
                        <input id="lastname" name="lastname" required value={form.lastname} onChange={set} disabled={busy} placeholder="Your last name" className={INPUT} style={INPUT_STYLE} />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <input id="email" name="email" type="email" required value={form.email} onChange={set} disabled={busy} placeholder="your@email.com" className={INPUT} style={INPUT_STYLE} />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <input id="phone" name="phone" type="tel" required value={form.phone} onChange={set} disabled={busy} placeholder="024 123 4567" className={INPUT} style={INPUT_STYLE} />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <Label htmlFor="date_of_birth">Date of birth</Label>
                        <input id="date_of_birth" name="date_of_birth" type="date" required value={form.date_of_birth} onChange={set} disabled={busy} className={INPUT} style={INPUT_STYLE} />
                      </div>
                      <div>
                        <Label htmlFor="gender">Gender</Label>
                        <select id="gender" name="gender" required value={form.gender} onChange={set} disabled={busy} className={INPUT} style={INPUT_STYLE}>
                          <option value="">Select gender</option>
                          <option>Female</option>
                          <option>Male</option>
                          <option>Other</option>
                          <option>Prefer not to say</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <input id="city" name="city" required value={form.city} onChange={set} disabled={busy} placeholder="e.g. Apam" className={INPUT} style={INPUT_STYLE} />
                      </div>
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <select id="country" name="country" required value={form.country} onChange={set} disabled={busy} className={INPUT} style={INPUT_STYLE}>
                          <option value="">Select country</option>
                          <option>Ghana</option>
                          <option>The Gambia</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="school_name">School name (optional)</Label>
                      <input id="school_name" name="school_name" value={form.school_name} onChange={set} disabled={busy} placeholder="If applicable" className={INPUT} style={INPUT_STYLE} />
                    </div>

                    <div>
                      <Label htmlFor="message">What support do you need and why?</Label>
                      <textarea id="message" name="message" required rows={6} value={form.message} onChange={set} disabled={busy} placeholder="Please explain your situation and the support you need." className={`${INPUT} resize-none`} style={INPUT_STYLE} />
                    </div>

                    {status === "error" && (
                      <p className="flex items-start gap-2 text-sm text-red-600" role="alert">
                        <AlertCircle size={16} className="mt-0.5 shrink-0" />
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={busy}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-60"
                      style={{ background: "var(--forest)" }}
                    >
                      {busy ? "Sending…" : "Submit application"}
                      {!busy && <Send size={15} />}
                    </button>

                    <p className="text-center text-xs text-slate-400 leading-relaxed">
                      By submitting, you share your information with GreenForce Foundation Africa for the purpose of
                      reviewing your request for support.
                    </p>
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
