import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import {
  AuthorityStatusTracker,
  type Step,
} from "@/components/authority-status-tracker";
import { FaqAccordion, type Faq } from "@/components/faq-accordion";
import { ReviewedBy } from "@/components/reviewed-by";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ClosingCta } from "@/components/closing-cta";
import { JsonLd } from "@/components/json-ld";
import { CheckSealIcon, ClockIcon, FilingIcon } from "@/components/icons";
import {
  breadcrumbNode,
  faqNode,
  graph,
  personNode,
  serviceNode,
} from "@/lib/schema";

// CLIENT RULE (2026-06-21, work-order-eld-insurance.md): Tech Rig does NOT handle
// ELD directly. It refers carriers to its ELD partner (Motive), who supplies and
// sets up the device. No Tech Rig fee, no price chip, and the page never says
// "we set up / install / configure your ELD". The referral CTA routes to
// /contact-us/ until the partner referral link is supplied.
const ELD_CTA = "/contact-us/";

export const metadata: Metadata = {
  title: "ELD for Owner Operators and Fleets",
  description:
    "ELD for owner operators, made simple. Tech Rig connects you with our trusted ELD partner for a compliant device, so your hours of service stay clean and audit-ready.",
  alternates: { canonical: "/eld-services/" },
  openGraph: {
    title: "ELD",
    description:
      "ELD for owner operators, made simple. Tech Rig connects you with our trusted ELD partner for a compliant device, so your hours of service stay clean and audit-ready.",
    url: "/eld-services/",
    type: "website",
  },
};

// Tracker scoped so ELD reads as an operational-readiness step a carrier reaches
// around the time they start hauling: after authority is active, alongside the
// interstate setup (IRP and IFTA). The device is supplied by the partner, not by
// Tech Rig, so the node reads "ELD in place", never implying Tech Rig installs it.
const eldSteps: Step[] = [
  { label: "Authority active", status: "Active", state: "active", icon: "checkSeal" },
  {
    label: "Interstate setup (IRP, IFTA)",
    status: "In progress",
    state: "progress",
    icon: "clock",
  },
  { label: "ELD in place", status: "Ready to haul", state: "filed", icon: "stamp" },
];

// One source feeds both the visible FAQ and the FAQPage schema (verbatim parity).
const faqs: Faq[] = [
  {
    q: "Do owner-operators need an ELD?",
    a: "Most drivers subject to hours-of-service rules need one, with limited exceptions. We confirm whether you are required to run one.",
  },
  {
    q: "Does Tech Rig set up my ELD?",
    a: "No. We refer you to our ELD partner, who provides the device and the setup. We make the introduction and keep ELD in your compliance plan.",
  },
  {
    q: "What does the referral cost?",
    a: "Nothing from Tech Rig. You pay the partner directly for the device and subscription.",
  },
  {
    q: "Which ELD will I get?",
    a: "Our partner's compliant device, suited to your truck and operation. They handle the configuration.",
  },
];

export default function EldServicesPage() {
  return (
    <>
      <JsonLd
        data={graph(
          // Referral, not a Tech Rig service: no offers/price. The serviceType and
          // description frame Tech Rig as the referrer, never the ELD provider.
          serviceNode({
            serviceType: "ELD partner referral",
            slug: "/eld-services/",
            description:
              "Tech Rig refers owner-operators and small fleets to its ELD partner for a compliant electronic logging device. Tech Rig does not sell, install, or configure ELDs.",
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
                ELD for Owner Operators and Fleets
              </h1>
              <p className="mt-5 max-w-[60ch] text-lg text-slate">
                An electronic logging device (ELD) records your hours of service
                automatically, and most carriers are required to run one.{" "}
                <span className="font-medium text-ink">
                  We do not sell or set up ELDs ourselves.
                </span>{" "}
                Instead, Tech Rig connects you with our trusted ELD partner, so
                owner-operators and small fleets get a compliant device from a
                provider we know, without shopping the market blind.
              </p>
              <div className="mt-7">
                <Link
                  href={ELD_CTA}
                  className={buttonVariants({ variant: "primary", size: "md" })}
                >
                  Get connected with our ELD partner
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
            and hurts your safety record. We confirm whether you are required to
            run one.
          </p>
        </Container>
      </Section>

      {/* How ELD works with Tech Rig (referral framing) */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            How ELD works with Tech Rig
          </h2>
          <ul className="mt-6 space-y-5">
            {[
              {
                Icon: CheckSealIcon,
                text: "We do not provide or install ELDs. We refer you to our ELD partner, who supplies the device and handles the setup.",
              },
              {
                Icon: FilingIcon,
                text: "You buy the device and subscription directly from the partner. There is no charge from Tech Rig for the referral.",
              },
              {
                Icon: ClockIcon,
                text: "We make sure ELD is on your radar at the right point in your compliance, alongside your IRP and IFTA, so nothing is missed when you start hauling.",
              },
            ].map(({ Icon, text }) => (
              <li key={text} className="flex gap-4">
                <Icon size={24} className="mt-0.5 shrink-0 text-steel" />
                <span className="text-ink">{text}</span>
              </li>
            ))}
          </ul>

          {/* No Tech Rig price chip on this page (client rule): the device and
              subscription are the partner's cost, paid to the partner. */}
          <p className="mt-8 text-sm text-slate">
            No Tech Rig fee. The device and subscription costs are the partner&apos;s,
            paid directly to the partner.
          </p>
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
            carriers usually sort out ELD around the time they start hauling. If
            you are still standing up the company, see the{" "}
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
        text="Need a compliant ELD without the guesswork? We will connect you with our ELD partner."
        cta={{ label: "Get connected with our ELD partner", href: ELD_CTA }}
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
