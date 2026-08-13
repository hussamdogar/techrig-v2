import "server-only";
import { service } from "@/lib/server/supabase";

/** Shared cookie name for the quick-buy fast path's lead-token handoff between
 *  the confirm screen and /api/quick-buy-checkout. See actions.ts + the
 *  checkout route for how it's set/read. */
export const QUICK_BUY_TOKEN_COOKIE = "quick_buy_token";

/**
 * The carrier's legal (or DBA) name, for admin notifications. quick_buy_orders
 * itself has no company-name column — this reads it from the immutable
 * carrier_snapshots row the original lookup wrote (lib/server/lookup-capture.ts),
 * keyed by the order's lead_id. Null if no snapshot exists (e.g. a not-found
 * lookup never wrote one).
 */
export async function getQuickBuyCompanyName(leadId: string): Promise<string | null> {
  const db = service();
  const { data } = await db
    .from("carrier_snapshots")
    .select("data_json")
    .eq("lead_id", leadId)
    .order("fetched_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  const carrier = data?.data_json as { legalName?: string | null; dbaName?: string | null } | null;
  return carrier?.legalName ?? carrier?.dbaName ?? null;
}
