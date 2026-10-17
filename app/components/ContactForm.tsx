"use client";

import { useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

const DEFAULT_OPTIONS = [
  "I want to donate",
  "I want to sponsor a child",
  "I want to partner / volunteer",
  "Media / Press inquiry",
  "Other",
];

type Props = {
  heading?: string;
  intro?: string;
  subjectLabel?: string;
  subjectPlaceholder?: string;
  options?: string[];
  /** Prefix added to the email subject so entries can be told apart. */
  subjectPrefix?: string;
  successTitle?: string;
  successText?: string;
  messagePlaceholder?: string;
};

const fieldStyle = {
  borderColor: "rgba(74,140,82,0.2)",
  background: "var(--mist)",
} as const;

export default function ContactForm({
  heading = "Get in touch",
  intro = "Whether you want to donate, partner, volunteer, or simply learn more — we want to hear from you.",
  subjectLabel = "Subject",
  subjectPlaceholder = "Select a reason...",
  options = DEFAULT_OPTIONS,
  subjectPrefix,
  successTitle = "Message received.",
  successText = "Thank you for reaching out to VTO Greenforce Foundation Africa. We have received your message and a member of our team will get back to you as needed.",
  messagePlaceholder = "Tell us what's on your heart...",
}: Props) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    const topic = form.subject || "General Inquiry";
    const subject = subjectPrefix ? `${subjectPrefix}: ${topic}` : topic;

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: "84b28010-14e6-4d41-8b6c-7da6f3580552",
          name: form.name,
          email: form.email,
          subject: `GFA Form Submission: ${subject}`,
          message: form.message,
          from_name: "VTO Greenforce Foundation Africa Web",
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus("success");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-12">
        <CheckCircle size={48} className="mx-auto mb-4" style={{ color: "var(--sage)" }} />
        <h3 className="font-display text-3xl font-light mb-3" style={{ color: "var(--forest)" }}>
          {successTitle}
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed">{successText}</p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-medium"
          style={{ color: "var(--leaf)" }}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <>
      <h2 className="font-display text-3xl font-light mb-2" style={{ color: "var(--forest)" }}>
        {heading}
      </h2>
      <p className="text-slate-400 text-sm mb-8">{intro}</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="text-xs font-medium tracking-wide uppercase mb-1.5 block" style={{ color: "var(--forest)" }}>
              Name
            </label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your full name"
              disabled={status === "submitting"}
              className="w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 transition-all disabled:opacity-50"
              style={{ ...fieldStyle, "--tw-ring-color": "rgba(74,140,82,0.3)" } as React.CSSProperties}
            />
          </div>

          <div>
            <label className="text-xs font-medium tracking-wide uppercase mb-1.5 block" style={{ color: "var(--forest)" }}>
              Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="your@email.com"
              disabled={status === "submitting"}
              className="w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 transition-all disabled:opacity-50"
              style={fieldStyle}
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium tracking-wide uppercase mb-1.5 block" style={{ color: "var(--forest)" }}>
            {subjectLabel}
          </label>
          <select
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            disabled={status === "submitting"}
            className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all disabled:opacity-50"
            style={{ ...fieldStyle, color: form.subject ? "var(--charcoal)" : "#94a3b8" }}
          >
            <option value="">{subjectPlaceholder}</option>
            {options.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-medium tracking-wide uppercase mb-1.5 block" style={{ color: "var(--forest)" }}>
            Message
          </label>
          <textarea
            required
            rows={5}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder={messagePlaceholder}
            disabled={status === "submitting"}
            className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none transition-all disabled:opacity-50"
            style={fieldStyle}
          />
        </div>

        {status === "error" && (
          <div className="p-4 rounded-xl bg-red-50 text-red-700 text-xs font-medium flex items-center gap-2.5 border border-red-100">
            <AlertCircle size={16} className="shrink-0" />
            <span>We couldn&apos;t send your message. Please check your connection and try again.</span>
          </div>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="btn-shimmer w-full text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 text-sm tracking-wide disabled:opacity-50 disabled:pointer-events-none"
        >
          {status === "submitting" ? <>Sending...</> : <>Send Message <Send size={15} /></>}
        </button>
      </form>
    </>
  );
}
