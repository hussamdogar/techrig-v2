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
  PowerOnlyIcon,
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
  // Title tag with brand stripped per the dev rule; the brand is reattached by
  // the root layout template, so the page-level title carries no " | Tech Rig".
  title: "Power Only Dispatch Service",
  description:
    "Power only dispatch that keeps you rolling on drop-and-hook freight. We line up the carrier and 3PL relationships that supply trailers, with no forced dispatch.",
  alternates: { canonical: "/power-only-trucking/" },
  openGraph: {
    title: "Power Only Dispatch Service",
    description:
      "Power only dispatch that keeps you rolling on drop-and-hook freight. We line up the carrier and 3PL relationships that supply trailers, with no forced dispatch.",
    url: "/power-only-trucking/",
    type: "website",
  },
};

// "What our power only dispatch covers": the system line-icon-row capability
// list, content-bearing rows, two-up on desktop. Wording is power-only specific
// so no row repeats a sibling trailer page.
const capabilities = [
  {
    label: "Drop-and-hook sequencing",
    text: "so the next preloaded trailer is ready when you drop the last.",
  },
  {
    label: "Trailer-supply relationships",
    text: "with the carriers and 3PLs that provide the equipment you pull.",
  },
  {
    label: "Rate negotiation",
    text: "on the moves, so utilization turns into revenue, not just miles.",
  },
  {
    label: "Routing around dwell",
    text: "to keep your hours on driving instead of waiting at a dock.",
  },
  {
    label: "Billing and paperwork",
    text: "including rate confirmations and the documents factoring needs.",
  },
];

// One source feeds both the visible FAQ and the FAQPage schema (verbatim parity).
// The closing answer carries an inline Steel link via aNode; the plain `a` string
// stays identical for schema parity. Pricing answer says "rate on request" until
// the power only percentage is confirmed ([VERIFY power only %]), never a number.
const faqs: Faq[] = [
  {
    q: "What is power only dispatch?",
    a: "It is dispatch for tractors that pull trailers a shipper or 3PL supplies, instead of your own. We book the drop-and-hook moves and the relationships behind them.",
  },
  {
    q: "How does your power only pricing work?",
    a: "Rate on request. Our power only percentage is confirmed with you before any work starts; we do not quote a number we have not set.",
  },
  {
    q: "Do I need my own trailer to run power only?",
    a: "No. The point of power only is that the trailer comes from the carrier or 3PL you pull for, so you bring the tractor and the driving hours.",
  },
  {
    q: "Do you lock me into a contract?",
    a: "No. No long-term contract and no forced dispatch.",
  },
  {
    q: "Can you set up my authority too?",
    a: "Yes. See compliance services.",
    aNode: (
      <>
        Yes. See <CrossLink href="/compliance-services/">compliance services</CrossLink>.
      </>
    ),
  },
];

