import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Container, Section } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { service } from "@/lib/server/supabase";
import {
  BILLABLE_SERVICE_KEYS,
  SERVICES,
  computePricing,
  isServiceKey,
  type ServiceKey,
} from "@/lib/services-registry";
import { STEP_META, activeSteps, adjacentStep, resolveStep, type OperationsFlags } from "@/lib/apply/steps";
import { carrierFacts } from "@/lib/apply/diff";
import type { CarrierData } from "@/lib/lookup/types";
import { addService, saveStep, setServices, submitApplication } from "../actions";
import { StepFields } from "./step-fields";

// Authed, noindex (ADR-5). Dynamic: reads the session + the application.
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Application",
  robots: { index: false, follow: false },
};

const input =
  "mt-1.5 w-full rounded-btn border border-slate/25 bg-paper px-3 py-2.5 text-ink outline-none placeholder:text-slate/60 focus-visible:border-steel focus-visible:ring-2 focus-visible:ring-steel/40";

function selectedFrom(app: { selected_services: unknown }): ServiceKey[] {
  return Array.isArray(app.selected_services) ? (app.selected_services as ServiceKey[]).filter(isServiceKey) : [];
}
function flagsFrom(app: { application_data: any }): OperationsFlags {
  const ops = app.application_data?.operations ?? {};
  return { passenger: !!ops.passenger, hazmat: !!ops.hazmat };
}

