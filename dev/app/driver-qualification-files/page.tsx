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
  ShieldIcon,
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

// Primary CTA routes into the /apply engine, pre-selecting the DQ files service.
const applyHref = "/apply/?service=dq-files";

export const metadata: Metadata = {
  title: "Driver Qualification Files (DQ)",
  description:
    "Driver qualification files built and maintained for you. We assemble compliant DQ files so your drivers, including owner-operators, pass a DOT audit clean.",
  alternates: { canonical: "/driver-qualification-files/" },
  openGraph: {
    title: "Driver Qualification Files",
    description:
      "Driver qualification files built and maintained for you. We assemble compliant DQ files so your drivers, including owner-operators, pass a DOT audit clean.",
    url: "/driver-qualification-files/",
    type: "website",
  },
};

// Tracker scoped to where DQ files sit: a driver-readiness step that comes after
// authority is active and runs alongside consortium and Clearinghouse setup. Icon
// names only; honesty rules apply (no dates, no countdown, no implied affiliation).
const dqSteps: Step[] = [
  { label: "Authority active", status: "Active", state: "active", icon: "checkSeal" },
  {
    label: "Driver files assembled",
    status: "Driver step",
    state: "filed",
    icon: "filing",
  },
  {
    label: "Recurring items kept current",
    status: "Maintained",
    state: "progress",
    icon: "clock",
  },
];

// The contents checklist. General and representative, not an exhaustive federal
// list (the brief frames it with "including"). Each item carries a content-bearing
// line icon. The testing-records item renders its cluster cross-links inline.
const contents: { Icon: typeof FilingIcon; node: React.ReactNode }[] = [
  { Icon: FilingIcon, node: "The driver's application for employment." },
  { Icon: StampIcon, node: "A copy of the driver's CDL where applicable." },
  {
    Icon: FilingIcon,
    node: "The motor vehicle record and the annual review of driving record.",
  },
  { Icon: CheckSealIcon, node: "A road test certificate or equivalent." },
  { Icon: ShieldIcon, node: "Medical examiner's certificate and verification." },
  {
    Icon: FilingIcon,
    node: (
      <>
        Drug and alcohol testing records, tied to your{" "}
        <CrossLink href="/drug-and-alcohol-consortium/">consortium</CrossLink> and{" "}
        <CrossLink href="/fmcsa-clearinghouse-registration/">Clearinghouse</CrossLink>{" "}
        enrollment.
      </>
    ),
  },
  {
    Icon: ClockIcon,
    node: "Records that must be updated on a recurring schedule.",
  },
];

// One source feeds both the visible FAQ and the FAQPage schema (verbatim parity).
const faqs: Faq[] = [
  {
    q: "Do owner-operators need a DQ file?",
    a: "Yes. If you drive the truck, you need a driver qualification file, even if you own the company and are the only driver.",
  },
  {
    q: "What does a DQ file include?",
    a: "The driver's application, license, driving record and annual review, medical certificate, testing records, and other items that must be kept current.",
  },
  {
    q: "How often do DQ files need updating?",
    a: "Some items are one-time; others, like the annual review of the driving record, recur. We keep the recurring items on schedule.",
  },
  {
    q: "How much does a DQ file cost?",
    a: "$200 per driver, including the yearly update.",
  },
  {
    q: "Are DQ files checked in an audit?",
    a: "Yes. They are one of the first things a new-carrier safety audit reviews.",
  },
];

