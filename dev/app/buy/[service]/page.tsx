import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, Section } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { SERVICES, isQuickBuyServiceKey, type ServiceKey } from "@/lib/services-registry";
import { TrackedForm } from "@/components/tracked-form";
import { startQuickBuyLookup } from "./actions";

/**
 * Quick-buy entry screen (USDOT-confirm-and-pay fast path). Noindex (this is a
 * checkout flow entry, not a content page). One job: collect the USDOT number
 * and hand off to the confirm screen, which runs the real lookup.
 */
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Start your order",
  robots: { index: false, follow: false },
};

export default async function QuickBuyEntryPage({ params }: { params: Promise<{ service: string }> }) {
  const { service } = await params;
  if (!isQuickBuyServiceKey(service)) notFound();
  const def = SERVICES[service as ServiceKey];
  const action = startQuickBuyLookup.bind(null, service);

  return (
    <Section surface="paper" className="pt-10 md:pt-16">
      <Container className="max-w-xl">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-slate">
          Start your {def.name.toLowerCase()}
        </p>
        <h1 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.02em] text-ink">
          What&apos;s your USDOT number?
        </h1>
        <p className="mt-3 text-slate">
          We&apos;ll pull your carrier record so you can confirm it, then take you straight to payment. No account
          needed.
        </p>

        <TrackedForm
          action={action}
          event="quick_buy_lookup_submit"
          data={{ service }}
          className="mt-6 space-y-4"
        >
          <div>
            <label htmlFor="usdot" className="text-sm font-medium text-ink">
              USDOT number
            </label>
            <input
              id="usdot"
              name="usdot"
              inputMode="numeric"
              pattern="\d{1,12}"
              required
              autoFocus
              placeholder="e.g. 1234567"
              className="mt-1 w-full rounded-card border border-slate/25 bg-paper px-4 py-3 text-lg text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
            />
          </div>
          <button type="submit" className={`${buttonVariants({ variant: "primary", size: "md" })} w-full`}>
            Look up my USDOT
          </button>
        </TrackedForm>
      </Container>
    </Section>
  );
}
