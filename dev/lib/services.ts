/**
 * The service link sets and pricing. Single source for the header mega-menus,
 * the mega-footer columns, the hub pages, and every PriceChip, so labels,
 * destinations, and prices never drift from shared/page-briefs and services.md.
 *
 * Every slug here must exist in shared/sitemap-plan.md. Labels are the
 * descriptive navigation names from shared/page-briefs/global-footer.md.
 */
import type { IconName } from "@/components/icons";

export type NavLink = {
  slug: string;
  label: string;
  /** Optional one-line description for hub cards and mega-menu rows. */
  short?: string;
  /** Optional icon key (used by the trailer set on dispatch nav and cards). */
  icon?: IconName;
};

// Column 1. Build/priority order: hub and Authority Package first (global-footer.md).
export const complianceNav: NavLink[] = [
  { slug: "/compliance-services/", label: "Compliance Services hub" },
  { slug: "/compliance-packages/", label: "Compliance Packages" },
  { slug: "/mc-dot-registration/", label: "Authority Package (DOT + MC)" },
  { slug: "/dot-registration/", label: "USDOT Registration" },
  { slug: "/mc-registration/", label: "MC Authority" },
  { slug: "/boc-3-filing/", label: "BOC-3 Filing" },
  { slug: "/ucr-registration/", label: "UCR Registration" },
  { slug: "/mcs-150-biennial-update/", label: "Biennial Update" },
  { slug: "/usdot-correction/", label: "USDOT Correction" },
  { slug: "/motus-migration/", label: "FMCSA Portal to MOTUS Migration" },
  { slug: "/irp-registration/", label: "IRP Registration" },
  { slug: "/ifta-registration/", label: "IFTA Registration" },
  { slug: "/ifta-quarterly-filing/", label: "IFTA Quarterly Filing" },
  { slug: "/driver-qualification-files/", label: "Driver Qualification Files" },
  { slug: "/drug-and-alcohol-consortium/", label: "Drug & Alcohol Consortium" },
  { slug: "/fmcsa-clearinghouse-registration/", label: "FMCSA Clearinghouse" },
  { slug: "/eld-services/", label: "ELD Services" },
  { slug: "/trucking-llc/", label: "Trucking LLC" },
];

// Column 2. Hub then the six trailer pages, each with its distinct trailer icon.
export const dispatchNav: NavLink[] = [
  { slug: "/services/", label: "Truck Dispatch hub" },
  { slug: "/box-truck-dispatch/", label: "Box Truck Dispatch", icon: "boxTruck" },
  { slug: "/reefers-trucking/", label: "Reefer Dispatch", icon: "reefer" },
  { slug: "/flatbed-dispatch/", label: "Flatbed Dispatch", icon: "flatbed" },
  { slug: "/dry-van-trucking/", label: "Dry Van Dispatch", icon: "dryVan" },
  { slug: "/power-only-trucking/", label: "Power Only Dispatch", icon: "powerOnly" },
  { slug: "/hot-shot-trucking/", label: "Hot Shot Dispatch", icon: "hotShot" },
];

// Column 3.
export const companyNav: NavLink[] = [
  { slug: "/about-us/", label: "About Tech Rig" },
  { slug: "/contact-us/", label: "Contact" },
  {
    slug: "/how-to-start-a-trucking-company/",
    label: "How to Start a Trucking Company",
  },
  { slug: "/lead-generation/", label: "New Authority Loads" },
  { slug: "/blog/", label: "Blog" },
];

// Column 4.
export const legalNav: NavLink[] = [
  { slug: "/terms-of-service/", label: "Terms of Service" },
  { slug: "/privacy-policy/", label: "Privacy Policy" },
  { slug: "/refund-policy/", label: "Refund Policy" },
];

/**
 * Pricing, keyed by page slug. Drives the PriceChip so on-page prices match
 * services.md exactly. **Standalone (a la carte) prices only** (Pricing v2,
 * client-pricing-v2-2026-07-10.md §2): the lower in-bundle prices are shown
 * only on `/compliance-packages/`, sourced from `services-registry.ts`. `kind`:
 *  - flat:   a fixed Tech Rig service fee (e.g. BOC-3 $100).
 *  - from:   a service-fee floor (e.g. UCR from $80).
 *  - quote:  "Contact for quote" (LLC, consultancy).
 *  - verify: service fee not yet confirmed in services.md. Rendered as "to be
 *            confirmed", never an invented number, until the client supplies it.
 * `govFee`: a separate government/third-party fee applies and must be shown
 * separately from the Tech Rig fee, never blended into one number.
 */
export type Price = {
  kind: "flat" | "from" | "quote" | "verify";
  amount?: number;
  govFee?: boolean;
  /** Per-unit note, e.g. "per driver". */
  unit?: string;
};

