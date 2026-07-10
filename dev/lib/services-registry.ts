/**
 * Service registry (M3, re-architected D15 "pricing v2") — the single typed
 * catalog that drives pricing, the dynamic stepper, and timelines. Prices come
 * ONLY from `seo/context/services.md` (the pricing source of truth, mirroring
 * `shared/client-pricing-v2-2026-07-10.md`); never hardcode a contradicting price.
 *
 * Pricing v2 model (work-order-pricing-v2.md): every billable service carries
 * TWO prices — `standalonePrice` (à la carte checkout) and `bundlePrice` (used
 * only when the service is a constituent of one of the four fixed bundles).
 * The four bundles replace the old single `full-package` entry; each bundle's
 * itemized total, rounding adjustment, final price, and public-display figures
 * are DERIVED by `getBundleBreakdown`, never hardcoded, so they stay correct if
 * a component price moves.
 *
 * Compliance reframe (HARD RULE, work-order-eld-insurance.md): `eld` and
 * `insurance` are NOT billable Tech Rig filings. They appear here as
 * informational/coordination entries with NO Tech Rig price and produce no
 * priced `filings` row.
 *
 * Phase note (D15): this file lands the pricing DATA model + `computePricing`.
 * The `/apply` bundle-selection UX (the four bundles + a CDL/non-CDL selector)
 * is built in a later pass once Design's card specs land; today there is no UI
 * path that sets `PricingContext.bundle`, and the dynamic stepper
 * (`lib/apply/steps.ts`) still derives its active steps from `selected`
 * (à la carte `ServiceKey[]`) only. When the bundle UI lands, feed the chosen
 * bundle's `includes` into `activeSteps` alongside `selected` so bundle
 * constituents (e.g. IRP/IFTA requiring the `vehicles` step) activate the
 * right steps.
 */

export type StepKey =
  | "services"
  | "carrier-identity"
  | "business-details"
  | "operations"
  | "passenger"
  | "hazmat"
  | "vehicles"
  | "drivers"
  | "ucr-details"
  | "service-specifics"
  | "review";

export type ServiceKey =
  | "usdot"
  | "mc-authority"
  | "boc-3"
  | "ucr"
  | "mcs-150"
  | "usdot-correction"
  | "motus-migration"
  | "clearinghouse"
  | "consortium"
  | "dq-files"
  | "drug-test"
  | "irp"
  | "ifta"
  | "ifta-quarterly"
  | "trucking-llc"
  | "eld"
  | "insurance";

export type ServiceDef = {
  key: ServiceKey;
  name: string;
  blurb: string;
  /** flat fee | per-driver (tiered) | UCR (tiered) | quote (no auto price). */
  priceKind: "flat" | "perDriver" | "ucr" | "quote";
  /** À la carte Tech Rig service fee (USD). Omitted for ucr/perDriver (dedicated
   *  calculators below) and quote/informational entries. */
  standalonePrice?: number;
  /** In-bundle Tech Rig service fee (USD): what this service costs as a
   *  constituent of one of the four fixed bundles. Omitted for services that
   *  are never bundled (they always charge `standalonePrice`, in or out of a
   *  bundle context) and for ucr/perDriver/quote/informational entries. */
  bundlePrice?: number;
  /** Label used only on a bundle's itemized breakdown line, when it differs
   *  from `name` (e.g. MC authority reads as the combined "MC Authority + USDOT
   *  registration" line inside a bundle, per the client doc §2/§3). */
  bundleLabel?: string;
  /** Separate government/state fee disclosure, never blended into the fee. */
  govFeeNote?: string;
  /** Steps this service requires (drives the dynamic stepper). */
  requiredSteps: StepKey[];
  /** Human expected timeline (process expectation, not a metric). */
  expectedTimeline: string;
  /** A brand-new FMCSA registration (no MCS-150 diff applies). */
  isNewRegistration?: boolean;
  /** eld/insurance: surfaced for context, never billed, no filing row. */
  informationalOnly?: boolean;
};

