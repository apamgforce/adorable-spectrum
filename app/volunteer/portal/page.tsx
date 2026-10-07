"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Share2, Download, Link2, Check, Paperclip, X, CheckCircle2, Circle, Loader2, LogOut, MessageCircle, BookOpen, Undo2, ArrowRight, CalendarDays, Sparkles, Megaphone, Pin } from "lucide-react";


type Assignment = {
  id: number; status: "assigned" | "done" | "verified";
  attachments?: number; done_at: string | null; group_confirmed_at: string | null; verified_at: string | null;
  title: string; details: string | null; track: string | null; due_date: string | null;
};
type News = { id: number; title: string; body: string; track: string | null; pinned: boolean; created_at: string };
type Data = { news: News[]; volunteer: { name: string; code: string; track: string | null }; assignments: Assignment[]; certificate: { token: string; kind: string; issued_at: string } | null; badge: { token: string; since: string } | null; activeGroup: string };


// Shrink phone photos before upload so they stay well under the 4MB request limit.
async function shrink(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") return file;
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, 1800 / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bmp.width * scale); canvas.height = Math.round(bmp.height * scale);
    canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    const blob: Blob | null = await new Promise((r) => canvas.toBlob(r, "image/jpeg", 0.85));
    return blob ? new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" }) : file;
  } catch { return file; }
}

const fmt = (d: string) => new Date(d).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });

