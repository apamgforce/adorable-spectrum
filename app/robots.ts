import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/volunteer/portal", "/volunteer/training", "/admin", "/coordinator", "/gallery-admin", "/insights", "/certificate", "/verified", "/v/", "/api/"] }],
    sitemap: "https://greenforceafrica.com/sitemap.xml",
  };
}
