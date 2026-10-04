import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/volunteer/portal", "/volunteer/training", "/admin", "/gallery-admin", "/api/"] }],
  };
}
