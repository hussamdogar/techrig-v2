import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import {
  AuthorityStatusTracker,
  type Step,
} from "@/components/authority-status-tracker";
import { PriceChip } from "@/components/ui/price-chip";
import { FaqAccordion, type Faq } from "@/components/faq-accordion";
import { ReviewedBy } from "@/components/reviewed-by";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ClosingCta } from "@/components/closing-cta";
import { JsonLd } from "@/components/json-ld";
import {
  CheckSealIcon,
  FilingIcon,
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
import { filingCtaHref } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: "IRP Registration and Apportioned Plates | Tech Rig",
  },
  description:
    "IRP registration and apportioned plates handled for you. We file your IRP so you can run interstate legally and pay registration fees across your travel states.",
  alternates: { canonical: "/irp-registration/" },
  openGraph: {
    title: "IRP Registration and Apportioned Plates",
    description:
      "IRP registration and apportioned plates handled for you. We file your IRP so you can run interstate legally and pay registration fees across your travel states.",
    url: "/irp-registration/",
    type: "website",
  },
};

// Tracker scoped to where IRP sits: an interstate-operations step for an
// already-active carrier, not a new-authority application. It frames IRP and
// apportioned plates as the interstate-readiness action that follows an active
// authority. No guaranteed dates (brand honesty rule).
const irpSteps: Step[] = [
  {
    label: "Authority active",
    status: "Active",
    state: "active",
    icon: "checkSeal",
  },
  {
    label: "IRP filed, apportioned plates",
    status: "Interstate filing",
    state: "filed",
    icon: "stamp",
  },
  {
    label: "Cleared to run interstate",
    status: "Interstate ready",
    state: "progress",
    icon: "routeNode",
  },
];

// One source feeds both the visible FAQ and the FAQPage schema (verbatim parity).
// The IRP/IFTA answer carries an inline link via aNode while `a` stays plain for
// schema parity.
const faqs: Faq[] = [
  {
    q: "What are apportioned plates?",
    a: "Plates issued under the International Registration Plan that let you run interstate, with your registration fees split among the states you travel based on mileage.",
  },
  {
    q: "Do I need IRP and IFTA?",
    a: "Most interstate carriers need both. IRP is registration and plates; IFTA is fuel tax. They are separate filings.",
    aNode: (
      <>
        Most interstate carriers need both. IRP is registration and plates;{" "}
        <CrossLink href="/ifta-registration/">IFTA</CrossLink> is fuel tax. They
        are separate filings.
      </>
    ),
  },
  {
    q: "How are IRP fees calculated?",
    a: "By your registered weight and the share of miles you run in each member state. Because mileage drives the fee, estimates depend on your routes.",
  },
  {
    q: "Do I pay the state fees to Tech Rig?",
    a: "No. Government registration fees are separate and go to the jurisdictions. Our service fee is for handling the filing. You see both up front.",
  },
  {
    q: "What if I only run in one state?",
    a: "IRP is for interstate operation. If you run purely intrastate, it may not apply. We will tell you.",
  },
];

