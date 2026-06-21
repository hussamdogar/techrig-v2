import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import {
  companyNav,
  complianceNav,
  dispatchNav,
  legalNav,
} from "@/lib/services";

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
  const paths = Array.from(
    new Set([
      "/",
      ...complianceNav.map((n) => n.slug),
      ...dispatchNav.map((n) => n.slug),
      ...companyNav.map((n) => n.slug),
      ...legalNav.map((n) => n.slug),
      ...stateRoutes,
      ...extraRoutes,
    ]),
  );

  return paths.map((path) => ({ url: `${site.url}${path}` }));
}
