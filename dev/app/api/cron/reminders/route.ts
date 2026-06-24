import { service } from "@/lib/server/supabase";
import { stripe } from "@/lib/stripe";
import { createLeadAccessToken } from "@/lib/server/security";
import { sendEmail } from "@/lib/email/send";
import { reminder24hEmail, reminder72hEmail } from "@/lib/email/templates";
import { site } from "@/lib/site";

/**
 * GET /api/cron/reminders  (M6). Vercel cron (vercel.json, 0 22 * * *). Guarded by
 * CRON_SECRET (Vercel sends `Authorization: Bearer ${CRON_SECRET}`). Sends the 24h
 * (transactional) and 72h (promotional + coupon) reminders to unpaid leads past
 * each threshold whose reminder timestamp is still null, batched, and never to a
 * paid lead. Each send stamps its timestamp so reruns are no-ops. The 72h send
 * respects the email_opt_out suppression flag (CAN-SPAM).
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BATCH = 50;
const RESUME_URL = `${site.url}/dashboard/`;

/** Of these candidate lead ids, which already have a PAID application (to skip). */
async function paidLeadIds(ids: string[]): Promise<Set<string>> {
  if (!ids.length) return new Set();
  const { data } = await service().from("applications").select("lead_id").in("lead_id", ids).eq("status", "paid");
  return new Set((data ?? []).map((r) => r.lead_id));
}

async function issueCoupon(ref: string): Promise<string | null> {
  try {
    // The coupon id is the stored code; checkout applies it server-side later.
    const coupon = await stripe().coupons.create({ percent_off: 10, duration: "once", name: `Reminder ${ref}`.slice(0, 40) });
    return coupon.id;
  } catch (e) {
    console.error("coupon issue failed:", e instanceof Error ? e.message : "error");
    return null;
  }
}

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const db = service();
  const now = Date.now();
  const h24 = new Date(now - 24 * 3600 * 1000).toISOString();
  const h72 = new Date(now - 72 * 3600 * 1000).toISOString();
  const result = { reminders24h: 0, reminders72h: 0 };

  // 24h reminder (transactional, no coupon).
  const { data: c24 } = await db
    .from("leads")
    .select("id, email, reference_id")
    .lt("created_at", h24)
    .is("reminder_24h_sent_at", null)
    .not("email", "is", null)
    .limit(BATCH);
  const cand24 = c24 ?? [];
  const paid24 = await paidLeadIds(cand24.map((l) => l.id));
  for (const lead of cand24) {
    if (paid24.has(lead.id)) continue;
    await db.from("leads").update({ reminder_24h_sent_at: new Date().toISOString() }).eq("id", lead.id);
    await sendEmail({ to: lead.email, email: reminder24hEmail({ referenceId: lead.reference_id ?? "", resumeUrl: RESUME_URL }) });
    result.reminders24h += 1;
  }

  // 72h reminder (promotional: opt-out excluded, coupon issued, CAN-SPAM footer).
  const { data: c72 } = await db
    .from("leads")
    .select("id, email, reference_id")
    .lt("created_at", h72)
    .is("reminder_72h_sent_at", null)
    .not("email", "is", null)
    .eq("email_opt_out", false)
    .limit(BATCH);
  const cand72 = c72 ?? [];
  const paid72 = await paidLeadIds(cand72.map((l) => l.id));
  for (const lead of cand72) {
    if (paid72.has(lead.id)) continue;
    const code = await issueCoupon(lead.reference_id ?? lead.id);
    if (!code) continue; // never send a promo without a code; retried next run
    const token = createLeadAccessToken({ leadId: lead.id, ttlMs: 30 * 24 * 3600 * 1000 });
    const unsubscribeUrl = `${site.url}/unsubscribe/?token=${encodeURIComponent(token)}`;
    await db.from("leads").update({ reminder_72h_sent_at: new Date().toISOString(), coupon_code: code }).eq("id", lead.id);
    await sendEmail({ to: lead.email, email: reminder72hEmail({ referenceId: lead.reference_id ?? "", resumeUrl: RESUME_URL, couponCode: code, unsubscribeUrl }) });
    result.reminders72h += 1;
  }

  return Response.json(result, { headers: { "X-Robots-Tag": "noindex" } });
}
