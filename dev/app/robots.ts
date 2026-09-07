import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Transactional / noindex routes (not part of the organic set). Each of
      // these also sets `robots: { index: false, follow: false }` per-page
      // and a matching X-Robots-Tag header (next.config.ts), so this list is
      // belt-and-suspenders crawl-budget hygiene, not the only protection.
      disallow: [
        "/lookup/",
        "/apply/",
        "/buy/",
        "/account/",
        "/dashboard/",
        "/admin/",
        "/login",
        "/auth/",
        "/unsubscribe",
      ],
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
