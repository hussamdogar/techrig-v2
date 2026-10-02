import "server-only";
import { cookies } from "next/headers";
import { AD_CLICK_ID_PARAMS, adClickIdCookie, isPlausibleClickId, type AdClickIds } from "@/lib/ad-click-ids";

/**
 * The visitor's Google Ads click ids, from our own first-party cookies (set by
 * <AdClickIdCapture />). Falls back to Google's own `_gcl_aw` cookie for the
 * gclid (format "GCL.<timestamp>.<gclid>", written by GTM's conversion linker
 * on production), in case the visitor arrived before our capture existed.
 */
export async function readAdClickIds(): Promise<AdClickIds> {
  const store = await cookies();
  const ids = Object.fromEntries(
    AD_CLICK_ID_PARAMS.map((param) => {
      const value = store.get(adClickIdCookie(param))?.value ?? null;
      return [param, value && isPlausibleClickId(value) ? value : null];
    }),
  ) as AdClickIds;

  if (!ids.gclid) {
    const fromLinker = store.get("_gcl_aw")?.value.split(".").slice(2).join(".");
    if (fromLinker && isPlausibleClickId(fromLinker)) ids.gclid = fromLinker;
  }
  return ids;
}
