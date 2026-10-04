"use client";

import { useEffect, useState } from "react";
import { Loader2, Lock, LogOut, RefreshCw } from "lucide-react";

type Traffic = { totals: { kind: string; d7: number; d30: number }[]; pages: { path: string; n: number }[]; daily: { day: string; n: number }[] };

const CARDS = [
  ["Visits", "pageview"], ["Donate button clicks", "donate_click"], ["GiveSendGo clicks", "givesendgo_click"],
  ["Support applications", "apply_submit"], ["Volunteer signups", "volunteer_submit"], ["Contact messages", "contact_submit"], ["WhatsApp clicks", "whatsapp_click"],
] as const;

export default function InsightsPage() {
  const [auth, setAuth] = useState<string | null>(null);
  const [u, setU] = useState(""); const [p, setP] = useState("");
  const [err, setErr] = useState("");
  const [data, setData] = useState<Traffic | null>(null);
  const [busy, setBusy] = useState(false);

  const load = async (a: string) => {
    const r = await fetch("/api/admin/traffic", { headers: { Authorization: a }, cache: "no-store" });
    if (!r.ok) throw new Error(r.status === 401 ? "Invalid username or password" : "Could not load the numbers");
    setData(await r.json());
  };

  useEffect(() => {
    try {
      const s = sessionStorage.getItem("gf_insights_auth");
      if (s) load(s).then(() => setAuth(s)).catch(() => sessionStorage.removeItem("gf_insights_auth"));
    } catch {}
  }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(""); setBusy(true);
    const a = `Bearer ${u}:${p}`;
    try { await load(a); try { sessionStorage.setItem("gf_insights_auth", a); } catch {} setAuth(a); } catch (x) { setErr((x as Error).message); }
    setBusy(false);
  };

  const logout = () => { try { sessionStorage.removeItem("gf_insights_auth"); } catch {} setAuth(null); setData(null); setU(""); setP(""); };

  if (!auth) {
    return (
      <main className="min-h-screen pt-32 px-6 flex justify-center bg-mist">
        <form onSubmit={login} className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-xl border border-slate-100 h-fit space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-forest text-lime flex items-center justify-center"><Lock size={20} /></div>
          <h1 className="font-display text-3xl text-forest">Site Insights</h1>
          <input value={u} onChange={(e) => setU(e.target.value)} placeholder="Username" autoCapitalize="none" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-sage text-base" />
          <input type="password" value={p} onChange={(e) => setP(e.target.value)} placeholder="Password" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-sage text-base" />
          {err && <p className="text-base text-red-600">{err}</p>}
          <button disabled={busy} className="btn-shimmer w-full py-3 rounded-xl text-white text-lg font-medium flex items-center justify-center gap-2">{busy ? <Loader2 size={18} className="animate-spin" /> : "Sign in"}</button>
        </form>
      </main>
    );
  }

  const get = (k: string) => data?.totals.find((t) => t.kind === k) || { d7: 0, d30: 0 };
  const max = Math.max(1, ...(data?.daily.map((d) => d.n) || [1]));

  return (
    <main className="min-h-screen pt-24 pb-20 px-5 bg-mist">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm tracking-[0.2em] uppercase text-sage">Insights</p>
            <h1 className="font-display text-4xl text-forest">How the website is doing</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={() => load(auth)} className="p-3 rounded-xl bg-white border border-slate-200 hover:border-sage" aria-label="Refresh"><RefreshCw size={18} /></button>
            <button onClick={logout} className="px-5 py-3 rounded-xl bg-red-50 text-red-600 border border-red-200 text-base font-medium flex items-center gap-2 hover:bg-red-600 hover:text-white"><LogOut size={16} /> Log out</button>
          </div>
        </div>
        <p className="text-base text-slate-500">Public pages only. No cookies and no personal data. Form numbers count submit attempts. Counting began when this page was first released.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CARDS.map(([label, kind]) => (
            <div key={kind} className="bg-white rounded-2xl p-5 border border-slate-100">
              <p className="font-display text-4xl text-forest">{get(kind).d7}</p>
              <p className="text-base text-slate-600">{label}</p>
              <p className="text-sm text-slate-400">last 7 days · {get(kind).d30} in 30</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl p-6 border border-slate-100">
            <h2 className="font-display text-2xl text-forest mb-4">Visits, last 14 days</h2>
            {(data?.daily.length || 0) === 0 && <p className="text-base text-slate-400">No visits recorded yet.</p>}
            <div className="flex items-end gap-1.5 h-32">
              {data?.daily.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center justify-end h-full" title={`${d.day}: ${d.n}`}>
                  <div className="w-full bg-sage rounded-t" style={{ height: `${Math.max(4, (d.n / max) * 100)}%` }} />
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-100">
            <h2 className="font-display text-2xl text-forest mb-4">Top pages, 30 days</h2>
            {(data?.pages.length || 0) === 0 && <p className="text-base text-slate-400">Nothing yet.</p>}
            <ul className="divide-y divide-slate-100">
              {data?.pages.map((pg) => <li key={pg.path} className="flex justify-between py-2 text-base"><span className="font-mono text-sm">{pg.path}</span><span>{pg.n}</span></li>)}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
