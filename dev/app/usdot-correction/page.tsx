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
import {
  CheckSealIcon,
  ClockIcon,
  FilingIcon,
  PhoneIcon,
  RouteNodeIcon,
  StampIcon,
} from "@/components/icons";
import {
  breadcrumbNode,
  faqNode,
  graph,
  personNode,
  serviceNode,
} from "@/lib/schema";
import { pricing } from "@/lib/services";

// This page's single action routes to the apply flow with the service
// preselected (apply/page.tsx reads ?service= and validates the key).
const applyHref = "/apply/?service=usdot-correction";

export const metadata: Metadata = {
  title: "USDOT Correction and Updates",
  description:
    "Need to fix or update your USDOT record? Tech Rig files USDOT corrections, address, name, contact, status, truck and driver changes, for a flat $125.",
  alternates: { canonical: "/usdot-correction/" },
  openGraph: {
    title: "USDOT Correction",
    description:
      "Tech Rig files USDOT corrections, address, name, contact, status, truck and driver changes, for a flat $125.",
    url: "/usdot-correction/",
    type: "website",
  },
};

// One source feeds both the visible FAQ and the FAQPage schema (verbatim parity).
const faqs: Faq[] = [
  {
    q: "What can you correct on my USDOT?",
    a: "Address, legal or business name, email, phone, operating-authority status, number of trucks, and number of drivers.",
  },
  {
    q: "Is this the same as the biennial update?",
    a: "No. The Biennial Update is the required two-year filing; a correction updates specific details when they change.",
  },
  {
    q: "How much is it?",
    a: "$125, flat.",
  },
  {
    q: "How long does it take?",
    a: "Normally same day when MOTUS is active and your USDOT is linked; FMCSA linking or support can add about 7 to 10 business days.",
  },
];

// The seven-item scope confirmed by the client, each with a single-line icon.
const scope = [
  { Icon: RouteNodeIcon, label: "Address change" },
  { Icon: FilingIcon, label: "Legal or business name change" },
  { Icon: FilingIcon, label: "Email change" },
  { Icon: PhoneIcon, label: "Phone-number change" },
  { Icon: CheckSealIcon, label: "Operating-authority status change" },
  { Icon: FilingIcon, label: "Number of trucks change" },
  { Icon: FilingIcon, label: "Number of drivers change" },
];

