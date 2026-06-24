import { randomUUID } from "node:crypto";
import { lookupCarrier } from "@/lib/lookup";
import { checkRateLimit, createLeadAccessToken, hashAccessToken, isValidUsdot } from "@/lib/server/security";
import { nextReferenceId } from "@/lib/server/reference";
import { service } from "@/lib/server/supabase";

/**
 * POST /api/lookup-usdot  (Application Platform M1)
 *
 * Validates a USDOT, rate-limits per IP, runs the dual-provider lookup
 * (MOTUS -> QCMobile -> manual), captures the lookup as a lead, and stores the
 * immutable carrier snapshot. Returns the normalized carrier for the hero card.
 *
 * The DB writes are best-effort: a missing-credential or DB error is logged and
 * the carrier is still returned, so the lookup card keeps working even before
 * the live Supabase/KV env is wired. No PII or raw token is ever logged.
 * The whole platform is noindex (ADR-5); this route sets X-Robots-Tag: noindex.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NOINDEX = { "X-Robots-Tag": "noindex" } as const;

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: NOINDEX });
}

export async function POST(request: Request) {
  // Rate limit: 20 lookups / 15 min / IP (architecture §7), KV with fallback.
  const allowed = await checkRateLimit({
    headers: request.headers,
    key: "lookup-usdot",
    limit: 20,
    windowMs: 15 * 60 * 1000,
  });
  if (!allowed) {
    return json({ status: "error", message: "Too many lookups. Please wait a few minutes and try again." }, 429);
  }

  let usdotNumber: unknown;
  try {
    usdotNumber = (await request.json())?.usdotNumber;
  } catch {
    return json({ status: "error", message: "Invalid request body." }, 400);
  }

  const usdot = String(usdotNumber || "").trim();
  if (!isValidUsdot(usdot)) {
    return json({ status: "error", message: "USDOT number must contain digits only." }, 400);
  }

  // Run the lookup first (works without DB/KV); capture as a lead after.
  let result;
  try {
    result = await lookupCarrier(usdot);
  } catch (error) {
    console.error("lookup failed:", error instanceof Error ? error.message : error);
    return json({ status: "error", message: "Lookup is temporarily unavailable. Try again in a moment." }, 502);
  }

  const leadId = randomUUID();
  const referenceId = await nextReferenceId();
  const token = createLeadAccessToken({ leadId, referenceId });

  // Best-effort persistence (lead always; snapshot only when a carrier resolved).
  try {
    const db = service();
    await db.from("leads").insert({
      id: leadId,
      usdot_number: usdot,
      source: "hero_lookup",
      lookup_status: result.status,
      reference_id: referenceId,
      access_token_hash: hashAccessToken(token),
    });
    if (result.carrier) {
      await db.from("carrier_snapshots").insert({
        lead_id: leadId,
        usdot_number: usdot,
        data_json: result.carrier,
        source: result.provider,
      });
    }
  } catch (error) {
    console.error("lead/snapshot persistence skipped:", error instanceof Error ? error.message : error);
  }

  if (result.status === "success") {
    return json({ status: "success", carrier: result.carrier, referenceId, token });
  }
  if (result.status === "not_found") {
    return json({ status: "not_found", referenceId });
  }
  return json({ status: "manual_required", referenceId, token });
}