export default function PowerOnlyDispatchPage() {
  return (
    <>
      <JsonLd
        data={graph(
          // Percentage model not yet confirmed, so no price is encoded on the
          // Service node ([VERIFY power only %]).
          serviceNode({
            serviceType: "Power only dispatch",
            slug: "/power-only-trucking/",
            description:
              "Tech Rig dispatches power only operators on drop-and-hook freight, lining up the carrier and 3PL relationships that supply trailers, with no long-term contract and no forced dispatch.",
          }),
          breadcrumbNode([
            { name: "Home", slug: "/" },
            { name: "Dispatch Services", slug: "/services/" },
            { name: "Power Only Dispatch" },
          ]),
          faqNode(faqs),
        )}
      />

      {/* Hero (Paper): copy-dominant left, the power only drop-and-hook motif
          right (the trailer's own line icon, NOT the Authority Status Tracker). */}
      <Section surface="paper" className="pt-8 md:pt-12">
        <Container>
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Dispatch Services", href: "/services/" },
              { name: "Power Only Dispatch" },
            ]}
          />
          <div className="mt-6 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h1 className="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink">
                Power Only Dispatch for Drop-and-Hook Carriers
              </h1>
              {/* Hero lede transcribed VERBATIM from the brief (styled paragraph,
                  never an H-tag). */}
              <p className="mt-5 max-w-[60ch] text-lg text-slate">
                Power only is about utilization. When you pull trailers that
                shippers and 3PLs provide, drop-and-hook keeps you rolling
                instead of waiting to load, but only when the work is sequenced
                well. Our power only dispatch service lines up drop-and-hook
                freight and the carrier and 3PL relationships that supply
                trailers, so your hours go to driving, not sitting.
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

            <DropAndHookMotif />
          </div>
        </Container>
      </Section>

      {/* What our power only dispatch covers (Cloud) */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            What our power only dispatch covers
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

      {/* Equipment differentiator (Paper): the distinct power only angle, with
          the worked scenario as the system's quiet example callout. */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            Why power only runs on trailer supply, not your own deck
          </h2>
          <p className="mt-4 max-w-[60ch] text-slate">
            <span className="font-display font-semibold text-ink">
              You bring the tractor; the trailer comes from someone else.
            </span>{" "}
            That changes the dispatch job. Instead of owning a single deck, you
            are coupling to trailers that carriers and 3PLs stage, so the freight
            has to be lined up move to move. Good power only work is back-to-back
            drop-and-hook: you uncouple one preloaded trailer and roll onto the
            next, rather than circling back for live loads. The carrier and 3PL
            relationships behind that supply are what make the difference between
            steady utilization and a tractor parked between jobs.
          </p>

          {/* Worked scenario: [CLIENT PROOF NEEDED] rendered as the graceful
              empty-friendly proof slot. Research-led framing per the brief's
              honesty note: no client named, no metric, no dispatch result for the
              NC power-only client (that is a compliance engagement, not dispatch). */}
          <p className="mt-8 max-w-2xl border-l-[1.5px] border-steel pl-4 text-slate">
            Picture a power-only operator who wants back-to-back drop-and-hook
            moves so the truck rolls from one preloaded trailer straight to the
            next. That is the work this desk is built to sequence. A named carrier
            story goes here once a client clears us to share it.
          </p>
        </Container>
      </Section>

      {/* Power only dispatch pricing (Cloud): the mono "price" treatment. The
          power only percentage is NOT confirmed in the single source, so it
          renders "Rate on request" in mono ([VERIFY power only %]), never a
          guessed number and never a PriceChip. */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            Power only dispatch pricing
          </h2>
          <p className="mt-4 max-w-[60ch] text-slate">
            We charge a percentage of your gross, so we earn only when you do.
            The power only percentage is set with you before any work begins.
          </p>

          <table className="mt-6 w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate/25">
                <th className="py-2 pr-4 font-display text-sm font-semibold text-ink">
                  Equipment
                </th>
                <th className="py-2 font-display text-sm font-semibold text-ink">
                  Dispatch rate
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate/15">
                <td className="py-2 pr-4 text-slate">Power only</td>
                {/* [VERIFY power only %]: rate on request in mono, never guessed. */}
                <td className="py-2 font-mono tabular-nums text-ink">
                  Rate on request
                </td>
              </tr>
            </tbody>
          </table>

          {/* The dispatch trust signal, weighted like compliance fee-transparency. */}
          <p className="mt-6 border-l-4 border-steel pl-4 font-medium text-ink">
            No long-term contract, no forced dispatch, no sign-up to lock you in.
          </p>
        </Container>
      </Section>

      {/* Need authority first? funnel band: full-bleed Ink (reserved high-emphasis),
          the dispatch-to-compliance bridge. Inline Steel anchors, no second
          primary button competing with the hero/close amber action. */}
      <Section surface="ink">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-cloud">
            Need authority first? We can do both halves
          </h2>
          <p className="mt-4 text-cloud/80">
            Power only still needs an active carrier or you cannot accept a
            trailer. If you are not road-legal yet, we also handle the setup: see{" "}
            <InkLink href="/compliance-services/">compliance services</InkLink> or
            our{" "}
            <InkLink href="/how-to-start-a-trucking-company/">
              guide to starting a trucking company
            </InkLink>
            . One team gets your authority active and then keeps your tractor
            coupled to paying freight, with no handoff between the two.
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

      {/* Power only dispatch FAQ (Cloud) */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            Power only dispatch FAQ
          </h2>
          <div className="mt-6">
            <FaqAccordion items={faqs} />
          </div>
        </Container>
      </Section>

      <ClosingCta
        text="Keep your tractor coupled to paying freight instead of sitting between loads. Get dispatched."
        cta={{ label: "Get dispatched", href: filingCtaHref }}
      />
    </>
  );
}

/**
 * The hero power only motif: a quiet drop-and-hook diagram that replaces the
 * compliance Authority Status Tracker. The trailer's own line icon at spot scale
 * over a coupling-loop expression (couple -> roll -> drop -> next), built from
 * borders and inline SVG, one Steel accent, no utilization or revenue numbers.
 */
function DropAndHookMotif() {
  const steps = ["Couple", "Roll", "Drop and hook next"];
  return (
    <div
      className="rounded-card border border-slate/15 bg-cloud p-6"
      aria-label="The power only loop: couple to a supplied trailer, roll, drop and hook the next."
    >
      <div className="flex items-center justify-between">
        <p className="font-mono text-sm uppercase tracking-[0.08em] text-slate">
          Drop and hook
        </p>
        <PowerOnlyIcon size={36} className="text-steel" />
      </div>
      <ul className="mt-5 space-y-4">
        {steps.map((label, i) => (
          <li key={label} className="flex items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full border-2 border-steel text-steel">
              <RouteNodeIcon size={18} />
            </span>
            <span className="font-display font-semibold text-ink">{label}</span>
            {i < steps.length - 1 ? (
              <ArrowRightIcon size={18} className="ml-auto text-slate" />
            ) : null}
          </li>
        ))}
      </ul>
      {/* The "repeat" closing arm, drawn as a 2px line returning to the top. */}
      <div className="mt-4 flex items-center gap-2 border-t-2 border-steel pt-4 text-steel">
        <ArrowRightIcon size={18} className="-scale-x-100" />
        <span className="font-mono text-sm uppercase tracking-[0.08em]">
          Repeat
        </span>
      </div>
    </div>
  );
}

// Steel inline cross-link on a Paper/Cloud surface (1 to 3 word contextual
// anchor), never a button. Used by the FAQ aNode.
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
