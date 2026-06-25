import type { NextConfig } from "next";

/**
 * 301/308 migration redirects, implementing shared/redirect-map.md and the
 * 18 prune redirects in shared/blog-disposition.md. The migration prime
 * directive is to preserve existing organic performance, so every retired old
 * URL resolves in exactly one hop (permanent: true => 308, treated as a
 * permanent redirect by search engines, per the SEO handoff's instruction).
 *
 * Ordering matters: Next.js applies the first matching rule, so the specific
 * reefer "compliance-assistance" overrides are listed before the broad per-silo
 * catch-alls. The silo catch-alls use `:path+` (one or more segments) so a silo
 * hub never redirects to itself, and the two built `/cost/` pages
 * (box-truck, dry-van) are excluded with a negative lookahead so they keep
 * serving their real route.
 */

// The five reefer "benefits/compliance-assistance" sub-pages that route to a
// more specific compliance page than the silo default (redirect-map.md §D).
const REEFER_COMPLIANCE_BASE =
  "/reefers-trucking/benefits/compliance-assistance";
const reeferComplianceOverrides: { sub: string; destination: string }[] = [
  { sub: "eld-mandate", destination: "/eld-services/" },
  { sub: "hos-regulations", destination: "/eld-services/" },
  { sub: "csa-scores", destination: "/fmcsa-clearinghouse-registration/" },
  { sub: "safety-violations", destination: "/fmcsa-clearinghouse-registration/" },
  { sub: "audits-checks", destination: "/fmcsa-clearinghouse-registration/" },
  { sub: "safety-standards", destination: "/fmcsa-clearinghouse-registration/" },
  { sub: "driver-training", destination: "/driver-qualification-files/" },
  { sub: "record-keeping", destination: "/driver-qualification-files/" },
  { sub: "compliance-training-programs", destination: "/driver-qualification-files/" },
  { sub: "insurance-requirements", destination: "/trucking-insurance-filing/" },
];

// Dispatch silos whose deep sub-pages collapse to the silo hub (redirect-map.md
// §C). box-truck and dry-van keep a built `/cost/` page, so those two exclude
// `cost` from the catch-all; the other three have no built cost page, so their
// `/cost/` collapses to the hub too.
const siloHubs = [
  "/reefers-trucking/",
  "/flatbed-dispatch/",
  "/power-only-trucking/",
];
const siloHubsKeepingCost = ["/box-truck-dispatch/", "/dry-van-trucking/"];

// The 18 hype-title listicles that are pruned, not rebuilt (blog-disposition.md
// §301/PRUNE). Old posts live at the site root, so sources are root slugs.
const prunedPosts: { slug: string; destination: string }[] = [
  { slug: "mastering-truck-maintenance-and-dispatch-the-ultimate-guide-for-fleet-success", destination: "/services/" },
  { slug: "mastering-customer-service-in-dispatching-a-truck-owners-guide-to-success", destination: "/services/" },
  { slug: "mastering-the-paper-trail-a-truckers-guide-to-administrative-excellence", destination: "/services/" },
  { slug: "mastering-the-art-of-load-scouting-12-techniques-to-dominate-the-trucking-game", destination: "/services/" },
  { slug: "master-the-art-of-freight-rate-negotiation-12-insider-strategies-for-truckers", destination: "/services/" },
  { slug: "revolutionize-your-trucking-business-the-power-of-route-planning", destination: "/services/" },
  { slug: "revolutionize-your-trucking-business-7-game-changing-benefits-of-dispatch-services", destination: "/services/" },
  { slug: "revolutionizing-dispatch-how-technology-is-transforming-the-industry", destination: "/services/" },
  { slug: "the-ultimate-guide-to-truck-dispatch-services-boosting-efficiency-on-the-road", destination: "/services/" },
  { slug: "navigating-the-dispatch-maze-your-guide-to-choosing-the-perfect-service", destination: "/services/" },
  { slug: "unleashing-profit-potential-the-ultimate-guide-to-maximizing-earnings-with-dispatch-services", destination: "/services/" },
  { slug: "dispatchers-vs-brokers-navigating-the-trucking-industrys-key-players", destination: "/freight-broker-vs-dispatcher/" },
  { slug: "navigating-the-compliance-maze-a-truck-owners-survival-guide", destination: "/compliance-services/" },
  { slug: "revolutionize-your-trucking-business-with-flatbed-dispatch-services", destination: "/flatbed-dispatch/" },
  { slug: "revolutionize-your-box-truck-business-with-expert-dispatch-services", destination: "/box-truck-dispatch/" },
  { slug: "power-only-dispatch-revolutionizing-trucking-efficiency", destination: "/power-only-trucking/" },
  { slug: "maximizing-profits-the-ultimate-guide-to-dry-van-dispatch-services", destination: "/dry-van-trucking/" },
  { slug: "mastering-the-cold-chain-the-ultimate-guide-to-reefer-dispatch-services", destination: "/reefers-trucking/" },
];

