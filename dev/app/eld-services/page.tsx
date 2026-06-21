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
  ClockIcon,
  FilingIcon,
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
  title: "ELD for Owner Operators and Fleets",
  description:
    "ELD for owner operators set up and supported. We help you choose, install, and run a compliant electronic logging device so your hours of service are clean.",
  alternates: { canonical: "/eld-services/" },
  openGraph: {
    title: "ELD Setup",
    description:
      "ELD for owner operators set up and supported. We help you choose, install, and run a compliant electronic logging device so your hours of service are clean.",
    url: "/eld-services/",
    type: "website",
  },
};

// Tracker scoped so ELD reads as an operational-readiness step a carrier handles
// around the time they start hauling: after authority is active, alongside the
// interstate setup (IRP and IFTA), not a node that gates activation. Honesty
// rules apply: no guaranteed dates, no implied government endorsement.
const eldSteps: Step[] = [
  { label: "Authority active", status: "Active", state: "active", icon: "checkSeal" },
  {
    label: "Interstate setup (IRP, IFTA)",
    status: "In progress",
    state: "progress",
    icon: "clock",
  },
  { label: "ELD installed", status: "Ready to haul", state: "filed", icon: "stamp" },
];

// One source feeds both the visible FAQ and the FAQPage schema (verbatim parity).
const faqs: Faq[] = [
  {
    q: "Do owner-operators need an ELD?",
    a: "Most drivers subject to hours-of-service rules need one, with limited exceptions. We confirm whether you are required to run one.",
  },
  {
    q: "Which ELD should I use?",
    a: "We work with Motive and help you pick a setup that fits your truck and operation.",
  },
  {
    q: "Is the device cost included?",
    a: "Device and subscription costs come from the provider and are separate from any Tech Rig service fee. We show you both.",
  },
  {
    q: "Can you help if my ELD is logging wrong?",
    a: "Yes. A misconfigured ELD causes inspection violations, so we make sure it is set up correctly and point you to support.",
  },
];

export default function EldServicesPage() {
  return (
    <>
      <JsonLd
        data={graph(
          // Verify-state pricing: omit the Service offer price until the fee is confirmed.
          serviceNode({
            serviceType: "ELD setup",
            slug: "/eld-services/",
            description:
              "Tech Rig helps owner-operators and small fleets choose, install, and configure a compliant electronic logging device, working with Motive, so hours of service log correctly.",
          }),
          breadcrumbNode([
            { name: "Home", slug: "/" },
            { name: "Compliance Services", slug: "/compliance-services/" },
            { name: "ELD Services" },
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
              { name: "ELD Services" },
            ]}
          />
          <div className="mt-6 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h1 className="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink">
                ELD Setup for Owner Operators and Fleets
              </h1>
              <p className="mt-5 max-w-[60ch] text-lg text-slate">
                An electronic logging device (ELD) records your hours of service
                automatically, and most carriers are required to run one.{" "}
                <span className="font-medium text-ink">
                  The hard part is not the rule, it is choosing a device that
                  fits your operation and setting it up so your logs are clean
                </span>{" "}
                for inspections and audits. Tech Rig helps you get the right ELD
                in place. We work with Motive as our ELD partner, so
                owner-operators and small fleets get a setup that just works.
              </p>
              <div className="mt-7">
                <Link
                  href={filingCtaHref}
                  className={buttonVariants({ variant: "primary", size: "md" })}
                >
                  Set up my ELD
                </Link>
              </div>
              <div className="mt-5">
                <ReviewedBy name="Robert Hooke" />
              </div>
            </div>

            <AuthorityStatusTracker steps={eldSteps} />
          </div>
        </Container>
      </Section>

      {/* What an ELD is and who needs one */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            What an ELD is and who needs one
          </h2>
          <p className="mt-4 text-slate">
            An ELD connects to your vehicle&apos;s engine and automatically
            records driving time, replacing paper logs for hours-of-service
            compliance. Most commercial drivers subject to hours-of-service rules
            are required to use one, with some exceptions for certain short-haul
            and older-vehicle operations.{" "}
            <span className="font-medium text-ink">
              Running without a required ELD, or running one set up wrong, leads
              to violations at inspection
            </span>{" "}
            and hurts your safety record.
          </p>
        </Container>
      </Section>

      {/* ELD for owner operators: how we help */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            ELD for owner operators: how we help
          </h2>
          <ul className="mt-6 space-y-5">
            {[
              {
                Icon: CheckSealIcon,
                text: "We help you choose an ELD that fits your truck and operation, working with Motive.",
              },
              {
                Icon: StampIcon,
                text: "We help get it installed and your account configured so your hours of service log correctly.",
              },
              {
                Icon: FilingIcon,
                text: "We connect ELD into the rest of your compliance so your records line up for inspections and audits.",
              },
              {
                Icon: ClockIcon,
                text: "We point you to support when you need it, so a device problem does not become a compliance problem.",
              },
            ].map(({ Icon, text }) => (
              <li key={text} className="flex gap-4">
                <Icon size={24} className="mt-0.5 shrink-0 text-steel" />
                <span className="text-ink">{text}</span>
              </li>
            ))}
          </ul>

          {/* Pricing is unconfirmed ([VERIFY]): render the chip in its verify
              state, never an invented number. Device and subscription costs are
              third-party (Motive) and shown separately from any Tech Rig fee. */}
          <div className="mt-8">
            <PriceChip price={pricing["/eld-services/"]} label="ELD setup" />
            <p className="mt-4 text-sm text-slate">
              Device and subscription costs come from the provider (Motive) and
              are shown separately from any Tech Rig service fee. You see both
              before you decide.
            </p>
          </div>
        </Container>
      </Section>

      {/* ELD and the rest of your compliance */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            ELD and the rest of your compliance
          </h2>
          <p className="mt-4 text-slate">
            An ELD is part of running interstate cleanly, alongside your{" "}
            <CrossLink href="/irp-registration/">IRP</CrossLink> and{" "}
            <CrossLink href="/ifta-registration/">IFTA</CrossLink> setup. New
            carriers usually handle ELD around the time they start hauling. If you
            are still standing up the company, see the{" "}
            <CrossLink href="/compliance-services/">full setup</CrossLink>.
          </p>

          {/* Late-sequence funnel handoff to dispatch (one line, subordinate Steel). */}
          <p className="mt-6 text-slate">
            Already hauling and want loads handled?{" "}
            <CrossLink href="/services/">Truck dispatch</CrossLink> keeps you
            loaded once your compliance is in place.
          </p>
        </Container>
      </Section>

      {/* FAQ */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">ELD FAQ</h2>
          <div className="mt-6">
            <FaqAccordion items={faqs} />
          </div>
        </Container>
      </Section>

      <ClosingCta
        text="Need an ELD that keeps your logs clean? Get set up with the right device."
        cta={{ label: "Set up my ELD", href: filingCtaHref }}
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
