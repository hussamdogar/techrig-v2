/**
 * Service registry (M3) — the single typed catalog that drives pricing, the
 * dynamic stepper, and timelines. Prices come ONLY from `seo/context/services.md`
 * (the pricing source of truth); never hardcode a contradicting price.
 *
 * Compliance reframe (HARD RULE, work-order-eld-insurance.md): `eld` and
 * `insurance` are NOT billable Tech Rig filings. They appear here as
 * informational/coordination entries with NO Tech Rig price and produce no
 * priced `filings` row.
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
  | "full-package"
  | "eld"
  | "insurance";

export type ServiceDef = {
  key: ServiceKey;
  name: string;
  blurb: string;
  /** flat fee | per-driver | UCR (tiered) | quote (no auto price) | fixed package. */
  priceKind: "flat" | "perDriver" | "ucr" | "quote" | "package";
  /** Base Tech Rig service fee (USD). Omitted for ucr/quote/informational. */
  price?: number;
  /** Separate government/state fee disclosure, never blended into the fee. */
  govFeeNote?: string;
  /** Constituent services a package bundles (M3-R1). */
  includes?: ServiceKey[];
  /** Package note: which government fees the fixed price already covers. */
  govFeesIncluded?: string;
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
    price: 300,
    requiredSteps: ["carrier-identity", "business-details", "operations"],
    expectedTimeline: "Filed within 24 hours; active immediately after a successful submission",
    isNewRegistration: true,
  },
  "mc-authority": {
    key: "mc-authority",
    name: "MC operating authority",
    blurb: "Interstate for-hire authority. Includes your USDOT number.",
    priceKind: "flat",
    price: 600,
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
    price: 100,
    requiredSteps: ["carrier-identity", "service-specifics"],
    expectedTimeline: "Same business day when ordered with your information during business hours",
  },
  ucr: {
    key: "ucr",
    name: "UCR registration",
    blurb: "Unified Carrier Registration. Government fee varies by fleet bracket.",
    priceKind: "ucr",
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
    price: 125,
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
    price: 125,
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
    price: 125,
    requiredSteps: ["carrier-identity", "service-specifics"],
    expectedTimeline: "Approximately 1 to 2 weeks",
  },
  clearinghouse: {
    key: "clearinghouse",
    name: "Clearinghouse registration",
    blurb: "FMCSA Clearinghouse registration assistance for drug and alcohol records.",
    priceKind: "flat",
    price: 100,
    requiredSteps: ["carrier-identity", "drivers"],
    expectedTimeline: "Within 1 business day",
  },
  consortium: {
    key: "consortium",
    name: "Drug & alcohol consortium",
    blurb: "Consortium enrollment and random testing program management.",
    priceKind: "flat",
    price: 150,
    requiredSteps: ["carrier-identity", "drivers"],
    expectedTimeline: "Within 1 to 2 business days",
  },
  "dq-files": {
    key: "dq-files",
    name: "Driver qualification files",
    blurb: "Compliant DQ files, built and kept audit-ready. Tiered by driver count.",
    priceKind: "perDriver",
    price: 200,
    requiredSteps: ["carrier-identity", "drivers"],
    expectedTimeline: "Within 1 to 3 business days after documents are received",
  },
  "drug-test": {
    key: "drug-test",
    name: "Pre-employment drug test",
    blurb: "Pre-employment drug-test coordination.",
    priceKind: "flat",
    price: 100,
    requiredSteps: ["carrier-identity", "drivers"],
    expectedTimeline: "Scheduled after consortium enrollment, based on carrier and driver availability",
  },
  irp: {
    key: "irp",
    name: "IRP registration",
    blurb: "Apportioned plates for multi-state operation.",
    priceKind: "flat",
    price: 175,
    govFeeNote: "+ state registration fees by mileage and states, shown separately",
    requiredSteps: ["carrier-identity", "vehicles"],
    expectedTimeline: "Varies by state and document availability",
  },
  ifta: {
    key: "ifta",
    name: "IFTA registration",
    blurb: "One-time fuel-tax registration setup.",
    priceKind: "flat",
    price: 175,
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
    price: 150,
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
  // The all-in setup bundle (client answers 2026-06-25; services.md $1,700, 9
  // items). Fixed price; selecting it includes its constituents (no double-charge).
  // It folds in the MC FMCSA application fee and the UCR 0-2 government fee a
  // carrier would otherwise pay separately. Framing rule: all-in bundle, never a
  // "discount" claim (the sum of listed service fees is ~$1,650, so the only
  // saving is the included government fees, which are not published).
  "full-package": {
    key: "full-package",
    name: "Full compliance package",
    blurb:
      "MC authority and USDOT, BOC-3, UCR, Clearinghouse, consortium, the drug test, IFTA setup, IRP setup, and one DQ file, at a fixed $1,700.",
    priceKind: "package",
    price: 1700,
    includes: [
      "mc-authority",
      "boc-3",
      "ucr",
      "clearinghouse",
      "consortium",
      "drug-test",
      "ifta",
      "irp",
      "dq-files",
    ],
    govFeesIncluded: "Includes the MC FMCSA fee and the UCR 0-2 government fee, no separate add.",
    requiredSteps: [
      "carrier-identity",
      "business-details",
      "operations",
      "vehicles",
      "ucr-details",
      "service-specifics",
      "drivers",
    ],
    expectedTimeline: "Each filing on its own timeline; authority activates after the 21-day protest period",
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

// ---- UCR tiered pricing (services.md: service fee $50 + gov fee by bracket) ----
// The Tech Rig service fee is a flat $50; the GOVERNMENT fee depends on the
// power-unit bracket and is disclosed separately, never blended. >100 units is
// manual review (no auto price) per the work order.
export type UcrResult = {
  tier: string;
  serviceFee: number | null; // Tech Rig fee; null when manual review
  govFee: number | null; // government fee for the bracket
  manualReview: boolean;
};

export function calculateUcr(powerUnits: number | null | undefined): UcrResult {
  const n = powerUnits == null || !Number.isFinite(powerUnits) ? null : Number(powerUnits);
  if (n == null || n < 0) return { tier: "unknown", serviceFee: null, govFee: null, manualReview: true };
  if (n <= 2) return { tier: "0-2", serviceFee: 50, govFee: 46, manualReview: false };
  if (n <= 5) return { tier: "3-5", serviceFee: 50, govFee: 138, manualReview: false };
  if (n <= 20) return { tier: "6-20", serviceFee: 50, govFee: 276, manualReview: false };
  if (n <= 100) return { tier: "21-100", serviceFee: 50, govFee: 963, manualReview: false };
  return { tier: "101+", serviceFee: null, govFee: null, manualReview: true }; // >100 = manual
}

// ---- DQ file tiered pricing (client answers 2026-06-25) ----
// Flat totals by driver count: 1 = $200, 2 = $350, 3 = $450; more than 3 routes
// to a custom quote (manual path, mirroring UCR over 100 units). Drives the
// `perDriver` priceKind, which only `dq-files` uses.
export function calculateDqFiles(driverCount: number | null | undefined): {
  amount: number | null;
  manualReview: boolean;
  note: string;
} {
  const n = Math.max(1, Number(driverCount ?? 1) || 1);
  if (n === 1) return { amount: 200, manualReview: false, note: "1 driver" };
  if (n === 2) return { amount: 350, manualReview: false, note: "2 drivers, flat total" };
  if (n === 3) return { amount: 450, manualReview: false, note: "3 drivers, flat total" };
  return { amount: null, manualReview: true, note: "More than 3 drivers: custom quote" };
}

// ---- Pricing computation (server-side; display in M3, charged in M4) ----
export type PriceLine = {
  key: ServiceKey;
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

export type PricingContext = { powerUnits?: number | null; driverCount?: number | null };

/** One filing to create on submit (M3 §9 / M3-R1 §5). Package constituents carry
 *  price 0 (covered by the package total) and in_package = true. */
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
  /** Charged/display lines (the package is a single $1,700 line). */
  lines: PriceLine[];
  /** One row per service to create as a filing (package -> its constituents). */
  filings: FilingRow[];
  /** Sum of known Tech Rig charges (package + à-la-carte fees; gov-diff not summed). */
  subtotal: number;
  total: number;
  /** True if any selected service needs a manual quote/review (LLC, UCR 101+). */
  hasManualReview: boolean;
};

/**
 * Compute pricing for the selected services. Tech Rig charges only (service fees +
 * the fixed package price); government/state fees are disclosed per line and never
 * summed into the total (owner decision 2026-06-25: à-la-carte gov fees are paid
 * by the customer directly). Selecting the full-package includes its constituents
 * at the fixed $1,700 (no double charge); a UCR bracket above 0-2 shows the
 * government-fee difference separately. USDOT is free when MC authority is also
 * selected. Informational services (eld/insurance) are skipped.
 */
export function computePricing(selected: ServiceKey[], ctx: PricingContext): Pricing {
  const sel = selected.filter((k) => SERVICES[k] && !SERVICES[k].informationalOnly);
  const hasPackage = sel.includes("full-package");
  const pkg = SERVICES["full-package"];
  const constituents = new Set<ServiceKey>(hasPackage ? pkg.includes ?? [] : []);
  const mcIncludesUsdot = !hasPackage && sel.includes("mc-authority") && sel.includes("usdot");
  const driverCount = Math.max(1, Number(ctx.driverCount ?? 1) || 1);
  const ucr = calculateUcr(ctx.powerUnits);

  const lines: PriceLine[] = [];
  const filings: FilingRow[] = [];

  if (hasPackage) {
    lines.push({
      key: "full-package",
      name: pkg.name,
      amount: pkg.price ?? 1700,
      ucrTier: "0-2",
      expectedTimeline: pkg.expectedTimeline,
      govFeeNote: pkg.govFeesIncluded ?? null,
      manualReview: false,
      note: "Includes MC authority and USDOT, BOC-3, UCR (0-2), Clearinghouse, consortium, the drug test, IFTA setup, IRP setup, and one DQ file",
    });
    // UCR bracket above 0-2: disclose the government-fee difference, never charge
    // or silently absorb it (M3-R1 §4).
    if (ucr.manualReview) {
      lines.push({
        key: "ucr",
        name: "UCR, over 100 units",
        amount: null,
        ucrTier: ucr.tier,
        expectedTimeline: SERVICES.ucr.expectedTimeline,
        govFeeNote: null,
        manualReview: true,
        note: "Over 100 power units: the UCR portion is reviewed manually.",
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
        note: `${ucr.tier} bracket government fee is $${ucr.govFee}; $${ucr.govFee - 46} above the 0-2 amount the package includes, paid separately.`,
      });
    }
    for (const k of pkg.includes ?? []) {
      filings.push({
        service_key: k,
        service_name: SERVICES[k].name,
        price_amount: 0, // covered by the package total
        ucr_tier: k === "ucr" ? ucr.tier : null,
        status: k === "ucr" && ucr.manualReview ? "manual_review" : "not_started",
        expected_timeline: SERVICES[k].expectedTimeline,
        in_package: true,
      });
    }
  }

  for (const key of selected) {
    if (key === "full-package") continue;
    const def = SERVICES[key];
    if (!def || def.informationalOnly) continue;
    if (constituents.has(key)) continue; // already in the package (de-dup, no double charge)

    let amount: number | null = null;
    let ucrTier: string | null = null;
    let manualReview = false;
    let note: string | null = null;

    if (def.priceKind === "flat") {
      amount = def.price ?? null;
      if (key === "usdot" && mcIncludesUsdot) {
        amount = 0;
        note = "Included with MC authority";
      }
    } else if (def.priceKind === "perDriver") {
      const dq = calculateDqFiles(driverCount);
      amount = dq.amount;
      manualReview = dq.manualReview;
      note = dq.note;
    } else if (def.priceKind === "ucr") {
      ucrTier = ucr.tier;
      amount = ucr.serviceFee;
      manualReview = ucr.manualReview;
      if (manualReview) note = "Manual review (over 100 power units)";
      else if (ucr.govFee != null) note = `Government fee $${ucr.govFee} (${ucr.tier} bracket)`;
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
