"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Copy, Clock, Laptop, Sparkles } from "lucide-react";
import { TASK_TEMPLATES } from "../../../lib/tracks";

const FAQ = [
  { q: "Send on WhatsApp opens the wrong number or nothing", a: "Tap the person's name and fix their WhatsApp number. Ghana numbers can be typed as 024 123 4567. Other countries need the + and country code, e.g. +220 712 3456." },
  { q: "A volunteer lost their ID", a: "Volunteers tab, search their name, press Send ID. It sends the same ID again." },
  { q: "Someone applied twice", a: "Applying again with the same email just updates their details. If they used two emails, keep one and delete the other." },
  { q: "A volunteer says their ID doesn't work", a: "Check their status. Only Active volunteers can open the portal. New applicants and Paused volunteers can't." },
  { q: "I gave a task to the wrong person", a: "Tasks tab, open the task, press Remove next to their name. To add someone, use Add another volunteer." },
  { q: "Work was marked done but isn't good enough", a: "Verify tab, press Send back, then press Chat and tell them what to fix. The task returns to their to-do list." },
  { q: "The welcome message has no group link", a: "Settings tab: paste the Active Volunteers group invite link and press Save." },
  { q: "Numbers on the dashboard look old", a: "Press the refresh arrow at the top." },
];

const STEPS = [
  { t: "Welcome new applicants (5 min)", d: "Volunteers tab. New applicants are at the top in orange. Tap a name to check their details, then press Approve. A green box appears: press Send on WhatsApp and their ID, group link and portal link go to them in one message. Not a fit? Press Decline." },
  { t: "Plan the week with AI (10 min)", d: "Pick a job type below, copy its prompt into ChatGPT, Claude or Gemini, and adjust the result." },
  { t: "Give tasks (10 min)", d: "Give a task tab. Choose a ready-made task or write your own, set a due date, tick the volunteers (or press the track button to pick everyone in that track), then press Give." },
  { t: "Announce (2 min)", d: "Post in the Active Volunteers group: \u201cNew tasks are live. Open the portal with your ID.\u201d" },
  { t: "Chase and check (10-30 min)", d: "Tasks tab shows who hasn't finished. Press Remind next to a name to send a polite WhatsApp nudge. Verify tab: look at what they sent, then press Verify, or Send back with a note on WhatsApp." },
  { t: "Certificates (monthly)", d: "Certificates tab. People with a green Qualifies tag have earned one. Press Create certificate, then Email it or WhatsApp it." },
];

