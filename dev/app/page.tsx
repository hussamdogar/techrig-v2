import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { UsdotLookupCard } from "@/components/usdot-lookup-card";
import { ServiceCard } from "@/components/service-card";
import { CompliancePathPicker } from "@/components/compliance-path-picker";
import { site } from "@/lib/site";
import { complianceCatalog, pricing } from "@/lib/services";
import { ArrowRightIcon } from "@/components/icons";

// Compliance-only positioning (dispatch dropped from the home funnel, per
// owner direction): own title + description override the root layout's
// dispatch-and-compliance default, which otherwise only the homepage falls
// back to. The OG image is app/opengraph-image.tsx.
export const metadata: Metadata = {
  title: "Trucking Compliance & Authority Setup",
  description:
    "Get your USDOT number, MC authority, BOC-3, and UCR filed right. Tech Rig walks new and growing carriers through trucking compliance, so nothing stalls.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Trucking compliance, done right",
    description:
      "Tech Rig gets new and growing carriers road-legal: USDOT, MC authority, BOC-3, UCR, driver files, Clearinghouse, and consortium enrollment, explained plainly and filed correctly.",
    url: "/",
    type: "website",
  },
};

export default function Home() {
  return (
    <>
      {/* 1. Hero: compliance-only, plain language for a first-time carrier,
          single primary CTA. */}
      <Section surface="paper" className="pt-12 md:pt-16">
        <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-ink">
              Get Your Trucking Authority Set Up Right
            </h1>
            {/* Styled subhead, not a heading. */}
            <p className="mt-6 max-w-[60ch] text-lg text-slate">
              Starting a trucking company means a stack of federal paperwork:
              your USDOT number, your operating authority, and a few required
              filings most new owners have never heard of before they need
              them. Tech Rig handles all of it, so your authority actually
              goes active instead of sitting stuck.
            </p>
            <div className="mt-8">
              <Link
                href="/compliance-services/"
                className={buttonVariants({ variant: "primary", size: "md" })}
              >
                Start your compliance setup
              </Link>
            </div>
          </div>

          {/* The hero's lead-generating front door (Application Platform M1).
              Client island: the homepage stays prerendered and ships no
              DB/payment. */}
          <UsdotLookupCard />
        </Container>
      </Section>

      {/* 2. The full compliance catalog, same single source (lib/services.ts)
          as /compliance-services/, so descriptions and prices never drift
          between the two. Reuses the canonical ServiceCard (design-system §8). */}
      <Section surface="cloud">
        <Container>
          <h2 className="font-display text-3xl font-bold text-ink">
            What we handle
          </h2>
          <p className="mt-4 max-w-[65ch] text-slate">
            Every federal filing and driver-compliance requirement a carrier
            runs into, individually or as one package. We are officially
            listed by FMCSA as a BOC-3 blanket process-agent company, and we
            know the MOTUS system inside out.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {complianceCatalog.map((card) => (
              <ServiceCard
                key={card.title}
                icon={card.icon}
                title={card.title}
                href={card.href}
                description={card.description}
                price={card.price ?? (card.href ? pricing[card.href] : undefined)}
                govFeeNote={card.govFeeNote}
                note={card.note}
              />
            ))}
          </div>

          <p className="mt-8">
            <Link
              href="/compliance-services/"
              className="inline-flex items-center gap-1 font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
            >
              See the full compliance hub
              <ArrowRightIcon size={16} />
            </Link>
          </p>
        </Container>
      </Section>

      {/* 3. Fork by visitor type (owner-directed 2026-08): not everyone here
          is starting from zero, so this replaces a single generic sequence
          with three tailored paths. See CompliancePathPicker for the split. */}
      <Section surface="paper" className="border-l-4 border-steel">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            Which describes you?
          </h2>
          <p className="mt-4 text-slate">
            What you actually need depends on where you are already. Pick the
            one that fits.
          </p>

          <div className="mt-6">
            <CompliancePathPicker />
          </div>
        </Container>
      </Section>

      {/* 4. Trust band: documented proof only, compliance-led. */}
      <Section surface="cloud">
        <Container>
          <h2 className="font-display text-3xl font-bold text-ink">
            Why carriers trust Tech Rig
          </h2>

          {/* Track-record figures in the mono "official record" treatment. */}
          <dl className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="border-t-2 border-steel pt-3">
              <dt className="font-mono text-sm uppercase tracking-[0.08em] text-slate">
                Since 2025
              </dt>
              <dd className="mt-1 text-ink">
                40+ compliance clients across 10+ states.
              </dd>
            </div>
            <div className="border-t-2 border-signal pt-3">
              <dt className="font-mono text-sm uppercase tracking-[0.08em] text-slate">
                FMCSA listed
              </dt>
              <dd className="mt-1 text-ink">
                BOC-3 blanket process-agent company.
              </dd>
            </div>
          </dl>

          <p className="mt-8 max-w-2xl text-slate">
            We work with Motive for ELD and with OTR Solutions and RTS
            Financial for factoring. {site.fmcsaLine}
          </p>

          {/* Graceful, empty-friendly review slot (no ratings, no invented proof). */}
          <p className="mt-6 max-w-2xl text-sm text-slate">
            Client stories appear here as permissions clear.
          </p>
        </Container>
      </Section>

      {/* 5. Closing CTA: one dominant next step. */}
      <Section surface="paper">
        <Container className="max-w-2xl text-center">
          <p className="font-display text-2xl font-bold text-ink">
            Whether you are just starting out or fixing a setup that stalled,
            we have the next step. Talk to us.
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              href="/compliance-services/"
              className={buttonVariants({ variant: "primary", size: "md" })}
            >
              Start your compliance setup
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