export default function UsdotCorrectionPage() {
  return (
    <>
      <JsonLd
        data={graph(
          serviceNode({
            serviceType: "USDOT correction",
            slug: "/usdot-correction/",
            description:
              "Tech Rig files your USDOT correction with FMCSA, updating address, name, contact, status, truck or driver details on your record, for a flat fee.",
            price: 125,
          }),
          breadcrumbNode([
            { name: "Home", slug: "/" },
            { name: "Compliance Services", slug: "/compliance-services/" },
            { name: "USDOT Correction" },
          ]),
          faqNode(faqs),
          personNode("adam"),
        )}
      />

      {/* Hero. A simple hero, no Authority Status Tracker: this page edits an
          already-issued record, so no lifecycle status is asserted (spec §13). */}
      <Section surface="paper" className="pt-8 md:pt-12">
        <Container>
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Compliance Services", href: "/compliance-services/" },
              { name: "USDOT Correction" },
            ]}
          />
          <div className="mt-6 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h1 className="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink">
                USDOT Correction and Record Updates
              </h1>
              <p className="mt-5 max-w-[60ch] text-lg text-slate">
                Your USDOT record has to stay accurate, and an out-of-date
                detail can cause real problems, from insurance issues to a
                flagged record. A USDOT correction updates the specific
                information on file with FMCSA whenever something changes,
                separate from the two-year Biennial Update. Tech Rig files your
                USDOT correction for you, for a flat $125.
              </p>
              <div className="mt-7">
                <Link
                  href={applyHref}
                  className={buttonVariants({ variant: "primary", size: "md" })}
                >
                  Correct my USDOT
                </Link>
              </div>
              <div className="mt-5">
                <ReviewedBy name="Adam Smith" role="Co-Founder" />
              </div>
            </div>

            {/* Standfirst Deck: the page's anchor facts, each traceable to a
                brief sentence. No tracker, no status, no guaranteed date. */}
            <ul className="space-y-4 rounded-card border border-slate/20 bg-cloud p-6">
              {[
                {
                  n: "1",
                  lead: "Flat $125.",
                  rest: "One fee to file the correction with FMCSA.",
                },
                {
                  n: "2",
                  lead: "Normally same day.",
                  rest: "When MOTUS is active and your USDOT is linked.",
                },
                {
                  n: "3",
                  lead: "Not the Biennial Update.",
                  rest: "This fixes a specific detail, separate from the two-year filing.",
                },
              ].map(({ n, lead, rest }) => (
                <li key={n} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate/30 font-mono text-sm text-steel">
                    {n}
                  </span>
                  <span>
                    <span className="font-medium text-ink">{lead}</span>{" "}
                    <span className="text-slate">{rest}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* What a USDOT correction covers */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            What a USDOT correction covers
          </h2>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {scope.map(({ Icon, label }) => (
              <li key={label} className="flex gap-3 text-ink">
                <Icon size={20} className="mt-0.5 shrink-0 text-steel" />
                <span>{label}</span>
              </li>
            ))}
          </ul>

          {/* The correction-vs-biennial distinction, a structural rendering of
              the brief's own disambiguation. */}
          <p className="mt-6 border-l-4 border-steel pl-4 text-slate">
            If you need the regular two-year filing instead, see the{" "}
            <CrossLink href="/mcs-150-biennial-update/">
              Biennial Update
            </CrossLink>
            .
          </p>
        </Container>
      </Section>

      {/* What our USDOT correction service costs */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            What our USDOT correction service costs
          </h2>

          {/* Flat $125 price chip from the single source. No government fee
              applies to a standard correction, so no gov-fee line is forced. */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <PriceChip
              price={pricing["/usdot-correction/"]}
              label="USDOT correction"
            />
            <p className="max-w-[42ch] text-sm text-slate">
              The fee covers filing the correction with FMCSA.
            </p>
          </div>

          <p className="mt-6 text-slate">
            If your MOTUS account or USDOT link needs FMCSA support to unlock
            first, we handle that as part of the work (see timing below), even
            when the record is{" "}
            <CrossLink href="/motus-migration/">locked in MOTUS</CrossLink>.
          </p>

          <p className="mt-6">
            <CrossLink href="/compliance-services/">
              compliance services
            </CrossLink>{" "}
            and{" "}
            <CrossLink href="/dot-registration/">DOT registration</CrossLink>{" "}
            sit alongside this if you need more than a correction.
          </p>
        </Container>
      </Section>

      {/* How fast it is done. Honest timing as prose with mono figures, no
          countdown, no tracker. */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            How fast it is done
          </h2>
          <p className="mt-4 flex gap-3 text-slate">
            <ClockIcon size={20} className="mt-1 shrink-0 text-steel" />
            <span>
              <span className="font-mono font-medium text-ink">
                Normally same day
              </span>{" "}
              when your MOTUS account is active and your USDOT record is linked.
              If FMCSA linking or support is needed, that step can take roughly{" "}
              <span className="font-mono text-ink">7 to 10 business days</span>,
              which is FMCSA&apos;s timeline, not ours. We keep your side moving
              and tell you where it stands. We do not promise an FMCSA-controlled
              date.
            </span>
          </p>
        </Container>
      </Section>

      {/* FAQ */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            USDOT correction FAQ
          </h2>
          <div className="mt-6">
            <FaqAccordion items={faqs} />
          </div>
        </Container>
      </Section>

      <ClosingCta
        text="Something on your USDOT out of date? We will correct it, fast."
        cta={{ label: "Correct my USDOT", href: applyHref }}
      />
    </>
  );
}

// Steel inline cross-link (1 to 3 word contextual anchor), never a button.
function CrossLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
    >
      {children}
    </Link>
  );
}
