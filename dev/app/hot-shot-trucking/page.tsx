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
  HotShotIcon,
  RouteNodeIcon,
} from "@/components/icons";
import { breadcrumbNode, faqNode, graph, serviceNode } from "@/lib/schema";
import { filingCtaHref } from "@/lib/site";

export const metadata: Metadata = {
  // Title tag with brand stripped per the dev rule; the brand is reattached by
  // the root layout template, so the page-level title carries no " | Tech Rig".
  title: "Hot Shot Dispatch Service",
  description:
    "Hot shot dispatch service for dually and gooseneck operators. We keep your truck on quick-turn expedite lanes that fit its size and your hours, with no forced dispatch.",
  alternates: { canonical: "/hot-shot-trucking/" },
  openGraph: {
    title: "Hot Shot Dispatch Service",
    description:
      "Hot shot dispatch service for dually and gooseneck operators. We keep your truck on quick-turn expedite lanes that fit its size and your hours, with no forced dispatch.",
    url: "/hot-shot-trucking/",
    type: "website",
  },
};

// What hot shot dispatch covers. Same five-capability shape as the franchise,
// reworded for the hot shot lane profile (expedited, smaller, quick-turn loads
// on a dually and gooseneck) so no 8+ word sentence repeats another trailer.
const capabilities = [
  "Load matching to quick-turn expedite freight sized for a dually and gooseneck.",
  "Rate negotiation so the speed you run actually shows up in the rate.",
  "Route planning that keeps the next expedite run lined up, not the truck idle.",
  "Billing and paperwork, rate confirmations, and the documents your factoring needs.",
  "Support when an expedite window or a lane shifts mid-run.",
];

// Hot shot percentage is NOT confirmed in services.md. Per the [VERIFY hot shot
// %] discipline in the brief, the figure renders as "Rate on request" in the
// mono price treatment, never a guessed number. It is not a PriceChip (that is
// for fixed/from compliance fees), and no Offer/price is attached to the
// Service node.
//
// [VERIFY hot shot %] confirm the hot shot dispatch percentage with the client
// before publishing a number here.
const dispatchRate = "Rate on request";

// One source feeds both the visible FAQ and the FAQPage schema (verbatim
// parity). Wording is deliberately distinct from the UCR page's Maryland
// hotshot telling and from the other trailer pages (uniqueness rule). The
// authority answer carries an inline Steel link via aNode; the plain `a`
// string stays identical to the visible text for schema parity.
const faqs: Faq[] = [
  {
    q: "What does hot shot dispatch cost?",
    a: "A percentage of your gross, set by equipment. The hot shot rate is on request; we confirm it before you commit.",
  },
  {
    q: "Do you lock me into a contract?",
    a: "No long-term contract and no forced dispatch.",
  },
  {
    q: "Will you dispatch a single dually and gooseneck?",
    a: "Yes. Single-truck hot shot operators are exactly who this is built for.",
  },
  {
    q: "What loads suit a hot shot setup?",
    a: "Smaller, time-sensitive freight on expedite and MDT lanes, sized to a 3500-class dually rather than full truckloads.",
  },
  {
    q: "I am newly authorised. Can you still dispatch me?",
    a: "Yes. Many hot shot operators are new to their own authority, and we start dispatching as soon as you are active.",
  },
  {
    q: "Can you get my authority set up as well?",
    a: "Yes. See compliance services.",
    aNode: (
      <>
        Yes. See{" "}
        <CrossLink href="/compliance-services/">compliance services</CrossLink>.
      </>
    ),
  },
];