export default async function ApplyPage({
  params,
  searchParams,
}: {
  params: Promise<{ applicationId: string }>;
  searchParams: Promise<{ step?: string; error?: string; submitted?: string }>;
}) {
  const { applicationId } = await params;
  const { step: stepParam, error, submitted } = await searchParams;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login/?next=/apply/${applicationId}/`);
  const { data: app } = await supabase.from("applications").select("*").eq("id", applicationId).maybeSingle();
  if (!app) redirect("/dashboard/");

  const selected = selectedFrom(app);
  const flags = flagsFrom(app);
  const steps = activeSteps(selected, flags);
  const current = resolveStep(steps, stepParam ?? app.current_step ?? undefined);

  // Snapshot (if started from a lookup) → OA-aware hints + diff context.
  const { data: snap } = await service()
    .from("carrier_snapshots")
    .select("data_json")
    .eq("application_id", applicationId)
    .order("fetched_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  const carrier = (snap?.data_json as CarrierData | undefined) ?? null;
  const facts = carrierFacts(carrier);

  const pricing = computePricing(selected, {
    powerUnits: app.power_units,
    driverCount: app.application_data?.drivers?.driver_count,
  });

  return (
    <Section surface="paper" className="pt-8 md:pt-10">
      <Container className="max-w-3xl">
        <div className="flex items-center justify-between gap-4">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-slate">
            Application · {app.reference_id ?? ""}
          </p>
          <Link href="/dashboard/" className="font-mono text-xs text-steel hover:underline">
            Save & exit
          </Link>
        </div>

        {/* Progress */}
        <ol className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs">
          {steps.map((s) => (
            <li
              key={s}
              className={cn(
                "font-mono",
                s === current ? "font-semibold text-ink" : "text-slate",
              )}
              aria-current={s === current ? "step" : undefined}
            >
              {STEP_META[s].title}
            </li>
          ))}
        </ol>

        {/* MCS-150 prompt (boc3 Mcs150Modal behavior): carrier data changed and an
            update is not yet selected. */}
        {app.needs_mcs150_update ? (
          <form
            action={addService.bind(null, applicationId)}
            className="mt-6 flex flex-col gap-3 rounded-card border border-signal/40 bg-signal/10 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <input type="hidden" name="service" value="mcs-150" />
            <p className="text-sm text-ink">
              Your details differ from the FMCSA record, so an{" "}
              <span className="font-semibold">MCS-150 update</span> is likely needed.
            </p>
            <button type="submit" className={cn(buttonVariants({ variant: "primary", size: "sm" }), "shrink-0")}>
              Add MCS-150 update
            </button>
          </form>
        ) : null}

        {error ? (
          <p className="mt-6 rounded-card border border-signal/40 bg-signal/10 p-3 text-sm text-ink">
            Please complete the required fields and try again.
          </p>
        ) : null}

        <h1 className="mt-6 font-display text-3xl font-extrabold tracking-[-0.02em] text-ink">
          {STEP_META[current].title}
        </h1>

        <div className="mt-6">
          {submitted ? (
            <Confirmation referenceId={app.reference_id} />
          ) : current === "services" ? (
            <ServicesForm applicationId={applicationId} selected={selected} facts={facts} />
          ) : current === "review" ? (
            <ReviewForm
              applicationId={applicationId}
              pricing={pricing}
              app={app}
              steps={steps}
            />
          ) : (
            <form action={saveStep.bind(null, applicationId, current)} className="space-y-5">
              <StepFields step={current} app={app} carrier={carrier} inputClass={input} />
              <div className="flex items-center gap-4 pt-2">
                {adjacentStep(steps, current, "prev") ? (
                  <Link
                    href={`/apply/${applicationId}/?step=${adjacentStep(steps, current, "prev")}`}
                    className="font-medium text-steel underline-offset-4 hover:underline"
                  >
                    Back
                  </Link>
                ) : null}
                <button type="submit" className={buttonVariants({ variant: "primary", size: "md" })}>
                  Save & continue
                </button>
              </div>
            </form>
          )}
        </div>
      </Container>
    </Section>
  );
}

// ---- services selection step --------------------------------------------
function ServicesForm({
  applicationId,
  selected,
  facts,
}: {
  applicationId: string;
  selected: ServiceKey[];
  facts: ReturnType<typeof carrierFacts>;
}) {
  return (
    <form action={setServices.bind(null, applicationId)} className="space-y-3">
      <p className="text-slate">Select the services you need. Only the steps those services require will appear.</p>
      {BILLABLE_SERVICE_KEYS.map((key) => {
        const def = SERVICES[key];
        const hint =
          key === "boc-3" && facts.hasActiveBoc3
            ? "A blanket BOC-3 filing is already active on the FMCSA record."
            : key === "mc-authority" && facts.hasActiveMc
              ? `Active authority ${facts.mcDocket ?? ""} already on file.`
              : key === "full-package" && (facts.hasActiveMc || facts.hasActiveBoc3)
                ? "You already hold some of these (active authority or BOC-3), so à la carte may cost less."
                : null;
        return (
          <label
            key={key}
            className="flex cursor-pointer items-start gap-3 rounded-card border border-slate/15 bg-cloud p-4"
          >
            <input
              type="checkbox"
              name="service"
              value={key}
              defaultChecked={selected.includes(key)}
              className="mt-1 h-4 w-4 accent-steel"
            />
            <span>
              <span className="font-display font-semibold text-ink">{def.name}</span>
              <span className="block text-sm text-slate">{def.blurb}</span>
              {hint ? <span className="mt-1 block text-xs font-medium text-steel">{hint}</span> : null}
            </span>
          </label>
        );
      })}
      <p className="pt-2 text-xs text-slate">
        ELD is a partner referral and insurance is coordinated with your own insurer; neither is a Tech Rig
        filing, so neither is billed here.
      </p>
      <div className="pt-2">
        <button type="submit" className={buttonVariants({ variant: "primary", size: "md" })}>
          Continue
        </button>
      </div>
    </form>
  );
}

// ---- review + pricing + submit ------------------------------------------
function money(n: number | null): string {
  return n == null ? "Quote" : `$${n.toLocaleString("en-US")}`;
}
function ReviewForm({
  applicationId,
  pricing,
  app,
  steps,
}: {
  applicationId: string;
  pricing: ReturnType<typeof computePricing>;
  app: any;
  steps: string[];
}) {
  const input2 =
    "mt-1.5 w-full rounded-btn border border-slate/25 bg-paper px-3 py-2.5 text-ink outline-none focus-visible:border-steel focus-visible:ring-2 focus-visible:ring-steel/40";
  return (
    <div className="space-y-6">
      <div className="rounded-card border border-slate/15 bg-cloud p-5">
        <h2 className="font-display text-lg font-bold text-ink">Your services</h2>
        <ul className="mt-3 divide-y divide-slate/10">
          {pricing.lines.map((l) => (
            <li key={l.key} className="flex items-center justify-between gap-4 py-2 text-sm">
              <span className="text-ink">
                {l.name}
                {l.note ? <span className="block text-xs text-slate">{l.note}</span> : null}
                {l.govFeeNote ? <span className="block text-xs text-slate">{l.govFeeNote}</span> : null}
              </span>
              <span className="font-mono font-medium text-ink">{l.manualReview ? "Quote" : money(l.amount)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex items-center justify-between border-t border-slate/15 pt-3">
          <span className="font-display font-bold text-ink">Tech Rig service total</span>
          <span className="font-mono text-lg font-bold text-ink">${pricing.total.toLocaleString("en-US")}</span>
        </div>
        <p className="mt-2 text-xs text-slate">
          Government and state fees are shown per line and billed separately. No payment is taken yet.
        </p>
      </div>

      <div className="rounded-card border border-slate/15 bg-cloud p-5 text-sm">
        <h2 className="font-display text-lg font-bold text-ink">Carrier</h2>
        <p className="mt-2 text-slate">
          {app.company_legal_name ?? "—"} · USDOT {app.usdot_number ?? "—"}
          {app.mc_number ? ` · ${app.mc_number}` : ""}
        </p>
      </div>

      <form action={submitApplication.bind(null, applicationId)} className="space-y-4">
        <div>
          <label htmlFor="signature_name" className="text-sm font-medium text-ink">
            Type your full name to sign
          </label>
          <input id="signature_name" name="signature_name" type="text" required className={input2} />
        </div>
        <label className="flex items-start gap-3 text-sm text-ink">
          <input type="checkbox" name="terms_accepted" required className="mt-1 h-4 w-4 accent-steel" />
          <span>I confirm the information is accurate and accept the terms of service.</span>
        </label>
        <div className="flex items-center gap-4 pt-2">
          <Link
            href={`/apply/${applicationId}/?step=${steps[steps.length - 2] ?? "services"}`}
            className="font-medium text-steel underline-offset-4 hover:underline"
          >
            Back
          </Link>
          <button type="submit" className={buttonVariants({ variant: "primary", size: "md" })}>
            Submit application
          </button>
        </div>
      </form>
    </div>
  );
}

function Confirmation({ referenceId }: { referenceId: string | null }) {
  return (
    <div className="rounded-card border border-status-active/30 bg-cloud p-6">
      <h2 className="font-display text-xl font-bold text-ink">Application submitted</h2>
      <p className="mt-2 text-slate">
        Your application {referenceId ? <span className="font-mono text-ink">{referenceId}</span> : null} is saved and
        ready. Payment is the next step and is coming soon; we&apos;ll email you when it opens.
      </p>
      <Link href="/dashboard/" className={`${buttonVariants({ variant: "primary", size: "md" })} mt-4`}>
        Back to dashboard
      </Link>
    </div>
  );
}
