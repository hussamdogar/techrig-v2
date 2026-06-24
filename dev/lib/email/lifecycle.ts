import "server-only";
import { service } from "@/lib/server/supabase";
import { sendEmail, type SendAttachment } from "@/lib/email/send";
import {
  welcomeEmail,
  receiptEmail,
  finalEmail,
  statusChangeEmail,
  reminder24hEmail,
  reminder72hEmail,
} from "@/lib/email/templates";
import { STATUS_COPY, isFilingStatus } from "@/lib/apply/filing-status";

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
  const { data: payment } = await db
    .from("payments")
    .select("id, application_id, amount, receipt_sent_at")
    .eq("stripe_payment_intent_id", paymentIntentId)
    .maybeSingle();
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

export { reminder24hEmail, reminder72hEmail };
