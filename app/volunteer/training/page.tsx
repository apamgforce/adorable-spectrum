"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, CheckCircle2, Circle, MessageCircle, ArrowRight, ClipboardList, Smartphone, CheckCheck, Users, BadgeCheck } from "lucide-react";

const GROUP = "https://chat.whatsapp.com/Fit8eH747BLAna15s6RE92?s=cl&p=a&ilr=0";

const FLOW = [
  { icon: Users, title: "Join", text: "Sign up on the volunteer form and join the Active Volunteers WhatsApp group." },
  { icon: Smartphone, title: "Get your ID", text: "The coordinator sends your personal ID, like GF-7K2QX. It's your key. No password needed." },
  { icon: ClipboardList, title: "Receive tasks", text: "Tasks are assigned once or twice a week. Open the portal and enter your ID to see yours." },
  { icon: CheckCheck, title: "Mark done", text: "When you finish, tap Mark as done in the portal." },
  { icon: MessageCircle, title: "Type DONE in the group", text: "Then type DONE in the Active Volunteers group so the whole team sees it." },
  { icon: BadgeCheck, title: "Verified", text: "The coordinator verifies your work. Your completion rate builds your record." },
];

const MODULES = [
  { id: "mission", title: "1. Our mission & who we serve", mins: 4, points: [
    "VTO Greenforce Foundation Africa runs school greenhouses, youth agriculture training, education sponsorship and community care in Ghana and The Gambia.",
    "Every task you do links to one of these programmes. Ask your coordinator which one if you're unsure.",
    "We serve with dignity: never photograph or share beneficiaries without consent.",
  ] },
  { id: "os", title: "2. How the Volunteer OS works", mins: 5, points: [
    "Tasks are assigned by the coordinator, once or twice a week, to your personal ID.",
    "Open the Volunteer Portal, enter your ID, and your tasks appear. Tap Mark as done when finished.",
    "Then type DONE in the Active Volunteers group. A task is only fully complete after both steps.",
    "Made a mistake? Use the undo arrow before posting in the group, or tell the coordinator.",
    "Missing tasks or ID problems: message the coordinator in the group.",
  ] },
  { id: "conduct", title: "3. Conduct & safeguarding", mins: 5, points: [
    "Be respectful, punctual and honest in everything you report.",
    "Protect children and vulnerable people. Never be alone with a minor; always work in pairs or groups.",
    "Never ask beneficiaries or donors for money or gifts.",
    "Report any concern immediately to the coordinator, privately.",
    "Represent the foundation well, online and offline.",
  ] },
  { id: "field", title: "4. Field & greenhouse basics", mins: 6, points: [
    "Wear closed shoes, a hat and bring water. Wash hands after handling soil and compost.",
    "Greenhouses get hot: take breaks, hydrate, and never work alone in one.",
    "Handle tools carefully and return them where you found them.",
    "Follow the task instructions exactly. If unclear, ask before you start.",
  ] },
  { id: "reporting", title: "5. Reporting your work well", mins: 3, points: [
    "Mark done only when the task is truly finished.",
    "Use the note in the group to add a short update or photo if the coordinator asked for one.",
    "If you can't finish, tell the group early so the task can be reassigned. Early honesty is always welcome.",
  ] },
];

export default function TrainingPage() {
  const [open, setOpen] = useState<string | null>("os");
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    try { setDone(JSON.parse(localStorage.getItem("gf_training") || "[]")); } catch {}
  }, []);

  const toggle = (id: string) => {
    const next = done.includes(id) ? done.filter((d) => d !== id) : [...done, id];
    setDone(next);
    try { localStorage.setItem("gf_training", JSON.stringify(next)); } catch {}
  };

  const pct = Math.round((done.length / MODULES.length) * 100);

  return (
    <main className="min-h-screen pt-24 pb-20 bg-cream">
      <section className="bg-forest text-white px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs tracking-[0.25em] uppercase text-lime">Volunteer Training</p>
          <h1 className="font-display text-5xl md:text-6xl mt-3">Welcome to the Volunteer OS</h1>
          <p className="text-white/70 mt-4 text-lg max-w-xl">Everything you need in about 20 minutes: how we work, how to stay safe, and how to report your tasks.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/volunteer/portal" className="btn-gold px-6 py-3 rounded-xl text-white font-medium inline-flex items-center gap-2">Open my tasks <ArrowRight size={16} /></Link>
            <a href={GROUP} target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-xl border border-white/30 hover:bg-white/10 inline-flex items-center gap-2"><MessageCircle size={16} /> Active Volunteers group</a>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 -mt-8">
        <div className="bg-white rounded-3xl shadow-xl shadow-forest/5 border border-slate-100 p-6 md:p-8">
          <h2 className="font-display text-3xl text-forest mb-1">The weekly cycle</h2>
          <p className="text-slate-500 text-sm mb-6">Six simple steps. That&apos;s the whole system.</p>
          <ol className="space-y-5">
            {FLOW.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <div className="w-11 h-11 shrink-0 rounded-2xl bg-mist text-leaf flex items-center justify-center"><s.icon size={20} /></div>
                <div>
                  <p className="font-medium text-forest">{i + 1}. {s.title}</p>
                  <p className="text-sm text-slate-500">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-6 rounded-2xl bg-amber/10 border border-gold/30 p-4 text-sm text-slate-700">
            <b>Golden rule:</b> after you mark a task done in the portal, always type <b>DONE</b> in the group. Both steps, every time.
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 mt-12">
        <div className="flex items-end justify-between mb-4">
          <h2 className="font-display text-3xl text-forest">Training modules</h2>
          <span className="text-sm text-slate-500">{done.length}/{MODULES.length} complete</span>
        </div>
        <div className="h-2 rounded-full bg-slate-200 overflow-hidden mb-6"><div className="h-full bg-sage transition-all" style={{ width: `${pct}%` }} /></div>

        <div className="space-y-3">
          {MODULES.map((m) => {
            const isOpen = open === m.id, isDone = done.includes(m.id);
            return (
              <div key={m.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <button onClick={() => setOpen(isOpen ? null : m.id)} className="w-full flex items-center gap-3 p-5 text-left">
                  {isDone ? <CheckCircle2 className="text-sage shrink-0" size={22} /> : <Circle className="text-slate-300 shrink-0" size={22} />}
                  <span className="flex-1 font-medium text-forest">{m.title}</span>
                  <span className="text-xs text-slate-400">{m.mins} min</span>
                  <ChevronDown size={18} className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pl-14">
                    <ul className="space-y-2 text-sm text-slate-600 list-disc ml-4">{m.points.map((p) => <li key={p}>{p}</li>)}</ul>
                    <button onClick={() => toggle(m.id)} className={`mt-5 px-5 py-2.5 rounded-xl text-sm font-medium ${isDone ? "bg-mist text-leaf" : "btn-shimmer text-white"}`}>
                      {isDone ? "Completed ✓ (tap to undo)" : "Mark module complete"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {pct === 100 && (
          <div className="mt-8 rounded-3xl bg-forest text-white p-8 text-center">
            <p className="font-display text-3xl">You&apos;re ready 🌱</p>
            <p className="text-white/70 mt-2 text-sm">Training complete. Let the coordinator know in the group and open your tasks.</p>
            <Link href="/volunteer/portal" className="btn-gold mt-5 inline-flex px-6 py-3 rounded-xl text-white font-medium">Go to my tasks</Link>
          </div>
        )}
      </section>
    </main>
  );
}