// Canonical step order. The active set is the union of the selected services'
// requiredSteps (plus services + review, plus conditional passenger/hazmat),
// rendered in THIS order.
export const STEP_ORDER: StepKey[] = [
  "services",
  "carrier-identity",
  "business-details",
  "operations",
  "passenger",
  "hazmat",
  "vehicles",
  "drivers",
  "ucr-details",
  "service-specifics",
  "review",
];

export const SERVICES: Record<ServiceKey, ServiceDef> = {
  usdot: {
    key: "usdot",
    name: "USDOT registration",
    blurb: "Your federal carrier ID. Included free when you also file MC authority.",
    priceKind: "flat",
    standalonePrice: 300,
    bundlePrice: 300, // never bundled on its own; MC Authority + USDOT is the bundle line
    requiredSteps: ["carrier-identity", "business-details", "operations"],
    expectedTimeline: "Filed within 24 hours; active immediately after a successful submission",
    isNewRegistration: true,
  },
  "mc-authority": {
    key: "mc-authority",
    name: "MC operating authority",
    blurb: "Interstate for-hire authority. Includes your USDOT number.",
    priceKind: "flat",
    standalonePrice: 650,
    bundlePrice: 600,
    bundleLabel: "MC Authority + USDOT registration",
    govFeeNote: "+ FMCSA application fee, shown separately",
    requiredSteps: ["carrier-identity", "business-details", "operations"],
    expectedTimeline: "Filed within 24 hours; activates after the 21-day protest period, and requires BOC-3 and insurance",
    isNewRegistration: true,
  },
  "boc-3": {
    key: "boc-3",
    name: "BOC-3 filing",
    blurb: "Blanket process-agent designation across all 50 states.",
    priceKind: "flat",
    standalonePrice: 100,
    bundlePrice: 100,
    requiredSteps: ["carrier-identity", "service-specifics"],
    expectedTimeline: "Same business day when ordered with your information during business hours",
  },
  ucr: {
    key: "ucr",
    name: "UCR registration",
    blurb: "Unified Carrier Registration. Government fee varies by fleet bracket.",
    priceKind: "ucr",
    standalonePrice: 80,
    bundlePrice: 50,
    govFeeNote: "+ government fee by power-unit bracket, shown separately",
    requiredSteps: ["carrier-identity", "ucr-details"],
    expectedTimeline: "Same day when you are in the UCR database; a new USDOT may take 1 to 2 days to appear",
  },
  // Display label is "Biennial Update" (client QA 2026-06); the key stays mcs-150
  // and "MCS-150" may still appear in explanatory body copy. The biennial filing
  // only; record corrections live in the separate usdot-correction service.
  "mcs-150": {
    key: "mcs-150",
    name: "Biennial Update",
    blurb: "The biennial MCS-150 filing that keeps your USDOT record current and active.",
    priceKind: "flat",
    standalonePrice: 125,
    bundlePrice: 125, // not currently bundled; same price in or out of a bundle context
    requiredSteps: ["carrier-identity", "service-specifics"],
    expectedTimeline:
      "Normally same day; the same 7 to 10 business-day FMCSA delay applies if record linking is needed",
  },
  // Record correction, separate from the Biennial Update (client QA 2026-06).
  "usdot-correction": {
    key: "usdot-correction",
    name: "USDOT Correction",
    blurb:
      "Correct your USDOT record: address, legal or business name, email, phone, operating status, or truck and driver counts.",
    priceKind: "flat",
    standalonePrice: 125,
    bundlePrice: 125, // not currently bundled
    requiredSteps: ["carrier-identity", "service-specifics"],
    expectedTimeline:
      "Normally same day when MOTUS is active and your USDOT is linked; FMCSA linking or support can take up to 7 to 10 business days",
  },
  // Help migrating a legacy FMCSA Portal account into MOTUS (client answers 2026-06-25).
  "motus-migration": {
    key: "motus-migration",
    name: "FMCSA Portal to MOTUS Migration",
    blurb:
      "Move your legacy FMCSA Portal account into MOTUS: claim your USDOT, assign a Company Official, and clear verification or missing-authority issues.",
    priceKind: "flat",
    standalonePrice: 125,
    bundlePrice: 125, // not currently bundled
    requiredSteps: ["carrier-identity", "service-specifics"],
    expectedTimeline: "Approximately 1 to 2 weeks",
  },
  clearinghouse: {
    key: "clearinghouse",
    name: "Clearinghouse registration",
    blurb: "FMCSA Clearinghouse registration assistance for drug and alcohol records.",
    priceKind: "flat",
    standalonePrice: 125,
    bundlePrice: 100,
    requiredSteps: ["carrier-identity", "drivers"],
    expectedTimeline: "Within 1 business day",
  },
  consortium: {
    key: "consortium",
    name: "Drug & alcohol consortium",
    blurb: "Consortium enrollment and random testing program management.",
    priceKind: "flat",
    standalonePrice: 175,
    bundlePrice: 150,
    requiredSteps: ["carrier-identity", "drivers"],
    expectedTimeline: "Within 1 to 2 business days",
  },
  "dq-files": {
    key: "dq-files",
    name: "Driver qualification files",
    blurb: "Compliant DQ files, built and kept audit-ready. Tiered by driver count.",
    priceKind: "perDriver",
    standalonePrice: 250, // 1-driver baseline; see DQ_STANDALONE_TABLE for 2/3
    bundlePrice: 200, // 1-driver baseline; see DQ_BUNDLE_TABLE for 2/3
    requiredSteps: ["carrier-identity", "drivers"],
    expectedTimeline: "Within 1 to 3 business days after documents are received",
  },
  "drug-test": {
    key: "drug-test",
    name: "Pre-employment drug test",
    blurb: "Pre-employment drug-test coordination.",
    priceKind: "flat",
    standalonePrice: 125,
    bundlePrice: 100,
    requiredSteps: ["carrier-identity", "drivers"],
    expectedTimeline: "Scheduled after consortium enrollment, based on carrier and driver availability",
  },
  irp: {
    key: "irp",
    name: "IRP registration",
    blurb: "Apportioned plates for multi-state operation.",
    priceKind: "flat",
    standalonePrice: 225,
    bundlePrice: 175,
    govFeeNote: "+ state registration fees by mileage and states, shown separately",
    requiredSteps: ["carrier-identity", "vehicles"],
    expectedTimeline: "Varies by state and document availability",
  },
  ifta: {
    key: "ifta",
    name: "IFTA registration",
    blurb: "One-time fuel-tax registration setup.",
    priceKind: "flat",
    standalonePrice: 225,
    bundlePrice: 175,
    govFeeNote: "+ state fees, shown separately",
    requiredSteps: ["carrier-identity", "vehicles"],
    expectedTimeline: "Varies by state and document availability",
  },
  // Recurring quarterly return, distinct from the one-time ifta setup (client QA 2026-06).
  "ifta-quarterly": {
    key: "ifta-quarterly",
    name: "IFTA quarterly filing",
    blurb: "Recurring quarterly fuel-tax return. Separate from the one-time IFTA setup.",
    priceKind: "flat",
    standalonePrice: 150,
    bundlePrice: 150, // not currently bundled
    govFeeNote: "+ government fee, shown separately",
    requiredSteps: ["carrier-identity", "service-specifics"],
    expectedTimeline: "Within 1 to 3 business days after complete mileage and fuel records",
  },
  "trucking-llc": {
    key: "trucking-llc",
    name: "Trucking LLC formation",
    blurb: "Company formation. Pricing varies by state, so it is quoted.",
    priceKind: "quote",
    requiredSteps: ["carrier-identity", "business-details"],
    expectedTimeline: "Varies by state",
  },
  // Informational only — never billed, never a priced filing (compliance reframe).
  eld: {
    key: "eld",
    name: "ELD",
    blurb: "We refer you to our ELD partner. No Tech Rig fee.",
    priceKind: "quote",
    requiredSteps: [],
    expectedTimeline: "Via our ELD partner",
    informationalOnly: true,
  },
  insurance: {
    key: "insurance",
    name: "Insurance filing coordination",
    blurb: "We coordinate with your own insurer so the filing clears. No Tech Rig fee.",
    priceKind: "quote",
    requiredSteps: [],
    expectedTimeline: "Coordinated with your insurer",
    informationalOnly: true,
  },
};

