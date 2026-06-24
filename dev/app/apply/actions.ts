"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { service } from "@/lib/server/supabase";
import { nextReferenceId } from "@/lib/server/reference";
import { decodeLeadAccessToken } from "@/lib/server/security";
import { computePricing, isServiceKey, type ServiceKey } from "@/lib/services-registry";
import { sendWelcomeIfNeeded } from "@/lib/email/lifecycle";
import { activeSteps, adjacentStep, type OperationsFlags } from "@/lib/apply/steps";
import { validateStep } from "@/lib/apply/schemas";
import { buildCarrierDiff, computeNeedsMcs150 } from "@/lib/apply/diff";
import type { CarrierData } from "@/lib/lookup/types";
import type { StepKey } from "@/lib/services-registry";

// Load the signed-in user + an owner-scoped application (RLS enforces ownership).
async function loadOwned(applicationId: string) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login/?next=/apply/${applicationId}/`);
  const { data: app } = await supabase.from("applications").select("*").eq("id", applicationId).maybeSingle();
  if (!app) redirect("/dashboard/");
  return { supabase, user, app };
}

function selectedFrom(app: { selected_services: unknown }): ServiceKey[] {
  return Array.isArray(app.selected_services) ? (app.selected_services as ServiceKey[]).filter(isServiceKey) : [];
}
function flagsFrom(app: { application_data: any }): OperationsFlags {
  const ops = app.application_data?.operations ?? {};
  return { passenger: !!ops.passenger, hazmat: !!ops.hazmat };
}

/** Create a new application, optionally seeded from a lookup lead + snapshot. */
export async function createApplication(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login/?next=/apply/");
  const userId = user.id;

  // Lead linkage: an explicit lead_id (dashboard) or a signed lead token (the
  // lookup page, which only holds the token, not the raw id).
  let leadId = (formData.get("lead_id") as string) || null;
  if (!leadId) {
    const tokenLead = decodeLeadAccessToken(formData.get("lead_token"));
    if (tokenLead) leadId = tokenLead.leadId;
  }
  const preselect = (formData.getAll("service") as string[]).filter(isServiceKey) as ServiceKey[];

  let referenceId: string | null = null;
  const identity: Record<string, unknown> = {};
  if (leadId) {
    const db = service();
    const { data: lead } = await db.from("leads").select("reference_id").eq("id", leadId).maybeSingle();
    referenceId = lead?.reference_id ?? null;
    const { data: snap } = await db
      .from("carrier_snapshots")
      .select("data_json")
      .eq("lead_id", leadId)
      .order("fetched_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    const carrier = snap?.data_json as CarrierData | undefined;
    if (carrier) {
      identity.company_legal_name = carrier.legalName;
      identity.dba = carrier.dbaName;
      identity.usdot_number = carrier.usdotNumber != null ? String(carrier.usdotNumber) : null;
      identity.mc_number = carrier.mcNumber;
      identity.power_units = carrier.powerUnits;
    }
  }

  // Carry the lead's DGR reference; mint a fresh one if absent or already taken.
  async function insertWith(ref: string) {
    return supabase
      .from("applications")
      .insert({
        user_id: userId,
        lead_id: leadId,
        reference_id: ref,
        status: "draft",
        current_step: "services",
        selected_services: preselect,
        ...identity,
      })
      .select("id")
      .single();
  }
  let { data: app, error } = await insertWith(referenceId ?? (await nextReferenceId()));
  if (error) {
    ({ data: app, error } = await insertWith(await nextReferenceId())); // unique-collision retry
  }
  if (!app) redirect("/dashboard/");

  if (leadId) {
    try {
      await service().from("carrier_snapshots").update({ application_id: app.id }).eq("lead_id", leadId);
      // Welcome email (M6), guarded by leads.welcome_email_sent_at (once per lead).
      await sendWelcomeIfNeeded(leadId, user.email);
    } catch {
      /* snapshot linkage + welcome are best-effort */
    }
  }
  redirect(`/apply/${app.id}/`);
}

/** Update the selected services from the selection step, then advance. */
export async function setServices(applicationId: string, formData: FormData) {
  const { supabase, app } = await loadOwned(applicationId);
  const selected = (formData.getAll("service") as string[]).filter(isServiceKey) as ServiceKey[];
  await supabase
    .from("applications")
    .update({ selected_services: selected, status: app.status === "draft" ? "in_progress" : app.status })
    .eq("id", applicationId);
  const steps = activeSteps(selected, flagsFrom(app));
  redirect(`/apply/${applicationId}/?step=${adjacentStep(steps, "services", "next") ?? "review"}`);
}

/** Add a single service (e.g. the MCS-150 prompt's one-click "add update"). */
export async function addService(applicationId: string, formData: FormData) {
  const { supabase, app } = await loadOwned(applicationId);
  const key = String(formData.get("service") || "");
  if (!isServiceKey(key)) redirect(`/apply/${applicationId}/`);
  const selected = Array.from(new Set([...selectedFrom(app), key as ServiceKey]));
  await supabase
    .from("applications")
    .update({
      selected_services: selected,
      needs_mcs150_update: key === "mcs-150" ? false : app.needs_mcs150_update,
    })
    .eq("id", applicationId);
  redirect(`/apply/${applicationId}/?step=services`);
}

/** Validate + persist one step, run the carrier diff on identity, then advance. */
export async function saveStep(applicationId: string, step: StepKey, formData: FormData) {
  const { supabase, app } = await loadOwned(applicationId);

  const raw: Record<string, unknown> = {};
  for (const [k, v] of formData.entries()) {
    if (k === "_step") continue;
    // checkboxes arrive only when checked; coerce known booleans
    raw[k] = v;
  }
  // Normalise unchecked booleans for operations.
  if (step === "operations") {
    raw.passenger = formData.get("passenger") != null;
    raw.hazmat = formData.get("hazmat") != null;
  }
  if (step === "service-specifics") {
    raw.boc3_process_agent_ack = formData.get("boc3_process_agent_ack") != null;
  }

  const result = validateStep(step, raw);
  if (!result.ok) {
    redirect(`/apply/${applicationId}/?step=${step}&error=1`);
  }
  const data = result.data;

  const selected = selectedFrom(app);
  const appData = { ...(app.application_data ?? {}), [step]: data };
  const patch: Record<string, unknown> = { application_data: appData };

  if (step === "carrier-identity") {
    patch.company_legal_name = data.company_legal_name ?? null;
    patch.dba = data.dba || null;
    patch.usdot_number = data.usdot_number || null;
    patch.mc_number = data.mc_number || null;
    if (data.power_units != null) patch.power_units = data.power_units;
    // Diff against the immutable snapshot (if this application came from a lookup).
    const { data: snap } = await service()
      .from("carrier_snapshots")
      .select("data_json")
      .eq("application_id", applicationId)
      .order("fetched_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    const carrier = (snap?.data_json as CarrierData | undefined) ?? null;
    const { changed, diff } = buildCarrierDiff(carrier, data);
    patch.carrier_data_changed = changed;
    patch.carrier_user_diff_json = diff;
    patch.needs_mcs150_update = computeNeedsMcs150(changed, selected);
  }
  if (step === "business-details") patch.entity_type = data.entity_type ?? null;
  if (step === "ucr-details" && data.ucr_power_units != null) patch.power_units = data.ucr_power_units;

  const steps = activeSteps(selected, step === "operations" ? { passenger: !!data.passenger, hazmat: !!data.hazmat } : flagsFrom(app));
  const next = adjacentStep(steps, step, "next") ?? "review";
  patch.current_step = next;

  await supabase.from("applications").update(patch).eq("id", applicationId);
  redirect(`/apply/${applicationId}/?step=${next}`);
}

/** Final review: compute pricing server-side, persist totals, create filings. */
export async function submitApplication(applicationId: string, formData: FormData) {
  const { supabase, app } = await loadOwned(applicationId);

  const signature = String(formData.get("signature_name") || "").trim();
  const terms = formData.get("terms_accepted") != null;
  if (!signature || !terms) {
    redirect(`/apply/${applicationId}/?step=review&error=1`);
  }

  const selected = selectedFrom(app);
  const pricing = computePricing(selected, { powerUnits: app.power_units, driverCount: app.application_data?.drivers?.driver_count });

  await supabase
    .from("applications")
    .update({
      signature_name: signature,
      terms_accepted_at: new Date().toISOString(),
      subtotal: pricing.subtotal,
      total_amount: pricing.total,
      status: "in_progress",
      submitted_at: new Date().toISOString(),
    })
    .eq("id", applicationId);

  // Create one filings row per billable selected service (service role: filings
  // has no client-write policy). Idempotent: replace any prior set for this app.
  const db = service();
  await db.from("filings").delete().eq("application_id", applicationId);
  const rows = pricing.filings.map((f) => ({
    application_id: applicationId,
    service_key: f.service_key,
    service_name: f.service_name,
    price_amount: f.price_amount,
    ucr_tier: f.ucr_tier,
    status: f.status,
    expected_timeline: f.expected_timeline,
  }));
  if (rows.length) await db.from("filings").insert(rows);

  // If there is a chargeable total, go to payment (M4); otherwise show the
  // submitted confirmation (quote-only applications have nothing to pay online).
  if (pricing.total > 0) redirect(`/apply/${applicationId}/pay/`);
  redirect(`/apply/${applicationId}/?step=review&submitted=1`);
}
