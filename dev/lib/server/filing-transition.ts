import "server-only";
import { service } from "@/lib/server/supabase";
import { canTransition, isFilingStatus, type FilingStatus } from "@/lib/apply/filing-status";
import { sendStatusChangeEmail, sendFinalIfNeeded } from "@/lib/email/lifecycle";
import { generateCompletionDocuments } from "@/lib/pdf/documents";

/**
 * Core filing transition (M5). Shared by the transition API and the admin board's
 * server action so the state-machine rules + event write never diverge. The
 * CALLER must have already verified the actor is an admin — this function does the
 * service-role writes after that gate. Validates the move, updates the filing's
 * status + lifecycle timestamps, and records a filing_events row.
 */
export type TransitionResult =
  | { ok: true; status: FilingStatus; idempotent?: boolean }
  | { ok: false; code: number; error: string };

export async function transitionFiling(
  adminId: string,
  filingId: string,
  to: unknown,
  note: string | null,
): Promise<TransitionResult> {
  if (!isFilingStatus(to)) return { ok: false, code: 400, error: "Unknown status." };

  const db = service();
  const { data: filing } = await db
    .from("filings")
    .select("id, status, service_name, application_id")
    .eq("id", filingId)
    .maybeSingle();
  if (!filing) return { ok: false, code: 404, error: "Filing not found." };

  const from = filing.status as FilingStatus;
  if (from === to) return { ok: true, status: to, idempotent: true }; // no-op
  if (!canTransition(from, to)) return { ok: false, code: 422, error: `Transition ${from} -> ${to} is not allowed.` };

  const patch: Record<string, unknown> = { status: to };
  if (to === "filed") patch.filed_at = new Date().toISOString();
  if (to === "completed") patch.completed_at = new Date().toISOString();

  await db.from("filings").update(patch).eq("id", filingId);
  await db.from("filing_events").insert({
    filing_id: filingId,
    from_status: from,
    to_status: to,
    note: note ? note.trim().slice(0, 1000) : null,
    actor: `admin:${adminId}`,
  });

  // Status-change email (M6) for client-relevant transitions; best-effort, never
  // blocks the transition.
  await sendStatusChangeEmail(filing.application_id, filing.service_name, to);

  // When every filing on the application is terminal, generate the completion
  // PDFs and send the final email (once, guarded by final_email_sent_at).
  if (to === "completed") {
    const { data: all } = await db.from("filings").select("status").eq("application_id", filing.application_id);
    const allTerminal = (all ?? []).length > 0 && (all ?? []).every((f) => f.status === "completed" || f.status === "cancelled");
    if (allTerminal) {
      const attachments = await generateCompletionDocuments(filing.application_id);
      await sendFinalIfNeeded(filing.application_id, attachments);
    }
  }

  return { ok: true, status: to };
}
