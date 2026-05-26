"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus, Loader2, ShieldCheck, Lock, User } from "lucide-react";

const CATEGORIES = ["Greenhouse", "Training", "Education", "Community", "Harvest"];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [images, setImages] = useState<any[]>([]);
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("Training");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const sessionAuth = sessionStorage.getItem("admin_session_auth");
      if (sessionAuth) {
        setIsAuthenticated(true);
      }
    }
    refreshImages();
  }, []);

  const refreshImages = () => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setImages(data);
      })
      .catch((err) => console.error("Fetch error:", err));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput || !passwordInput) return alert("Please fill in both fields.");
    
    // Combine username and password with a colon separator
    const combinedToken = `${usernameInput}:${passwordInput}`;
    
    // Store temporarily in session memory
    sessionStorage.setItem("admin_session_auth", combinedToken);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_session_auth");
    setIsAuthenticated(false);
    setUsernameInput("");
    setPasswordInput("");
  };

  // SCREEN 1: DOUBLE-INPUT SECURE GATEWAY
  if (!isAuthenticated) {
    return (
      <main className="max-w-md mx-auto pt-36 pb-16 px-6 font-sans">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xl space-y-4">
          <div className="text-center mb-4">
            <div className="inline-flex p-4 bg-emerald-50 text-emerald-600 rounded-full mb-2">
              <Lock size={28} />
            </div>
            <h1 className="text-xl font-bold text-slate-800">Gateway Access Protocol</h1>
            <p className="text-xs text-slate-400">Enter administration credentials to initialize workspace.</p>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Username</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <User size={16} />
                </span>
                <input 
                  type="text" 
                  placeholder="admin_username" 
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full border rounded-xl p-3 pl-10 text-sm focus:outline-emerald-600 bg-slate-50 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock size={16} />
                </span>
                <input 
                  type="password" 
                  placeholder="••••••••••••" 
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full border rounded-xl p-3 pl-10 text-sm focus:outline-emerald-600 bg-slate-50 font-mono tracking-widest"
                />
              </div>
            </div>
          </div>
          
          <button type="submit" className="w-full text-sm bg-slate-900 hover:bg-slate-800 text-white font-medium p-3 rounded-xl transition mt-2">
            Authenticate Session
          </button>
        </form>
      </main>
    );
  }

  // SCREEN 2: AUTHENTICATED MANAGEMENT WORKSPACE
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !caption) return alert("Missing upload fields.");

    setIsSubmitting(true);
    const activeToken = sessionStorage.getItem("admin_session_auth") || "";

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("caption", caption);
      formData.append("category", category);

      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Authorization": `Bearer ${activeToken}` }, 
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setCaption("");
        setFile(null);
        const fileInput = document.getElementById("fileInput") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
        refreshImages();
        setApiError(null);
      } else {
        setApiError(data.error || "Upload rejected by security parameters.");
      }
    } catch (err) {
      setApiError("Network transmission exception.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number, src: string) => {
    if (!confirm("Execute destructive delete?")) return;
    const activeToken = sessionStorage.getItem("admin_session_auth") || "";

    try {
      const res = await fetch("/api/gallery", {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${activeToken}`
        },
        body: JSON.stringify({ id, src }),
      });
      if (res.ok) refreshImages();
    } catch (err) {
      alert("Action denied.");
    }
  };

  return (
    <main className="max-w-4xl mx-auto pt-32 pb-16 px-6 font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            Secure Control Panel <ShieldCheck className="text-emerald-600" size={24} />
          </h1>
        </div>
        <button onClick={handleLogout} className="text-xs font-semibold text-slate-500 hover:text-red-600 bg-slate-50 px-3 py-1.5 rounded-lg transition border border-slate-100">
          Terminate Session
        </button>
      </div>

      {apiError && (
        <div className="p-4 mb-6 text-sm text-red-800 bg-red-50 rounded-xl border border-red-100">
          <strong>Security Notice:</strong> {apiError}
        </div>
      )}

      {/* UPLOAD FORM */}
      <form onSubmit={handleUpload} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mb-12 space-y-4">
        <h2 className="text-lg font-semibold text-slate-700">Add New Secure Asset</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">IMAGE FILE</label>
            <input id="fileInput" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">CATEGORY</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full text-sm border rounded-lg p-2 bg-slate-50">
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">CAPTION / DESCRIPTION</label>
          <input type="text" value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Type description..." className="w-full text-sm border rounded-lg p-2.5 focus:outline-emerald-600" />
        </div>
        <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-5 py-2.5 rounded-xl transition disabled:opacity-50">
          {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
          {isSubmitting ? "Processing..." : "Publish Authenticated Asset"}
        </button>
      </form>

      {/* MANAGER LISTING */}
      <h2 className="text-xl font-bold text-slate-700 mb-4">Current Live Images ({images.length})</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {images.map((img) => (
          <div key={img.id} className="flex gap-4 items-center p-3 bg-white border border-slate-100 rounded-xl">
            <img src={img.src} alt="" className="w-16 h-16 object-cover rounded-lg bg-slate-100 shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">{img.category}</span>
              <p className="text-sm text-slate-700 truncate font-medium">{img.caption}</p>
            </div>
            <button onClick={() => handleDelete(img.id, img.src)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition shrink-0">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
