import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { FaqAccordion, type Faq } from "@/components/faq-accordion";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ClosingCta } from "@/components/closing-cta";
import { JsonLd } from "@/components/json-ld";
import {
  ArrowRightIcon,
  DryVanIcon,
  RouteNodeIcon,
} from "@/components/icons";
import {
  breadcrumbNode,
  faqNode,
  graph,
  serviceNode,
} from "@/lib/schema";
import { filingCtaHref } from "@/lib/site";

export const metadata: Metadata = {
  // Title tag with the brand stripped per the dev rule; the root layout template
  // reattaches " | Tech Rig", so the page title carries the primary keyword only.
  title: "Dry Van Dispatch Service",
  description:
    "Dry van dispatch service that protects your rate per mile, not just your miles. We work the boards and broker relationships so your loaded weeks beat the flat ones.",
  alternates: { canonical: "/dry-van-trucking/" },
  openGraph: {
    title: "Dry Van Dispatch Service",
    description:
      "Dry van dispatch service that protects your rate per mile, not just your miles. We work the boards and broker relationships so your loaded weeks beat the flat ones.",
    url: "/dry-van-trucking/",
    type: "website",
  },
};

// What our dry van dispatch covers: the system capability rows, two-up on
// desktop. Tuned to the dry van angle (volume freight, rate pressure) so the
// wording does not repeat the hub's general capability list.
const capabilities = [
  {
    label: "Lane and load selection",
    text: "across the deep dry van market, filtered for rate, not just availability.",
  },
  {
    label: "Rate negotiation",
    text: "that pushes back on lowball offers instead of booking the first load posted.",
  },
  {
    label: "Route planning",
    text: "to trim empty miles between palletized freight runs.",
  },
  {
    label: "Billing and paperwork",
    text: "including rate confirmations and the documents your factoring company needs.",
  },
  {
    label: "Support",
    text: "when an appointment or a lane shifts mid-haul.",
  },
];

// One source feeds both the visible FAQ and the FAQPage schema (verbatim parity).
// Pricing answer stays "rate on request" because the dry van percentage is not
// confirmed in services.md; never a guessed number.
const faqs: Faq[] = [
  {
    q: "How much does dry van dispatch cost?",
    a: "Rate on request. We price dry van dispatch as a percentage of your gross and confirm the figure with you before anything starts. See the cost page for how the numbers work.",
    aNode: (
      <>
        Rate on request. We price dry van dispatch as a percentage of your gross
        and confirm the figure with you before anything starts. See the{" "}
        <CrossLink href="/dry-van-trucking/cost/">cost page</CrossLink> for how
        the numbers work.
      </>
    ),
  },
  {
    q: "Why does rate matter more on dry van than other trailers?",
    a: "Dry van has the most freight and the most carriers chasing it, so loads are easy to find but the rate is soft. Selective lane choice and negotiation are where the margin is.",
  },
  {
    q: "Do I have to sign a long contract?",
    a: "No. No long-term contract and no forced dispatch. You stay in control of which loads you take.",
  },
  {
    q: "Do you dispatch single-truck owner-operators?",
    a: "Yes. Owner-operators and small fleets running dry van are who we serve.",
  },
  {
    q: "Can you set up my authority too?",
    a: "Yes. See compliance services.",
    aNode: (
      <>
        Yes. See{" "}
        <CrossLink href="/compliance-services/">compliance services</CrossLink>.
      </>
    ),
  },
];