const nextConfig: NextConfig = {
  // The planned URL set (shared/sitemap-plan.md) and the live site use trailing
  // slashes. Match that so canonical URLs and internal links carry the slash and
  // existing ranking URLs are preserved through the revamp.
  trailingSlash: true,

  async redirects() {
    return [
      // M7 §1. Legacy application subdomains → the new platform entry, one hop,
      // host-based so they win over every path rule below regardless of path.
      // The targets are noindex by design (transactional flows, ADR-5). The full
      // legacy URL set is handed to Workstream A's crawl-union (build-report.md).
      {
        source: "/:path*",
        has: [{ type: "host", value: "form.techrig.org" }],
        destination: "https://techrig.org/apply/",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "boc-3.techrig.org" }],
        destination: "https://techrig.org/apply/?service=boc-3",
        permanent: true,
      },

      // §B. Exact-match named pages.
      { source: "/home-backup/", destination: "/", permanent: true },
      { source: "/clone-home/", destination: "/", permanent: true },
      { source: "/start-compliance/", destination: "/compliance-services/", permanent: true },
      { source: "/introduction/", destination: "/how-to-start-a-trucking-company/", permanent: true },
      { source: "/step-by-step-process/", destination: "/how-to-start-a-trucking-company/", permanent: true },

      // §D. Reefer "benefits/compliance-assistance" specific overrides. These
      // MUST precede the reefer silo catch-all below so they win.
      ...reeferComplianceOverrides.map(({ sub, destination }) => ({
        source: `${REEFER_COMPLIANCE_BASE}/${sub}/`,
        destination,
        permanent: true,
      })),
      // Everything else under compliance-assistance (and its index) → the hub.
      {
        source: `${REEFER_COMPLIANCE_BASE}/:path*`,
        destination: "/compliance-services/",
        permanent: true,
      },

      // §C + §D. Per-silo catch-alls. The reefer rule also sweeps the remaining
      // benefits/* pages and the unbuilt /cost/ into the hub.
      ...siloHubs.map((hub) => ({
        source: `${hub}:path+`,
        destination: hub,
        permanent: true,
      })),
      // box-truck and dry-van: collapse sub-pages to the hub but keep the built
      // /cost/ route (negative lookahead excludes a `cost` first segment).
      ...siloHubsKeepingCost.map((hub) => ({
        source: `${hub}:path((?!cost).+)`,
        destination: hub,
        permanent: true,
      })),

      // blog-disposition.md §301/PRUNE. Root-level old post slugs.
      ...prunedPosts.map(({ slug, destination }) => ({
        source: `/${slug}/`,
        destination,
        permanent: true,
      })),
    ];
  },

  // Application Platform routes are all noindex (ADR-5). The pages also emit a
  // <meta robots> tag; this header is belt-and-suspenders at the edge.
  async headers() {
    const noindex = [{ key: "X-Robots-Tag", value: "noindex" }];
    return [
      { source: "/lookup/:path*", headers: noindex },
      { source: "/apply/:path*", headers: noindex },
      { source: "/dashboard/:path*", headers: noindex },
      { source: "/account/:path*", headers: noindex },
      { source: "/admin/:path*", headers: noindex },
      { source: "/unsubscribe", headers: noindex },
      { source: "/api/cron/:path*", headers: noindex },
      { source: "/login", headers: noindex },
      { source: "/auth/:path*", headers: noindex },
    ];
  },
};

export default nextConfig;
