import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Container, Section } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";

// Authed, noindex (ADR-5).
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Payment receipt",
  robots: { index: false, follow: false },
};

type FilingRow = { service_name: string; price_amount: number | null; expected_timeline: string | null; status: string };

export default async function SuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ applicationId: string }>;
  searchParams: Promise<{ payment_intent?: string; redirect_status?: string }>;
}) {
  const { applicationId } = await params;
  const { payment_intent } = await searchParams;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login/?next=/apply/${applicationId}/success/`);
  const { data: app } = await supabase.from("applications").select("*").eq("id", applicationId).maybeSingle();
  if (!app) redirect("/dashboard/");

  const { data: filingsData } = await supabase
    .from("filings")
    .select("service_name, price_amount, expected_timeline, status")
    .eq("application_id", applicationId);
  const filings = (filingsData ?? []) as FilingRow[];

  // Verify-on-return: trust the Stripe intent status, not the client redirect
  // alone (the webhook is the DB source of truth and may have already settled).
  let paid = app.status === "paid";
  let pending = false;
  if (payment_intent) {
    try {
      const intent = await stripe().paymentIntents.retrieve(payment_intent);
      if (intent.status === "succeeded") paid = true;
      else if (intent.status === "processing") pending = true;
    } catch {
      /* fall back to the DB status */
    }
  }

  return (
    <Section surface="paper" className="pt-10 md:pt-14">
      <Container className="max-w-2xl">
        {paid ? (
          <>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-status-active">Paid</p>
            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.02em] text-ink">
              Payment received
            </h1>
            <p className="mt-3 text-slate">
              Thanks. Your application{" "}
              <span className="font-mono text-ink">{app.reference_id ?? ""}</span> is paid and your filings are queued.
              {app.total_amount != null ? ` Total charged: $${Number(app.total_amount).toLocaleString("en-US")}.` : ""}
            </p>
          </>
        ) : pending ? (
          <>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-slate">Processing</p>
            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.02em] text-ink">Payment processing</h1>
            <p className="mt-3 text-slate">
              Your payment is processing. We&apos;ll email you and update your dashboard as soon as it confirms.
            </p>
          </>
        ) : (
          <>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-ink">Not completed</p>
            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.02em] text-ink">Payment not completed</h1>
            <p className="mt-3 text-slate">Your payment didn&apos;t go through. You can try again.</p>
            <Link href={`/apply/${applicationId}/pay/`} className={`${buttonVariants({ variant: "primary", size: "md" })} mt-5`}>
              Try again
            </Link>
          </>
        )}

        {paid || pending ? (
          <div className="mt-7 rounded-card border border-slate/15 bg-cloud p-5">
            <h2 className="font-display text-lg font-bold text-ink">What happens next</h2>
            <ul className="mt-3 divide-y divide-slate/10">
              {filings.map((f) => (
                <li key={f.service_name} className="flex items-center justify-between gap-4 py-2 text-sm">
                  <span className="text-ink">{f.service_name}</span>
                  <span className="text-right text-xs text-slate">
                    {f.expected_timeline ?? "Timeline shared after review"}
                  </span>
                </li>
              ))}
            </ul>
            <Link href="/dashboard/" className={`${buttonVariants({ variant: "primary", size: "md" })} mt-5`}>
              Go to dashboard
            </Link>
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