export default function DryVanDispatchPage() {
  return (
    <>
      <JsonLd
        data={graph(
          // Percentage model and unconfirmed dry van rate, so no price is encoded.
          serviceNode({
            serviceType: "Dry van dispatch",
            slug: "/dry-van-trucking/",
            description:
              "Tech Rig dispatches dry van owner-operators and small fleets, working the boards and broker relationships to defend rate per mile across general palletized freight.",
          }),
          breadcrumbNode([
            { name: "Home", slug: "/" },
            { name: "Dispatch Services", slug: "/services/" },
            { name: "Dry Van Dispatch" },
          ]),
          faqNode(faqs),
        )}
      />

      {/* Hero (Paper, asymmetric two-column): copy-dominant left, the dry van
          signature icon at spot scale right. No Authority Status Tracker. */}
      <Section surface="paper" className="pt-8 md:pt-12">
        <Container>
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Dispatch Services", href: "/services/" },
              { name: "Dry Van Dispatch" },
            ]}
          />
          <div className="mt-6 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h1 className="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink">
                Dry Van Dispatch Service
              </h1>
              {/* Hero lede, transcribed verbatim from the brief. Styled paragraph,
                  never an H-tag. */}
              <p className="mt-5 max-w-[60ch] text-lg text-slate">
                Dry van has the most freight and the most competition, which is
                exactly why the rate is where dispatch earns its keep. Loads are
                everywhere; the gap between a strong week and a flat one is
                negotiation and lane choice. Our dry van dispatch service works
                the boards and the broker relationships to protect your rate per
                mile, not just keep the wheels turning.
              </p>
              <div className="mt-7">
                <Link
                  href={filingCtaHref}
                  className={buttonVariants({ variant: "primary", size: "md" })}
                >
                  Get dispatched
                </Link>
              </div>
            </div>

            <DryVanSignature />
          </div>
        </Container>
      </Section>

      {/* What our dry van dispatch covers (Cloud) */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            What our dry van dispatch covers
          </h2>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2">
            {capabilities.map((c) => (
              <li key={c.label} className="flex gap-3">
                <RouteNodeIcon size={20} className="mt-0.5 shrink-0 text-steel" />
                <span className="text-ink">
                  <span className="font-display font-semibold">{c.label}</span>{" "}
                  {c.text}
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Equipment differentiator (Paper): the volume-workhorse angle, with the
          worked-scenario callout as a graceful empty-friendly example slot. */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            The volume workhorse, where negotiation matters most
          </h2>
          <p className="mt-4 max-w-[60ch] text-slate">
            <span className="font-display font-semibold text-ink">
              Dry van is the high-volume freight type,
            </span>{" "}
            which cuts both ways. Broad load availability means you rarely sit
            empty for lack of options, but that same volume invites rate
            compression: when everyone can pull the load, brokers price like it.
            That is why a good desk reads the lane, not just the load board, and
            holds out for the rate per mile your truck is worth.
          </p>

          {/* Worked scenario [CLIENT PROOF NEEDED]: research-led framing only.
              No client named, no metric. Quiet Steel-rule example callout. */}
          <p className="mt-6 border-l-4 border-steel pl-4 text-slate">
            Take a dry van carrier working through a soft market who wants to
            defend rate per mile rather than chase volume. The dispatch work
            there is selective: choosing lanes with leverage and pushing back on
            lowball offers instead of booking everything that posts. Client stories appear here as permissions clear.
          </p>
        </Container>
      </Section>

      {/* Dry van dispatch pricing (Cloud): rate on request in mono, NOT a guessed
          percentage and NOT a PriceChip. The /cost/ child link lives here. */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            Dry van dispatch pricing
          </h2>
          <p className="mt-4 max-w-[60ch] text-slate">
            We price dry van dispatch as a percentage of your gross, so we earn
            only when you do.
          </p>

          {/* Mono "price" treatment. Dry van percentage is unconfirmed in the
              single source, so this stays "Rate on request" until [VERIFY]. */}
          <div className="mt-6 inline-flex items-baseline gap-3 rounded-card border border-slate/20 bg-cloud px-5 py-4">
            <span className="font-mono text-2xl font-semibold tabular-nums text-ink">
              Rate on request
            </span>
            <span className="font-mono text-sm uppercase tracking-[0.08em] text-slate">
              % of gross
            </span>
          </div>

          <p className="mt-6 max-w-[60ch] text-slate">
            Want the breakdown before you talk to us? Our{" "}
            <CrossLink href="/dry-van-trucking/cost/">dry van cost page</CrossLink>{" "}
            walks through how the percentage works and what it covers.
          </p>

          {/* The dispatch trust signal, given real visual weight on every page. */}
          <p className="mt-6 border-l-4 border-steel pl-4 font-medium text-ink">
            No long-term contract, no forced dispatch, no sign-up to lock you in.
          </p>
        </Container>
      </Section>

      {/* Need authority first? funnel band: full-bleed Ink, the dispatch-to-
          compliance bridge. Inline Steel anchors, no second primary button. */}
      <Section surface="ink">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-cloud">
            Need authority first? We can do both halves
          </h2>
          <p className="mt-4 text-cloud/80">
            Not active yet? We also stand up the company: see{" "}
            <InkLink href="/compliance-services/">compliance services</InkLink>{" "}
            or our{" "}
            <InkLink href="/how-to-start-a-trucking-company/">
              guide to starting a trucking company
            </InkLink>
            . One team gets you road-legal and then keeps you loaded, so there is
            no handoff and no gap between authority and your first dry van load.
          </p>

          {/* Two-node Get road-legal -> Keep loaded diagram (one Steel accent). */}
          <div className="mt-8 flex items-center gap-4">
            <span className="rounded-btn border border-cloud/30 px-4 py-2 font-display text-sm font-semibold text-cloud">
              Get road-legal
            </span>
            <ArrowRightIcon size={24} className="text-steel" />
            <span className="rounded-btn border border-cloud/30 px-4 py-2 font-display text-sm font-semibold text-cloud">
              Keep loaded
            </span>
          </div>
        </Container>
      </Section>

      {/* Dry van dispatch FAQ (Cloud) */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            Dry van dispatch FAQ
          </h2>
          <div className="mt-6">
            <FaqAccordion items={faqs} />
          </div>
        </Container>
      </Section>

      <ClosingCta
        text="Stop booking every load and start defending your rate per mile. Get dispatched."
        cta={{ label: "Get dispatched", href: filingCtaHref }}
      />
    </>
  );
}

/**
 * The hero signature visual: the dry van line icon at spot-illustration scale
 * with a quiet "dense node field plus rate-protection accent" motif (the brief's
 * volume-workhorse angle). Built from borders and inline SVG, one Steel accent,
 * no numbers or percentages, no Authority Status Tracker.
 */
function DryVanSignature() {
  return (
    <div
      className="rounded-card border border-slate/15 bg-cloud p-6"
      aria-label="Dry van dispatch: a dense field of available loads, with one held back for rate."
    >
      <p className="font-mono text-sm uppercase tracking-[0.08em] text-slate">
        High volume, held for rate
      </p>
      <div className="mt-5 flex items-center gap-4">
        <DryVanIcon size={56} className="shrink-0 text-ink" />
        {/* Dense node field: many available loads, one Steel node held back as
            the "right rate" pick. Decorative, drawn from CSS and inline SVG. */}
        <div
          className="grid grid-cols-5 gap-2"
          aria-hidden="true"
        >
          {Array.from({ length: 14 }).map((_, i) => (
            <span
              key={i}
              className="size-2.5 rounded-full border border-slate/40"
            />
          ))}
          <span className="size-2.5 rounded-full border-2 border-steel bg-steel/20" />
        </div>
      </div>
      <div className="mt-5 flex items-center gap-2 border-t-2 border-steel pt-4 text-steel">
        <RouteNodeIcon size={18} />
        <span className="font-mono text-sm uppercase tracking-[0.08em]">
          Rate per mile, defended
        </span>
      </div>
    </div>
  );
}

// Steel inline cross-link on a Paper/Cloud surface (1 to 3 word contextual
// anchor), never a button. Used in the pricing copy and the FAQ aNodes.
function CrossLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
    >
      {children}
    </Link>
  );
}

// Inline link tuned for the Ink funnel band: Steel anchor with a Cloud focus
// ring for contrast against the dark surface.
function InkLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cloud"
    >
      {children}
    </Link>
  );
}
