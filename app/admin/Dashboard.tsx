"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { TRACKS, TASK_TEMPLATES, HOURS, MODES, TRACK_LABELS } from "../lib/tracks";
import { waLink, prettyPhone } from "../lib/phone";
import { KeyRound, Megaphone, Pin, Trash2, LogOut, Award, BookOpen, Loader2, Lock, Plus, RefreshCw, Send, ShieldCheck, AlertTriangle, MessageCircle, Mail, Pencil, X, Search, Download, Check, UserCheck, UserX } from "lucide-react";

type Vol = {
  cert_token: string | null; id: number; code: string; name: string; email: string | null; whatsapp: string | null;
  track: string | null; hours: string | null; mode: string | null; notes: string | null; status: string;
  assigned: number; done: number; confirmed: number; last_login: string | null; last_done: string | null;
  created_at: string; approved_at: string | null; hubspot_id: string | null; hubspot_error: string | null;
};
type Sub = { kind: string; url: string | null; name: string | null; type: string | null; text: string | null };
type Q = { subs: Sub[]; id: number; name: string; code: string; whatsapp: string | null; title: string; done_at: string; group_confirmed_at: string | null; note: string | null };
type Person = { id: number; volunteer_id: number; name: string; whatsapp: string | null; status: string };
type Task = { id: number; title: string; details: string | null; track: string | null; assigned: number; done: number; due_date: string | null; created_at: string; people: Person[] };
type Dash = {
  volunteers: Vol[]; queue: Q[]; tasks: Task[];
  kpi: { total: number; done: number; verified: number; overdue: number; missing_group: number; avg_hours: number | null };
  byTrack: { track: string; total: number; done: number }[];
  eligible: { id: number; name: string; email: string | null; whatsapp: string | null; assigned: number; done: number; issued: boolean; token: string | null; kind: string | null }[];
  news: News[]; logins: { role: "coordinator" | "insights"; username: string | null; source: "site" | "vercel" | "none" }[];
  galleryOps: { id: number; username: string; role: string }[];
  activeGroup: string; hubspotDirect: boolean; role: "owner" | "coordinator";
};
type News = { id: number; title: string; body: string; track: string | null; pinned: boolean; created_at: string };
type Edit = { id?: number; name: string; email: string; whatsapp: string; track: string; hours: string; mode: string; notes: string; status: string };

const blank: Edit = { name: "", email: "", whatsapp: "", track: "", hours: "", mode: "", notes: "", status: "active" };
const first = (n: string) => n.trim().split(" ")[0];
const day = (d: string | null) => (d ? new Date(d).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "–");
const STATUS: Record<string, { label: string; cls: string }> = {
  pending: { label: "New applicant", cls: "bg-amber/20 text-earth" },
  active: { label: "Active", cls: "bg-lime/25 text-leaf" },
  inactive: { label: "Paused", cls: "bg-slate-100 text-slate-500" },
};
const modeLabel = (m: string | null) => MODES.find((x) => x.value === m)?.label || m || "";