export const SERVICE_KEYS = Object.keys(SERVICES) as ServiceKey[];

/** The services a client can SELECT and be billed for (excludes informational). */
export const BILLABLE_SERVICE_KEYS = SERVICE_KEYS.filter((k) => !SERVICES[k].informationalOnly);

export function isServiceKey(value: unknown): value is ServiceKey {
  return typeof value === "string" && value in SERVICES;
}

// ---- UCR government-fee brackets (client-pricing-v2-2026-07-10.md §10) ------
// The Tech Rig SERVICE fee is flat ($80 standalone / $50 in-bundle, above); the
// GOVERNMENT fee depends on the power-unit bracket and is disclosed separately,
// never blended. Every bracket now has a published fee (no manual-review cap).
export const UCR_GOV_FEE_BRACKETS: { tier: string; maxUnits: number | null; govFee: number }[] = [
  { tier: "0-2", maxUnits: 2, govFee: 46 },
  { tier: "3-5", maxUnits: 5, govFee: 138 },
  { tier: "6-20", maxUnits: 20, govFee: 276 },
  { tier: "21-100", maxUnits: 100, govFee: 963 },
  { tier: "101-1000", maxUnits: 1000, govFee: 4592 },
  { tier: "1001+", maxUnits: null, govFee: 44836 },
];

