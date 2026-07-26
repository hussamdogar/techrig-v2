import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, Section } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { service } from "@/lib/server/supabase";
import { stripe } from "@/lib/stripe";

// Noindex (checkout flow, matches /apply/[applicationId]/success).
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Thank you",
  robots: { index: false, follow: false },
};

type FilingRow = { service_name: string; price_amount: number | null; expected_timeline: string | null };

export default async function QuickBuyThankYouPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ payment_intent?: string; redirect_status?: string }>;
}) {
  const { orderId } = await params;
  const { payment_intent } = await searchParams;

  const db = service();
  const { data: order } = await db.from("quick_buy_orders").select("*").eq("id", orderId).maybeSingle();
  if (!order) notFound();

  // Verify-on-return: trust the Stripe intent status, not the client redirect
  // alone, and confirm it actually belongs to THIS order (the webhook is the DB
  // source of truth and may have already settled it).
  let paid = order.status === "paid" || order.status === "fulfilled";
  let pending = false;
  if (payment_intent) {
    try {
      const intent = await stripe().paymentIntents.retrieve(payment_intent);
      if (intent.metadata?.quick_buy_order_id === orderId) {
        if (intent.status === "succeeded") paid = true;
        else if (intent.status === "processing") pending = true;
      }
    } catch {
      /* fall back to the DB status */
    }
  }

  const { data: filingsData } = await db
    .from("filings")
    .select("service_name, price_amount, expected_timeline")
    .eq("quick_buy_order_id", orderId);
  const filings = (filingsData ?? []) as FilingRow[];

  return (
    <Section surface="paper" className="pt-10 md:pt-14">
      <Container className="max-w-2xl">
        {paid ? (
          <>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-status-active">Paid</p>
            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.02em] text-ink">Payment received</h1>
            <p className="mt-3 text-slate">
              Thanks. Your order <span className="font-mono text-ink">{order.reference_id ?? ""}</span> is paid and
              your filing is queued. We&apos;ll be in touch at the contact info you confirmed.
            </p>
          </>
        ) : pending ? (
          <>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-slate">Processing</p>
            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.02em] text-ink">Payment processing</h1>
            <p className="mt-3 text-slate">Your payment is processing. We&apos;ll email you as soon as it confirms.</p>
          </>
        ) : (
          <>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-ink">Not completed</p>
            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.02em] text-ink">Payment not completed</h1>
            <p className="mt-3 text-slate">Your payment didn&apos;t go through. You can try again.</p>
            <Link href={`/buy/order/${orderId}/pay/`} className={`${buttonVariants({ variant: "primary", size: "md" })} mt-5`}>
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
                  <span className="text-right text-xs text-slate">{f.expected_timeline ?? "Timeline shared after review"}</span>
                </li>
              ))}
            </ul>
            <Link href="/" className={`${buttonVariants({ variant: "primary", size: "md" })} mt-5`}>
              Back home
            </Link>
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
