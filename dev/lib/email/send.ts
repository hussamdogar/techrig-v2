import "server-only";
import { Resend } from "resend";
import type { RenderedEmail } from "@/lib/email/templates";

/**
 * Resend send wrapper (M6). Server-only key; per-recipient rate limit (5/min,
 * legacy parity). Logs failures without PII (no recipient address, no body). If
 * RESEND_API_KEY is absent (local/sandbox) it no-ops with success:false + a
 * skipped flag so callers and idempotency guards behave deterministically.
 */
const FROM = process.env.EMAIL_FROM ?? "Tech Rig <onboarding@resend.dev>";

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 1000;
const recipientHits = new Map<string, { count: number; resetAt: number }>();

function withinRate(recipient: string): boolean {
  const now = Date.now();
  const hit = recipientHits.get(recipient);
  if (!hit || now > hit.resetAt) {
    recipientHits.set(recipient, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (hit.count >= RATE_LIMIT) return false;
  hit.count += 1;
  return true;
}

let client: Resend | null = null;
function resend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!client) client = new Resend(process.env.RESEND_API_KEY);
  return client;
}

export type SendAttachment = { filename: string; content: Buffer };
export type SendResult = { success: boolean; skipped?: boolean; error?: string };

export async function sendEmail(args: {
  to: string;
  email: RenderedEmail;
  attachments?: SendAttachment[];
}): Promise<SendResult> {
  const r = resend();
  if (!r) return { success: false, skipped: true, error: "RESEND_API_KEY not set" };
  if (!withinRate(args.to)) return { success: false, error: "rate_limited" };

  try {
    const { error } = await r.emails.send({
      from: FROM,
      to: args.to,
      subject: args.email.subject,
      html: args.email.html,
      text: args.email.text,
      attachments: args.attachments?.map((a) => ({ filename: a.filename, content: a.content })),
    });
    if (error) {
      console.error("email send failed:", error.name ?? "error"); // no recipient / body
      return { success: false, error: error.name ?? "send_error" };
    }
    return { success: true };
  } catch (e) {
    console.error("email send threw:", e instanceof Error ? e.name : "error");
    return { success: false, error: "exception" };
  }
}