function csv(rows: Vol[]) {
  const head = ["ID", "Name", "Email", "WhatsApp", "Track", "Hours/month", "Mode", "Status", "Applied", "Approved", "Tasks done", "Tasks given", "Notes"];
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = rows.map((v) => [v.status === "pending" ? "" : v.code, v.name, v.email, prettyPhone(v.whatsapp), v.track, v.hours, modeLabel(v.mode), STATUS[v.status]?.label || v.status, day(v.created_at), day(v.approved_at), v.done, v.assigned, v.notes].map(esc).join(","));
  const blob = new Blob(["\uFEFF" + [head.map(esc).join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = `volunteers-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
}

export default function Dashboard({ role }: { role: "owner" | "coordinator" }) {
  const owner = role === "owner";
  const KEY = `gf_${role}_auth`;
  const guide = owner ? "/admin/training" : "/coordinator/training";
  const [auth, setAuth] = useState<string | null>(null);
  const [u, setU] = useState(""); const [p, setP] = useState("");
  const [data, setData] = useState<Dash | null>(null);
  const [msg, setMsg] = useState(""); const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<"assign" | "queue" | "tasks" | "people" | "certs" | "news" | "settings">("people");
  const [group, setGroup] = useState(""); const [gop, setGop] = useState({ username: "", password: "", role: "gallery" });

  const [post_, setPost_] = useState({ title: "", body: "", track: "", pinned: false });
  const [acct, setAcct] = useState<{ cur: string; next: string; again: string } | null>(null); const [aerr, setAerr] = useState("");
  const [newLogin, setNewLogin] = useState({ role: "coordinator", username: "", password: "" });
  const [sel, setSel] = useState<number[]>([]);
  const [task, setTask] = useState({ title: "", details: "", track: "", dueDate: "" });
  const [edit, setEdit] = useState<Edit | null>(null);
  const [welcome, setWelcome] = useState<Vol | null>(null);
  const [q, setQ] = useState(""); const [fStatus, setFStatus] = useState("all"); const [fTrack, setFTrack] = useState("");
  const [openTask, setOpenTask] = useState<number | null>(null);

  const load = useCallback(async (a: string) => {
    const r = await fetch("/api/admin/volunteers", { headers: { Authorization: a }, cache: "no-store" });
    if (!r.ok) throw new Error(r.status === 401 ? "Wrong username or password" : "Couldn't load. Check your connection and press Refresh.");
    const d = await r.json();
    if (d.role !== role) throw new Error("Wrong username or password");
    setData(d); setGroup(d.activeGroup || "");
    return d as Dash;
  }, [role]);

  useEffect(() => {
    const s = sessionStorage.getItem(KEY);
    if (s) load(s).then((d) => { setAuth(s); if (!d.volunteers.some((v) => v.status === "pending")) setTab("assign"); }).catch(() => sessionStorage.removeItem(KEY));
  }, [load, KEY]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault(); setErr("");
    const a = `Bearer ${u.trim()}:${p}`;
    try { const d = await load(a); sessionStorage.setItem(KEY, a); setAuth(a); if (!d.volunteers.some((v) => v.status === "pending")) setTab("assign"); } catch (x) { setErr((x as Error).message); }
  };

  const logout = () => { sessionStorage.removeItem(KEY); setAuth(null); setData(null); setU(""); setP(""); };

  const post = async (body: Record<string, unknown>, ok?: string) => {
    if (!auth) return null;
    setBusy(true); setErr(""); setMsg("");
    try {
      const r = await fetch("/api/admin/volunteers", { method: "POST", headers: { "Content-Type": "application/json", Authorization: auth }, body: JSON.stringify(body) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || "That didn't save. Try again.");
      if (ok) setMsg(ok.replace("{n}", String(j.count ?? "")));
      await load(auth);
      return j;
    } catch (x) { setErr((x as Error).message); return null; } finally { setBusy(false); }
  };

  const changePw = async () => {
    if (!acct || !auth) return;
    if (acct.next !== acct.again) { setAerr("The new passwords don't match."); return; }
    setBusy(true); setAerr("");
    try {
      const r = await fetch("/api/admin/volunteers", { method: "POST", headers: { "Content-Type": "application/json", Authorization: auth }, body: JSON.stringify({ action: "change_password", currentPassword: acct.cur, newPassword: acct.next }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || "That didn't save. Try again.");
      const a = `Bearer ${auth.slice(7).split(":")[0]}:${acct.next}`;
      sessionStorage.setItem(KEY, a); setAuth(a); setAcct(null); setMsg("Password changed. Use the new one next time you sign in.");
    } catch (x) { setAerr((x as Error).message); } finally { setBusy(false); }
  };

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const inviteText = (v: Pick<Vol, "name" | "code">) =>
    `Hi ${first(v.name)}, welcome to VTO Greenforce Foundation Africa! 🌱 You've been approved as a volunteer.\n\nYour volunteer ID: *${v.code}*\n\n` +
    (data?.activeGroup ? `1. Join the Active Volunteers group: ${data.activeGroup}\n` : "") +
    `${data?.activeGroup ? "2" : "1"}. Do the short training: ${origin}/volunteer/training\n` +
    `${data?.activeGroup ? "3" : "2"}. See your tasks any time: ${origin}/volunteer/portal (enter your ID)\n\nWelcome aboard!`;
  const reminderText = (name: string, t: Task) =>
    `Hi ${first(name)}, a gentle reminder about your Greenforce task: "${t.title}"${t.due_date ? `, due ${day(t.due_date)}` : ""}. Open ${origin}/volunteer/portal with your volunteer ID to mark it done. Thank you!`;

  const pending = (data?.volunteers || []).filter((v) => v.status === "pending");
  const active = useMemo(() => (data?.volunteers || []).filter((v) => v.status === "active"), [data]);
  const qualifies = (id: number) => !!data?.eligible.some((e) => e.id === id);
  const shown = useMemo(() => {
    const t = q.trim().toLowerCase(), digits = q.replace(/\D/g, "");
    return (data?.volunteers || [])
      .filter((v) => fStatus === "all" || v.status === fStatus)
      .filter((v) => !fTrack || v.track === fTrack)
      .filter((v) => !t || [v.name, v.email, v.code, v.track].some((x) => x?.toLowerCase().includes(t)) || (digits.length > 3 && (v.whatsapp || "").replace(/\D/g, "").includes(digits)))
      .sort((a, b) => Number(b.status === "pending") - Number(a.status === "pending"));
  }, [data, q, fStatus, fTrack]);

  const approve = async (v: Vol) => {
    const r = await post({ action: "set_status", volunteerId: v.id, status: "active" }, `${v.name} approved.`);
    if (r) setWelcome(v);
  };
  const openEdit = (v?: Vol) => setEdit(v ? { id: v.id, name: v.name, email: v.email || "", whatsapp: v.whatsapp || "", track: v.track || "", hours: v.hours || "", mode: v.mode || "", notes: v.notes || "", status: v.status } : { ...blank });
  const saveEdit = async () => {
    if (!edit) return;
    if (edit.id) {
      const before = data?.volunteers.find((v) => v.id === edit.id);
      const r = await post({ action: "update_volunteer", volunteerId: edit.id, ...edit }, "Saved");
      if (!r) return;
      if (before && before.status !== edit.status) {
        await post({ action: "set_status", volunteerId: edit.id, status: edit.status }, "Saved");
        if (edit.status === "active" && before.status === "pending") setWelcome({ ...before, name: edit.name, whatsapp: edit.whatsapp });
      }
      setEdit(null);
    } else {
      const r = await post({ action: "add_volunteer", ...edit }, "Volunteer added");
      if (r) { setEdit(null); setWelcome({ ...(blank as unknown as Vol), id: r.id, code: r.code, name: edit.name, whatsapp: edit.whatsapp, email: edit.email || null }); }
    }
  };

  if (!auth) {
    return (
      <main className="min-h-screen pt-32 px-6 flex justify-center bg-mist">
        <form onSubmit={login} className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-xl border border-slate-100 h-fit space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-forest text-lime flex items-center justify-center"><Lock size={20} /></div>
          <h1 className="font-display text-3xl text-forest">{owner ? "Greenforce Admin" : "Volunteer Coordinator"}</h1>
          <input value={u} onChange={(e) => setU(e.target.value)} placeholder="Username" autoComplete="username" autoCapitalize="none" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-sage" />
          <input type="password" value={p} onChange={(e) => setP(e.target.value)} placeholder="Password" autoComplete="current-password" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-sage" />
          {err && <p className="text-base text-red-600">{err}</p>}
          <button className="btn-shimmer w-full py-3 rounded-xl text-white font-medium">Sign in</button>
        </form>
      </main>
    );
  }

  const k = data?.kpi;
  const rate = k && k.total ? Math.round((k.done / k.total) * 100) : 0;
  const input = "w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-sage bg-white text-base";
  const label = "text-sm text-slate-500 mb-1 block";
  const waBtn = "px-3 py-2 rounded-lg bg-[#25D366] text-white text-sm font-medium inline-flex items-center gap-1.5";

  return (
    <main className="min-h-screen pt-24 pb-20 px-4 sm:px-5 bg-mist">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <p className="text-sm tracking-[0.2em] uppercase text-sage flex items-center gap-1"><ShieldCheck size={14} /> {owner ? "Owner" : "Coordinator"}</p>
            <h1 className="font-display text-4xl text-forest">{owner ? "Greenforce Admin" : "Volunteer Operations"}</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={guide} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-base flex items-center gap-2 hover:border-sage"><BookOpen size={15} /> How to use this</Link>
            {owner && <Link href="/insights" className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-base hover:border-sage">Insights</Link>}
            {owner && <Link href="/gallery-admin" className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-base hover:border-sage">Gallery</Link>}
            <button onClick={() => load(auth).then(() => setMsg("Up to date")).catch((x) => setErr(x.message))} className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-sage" aria-label="Refresh" title="Refresh"><RefreshCw size={16} /></button>
            <button onClick={() => { setAcct({ cur: "", next: "", again: "" }); setAerr(""); }} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-base flex items-center gap-2 hover:border-sage"><KeyRound size={15} /> Password</button>
            <button onClick={logout} className="px-4 py-2.5 rounded-xl bg-red-50 text-red-600 border border-red-200 text-base font-medium flex items-center gap-2 hover:bg-red-600 hover:text-white"><LogOut size={16} /> Log out</button>
          </div>
        </div>

        {(msg || err) && (
          <div className={`mb-5 rounded-xl px-4 py-3 text-base flex items-start justify-between gap-3 ${err ? "bg-red-50 text-red-700" : "bg-lime/20 text-forest"}`}>
            <span>{err || msg}</span><button onClick={() => { setErr(""); setMsg(""); }} aria-label="Close"><X size={16} /></button>
          </div>
        )}

        {/* Welcome message after approval */}
        {welcome && (
          <div className="mb-5 rounded-2xl border-2 border-[#25D366]/40 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-forest text-lg">Send {first(welcome.name)} their volunteer ID</p>
                <p className="text-sm text-slate-500">ID <b className="font-mono">{welcome.code}</b>. The message includes the group link, training and portal.</p>
              </div>
              <button onClick={() => setWelcome(null)} aria-label="Close" className="text-slate-400"><X size={18} /></button>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {waLink(welcome.whatsapp, inviteText(welcome)) ? (
                <a href={waLink(welcome.whatsapp, inviteText(welcome))!} target="_blank" rel="noopener noreferrer" onClick={() => setTimeout(() => setWelcome(null), 500)} className={waBtn + " px-5 py-3 text-base"}><MessageCircle size={16} /> Send on WhatsApp</a>
              ) : <span className="text-sm text-earth">No valid WhatsApp number. Edit the volunteer to add one, or use email.</span>}
              {welcome.email && <a href={`mailto:${welcome.email}?subject=${encodeURIComponent("Welcome to Greenforce: your volunteer ID")}&body=${encodeURIComponent(inviteText(welcome).replace(/\*/g, ""))}`} className="px-5 py-3 rounded-lg bg-forest text-white text-base inline-flex items-center gap-1.5"><Mail size={16} /> Email</a>}
              <button onClick={() => { navigator.clipboard?.writeText(inviteText(welcome)); setMsg("Message copied"); }} className="px-5 py-3 rounded-lg border border-slate-200 text-base">Copy text</button>
            </div>
          </div>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {[
            { l: "New applicants", v: pending.length, warn: pending.length > 0, go: "people" as const },
            { l: "Active volunteers", v: active.length },
            { l: "Task completion", v: `${rate}%` },
            { l: "Overdue tasks", v: k?.overdue ?? 0, warn: (k?.overdue ?? 0) > 0, go: "tasks" as const },
            { l: "Waiting for you to verify", v: data?.queue.length ?? 0, warn: (data?.queue.length ?? 0) > 0, go: "queue" as const },
          ].map((c) => (
            <button key={c.l} onClick={() => { if (c.go) { setTab(c.go); if (c.go === "people") setFStatus(pending.length ? "pending" : "all"); } }} className="text-left bg-white rounded-2xl p-5 border border-slate-100 hover:border-sage">
              <p className={`font-display text-4xl ${c.warn ? "text-amber" : "text-forest"}`}>{c.v}</p>
              <p className="text-sm text-slate-500 mt-1">{c.l}</p>
            </button>
          ))}
        </div>

        <div className="flex gap-1 bg-white rounded-xl p-1 border border-slate-100 mb-5 overflow-x-auto">
          {([["people", `Volunteers${pending.length ? ` (${pending.length} new)` : ""}`], ["assign", "Give a task"], ["tasks", "Tasks"], ["queue", `Verify (${data?.queue.length ?? 0})`], ["certs", "Certificates"], ["news", "News"], ...(owner ? [["settings", "Settings"] as const] : [])] as const).map(([id, l]) => (
            <button key={id} onClick={() => setTab(id)} className={`px-4 py-2 rounded-lg text-base whitespace-nowrap ${tab === id ? "bg-forest text-white" : "text-slate-600"}`}>{l}</button>
          ))}
        </div>

        {tab === "people" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 border border-slate-100 flex flex-wrap gap-2 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input className={input + " pl-9"} placeholder="Search name, email, phone or ID" value={q} onChange={(e) => setQ(e.target.value)} />
              </div>
              <select className={input + " w-auto"} value={fStatus} onChange={(e) => setFStatus(e.target.value)}>
                <option value="all">Everyone</option><option value="pending">New applicants</option><option value="active">Active</option><option value="inactive">Paused</option>
              </select>
              <select className={input + " w-auto"} value={fTrack} onChange={(e) => setFTrack(e.target.value)}>
                <option value="">All tracks</option>{TRACKS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <button onClick={() => openEdit()} className="btn-shimmer px-4 py-3 rounded-xl text-white text-base flex items-center gap-2"><Plus size={16} /> Add</button>
              <button onClick={() => csv(shown)} className="px-4 py-3 rounded-xl border border-slate-200 text-base flex items-center gap-2" title="Download this list as a spreadsheet"><Download size={16} /> Export</button>
            </div>
            <p className="text-sm text-slate-500 px-1">Showing {shown.length} of {data?.volunteers.length ?? 0}. Tap a name to see or change their details.</p>

            <div className="space-y-3">
              {shown.length === 0 && <p className="bg-white rounded-2xl p-8 text-center text-slate-400 border border-slate-100">No one matches. Clear the search or filters.</p>}
              {shown.map((v) => {
                const st = STATUS[v.status] || STATUS.active;
                const chat = waLink(v.whatsapp);
                return (
                  <div key={v.id} className={`bg-white rounded-2xl p-4 border ${v.status === "pending" ? "border-amber/50" : "border-slate-100"} ${v.status === "inactive" ? "opacity-60" : ""}`}>
                    <div className="flex flex-wrap items-start gap-3">
                      <button onClick={() => openEdit(v)} className="flex-1 min-w-[220px] text-left">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium text-forest text-lg">{v.name}</span>
                          <span className={`text-xs px-2.5 py-0.5 rounded-full ${st.cls}`}>{st.label}</span>
                          {v.status !== "pending" && <span className="font-mono text-sm text-slate-500">{v.code}</span>}
                          {v.hubspot_error && data?.hubspotDirect && <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600" title={v.hubspot_error}>CRM not updated</span>}
                        </div>
                        <p className="text-sm text-slate-500 mt-1">{[v.track, v.hours && `${v.hours}/month`, modeLabel(v.mode)].filter(Boolean).join(" · ") || "No track chosen"}</p>
                        <p className="text-sm text-slate-400 mt-0.5">{[prettyPhone(v.whatsapp), v.email].filter(Boolean).join(" · ") || "No contact details"}</p>
                        {v.status !== "pending" && <p className="text-xs text-slate-400 mt-1">Tasks {v.done}/{v.assigned} done{v.last_login ? "" : " · has not opened the portal yet"}</p>}
                        {v.status === "pending" && <p className="text-xs text-slate-400 mt-1">Applied {day(v.created_at)}</p>}
                      </button>
                      <div className="flex flex-wrap gap-2 items-center">
                        {v.status === "pending" && <>
                          <button disabled={busy} onClick={() => approve(v)} className="btn-shimmer px-4 py-2 rounded-lg text-white text-sm flex items-center gap-1.5"><UserCheck size={15} /> Approve</button>
                          <button disabled={busy} onClick={() => { if (confirm(`Decline ${v.name}? They move to Paused and can be approved later.`)) post({ action: "set_status", volunteerId: v.id, status: "inactive" }, `${v.name} declined`); }} className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 flex items-center gap-1.5"><UserX size={15} /> Decline</button>
                        </>}
                        {v.status === "active" && chat && <a href={waLink(v.whatsapp, inviteText(v))!} target="_blank" rel="noopener noreferrer" className={waBtn} title="Opens WhatsApp with their ID, group link and portal link ready to send"><Send size={14} /> Send ID</a>}
                        {chat && <a href={chat} target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-lg border border-[#25D366] text-[#128C7E] text-sm inline-flex items-center gap-1.5"><MessageCircle size={14} /> Chat</a>}
                        {v.email && <a href={`mailto:${v.email}`} className="p-2 rounded-lg border border-slate-200 text-slate-500" title="Email"><Mail size={15} /></a>}
                        <button onClick={() => openEdit(v)} className="p-2 rounded-lg border border-slate-200 text-slate-500" title="Edit"><Pencil size={15} /></button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === "assign" && (
          <div className="grid lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 space-y-3">
              <h2 className="font-display text-2xl text-forest">1. Write the task</h2>
              <select className={input} value="" onChange={(e) => { const t = TASK_TEMPLATES.find((x) => x.key === e.target.value); if (t) setTask({ ...task, title: t.title, details: t.details, track: t.track }); }}>
                <option value="">⚡ Start from a ready-made task...</option>
                {TASK_TEMPLATES.map((t) => <option key={t.key} value={t.key}>{t.job}</option>)}
              </select>
              <input className={input} placeholder="Task title (what to do)" value={task.title} onChange={(e) => setTask({ ...task, title: e.target.value })} />
              <textarea className={input} rows={4} placeholder="Instructions: what exactly to do, where to find materials, what to send back" value={task.details} onChange={(e) => setTask({ ...task, details: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <div><span className={label}>Track</span><select className={input} value={task.track} onChange={(e) => setTask({ ...task, track: e.target.value })}><option value="">Any</option>{TRACKS.map((t) => <option key={t}>{t}</option>)}</select></div>
                <div><span className={label}>Due date</span><input type="date" className={input} value={task.dueDate} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setTask({ ...task, dueDate: e.target.value })} /></div>
              </div>
              <button disabled={busy || !task.title.trim() || !sel.length}
                onClick={async () => { const r = await post({ action: "assign", volunteerIds: sel, ...task }, "Task given to {n} volunteers. Now tell them in the Active Volunteers group."); if (r) { setTask({ title: "", details: "", track: "", dueDate: "" }); setSel([]); } }}
                className="btn-shimmer w-full py-3 rounded-xl text-white font-medium flex items-center justify-center gap-2 disabled:opacity-40">
                {busy ? <Loader2 size={16} className="animate-spin" /> : <><Send size={16} /> Give to {sel.length} selected</>}
              </button>
              {!sel.length && task.title && <p className="text-sm text-earth text-center">Tick at least one volunteer on the right.</p>}
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display text-2xl text-forest">2. Choose who</h2>
                <div className="flex gap-3 text-sm text-leaf">
                  <button onClick={() => setSel(active.map((v) => v.id))}>All</button>
                  {task.track && <button onClick={() => setSel(active.filter((v) => v.track === task.track).map((v) => v.id))}>{task.track} only</button>}
                  <button onClick={() => setSel([])}>None</button>
                </div>
              </div>
              <div className="max-h-96 overflow-auto divide-y divide-slate-100">
                {active.length === 0 && <p className="text-base text-slate-400 py-6 text-center">No active volunteers yet. Approve new applicants in the Volunteers tab first.</p>}
                {active.map((v) => (
                  <label key={v.id} className="flex items-center gap-3 py-2.5 cursor-pointer">
                    <input type="checkbox" className="accent-[#2d6a35] w-4 h-4" checked={sel.includes(v.id)} onChange={() => setSel(sel.includes(v.id) ? sel.filter((i) => i !== v.id) : [...sel, v.id])} />
                    <span className="flex-1 text-base text-forest">{v.name}</span>
                    <span className="text-sm text-slate-400">{v.track || "–"}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "tasks" && (
          <div className="space-y-3">
            {(data?.tasks.length ?? 0) === 0 && <p className="bg-white rounded-2xl p-8 text-center text-slate-400 border border-slate-100">No tasks yet. Use “Give a task”.</p>}
            {data?.tasks.map((t) => {
              const late = t.due_date && new Date(t.due_date) < new Date(new Date().toDateString());
              const notDone = t.people.filter((x) => x.status === "assigned");
              const isOpen = openTask === t.id;
              return (
                <div key={t.id} className="bg-white rounded-2xl border border-slate-100">
                  <button onClick={() => setOpenTask(isOpen ? null : t.id)} className="w-full p-5 flex flex-wrap items-center gap-3 text-left">
                    <div className="flex-1 min-w-[200px]">
                      <p className="font-medium text-forest">{t.title}</p>
                      <p className="text-sm text-slate-500">{t.track || "Any track"} · given {day(t.created_at)}{t.due_date ? ` · due ${day(t.due_date)}` : ""}</p>
                    </div>
                    {late && notDone.length > 0 && <span className="text-xs px-2.5 py-1 rounded-full bg-amber/20 text-earth">{notDone.length} overdue</span>}
                    <span className="text-sm text-slate-600">{t.done}/{t.assigned} done</span>
                    <div className="w-24 h-2 rounded-full bg-slate-100 overflow-hidden"><div className="h-full bg-sage" style={{ width: `${t.assigned ? (t.done / t.assigned) * 100 : 0}%` }} /></div>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 border-t border-slate-100 pt-4 space-y-3">
                      {t.details && <p className="text-sm text-slate-600 whitespace-pre-line bg-mist rounded-xl p-3">{t.details}</p>}
                      <div className="divide-y divide-slate-100">
                        {t.people.map((x) => (
                          <div key={x.id} className="py-2.5 flex flex-wrap items-center gap-2">
                            <span className="flex-1 text-base text-forest">{x.name}</span>
                            <span className={`text-xs px-2.5 py-0.5 rounded-full ${x.status === "assigned" ? "bg-slate-100 text-slate-500" : x.status === "done" ? "bg-amber/20 text-earth" : "bg-lime/25 text-leaf"}`}>{x.status === "assigned" ? "Not done yet" : x.status === "done" ? "Done · verify it" : "Verified"}</span>
                            {x.status === "assigned" && waLink(x.whatsapp) && <a href={waLink(x.whatsapp, reminderText(x.name, t))!} target="_blank" rel="noopener noreferrer" className={waBtn}><MessageCircle size={14} /> Remind</a>}
                            {x.status === "assigned" && <button onClick={() => { if (confirm(`Take this task away from ${x.name}?`)) post({ action: "unassign", assignmentId: x.id }, "Removed"); }} className="text-sm text-slate-400 hover:text-red-600 px-2">Remove</button>}
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2 pt-2">
                        <select className={input + " w-auto"} value="" onChange={(e) => { if (e.target.value) post({ action: "add_to_task", taskId: t.id, volunteerIds: [Number(e.target.value)] }, "Added"); }}>
                          <option value="">+ Add another volunteer…</option>
                          {active.filter((v) => !t.people.some((x) => x.volunteer_id === v.id)).map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
                        </select>
                        <button onClick={() => { if (confirm(`Delete “${t.title}” for everyone? Submitted work for it is deleted too.`)) post({ action: "delete_task", taskId: t.id }, "Task deleted"); }} className="px-4 py-3 rounded-xl border border-red-200 text-red-600 text-base flex items-center gap-2"><Trash2 size={15} /> Delete task</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {tab === "queue" && (
          <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-100">
            {data?.queue.length === 0 && <p className="p-8 text-center text-base text-slate-400">Nothing waiting. When volunteers mark tasks done, they appear here.</p>}
            {data?.queue.map((qq) => (
              <div key={qq.id} className="p-5 flex flex-wrap items-center gap-3">
                <div className="flex-1 min-w-[200px]">
                  <p className="font-medium text-forest">{qq.title}</p>
                  <p className="text-sm text-slate-500">{qq.name} · {qq.code} · {new Date(qq.done_at).toLocaleString()}</p>
                  {qq.note && <p className="text-sm text-slate-600 mt-1 italic">&ldquo;{qq.note}&rdquo;</p>}
                  {qq.subs?.length > 0 ? (
                    <div className="mt-3 space-y-2">
                      {qq.subs.filter((x) => x.kind === "text").map((x, i) => <p key={i} className="text-base text-slate-700 bg-mist rounded-xl p-3 whitespace-pre-wrap">{x.text}</p>)}
                      <div className="flex flex-wrap gap-2">
                        {qq.subs.filter((x) => x.kind === "file" && x.url).map((x, i) => x.type?.startsWith("image/") ? (
                          <a key={i} href={x.url!} target="_blank" rel="noopener noreferrer" title={x.name || ""}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={x.url!} alt={x.name || "submission"} className="w-24 h-24 object-cover rounded-xl border border-slate-200 hover:opacity-80" />
                          </a>
                        ) : (
                          <a key={i} href={x.url!} target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-xl border border-slate-200 text-sm text-leaf hover:bg-mist">📎 {x.name || "File"}</a>
                        ))}
                      </div>
                    </div>
                  ) : <p className="text-sm text-slate-400 mt-1">Nothing attached. Check the group for their proof.</p>}
                </div>
                <span className={`text-sm px-3 py-1 rounded-full ${qq.group_confirmed_at ? "bg-lime/20 text-leaf" : "bg-amber/20 text-earth"}`}>{qq.group_confirmed_at ? "Posted DONE in group" : "No DONE in group yet"}</span>
                {waLink(qq.whatsapp) && <a href={waLink(qq.whatsapp)!} target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-lg border border-[#25D366] text-[#128C7E] text-sm inline-flex items-center gap-1.5"><MessageCircle size={14} /> Chat</a>}
                <button disabled={busy} onClick={() => post({ action: "verify", assignmentId: qq.id }, "Verified")} className="btn-shimmer px-4 py-2 rounded-lg text-white text-base flex items-center gap-1.5"><Check size={15} /> Verify</button>
                <button disabled={busy} onClick={() => post({ action: "reopen", assignmentId: qq.id }, "Sent back. Tell them what to fix.")} className="px-4 py-2 rounded-lg border border-slate-200 text-base text-slate-600">Send back</button>
              </div>
            ))}
          </div>
        )}

        {tab === "certs" && (
          <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-100">
            <div className="p-5 flex flex-wrap items-center gap-3 justify-between">
              <p className="text-base text-slate-600 max-w-xl">A green <b>Qualifies</b> tag means 2+ months of service, 4+ tasks and at least half done. You can still create a certificate for anyone.</p>
              <a href="/certificate/sample" target="_blank" className="px-5 py-3 rounded-xl border border-sage text-leaf text-base font-medium">See a sample</a>
            </div>
            {[...active].sort((a, b) => Number(!!b.cert_token) - Number(!!a.cert_token) || Number(qualifies(b.id)) - Number(qualifies(a.id))).map((v) => {
              const link = v.cert_token ? `${origin}/certificate/${v.cert_token}` : "";
              const body = `Dear ${first(v.name)},\n\nThank you for your faithful service with VTO Greenforce Foundation Africa. Your certificate is ready. Open this link to view it and download the PDF:\n${link}\n\nWith gratitude,\nVTO Greenforce Foundation Africa`;
              const wa = waLink(v.whatsapp, body);
              return (
                <div key={v.id} className="p-5 flex flex-wrap items-center gap-3">
                  <div className="flex-1 min-w-[180px]">
                    <p className="font-medium text-forest text-lg">{v.name}</p>
                    <p className="text-sm text-slate-500">{v.done} of {v.assigned} tasks completed</p>
                  </div>
                  {qualifies(v.id) && <span className="text-sm px-3 py-1 rounded-full bg-lime/30 text-leaf">Qualifies</span>}
                  {!v.cert_token ? (
                    <button disabled={busy} onClick={() => { if (confirm(`Create a certificate for ${v.name}?`)) post({ action: "issue_certificate", volunteerId: v.id }, "Certificate created. Now send it."); }} className="btn-shimmer px-4 py-2.5 rounded-xl text-white text-base flex items-center gap-2"><Award size={16} /> Create certificate</button>
                  ) : (
                    <>
                      <a href={link} target="_blank" className="px-4 py-2.5 rounded-xl border border-slate-200 text-base">View</a>
                      <a href={`${link}/pdf`} className="px-4 py-2.5 rounded-xl border border-slate-200 text-base">PDF</a>
                      {v.email && <a href={`mailto:${v.email}?subject=${encodeURIComponent("Your Greenforce Certificate")}&body=${encodeURIComponent(body)}`} className="px-4 py-2.5 rounded-xl bg-forest text-white text-base">Email it</a>}
                      {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="px-4 py-2.5 rounded-xl bg-[#25D366] text-white text-base">WhatsApp it</a>}
                    </>
                  )}
                </div>
              );
            })}
            {active.length === 0 && <p className="p-8 text-center text-base text-slate-400">No active volunteers yet.</p>}
          </div>
        )}

        {tab === "news" && (
          <div className="grid lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 space-y-3 h-fit">
              <h2 className="font-display text-2xl text-forest flex items-center gap-2"><Megaphone size={20} /> Post an update</h2>
              <p className="text-base text-slate-500">Shows at the top of every volunteer&apos;s portal. Use it for announcements, wins and deadlines.</p>
              <input className={input} placeholder="Headline" maxLength={150} value={post_.title} onChange={(e) => setPost_({ ...post_, title: e.target.value })} />
              <textarea className={input} rows={5} placeholder="What do volunteers need to know?" maxLength={5000} value={post_.body} onChange={(e) => setPost_({ ...post_, body: e.target.value })} />
              <select className={input} value={post_.track} onChange={(e) => setPost_({ ...post_, track: e.target.value })}>
                <option value="">Everyone</option>
                {TRACKS.map((t) => <option key={t} value={t}>Only {TRACK_LABELS[t] || t} volunteers</option>)}
              </select>
              <label className="flex items-center gap-2 text-base text-slate-600"><input type="checkbox" checked={post_.pinned} onChange={(e) => setPost_({ ...post_, pinned: e.target.checked })} /> Pin to the top</label>
              <button disabled={busy || !post_.title.trim() || !post_.body.trim()} onClick={async () => { const r = await post({ action: "post_news", title: post_.title, body: post_.body, track: post_.track, pinned: post_.pinned }, "Update posted. Volunteers see it next time they open the portal."); if (r) setPost_({ title: "", body: "", track: "", pinned: false }); }} className="btn-shimmer w-full py-3 rounded-xl text-white font-medium disabled:opacity-40">Post update</button>
            </div>
            <div className="space-y-3">
              {(data?.news.length ?? 0) === 0 && <p className="bg-white rounded-2xl p-8 text-center text-slate-400 border border-slate-100">No updates yet.</p>}
              {data?.news.map((n) => (
                <div key={n.id} className="bg-white rounded-2xl p-5 border border-slate-100">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="font-medium text-forest flex-1 min-w-[160px]">{n.pinned && <Pin size={13} className="inline mr-1 text-amber" />}{n.title}</p>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-mist text-leaf">{n.track ? (TRACK_LABELS[n.track] || n.track) : "Everyone"}</span>
                  </div>
                  <p className="text-sm text-slate-400 mb-2">{day(n.created_at)}</p>
                  <p className="text-base text-slate-600 whitespace-pre-line">{n.body}</p>
                  <div className="flex gap-3 mt-3 text-sm">
                    <button disabled={busy} onClick={() => post({ action: "pin_news", newsId: n.id, pinned: !n.pinned }, n.pinned ? "Unpinned" : "Pinned")} className="text-leaf">{n.pinned ? "Unpin" : "Pin to top"}</button>
                    <button disabled={busy} onClick={() => { if (confirm(`Delete “${n.title}”?`)) post({ action: "delete_news", newsId: n.id }, "Update deleted"); }} className="text-red-600">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "settings" && (
          <div className="grid lg:grid-cols-2 gap-5">
            <div className="space-y-5">
              <div className="bg-white rounded-2xl p-6 border border-slate-100 space-y-3 h-fit">
                <h2 className="font-display text-2xl text-forest">Active Volunteers group link</h2>
                <p className="text-base text-slate-500">The WhatsApp group approved volunteers join and type DONE in. In WhatsApp: open the group → tap its name → Invite via link → Copy link. Paste it here. It goes into every welcome message and the volunteer portal.</p>
                <input className={input} placeholder="https://chat.whatsapp.com/..." value={group} onChange={(e) => setGroup(e.target.value)} />
                <button disabled={busy} onClick={() => post({ action: "set_active_group", link: group }, "Group link saved")} className="btn-shimmer w-full py-3 rounded-xl text-white font-medium">Save link</button>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-slate-100 space-y-3 h-fit">
                <h2 className="font-display text-2xl text-forest">HubSpot</h2>
                {data?.hubspotDirect ? (
                  <>
                    <p className="text-base text-slate-500">Connected. New applications and your edits here update HubSpot automatically. If a volunteer shows “CRM not updated”, press the button below.</p>
                    <button disabled={busy} onClick={async () => { const r = await post({ action: "sync_hubspot" }); if (r) setMsg(r.failed ? `Sent ${r.count}. ${r.failed} still failing: open them to check their email.` : `HubSpot is up to date (${r.count} updated).`); }} className="w-full py-3 rounded-xl border border-sage text-leaf font-medium">Send missing details to HubSpot</button>
                  </>
                ) : <p className="text-base text-slate-500">Applications reach HubSpot through the website form. Your edits here stay on this dashboard only. To make edits and phone numbers flow to HubSpot too, follow “Connect HubSpot” in the setup guide.</p>}
              </div>
            </div>
            <div className="space-y-5">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 space-y-3 h-fit">
              <h2 className="font-display text-2xl text-forest">Dashboard logins</h2>
              <p className="text-base text-slate-500">Set or reset the coordinator&apos;s login and the Insights login here, with no need to open Vercel. Change your own password with the <b>Password</b> button at the top.</p>
              {data?.logins.map((l) => (
                <div key={l.role} className="flex items-center justify-between gap-3 text-base bg-mist rounded-xl px-4 py-2.5">
                  <span>{l.role === "coordinator" ? "Coordinator" : "Insights"} <span className="text-sm text-slate-400">· {l.username ? `${l.username} (${l.source === "site" ? "set here" : "from Vercel"})` : "not set"}</span></span>
                </div>
              ))}
              <select className={input} value={newLogin.role} onChange={(e) => setNewLogin({ ...newLogin, role: e.target.value })}><option value="coordinator">Coordinator login</option><option value="insights">Insights login</option></select>
              <input className={input} placeholder="Username" autoCapitalize="none" value={newLogin.username} onChange={(e) => setNewLogin({ ...newLogin, username: e.target.value })} />
              <input className={input} type="text" placeholder="Password (10+ characters)" value={newLogin.password} onChange={(e) => setNewLogin({ ...newLogin, password: e.target.value })} />
              <p className="text-sm text-slate-400">Saving replaces that login straight away. Share the new details privately.</p>
              <button disabled={busy || newLogin.username.trim().length < 3 || newLogin.password.length < 10} onClick={async () => { const r = await post({ action: "set_login", ...newLogin }, "Login saved. Share it privately."); if (r) setNewLogin({ role: newLogin.role, username: "", password: "" }); }} className="btn-shimmer w-full py-3 rounded-xl text-white font-medium disabled:opacity-40">Save login</button>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 space-y-3 h-fit">
              <h2 className="font-display text-2xl text-forest">Helper logins</h2>
              <p className="text-base text-slate-500">Give a trusted person their own login for one area only. They never see this dashboard or your password. <b>Gallery manager</b> uses <code>/gallery-admin</code>. <b>Insights viewer</b> uses <code>/insights</code>.</p>
              {data?.galleryOps.map((g) => (
                <div key={g.id} className="flex items-center justify-between text-base bg-mist rounded-xl px-4 py-2.5">
                  <span>{g.username} <span className="text-sm text-slate-400">· {g.role === "insights" ? "Insights viewer" : "Gallery manager"}</span></span>
                  <button onClick={() => { if (confirm(`Remove ${g.username}'s login?`)) post({ action: "remove_gallery_op", id: g.id }, "Login removed"); }} className="text-sm text-red-600">Remove</button>
                </div>
              ))}
              <select className={input} value={gop.role} onChange={(e) => setGop({ ...gop, role: e.target.value })}><option value="gallery">Gallery manager</option><option value="insights">Insights viewer</option></select>
              <input className={input} placeholder="Username" autoCapitalize="none" value={gop.username} onChange={(e) => setGop({ ...gop, username: e.target.value })} />
              <input className={input} type="text" placeholder="Password (8+ characters)" value={gop.password} onChange={(e) => setGop({ ...gop, password: e.target.value })} />
              <p className="text-sm text-slate-400">Using an existing username resets that person&apos;s password.</p>
              <button disabled={busy || !gop.username || gop.password.length < 8} onClick={async () => { const r = await post({ action: "add_gallery_op", ...gop }, "Login saved. Share it privately."); if (r) setGop({ username: "", password: "", role: "gallery" }); }} className="btn-shimmer w-full py-3 rounded-xl text-white font-medium disabled:opacity-40">Create login</button>
            </div>
            </div>
          </div>
        )}

        {(k?.overdue ?? 0) > 0 && tab !== "tasks" && <button onClick={() => setTab("tasks")} className="mt-6 text-sm text-earth flex items-center gap-2"><AlertTriangle size={14} /> {k?.overdue} assignments are past due. Open Tasks to send reminders.</button>}
      </div>

      {acct && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => !busy && setAcct(null)}>
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl text-forest">Change my password</h2>
              <button onClick={() => setAcct(null)} aria-label="Close"><X size={20} className="text-slate-400" /></button>
            </div>
            <input className={input} type="password" autoComplete="current-password" placeholder="Current password" value={acct.cur} onChange={(e) => setAcct({ ...acct, cur: e.target.value })} />
            <input className={input} type="password" autoComplete="new-password" placeholder="New password (10+ characters)" value={acct.next} onChange={(e) => setAcct({ ...acct, next: e.target.value })} />
            <input className={input} type="password" autoComplete="new-password" placeholder="Type the new password again" value={acct.again} onChange={(e) => setAcct({ ...acct, again: e.target.value })} />
            {aerr && <p className="text-base text-red-600">{aerr}</p>}
            <button disabled={busy || !acct.cur || acct.next.length < 10} onClick={changePw} className="btn-shimmer w-full py-3 rounded-xl text-white font-medium flex items-center justify-center gap-2 disabled:opacity-40">{busy ? <Loader2 size={16} className="animate-spin" /> : "Change password"}</button>
          </div>
        </div>
      )}

      {/* Edit / add volunteer */}
      {edit && (() => {
        const v = edit.id ? data?.volunteers.find((x) => x.id === edit.id) : undefined;
        return (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => !busy && setEdit(null)}>
            <div className="bg-white w-full sm:max-w-lg max-h-[92vh] overflow-auto rounded-t-3xl sm:rounded-3xl p-6 space-y-3" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl text-forest">{edit.id ? "Volunteer details" : "Add a volunteer"}</h2>
                <button onClick={() => setEdit(null)} aria-label="Close"><X size={20} className="text-slate-400" /></button>
              </div>
              {v && <p className="text-sm text-slate-500">{v.status !== "pending" && <>ID <b className="font-mono">{v.code}</b> · </>}Applied {day(v.created_at)}{v.approved_at ? ` · Approved ${day(v.approved_at)}` : ""}</p>}
              {!edit.id && <p className="text-sm text-slate-500">For someone who didn&apos;t use the website form. They&apos;re approved straight away and get an ID.</p>}
              <div><span className={label}>Full name</span><input className={input} value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div><span className={label}>WhatsApp number</span><input className={input} type="tel" placeholder="024 123 4567" value={edit.whatsapp} onChange={(e) => setEdit({ ...edit, whatsapp: e.target.value })} /></div>
                <div><span className={label}>Email</span><input className={input} type="email" value={edit.email} onChange={(e) => setEdit({ ...edit, email: e.target.value })} /></div>
              </div>
              <div><span className={label}>Track</span><select className={input} value={edit.track} onChange={(e) => setEdit({ ...edit, track: e.target.value })}><option value="">Not chosen</option>{TRACKS.map((t) => <option key={t} value={t}>{TRACK_LABELS[t] || t}</option>)}</select></div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div><span className={label}>Hours / month</span><select className={input} value={edit.hours} onChange={(e) => setEdit({ ...edit, hours: e.target.value })}><option value="">Not chosen</option>{HOURS.map((h) => <option key={h}>{h}</option>)}</select></div>
                <div><span className={label}>Engagement mode</span><select className={input} value={edit.mode} onChange={(e) => setEdit({ ...edit, mode: e.target.value })}><option value="">Not chosen</option>{MODES.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}</select></div>
              </div>
              {edit.id && <div><span className={label}>Status</span><select className={input} value={edit.status} onChange={(e) => setEdit({ ...edit, status: e.target.value })}><option value="pending">New applicant (not approved)</option><option value="active">Active</option><option value="inactive">Paused</option></select></div>}
              <div><span className={label}>Private notes (only admins see these)</span><textarea className={input} rows={3} value={edit.notes} onChange={(e) => setEdit({ ...edit, notes: e.target.value })} placeholder="e.g. Prefers weekend tasks. Has a laptop." /></div>
              {v?.hubspot_error && data?.hubspotDirect && <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3">HubSpot didn&apos;t accept the last update: {v.hubspot_error}. Saving again retries it.</p>}
              <div className="flex gap-2 pt-2">
                <button disabled={busy || edit.name.trim().length < 2} onClick={saveEdit} className="btn-shimmer flex-1 py-3 rounded-xl text-white font-medium flex items-center justify-center gap-2 disabled:opacity-40">{busy ? <Loader2 size={16} className="animate-spin" /> : edit.id ? "Save changes" : "Add and create ID"}</button>
                {v && owner && <button disabled={busy} onClick={() => { if (confirm(`Delete ${v.name} permanently? Their tasks, submitted work and certificate are deleted too. To just stop them, set Status to Paused instead.`)) { post({ action: "delete_volunteer", volunteerId: v.id }, "Volunteer deleted"); setEdit(null); } }} className="px-4 rounded-xl border border-red-200 text-red-600" title="Delete"><Trash2 size={16} /></button>}
              </div>
            </div>
          </div>
        );
      })()}
    </main>
  );
}
