import { isQuickBuyServiceKey, type QuickBuyServiceKey } from "@/lib/services-registry";

/**
 * Pre-selected add-ons for a quick-buy order, carried in the URL as
 * `?add=ucr,dq-files` (comma-separated quick-buy service keys).
 *
 * Set by the compliance check (/compliance-check/), which sends a visitor to
 * /buy/<first item>/ with the rest of their checklist as add-ons. The param is
 * carried through the entry screen and the USDOT confirm screen, then saved as
 * the order's additional_service_keys, which the review screen already shows
 * ticked (and the visitor can still untick).
 *
 * Only ever a suggestion: keys are validated here, and the confirm action
 * keeps only add-ons that order is actually allowed to offer
 * (remainingQuickBuyUpsells), so a crafted URL can't add anything the review
 * screen wouldn't list. Shared by client and server code.
 */
export function parsePreselectedAddOns(raw: unknown, primary: string): QuickBuyServiceKey[] {
  if (typeof raw !== "string" || !raw) return [];
  const keys = raw
    .split(",")
    .map((k) => k.trim())
    .filter((k): k is QuickBuyServiceKey => isQuickBuyServiceKey(k) && k !== primary && k !== "boc-3-b");
  return Array.from(new Set(keys));
}

/** `?add=...` query string for a URL, or "" when there is nothing to carry. */
export function preselectQuery(keys: readonly string[], prefix: "?" | "&" = "?"): string {
  return keys.length ? `${prefix}add=${encodeURIComponent(keys.join(","))}` : "";
}
