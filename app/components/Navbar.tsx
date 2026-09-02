"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/85 backdrop-blur-xl border-b border-slate-200 shadow-sm"
          : "bg-white/70 backdrop-blur-md border-b border-slate-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">

        {/* BRAND */}
        <Link href="/" className="flex items-center gap-3 group">

          {/* LOGO */}
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200 shadow-sm bg-white">
            <Image
              src="/logo.jpg"
              alt="VTO Greenforce Foundation Africa"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* TEXT BRAND */}
          <div className="leading-tight">
            <div className="font-semibold text-[15px] text-forest tracking-wide">
              VTO Greenforce Foundation
            </div>
            <div className="text-[11px] tracking-[0.2em] uppercase text-slate-500">
              Africa
            </div>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium relative transition-colors duration-300 ${
                  active
                    ? "text-forest"
                    : "text-slate-600 hover:text-forest"
                }`}
              >
                {link.label}

                {/* ACTIVE UNDERLINE */}
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] transition-all duration-300 ${
                    active ? "w-full bg-forest" : "w-0 bg-forest"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* DESKTOP CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/apply"
            className="border border-forest text-forest text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-forest hover:text-white transition-all"
          >
            Apply for Support
          </Link>

          <Link
            href="/donate"
            className="bg-gradient-to-r from-forest to-leaf text-white text-sm font-semibold px-5 py-2.5 rounded-full flex items-center gap-2 shadow-sm hover:shadow-md transition-all"
          >
            Donate
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden text-forest"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-500 ${
          open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white border-t border-slate-200 px-6 py-6 flex flex-col gap-4">

          {navLinks.map((link) => {
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`text-sm font-medium ${
                  active ? "text-forest" : "text-slate-600"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* APPLY */}
          <Link
            href="/apply"
            onClick={() => setOpen(false)}
            className="mt-2 border border-forest text-forest text-sm font-semibold px-5 py-3 rounded-xl text-center"
          >
            Apply for Support
          </Link>

          {/* DONATE */}
          <Link
            href="/donate"
            onClick={() => setOpen(false)}
            className="bg-forest text-white text-sm font-semibold px-5 py-3 rounded-xl text-center flex items-center justify-center gap-2"
          >
            Donate Now
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </header>
  );
}
