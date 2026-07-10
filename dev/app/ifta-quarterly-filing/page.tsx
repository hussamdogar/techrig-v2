import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { PriceChip } from "@/components/ui/price-chip";
import { FaqAccordion, type Faq } from "@/components/faq-accordion";
import { ReviewedBy } from "@/components/reviewed-by";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ClosingCta } from "@/components/closing-cta";
import { JsonLd } from "@/components/json-ld";
import { FilingIcon, ClockIcon } from "@/components/icons";
import {
  breadcrumbNode,
  faqNode,
  graph,
  personNode,
  serviceNode,
} from "@/lib/schema";
import { pricing } from "@/lib/services";

// The apply flow, pre-selecting the IFTA quarterly service (brief CTA route).
// This is the recurring per-quarter return, distinct from filingCtaHref setups.
const ctaHref = "/apply/?service=ifta-quarterly";

export const metadata: Metadata = {
  title: "IFTA Quarterly Filing Service | Tech Rig",
  description:
    "Hand off your IFTA quarterly filing. Tech Rig prepares and files your fuel-tax return from your mileage and fuel records each quarter, for $150 plus the tax due.",
  alternates: { canonical: "/ifta-quarterly-filing/" },
  openGraph: {
    title: "IFTA Quarterly Filing Service",
    description:
      "Tech Rig prepares and files your IFTA fuel-tax return each quarter from your mileage and fuel records, for $150 per quarter plus the tax due.",
    url: "/ifta-quarterly-filing/",
    type: "website",
  },
};

// One source feeds both the visible FAQ and the FAQPage schema (verbatim parity).
// The /ifta-registration/ cross-link in the first answer is rendered via aNode;
// the plain `a` string stays link-free so the schema text matches the visible copy.
const faqs: Faq[] = [
  {
    q: "How is this different from IFTA registration?",
    a: "IFTA registration is the one-time $225 standalone setup ($175 in-bundle). This is the recurring quarterly return you owe after you are set up.",
    aNode: (
      <>
        <CrossLink href="/ifta-registration/">IFTA registration</CrossLink> is
        the one-time $225 standalone setup ($175 in-bundle). This is the
        recurring quarterly return you owe after you are set up.
      </>
    ),
  },
  {
    q: "What does it cost?",
    a: "$150 per quarter for our service, plus any fuel tax due to the jurisdictions.",
  },
  {
    q: "What do you need from me?",
    a: "Your mileage and fuel records for the quarter. With complete records we file within 1 to 3 business days.",
  },
  {
    q: "How often is it due?",
    a: "Quarterly. We remind you before each deadline.",
  },
];