export default function DriverQualificationFilesPage() {
  return (
    <>
      <JsonLd
        data={graph(
          serviceNode({
            serviceType: "Driver qualification file management",
            slug: "/driver-qualification-files/",
            description:
              "Tech Rig builds and maintains compliant driver qualification files for each driver, including owner-operators, and keeps the recurring items current so your safety audit goes smoothly.",
            price: 200,
          }),
          breadcrumbNode([
            { name: "Home", slug: "/" },
            { name: "Compliance Services", slug: "/compliance-services/" },
            { name: "Driver Qualification Files" },
          ]),
          faqNode(faqs),
          personNode("adam"),
        )}
      />

      {/* Hero */}
      <Section surface="paper" className="pt-8 md:pt-12">
        <Container>
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Compliance Services", href: "/compliance-services/" },
              { name: "Driver Qualification Files" },
            ]}
          />
          <div className="mt-6 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h1 className="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink">
                Driver Qualification Files (DQ Files)
              </h1>
              <p className="mt-5 max-w-[60ch] text-lg text-slate">
                Driver qualification files are the records FMCSA expects you to
                keep proving each of your drivers is legally qualified to operate.
                They are one of the first things a new-carrier safety audit checks,
                and incomplete files are a common reason carriers get marked down.
                Tech Rig builds and maintains compliant driver qualification files
                so your drivers are covered and your audit goes smoothly.{" "}
                <span className="font-medium text-ink">
                  This applies even if you are the only driver in the company.
                </span>
              </p>
              <div className="mt-7">
                <Link
                  href={applyHref}
                  className={buttonVariants({ variant: "primary", size: "md" })}
                >
                  Set up my DQ files
                </Link>
              </div>
              <div className="mt-5">
                <ReviewedBy name="Adam Smith" />
              </div>
            </div>

            <AuthorityStatusTracker steps={dqSteps} />
          </div>
        </Container>
      </Section>

      {/* What driver qualification files are */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            What driver qualification files are
          </h2>
          <p className="mt-4 text-slate">
            A driver qualification file (DQ file) is a per-driver record that
            documents the driver meets federal qualification requirements. FMCSA
            requires carriers to maintain one for each driver and to keep it
            current. Missing or outdated DQ files show up fast in an audit.
          </p>

          {/* Applicability threshold: the federal DQ requirement keys off vehicle
              weight rating. Stated without state-specific claims, per the brief. */}
          <p className="mt-4 text-slate">
            The federal requirement generally applies when a driver operates a
            commercial motor vehicle with a gross vehicle or combination weight
            rating, or actual weight, of{" "}
            <span className="font-mono tabular-nums text-ink">10,001 lbs</span> or
            more in applicable commerce. Below that threshold, a federal DQ file is
            not required. We confirm where your operation falls before building
            files.
          </p>

          {/* The recurring-maintenance point, pulled into a quiet emphasis callout:
              it is what carriers underestimate and it justifies the yearly-update
              pricing later. Styled paragraph, never a heading. */}
          <p className="mt-6 border-l-4 border-steel pl-4 text-slate">
            The file is not a one-time form; parts of it have to be refreshed on a
            schedule, for example the annual review of the driving record.
          </p>
        </Container>
      </Section>

      {/* Owner-operators are still drivers: the page's distinct angle */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            Owner-operators are still drivers
          </h2>
          <p className="mt-4 border-l-4 border-steel pl-4 text-slate">
            Important, and widely misunderstood. If you are an owner-operator and
            the only person driving your truck, you still need a driver
            qualification file. Being the owner does not waive the requirement. We
            see new carriers skip this because they assume DQ files are only for
            companies with employee drivers. They are not, and a missing file on
            the owner-driver is exactly what a safety audit flags.
          </p>
        </Container>
      </Section>

      {/* What goes in a driver qualification file: the contents checklist */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            What goes in a driver qualification file
          </h2>
          <p className="mt-4 text-slate">
            A driver qualification file generally includes the following. The
            specifics are federal, so treat this as representative:
          </p>

          {/* Two-column on desktop, single column on mobile. Neutral Ink/Steel line
              bullets (not status-active green checks): this is "what is in the file",
              not "what we include", so the green check stays meaningful below. */}
          <ul className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {contents.map((item, i) => (
              <li key={i} className="flex gap-3 text-ink">
                <item.Icon size={20} className="mt-0.5 shrink-0 text-steel" />
                <span>{item.node}</span>
              </li>
            ))}
          </ul>

          <p className="mt-6 text-slate">
            We assemble these into a compliant file and keep the recurring items
            current.
          </p>
        </Container>
      </Section>

      {/* What our DQ file service includes */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            What our DQ file service includes
          </h2>

          {/* Status-active green checks: the check earns its meaning here by
              contrast with the neutral contents list above. */}
          <ul className="mt-6 space-y-5">
            <li className="flex gap-4">
              <CheckSealIcon size={24} className="mt-0.5 shrink-0 text-status-active" />
              <span className="text-ink">
                We build a complete driver qualification file for each driver,
                including owner-operators.
              </span>
            </li>
            <li className="flex gap-4">
              <CheckSealIcon size={24} className="mt-0.5 shrink-0 text-status-active" />
              <span className="text-ink">
                We connect it to your{" "}
                <CrossLink href="/drug-and-alcohol-consortium/">
                  drug and alcohol consortium
                </CrossLink>
                ,{" "}
                <CrossLink href="/fmcsa-clearinghouse-registration/">
                  Clearinghouse
                </CrossLink>
                , and pre-employment drug test so the testing records are in place.
              </span>
            </li>
            <li className="flex gap-4">
              <CheckSealIcon size={24} className="mt-0.5 shrink-0 text-status-active" />
              <span className="text-ink">
                We keep the recurring items (like the annual MVR review) on schedule
                so the file stays audit-ready.
              </span>
            </li>
          </ul>

          {/* Pricing from the single source: $200 per driver, includes the yearly
              update. Related driver-compliance costs are shown separately, each
              figure linking to its page, never bundled into the chip. */}
          <div className="mt-8">
            <PriceChip
              price={pricing["/driver-qualification-files/"]}
              label="includes the yearly update"
            />
          </div>

          <p className="mt-4 text-sm text-slate">
            Related driver-compliance services (
            <CrossLink href="/fmcsa-clearinghouse-registration/">
              Clearinghouse $100
            </CrossLink>
            ,{" "}
            <CrossLink href="/drug-and-alcohol-consortium/">
              consortium $150
            </CrossLink>
            , pre-employment drug test $100) are priced separately and listed on
            their pages.
          </p>
        </Container>
      </Section>

      {/* DQ files and your first safety audit: audit context + worked example */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            DQ files and your first safety audit
          </h2>
          <p className="mt-4 text-slate">
            New carriers face a safety audit early in their operation, and driver
            qualification files are a core part of what is reviewed alongside{" "}
            <CrossLink href="/fmcsa-clearinghouse-registration/">
              Clearinghouse
            </CrossLink>{" "}
            registration and consortium enrollment.
          </p>

          {/* The page's UNIQUE worked example, in the quiet credibility treatment.
              Distinct in sentence construction from the consortium telling: the
              facet here is the full audit-ready set, not the test timing alone. */}
          <p className="mt-6 border-l-4 border-steel pl-4 text-slate">
            A New Jersey power-only carrier needed his DQ file, consortium
            enrollment, Clearinghouse setup, and a fresh pre-employment drug test
            before he could put his truck to work, because an earlier test was more
            than{" "}
            <span className="font-mono tabular-nums text-ink">30 days</span> old. We
            handled the set so he was audit-ready, not just licensed.
          </p>
        </Container>
      </Section>

      {/* Driver-compliance cluster cross-link strip */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <p className="text-slate">
            Driver qualification files are one part of the driver-compliance set.
            See the rest:{" "}
            <CrossLink href="/drug-and-alcohol-consortium/">
              drug and alcohol consortium
            </CrossLink>{" "}
            and{" "}
            <CrossLink href="/fmcsa-clearinghouse-registration/">
              FMCSA Clearinghouse
            </CrossLink>
            .
          </p>

          {/* Funnel cross-link forward to dispatch (optional per brief, included). */}
          <p className="mt-4 text-sm text-slate">
            Already road-legal and ready for freight? See our{" "}
            <CrossLink href="/services/">dispatch service</CrossLink>.
          </p>
        </Container>
      </Section>

      {/* FAQ */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            Driver qualification file FAQ
          </h2>
          <div className="mt-6">
            <FaqAccordion items={faqs} />
          </div>
        </Container>
      </Section>

      <ClosingCta
        text="Hiring a driver, or running your own truck? Get audit-ready driver files in place."
        cta={{ label: "Set up my DQ files", href: applyHref }}
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