/** The 0-2 bracket government fee every bundle bakes into its itemized total. */
export const UCR_BUNDLE_BASELINE_GOV_FEE = UCR_GOV_FEE_BRACKETS[0].govFee;

export function ucrGovFeeBracket(powerUnits: number | null | undefined): { tier: string; govFee: number | null } {
  const n = powerUnits == null || !Number.isFinite(powerUnits) || Number(powerUnits) < 0 ? null : Number(powerUnits);
  if (n == null) return { tier: "unknown", govFee: null };
  const bracket =
    UCR_GOV_FEE_BRACKETS.find((b) => b.maxUnits == null || n <= b.maxUnits) ??
    UCR_GOV_FEE_BRACKETS[UCR_GOV_FEE_BRACKETS.length - 1];
  return { tier: bracket.tier, govFee: bracket.govFee };
}

export type UcrResult = {
  tier: string;
  serviceFee: number | null; // Tech Rig fee; null when the bracket could not be determined
  govFee: number | null; // government fee for the bracket
  manualReview: boolean;
};

/** UCR service fee + government fee for a power-unit count, in the given
 *  pricing context ("standalone" à la carte vs "bundle" in-package). */
export function calculateUcr(
  powerUnits: number | null | undefined,
  context: "standalone" | "bundle" = "standalone",
): UcrResult {
  const { tier, govFee } = ucrGovFeeBracket(powerUnits);
  if (govFee == null) return { tier, serviceFee: null, govFee: null, manualReview: true };
  const serviceFee = context === "bundle" ? SERVICES.ucr.bundlePrice ?? null : SERVICES.ucr.standalonePrice ?? null;
  return { tier, serviceFee, govFee, manualReview: false };
}

// ---- DQ file dual pricing (client-pricing-v2-2026-07-10.md §8/§12) ---------
// Flat totals by driver count, standalone vs in-bundle; more than 3 routes to a
// custom quote (manual path, mirroring UCR's old over-100 handling).
export const DQ_STANDALONE_TABLE: Record<1 | 2 | 3, number> = { 1: 250, 2: 450, 3: 600 };
export const DQ_BUNDLE_TABLE: Record<1 | 2 | 3, number> = { 1: 200, 2: 350, 3: 450 };

