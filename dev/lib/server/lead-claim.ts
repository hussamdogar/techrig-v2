import "server-only";
import { cookies } from "next/headers";
import { decodeLeadAccessToken, hashAccessToken } from "@/lib/server/security";
import { service } from "@/lib/server/supabase";

/**
 * Lead → account claim (M2 §3). When an anonymous M1 lookup runs, the user can
 * choose to save it: a signed lead token is stashed in an httpOnly cookie and
 * they are sent through auth. After auth, claimPendingLead() reads that cookie,
 * verifies the token (HMAC + unexpired + stored-hash match), and assigns the
 * lead to the new user — only if it is still unclaimed. Idempotent; a lead is
 * never reassigned to a second account.
 */
export const CLAIM_COOKIE = "lead_claim_token";

export async function claimPendingLead(userId: string): Promise<void> {
  const store = await cookies();
  const token = store.get(CLAIM_COOKIE)?.value;
  if (!token) return;
  store.delete(CLAIM_COOKIE); // one-shot; clear regardless of outcome

  const decoded = decodeLeadAccessToken(token);
  if (!decoded) return;

  try {
    const db = service();
    const { data: lead } = await db
      .from("leads")
      .select("id, user_id, access_token_hash")
      .eq("id", decoded.leadId)
      .maybeSingle();

    // Missing, already claimed, or the token does not match the stored hash.
    if (!lead || lead.user_id || lead.access_token_hash !== hashAccessToken(token)) return;

    // `.is('user_id', null)` makes the assignment race-safe and non-reassigning.
    await db.from("leads").update({ user_id: userId }).eq("id", decoded.leadId).is("user_id", null);
  } catch (error) {
    console.error("lead claim skipped:", error instanceof Error ? error.message : error);
  }
}