export default function CoordinatorTraining() {
  const [copied, setCopied] = useState("");
  const copy = (k: string, v: string) => { navigator.clipboard.writeText(v); setCopied(k); setTimeout(() => setCopied(""), 1500); };

  return (
    <main className="min-h-screen pt-24 pb-20 bg-cream">
      <section className="bg-forest text-white px-6 py-14">
        <div className="max-w-3xl mx-auto">
          <Link href="/admin/volunteers" className="text-base text-lime flex items-center gap-1 mb-4"><ArrowLeft size={14} /> Back to dashboard</Link>
          <h1 className="font-display text-5xl">Coordinator Guide</h1>
          <p className="text-white/70 mt-3 max-w-xl">You keep our volunteers busy, happy and on track, entirely remotely.</p>
          <div className="mt-6 flex flex-wrap gap-4 text-base">
            <span className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2"><Clock size={14} /> 30 min to 2 hrs a week</span>
            <span className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2"><Laptop size={14} /> 100% remote</span>
            <span className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2"><Sparkles size={14} /> AI does the heavy lifting</span>
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 -mt-6 space-y-8">
        <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-xl shadow-forest/5">
          <h2 className="font-display text-3xl text-forest mb-1">What you do each week</h2>
          <p className="text-base text-slate-500 mb-5">Once or twice a week. That&apos;s it.</p>
          <ol className="space-y-4">
            {STEPS.map((s, i) => (
              <li key={s.t} className="flex gap-4">
                <span className="w-8 h-8 rounded-full bg-mist text-leaf text-base font-semibold flex items-center justify-center shrink-0">{i + 1}</span>
                <div><p className="font-medium text-forest">{s.t}</p><p className="text-base text-slate-500">{s.d}</p></div>
              </li>
            ))}
          </ol>
        </div>

        <div className="bg-white rounded-3xl p-7 border border-slate-100">
          <h2 className="font-display text-3xl text-forest mb-3">Golden rules</h2>
          <ul className="list-disc ml-5 space-y-2 text-base text-slate-600">
            <li>Never share the main admin password. Helpers get their own login from <b>Settings → Helper logins</b>.</li>
            <li>Give tasks that fit a volunteer&apos;s track. Keep each task under 2 hours.</li>
            <li>Always give a clear title, instructions and a due date.</li>
            <li>Keep records correct. When someone changes their number, email, track or hours, tap their name in the Volunteers tab and edit it. Use Private notes for anything you want to remember.</li>
            <li>Someone stepping back? Set them to <b>Paused</b> instead of deleting. Delete only removes duplicates or test entries, and it can&apos;t be undone.</li>
            <li>Press <b>Export</b> in the Volunteers tab once a month and keep the spreadsheet as a backup.</li>
            <li>Tell volunteers that active service brings recognition. Review the Certificates tab monthly.</li>
            <li>Use AI for first drafts, but always read the result before assigning.</li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl p-7 border border-slate-100">
          <h2 className="font-display text-3xl text-forest mb-3">If something goes wrong</h2>
          <div className="space-y-4">
            {FAQ.map((f) => (
              <div key={f.q}><p className="font-medium text-forest">{f.q}</p><p className="text-base text-slate-600">{f.a}</p></div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-display text-3xl text-forest mb-1">Kinds of jobs you&apos;ll assign</h2>
          <p className="text-base text-slate-500 mb-4">Each is a ready-made task in the Assign tab, with an AI prompt to start from.</p>
          <div className="space-y-4">
            {TASK_TEMPLATES.map((t) => (
              <div key={t.key} className="bg-white rounded-2xl p-6 border border-slate-100">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="font-medium text-forest text-xl">{t.job}</h3>
                  <span className="text-sm px-3 py-1 rounded-full bg-mist text-leaf">{t.track}</span>
                  <span className="text-sm text-slate-400">{t.mins}</span>
                </div>
                <p className="text-base text-slate-600">{t.details}</p>
                <p className="text-sm text-earth mt-3"><b>Assign to:</b> {t.who}</p>
                <div className="mt-3 bg-mist rounded-xl p-4 text-sm text-slate-600 relative">
                  <p className="text-xs tracking-[0.2em] uppercase text-sage mb-1">AI prompt</p>
                  {t.prompt}
                  <button onClick={() => copy(t.key, t.prompt)} className="absolute top-3 right-3 text-slate-400 hover:text-forest" aria-label="Copy prompt">{copied === t.key ? <Check size={14} /> : <Copy size={14} />}</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-forest text-white rounded-3xl p-7">
          <h2 className="font-display text-3xl mb-2">Let AI plan your week</h2>
          <p className="text-white/70 text-base mb-4">Paste this into any AI assistant, then copy the best tasks into the Assign tab.</p>
          <div className="bg-white/10 rounded-xl p-4 text-base relative">
            List 8 remote volunteer tasks for this week for VTO Greenforce Foundation Africa (school greenhouses, education, community care). Each task: a short title, 2-3 line instructions, estimated time under 2 hours, and the skill needed (social media, AI content, Canva, gallery, scheduling). Mix easy and medium tasks.
            <button onClick={() => copy("week", "List 8 remote volunteer tasks for this week for VTO Greenforce Foundation Africa (school greenhouses, education, community care). Each task: a short title, 2-3 line instructions, estimated time under 2 hours, and the skill needed (social media, AI content, Canva, gallery, scheduling). Mix easy and medium tasks.")} className="absolute top-3 right-3 text-white/60 hover:text-white" aria-label="Copy">{copied === "week" ? <Check size={14} /> : <Copy size={14} />}</button>
          </div>
        </div>
      </div>
    </main>
  );
}
