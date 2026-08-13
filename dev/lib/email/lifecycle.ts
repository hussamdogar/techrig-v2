import "server-only";
import { service } from "@/lib/server/supabase";
import { sendEmail, type SendAttachment } from "@/lib/email/send";
import { site } from "@/lib/site";
import { getQuickBuyCompanyName } from "@/lib/server/quick-buy";
import { findPaymentByIntent } from "@/lib/server/payments";
import {
  welcomeEmail,
  receiptEmail,
  finalEmail,
  statusChangeEmail,
  reminder24hEmail,
  reminder72hEmail,
  adminQuickBuyLookupEmail,
  adminQuickBuyPaymentStepEmail,
  adminQuickBuyPaidEmail,
  quickBuyReceiptEmail,
} from "@/lib/email/templates";
import { STATUS_COPY, isFilingStatus } from "@/lib/apply/filing-status";

/** Resolves the recipient for the three quick-buy admin alerts below. See the
 *  LAUNCH TODO on sendQuickBuyLookupAdminAlert for why this isn't just
 *  site.email yet. */
function adminAlertRecipient(): string {
  return process.env.ADMIN_EMAIL || site.email;
}

/**
 * Lifecycle orchestration (M6). Each function is idempotent: it stamps a
 * `*_sent_at` (or relies on the per-event guard) so a repeat is a no-op. All reads
 * use the service role. Resolves the owner email from auth; never logs PII.
 */
async function userEmail(userId: string | null | undefined): Promise<string | null> {
  if (!userId) return null;
  const { data } = await service().auth.admin.getUserById(userId);
  return data.user?.email ?? null;
}

/** Welcome on a lead that has an email + has not been welcomed. */
export async function sendWelcomeIfNeeded(leadId: string, fallbackEmail?: string | null): Promise<{ sent: boolean }> {
  const db = service();
  const { data: lead } = await db
    .from("leads")
    .select("id, email, user_id, reference_id, welcome_email_sent_at")
    .eq("id", leadId)
    .maybeSingle();
  if (!lead || lead.welcome_email_sent_at) return { sent: false };
  const to = lead.email ?? (await userEmail(lead.user_id)) ?? fallbackEmail ?? null;
  if (!to) return { sent: false };

  // Stamp first so concurrent runs don't double-send; the send itself is best-effort.
  await db.from("leads").update({ welcome_email_sent_at: new Date().toISOString() }).eq("id", leadId);
  await sendEmail({ to, email: welcomeEmail({ referenceId: lead.reference_id ?? "" }) });
  return { sent: true };
}

/** Payment receipt on a paid payment that has not had its receipt sent. */
export async function sendReceiptIfNeeded(paymentIntentId: string): Promise<{ sent: boolean }> {
  const db = service();
  // findPaymentByIntent, not .maybeSingle(): see lib/server/payments.ts.
  const payment = (await findPaymentByIntent(paymentIntentId, "id, application_id, amount, receipt_sent_at")) as {
    id: string;
    application_id: string;
    amount: number;
    receipt_sent_at: string | null;
  } | null;
  if (!payment || payment.receipt_sent_at) return { sent: false };

  const { data: app } = await db
    .from("applications")
    .select("user_id, reference_id")
    .eq("id", payment.application_id)
    .maybeSingle();
  const to = await userEmail(app?.user_id);
  if (!to) return { sent: false };

  const { data: filings } = await db.from("filings").select("service_name").eq("application_id", payment.application_id);
  await db.from("payments").update({ receipt_sent_at: new Date().toISOString() }).eq("id", payment.id);
  await sendEmail({
    to,
    email: receiptEmail({
      referenceId: app?.reference_id ?? "",
      amount: Number(payment.amount),
      services: (filings ?? []).map((f) => f.service_name),
    }),
  });
  return { sent: true };
}

/** Payment receipt on a paid quick-buy order that has not had its receipt
 *  sent. Uses quickBuyReceiptEmail (not the generic receiptEmail /apply uses):
 *  the owner wants company name + USDOT only (no full carrier docket), a
 *  price + "what to expect next" line per purchased service, and the order
 *  total. Recipient comes from the order's own `email` field (confirmed on
 *  the quick-buy screen) since there is no auth user. */
