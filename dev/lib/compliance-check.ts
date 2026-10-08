import type { QuickBuyServiceKey } from "@/lib/services-registry";

/**
 * Rules for the compliance check (/compliance-check/, the "Am I road-legal?"
 * wizard). Owner-defined (2026-10-08) for interstate for-hire carriers; the
 * only place that decides what a visitor is told they need, so keep every
 * requirement statement here and keep it to what the owner has confirmed.
 *
 *  - Intrastate: not served. The wizard explains and offers a call.
 *  - BOC-3 and UCR: every interstate result. UCR is required for every carrier
 *    in interstate commerce regardless of vehicle weight (weight only sets the
 *    fee bracket; plan.ucr.gov "Do I Need to Register?").
 *  - Cargo van: BOC-3 and UCR only.
 *  - Box/straight truck and non-CDL hotshot: + driver qualification files.
 *  - CDL (semi, or a hotshot over 26,000 lbs combined with a 10,000+ lb
 *    trailer): + Clearinghouse, consortium, pre-employment drug test, and
 *    IRP/IFTA, which are listed as requirements only: Tech Rig does not
 *    currently offer IRP or IFTA, so the wizard never offers to file them.
 *  - Not started (no USDOT/MC yet): + USDOT and MC authority, listed with a
 *    call-us next step (quick-buy checkout needs an existing USDOT).
 */

export type Vehicle = "van" | "straight" | "hotshot" | "semi";

export type RequirementKey =
  | "usdot"
  | "mc-authority"
  | "boc-3"
  | "ucr"
  | "dq-files"
  | "clearinghouse"
  | "consortium"
  | "drug-test"
  | "irp"
  | "ifta";

type Requirement = {
  title: string;
  why: string;
  /** Sold through /buy: shown with a checkbox and price, ticked by default. */
  quickBuy?: QuickBuyServiceKey;
  /** Not sold online: how the result describes it. */
  handling?: "call" | "not-offered";
};

export const REQUIREMENTS: Record<RequirementKey, Requirement> = {
  usdot: { title: "USDOT number", why: "Your federal carrier ID, needed before anything else.", handling: "call" },
  "mc-authority": {
    title: "MC operating authority",
    why: "Federal permission to haul freight for pay across state lines.",
    handling: "call",
  },
  "boc-3": {
    title: "BOC-3 filing",
    why: "Names a process agent in all 50 states. Your authority does not activate without it.",
    quickBuy: "boc-3",
  },
  ucr: { title: "UCR registration", why: "Annual registration for every carrier operating interstate.", quickBuy: "ucr" },
  "dq-files": {
    title: "Driver qualification files",
    why: "A qualification file for every driver of a truck over 10,000 lbs.",
    quickBuy: "dq-files",
  },
  clearinghouse: {
    title: "Clearinghouse registration",
    why: "Required for carriers that employ CDL drivers.",
    quickBuy: "clearinghouse",
  },
  consortium: {
    title: "Drug & alcohol consortium",
    why: "Random drug and alcohol testing for your CDL drivers.",
    quickBuy: "consortium",
  },
  "drug-test": {
    title: "Pre-employment drug test",
    why: "A negative result on file before a CDL driver starts.",
    handling: "call",
  },
  irp: {
    title: "IRP apportioned plates",
    why: "Plates for heavy trucks that run in more than one state.",
    handling: "not-offered",
  },
  ifta: {
    title: "IFTA fuel-tax license",
    why: "Quarterly fuel tax for heavy trucks that run in more than one state.",
    handling: "not-offered",
  },
};

/** Whether this vehicle answer means a CDL operation. A hotshot depends on the
 *  follow-up question (over 26,000 lbs combined, trailer over 10,000 lbs). */
export function isCdl(vehicle: Vehicle, hotshotHeavy: boolean | null): boolean {
  return vehicle === "semi" || (vehicle === "hotshot" && hotshotHeavy === true);
}

/** What an interstate carrier typically needs, in the order shown. */
export function requirementsFor({
  started,
  vehicle,
  cdl,
}: {
  started: boolean;
  vehicle: Vehicle;
  cdl: boolean;
}): RequirementKey[] {
  const list: RequirementKey[] = started ? [] : ["usdot", "mc-authority"];
  list.push("boc-3", "ucr");
  if (vehicle !== "van") list.push("dq-files");
  if (cdl) list.push("clearinghouse", "consortium", "drug-test", "irp", "ifta");
  return list;
}

/** Order in which ticked quick-buy items become the checkout's primary
 *  service (the rest ride along as pre-ticked add-ons). */
export const QUICK_BUY_PRIMARY_ORDER: QuickBuyServiceKey[] = ["boc-3", "ucr", "dq-files", "clearinghouse", "consortium"];
