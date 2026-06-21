import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Transactional / noindex routes (not part of the organic set).
      disallow: ["/get-started/", "/single-payment/"],
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