export async function sendQuickBuyReceiptIfNeeded(paymentIntentId: string): Promise<{ sent: boolean }> {
  const db = service();
  // findPaymentByIntent, not .maybeSingle(): see lib/server/payments.ts.
  const payment = (await findPaymentByIntent(paymentIntentId, "id, quick_buy_order_id, amount, receipt_sent_at")) as {
    id: string;
    quick_buy_order_id: string | null;
    amount: number;
    receipt_sent_at: string | null;
  } | null;
  if (!payment || payment.receipt_sent_at || !payment.quick_buy_order_id) return { sent: false };

  const { data: order } = await db
    .from("quick_buy_orders")
    .select("email, reference_id, usdot_number, lead_id")
    .eq("id", payment.quick_buy_order_id)
    .maybeSingle();
  const to = order?.email ?? null;
  if (!to || !order) return { sent: false };

  const { data: filings } = await db
    .from("filings")
    .select("service_key, service_name, price_amount")
    .eq("quick_buy_order_id", payment.quick_buy_order_id);
  const companyName = await getQuickBuyCompanyName(order.lead_id);
  await db.from("payments").update({ receipt_sent_at: new Date().toISOString() }).eq("id", payment.id);
  await sendEmail({
    to,
    email: quickBuyReceiptEmail({
      referenceId: order.reference_id ?? "",
      companyName,
      usdot: order.usdot_number,
      amount: Number(payment.amount),
      filings: (filings ?? []).map((f) => ({ serviceKey: f.service_key, serviceName: f.service_name, priceAmount: f.price_amount })),
    }),
  });
  return { sent: true };
}

/** Status-change email for a quick-buy order's filing (no auth user; recipient
 *  comes from quick_buy_orders.email). Mirrors sendStatusChangeEmail. */
export async function sendQuickBuyStatusChangeEmail(
  quickBuyOrderId: string,
  serviceName: string,
  toStatus: string,
): Promise<void> {
  if (!CLIENT_RELEVANT.has(toStatus) || !isFilingStatus(toStatus)) return;
  const db = service();
  const { data: order } = await db
    .from("quick_buy_orders")
    .select("email, reference_id")
    .eq("id", quickBuyOrderId)
    .maybeSingle();
  const to = order?.email ?? null;
  if (!to) return;
  await sendEmail({
    to,
    email: statusChangeEmail({
      referenceId: order?.reference_id ?? "",
      serviceName,
      statusLabel: STATUS_COPY[toStatus].label,
      statusMeaning: STATUS_COPY[toStatus].meaning,
    }),
  });
}

/** Status-change email for client-relevant filing transitions only. */
const CLIENT_RELEVANT = new Set(["filed", "active", "completed", "awaiting_info"]);
export async function sendStatusChangeEmail(applicationId: string, serviceName: string, toStatus: string): Promise<void> {
  if (!CLIENT_RELEVANT.has(toStatus) || !isFilingStatus(toStatus)) return;
  const db = service();
  const { data: app } = await db.from("applications").select("user_id, reference_id").eq("id", applicationId).maybeSingle();
  const to = await userEmail(app?.user_id);
  if (!to) return;
  await sendEmail({
    to,
    email: statusChangeEmail({
      referenceId: app?.reference_id ?? "",
      serviceName,
      statusLabel: STATUS_COPY[toStatus].label,
      statusMeaning: STATUS_COPY[toStatus].meaning,
    }),
  });
}

/** Final per-service email + PDF attachments, once per application. */
export async function sendFinalIfNeeded(applicationId: string, attachments: SendAttachment[]): Promise<{ sent: boolean }> {
  const db = service();
  const { data: app } = await db
    .from("applications")
    .select("user_id, reference_id, company_legal_name, final_email_sent_at")
    .eq("id", applicationId)
    .maybeSingle();
  if (!app || app.final_email_sent_at) return { sent: false };
  const to = await userEmail(app.user_id);
  if (!to) return { sent: false };

  const { data: filings } = await db.from("filings").select("service_name").eq("application_id", applicationId);
  await db.from("applications").update({ final_email_sent_at: new Date().toISOString() }).eq("id", applicationId);
  await sendEmail({
    to,
    email: finalEmail({
      referenceId: app.reference_id ?? "",
      companyName: app.company_legal_name,
      services: (filings ?? []).map((f) => f.service_name),
    }),
    attachments,
  });
  return { sent: true };
}