export function calculateDqFiles(
  driverCount: number | null | undefined,
  context: "standalone" | "bundle" = "standalone",
): { amount: number | null; manualReview: boolean; note: string } {
  const n = Math.max(1, Number(driverCount ?? 1) || 1);
  if (n > 3) return { amount: null, manualReview: true, note: "More than 3 drivers: custom quote" };
  const table = context === "bundle" ? DQ_BUNDLE_TABLE : DQ_STANDALONE_TABLE;
  const amount = table[n as 1 | 2 | 3];
  return { amount, manualReview: false, note: n === 1 ? "1 driver" : `${n} drivers, flat total` };
}

// ---- Four fixed bundles (client-pricing-v2-2026-07-10.md §3) ---------------
export type BundleKey =
  | "compliance-continuation-non-cdl"
  | "compliance-continuation-cdl-heavy"
  | "authority-launch-non-cdl"
  | "authority-launch-cdl-heavy";

export type BundleDef = {
  key: BundleKey;
  name: string;
  vehicleClass: "non-cdl" | "cdl-heavy";
  /** Compliance Continuation = for an existing carrier that already holds
   *  authority; Authority Launch = for a new carrier filing authority for the
   *  first time. */
  forExistingCarrier: boolean;
  whoItsFor: string;
  suggestedWording: string;
  /** Constituent billable service keys, priced at `bundlePrice`, baseline 1
   *  driver / UCR 0-2 bracket. The itemized total, rounding, final price, and
   *  public-display figures are DERIVED from this list by `getBundleBreakdown`. */
  includes: ServiceKey[];
};

export const BUNDLES: Record<BundleKey, BundleDef> = {
  "compliance-continuation-non-cdl": {
    key: "compliance-continuation-non-cdl",
    name: "Compliance Continuation — Non-CDL",
    vehicleClass: "non-cdl",
    forExistingCarrier: true,
    whoItsFor:
      "For carriers that already have their USDOT and MC authority and operate a vehicle that does not require a CDL.",
    suggestedWording:
      "Already have your authority and operate a non-CDL vehicle? Complete your BOC-3, UCR, and first Driver Qualification file in one package.",
    includes: ["boc-3", "ucr", "dq-files"],
  },
  "compliance-continuation-cdl-heavy": {
    key: "compliance-continuation-cdl-heavy",
    name: "Compliance Continuation — CDL/Heavy",
    vehicleClass: "cdl-heavy",
    forExistingCarrier: true,
    whoItsFor:
      "For carriers that already have their USDOT and MC authority and operate a qualifying heavy interstate vehicle that requires CDL compliance, IRP, and IFTA.",
    suggestedWording:
      "Already have your authority but still need CDL-driver compliance, IRP, and IFTA? Complete the remaining setup for one driver in one package.",
    includes: ["boc-3", "ucr", "clearinghouse", "consortium", "drug-test", "dq-files", "irp", "ifta"],
  },
  "authority-launch-non-cdl": {
    key: "authority-launch-non-cdl",
    name: "Authority Launch — Non-CDL",
    vehicleClass: "non-cdl",
    forExistingCarrier: false,
    whoItsFor: "For new carriers that need USDOT and MC authority and will operate a vehicle that does not require a CDL.",
    suggestedWording:
      "Starting a new authority with a non-CDL vehicle? Get your authority filings, BOC-3, UCR, and first Driver Qualification file without paying for CDL-only services.",
    includes: ["mc-authority", "boc-3", "ucr", "dq-files"],
  },
  "authority-launch-cdl-heavy": {
    key: "authority-launch-cdl-heavy",
    name: "Authority Launch — CDL/Heavy",
    vehicleClass: "cdl-heavy",
    forExistingCarrier: false,
    whoItsFor:
      "For new interstate property carriers operating a qualifying heavy vehicle or combination that requires CDL compliance, IRP, and IFTA.",
    suggestedWording:
      "Starting a new heavy interstate operation? Get authority registration, BOC-3, UCR, CDL-driver compliance, IRP setup, and IFTA setup in one package.",
    includes: ["mc-authority", "boc-3", "ucr", "clearinghouse", "consortium", "drug-test", "dq-files", "irp", "ifta"],
  },
};

