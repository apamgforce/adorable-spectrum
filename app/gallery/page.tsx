"use client";

import { useEffect, useState } from "react";
import { X, ZoomIn, Loader2 } from "lucide-react";

// Hardcoded backup array ensures the layout looks great instantly
const BACKUP_IMAGES = [
  { id: 1, src: "hostellers.png", caption: "Youth agri-training in Apam", category: "Training" },
  { id: 2, src: "sitting.jpg", caption: "Greenhouse at Apam SHS", category: "Greenhouse" },
  { id: 5, src: "/beansharvest.jpg", caption: "Harvest season — Central Ghana", category: "Harvest" }
];

const CATEGORIES = ["All", "Greenhouse", "Training", "Education", "Community", "Harvest"];

export default function GalleryPage() {
  const [images, setImages] = useState(BACKUP_IMAGES);
  const [active, setActive] = useState("All");
  const [lightbox, setLightbox] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) setImages(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = active === "All" ? images : images.filter(i => i.category === active);

  return (
    <main>
      {/* HEADER */}
      <section className="pt-32 pb-16 px-6 text-center" style={{background: 'var(--cream)'}}>
        <div className="max-w-2xl mx-auto">
          <span className="text-xs tracking-[0.25em] uppercase font-medium" style={{color: 'var(--sage)'}}>Visual Stories</span>
          <h1 className="font-display text-5xl lg:text-6xl font-light mt-2 mb-4" style={{color: 'var(--forest)'}}>
            The work,<br /><em>in pictures.</em>
          </h1>
          <p className="text-slate-500 leading-relaxed">
            Every photograph here is a testimony. A moment where a seed was planted — in soil, in a child, in a community.
          </p>
        </div>
      </section>

      {/* FILTER */}
      <section className="px-6 pb-8 sticky top-16 z-40" style={{background: 'var(--cream)'}}>
        <div className="max-w-7xl mx-auto flex flex-wrap gap-2 justify-center border-b pb-6" style={{borderColor: 'rgba(74,140,82,0.15)'}}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className="text-xs px-5 py-2 rounded-full font-medium transition-all duration-300"
              style={{
                background: active === cat ? 'var(--leaf)' : 'white',
                color: active === cat ? 'white' : 'var(--slate)',
                border: `1px solid ${active === cat ? 'var(--leaf)' : 'rgba(74,140,82,0.2)'}`,
              }}
            >
              {cat}
            </button>
          ))}
          {isLoading && <Loader2 className="animate-spin text-slate-400 ml-3 self-center" size={18} />}
        </div>
      </section>

      {/* GRID */}
      <section className="py-12 px-6" style={{background: 'var(--cream)'}}>
        <div className="max-w-7xl mx-auto">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
            {filtered.map((img) => (
              <div
                key={img.id}
                className="break-inside-avoid rounded-2xl overflow-hidden group cursor-zoom-in relative"
                onClick={() => setLightbox(img)}
              >
                <img
                  src={img.src}
                  alt={img.caption}
                  className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-end opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{background: 'linear-gradient(to top, rgba(26,61,31,0.85), transparent 50%)'}}>
                  <div className="p-5 w-full flex justify-between items-end">
                    <div>
                      <span className="text-xs font-medium rounded-full px-2 py-0.5" style={{background: 'rgba(201,162,39,0.9)', color: 'white'}}>{img.category}</span>
                      <p className="text-white text-sm mt-2">{img.caption}</p>
                    </div>
                    <ZoomIn size={18} className="text-white/70 shrink-0" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIGHTBOX */}
      {lightbox && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{background: 'rgba(0,0,0,0.92)'}} onClick={() => setLightbox(null)}>
          <button className="absolute top-6 right-6 text-white/60 hover:text-white" onClick={() => setLightbox(null)}><X size={28} /></button>
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.src} alt={lightbox.caption} className="w-full rounded-2xl object-contain max-h-[80vh]" />
            <div className="mt-4 flex items-center justify-between">
              <p className="text-white/80 text-sm">{lightbox.caption}</p>
              <span className="text-xs px-3 py-1 rounded-full" style={{background: 'rgba(74,140,82,0.3)', color: 'var(--mint)'}}>{lightbox.category}</span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