/**
 * Three internal admin alerts across the quick-buy fast path (owner-directed,
 * 2026-07-31), each short by design: service, USDOT, company name, email,
 * phone — never the full carrier docket. Nothing is persisted for any of
 * these, so none has an idempotency guard: each fires once per page render or
 * webhook event, same as the trigger itself. Best-effort like every send.
 *
 * All three pass skipRateLimit to sendEmail(): they share one recipient
 * (ADMIN_EMAIL/site.email), and lib/email/send.ts's 5/min-per-recipient limit
 * was designed to throttle repeat sends to a single CLIENT, not a single
 * internal inbox receiving several distinct alert types back to back. Without
 * this, a normal test pass (a couple of lookup retries + reaching payment)
 * could exhaust the cap and silently drop the paid alert, which fires last.
 *
 * Recipient is ADMIN_EMAIL, not the public site.email: a deliberate pre-launch
 * testing override (currently hussamdogar@gmail.com) so alerts land somewhere
 * the team is actively watching during build/QA instead of the shared
 * info@techrig.org inbox. Falls back to site.email if ADMIN_EMAIL is unset.
 * LAUNCH TODO: unset ADMIN_EMAIL (or point it at info@techrig.org) as part of
 * cutover so live alerts go to the real business inbox — see build-report.md
 * §11.9 and shared/launch-plan.md Phase 0.
 */

/** 1 of 3: a visitor reached the quick-buy confirm screen (a USDOT lookup),
 *  success or not-found alike. Carrier fields come from the just-completed
 *  lookup, already in hand at the call site (no DB round-trip needed). */
export async function sendQuickBuyLookupAdminAlert(d: {
  serviceName: string;
  usdot: string;
  contact: { companyName: string | null; email: string | null; phone: string | null };
}): Promise<void> {
  await sendEmail({ to: adminAlertRecipient(), email: adminQuickBuyLookupEmail(d), skipRateLimit: true });
}

/** 2 of 3: a client reached the quick-buy payment screen (review and
 *  signature already complete). Company name isn't a quick_buy_orders column,
 *  so it's resolved here from the lookup's carrier_snapshots row. */
export async function sendQuickBuyPaymentStepAdminAlert(d: {
  leadId: string;
  serviceName: string;
  usdot: string;
  email: string | null;
  phone: string | null;
}): Promise<void> {
  const companyName = await getQuickBuyCompanyName(d.leadId);
  await sendEmail({
    to: adminAlertRecipient(),
    email: adminQuickBuyPaymentStepEmail({
      serviceName: d.serviceName,
      usdot: d.usdot,
      contact: { companyName, email: d.email, phone: d.phone },
    }),
    skipRateLimit: true,
  });
}

/** 3 of 3: a quick-buy order's payment succeeded. Mirrors
 *  sendQuickBuyReceiptIfNeeded's lookup shape (by Stripe payment intent id),
 *  but has no receipt_sent_at-style guard since it's a separate, unsent-state
 *  alert, not a client email. */
export async function sendQuickBuyPaidAdminAlert(paymentIntentId: string): Promise<void> {
  const db = service();
  // findPaymentByIntent, not .maybeSingle(): see lib/server/payments.ts.
  const payment = (await findPaymentByIntent(paymentIntentId, "quick_buy_order_id, amount")) as {
    quick_buy_order_id: string | null;
    amount: number;
  } | null;
  if (!payment?.quick_buy_order_id) return;

  const { data: order } = await db
    .from("quick_buy_orders")
    .select("usdot_number, email, phone, lead_id")
    .eq("id", payment.quick_buy_order_id)
    .maybeSingle();
  if (!order) return;

  const { data: filings } = await db
    .from("filings")
    .select("service_name")
    .eq("quick_buy_order_id", payment.quick_buy_order_id);

  const companyName = await getQuickBuyCompanyName(order.lead_id);
  await sendEmail({
    to: adminAlertRecipient(),
    email: adminQuickBuyPaidEmail({
      usdot: order.usdot_number,
      amount: Number(payment.amount),
      serviceNames: (filings ?? []).map((f) => f.service_name),
      contact: { companyName, email: order.email, phone: order.phone },
    }),
    skipRateLimit: true,
  });
}

export { reminder24hEmail, reminder72hEmail };
