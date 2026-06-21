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
  BoxTruckIcon,
  RouteNodeIcon,
} from "@/components/icons";
import { breadcrumbNode, faqNode, graph, serviceNode } from "@/lib/schema";
import { filingCtaHref } from "@/lib/site";

export const metadata: Metadata = {
  // Title tag with brand stripped per the dev rule; the brand is reattached by
  // the root layout template, so the page-level title carries no " | Tech Rig".
  title: "Box Truck Dispatch Service",
  description:
    "Box truck dispatch that keeps you moving. We find loads, negotiate rates, and handle paperwork for box truck owner-operators, with no forced dispatch. By load.",
  alternates: { canonical: "/box-truck-dispatch/" },
  openGraph: {
    title: "Box Truck Dispatch Service",
    description:
      "Box truck dispatch that keeps you moving. We find loads, negotiate rates, and handle paperwork for box truck owner-operators, with no forced dispatch. By load.",
    url: "/box-truck-dispatch/",
    type: "website",
  },
};

// The five capabilities the box truck dispatch service covers (brief H2 "What
// our box truck dispatch service covers"). Box-truck-specific copy (regional
// and local lanes) is preserved verbatim from the brief.
const capabilities = [
  "Load matching for box truck lanes, including the regional and local work box trucks run.",
  "Rate negotiation so you are not taking the first number a broker offers.",
  "Route planning to keep utilization high and empty miles down.",
  "Billing and paperwork, rate confirmations, and the documents your factoring needs.",
  "Support when a load or a lane changes.",
];

// The flat 8% rate, the single source of truth for box truck dispatch pricing.
// A percentage-of-gross model, so it renders in mono, never a PriceChip and
// never on the Service node (no Offer price for a percentage model).
const dispatchRate = "8% of gross monthly revenue";

// One source feeds both the visible FAQ and the FAQPage schema (verbatim
// parity). Two answers carry an inline Steel link via aNode; the plain `a`
// string stays identical to the visible text for schema parity.
const faqs: Faq[] = [
  {
    q: "How much does box truck dispatch cost?",
    a: "8% of your gross monthly revenue. See the cost page for examples.",
    aNode: (
      <>
        8% of your gross monthly revenue. See the{" "}
        <CrossLink href="/box-truck-dispatch/cost/">cost page</CrossLink> for
        examples.
      </>
    ),
  },
  {
    q: "Do you require a contract?",
    a: "No long-term contract and no forced dispatch.",
  },
  {
    q: "Do you dispatch single box truck operators?",
    a: "Yes. Single trucks and small fleets are our core.",
  },
  {
    q: "What lanes do box trucks run?",
    a: "Often regional and local, with a wide mix of brokers. We match loads to how your truck actually runs.",
  },
  {
    q: "Can you also set up my authority?",
    a: "Yes, see compliance services.",
    aNode: (
      <>
        Yes, see{" "}
        <CrossLink href="/compliance-services/">compliance services</CrossLink>.
      </>
    ),
  },
];