export const BUNDLE_KEYS = Object.keys(BUNDLES) as BundleKey[];

export function isBundleKey(value: unknown): value is BundleKey {
  return typeof value === "string" && value in BUNDLES;
}

/** Round a bundle's itemized in-bundle total UP to the nearest $100, per §1/§3. */
function roundUpToNearestHundred(amount: number): number {
  return Math.ceil(amount / 100) * 100;
}

export type BundleLine = {
  key: ServiceKey | "ucr-gov-fee";
  label: string;
  standalone: number;
  bundle: number;
  discount: number;
};

export type BundleBreakdown = {
  key: BundleKey;
  name: string;
  /** One row per included service (plus the baked-in UCR 0-2 gov fee), at 1
   *  driver / UCR 0-2 bracket baseline. */
  lines: BundleLine[];
  /** Sum of in-bundle prices before rounding (client doc's "Itemized total",
   *  bundle-price column). */
  itemizedTotal: number;
  /** finalPrice - itemizedTotal (the client doc's "+$N" rounding line). */
  roundingAdjustment: number;
  /** The public package price: itemizedTotal rounded up to the nearest $100. */
  finalPrice: number;
  /** Sum of standalone prices for the same lines (client doc's "Standalone value"). */
  standaloneValue: number;
  /** standaloneValue - finalPrice. */
  savings: number;
  /** savings / standaloneValue * 100, rounded to one decimal. */
  discountPercent: number;
};

/** Derive a bundle's full itemized breakdown, rounding, savings, and discount
 *  percent from `SERVICES` + `UCR_BUNDLE_BASELINE_GOV_FEE` — never hardcoded,
 *  so it stays correct if a component price moves. */
export function getBundleBreakdown(key: BundleKey): BundleBreakdown {
  const def = BUNDLES[key];
  const lines: BundleLine[] = def.includes.map((svcKey) => {
    const svc = SERVICES[svcKey];
    const standalone = svc.standalonePrice ?? 0;
    const bundle = svc.bundlePrice ?? 0;
    return { key: svcKey, label: svc.bundleLabel ?? svc.name, standalone, bundle, discount: standalone - bundle };
  });
  // Every bundle includes UCR at the 0-2 government-fee bracket, baked into the
  // package price (client doc §1/§3: no separate add for a 0-2 fleet).
  lines.push({
    key: "ucr-gov-fee",
    label: "UCR government fee, 0-2 bracket",
    standalone: UCR_BUNDLE_BASELINE_GOV_FEE,
    bundle: UCR_BUNDLE_BASELINE_GOV_FEE,
    discount: 0,
  });

  const itemizedTotal = lines.reduce((sum, l) => sum + l.bundle, 0);
  const standaloneValue = lines.reduce((sum, l) => sum + l.standalone, 0);
  const finalPrice = roundUpToNearestHundred(itemizedTotal);
  const roundingAdjustment = finalPrice - itemizedTotal;
  const savings = standaloneValue - finalPrice;
  const discountPercent = standaloneValue > 0 ? Math.round((savings / standaloneValue) * 1000) / 10 : 0;

  return { key, name: def.name, lines, itemizedTotal, roundingAdjustment, finalPrice, standaloneValue, savings, discountPercent };
}

// ---- Pricing computation (server-side; display in M3, charged in M4) ------
export type PriceLine = {
  key: ServiceKey | BundleKey;
  name: string;
  /** Tech Rig service fee for this line, USD. null = quote/manual review. */
  amount: number | null;
  ucrTier: string | null;
  expectedTimeline: string;
  /** A separate government/state fee to disclose (not in the Tech Rig subtotal). */
  govFeeNote: string | null;
  manualReview: boolean;
  note: string | null;
};

export type PricingContext = {
  powerUnits?: number | null;
  driverCount?: number | null;
  /** One of the four fixed bundles, priced at in-bundle rates. Omit for a pure
   *  à la carte (standalone-priced) selection. */
  bundle?: BundleKey | null;
};

