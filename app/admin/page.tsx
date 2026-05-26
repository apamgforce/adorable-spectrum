"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus, Loader2, ShieldCheck, Lock, User, LogOut, Edit2, Check, X } from "lucide-react";

const CATEGORIES = ["Greenhouse", "Training", "Education", "Community", "Harvest"];

export default function AdminPage() {
  // State 1: Active workspace toggles and credentials holding state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  
  // State 2: Gallery and Upload Asset Trackers
  const [images, setImages] = useState<any[]>([]);
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("Training");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // State 3: Inline Text Editing Trackers
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editCaption, setEditCaption] = useState("");
  const [editCategory, setEditCategory] = useState("");

  useEffect(() => {
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

  // Helper to build the stateless dynamic header string using active input memory
  const getAuthHeader = () => {
    return `Bearer ${username}:${password}`;
  };

  const handleLoginGate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setLoginError("Please enter both your username and password.");
      return;
    }
    // Access the dashboard UI locally. Real authorization happens live on click.
    setIsAuthenticated(true);
    setLoginError(null);
    setApiError(null);
  };

  const handleLogout = () => {
    // Clear credentials instantly from volatile RAM memory
    setUsername("");
    setPassword("");
    setIsAuthenticated(false);
    setEditingId(null);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !caption) return alert("Please select a file and type a caption.");

    setIsSubmitting(true);
    setApiError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("caption", caption);
      formData.append("category", category);

      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Authorization": getAuthHeader() }, // Sent live on-demand
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setCaption("");
        setFile(null);
        const fileInput = document.getElementById("fileInput") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
        refreshImages();
      } else {
        if (res.status === 401) {
          setIsAuthenticated(false);
          setLoginError("Your login details expired or are incorrect.");
        } else {
          setApiError(data.error || "Upload failed.");
        }
      }
    } catch {
      setApiError("Network connection error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEditing = (img: any) => {
    setEditingId(img.id);
    setEditCaption(img.caption);
    setEditCategory(img.category);
  };

  const handleUpdateSave = async (id: number) => {
    setApiError(null);
    try {
      const res = await fetch("/api/gallery", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": getAuthHeader() // Sent live on-demand
        },
        body: JSON.stringify({ id, caption: editCaption, category: editCategory }),
      });

      const data = await res.json();

      if (res.ok) {
        setEditingId(null);
        refreshImages();
      } else {
        if (res.status === 401) {
          setIsAuthenticated(false);
          setLoginError("Session disconnected: Invalid credentials.");
        } else {
          alert(data.error || "Failed to update text.");
        }
      }
    } catch {
      alert("Error saving modification.");
    }
  };

  const handleDelete = async (id: number, src: string) => {
    if (!confirm("Are you sure you want to delete this photo permanently?")) return;
    setApiError(null);

    try {
      const res = await fetch("/api/gallery", {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": getAuthHeader() // Sent live on-demand
        },
        body: JSON.stringify({ id, src }),
      });

      const data = await res.json();

      if (res.ok) {
        refreshImages();
      } else {
        if (res.status === 401) {
          setIsAuthenticated(false);
          setLoginError("Session disconnected: Invalid credentials.");
        } else {
          alert(data.error || "Delete action failed.");
        }
      }
    } catch {
      alert("Error deleting record.");
    }
  };

  // SCREEN 1: LOGIN ENTRY GATE (Inputs stored only in transient memory)
  if (!isAuthenticated) {
    return (
      <main className="max-w-md mx-auto pt-36 pb-16 px-6 font-sans">
        <form onSubmit={handleLoginGate} className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xl space-y-5">
          <div className="text-center mb-6">
            <img src="/logo.jpg" alt="Logo" className="mx-auto h-16 w-auto object-contain rounded-xl mb-3" onError={(e)=>{e.currentTarget.style.display="none"}} />
            <h1 className="text-xl font-bold text-slate-900">Admin Login</h1>
            <p className="text-xs text-slate-500 mt-1">Log in to manage gallery photos</p>
          </div>
          
          {loginError && <div className="p-3 text-xs font-semibold text-red-600 bg-red-50 rounded-xl border border-red-100 text-center">{loginError}</div>}
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">Username</label>
              <input type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-slate-50/50 text-slate-800 focus:outline-none focus:border-emerald-600" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">Password</label>
              <input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-slate-50/50 text-slate-800 focus:outline-none focus:border-emerald-600" />
            </div>
          </div>
          <button type="submit" className="w-full text-sm bg-emerald-700 hover:bg-emerald-800 text-white font-semibold p-3 rounded-xl transition shadow-sm">
            Log In
          </button>
        </form>
      </main>
    );
  }

  // SCREEN 2: WORKSPACE (Live edit features included)
  return (
    <main className="max-w-4xl mx-auto pt-32 pb-16 px-6 font-sans">
      <div className="flex justify-between items-center mb-8 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <img src="/logo.jpg" alt="" className="h-12 w-auto object-contain rounded-lg" onError={(e)=>{e.currentTarget.style.display="none"}} />
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">Website Photo Manager <ShieldCheck className="text-emerald-600" size={20} /></h1>
        </div>
        <button onClick={handleLogout} className="text-sm font-bold text-red-600 hover:text-white bg-red-50 hover:bg-red-600 px-5 py-2.5 rounded-xl transition border border-red-200 flex items-center gap-2 shadow-sm"><LogOut size={16} /> Log Out</button>
      </div>

      {apiError && <div className="p-4 mb-6 text-sm text-red-800 bg-red-50 rounded-xl border border-red-100"><strong>Error:</strong> {apiError}</div>}

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
          <input type="text" value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Write a short description..." className="w-full text-sm border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-emerald-600 text-slate-800" />
        </div>
        <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 text-sm bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-5 py-2.5 rounded-xl transition shadow-sm disabled:opacity-50">
          {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
          {isSubmitting ? "Uploading..." : "Publish Photo to Website"}
        </button>
      </form>

      <h2 className="text-lg font-bold text-slate-800 mb-4">Live Website Photos ({images.length})</h2>
      <div className="grid grid-cols-1 gap-4">
        {images.map((img) => (
          <div key={img.id} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 bg-white border border-slate-200/60 rounded-2xl shadow-sm">
            <img src={img.src} alt="" className="w-20 h-20 object-cover rounded-xl bg-slate-100 shrink-0" />
            
            <div className="flex-1 min-w-0 w-full space-y-2">
              {editingId === img.id ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
                  <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)} className="text-xs border rounded-lg p-2 bg-slate-50 font-semibold text-slate-700">
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                  <input type="text" value={editCaption} onChange={(e) => setEditCaption(e.target.value)} className="text-sm border rounded-lg p-2 sm:col-span-2 text-slate-800 focus:outline-emerald-600 font-medium" />
                </div>
              ) : (
                <>
                  <span className="text-[9px] uppercase font-bold text-emerald-700 tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md inline-block">{img.category}</span>
                  <p className="text-sm text-slate-700 font-semibold">{img.caption}</p>
                </>
              )}
            </div>

            <div className="flex gap-2 shrink-0 w-full sm:w-auto justify-end border-t sm:border-0 pt-2 sm:pt-0">
              {editingId === img.id ? (
                <>
                  <button onClick={() => handleUpdateSave(img.id)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition flex items-center gap-1 text-xs font-bold"><Check size={16} /> Save</button>
                  <button onClick={() => setEditingId(null)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition flex items-center gap-1 text-xs font-bold"><X size={16} /> Cancel</button>
                </>
              ) : (
                <>
                  <button onClick={() => startEditing(img)} className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition flex items-center gap-1 text-xs font-bold"><Edit2 size={15} /> Edit Text</button>
                  <button onClick={() => handleDelete(img.id, img.src)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition flex items-center gap-1 text-xs font-bold"><Trash2 size={16} /> Delete</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