export const pricing: Record<string, Price> = {
  // USDOT is a $300 total with no separate federal fee, so it never shows
  // "+ government fee" (client QA 2026-06 / services.md).
  "/dot-registration/": { kind: "flat", amount: 300 },
  "/mc-registration/": { kind: "flat", amount: 650, govFee: true },
  "/boc-3-filing/": { kind: "flat", amount: 100 },
  "/ucr-registration/": { kind: "from", amount: 80, govFee: true },
  "/mcs-150-biennial-update/": { kind: "flat", amount: 125 },
  "/usdot-correction/": { kind: "flat", amount: 125 },
  "/motus-migration/": { kind: "flat", amount: 125 },
  "/fmcsa-clearinghouse-registration/": { kind: "flat", amount: 125 },
  "/drug-and-alcohol-consortium/": { kind: "flat", amount: 175 },
  "/driver-qualification-files/": { kind: "flat", amount: 250, unit: "per driver" },
  "/trucking-llc/": { kind: "quote" },
  // IRP/IFTA setup fees ($225 each standalone); the government/state fees stay
  // separate (govFee) because they depend on mileage and jurisdictions.
  "/irp-registration/": { kind: "flat", amount: 225, govFee: true },
  "/ifta-registration/": { kind: "flat", amount: 225, govFee: true },
  "/ifta-quarterly-filing/": { kind: "flat", amount: 150, govFee: true },
  // ELD is a partner referral with NO Tech Rig fee (client rule 2026-06-21), so
  // it has no pricing entry: the hub card renders no price chip. Insurance is
  // coordinate-only and its page is removed, so it has no entry either.
  // Service fees still not confirmed in services.md (flagged [VERIFY] in briefs).
  "/mc-dot-registration/": { kind: "verify", govFee: true },
};

/**
 * The full compliance service catalog: single source for every "list all our
 * services" surface (the /compliance-services/ hub grid, and the homepage
 * "What we handle" section), so descriptions and prices never drift between
 * the two. `href` is omitted for the two services with no dedicated page
 * (rendered link-free there, so neither page ships a dead link).
 */
export type ComplianceCatalogItem = {
  title: string;
  description: string;
  icon: IconName;
  href?: string;
  price?: Price;
  govFeeNote?: string;
  note?: string;
};

export const complianceCatalog: ComplianceCatalogItem[] = [
  {
    href: "/dot-registration/",
    title: "USDOT number",
    description: "Your federal carrier ID, filed correctly the first time.",
    icon: "stamp",
  },
  {
    href: "/mc-registration/",
    title: "MC authority",
    description: "Operating authority to haul freight for hire across state lines.",
    icon: "shield",
    // The $650 standalone MC fee includes the USDOT number, so the standalone
    // $300 is not charged on top. Suppress the generic gov-fee line here in
    // favour of that clearer note (the MC page carries the full fee separation).
    price: { ...pricing["/mc-registration/"], govFee: false },
    note: "includes USDOT number",
  },
  {
    href: "/boc-3-filing/",
    title: "BOC-3 filing",
    description: "Blanket process-agent designation, required to activate authority.",
    icon: "filing",
  },
  {
    href: "/ucr-registration/",
    title: "UCR",
    description: "Annual Unified Carrier Registration, with the right fleet bracket.",
    icon: "filing",
    govFeeNote: "+ gov fee by fleet size",
  },
  {
    href: "/irp-registration/",
    title: "IRP plates",
    description: "Apportioned plates so you can run legally in multiple states.",
    icon: "routeNode",
    govFeeNote: "+ state fees",
  },
  {
    href: "/ifta-registration/",
    title: "IFTA",
    description: "One-time fuel-tax registration setup for interstate miles.",
    icon: "routeNode",
    govFeeNote: "+ state fees",
  },
  {
    href: "/ifta-quarterly-filing/",
    title: "IFTA quarterly filing",
    description: "The recurring quarterly fuel-tax return, prepared and filed from your mileage and fuel records.",
    icon: "routeNode",
    govFeeNote: "+ fuel tax due",
  },
  {
    href: "/fmcsa-clearinghouse-registration/",
    title: "Clearinghouse Registration",
    description: "FMCSA Clearinghouse registration for drug and alcohol records.",
    icon: "shield",
  },
  {
    href: "/drug-and-alcohol-consortium/",
    title: "Drug & alcohol consortium",
    description: "Consortium enrollment and random testing program management.",
    icon: "shield",
  },
  {
    href: "/driver-qualification-files/",
    title: "DQ files",
    description: "Compliant driver qualification files, built and kept audit-ready.",
    icon: "filing",
  },
  {
    href: "/eld-services/",
    title: "ELD",
    description: "A referral to our ELD partner for a compliant hours-of-service device. No Tech Rig fee.",
    icon: "stamp",
  },
  {
    href: "/mcs-150-biennial-update/",
    title: "Biennial Update",
    description: "The biennial MCS-150 filing that keeps your USDOT record current.",
    icon: "filing",
  },
  {
    // Dedicated page now exists (client D3); price reads from the single source.
    // Scope and the separation from the Biennial Update come from the QA brief.
    href: "/usdot-correction/",
    title: "USDOT Correction",
    description: "Correct your USDOT record: address, legal or business name, email, phone, operating status, and truck and driver counts. Separate from the Biennial Update.",
    icon: "stamp",
  },
  {
    href: "/motus-migration/",
    title: "FMCSA Portal to MOTUS Migration",
    description: "Move a legacy FMCSA Portal account into MOTUS: claim your USDOT, assign a Company Official, and clear verification or missing-authority issues.",
    icon: "stamp",
  },
  {
    href: "/trucking-llc/",
    title: "Trucking LLC",
    description: "Company formation so your authority sits under the right entity.",
    icon: "filing",
  },
  {
    title: "MC reinstatement / deactivation",
    description: "Reinstate a dismissed MC authority, or deactivate one you no longer run.",
    icon: "shield",
    price: { kind: "from", amount: 200 },
  },
  {
    title: "USDOT reactivation / deactivation",
    description: "Reactivate an inactive USDOT number, or deactivate a record you are closing.",
    icon: "stamp",
    price: { kind: "flat", amount: 125 },
  },
];
