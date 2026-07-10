import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Container, Section } from "@/components/ui/container";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { computePricing, isBundleKey, isServiceKey, type ServiceKey } from "@/lib/services-registry";
import { PaymentForm } from "@/components/payment-form";

// Authed, noindex (ADR-5).
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Payment",
  robots: { index: false, follow: false },
};

export default async function PayPage({ params }: { params: Promise<{ applicationId: string }> }) {
  const { applicationId } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login/?next=/apply/${applicationId}/pay/`);
  const { data: app } = await supabase.from("applications").select("*").eq("id", applicationId).maybeSingle();
  if (!app) redirect("/dashboard/");

  const selected = (Array.isArray(app.selected_services) ? app.selected_services : []).filter(isServiceKey) as ServiceKey[];
  const pricing = computePricing(selected, {
    powerUnits: app.power_units,
    driverCount: app.application_data?.drivers?.driver_count,
    bundle: isBundleKey(app.selected_bundle) ? app.selected_bundle : null,
  });

  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY ?? "";

  return (
    <Section surface="paper" className="pt-8 md:pt-10">
      <Container className="max-w-2xl">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-slate">
          Payment · {app.reference_id ?? ""}
        </p>
        <h1 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.02em] text-ink">Pay for your filings</h1>

        <div className="mt-6 rounded-card border border-slate/15 bg-cloud p-5">
          <ul className="divide-y divide-slate/10">
            {pricing.lines.map((l) => (
              <li key={l.key + l.name} className="flex items-center justify-between gap-4 py-2 text-sm">
                <span className="text-ink">
                  {l.name}
                  {l.note ? <span className="block text-xs text-slate">{l.note}</span> : null}
                </span>
                <span className="font-mono font-medium text-ink">
                  {l.amount == null ? (l.manualReview ? "Quote" : "—") : `$${l.amount.toLocaleString("en-US")}`}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center justify-between border-t border-slate/15 pt-3">
            <span className="font-display font-bold text-ink">Total due now</span>
            <span className="font-mono text-lg font-bold text-ink">${pricing.total.toLocaleString("en-US")}</span>
          </div>
          <p className="mt-2 text-xs text-slate">
            Government and state fees are shown separately and paid to the agency directly.
          </p>
        </div>

        <div className="mt-6">
          {pricing.total > 0 && publishableKey ? (
            <PaymentForm applicationId={applicationId} publishableKey={publishableKey} />
          ) : (
            <p className="rounded-card border border-slate/15 bg-cloud p-4 text-sm text-ink">
              There&apos;s nothing to pay online for the services you selected. We&apos;ll follow up with a quote.{" "}
              <Link href="/dashboard/" className="font-medium text-steel underline-offset-4 hover:underline">
                Back to dashboard
              </Link>
            </p>
          )}
        </div>

        <p className="mt-6 text-sm">
          <Link
            href={`/apply/${applicationId}/?step=review`}
            className="font-medium text-steel underline-offset-4 hover:underline"
          >
            Back to review
          </Link>
        </p>
      </Container>
    </Section>
  );
}