/** One filing to create on submit (M3 §9 / M3-R1 §5). Bundle constituents carry
 *  price 0 (covered by the bundle total) and in_package = true. */
export type FilingRow = {
  service_key: ServiceKey;
  service_name: string;
  price_amount: number | null;
  ucr_tier: string | null;
  status: "not_started" | "manual_review";
  expected_timeline: string | null;
  in_package: boolean;
};

export type Pricing = {
  /** Charged/display lines (a selected bundle is a single line at its final price). */
  lines: PriceLine[];
  /** One row per service to create as a filing (bundle -> its constituents). */
  filings: FilingRow[];
  /** Sum of known Tech Rig charges (bundle final price + à-la-carte fees; gov-diff not summed). */
  subtotal: number;
  total: number;
  /** True if any selected service needs a manual quote/review (LLC, UCR unknown bracket, >3 drivers). */
  hasManualReview: boolean;
};

/**
 * Compute pricing for the selected services. Tech Rig charges only (à la carte
 * service fees, always at `standalonePrice` + a selected bundle's derived final
 * price); government/state fees are disclosed per line and never summed into
 * the total (owner decision 2026-06-25: gov fees are paid by the customer
 * directly). Selecting a bundle (`ctx.bundle`) includes its constituents at
 * `bundlePrice` (no double charge); a UCR bracket above 0-2, or more than 1
 * driver, adds the government-fee / DQ difference above the bundle's baked-in
 * baseline as its own disclosed line. USDOT is free when MC authority is also
 * selected à la carte (no bundle). Informational services (eld/insurance) are
 * skipped.
 */
