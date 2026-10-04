import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/volunteer/portal", "/volunteer/training", "/admin", "/gallery-admin", "/certificate", "/verified", "/v/", "/api/"] }],
    sitemap: "https://greenforceafrica.com/sitemap.xml",
  };
}
