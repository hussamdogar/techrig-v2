import { remainingQuickBuyUpsells, type QuickBuyServiceKey } from "@/lib/services-registry";

/**
 * Rules shared by the one-screen quick-buy checkout (/buy/<service>/<usdot>/,
 * shared/design/quick-buy-checkout-v2.md): the client form validates and
 * picks add-ons with these, and the server action re-checks with the same
 * functions, so the two can never disagree. No server-only imports.
 */

// ---- Validation -------------------------------------------------------------

/** The checkout's fields, in form order (top to bottom). The first invalid
 *  one in this order is the one the form scrolls to. */
export const CHECKOUT_FIELDS = ["first", "last", "email", "phone", "sign", "agree"] as const;
export type CheckoutField = (typeof CHECKOUT_FIELDS)[number];

export type CheckoutValues = {
  first: string;
  last: string;
  email: string;
  phone: string;
  sign: string;
  agree: boolean;
};

export type CheckoutErrors = Partial<Record<CheckoutField, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function phoneDigits(value: string): string {
  const digits = value.replace(/\D/g, "");
  // A leading country code 1 is dropped, so "+1 555..." counts as 10 digits.
  return digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
}

/** (XXX) XXX-XXXX as the visitor types; leaves anything longer untouched. */
export function formatUsPhone(value: string): string {
  const d = phoneDigits(value);
  if (d.length > 10) return value;
  if (d.length <= 3) return d;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

/** Error message for one field, or null when it's valid. */
export function checkField(field: CheckoutField, v: CheckoutValues): string | null {
  switch (field) {
    case "first":
      return v.first.trim() ? null : "Enter your first name.";
    case "last":
      return v.last.trim() ? null : "Enter your last name.";
    case "email":
      if (!v.email.trim()) return "Enter your email so we can send your receipt.";
      return EMAIL_RE.test(v.email.trim()) ? null : "Enter an email like name@example.com.";
    case "phone":
      return !v.phone.trim() || phoneDigits(v.phone).length === 10
        ? null
        : "Enter a 10-digit US phone number, or leave it blank.";
    case "sign":
      return (v.sign.match(/\p{L}/gu) ?? []).length >= 2 ? null : "Type your full legal name to sign.";
    case "agree":
      return v.agree ? null : "Check the box to authorize this filing.";
  }
}

export function validateCheckout(v: CheckoutValues): CheckoutErrors {
  const errors: CheckoutErrors = {};
  for (const field of CHECKOUT_FIELDS) {
    const message = checkField(field, v);
    if (message) errors[field] = message;
  }
  return errors;
}

/** Common email-domain typos, offered as "Did you mean ...?", never applied
 *  silently. */
const EMAIL_DOMAIN_TYPOS: Record<string, string> = {
  "gmial.com": "gmail.com",
  "gamil.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gmail.co": "gmail.com",
  "gmail.con": "gmail.com",
  "gnail.com": "gmail.com",
  "yahooo.com": "yahoo.com",
  "yaho.com": "yahoo.com",
  "yahoo.co": "yahoo.com",
  "hotmial.com": "hotmail.com",
  "hotmail.co": "hotmail.com",
  "outlok.com": "outlook.com",
  "outlook.co": "outlook.com",
  "icloud.co": "icloud.com",
};

export function suggestEmail(email: string): string | null {
  const value = email.trim();
  const at = value.lastIndexOf("@");
  if (at < 1) return null;
  const fix = EMAIL_DOMAIN_TYPOS[value.slice(at + 1).toLowerCase()];
  return fix ? `${value.slice(0, at + 1)}${fix}` : null;
}

// ---- Add-ons ----------------------------------------------------------------

/** Display order for add-ons, wherever they appear. */
const ADD_ON_ORDER: QuickBuyServiceKey[] = ["ucr", "boc-3", "dq-files", "consortium", "clearinghouse"];

/** What this carrier can add to an order for `primary`, in display order.
 *  Same eligibility as checkout and the thank-you page
 *  (remainingQuickBuyUpsells): Clearinghouse and Consortium only with truck
 *  tractors, never the service being bought, and never anything in
 *  `alreadyOrdered` (a paid order this checkout was opened from). */
export function checkoutAddOns(
  primary: QuickBuyServiceKey,
  truckTractors: number | null,
  alreadyOrdered: readonly string[] = [],
): QuickBuyServiceKey[] {
  const eligible = new Set(remainingQuickBuyUpsells(truckTractors, [primary, ...alreadyOrdered]));
  return ADD_ON_ORDER.filter((k) => eligible.has(k));
}

/** The one add-on shown before "More services" is opened (spec §4C): UCR,
 *  unless UCR is the order; then BOC-3 if FMCSA shows none on file, else
 *  Consortium for a CDL carrier, else DQ files. */
export function featuredAddOn(
  primary: QuickBuyServiceKey,
  addOns: QuickBuyServiceKey[],
  { boc3OnFile, cdl }: { boc3OnFile: boolean; cdl: boolean },
): QuickBuyServiceKey | null {
  const pick: QuickBuyServiceKey =
    primary !== "ucr" ? "ucr" : !boc3OnFile ? "boc-3" : cdl ? "consortium" : "dq-files";
  return addOns.includes(pick) ? pick : (addOns[0] ?? null);
}

/** One-line "why you need this" under each add-on (owner-approved copy,
 *  2026-10-13; spec §9). */
export function addOnDescription(key: QuickBuyServiceKey, { boc3OnFile }: { boc3OnFile: boolean }): string {
  switch (key) {
    case "ucr":
      return "Required every year to cross state lines. Running without it can mean fines at roadside inspections.";
    case "boc-3":
    case "boc-3-b":
      return boc3OnFile
        ? "FMCSA already shows a BOC-3 for you. Only needed if you are switching process agents."
        : "FMCSA shows no BOC-3 on file for you. Your authority cannot go active without one.";
    case "dq-files":
      return "Needed for owner-operators and drivers both. A missing file is one of the first things auditors flag, and it can cost you your authority.";
    case "consortium":
      return "Enrollment in a random drug and alcohol testing pool for CDL drivers.";
    case "clearinghouse":
      return "Employer setup in the FMCSA Drug and Alcohol Clearinghouse.";
  }
}

/** Short names for the closed "More services" button's second line. */
export const ADD_ON_SHORT_NAME: Record<QuickBuyServiceKey, string> = {
  ucr: "UCR",
  "boc-3": "BOC-3",
  "boc-3-b": "BOC-3",
  "dq-files": "DQ files",
  consortium: "Drug & alcohol consortium",
  clearinghouse: "Clearinghouse",
};

/** Thank-you page descriptions for filings still open after an order
 *  (owner-approved, 2026-10-22): the consequence first, then a short
 *  definition. Stated as general rules, never as "you are missing this". */
export const THANK_YOU_FILING_DESCRIPTION: Record<QuickBuyServiceKey, string> = {
  "boc-3": "No BOC-3, no active authority. It names your process agent in every state.",
  "boc-3-b": "No BOC-3, no active authority. It names your process agent in every state.",
  ucr: "Running without UCR can mean fines at roadside inspections. The yearly registration for crossing state lines.",
  clearinghouse:
    "Skipping driver queries is an audit violation. Your employer account in FMCSA's drug and alcohol database.",
  consortium: "CDL drivers can't legally drive without a testing program. Your random drug and alcohol testing pool.",
  "dq-files":
    "A missing file is one of the first things auditors flag. Your driver's required qualification record, owner-operators included.",
};

