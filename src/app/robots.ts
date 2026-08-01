import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The admin portal is auth-gated, but keep it out of the index anyway.
      disallow: ["/admin", "/admin/"],
    },
    sitemap: siteUrl("sitemap.xml"),
  };
}