export function computePricing(selected: ServiceKey[], ctx: PricingContext): Pricing {
  const sel = selected.filter((k) => SERVICES[k] && !SERVICES[k].informationalOnly);
  const bundleKey = ctx.bundle ?? null;
  const bundleDef = bundleKey ? BUNDLES[bundleKey] : null;
  const breakdown = bundleKey ? getBundleBreakdown(bundleKey) : null;
  const constituents = new Set<ServiceKey>(bundleDef ? bundleDef.includes : []);
  const mcIncludesUsdot = !bundleDef && sel.includes("mc-authority") && sel.includes("usdot");
  const driverCount = Math.max(1, Number(ctx.driverCount ?? 1) || 1);
  const ucr = calculateUcr(ctx.powerUnits, bundleDef ? "bundle" : "standalone");

  const lines: PriceLine[] = [];
  const filings: FilingRow[] = [];

  if (bundleDef && breakdown) {
    lines.push({
      key: bundleDef.key,
      name: bundleDef.name,
      amount: breakdown.finalPrice,
      ucrTier: "0-2",
      expectedTimeline:
        "Each filing on its own timeline; authority activates after the 21-day protest period when MC authority is included",
      govFeeNote: null,
      manualReview: false,
      note: `Itemized $${breakdown.itemizedTotal.toLocaleString("en-US")} +$${breakdown.roundingAdjustment} rounding = $${breakdown.finalPrice.toLocaleString("en-US")}. Standalone value $${breakdown.standaloneValue.toLocaleString("en-US")}, savings $${breakdown.savings.toLocaleString("en-US")} (${breakdown.discountPercent}%).`,
    });

    // UCR bracket above 0-2: disclose the government-fee difference, never
    // charge or silently absorb it (M3-R1 §4 pattern, generalized to all bundles).
    if (ucr.manualReview) {
      lines.push({
        key: "ucr",
        name: "UCR, unknown bracket",
        amount: null,
        ucrTier: ucr.tier,
        expectedTimeline: SERVICES.ucr.expectedTimeline,
        govFeeNote: null,
        manualReview: true,
        note: "Power-unit count could not be determined; the UCR portion needs manual review.",
      });
    } else if (ucr.tier !== "0-2" && ucr.govFee != null) {
      lines.push({
        key: "ucr",
        name: "UCR government-fee difference",
        amount: null,
        ucrTier: ucr.tier,
        expectedTimeline: SERVICES.ucr.expectedTimeline,
        govFeeNote: null,
        manualReview: false,
        note: `${ucr.tier} bracket government fee is $${ucr.govFee.toLocaleString("en-US")}; $${(ucr.govFee - UCR_BUNDLE_BASELINE_GOV_FEE).toLocaleString("en-US")} above the 0-2 amount the package includes, paid separately.`,
      });
    }

    // More than 1 driver: the bundle price only covers the 1-driver baseline;
    // disclose the additional bundle-rate DQ cost as its own line (§8).
    if (driverCount > 1) {
      const dq = calculateDqFiles(driverCount, "bundle");
      if (dq.manualReview) {
        lines.push({
          key: "dq-files",
          name: "Driver qualification files, additional drivers",
          amount: null,
          ucrTier: null,
          expectedTimeline: SERVICES["dq-files"].expectedTimeline,
          govFeeNote: null,
          manualReview: true,
          note: dq.note,
        });
      } else {
        const baseline = DQ_BUNDLE_TABLE[1];
        const extra = (dq.amount ?? baseline) - baseline;
        lines.push({
          key: "dq-files",
          name: `Driver qualification files, ${driverCount} drivers total`,
          amount: extra,
          ucrTier: null,
          expectedTimeline: SERVICES["dq-files"].expectedTimeline,
          govFeeNote: null,
          manualReview: false,
          note: `Bundle total for ${driverCount} drivers is $${dq.amount}; $${extra} above the 1-driver baseline the package includes.`,
        });
      }
    }

    for (const k of bundleDef.includes) {
      filings.push({
        service_key: k,
        service_name: SERVICES[k].name,
        price_amount: 0, // covered by the bundle total
        ucr_tier: k === "ucr" ? ucr.tier : null,
        status: k === "ucr" && ucr.manualReview ? "manual_review" : "not_started",
        expected_timeline: SERVICES[k].expectedTimeline,
        in_package: true,
      });
    }
  }

  for (const key of selected) {
    const def = SERVICES[key];
    if (!def || def.informationalOnly) continue;
    if (constituents.has(key)) continue; // already in the bundle (de-dup, no double charge)

    let amount: number | null = null;
    let ucrTier: string | null = null;
    let manualReview = false;
    let note: string | null = null;

    if (def.priceKind === "flat") {
      amount = def.standalonePrice ?? null; // à la carte selections always charge standalone
      if (key === "usdot" && mcIncludesUsdot) {
        amount = 0;
        note = "Included with MC authority";
      }
    } else if (def.priceKind === "perDriver") {
      const dq = calculateDqFiles(driverCount, "standalone");
      amount = dq.amount;
      manualReview = dq.manualReview;
      note = dq.note;
    } else if (def.priceKind === "ucr") {
      const standaloneUcr = calculateUcr(ctx.powerUnits, "standalone");
      ucrTier = standaloneUcr.tier;
      amount = standaloneUcr.serviceFee;
      manualReview = standaloneUcr.manualReview;
      if (manualReview) note = "Power-unit count could not be determined; needs manual review";
      else if (standaloneUcr.govFee != null) note = `Government fee $${standaloneUcr.govFee.toLocaleString("en-US")} (${standaloneUcr.tier} bracket)`;
    } else {
      manualReview = true;
      note = "Contact for quote";
    }

    lines.push({ key, name: def.name, amount, ucrTier, expectedTimeline: def.expectedTimeline, govFeeNote: def.govFeeNote ?? null, manualReview, note });
    filings.push({
      service_key: key,
      service_name: def.name,
      price_amount: amount,
      ucr_tier: ucrTier,
      status: manualReview ? "manual_review" : "not_started",
      expected_timeline: def.expectedTimeline,
      in_package: false,
    });
  }

  const subtotal = lines.reduce((sum, l) => sum + (l.amount ?? 0), 0);
  return { lines, filings, subtotal, total: subtotal, hasManualReview: lines.some((l) => l.manualReview) };
}
