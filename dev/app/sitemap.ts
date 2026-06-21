import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import {
  companyNav,
  complianceNav,
  dispatchNav,
  legalNav,
} from "@/lib/services";
import { getPostSlugs } from "@/lib/blog";

// The indexable URL set. Built from the shared nav data (single source) plus the
// state, cost, bridge, and home routes. Transactional/noindex URLs
// (/get-started, /single-payment, the form subdomains) are deliberately excluded
// (see sitemap-plan.md). trailingSlash is on, so these match the canonical form.
const stateRoutes = [
  "/tech-rig-dispatch-texas/",
  "/tech-rig-dispatch-california/",
  "/tech-rig-dispatch-new-york/",
  "/tech-rig-dispatch-florida/",
];

const extraRoutes = [
  "/box-truck-dispatch/cost/",
  "/dry-van-trucking/cost/",
  "/how-to-start-a-box-truck-business/",
];

export default function sitemap(): MetadataRoute.Sitemap {
  // The KEEP blog posts migrated at their original root URLs (lib/blog). Including
  // them is part of the migration's preserve-rankings goal: the old ranking post
  // URLs must stay discoverable in the sitemap, not just resolvable.
  const blogPaths = getPostSlugs().map((slug) => `/${slug}/`);

  const paths = Array.from(
    new Set([
      "/",
      ...complianceNav.map((n) => n.slug),
      ...dispatchNav.map((n) => n.slug),
      ...companyNav.map((n) => n.slug),
      ...legalNav.map((n) => n.slug),
      ...stateRoutes,
      ...extraRoutes,
      ...blogPaths,
    ]),
  );

  return paths.map((path) => ({ url: `${site.url}${path}` }));
}
