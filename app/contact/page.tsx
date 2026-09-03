"use client";

import { useEffect, useState } from "react";
import { Phone, Mail, MapPin, Send, CheckCircle, AlertCircle } from "lucide-react";

const CONTACT_IMG =
  "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=900&q=85&auto=format&fit=crop";

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

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

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
          email: form.email,
          subject: `GFA Form Submission: ${
            form.subject || "General Inquiry"
          }`,
          message: form.message,
          from_name: "VTO Greenforce Foundation Africa Web",
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus("success");
        setForm({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
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
      <section
        className="pt-32 pb-16 px-6"
        style={{ background: "var(--cream)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="reveal max-w-xl">
            <span
              className="text-xs tracking-[0.25em] uppercase font-medium"
              style={{ color: "var(--sage)" }}
            >
              Reach Out
            </span>

            <h1
              className="font-display text-5xl lg:text-6xl font-light mt-2 leading-tight"
              style={{ color: "var(--forest)" }}
            >
              Let&apos;s plant
              <br />
              <em style={{ color: "var(--sage)" }}>
                something together.
              </em>
            </h1>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section
        className="pb-24 px-6"
        style={{ background: "var(--cream)" }}
      >
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">

          {/* LEFT — Info */}
          <div className="reveal">
            <div
              className="relative rounded-3xl overflow-hidden mb-10"
              style={{ height: "300px" }}
            >
              <img
                src={CONTACT_IMG}
                alt="Charity International Senior High School Campus"
                className="w-full h-full object-cover"
              />

              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(26,61,31,0.85), transparent 50%)",
                }}
              />

              <div className="absolute bottom-6 left-6">
                <p className="font-display text-2xl italic text-white">
                  Come, see the work.
                </p>

                <p className="text-white/60 text-sm mt-1">
                  Apam, Gomoa West, Ghana
                </p>
              </div>
            </div>

            <div className="space-y-5">

              {/* LOCATION */}
              <div
                className="flex gap-4 items-start p-5 rounded-2xl"
                style={{ background: "var(--mist)" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: "rgba(74,140,82,0.12)",
                  }}
                >
                  <MapPin
                    size={18}
                    style={{ color: "var(--sage)" }}
                  />
                </div>

                <div>
                  <p
                    className="font-medium text-sm"
                    style={{ color: "var(--forest)" }}
                  >
                    Location
                  </p>

                  <p className="text-slate-600 text-sm mt-1 font-semibold">
                    Charity International Senior High School
                  </p>

                  <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">
                    Behind Nyamekye Preparatory School,
                    <br />
                    Bostia Road, Nsawam, APAM
                    <br />
                    S16 Chaya Street &bull; CI - 0034-2522
                    <br />
                    Post Office Box SO 106
                  </p>
                </div>
              </div>

              {/* PHONE */}
              <div
                className="flex gap-4 items-start p-5 rounded-2xl"
                style={{ background: "var(--mist)" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: "rgba(74,140,82,0.12)",
                  }}
                >
                  <Phone
                    size={18}
                    style={{ color: "var(--sage)" }}
                  />
                </div>

                <div>
                  <p
                    className="font-medium text-sm"
                    style={{ color: "var(--forest)" }}
                  >
                    Phone
                  </p>

                  <a
                    href="tel:+233509170770"
                    className="text-slate-500 text-sm mt-1 inline-block hover:underline"
                  >
                    +233 50 917 0770
                  </a>
                </div>
              </div>

              {/* EMAIL */}
              <div
                className="flex gap-4 items-start p-5 rounded-2xl"
                style={{ background: "var(--mist)" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: "rgba(74,140,82,0.12)",
                  }}
                >
                  <Mail
                    size={18}
                    style={{ color: "var(--sage)" }}
                  />
                </div>

                <div>
                  <p
                    className="font-medium text-sm"
                    style={{ color: "var(--forest)" }}
                  >
                    Email
                  </p>

                  <a
                    href="mailto:info@greenforceafrica.com"
                    className="text-slate-500 text-sm mt-1 inline-block hover:underline"
                  >
                    info@greenforceafrica.com
                  </a>
                </div>
              </div>
            </div>

            <div className="scripture mt-8 px-6 py-5 rounded-2xl">
              <p
                className="font-display text-lg italic"
                style={{ color: "var(--forest)" }}
              >
                &ldquo;Two are better than one... if either of them falls
                down, one can help the other up.&rdquo;
              </p>

              <span
                className="text-sm mt-2 block"
                style={{ color: "var(--gold)" }}
              >
                — Ecclesiastes 4:9–10
              </span>
            </div>
          </div>

          {/* RIGHT — Form */}
          <div className="reveal">
            <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm">
              {status === "success" ? (
                <div className="text-center py-12">
                  <CheckCircle
                    size={48}
                    className="mx-auto mb-4"
                    style={{ color: "var(--sage)" }}
                  />

                  <h3
                    className="font-display text-3xl font-light mb-3"
                    style={{ color: "var(--forest)" }}
                  >
                    Message received.
                  </h3>

                  <p className="text-slate-500 text-sm leading-relaxed">
                    Thank you for reaching out to VTO Greenforce Foundation
                    Africa. We have received your message and a member of our
                    team will get back to you as needed.
                  </p>

                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-6 text-sm font-medium"
                    style={{ color: "var(--leaf)" }}
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  <h2
                    className="font-display text-3xl font-light mb-2"
                    style={{ color: "var(--forest)" }}
                  >
                    Get in touch
                  </h2>

                  <p className="text-slate-400 text-sm mb-8">
                    Whether you want to donate, partner, volunteer, or simply
                    learn more — we want to hear from you.
                  </p>

                  <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label
                          className="text-xs font-medium tracking-wide uppercase mb-1.5 block"
                          style={{ color: "var(--forest)" }}
                        >
                          Name
                        </label>

                        <input
                          required
                          value={form.name}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              name: e.target.value,
                            })
                          }
                          placeholder="Your full name"
                          disabled={status === "submitting"}
                          className="w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 transition-all disabled:opacity-50"
                          style={{
                            borderColor: "rgba(74,140,82,0.2)",
                            background: "var(--mist)",
                            "--tw-ring-color":
                              "rgba(74,140,82,0.3)",
                          } as React.CSSProperties}
                        />
                      </div>

                      <div>
                        <label
                          className="text-xs font-medium tracking-wide uppercase mb-1.5 block"
                          style={{ color: "var(--forest)" }}
                        >
                          Email
                        </label>

                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              email: e.target.value,
                            })
                          }
                          placeholder="your@email.com"
                          disabled={status === "submitting"}
                          className="w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 transition-all disabled:opacity-50"
                          style={{
                            borderColor: "rgba(74,140,82,0.2)",
                            background: "var(--mist)",
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        className="text-xs font-medium tracking-wide uppercase mb-1.5 block"
                        style={{ color: "var(--forest)" }}
                      >
                        Subject
                      </label>

                      <select
                        value={form.subject}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            subject: e.target.value,
                          })
                        }
                        disabled={status === "submitting"}
                        className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all disabled:opacity-50"
                        style={{
                          borderColor: "rgba(74,140,82,0.2)",
                          background: "var(--mist)",
                          color: form.subject
                            ? "var(--charcoal)"
                            : "#94a3b8",
                        }}
                      >
                        <option value="">
                          Select a reason...
                        </option>
                        <option>I want to donate</option>
                        <option>
                          I want to sponsor a child
                        </option>
                        <option>
                          I want to partner / volunteer
                        </option>
                        <option>
                          Media / Press inquiry
                        </option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div>
                      <label
                        className="text-xs font-medium tracking-wide uppercase mb-1.5 block"
                        style={{ color: "var(--forest)" }}
                      >
                        Message
                      </label>

                      <textarea
                        required
                        rows={5}
                        value={form.message}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            message: e.target.value,
                          })
                        }
                        placeholder="Tell us what's on your heart..."
                        disabled={status === "submitting"}
                        className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none transition-all disabled:opacity-50"
                        style={{
                          borderColor: "rgba(74,140,82,0.2)",
                          background: "var(--mist)",
                        }}
                      />
                    </div>

                    {status === "error" && (
                      <div className="p-4 rounded-xl bg-red-50 text-red-700 text-xs font-medium flex items-center gap-2.5 border border-red-100">
                        <AlertCircle
                          size={16}
                          className="shrink-0"
                        />

                        <span>
                          We couldn't send your message. Please check your
                          connection and try again.
                        </span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="btn-shimmer w-full text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 text-sm tracking-wide disabled:opacity-50 disabled:pointer-events-none"
                    >
                      {status === "submitting" ? (
                        <>Sending...</>
                      ) : (
                        <>
                          Send Message <Send size={15} />
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