export default function PortalPage() {
  const [code, setCode] = useState("");
  const [data, setData] = useState<Data | null>(null);
  const [busy, setBusy] = useState<number | "login" | null>(null);
  const [error, setError] = useState("");
  const [boot, setBoot] = useState(true);
  const [openId, setOpenId] = useState<number | null>(null);
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  const call = useCallback(async (c: string, extra: Record<string, unknown> = {}) => {
    const res = await fetch("/api/volunteer", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: c, ...extra }) });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Error");
    return json as Data;
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("gf_vol_code");
    if (!saved) { setBoot(false); return; }
    call(saved).then(setData).catch(() => localStorage.removeItem("gf_vol_code")).finally(() => setBoot(false));
  }, [call]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setBusy("login");
    try {
      const d = await call(code.trim());
      localStorage.setItem("gf_vol_code", d.volunteer.code);
      setData(d);
    } catch (err) { setError((err as Error).message); }
    setBusy(null);
  };

  const act = async (id: number, action: string) => {
    if (!data) return;
    setBusy(id);
    try { setData(await call(data.volunteer.code, { action, assignmentId: id })); } catch (err) { setError((err as Error).message); }
    setBusy(null);
  };

  const submitDone = async (id: number) => {
    if (!data) return;
    setBusy(id); setError("");
    try {
      for (let i = 0; i < files.length; i++) {
        setProgress(`Uploading ${i + 1} of ${files.length}...`);
        const f = await shrink(files[i]);
        const fd = new FormData();
        fd.append("code", data.volunteer.code); fd.append("assignmentId", String(id)); fd.append("file", f);
        const r = await fetch("/api/volunteer/upload", { method: "POST", body: fd });
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || "Upload failed");
      }
      setProgress("");
      setData(await call(data.volunteer.code, { action: "done", assignmentId: id, text }));
      setOpenId(null); setText(""); setFiles([]);
    } catch (err) { setProgress(""); setError((err as Error).message); }
    setBusy(null);
  };

  const logout = () => { localStorage.removeItem("gf_vol_code"); setData(null); setCode(""); };

  if (boot) return <main className="min-h-screen pt-32 flex justify-center"><Loader2 className="animate-spin text-sage" /></main>;

  if (!data) {
    return (
      <main className="min-h-screen pt-28 pb-16 px-6 bg-gradient-to-b from-mist to-cream flex items-start justify-center">
        <div className="w-full max-w-md mt-6">
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-forest text-lime flex items-center justify-center mb-5"><Sparkles size={24} /></div>
            <h1 className="font-display text-4xl text-forest">Volunteer Portal</h1>
            <p className="text-slate-500 mt-2 text-base">Enter your volunteer ID to see this week&apos;s tasks.</p>
          </div>
          <form onSubmit={login} className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-forest/5 p-7 space-y-4">
            <label className="block text-sm tracking-[0.2em] uppercase text-slate-500">Your Volunteer ID</label>
            <input
              value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="GF-XXXXX" autoFocus autoCapitalize="characters"
              className="w-full text-center text-2xl tracking-widest font-semibold py-4 rounded-2xl border border-slate-200 focus:border-sage focus:ring-4 focus:ring-lime/20 outline-none text-forest"
            />
            {error && <p className="text-base text-red-600 text-center">{error}</p>}
            <button disabled={!code.trim() || busy === "login"} className="btn-shimmer w-full py-4 rounded-2xl text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50">
              {busy === "login" ? <Loader2 size={18} className="animate-spin" /> : <>Open my tasks <ArrowRight size={18} /></>}
            </button>
            <p className="text-sm text-slate-400 text-center">Lost your ID? Ask the coordinator in the Active Volunteers group.</p>
          </form>
          <Link href="/volunteer/training" className="mt-6 flex items-center justify-center gap-2 text-base text-leaf hover:text-forest"><BookOpen size={16} /> New here? Read the volunteer training</Link>
        </div>
      </main>
    );
  }

  const open = data.assignments.filter((a) => a.status === "assigned");
  const finished = data.assignments.filter((a) => a.status !== "assigned");
  const total = data.assignments.length;
  const pct = total ? Math.round((finished.length / total) * 100) : 0;
  const GROUP = data.activeGroup;
  const waitingGroup = finished.filter((a) => !a.group_confirmed_at);
  const first = data.volunteer.name.split(" ")[0];

  return (
    <main className="min-h-screen pt-24 pb-20 px-5 bg-gradient-to-b from-mist to-cream">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <p className="text-sm tracking-[0.2em] uppercase text-sage">{data.volunteer.code}{data.volunteer.track ? ` · ${data.volunteer.track}` : ""}</p>
            <h1 className="font-display text-4xl text-forest mt-1">Hello, {first}</h1>
          </div>
          <button onClick={logout} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-red-600 text-base flex items-center gap-2"><LogOut size={18} /> Log out</button>
        </div>

        <div className="bg-forest text-white rounded-3xl p-6 flex items-center gap-6 mb-6">
          <div className="relative w-20 h-20 shrink-0">
            <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="3" />
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="#7bc47f" strokeWidth="3" strokeLinecap="round" strokeDasharray={`${pct * 0.974} 100`} />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center font-semibold">{pct}%</span>
          </div>
          <div>
            <p className="font-display text-2xl">{open.length ? `${open.length} task${open.length > 1 ? "s" : ""} to do` : "You're all caught up"}</p>
            <p className="text-white/60 text-base">{finished.length} of {total} completed</p>
          </div>
        </div>

        {waitingGroup.length > 0 && (
          <div className="rounded-3xl border-2 border-gold/40 bg-amber/10 p-5 mb-6">
            <p className="font-medium text-forest">Last step: type <b>DONE</b> in the Active Volunteers group</p>
            <p className="text-base text-slate-600 mt-1">Your task only counts once the team sees it in the group.</p>
            {GROUP && <a href={GROUP} target="_blank" rel="noopener noreferrer" className="btn-gold mt-4 inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white text-base font-medium"><MessageCircle size={16} /> Open the group</a>}
          </div>
        )}

        {data.certificate && (
          <a href={`/certificate/${data.certificate.token}`} className="block rounded-3xl bg-gradient-to-r from-earth via-gold to-amber p-6 mb-6 text-white shadow-lg">
            <p className="text-sm tracking-[0.2em] uppercase opacity-80">Congratulations</p>
            <p className="font-display text-3xl">Your Certificate of Service is ready</p>
            <p className="text-base mt-1 opacity-90 flex items-center gap-1">View &amp; download <ArrowRight size={14} /></p>
          </a>
        )}

        {data.badge && (() => {
          const t = data.badge.token;
          const verifyUrl = `${location.origin}/verified/${t}`;
          const d = new Date(data.badge.since);
          const linkedinAdd = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent("Greenforce Verified Volunteer")}&organizationName=${encodeURIComponent("VTO Greenforce Foundation Africa")}&issueYear=${d.getFullYear()}&issueMonth=${d.getMonth() + 1}&certUrl=${encodeURIComponent(verifyUrl)}&certId=${encodeURIComponent("GF-" + t.slice(0, 8).toUpperCase())}`;
          const linkedinShare = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(verifyUrl)}`;
          return (
            <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-6 mb-6">
              <div className="flex items-center gap-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/verified/${t}/badge`} alt="Greenforce Verified Volunteer badge" className="w-28 h-28 rounded-full shadow-lg shrink-0" />
                <div>
                  <p className="font-display text-2xl text-forest">Greenforce Verified Volunteer</p>
                  <p className="text-base text-slate-500 mt-1">You are an approved volunteer. Share your badge with pride.</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-2 mt-5">
                <a href={linkedinAdd} target="_blank" rel="noopener noreferrer" className="py-3 rounded-xl bg-[#0A66C2] text-white text-base font-medium flex items-center justify-center gap-2"><Share2 size={16} /> Add to LinkedIn profile</a>
                <a href={linkedinShare} target="_blank" rel="noopener noreferrer" className="py-3 rounded-xl border border-[#0A66C2] text-[#0A66C2] text-base font-medium flex items-center justify-center gap-2"><Share2 size={16} /> Share a LinkedIn post</a>
                <a href={`/verified/${t}/badge`} download="Greenforce-Verified-Volunteer-Badge.png" className="py-3 rounded-xl border border-slate-200 text-slate-700 text-base flex items-center justify-center gap-2"><Download size={16} /> Download badge</a>
                <button onClick={() => { navigator.clipboard.writeText(verifyUrl); setCopiedLink(true); setTimeout(() => setCopiedLink(false), 1800); }} className="py-3 rounded-xl border border-slate-200 text-slate-700 text-base flex items-center justify-center gap-2">{copiedLink ? <><Check size={16} /> Link copied</> : <><Link2 size={16} /> Copy verification link</>}</button>
              </div>
            </div>
          );
        })()}

        {data.news.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm tracking-[0.2em] uppercase text-slate-500 mb-3 flex items-center gap-2"><Megaphone size={14} /> News &amp; updates</h2>
            <div className="space-y-3">
              {data.news.map((n) => (
                <div key={n.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                  <p className="font-medium text-forest">{n.pinned && <Pin size={14} className="inline mr-1.5 text-amber" />}{n.title}</p>
                  <p className="text-sm text-slate-400 mt-0.5">{new Date(n.created_at).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}</p>
                  <p className="text-base text-slate-600 mt-2 whitespace-pre-line">{n.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && <p className="text-base text-red-600 mb-4">{error}</p>}

        <h2 className="text-sm tracking-[0.2em] uppercase text-slate-500 mb-3">To do</h2>
        <div className="space-y-3 mb-8">
          {open.length === 0 && <p className="text-slate-400 text-base bg-white rounded-2xl p-6 text-center border border-slate-100">Nothing assigned right now. New tasks are posted weekly.</p>}
          {open.map((a) => (
            <div key={a.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <Circle className="text-slate-300 mt-0.5 shrink-0" size={22} />
                <div className="flex-1">
                  <p className="font-medium text-forest">{a.title}</p>
                  {a.details && <p className="text-base text-slate-500 mt-1 whitespace-pre-line">{a.details}</p>}
                  {a.due_date && <p className="text-sm text-slate-400 mt-2 flex items-center gap-1"><CalendarDays size={13} /> Due {fmt(a.due_date)}</p>}
                </div>
              </div>
              {openId !== a.id ? (
                <button onClick={() => { setOpenId(a.id); setText(""); setFiles([]); setError(""); }} className="btn-shimmer mt-4 w-full py-3 rounded-xl text-white text-base font-medium flex items-center justify-center gap-2">
                  <CheckCircle2 size={16} /> Mark as done
                </button>
              ) : (
                <div className="mt-4 rounded-2xl bg-mist p-4 space-y-3">
                  <p className="text-sm font-medium text-forest">Add your work (optional)</p>
                  <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} placeholder="Type your text or notes here, if the task asks for it" className="w-full rounded-xl border border-slate-200 p-3 text-base outline-none focus:border-sage bg-white" />
                  <label className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-sage/50 text-leaf text-base cursor-pointer hover:bg-white">
                    <Paperclip size={18} /> Attach images or files
                    <input type="file" multiple accept="image/*,.pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx" className="hidden" onChange={(e) => { const picked = Array.from(e.target.files || []); setFiles((prev) => [...prev, ...picked].slice(0, 8)); e.target.value = ""; }} />
                  </label>
                  {files.length > 0 && (
                    <ul className="space-y-1">
                      {files.map((f, i) => (
                        <li key={i} className="flex items-center justify-between text-sm bg-white rounded-lg px-3 py-2">
                          <span className="truncate pr-2">{f.name}</span>
                          <button onClick={() => setFiles(files.filter((_, j) => j !== i))} aria-label="Remove"><X size={16} className="text-slate-400" /></button>
                        </li>
                      ))}
                    </ul>
                  )}
                  {progress && <p className="text-sm text-leaf">{progress}</p>}
                  <div className="flex gap-2">
                    <button onClick={() => submitDone(a.id)} disabled={busy === a.id} className="btn-shimmer flex-1 py-3 rounded-xl text-white text-base font-medium flex items-center justify-center gap-2 disabled:opacity-60">
                      {busy === a.id ? <Loader2 size={16} className="animate-spin" /> : <><CheckCircle2 size={16} /> Submit &amp; mark done</>}
                    </button>
                    <button onClick={() => setOpenId(null)} disabled={busy === a.id} className="px-4 rounded-xl border border-slate-200 text-slate-600 text-base bg-white">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {finished.length > 0 && <h2 className="text-sm tracking-[0.2em] uppercase text-slate-500 mb-3">Completed</h2>}
        <div className="space-y-3">
          {finished.map((a) => (
            <div key={a.id} className="bg-white/70 rounded-2xl border border-slate-100 p-5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-sage mt-0.5 shrink-0" size={22} />
                <div className="flex-1">
                  <p className="font-medium text-slate-600 line-through decoration-slate-300">{a.title}</p>
                  <p className="text-sm mt-1 text-slate-400">
                    {a.status === "verified" ? "Verified by coordinator ✓" : a.group_confirmed_at ? "Posted in group · awaiting verification" : "Marked done"}{a.attachments ? ` · ${a.attachments} item${a.attachments > 1 ? "s" : ""} submitted` : ""}
                  </p>
                </div>
                {a.status === "done" && !a.group_confirmed_at && (
                  <button onClick={() => act(a.id, "undo")} className="text-slate-400 hover:text-forest p-1" aria-label="Undo"><Undo2 size={16} /></button>
                )}
              </div>
              {a.status === "done" && !a.group_confirmed_at && (
                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  {GROUP && <a href={GROUP} target="_blank" rel="noopener noreferrer" className="flex-1 py-3 rounded-xl bg-[#25D366] text-white text-base font-medium flex items-center justify-center gap-2"><MessageCircle size={16} /> Type DONE in the group</a>}
                  <button onClick={() => act(a.id, "group_confirmed")} disabled={busy === a.id} className="flex-1 py-3 rounded-xl border border-sage text-leaf text-base font-medium hover:bg-mist">I typed DONE ✓</button>
                </div>
              )}
            </div>
          ))}
        </div>

        <Link href="/volunteer/training" className="mt-10 flex items-center justify-center gap-2 text-base text-leaf hover:text-forest"><BookOpen size={16} /> Volunteer training &amp; how this works</Link>
      </div>
    </main>
  );
}
