"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus, Loader2, ShieldCheck, Lock, User, LogOut } from "lucide-react";

const CATEGORIES = ["Greenhouse", "Training", "Education", "Community", "Harvest"];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  
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
        if (sessionAuth.includes(":")) {
          setIsAuthenticated(true);
        }
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
    if (!usernameInput || !passwordInput) {
      setLoginError("Please enter both your username and password.");
      return;
    }
    
    // FRONTEND GUARDRAIL: Matches the credentials you set in Vercel
    const EXPECTED_USER = "greenforce_admin";
    const EXPECTED_PASS = "Apam_Greenhouse_2026";

    if (usernameInput !== EXPECTED_USER || passwordInput !== EXPECTED_PASS) {
      setLoginError("Wrong username or password. Access Denied.");
      return;
    }
    
    const combinedToken = `${usernameInput}:${passwordInput}`;
    sessionStorage.setItem("admin_session_auth", combinedToken);
    setIsAuthenticated(true);
    setLoginError(null);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_session_auth");
    setIsAuthenticated(false);
    setUsernameInput("");
    setPasswordInput("");
  };

  // SCREEN 1: BRANDED LOGIN PORTAL
  if (!isAuthenticated) {
    return (
      <main className="max-w-md mx-auto pt-36 pb-16 px-6 font-sans">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xl space-y-5">
          
          <div className="text-center mb-6">
            <img 
              src="/logo.jpg" 
              alt="Organization Logo" 
              className="mx-auto h-16 w-auto object-contain rounded-xl mb-3"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Admin Login</h1>
            <p className="text-xs text-slate-500 mt-1">Log in to add or remove gallery photos</p>
          </div>
          
          {loginError && (
            <div className="p-3 text-xs font-semibold text-red-600 bg-red-50 rounded-xl border border-red-100 text-center">
              {loginError}
            </div>
          )}
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">Username</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <User size={15} />
                </span>
                <input 
                  type="text" 
                  placeholder="Enter your username" 
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 bg-slate-50/50 text-slate-800 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Lock size={15} />
                </span>
                <input 
                  type="password" 
                  placeholder="Enter your password" 
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 bg-slate-50/50 text-slate-800 transition tracking-widest"
                />
              </div>
            </div>
          </div>
          
          <button type="submit" className="w-full text-sm bg-emerald-700 hover:bg-emerald-800 text-white font-semibold p-3 rounded-xl transition shadow-sm mt-2">
            Log In
          </button>
        </form>
      </main>
    );
  }

  // SCREEN 2: AUTHENTICATED MANAGEMENT WORKSPACE
  return (
    <main className="max-w-4xl mx-auto pt-32 pb-16 px-6 font-sans">
      <div className="flex justify-between items-center mb-8 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <img src="/logo.jpg" alt="" className="h-12 w-auto object-contain rounded-lg" />
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
            Website Photo Manager <ShieldCheck className="text-emerald-600" size={20} />
          </h1>
        </div>
        
        {/* CLEAR, BIG, VISIBLE RED LOGOUT BUTTON */}
        <button 
          onClick={handleLogout} 
          className="text-sm font-bold text-red-600 hover:text-white bg-red-50 hover:bg-red-600 px-5 py-2.5 rounded-xl transition border border-red-200 flex items-center gap-2 shadow-sm"
        >
          <LogOut size={16} /> Log Out
        </button>
      </div>

      {apiError && (
        <div className="p-4 mb-6 text-sm text-red-800 bg-red-50 rounded-xl border border-red-100">
          <strong>Error:</strong> {apiError}
        </div>
      )}

      {/* UPLOAD FORM */}
      <form onSubmit={handleUpload} className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm mb-12 space-y-4">
        <h2 className="text-base font-bold text-slate-800">Upload a New Photo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">CHOOSE IMAGE FILE</label>
            <input id="fileInput" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">SELECT CATEGORY</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full text-sm border border-slate-200 rounded-xl p-2.5 bg-slate-50 text-slate-700 focus:outline-none focus:border-emerald-600">
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">PHOTO CAPTION / DESCRIPTION</label>
          <input type="text" value={caption} onChange={(e) => setText(e.target.value)} placeholder="Write a short description of what is happening in this photo..." className="w-full text-sm border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-emerald-600 text-slate-800" />
        </div>
        <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 text-sm bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-5 py-2.5 rounded-xl transition shadow-sm disabled:opacity-50">
          {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
          {isSubmitting ? "Uploading..." : "Publish Photo to Website"}
        </button>
      </form>

      {/* MANAGER LISTING */}
      <h2 className="text-lg font-bold text-slate-800 mb-4">Live Website Photos ({images.length})</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {images.map((img) => (
          <div key={img.id} className="flex gap-4 items-center p-3 bg-white border border-slate-200/60 rounded-2xl shadow-sm">
            <img src={img.src} alt="" className="w-16 h-16 object-cover rounded-xl bg-slate-100 shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-[9px] uppercase font-bold text-emerald-700 tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md">{img.category}</span>
              <p className="text-sm text-slate-700 truncate font-semibold mt-1">{img.caption}</p>
            </div>
            <button onClick={() => handleDelete(img.id, img.src)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition shrink-0 flex items-center gap-1 text-xs font-medium">
              <Trash2 size={16} /> Delete
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
