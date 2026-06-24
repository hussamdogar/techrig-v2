/**
 * Dual-provider USDOT lookup with failover (ADR-7, M1).
 *
 * One interface, `lookupCarrier(usdot)`, runs providers in order:
 *   1. MOTUS (primary) with a tight ~2.5s timeout
 *   2. FMCSA QCMobile (backup)
 *   3. neither answers usefully -> manual_required (hand entry)
 *
 * Each provider call is isolated: one being down (error/timeout) never takes the
 * card down. A provider returning a clean "no such carrier" is distinguished
 * from a provider being unavailable, so the status is `not_found` only when a
 * provider actually answered that the carrier does not exist. Provider + latency
 * are logged so the failover rate is observable.
 */
import type { CarrierData, LookupResult } from "./types";
import { fetchMotusCarrier } from "./motus";
import { fetchQcMobileCarrier } from "./qcmobile";

export * from "./types";
export { normalizeMotusMatrixResponse } from "./motus";
export { normalizeQcMobileResponse } from "./qcmobile";

// MOTUS is now a 3-step chain (carriers -> matrix -> per-OA getOAPublicView), and
// the lookup renders on a server page (not the inline card), so it can afford a
// larger budget than the original single card fetch.
const PRIMARY_TIMEOUT_MS = 8000;
const BACKUP_TIMEOUT_MS = 3000;

type Provider = "motus" | "qcmobile";
type Attempt = { carrier: CarrierData | null; available: boolean };

/**
 * Run one provider under a timeout. Returns the carrier (or null for a clean
 * not-found) with available=true; on any error/timeout returns available=false
 * so the orchestrator treats it as unavailable rather than not-found.
 */
async function callProvider(
  name: Provider,
  timeoutMs: number,
  fn: (signal: AbortSignal) => Promise<CarrierData | null>,
): Promise<Attempt> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const startedAt = Date.now();
  try {
    const carrier = await fn(controller.signal);
    console.log(`[lookup] ${name} ${carrier ? "hit" : "miss"} in ${Date.now() - startedAt}ms`);
    return { carrier, available: true };
  } catch (error) {
    const reason = error instanceof Error ? error.message : "unknown error";
    console.warn(`[lookup] ${name} unavailable after ${Date.now() - startedAt}ms: ${reason}`);
    return { carrier: null, available: false };
  } finally {
    clearTimeout(timer);
  }
}

export async function lookupCarrier(usdot: string): Promise<LookupResult> {
  const primary = await callProvider("motus", PRIMARY_TIMEOUT_MS, (s) => fetchMotusCarrier(usdot, s));
  if (primary.carrier) return { status: "success", carrier: primary.carrier, provider: "motus" };

  const backup = await callProvider("qcmobile", BACKUP_TIMEOUT_MS, (s) => fetchQcMobileCarrier(usdot, s));
  if (backup.carrier) return { status: "success", carrier: backup.carrier, provider: "qcmobile" };

  // No carrier from either. If a provider actually answered "not found" (it was
  // available and returned null), trust that. If both were merely unavailable,
  // the carrier may well exist, so let the user proceed by hand.
  const anyCleanNotFound = primary.available || backup.available;
  return anyCleanNotFound
    ? { status: "not_found", provider: "manual" }
    : { status: "manual_required", provider: "manual" };
}
