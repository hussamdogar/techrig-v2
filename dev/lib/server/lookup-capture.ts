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
import { checkRateLimit, createLeadAccessToken, hashAccessToken, isValidUsdot } from "@/lib/server/security";
import { nextReferenceId } from "@/lib/server/reference";
import { service } from "@/lib/server/supabase";

/** Minimal header accessor: satisfied by both `Headers` and Next's ReadonlyHeaders. */
export type HeaderGetter = { get(name: string): string | null };

export type CaptureResult =
  | { kind: "invalid" }
  | { kind: "rate_limited" }
  | { kind: "lookup_error" }
  | { kind: "done"; result: LookupResult; referenceId: string; token: string };

const RATE = { limit: 20, windowMs: 15 * 60 * 1000 } as const;

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

  let result: LookupResult;
  try {
    result = await lookupCarrier(cleaned);
  } catch (error) {
    console.error("lookup failed:", error instanceof Error ? error.message : error);
    return { kind: "lookup_error" };
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

  return { kind: "done", result, referenceId, token };
}
