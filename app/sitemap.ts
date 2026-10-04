import type { MetadataRoute } from "next";

const BASE = "https://greenforceafrica.com";

// Public pages only. Volunteer portal, certificates and admin areas are deliberately left out.
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/about", priority: 0.8 },
    { path: "/projects", priority: 0.8 },
    { path: "/donate", priority: 0.9 },
    { path: "/apply", priority: 0.7 },
    { path: "/volunteer", priority: 0.7 },
    { path: "/gallery", priority: 0.6 },
    { path: "/contact", priority: 0.6 },
  ];
  return pages.map((p) => ({ url: `${BASE}${p.path}`, changeFrequency: "monthly", priority: p.priority }));
}
