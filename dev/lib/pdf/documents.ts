import "server-only";
import { service } from "@/lib/server/supabase";
import { generateAcknowledgementPDF, generateAnswersPDF } from "@/lib/pdf/generate";
import type { SendAttachment } from "@/lib/email/send";

/**
 * Generate the completion PDFs (acknowledgement + answers), store them in the
 * private `documents` Storage bucket, record them in the `documents` table
 * (service-role), and return them as email attachments (M6 §4). Idempotent per
 * kind: re-running replaces the stored file + its record.
 */

/** Flatten application_data into readable label/value rows for the answers PDF. */
function flatten(value: unknown, prefix = ""): { label: string; value: string }[] {
  if (value == null) return [];
  if (typeof value !== "object") return [{ label: prefix || "Value", value: String(value) }];
  if (Array.isArray(value)) {
    return value.flatMap((v, i) => flatten(v, `${prefix} ${i + 1}`.trim()));
  }
  const rows: { label: string; value: string }[] = [];
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    const label = (prefix ? `${prefix} / ` : "") + k.replace(/_/g, " ");
    if (v && typeof v === "object") rows.push(...flatten(v, label));
    else if (v !== null && v !== "" && v !== undefined) rows.push({ label, value: String(v) });
  }
  return rows;
}

export async function generateCompletionDocuments(applicationId: string): Promise<SendAttachment[]> {
  const db = service();
  const { data: app } = await db
    .from("applications")
    .select("reference_id, company_legal_name, usdot_number, application_data")
    .eq("id", applicationId)
    .maybeSingle();
  if (!app) return [];

  const ad = (app.application_data ?? {}) as Record<string, any>;
  const fullName = ad?.carrier_identity?.contact_name ?? ad?.review?.signature_name ?? app.company_legal_name ?? "";
  const signatureName = ad?.review?.signature_name ?? fullName;
  const acceptedAt = ad?.review?.accepted_at;
  const rows = [
    { label: "Company", value: app.company_legal_name ?? "" },
    { label: "USDOT", value: app.usdot_number ?? "" },
    ...flatten(ad),
  ];

  const ack = await generateAcknowledgementPDF({ fullName, signatureName, referenceId: app.reference_id ?? "", acceptedAt });
  const answers = await generateAnswersPDF({ referenceId: app.reference_id ?? "", rows });

  const files = [
    { kind: "acknowledgement_pdf", name: "acknowledgement.pdf", bytes: ack },
    { kind: "answers_pdf", name: "answers.pdf", bytes: answers },
  ] as const;

  const attachments: SendAttachment[] = [];
  for (const f of files) {
    const path = `${applicationId}/${f.name}`;
    const buf = Buffer.from(f.bytes);
    const { error } = await db.storage.from("documents").upload(path, buf, { contentType: "application/pdf", upsert: true });
    if (error) {
      console.error("document upload failed:", error.message);
      continue;
    }
    await db.from("documents").delete().eq("application_id", applicationId).eq("kind", f.kind);
    await db.from("documents").insert({ application_id: applicationId, kind: f.kind, storage_path: path });
    attachments.push({ filename: f.name, content: buf });
  }
  return attachments;
}