export default function HotShotDispatchPage() {
  return (
    <>
      <JsonLd
        data={graph(
          // Percentage model and an unconfirmed rate, so no Offer/price is
          // encoded on the Service node.
          serviceNode({
            serviceType: "Hot shot dispatch",
            slug: "/hot-shot-trucking/",
            description:
              "Tech Rig dispatches hot shot owner-operators running a dually and gooseneck, matching quick-turn expedite freight, negotiating rates, and handling paperwork on a percentage model with no long-term contract.",
          }),
          breadcrumbNode([
            { name: "Home", slug: "/" },
            { name: "Dispatch Services", slug: "/services/" },
            { name: "Hot Shot Dispatch" },
          ]),
          faqNode(faqs),
        )}
      />

      {/* Hero (Paper): copy-dominant left, the hot-shot spot illustration with
          the expedite-lane motif right (the trailer-page signature visual, NOT
          the Authority Status Tracker). */}
      <Section surface="paper" className="pt-8 md:pt-12">
        <Container>
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Dispatch Services", href: "/services/" },
              { name: "Hot Shot Dispatch" },
            ]}
          />
          <div className="mt-6 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h1 className="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink">
                Hot Shot Dispatch Service
              </h1>
              {/* Hero lede transcribed verbatim from the brief. */}
              <p className="mt-5 max-w-[60ch] text-lg text-slate">
                Hot shot runs on speed and flexibility. Smaller, time-sensitive
                loads on a dually and gooseneck can pay strong when you move
                fast, but the expedite lanes and the brokers who post them take
                knowing where to look. Our hot shot dispatch service keeps your
                truck on quick-turn freight that fits its size and your hours, so
                the speed becomes revenue.
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

            <HotShotHeroVisual />
          </div>
        </Container>
      </Section>

      {/* What our hot shot dispatch covers (Cloud): the five-item capability
          list in the line-icon-row treatment, two-up on desktop. */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            What our hot shot dispatch covers
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

      {/* Built for dually and gooseneck operators (Paper): the equipment-specific
          differentiator, the page's unique angle. A typographic emphasis block,
          not a card grid, beside the expedite-lane line motif. The worked
          scenario lives here as a graceful empty-state callout: [CLIENT PROOF
          NEEDED], research-led framing, no client named, no metric, no dispatch
          result implied for the real MD compliance client. */}
      <Section surface="paper">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="font-display text-3xl font-bold text-ink">
                Built for dually and gooseneck operators
              </h2>
              {/* Bold styled lead-in, a styled paragraph, never an H-tag. */}
              <p className="mt-4 max-w-[60ch] text-lg font-semibold text-ink">
                A dually and gooseneck earns on expedite and MDT lanes that a
                full truckload carrier cannot serve as quickly.
              </p>
              <p className="mt-4 max-w-[60ch] text-slate">
                Many hot shot operators are running their own authority for the
                first time, so we keep the dispatch tuned to a 3500-class setup:
                quick-turn freight, the brokers who post it, and the paperwork
                handled while you drive. Not active yet? See our{" "}
                <CrossLink href="/compliance-services/">
                  compliance services
                </CrossLink>
                .
              </p>

              {/* Worked-scenario callout, graceful empty state. Research-led
                  framing transcribed from the brief, no client named. */}
              <div className="mt-6 max-w-[60ch] border-l-4 border-steel pl-4">
                <p className="font-mono text-xs uppercase tracking-[0.08em] text-slate">
                  Worked scenario
                </p>
                <p className="mt-2 text-slate">
                  A hotshot operator wants consistent expedited runs sized to a
                  3500-class dually rather than waiting on the occasional premium
                  load. A named carrier story goes here once a client clears one
                  to share.
                </p>
              </div>
            </div>

            <ExpediteLaneMotif />
          </div>
        </Container>
      </Section>

      {/* Hot shot dispatch pricing (Cloud): the percentage model in the mono
          "price" treatment. The hot shot percentage is not in the single source,
          so it renders "Rate on request", never a guessed number, never a
          PriceChip. The trust lead-out follows. */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            Hot shot dispatch pricing
          </h2>
          <p className="mt-4 max-w-[60ch] text-slate">
            We charge a percentage of your gross by equipment, so we earn only
            when you do.
          </p>

          {/* The headline rate as a single mono figure. The hot shot percentage
              is not yet confirmed, so this stays "Rate on request". */}
          <p className="mt-6 font-mono text-3xl font-semibold tabular-nums text-ink">
            {dispatchRate}
          </p>

          {/* The trust lead-out, given real visual weight (the dispatch
              equivalent of fee-transparency). */}
          <p className="mt-6 border-l-4 border-steel pl-4 font-medium text-ink">
            No long-term contract, no forced dispatch, no lock-in.
          </p>

          <p className="mt-6 max-w-[60ch] text-slate">
            We confirm your hot shot rate before you commit to anything, with the
            percentage in writing. We earn a share, so keeping your runs quick and
            your rates strong is our job too.
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
            New to your own authority? We can get a hot shot setup legally
            running first: USDOT, MC authority, BOC-3, and the driver
            paperwork. See{" "}
            <InkLink href="/compliance-services/">compliance services</InkLink>.
            One team gets you road-legal, then keeps you on expedite freight after.
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

      {/* Hot shot dispatch FAQ (Cloud) */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            Hot shot dispatch FAQ
          </h2>
          <div className="mt-6">
            <FaqAccordion items={faqs} />
          </div>
        </Container>
      </Section>

      <ClosingCta
        text="Turn a fast dually and gooseneck into steady expedite revenue. Get dispatched."
        cta={{ label: "Get dispatched", href: filingCtaHref }}
      />
    </>
  );
}

/**
 * The hero signature visual: the hot shot trailer icon at spot-illustration
 * scale (the same hotShot icon used on its dispatch-hub card so the silo reads
 * consistently) with a quiet motif of fast expedite lanes around it, signalling
 * the hot shot load profile (quick-turn, time-sensitive runs). Single-line SVG,
 * one Steel accent, no utilization or revenue numbers. Static by default; the
 * one calm on-load animation lives in the design system, not here.
 */
function HotShotHeroVisual() {
  return (
    <div
      className="rounded-card border border-slate/15 bg-cloud p-8"
      aria-label="A dually and gooseneck on fast expedite lanes."
    >
      <p className="font-mono text-sm uppercase tracking-[0.08em] text-slate">
        Hot shot dispatch
      </p>
      <div className="mt-6 grid place-items-center">
        {/* The enlarged hot-shot icon, the unmistakable equipment cue. */}
        <HotShotIcon size={120} className="text-ink" />
      </div>
      {/* The expedite-lane motif: quick-turn labels, one Steel accent. */}
      <ul className="mt-6 flex flex-wrap justify-center gap-3">
        {["Expedite", "MDT", "Quick-turn"].map((label) => (
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
 * The differentiator motif: a small hot shot rig set against fast expedite
 * lanes, to make the "speed becomes revenue" point visually. Single-line SVG,
 * 2px stroke, one Steel accent on the rig. No numbers in the art.
 */
function ExpediteLaneMotif() {
  return (
    <div
      className="rounded-card border border-slate/15 bg-cloud p-6"
      aria-label="A hot shot rig running fast expedite lanes."
    >
      <p className="font-mono text-sm uppercase tracking-[0.08em] text-slate">
        Expedite lanes
      </p>
      {/* Fast "lane" rows, the quick-turn cue, the rig reading across. */}
      <ul className="mt-5 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <li key={i} className="flex items-center gap-3">
            <span className="h-2 flex-1 rounded-full bg-slate/15" />
            <ArrowRightIcon size={16} className="shrink-0 text-slate/50" />
          </li>
        ))}
      </ul>
      <div className="mt-5 flex items-center gap-3 border-t-2 border-steel pt-4 text-steel">
        <HotShotIcon size={28} />
        <span className="font-mono text-xs uppercase tracking-[0.08em]">
          Speed becomes revenue
        </span>
      </div>
    </div>
  );
}

// Steel inline cross-link on a Paper/Cloud surface (1 to 3 word contextual
// anchor), never a button. Used by the differentiator and FAQ aNode.
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
