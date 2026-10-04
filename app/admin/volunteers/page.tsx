"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { TRACKS, TASK_TEMPLATES } from "../../lib/tracks";
import { Trash2, LogOut, Award, BookOpen, Loader2, Lock, Plus, RefreshCw, Send, ShieldCheck, Copy, Check, AlertTriangle, MessageCircle } from "lucide-react";


type Vol = { cert_token: string | null; id: number; code: string; name: string; email: string | null; whatsapp: string | null; track: string | null; status: string; assigned: number; done: number; confirmed: number; last_login: string | null };
type Q = { id: number; name: string; code: string; title: string; done_at: string; group_confirmed_at: string | null; note: string | null };
type Dash = {
  volunteers: Vol[]; queue: Q[];
  tasks: { id: number; title: string; track: string | null; assigned: number; done: number; due_date: string | null }[];
  kpi: { total: number; done: number; verified: number; overdue: number; missing_group: number; avg_hours: number | null };
  byTrack: { track: string; total: number; done: number }[];
  eligible: { id: number; name: string; email: string | null; whatsapp: string | null; assigned: number; done: number; issued: boolean; token: string | null; kind: string | null }[];
  galleryOps: { id: number; username: string }[];
  activeGroup: string;
};

export default function VolunteerAdmin() {
  const [auth, setAuth] = useState<string | null>(null);
  const [u, setU] = useState(""); const [p, setP] = useState("");
  const [data, setData] = useState<Dash | null>(null);
  const [msg, setMsg] = useState(""); const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState("");
  const [tab, setTab] = useState<"assign" | "queue" | "people" | "certs" | "settings">("assign");
  const [group, setGroup] = useState(""); const [gop, setGop] = useState({ username: "", password: "" });

  const [sel, setSel] = useState<number[]>([]);
  const [task, setTask] = useState({ title: "", details: "", track: "", dueDate: "" });
  const [nv, setNv] = useState({ name: "", email: "", whatsapp: "", track: "" });

  const load = useCallback(async (a: string) => {
    const r = await fetch("/api/admin/volunteers", { headers: { Authorization: a }, cache: "no-store" });
    if (!r.ok) throw new Error(r.status === 401 ? "Invalid credentials" : "Failed to load");
    const d = await r.json(); setData(d); setGroup(d.activeGroup || "");
  }, []);

  useEffect(() => {
    const s = sessionStorage.getItem("gf_admin_auth");
    if (s) load(s).then(() => setAuth(s)).catch(() => sessionStorage.removeItem("gf_admin_auth"));
  }, [load]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault(); setErr("");
    const a = `Bearer ${u}:${p}`;
    try { await load(a); sessionStorage.setItem("gf_admin_auth", a); setAuth(a); } catch (x) { setErr((x as Error).message); }
  };

  const logout = () => { sessionStorage.removeItem("gf_admin_auth"); setAuth(null); setData(null); setU(""); setP(""); };

  const post = async (body: Record<string, unknown>, ok?: string) => {
    if (!auth) return null;
    setBusy(true); setErr(""); setMsg("");
    try {
      const r = await fetch("/api/admin/volunteers", { method: "POST", headers: { "Content-Type": "application/json", Authorization: auth }, body: JSON.stringify(body) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Failed");
      if (ok) setMsg(ok.replace("{n}", String(j.added ?? j.count ?? "")));
      await load(auth);
      return j;
    } catch (x) { setErr((x as Error).message); return null; } finally { setBusy(false); }
  };

  const copy = (v: Vol) => {
    const text = `Hi ${v.name.split(" ")[0]}, welcome to the Active Volunteers group! Your Greenforce volunteer ID is ${v.code}. Open ${location.origin}/volunteer/portal and enter it to see your tasks. New? Start here: ${location.origin}/volunteer/training`;
    navigator.clipboard.writeText(text); setCopied(v.code); setTimeout(() => setCopied(""), 1800);
  };

  const qualifies = (id: number) => !!data?.eligible.some((e) => e.id === id);
  const pending = (data?.volunteers || []).filter((v) => v.status === "pending");
  const active = useMemo(() => (data?.volunteers || []).filter((v) => v.status === "active"), [data]);

  if (!auth) {
    return (
      <main className="min-h-screen pt-32 px-6 flex justify-center bg-mist">
        <form onSubmit={login} className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-xl border border-slate-100 h-fit space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-forest text-lime flex items-center justify-center"><Lock size={20} /></div>
          <h1 className="font-display text-3xl text-forest">Volunteer Admin</h1>
          <input value={u} onChange={(e) => setU(e.target.value)} placeholder="Username" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-sage" />
          <input type="password" value={p} onChange={(e) => setP(e.target.value)} placeholder="Password" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-sage" />
          {err && <p className="text-base text-red-600">{err}</p>}
          <button className="btn-shimmer w-full py-3 rounded-xl text-white font-medium">Sign in</button>
        </form>
      </main>
    );
  }

  const k = data?.kpi;
  const rate = k && k.total ? Math.round((k.done / k.total) * 100) : 0;
  const input = "w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-sage bg-white text-base";

  return (
    <main className="min-h-screen pt-24 pb-20 px-5 bg-mist">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <p className="text-sm tracking-[0.2em] uppercase text-sage flex items-center gap-1"><ShieldCheck size={14} /> Admin</p>
            <h1 className="font-display text-4xl text-forest">Volunteer Operations</h1>
          </div>
          <div className="flex gap-2">
            <Link href="/admin" className="px-5 py-3 rounded-xl bg-white border border-slate-200 text-base flex items-center gap-2 hover:border-sage">Gallery</Link>
            <Link href="/admin/volunteers/training" className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-base flex items-center gap-2 hover:border-sage"><BookOpen size={15} /> Coordinator guide</Link>
            <button onClick={() => load(auth)} className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-sage" aria-label="Refresh"><RefreshCw size={16} /></button>
            <button onClick={logout} className="px-5 py-3 rounded-xl bg-red-50 text-red-600 border border-red-200 text-base font-medium flex items-center gap-2 hover:bg-red-600 hover:text-white"><LogOut size={16} /> Log out</button>
          </div>
        </div>

        {(msg || err) && <div className={`mb-5 rounded-xl px-4 py-3 text-base ${err ? "bg-red-50 text-red-700" : "bg-lime/20 text-forest"}`}>{err || msg}</div>}

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {[
            { l: "Active volunteers", v: active.length },
            { l: "Completion rate", v: `${rate}%` },
            { l: "Avg. hours to complete", v: k?.avg_hours ?? "–" },
            { l: "Overdue", v: k?.overdue ?? 0, warn: (k?.overdue ?? 0) > 0 },
            { l: "Done, not in group", v: k?.missing_group ?? 0, warn: (k?.missing_group ?? 0) > 0 },
          ].map((c) => (
            <div key={c.l} className="bg-white rounded-2xl p-5 border border-slate-100">
              <p className={`font-display text-4xl ${c.warn ? "text-amber" : "text-forest"}`}>{c.v}</p>
              <p className="text-sm text-slate-500 mt-1">{c.l}</p>
            </div>
          ))}
        </div>

        {/* By track */}
        {data && data.byTrack.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-slate-100 mb-6">
            <p className="text-sm tracking-[0.2em] uppercase text-slate-500 mb-4">Completion by track</p>
            <div className="space-y-3">
              {data.byTrack.map((t) => (
                <div key={t.track} className="flex items-center gap-3 text-base">
                  <span className="w-28 text-slate-600">{t.track}</span>
                  <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden"><div className="h-full bg-sage" style={{ width: `${(t.done / t.total) * 100}%` }} /></div>
                  <span className="w-14 text-right text-slate-500">{t.done}/{t.total}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-1 bg-white rounded-xl p-1 border border-slate-100 w-fit mb-5">
          {([["assign", "Assign tasks"], ["queue", `Verify (${data?.queue.length ?? 0})`], ["people", `Volunteers${pending.length ? ` (${pending.length} new)` : ""}`], ["certs", `Certificates${data?.eligible.filter((e) => !e.issued).length ? ` (${data.eligible.filter((e) => !e.issued).length})` : ""}`], ["settings", "Settings"]] as const).map(([id, l]) => (
            <button key={id} onClick={() => setTab(id)} className={`px-4 py-2 rounded-lg text-base ${tab === id ? "bg-forest text-white" : "text-slate-600"}`}>{l}</button>
          ))}
        </div>

        {tab === "assign" && (
          <div className="grid lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 space-y-3">
              <h2 className="font-display text-2xl text-forest">New task</h2>
              <select className={input} value="" onChange={(e) => { const t = TASK_TEMPLATES.find((x) => x.key === e.target.value); if (t) setTask({ ...task, title: t.title, details: t.details, track: t.track }); }}>
                <option value="">⚡ Start from a ready-made task...</option>
                {TASK_TEMPLATES.map((t) => <option key={t.key} value={t.key}>{t.job}</option>)}
              </select>
              <input className={input} placeholder="Task title" value={task.title} onChange={(e) => setTask({ ...task, title: e.target.value })} />
              <textarea className={input} rows={3} placeholder="Details / instructions" value={task.details} onChange={(e) => setTask({ ...task, details: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <select className={input} value={task.track} onChange={(e) => setTask({ ...task, track: e.target.value })}><option value="">Track (optional)</option>{TRACKS.map((t) => <option key={t}>{t}</option>)}</select>
                <input type="date" className={input} value={task.dueDate} onChange={(e) => setTask({ ...task, dueDate: e.target.value })} />
              </div>
              <button disabled={busy || !task.title || !sel.length}
                onClick={async () => { const r = await post({ action: "assign", volunteerIds: sel, ...task }, "Task assigned to {n} volunteers"); if (r) { setTask({ title: "", details: "", track: "", dueDate: "" }); setSel([]); } }}
                className="btn-shimmer w-full py-3 rounded-xl text-white font-medium flex items-center justify-center gap-2 disabled:opacity-40">
                {busy ? <Loader2 size={16} className="animate-spin" /> : <><Send size={16} /> Assign to {sel.length} selected</>}
              </button>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display text-2xl text-forest">Assign to</h2>
                <div className="flex gap-3 text-sm text-leaf">
                  <button onClick={() => setSel(active.map((v) => v.id))}>All</button>
                  {task.track && <button onClick={() => setSel(active.filter((v) => v.track === task.track).map((v) => v.id))}>{task.track} only</button>}
                  <button onClick={() => setSel([])}>None</button>
                </div>
              </div>
              <div className="max-h-96 overflow-auto divide-y divide-slate-100">
                {active.length === 0 && <p className="text-base text-slate-400 py-6 text-center">No approved volunteers yet. Approve new signups in the Volunteers tab.</p>}
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

        {tab === "queue" && (
          <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-100">
            {data?.queue.length === 0 && <p className="p-8 text-center text-base text-slate-400">Nothing waiting for verification.</p>}
            {data?.queue.map((q) => (
              <div key={q.id} className="p-5 flex flex-wrap items-center gap-3">
                <div className="flex-1 min-w-[200px]">
                  <p className="font-medium text-forest">{q.title}</p>
                  <p className="text-sm text-slate-500">{q.name} · {q.code} · {new Date(q.done_at).toLocaleString()}</p>
                  {q.note && <p className="text-sm text-slate-600 mt-1 italic">&ldquo;{q.note}&rdquo;</p>}
                </div>
                <span className={`text-sm px-3 py-1 rounded-full ${q.group_confirmed_at ? "bg-lime/20 text-leaf" : "bg-amber/20 text-earth"}`}>{q.group_confirmed_at ? "Posted DONE in group" : "No DONE in group yet"}</span>
                <button onClick={() => post({ action: "verify", assignmentId: q.id }, "Verified")} className="btn-shimmer px-4 py-2 rounded-lg text-white text-base">Verify</button>
                <button onClick={() => post({ action: "reopen", assignmentId: q.id }, "Sent back to volunteer")} className="px-4 py-2 rounded-lg border border-slate-200 text-base text-slate-600">Reopen</button>
              </div>
            ))}
          </div>
        )}

        {tab === "people" && (
          <div className="grid lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 overflow-x-auto">
              <table className="w-full text-base">
                <thead><tr className="text-left text-sm uppercase tracking-wider text-slate-400 border-b border-slate-100"><th className="p-4">Volunteer</th><th>ID</th><th>Done</th><th>Group</th><th></th></tr></thead>
                <tbody>
                  {[...(data?.volunteers || [])].sort((a, b) => Number(b.status === "pending") - Number(a.status === "pending")).map((v) => (
                    <tr key={v.id} className={`border-b border-slate-50 ${v.status === "inactive" ? "opacity-40" : v.status === "pending" ? "bg-amber/10" : ""}`}>
                      <td className="p-4"><p className="font-medium text-forest">{v.name}</p><p className="text-sm text-slate-400">{v.track || "No track"}{v.last_login ? "" : " · never logged in"}</p></td>
                      <td className="font-mono text-sm">{v.status === "pending" ? <span className="text-earth text-sm font-sans">Awaiting approval</span> : v.code}</td>
                      <td>{v.done}/{v.assigned}</td>
                      <td>{v.confirmed}</td>
                      <td className="text-right pr-4 whitespace-nowrap">
                        {v.status === "pending" ? (
                          <button onClick={async () => { const r = await post({ action: "set_status", volunteerId: v.id, status: "active" }); if (r) { copy(v); setMsg(`${v.name} approved. Their invite message with the ID is copied: paste it to them.`); } }} className="btn-shimmer px-4 py-2 rounded-lg text-white text-base mr-1">Approve</button>
                        ) : (
                          <>
                            <button onClick={() => copy(v)} className="p-2 text-slate-400 hover:text-forest" title="Copy invite message">{copied === v.code ? <Check size={15} /> : <Copy size={15} />}</button>
                            <button onClick={() => post({ action: "set_status", volunteerId: v.id, status: v.status === "active" ? "inactive" : "active" })} className="text-sm text-slate-400 hover:text-forest px-2">{v.status === "active" ? "Pause" : "Activate"}</button>
                          </>
                        )}
                        <button onClick={() => { if (confirm(`Delete ${v.name} permanently? Their tasks and certificate are deleted too.`)) post({ action: "delete_volunteer", volunteerId: v.id }, "Volunteer deleted"); }} className="text-sm text-red-500 hover:text-red-700 px-2" title="Delete volunteer"><Trash2 size={15} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 space-y-3 h-fit">
              <h2 className="font-display text-2xl text-forest">Add volunteer</h2>
              <input className={input} placeholder="Full name" value={nv.name} onChange={(e) => setNv({ ...nv, name: e.target.value })} />
              <input className={input} placeholder="Email" value={nv.email} onChange={(e) => setNv({ ...nv, email: e.target.value })} />
              <input className={input} placeholder="WhatsApp" value={nv.whatsapp} onChange={(e) => setNv({ ...nv, whatsapp: e.target.value })} />
              <select className={input} value={nv.track} onChange={(e) => setNv({ ...nv, track: e.target.value })}><option value="">Track</option>{TRACKS.map((t) => <option key={t}>{t}</option>)}</select>
              <button disabled={busy || !nv.name} onClick={async () => { const r = await post({ action: "add_volunteer", ...nv }); if (r) { setMsg(`Created ID ${r.code}`); setNv({ name: "", email: "", whatsapp: "", track: "" }); } }} className="btn-shimmer w-full py-3 rounded-xl text-white font-medium flex items-center justify-center gap-2 disabled:opacity-40"><Plus size={16} /> Create ID</button>
              {data?.activeGroup && <a href={data.activeGroup} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-sm text-leaf pt-1"><MessageCircle size={14} /> Open Active Volunteers group</a>}
            </div>
          </div>
        )}

        {tab === "certs" && (
          <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-100">
            <div className="p-5 flex flex-wrap items-center gap-3 justify-between">
              <p className="text-lg text-slate-600 max-w-xl">Volunteers who qualify show a green badge. You can give a certificate to anyone with <b>Create certificate</b>. Then send it by email or WhatsApp.</p>
              <a href="/certificate/sample" target="_blank" className="px-5 py-3 rounded-xl border border-sage text-leaf text-lg font-medium">See a sample certificate</a>
            </div>
            {[...(data?.volunteers || [])].filter((v) => v.status === "active").sort((a, b) => Number(!!b.cert_token) - Number(!!a.cert_token) || Number(qualifies(b.id)) - Number(qualifies(a.id))).map((v) => {
              const link = v.cert_token ? `${location.origin}/certificate/${v.cert_token}` : "";
              const body = `Dear ${v.name.split(" ")[0]},\n\nThank you for your faithful service with VTO Greenforce Foundation Africa. Your certificate is ready. Open this link to view it and download the PDF:\n${link}\n\nWith gratitude,\nVTO Greenforce Foundation Africa`;
              return (
                <div key={v.id} className="p-5 flex flex-wrap items-center gap-3">
                  <div className="flex-1 min-w-[180px]">
                    <p className="font-medium text-forest text-xl">{v.name}</p>
                    <p className="text-base text-slate-500">{v.done} of {v.assigned} tasks completed</p>
                  </div>
                  {qualifies(v.id) && <span className="text-base px-3 py-1 rounded-full bg-lime/30 text-leaf">Qualifies</span>}
                  {!v.cert_token ? (
                    <button onClick={() => post({ action: "issue_certificate", volunteerId: v.id }, "Certificate created. Use the buttons to send it.")} className="btn-shimmer px-5 py-3 rounded-xl text-white text-lg flex items-center gap-2"><Award size={16} /> Create certificate</button>
                  ) : (
                    <>
                      <a href={link} target="_blank" className="px-5 py-3 rounded-xl border border-slate-200 text-lg">View</a>
                      <a href={`${link}/pdf`} className="px-5 py-3 rounded-xl border border-slate-200 text-lg">PDF</a>
                      {v.email && <a href={`mailto:${v.email}?subject=${encodeURIComponent("Your Greenforce Certificate")}&body=${encodeURIComponent(body)}`} className="px-5 py-3 rounded-xl bg-forest text-white text-lg">Email it</a>}
                      {v.whatsapp && <a href={`https://wa.me/${v.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(body)}`} target="_blank" className="px-5 py-3 rounded-xl bg-[#25D366] text-white text-lg">WhatsApp</a>}
                    </>
                  )}
                </div>
              );
            })}
            {(data?.volunteers.length ?? 0) === 0 && <p className="p-8 text-center text-lg text-slate-400">No volunteers yet.</p>}
          </div>
        )}

        {tab === "settings" && (
          <div className="grid lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 space-y-3 h-fit">
              <h2 className="font-display text-2xl text-forest">Active Volunteers group</h2>
              <p className="text-base text-slate-500">Paste the invite link of the group where volunteers type DONE. It powers the buttons in the portal and training.</p>
              <input className={input} placeholder="https://chat.whatsapp.com/..." value={group} onChange={(e) => setGroup(e.target.value)} />
              <button disabled={busy} onClick={() => post({ action: "set_active_group", link: group }, "Group link saved")} className="btn-shimmer w-full py-3 rounded-xl text-white font-medium">Save link</button>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 space-y-3">
              <h2 className="font-display text-2xl text-forest">Gallery-only logins</h2>
              <p className="text-base text-slate-500">Give a trusted volunteer their own login for the gallery page (<code>/admin</code>). It can upload and edit images only, and never reveals your admin password.</p>
              {data?.galleryOps.map((g) => (
                <div key={g.id} className="flex items-center justify-between text-base bg-mist rounded-xl px-4 py-2.5">
                  <span>{g.username}</span>
                  <button onClick={() => post({ action: "remove_gallery_op", id: g.id }, "Login removed")} className="text-sm text-red-600">Remove</button>
                </div>
              ))}
              <input className={input} placeholder="New username" value={gop.username} onChange={(e) => setGop({ ...gop, username: e.target.value })} />
              <input className={input} type="text" placeholder="New password (8+ characters)" value={gop.password} onChange={(e) => setGop({ ...gop, password: e.target.value })} />
              <button disabled={busy || !gop.username || !gop.password} onClick={async () => { const r = await post({ action: "add_gallery_op", ...gop }, "Gallery login saved. Share it privately."); if (r) setGop({ username: "", password: "" }); }} className="btn-shimmer w-full py-3 rounded-xl text-white font-medium disabled:opacity-40">Create gallery login</button>
            </div>
          </div>
        )}

        {(k?.overdue ?? 0) > 0 && <p className="mt-6 text-sm text-earth flex items-center gap-2"><AlertTriangle size={14} /> {k?.overdue} assignments are past due. Nudge them in the group.</p>}
      </div>
    </main>
  );
}