export default function IftaQuarterlyFilingPage() {
  return (
    <>
      <JsonLd
        data={graph(
          // Price is the $150 service fee only. The fuel tax due is a separate
          // government amount and is never encoded as the schema price.
          serviceNode({
            serviceType: "IFTA quarterly filing",
            slug: "/ifta-quarterly-filing/",
            description:
              "Tech Rig prepares and files your IFTA fuel-tax return each quarter from your mileage and fuel records.",
            price: 150,
          }),
          breadcrumbNode([
            { name: "Home", slug: "/" },
            { name: "Compliance Services", slug: "/compliance-services/" },
            { name: "IFTA Quarterly Filing" },
          ]),
          faqNode(faqs),
          personNode("robert"),
        )}
      />

      {/* Hero (simple, no Authority Status Tracker per design spec §13) */}
      <Section surface="paper" className="pt-8 md:pt-12">
        <Container>
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Compliance Services", href: "/compliance-services/" },
              { name: "IFTA Quarterly Filing" },
            ]}
          />
          <div className="mt-6 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h1 className="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink">
                IFTA Quarterly Filing Service
              </h1>
              <p className="mt-5 max-w-[60ch] text-lg text-slate">
                IFTA is not a one-time setup. Every quarter you have to file a
                fuel-tax return that reconciles the miles you ran against the
                fuel you bought in each state, and a late or wrong return means
                penalties and audit risk. Tech Rig handles your IFTA quarterly
                filing: you send your mileage and fuel records, we prepare and
                file the return. Already set up for IFTA? This is the ongoing
                service that keeps you current.
              </p>

              {/* Standfirst Deck: the anchor facts, each traceable to a brief
                  sentence. Static, structural; no count-up. */}
              <ul className="mt-6 space-y-2 border-l-4 border-steel pl-4 text-slate">
                <li>
                  <span className="font-mono font-medium text-ink">$150</span>{" "}
                  per quarter, our service fee.
                </li>
                <li>
                  Plus any fuel tax due to the jurisdictions (separate).
                </li>
                <li>
                  Filed in{" "}
                  <span className="font-mono font-medium text-ink">
                    1 to 3 business days
                  </span>{" "}
                  after we have your complete records.
                </li>
              </ul>

              <div className="mt-7">
                <Link
                  href={ctaHref}
                  className={buttonVariants({ variant: "primary", size: "md" })}
                >
                  File my IFTA quarter
                </Link>
              </div>
              <div className="mt-5">
                <ReviewedBy name="Robert Hooke" role="Co-Founder" />
              </div>
            </div>

            {/* Signature visual: the quarterly cycle as four ordered nodes
                reading as a recurring loop. Two-tone Ink/Steel with one Signal
                accent on the current quarter. Single-line SVG, 2px stroke. */}
            <QuarterlyCycle />
          </div>
        </Container>
      </Section>

      {/* What IFTA quarterly filing is */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            What IFTA quarterly filing is
          </h2>
          <p className="mt-4 text-slate">
            After your{" "}
            <CrossLink href="/ifta-registration/">IFTA registration</CrossLink>{" "}
            is in place, you owe a return every quarter. The return totals your
            miles and fuel by jurisdiction and settles the difference, you
            either owe tax or carry a credit. Keeping clean mileage and fuel
            records as you go is what makes each quarter simple. We do the
            preparation and filing from those records.
          </p>

          {/* The two-outcome pair (owe tax / carry a credit): a pair, not a
              sequence. Structural only. */}
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="flex gap-3 border-l-4 border-steel pl-4">
              <FilingIcon size={20} className="mt-0.5 shrink-0 text-steel" />
              <div>
                <dt className="font-display font-semibold text-ink">
                  Owe tax
                </dt>
                <dd className="text-slate">
                  You ran more miles than your fuel covered.
                </dd>
              </div>
            </div>
            <div className="flex gap-3 border-l-4 border-steel pl-4">
              <FilingIcon size={20} className="mt-0.5 shrink-0 text-steel" />
              <div>
                <dt className="font-display font-semibold text-ink">
                  Carry a credit
                </dt>
                <dd className="text-slate">
                  You bought more fuel than your miles used.
                </dd>
              </div>
            </div>
          </dl>
        </Container>
      </Section>

      {/* What our IFTA quarterly filing costs: the Split-Ledger Fee Receipt.
          Two lines, never blended: the $150 service fee, then the separate
          government fuel tax. */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            What our IFTA quarterly filing costs
          </h2>

          <div className="mt-6 flex flex-wrap items-start gap-6">
            {/* Service fee chip from the single source ($150 per quarter). */}
            <PriceChip
              price={pricing["/ifta-quarterly-filing/"]}
              label="per quarter, our service fee"
              govFeeNote="+ fuel tax due (varies, paid to the jurisdictions)"
            />
            <p className="max-w-[42ch] text-slate">
              The fuel tax due is a separate government amount. It depends on
              your miles and fuel, and it goes to the jurisdictions, not to us.
              We never fold it into the $150.
            </p>
          </div>

          {/* Recurring-billing honesty note (verbatim from the brief): reminder
              plus manual invoice, auto-charge only with express consent. No
              "automated reminder" claim, no countdown UI. */}
          <p className="mt-8 border-l-4 border-steel pl-4 text-slate">
            This is a recurring service. We remind you before each quarterly
            deadline and invoice the filing; we only auto-charge if you have
            expressly agreed to it.
          </p>
        </Container>
      </Section>

      {/* How fast it is done */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            How fast it is done
          </h2>
          <p className="mt-4 flex gap-3 text-slate">
            <ClockIcon size={24} className="mt-1 shrink-0 text-steel" />
            <span>
              Within{" "}
              <span className="font-mono font-medium text-ink">
                1 to 3 business days
              </span>{" "}
              after we have your complete mileage and fuel records for the
              quarter. The sooner your records are in, the sooner we file ahead
              of the deadline.
            </span>
          </p>
        </Container>
      </Section>

      {/* FAQ */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            IFTA quarterly filing FAQ
          </h2>
          <div className="mt-6">
            <FaqAccordion items={faqs} />
          </div>

          {/* Compliance cross-links kept where the copy places them. IRP pairs
              with interstate-setup context; both are Steel and subordinate. */}
          <p className="mt-8 text-sm text-slate">
            Not set up yet? Start with{" "}
            <CrossLink href="/ifta-registration/">IFTA registration</CrossLink>{" "}
            or{" "}
            <CrossLink href="/irp-registration/">IRP registration</CrossLink>.
            See all our{" "}
            <CrossLink href="/compliance-services/">
              compliance services
            </CrossLink>
            .
          </p>
        </Container>
      </Section>

      <ClosingCta
        text="Quarter coming due? Send your records and we will file your IFTA return."
        cta={{ label: "File my IFTA quarter", href: ctaHref }}
      />
    </>
  );
}

// Steel inline cross-link (1 to 3 word contextual anchor), never a button.
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

// The quarterly-cycle motif: four ordered quarter nodes (Q1 to Q4) on a loop,
// reading as the recurring return. Two-tone Ink/Steel, with the Signal accent
// on the current quarter only (rationed). Single-line SVG, 2px stroke, static
// (no looping animation), so it does not move while the user reads.
function QuarterlyCycle() {
  // Four nodes on a ring; Q3 carries the single Signal accent as "current".
  const nodes = [
    { cx: 110, cy: 30, label: "Q1", accent: false },
    { cx: 190, cy: 110, label: "Q2", accent: false },
    { cx: 110, cy: 190, label: "Q3", accent: true },
    { cx: 30, cy: 110, label: "Q4", accent: false },
  ];
  return (
    <div className="flex justify-center lg:justify-end">
      <svg
        viewBox="0 0 220 220"
        className="h-auto w-full max-w-[280px]"
        role="img"
        aria-label="The IFTA filing cycle repeats every quarter, Q1 through Q4."
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* The loop ring connecting the four quarters. */}
        <circle cx="110" cy="110" r="80" className="text-slate/40" />
        {nodes.map((n) => (
          <g key={n.label}>
            <circle
              cx={n.cx}
              cy={n.cy}
              r="22"
              className={n.accent ? "text-signal" : "text-steel"}
              fill="currentColor"
              fillOpacity={n.accent ? 0.12 : 0}
              stroke="currentColor"
            />
            <text
              x={n.cx}
              y={n.cy + 5}
              textAnchor="middle"
              stroke="none"
              fill="currentColor"
              className={
                n.accent
                  ? "fill-signal font-mono text-[14px] font-medium"
                  : "fill-ink font-mono text-[14px]"
              }
            >
              {n.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