export default function BoxTruckDispatchPage() {
  return (
    <>
      <JsonLd
        data={graph(
          // Percentage model, so no Offer/price is encoded on the Service node.
          serviceNode({
            serviceType: "Box truck dispatch",
            slug: "/box-truck-dispatch/",
            description:
              "Tech Rig dispatches box truck owner-operators and small fleets, matching regional and local loads, negotiating rates, and handling paperwork on a percentage model with no long-term contract.",
          }),
          breadcrumbNode([
            { name: "Home", slug: "/" },
            { name: "Dispatch Services", slug: "/services/" },
            { name: "Box Truck Dispatch" },
          ]),
          faqNode(faqs),
        )}
      />

      {/* Hero (Paper): copy-dominant left, the box-truck spot illustration with
          the regional load-node motif right (the trailer-page signature visual,
          NOT the Authority Status Tracker). */}
      <Section surface="paper" className="pt-8 md:pt-12">
        <Container>
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Dispatch Services", href: "/services/" },
              { name: "Box Truck Dispatch" },
            ]}
          />
          <div className="mt-6 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h1 className="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink">
                Box Truck Dispatch Service
              </h1>
              <p className="mt-5 max-w-[60ch] text-lg text-slate">
                Box truck freight moves differently from tractor-trailer freight:
                more local and regional runs, more broker variety, more pressure
                to keep utilization high. Our box truck dispatch service is built
                for that. We find the loads, push for better rates, and handle the
                paperwork so your box truck stays earning instead of sitting. It
                is our most established dispatch service, and box truck carriers
                are who we know best.
              </p>
              <div className="mt-7">
                <Link
                  href={filingCtaHref}
                  className={buttonVariants({ variant: "primary", size: "md" })}
                >
                  Get my box truck dispatched
                </Link>
              </div>
            </div>

            <BoxTruckHeroVisual />
          </div>
        </Container>
      </Section>

      {/* What our box truck dispatch service covers (Cloud): the five-item
          capability list in the line-icon-row treatment, two-up on desktop. */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            What our box truck dispatch service covers
          </h2>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2">
            {capabilities.map((text) => (
              <li key={text} className="flex gap-3">
                <RouteNodeIcon size={20} className="mt-0.5 shrink-0 text-steel" />
                <span className="text-ink">{text}</span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Built for box truck owner-operators (Paper): the equipment-specific
          differentiator, the page's unique angle. A typographic emphasis block,
          not a card grid, with the box-truck-against-load-board line motif. */}
      <Section surface="paper">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="font-display text-3xl font-bold text-ink">
                Built for box truck owner-operators
              </h2>
              {/* Bold styled lead-in, a styled paragraph, never an H-tag. */}
              <p className="mt-4 max-w-[60ch] text-lg font-semibold text-ink">
                Box truck operators often juggle more, shorter loads than
                over-the-road carriers, and chasing those loads yourself eats the
                day.
              </p>
              <p className="mt-4 max-w-[60ch] text-slate">
                We watch the boards and the broker relationships so you can drive.
                Whether you run one box truck or a few, the dispatch is tuned to
                how box trucks actually earn. New to box trucks? See our{" "}
                <CrossLink href="/how-to-start-a-box-truck-business/">
                  guide to starting a box truck business
                </CrossLink>
                .
              </p>
            </div>

            <LoadBoardMotif />
          </div>
        </Container>
      </Section>

      {/* Box truck dispatch pricing (Cloud): the flat 8% in the mono "price"
          treatment from the single source, NOT a PriceChip. The trust lead-out
          and the live /cost/ link follow. */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            Box truck dispatch pricing
          </h2>
          <p className="mt-4 max-w-[60ch] text-slate">
            We charge a flat percentage of your gross for box truck dispatch.
          </p>

          {/* The headline rate as a single mono figure (tabular figures). */}
          <p className="mt-6 font-mono text-3xl font-semibold tabular-nums text-ink">
            {dispatchRate}
          </p>

          {/* The trust lead-out, given real visual weight (the dispatch
              equivalent of fee-transparency). */}
          <p className="mt-6 border-l-4 border-steel pl-4 font-medium text-ink">
            No long-term contract, no forced dispatch, no lock-in.
          </p>

          <p className="mt-6 max-w-[60ch] text-slate">
            See typical numbers on our{" "}
            <CrossLink href="/box-truck-dispatch/cost/">
              box truck dispatch cost
            </CrossLink>{" "}
            page. We earn a percentage, so keeping your rates and utilization high
            is our job too.
          </p>
        </Container>
      </Section>

      {/* Need your authority first? (Ink): the funnel cross-link back to
          acquisition, a deliberate styled handoff. Inline Steel anchor, no
          second primary button competing with the hero/close amber action. */}
      <Section surface="ink">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-cloud">
            Need your authority first?
          </h2>
          <p className="mt-4 text-cloud/80">
            Not active yet? We can get your box truck legally set up: USDOT, MC
            authority, BOC-3, insurance, and the rest. See{" "}
            <InkLink href="/compliance-services/">compliance services</InkLink>.
            The same team that gets you road-legal keeps you loaded after.
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

      {/* Box truck dispatch FAQ (Cloud) */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            Box truck dispatch FAQ
          </h2>
          <div className="mt-6">
            <FaqAccordion items={faqs} />
          </div>
        </Container>
      </Section>

      <ClosingCta
        text="Keep your box truck loaded without working the boards yourself. Get dispatched."
        cta={{ label: "Get my box truck dispatched", href: filingCtaHref }}
      />
    </>
  );
}

/**
 * The hero signature visual: the box truck trailer icon at spot-illustration
 * scale (the same boxTruck icon used on its dispatch-hub card so the franchise
 * reads consistently) with a quiet motif of short regional load nodes around it,
 * signalling the box-truck load profile (more, shorter, local runs). Single-line
 * SVG, one Steel accent, no utilization or revenue numbers. Static by default;
 * the one calm on-load animation lives in the design system, not here.
 */
function BoxTruckHeroVisual() {
  return (
    <div
      className="rounded-card border border-slate/15 bg-cloud p-8"
      aria-label="A box truck surrounded by short regional load nodes."
    >
      <p className="font-mono text-sm uppercase tracking-[0.08em] text-slate">
        Box truck dispatch
      </p>
      <div className="mt-6 grid place-items-center">
        {/* The enlarged box-truck icon, the unmistakable equipment cue. */}
        <BoxTruckIcon size={120} className="text-ink" />
      </div>
      {/* The regional-load-node motif: short, scattered nodes, one Steel accent. */}
      <ul className="mt-6 flex flex-wrap justify-center gap-3">
        {["Local", "Regional", "Short hops"].map((label) => (
          <li
            key={label}
            className="flex items-center gap-2 rounded-btn border border-slate/20 px-3 py-1.5"
          >
            <RouteNodeIcon size={16} className="text-steel" />
            <span className="font-mono text-xs uppercase tracking-[0.08em] text-slate">
              {label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The differentiator motif: a small box truck set against a busy load board, to
 * make the "more, shorter loads" point visually. Single-line SVG, 2px stroke,
 * one Steel accent on the box truck. No numbers in the art.
 */
function LoadBoardMotif() {
  return (
    <div
      className="rounded-card border border-slate/15 bg-cloud p-6"
      aria-label="A box truck against a busy load board of short loads."
    >
      <p className="font-mono text-sm uppercase tracking-[0.08em] text-slate">
        The load board
      </p>
      {/* Stacked "load" rows, the busy-board cue, the box truck reading across. */}
      <ul className="mt-5 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <li key={i} className="flex items-center gap-3">
            <span className="h-2 w-2 shrink-0 rounded-full bg-slate/40" />
            <span className="h-2 flex-1 rounded-full bg-slate/15" />
          </li>
        ))}
      </ul>
      <div className="mt-5 flex items-center gap-3 border-t-2 border-steel pt-4 text-steel">
        <BoxTruckIcon size={28} />
        <span className="font-mono text-xs uppercase tracking-[0.08em]">
          More, shorter loads
        </span>
      </div>
    </div>
  );
}

// Steel inline cross-link on a Paper/Cloud surface (1 to 3 word contextual
// anchor), never a button. Used by the differentiator, pricing, and FAQ aNodes.
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
