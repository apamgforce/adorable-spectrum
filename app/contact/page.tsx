"use client";

import { useEffect } from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import ContactForm from "../components/ContactForm";

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
  useRevealAll();

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
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