export default function IrpRegistrationPage() {
  return (
    <>
      <JsonLd
        data={graph(
          // IRP setup fee is $175 (confirmed). State registration fees depend on
          // mileage and jurisdictions and are never encoded as the price.
          serviceNode({
            serviceType: "IRP registration",
            slug: "/irp-registration/",
            price: 175,
            description:
              "Tech Rig files your IRP registration, confirms your base jurisdiction, prepares and submits your apportioned-plate application, and coordinates IFTA if you need both.",
          }),
          breadcrumbNode([
            { name: "Home", slug: "/" },
            { name: "Compliance Services", slug: "/compliance-services/" },
            { name: "IRP Registration" },
          ]),
          faqNode(faqs),
          personNode("robert"),
        )}
      />

      {/* Hero */}
      <Section surface="paper" className="pt-8 md:pt-12">
        <Container>
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Compliance Services", href: "/compliance-services/" },
              { name: "IRP Registration" },
            ]}
          />
          <div className="mt-6 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h1 className="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink">
                IRP Registration and Apportioned Plates
              </h1>
              <p className="mt-5 max-w-[60ch] text-lg text-slate">
                If you run a qualifying commercial vehicle across state lines,
                you need apportioned plates through the International
                Registration Plan. IRP registration lets you operate in multiple
                states on one set of plates, with your registration fees split
                among the states you travel based on the miles you run in each.
                Tech Rig handles your IRP registration so you can run interstate
                legally, without learning a new state portal.
              </p>
              <div className="mt-7">
                <Link
                  href={filingCtaHref}
                  className={buttonVariants({ variant: "primary", size: "md" })}
                >
                  Start my IRP registration
                </Link>
              </div>
              <div className="mt-5">
                <ReviewedBy name="Robert Hooke" />
              </div>
            </div>

            <AuthorityStatusTracker steps={irpSteps} />
          </div>
        </Container>
      </Section>

      {/* What IRP registration is */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            What IRP registration is
          </h2>
          <p className="mt-4 text-slate">
            The International Registration Plan is an agreement among the U.S.
            states and Canadian provinces that lets interstate carriers register
            in their base state and operate across member jurisdictions on
            apportioned plates. Instead of registering your truck separately in
            every state you drive through, you register once and your fees are
            apportioned, split among states in proportion to the miles you run in
            each. The plates you receive are called apportioned plates. IRP
            applies when a commercial vehicle operates in two or more
            jurisdictions (U.S. states or Canadian provinces) and meets a
            threshold: a power unit with a gross or registered weight over 26,000
            lbs; or three or more axles regardless of weight; or used in
            combination when the combined weight is over 26,000 lbs.
          </p>

          {/* Small apportionment line diagram: a base-state node with shares
              fanning to a few travel states. Single-line SVG, in the line
              system, explanatory not decorative. Decorative, so aria-hidden. */}
          <svg
            viewBox="0 0 320 120"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="mt-8 w-full max-w-md text-steel"
          >
            {/* Base state node */}
            <circle cx="40" cy="60" r="14" />
            <path d="M40 53v14M33 60h14" />
            {/* Apportioned shares fanning out to travel states */}
            <path d="M54 52 132 24" />
            <path d="M54 60h78" />
            <path d="M54 68 132 96" />
            <circle cx="146" cy="24" r="10" />
            <circle cx="146" cy="60" r="10" />
            <circle cx="146" cy="96" r="10" />
            <path d="M160 24 238 24" strokeDasharray="4 6" />
            <path d="M160 60 238 60" strokeDasharray="4 6" />
            <path d="M160 96 238 96" strokeDasharray="4 6" />
            <circle cx="252" cy="24" r="10" />
            <circle cx="252" cy="60" r="10" />
            <circle cx="252" cy="96" r="10" />
          </svg>
        </Container>
      </Section>

      {/* IRP vs IFTA */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            IRP vs IFTA: what is the difference
          </h2>
          <p className="mt-4 text-slate">
            Short, because people confuse them. IRP is about registration and
            plates. <CrossLink href="/ifta-registration/">IFTA</CrossLink> is
            about fuel taxes. Most interstate carriers need both, and we usually
            set them up together, but they are separate programs with separate
            filings. This page covers IRP; the{" "}
            <CrossLink href="/ifta-registration/">IFTA page</CrossLink> covers
            fuel tax.
          </p>

          {/* Two distinct line items, deliberately not mirrored cards. */}
          <ul className="mt-6 space-y-4">
            <li className="flex gap-4">
              <FilingIcon size={24} className="mt-0.5 shrink-0 text-steel" />
              <span className="text-ink">
                <span className="font-medium">IRP</span> is registration and
                apportioned plates, so you run interstate on one set of plates.
              </span>
            </li>
            <li className="flex gap-4">
              <RouteNodeIcon size={24} className="mt-0.5 shrink-0 text-steel" />
              <span className="text-ink">
                <span className="font-medium">IFTA</span> is fuel tax reporting
                across the states you run, filed separately from your plates.
              </span>
            </li>
          </ul>
        </Container>
      </Section>

      {/* When you need apportioned plates */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            When you need apportioned plates
          </h2>
          <ul className="mt-6 space-y-3">
            {[
              "You run in two or more jurisdictions (states or provinces) and your power unit is over 26,000 lbs, has three or more axles, or runs in combination over 26,000 lbs combined.",
              "You cross state lines for hire or for your own freight in interstate commerce.",
              "You are adding trucks to a fleet that already runs interstate.",
            ].map((item) => (
              <li key={item} className="flex gap-3 text-ink">
                <RouteNodeIcon
                  size={20}
                  className="mt-0.5 shrink-0 text-steel"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* Honest applicability, as reassurance not fine print. */}
          <p className="mt-6 border-l-4 border-steel pl-4 text-slate">
            If you only ever run inside one state, IRP may not apply to you. We
            confirm before you pay.
          </p>

          {/* Enforcement consequence (client QA): running without IRP
              credentials carries real roadside risk. */}
          <p className="mt-4 border-l-4 border-steel pl-4 text-slate">
            Operating without valid IRP credentials can mean fines, or being
            placed out of service at a weigh station until it is resolved.
          </p>

          {/* [CLIENT PROOF NEEDED]: a real multi-state IRP setup story. Rendered
              as a graceful empty-state proof block: reads fine while empty, no
              fabricated story, ready to take a real result when supplied. */}
          <div className="mt-8 rounded-card border border-dashed border-slate/30 bg-paper p-5">
            <p className="font-mono text-xs uppercase tracking-[0.08em] text-slate">
              From our filing desk
            </p>
            <p className="mt-2 text-slate">
              Most of the IRP files we handle are multi-state carriers who want
              their base jurisdiction, mileage, and fee estimate sorted before
              they pay. We confirm IRP applies, prepare the application, and line
              it up with IFTA when both are needed.
            </p>
          </div>
        </Container>
      </Section>

      {/* What our IRP registration service includes */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            What our IRP registration service includes
          </h2>
          <ul className="mt-6 space-y-5">
            <li className="flex gap-4">
              <CheckSealIcon size={24} className="mt-0.5 shrink-0 text-steel" />
              <span className="text-ink">
                We confirm your base jurisdiction and whether IRP applies to your
                operation.
              </span>
            </li>
            <li className="flex gap-4">
              <StampIcon size={24} className="mt-0.5 shrink-0 text-steel" />
              <span className="text-ink">
                We prepare and submit your IRP application with your fleet and
                travel information.
              </span>
            </li>
            <li className="flex gap-4">
              <CheckSealIcon size={24} className="mt-0.5 shrink-0 text-steel" />
              {/* The fee-estimate transparency is the trust device here. */}
              <span className="font-medium text-ink">
                We help you estimate the fees, which depend on your states,
                mileage, and vehicle weight, so there are no surprises.
              </span>
            </li>
            <li className="flex gap-4">
              <FilingIcon size={24} className="mt-0.5 shrink-0 text-steel" />
              <span className="text-ink">
                We coordinate IRP with your{" "}
                <CrossLink href="/ifta-registration/">IFTA</CrossLink> setup if
                you need both.
              </span>
            </li>
          </ul>

          {/* Price: IRP setup fee is $175 (single source). The state registration
              fees are a separate Slate line, never encoded as the price. */}
          <div className="mt-8">
            <PriceChip
              price={pricing["/irp-registration/"]}
              label="IRP setup fee"
              govFeeNote="+ state fees (vary by jurisdiction, mileage, weight)"
            />
          </div>
          <p className="mt-4 text-slate">
            Our IRP setup fee is $175. The state registration fees themselves are
            set by the jurisdictions and your mileage, and are paid separately. We
            show you which is our fee and which is the government fee before you
            pay.
          </p>

          <p className="mt-6">
            <Link
              href={filingCtaHref}
              className="font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
            >
              Start my IRP registration
            </Link>
          </p>
        </Container>
      </Section>

      {/* Authority context + dispatch handoff */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <p className="text-slate">
            IRP sits on top of an active authority. If you are still standing up
            your company, see how it fits with your{" "}
            <CrossLink href="/mc-registration/">operating authority</CrossLink>,
            or have us handle the{" "}
            <CrossLink href="/compliance-services/">full setup</CrossLink>. Once
            you are road-legal and running, we also keep you loaded with{" "}
            <CrossLink href="/services/">dispatch</CrossLink>.
          </p>
        </Container>
      </Section>

      {/* FAQ */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            IRP registration FAQ
          </h2>
          <div className="mt-6">
            <FaqAccordion items={faqs} />
          </div>
        </Container>
      </Section>

      <ClosingCta
        text="Running interstate? Get your apportioned plates handled the right way."
        cta={{ label: "Start my IRP registration", href: filingCtaHref }}
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
