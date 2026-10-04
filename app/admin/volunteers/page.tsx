"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Lock, Plus, RefreshCw, Send, ShieldCheck, Copy, Check, AlertTriangle, MessageCircle, Download } from "lucide-react";

const TRACKS = ["Greenhouse", "Training", "Education", "Community", "Harvest", "Media"];
const WA_GROUP = "https://chat.whatsapp.com/Fit8eH747BLAna15s6RE92?s=cl&p=a&ilr=0";

type Vol = { id: number; code: string; name: string; email: string | null; whatsapp: string | null; track: string | null; status: string; assigned: number; done: number; confirmed: number; last_login: string | null };
type Q = { id: number; name: string; code: string; title: string; done_at: string; group_confirmed_at: string | null; note: string | null };
type Dash = {
  volunteers: Vol[]; queue: Q[];
  tasks: { id: number; title: string; track: string | null; assigned: number; done: number; due_date: string | null }[];
  kpi: { total: number; done: number; verified: number; overdue: number; missing_group: number; avg_hours: number | null };
  byTrack: { track: string; total: number; done: number }[];
};

export default function VolunteerAdmin() {
  const [auth, setAuth] = useState<string | null>(null);
  const [u, setU] = useState(""); const [p, setP] = useState("");
  const [data, setData] = useState<Dash | null>(null);
  const [msg, setMsg] = useState(""); const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState("");
  const [tab, setTab] = useState<"assign" | "queue" | "people">("assign");

  const [sel, setSel] = useState<number[]>([]);
  const [task, setTask] = useState({ title: "", details: "", track: "", dueDate: "" });
  const [nv, setNv] = useState({ name: "", email: "", whatsapp: "", track: "" });

  const load = useCallback(async (a: string) => {
    const r = await fetch("/api/admin/volunteers", { headers: { Authorization: a }, cache: "no-store" });
    if (!r.ok) throw new Error(r.status === 401 ? "Invalid credentials" : "Failed to load");
    setData(await r.json());
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
    const text = `Hi ${v.name.split(" ")[0]}! Your Greenforce volunteer ID is ${v.code}. Open ${location.origin}/volunteer/portal and enter it to see your tasks. New? Start here: ${location.origin}/volunteer/training`;
    navigator.clipboard.writeText(text); setCopied(v.code); setTimeout(() => setCopied(""), 1800);
  };

  const active = useMemo(() => (data?.volunteers || []).filter((v) => v.status === "active"), [data]);

  if (!auth) {
    return (
      <main className="min-h-screen pt-32 px-6 flex justify-center bg-mist">
        <form onSubmit={login} className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-xl border border-slate-100 h-fit space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-forest text-lime flex items-center justify-center"><Lock size={20} /></div>
          <h1 className="font-display text-3xl text-forest">Volunteer Admin</h1>
          <input value={u} onChange={(e) => setU(e.target.value)} placeholder="Username" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-sage" />
          <input type="password" value={p} onChange={(e) => setP(e.target.value)} placeholder="Password" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-sage" />
          {err && <p className="text-sm text-red-600">{err}</p>}
          <button className="btn-shimmer w-full py-3 rounded-xl text-white font-medium">Sign in</button>
        </form>
      </main>
    );
  }

  const k = data?.kpi;
  const rate = k && k.total ? Math.round((k.done / k.total) * 100) : 0;
  const input = "w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-sage bg-white text-sm";

  return (
    <main className="min-h-screen pt-24 pb-20 px-5 bg-mist">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-sage flex items-center gap-1"><ShieldCheck size={14} /> Admin</p>
            <h1 className="font-display text-4xl text-forest">Volunteer Operations</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={() => post({ action: "sync_hubspot" }, "Imported {n} new volunteers from HubSpot")} disabled={busy} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm flex items-center gap-2 hover:border-sage"><Download size={15} /> Sync HubSpot</button>
            <button onClick={() => load(auth)} className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-sage" aria-label="Refresh"><RefreshCw size={16} /></button>
          </div>
        </div>

        {(msg || err) && <div className={`mb-5 rounded-xl px-4 py-3 text-sm ${err ? "bg-red-50 text-red-700" : "bg-lime/20 text-forest"}`}>{err || msg}</div>}

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
              <p className="text-xs text-slate-500 mt-1">{c.l}</p>
            </div>
          ))}
        </div>

        {/* By track */}
        {data && data.byTrack.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-slate-100 mb-6">
            <p className="text-xs tracking-[0.2em] uppercase text-slate-500 mb-4">Completion by track</p>
            <div className="space-y-3">
              {data.byTrack.map((t) => (
                <div key={t.track} className="flex items-center gap-3 text-sm">
                  <span className="w-28 text-slate-600">{t.track}</span>
                  <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden"><div className="h-full bg-sage" style={{ width: `${(t.done / t.total) * 100}%` }} /></div>
                  <span className="w-14 text-right text-slate-500">{t.done}/{t.total}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-1 bg-white rounded-xl p-1 border border-slate-100 w-fit mb-5">
          {([["assign", "Assign tasks"], ["queue", `Verify (${data?.queue.length ?? 0})`], ["people", "Volunteers"]] as const).map(([id, l]) => (
            <button key={id} onClick={() => setTab(id)} className={`px-4 py-2 rounded-lg text-sm ${tab === id ? "bg-forest text-white" : "text-slate-600"}`}>{l}</button>
          ))}
        </div>

        {tab === "assign" && (
          <div className="grid lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 space-y-3">
              <h2 className="font-display text-2xl text-forest">New task</h2>
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
                <div className="flex gap-3 text-xs text-leaf">
                  <button onClick={() => setSel(active.map((v) => v.id))}>All</button>
                  {task.track && <button onClick={() => setSel(active.filter((v) => v.track === task.track).map((v) => v.id))}>{task.track} only</button>}
                  <button onClick={() => setSel([])}>None</button>
                </div>
              </div>
              <div className="max-h-96 overflow-auto divide-y divide-slate-100">
                {active.length === 0 && <p className="text-sm text-slate-400 py-6 text-center">No volunteers yet. Add one or sync from HubSpot.</p>}
                {active.map((v) => (
                  <label key={v.id} className="flex items-center gap-3 py-2.5 cursor-pointer">
                    <input type="checkbox" className="accent-[#2d6a35] w-4 h-4" checked={sel.includes(v.id)} onChange={() => setSel(sel.includes(v.id) ? sel.filter((i) => i !== v.id) : [...sel, v.id])} />
                    <span className="flex-1 text-sm text-forest">{v.name}</span>
                    <span className="text-xs text-slate-400">{v.track || "–"}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "queue" && (
          <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-100">
            {data?.queue.length === 0 && <p className="p-8 text-center text-sm text-slate-400">Nothing waiting for verification.</p>}
            {data?.queue.map((q) => (
              <div key={q.id} className="p-5 flex flex-wrap items-center gap-3">
                <div className="flex-1 min-w-[200px]">
                  <p className="font-medium text-forest">{q.title}</p>
                  <p className="text-xs text-slate-500">{q.name} · {q.code} · {new Date(q.done_at).toLocaleString()}</p>
                  {q.note && <p className="text-xs text-slate-600 mt-1 italic">&ldquo;{q.note}&rdquo;</p>}
                </div>
                <span className={`text-xs px-3 py-1 rounded-full ${q.group_confirmed_at ? "bg-lime/20 text-leaf" : "bg-amber/20 text-earth"}`}>{q.group_confirmed_at ? "Posted DONE in group" : "No DONE in group yet"}</span>
                <button onClick={() => post({ action: "verify", assignmentId: q.id }, "Verified")} className="btn-shimmer px-4 py-2 rounded-lg text-white text-sm">Verify</button>
                <button onClick={() => post({ action: "reopen", assignmentId: q.id }, "Sent back to volunteer")} className="px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-600">Reopen</button>
              </div>
            ))}
          </div>
        )}

        {tab === "people" && (
          <div className="grid lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-xs uppercase tracking-wider text-slate-400 border-b border-slate-100"><th className="p-4">Volunteer</th><th>ID</th><th>Done</th><th>Group</th><th></th></tr></thead>
                <tbody>
                  {data?.volunteers.map((v) => (
                    <tr key={v.id} className={`border-b border-slate-50 ${v.status !== "active" ? "opacity-40" : ""}`}>
                      <td className="p-4"><p className="font-medium text-forest">{v.name}</p><p className="text-xs text-slate-400">{v.track || "No track"}{v.last_login ? "" : " · never logged in"}</p></td>
                      <td className="font-mono text-xs">{v.code}</td>
                      <td>{v.done}/{v.assigned}</td>
                      <td>{v.confirmed}</td>
                      <td className="text-right pr-4 whitespace-nowrap">
                        <button onClick={() => copy(v)} className="p-2 text-slate-400 hover:text-forest" title="Copy invite message">{copied === v.code ? <Check size={15} /> : <Copy size={15} />}</button>
                        <button onClick={() => post({ action: "set_status", volunteerId: v.id, status: v.status === "active" ? "inactive" : "active" })} className="text-xs text-slate-400 hover:text-forest px-2">{v.status === "active" ? "Pause" : "Activate"}</button>
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
              <a href={WA_GROUP} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-xs text-leaf pt-1"><MessageCircle size={14} /> Open Active Volunteers group</a>
            </div>
          </div>
        )}

        {(k?.overdue ?? 0) > 0 && <p className="mt-6 text-xs text-earth flex items-center gap-2"><AlertTriangle size={14} /> {k?.overdue} assignments are past due. Nudge them in the group.</p>}
      </div>
    </main>
  );
}
