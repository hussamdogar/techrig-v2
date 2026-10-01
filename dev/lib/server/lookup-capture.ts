/**
 * Shared lookup-and-capture path (M1 R1). One implementation used by BOTH the
 * `/lookup/[usdot]/` results page (server component) and the `/api/lookup-usdot`
 * POST route, so the validation, rate-limit, dual-provider lookup, reference +
 * token, and lead/snapshot capture never diverge between them.
 *
 * The DB writes are best-effort: a missing-credential or DB error is logged and
 * the lookup result is still returned, so the page/route keep working before the
 * live Supabase/KV env is wired. No PII or raw token is ever logged.
 */
import "server-only";
import { randomUUID } from "node:crypto";
import { lookupCarrier, type LookupResult } from "@/lib/lookup";
import { checkRateLimit, createLeadAccessToken, hashAccessToken, hashVisitor, isValidUsdot } from "@/lib/server/security";
import { nextReferenceId } from "@/lib/server/reference";
import { service } from "@/lib/server/supabase";
import { readAdClickIds } from "@/lib/server/ad-click-ids";

/** Minimal header accessor: satisfied by both `Headers` and Next's ReadonlyHeaders. */
export type HeaderGetter = { get(name: string): string | null };

export type CaptureResult =
  | { kind: "invalid" }
  | { kind: "rate_limited" }
  | { kind: "lookup_error" }
  /** `reused`: the same visitor looked up the same USDOT within
   *  REUSE_WINDOW_MS (a reload, or an error redirect back to the confirm
   *  screen), so the existing lead was reused instead of a new one being
   *  created. Callers skip "new lead" side effects (admin alert, conversion
   *  event) when it's true. */
  | { kind: "done"; result: LookupResult; referenceId: string; token: string; reused: boolean };

const RATE = { limit: 20, windowMs: 15 * 60 * 1000 } as const;
const REUSE_WINDOW_MS = 30 * 60 * 1000;

/** This visitor's lead for this USDOT from the last REUSE_WINDOW_MS, if any. */
async function findRecentLead(usdot: string, visitorHash: string): Promise<{ id: string; reference_id: string } | null> {
  try {
    const { data } = await service()
      .from("leads")
      .select("id, reference_id")
      .eq("usdot_number", usdot)
      .eq("visitor_hash", visitorHash)
      .gte("created_at", new Date(Date.now() - REUSE_WINDOW_MS).toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    return data?.reference_id ? data : null;
  } catch {
    return null; // best-effort: on any DB error, fall back to a new lead
  }
}

export async function performLookup(usdot: string, headers: HeaderGetter): Promise<CaptureResult> {
  const cleaned = String(usdot || "").trim();
  if (!isValidUsdot(cleaned)) return { kind: "invalid" };

  const allowed = await checkRateLimit({
    headers,
    key: "lookup-usdot",
    limit: RATE.limit,
    windowMs: RATE.windowMs,
  });
  if (!allowed) return { kind: "rate_limited" };

  // Reload / error-redirect dedupe: check for this visitor's recent lead for
  // the same USDOT CONCURRENTLY with the FMCSA/MOTUS call (no added latency).
  // A new reference id is only reserved when there isn't one to reuse, so
  // reloads don't burn reference numbers either.
  const visitorHash = hashVisitor(headers);
  const recentLeadPromise = findRecentLead(cleaned, visitorHash);

  let result: LookupResult;
  try {
    result = await lookupCarrier(cleaned);
  } catch (error) {
    console.error("lookup failed:", error instanceof Error ? error.message : error);
    return { kind: "lookup_error" };
  }

  const recent = await recentLeadPromise;
  if (recent) {
    // Same lead, fresh token. The stored hash moves to the new token, since
    // this render's token is the one the confirm form will carry forward
    // (lead-claim matches the latest hash).
    const token = createLeadAccessToken({ leadId: recent.id, referenceId: recent.reference_id });
    try {
      await service().from("leads").update({ access_token_hash: hashAccessToken(token) }).eq("id", recent.id);
    } catch (error) {
      console.error("lead token refresh skipped:", error instanceof Error ? error.message : error);
    }
    return { kind: "done", result, referenceId: recent.reference_id, token, reused: true };
  }

  const leadId = randomUUID();
  const referenceId = await nextReferenceId();
  const token = createLeadAccessToken({ leadId, referenceId });

  // Best-effort persistence (lead always; snapshot only when a carrier resolved).
  try {
    const db = service();
    await db.from("leads").insert({
      id: leadId,
      usdot_number: cleaned,
      source: "hero_lookup",
      lookup_status: result.status,
      reference_id: referenceId,
      access_token_hash: hashAccessToken(token),
      visitor_hash: visitorHash,
      // The Google Ads click that brought this visitor, if any, so a sale
      // closed later by phone/follow-up can be uploaded against it.
      ...(await readAdClickIds()),
    });
    if (result.carrier) {
      await db.from("carrier_snapshots").insert({
        lead_id: leadId,
        usdot_number: cleaned,
        data_json: result.carrier,
        source: result.provider,
      });
    }
  } catch (error) {
    console.error("lead/snapshot persistence skipped:", error instanceof Error ? error.message : error);
  }

  return { kind: "done", result, referenceId, token, reused: false };
}
