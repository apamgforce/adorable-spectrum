"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus, Loader2 } from "lucide-react";

const CATEGORIES = ["Greenhouse", "Training", "Education", "Community", "Harvest"];

export default function AdminPage() {
  const [images, setImages] = useState<any[]>([]);
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("Training");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const refreshImages = () => {
    fetch("/api/gallery").then(res => res.json()).then(data => setImages(data));
  };

  useEffect(() => { refreshImages(); }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !caption) return alert("Please select an image and write a caption!");

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("caption", caption);
    formData.append("category", category);

    const res = await fetch("/api/gallery", { method: "POST", body: formData });
    setIsSubmitting(false);

    if (res.ok) {
      setCaption("");
      setFile(null);
      (document.getElementById("fileInput") as HTMLInputElement).value = "";
      refreshImages();
    } else {
      alert("Something went wrong with the upload.");
    }
  };

  const handleDelete = async (id: number, src: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    const res = await fetch("/api/gallery", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, src })
    });
    if (res.ok) refreshImages();
  };

  return (
    <main className="max-w-4xl mx-auto pt-32 pb-16 px-6 font-sans">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Gallery Control Panel</h1>

      {/* UPLOAD FORM */}
      <form onSubmit={handleUpload} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mb-12 space-y-4">
        <h2 className="text-lg font-semibold text-slate-700">Add New Image</h2>
        
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
          <input type="text" value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Type a clean caption describing this moment..." className="w-full text-sm border rounded-lg p-2.5 focus:outline-emerald-600" />
        </div>

        <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-5 py-2.5 rounded-xl transition disabled:opacity-50">
          {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
          {isSubmitting ? "Uploading..." : "Publish to Gallery"}
        </button>
      </form>

      {/* MANAGE COPIES */}
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
