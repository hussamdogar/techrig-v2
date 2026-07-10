import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { AuthorityStatusTracker } from "@/components/authority-status-tracker";
import { ServiceCard } from "@/components/service-card";
import { FaqAccordion, type Faq } from "@/components/faq-accordion";
import { ReviewedBy } from "@/components/reviewed-by";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ClosingCta } from "@/components/closing-cta";
import { JsonLd } from "@/components/json-ld";
import { CheckSealIcon, type IconName } from "@/components/icons";
import {
  breadcrumbNode,
  faqNode,
  graph,
  offerCatalogNode,
  personNode,
} from "@/lib/schema";
import { complianceNav, pricing, type Price } from "@/lib/services";
import { BUNDLES, BUNDLE_KEYS, getBundleBreakdown } from "@/lib/services-registry";

// The compliance silo HUB. Every card link, package-checklist link, and the
// single primary CTA (hero, package panel, close) route into the silo. The
// primary action is always /mc-dot-registration/ (the Authority Package), per
// the brief and design spec, kept consistent across all three primary slots.
// Compliance hub funnels into the /apply engine generically (D14); the visitor
// picks services on the first step. Service-specific pages deep-link with ?service=.
const SETUP_CTA = "/apply/";

export const metadata: Metadata = {
  // Brief title tag is "DOT Compliance Services for Trucking | Tech Rig"; the
  // layout template appends " | Tech Rig", so the absolute title carries the
  // full intended tag without a double brand.
  title: { absolute: "DOT Compliance Services for Trucking | Tech Rig" },
  description:
    "DOT compliance services for new and growing carriers: USDOT, MC authority, BOC-3, UCR, consortium, Clearinghouse and driver files, done right. Get started today.",
  alternates: { canonical: "/compliance-services/" },
  openGraph: {
    title: "DOT Compliance Services for Trucking | Tech Rig",
    description:
      "DOT compliance services for new and growing carriers: USDOT, MC authority, BOC-3, UCR, consortium, Clearinghouse and driver files, done right. Get started today.",
    url: "/compliance-services/",
    type: "website",
  },
};

// The service-card grid, in brief order. Descriptions are transcribed
// from the brief; prices come from the single-source map unless a card carries
// its own `price` (the bundle-less services that have no per-slug pricing entry).
// `href` is omitted for services with no dedicated page (rendered link-free, so
// we never ship a dead link).
const serviceCards: {
  title: string;
  description: string;
  icon: IconName;
  href?: string;
  price?: Price;
  govFeeNote?: string;
  note?: string;
}[] = [
  {
    href: "/dot-registration/",
    title: "USDOT number",
    description: "Your federal carrier ID, filed correctly the first time.",
    icon: "stamp",
  },
  {
    href: "/mc-registration/",
    title: "MC authority",
    description: "Operating authority to haul freight for hire across state lines.",
    icon: "shield",
    // The $650 standalone MC fee includes the USDOT number, so the standalone
    // $300 is not charged on top. Suppress the generic gov-fee line here in
    // favour of that clearer note (the MC page carries the full fee separation).
    price: { ...pricing["/mc-registration/"], govFee: false },
    note: "includes USDOT number",
  },
  {
    href: "/boc-3-filing/",
    title: "BOC-3 filing",
    description: "Blanket process-agent designation, required to activate authority.",
    icon: "filing",
  },
  {
    href: "/ucr-registration/",
    title: "UCR",
    description: "Annual Unified Carrier Registration, with the right fleet bracket.",
    icon: "filing",
    govFeeNote: "+ gov fee by fleet size",
  },
  {
    href: "/irp-registration/",
    title: "IRP plates",
    description: "Apportioned plates so you can run legally in multiple states.",
    icon: "routeNode",
    govFeeNote: "+ state fees",
  },
  {
    href: "/ifta-registration/",
    title: "IFTA",
    description: "One-time fuel-tax registration setup for interstate miles.",
    icon: "routeNode",
    govFeeNote: "+ state fees",
  },
  {
    href: "/ifta-quarterly-filing/",
    title: "IFTA quarterly filing",
    description: "The recurring quarterly fuel-tax return, prepared and filed from your mileage and fuel records.",
    icon: "routeNode",
    govFeeNote: "+ fuel tax due",
  },
  {
    href: "/fmcsa-clearinghouse-registration/",
    title: "Clearinghouse Registration",
    description: "FMCSA Clearinghouse registration for drug and alcohol records.",
    icon: "shield",
  },
  {
    href: "/drug-and-alcohol-consortium/",
    title: "Drug & alcohol consortium",
    description: "Consortium enrollment and random testing program management.",
    icon: "shield",
  },
  {
    href: "/driver-qualification-files/",
    title: "DQ files",
    description: "Compliant driver qualification files, built and kept audit-ready.",
    icon: "filing",
  },
  {
    href: "/eld-services/",
    title: "ELD",
    description: "A referral to our ELD partner for a compliant hours-of-service device. No Tech Rig fee.",
    icon: "stamp",
  },
  {
    href: "/mcs-150-biennial-update/",
    title: "Biennial Update",
    description: "The biennial MCS-150 filing that keeps your USDOT record current.",
    icon: "filing",
  },
  {
    // Dedicated page now exists (client D3); price reads from the single source.
    // Scope and the separation from the Biennial Update come from the QA brief.
    href: "/usdot-correction/",
    title: "USDOT Correction",
    description: "Correct your USDOT record: address, legal or business name, email, phone, operating status, and truck and driver counts. Separate from the Biennial Update.",
    icon: "stamp",
  },
  {
    href: "/motus-migration/",
    title: "FMCSA Portal to MOTUS Migration",
    description: "Move a legacy FMCSA Portal account into MOTUS: claim your USDOT, assign a Company Official, and clear verification or missing-authority issues.",
    icon: "stamp",
  },
  {
    href: "/trucking-llc/",
    title: "Trucking LLC",
    description: "Company formation so your authority sits under the right entity.",
    icon: "filing",
  },
  {
    title: "MC reinstatement / deactivation",
    description: "Reinstate a dismissed MC authority, or deactivate one you no longer run.",
    icon: "shield",
    price: { kind: "from", amount: 200 },
  },
  {
    title: "USDOT reactivation / deactivation",
    description: "Reactivate an inactive USDOT number, or deactivate a record you are closing.",
    icon: "stamp",
    price: { kind: "flat", amount: 125 },
  },
];

// One source feeds both the visible FAQ accordion and the FAQPage schema
// (verbatim parity). Q&A transcribed from the brief; real questions only.
const faqs: Faq[] = [
  {
    q: "Do I need all of these services?",
    a: "No. Requirements depend on your operation, vehicles, drivers, authority type, and whether you run interstate. We tell you which apply to you.",
  },
  {
    q: "How long until my authority is active?",
    a: "After the application, FMCSA requires a mandatory 21-day protest period, and timing depends on FMCSA processing and correct insurance and BOC-3 filings. We cannot guarantee a date, but we make sure nothing on your side holds it up.",
  },
  {
    q: "Is Tech Rig part of FMCSA?",
    a: "No. DGR Tech Rig LLC is officially listed by FMCSA as a BOC-3 blanket process-agent company. We are a private filing service.",
  },
  {
    q: "Can you fix an authority I started myself?",
    a: "Yes. A lot of our work is correcting DIY filings, including wrong classifications and MOTUS lockouts.",
  },
  {
    q: "Do non-CDL drivers need compliance files?",
    a: "Yes. Many non-CDL commercial drivers still require a Driver Qualification file when the vehicle and operation fall under applicable federal rules. Clearinghouse and DOT drug-and-alcohol testing requirements generally apply to drivers operating vehicles that require a CDL. We review the vehicle and operation before recommending services.",
  },
];

// The genuine 4-step sequence for "How it works". Numbered 01 to 04 (a real
// sequence). Numbers render via aria-hidden mono spans, never inside headings.
const steps: { copy: string }[] = [
  { copy: "Tell us your equipment, state, and where you are starting from." },
  {
    copy: "We map the exact filings you need and what they cost, with government fees called out separately.",
  },
  {
    copy: "We file and track each step, and tell you when your authority is active.",
  },
  { copy: "We keep you compliant and, when you want it, dispatch your truck." },
];

export default function ComplianceServicesPage() {
  return (
    <>
      <JsonLd
        data={graph(
          // Per the brief, the hub carries no Service node of its own (each
          // Service lives on its page). It augments the Organization with a
          // hasOfferCatalog of the compliance services instead.
          offerCatalogNode(
            "Compliance services",
            complianceNav
              .filter((n) => n.slug !== "/compliance-services/")
              .map((n) => ({ name: n.label, slug: n.slug })),
          ),
          breadcrumbNode([
            { name: "Home", slug: "/" },
            { name: "Compliance Services" },
          ]),
          faqNode(faqs),
          personNode("adam"),
        )}
      />

      {/* Hero (Paper, asymmetric two-column) */}
      <Section surface="paper" className="pt-8 md:pt-12">
        <Container>
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Compliance Services" },
            ]}
          />
          <div className="mt-6 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h1 className="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink">
                DOT and Trucking Compliance Services
              </h1>
              {/* Styled lede (the brief's hero paragraph, verbatim). Not a heading. */}
              <p className="mt-5 max-w-[60ch] text-lg text-slate">
                Getting a truck on the road is not one filing. It is a sequence,
                and any missed step can stall your authority at the worst time.
                Tech Rig handles the whole sequence. Our DOT compliance services
                take a new or returning carrier from company formation through
                active operating authority, then keep you compliant once you are
                hauling. DGR Tech Rig LLC is officially listed by FMCSA as a BOC-3
                blanket process-agent company, and we have run filings for
                owner-operators, fleets, and brokers in more than 10 states.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link
                  href={SETUP_CTA}
                  className={buttonVariants({ variant: "primary", size: "md" })}
                >
                  Start your compliance setup
                </Link>
                {/* Secondary Steel anchor to the packages page. */}
                <Link
                  href="/compliance-packages/"
                  className="font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
                >
                  or compare our packages
                </Link>
              </div>
              <div className="mt-5">
                <ReviewedBy name="Adam Smith" />
              </div>
            </div>

            {/* Signature visual: the canonical authority journey tracker. */}
            <AuthorityStatusTracker />
          </div>
        </Container>
      </Section>

      {/* Compliance packages (choose by authority status + vehicle): pricing v2,
          replaces the old single full-package panel. Prices DERIVED from the
          registry, never hardcoded (parity with services.md). */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <div
            id="compliance-packages"
            className="scroll-mt-24 rounded-card border-2 border-steel bg-cloud p-6 md:p-8"
          >
            <h2 className="font-display text-3xl font-bold text-ink">
              Compliance packages (choose by authority status + vehicle)
            </h2>

            <p className="mt-5 text-slate">
              Most carriers save by bundling: BOC-3 is included in every package, and bundle prices are lower than
              a la carte. Full detail and the side-by-side comparison live on the{" "}
              <Link
                href="/compliance-packages/"
                className="font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
              >
                packages page
              </Link>
              .
            </p>

            <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {BUNDLE_KEYS.map((key) => {
                const bundle = BUNDLES[key];
                const price = getBundleBreakdown(key).finalPrice;
                return (
                  <li key={key} className="flex items-start gap-3">
                    <CheckSealIcon size={20} className="mt-0.5 shrink-0 text-status-active" />
                    <span className="text-ink">
                      <Link
                        href={`/compliance-packages/#package-${key}`}
                        className="font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
                      >
                        {bundle.name}
                      </Link>{" "}
                      — ${price.toLocaleString("en-US")} ({bundle.whoItsFor})
                    </span>
                  </li>
                );
              })}
            </ul>

            <p className="mt-6 text-slate">
              Choose by your authority status and the vehicle you operate, not only whether the driver holds a CDL.
              You can also buy any service on its own at its standalone price.
            </p>

            {/* Fee-separation note (Slate), verbatim from the brief. */}
            <p className="mt-4 text-sm text-slate">
              IRP and IFTA government and jurisdiction fees are billed separately.
            </p>

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
              <Link href={SETUP_CTA} className={buttonVariants({ variant: "primary", size: "md" })}>
                Start your compliance setup
              </Link>
              <Link
                href="/compliance-packages/"
                className="inline-flex items-center font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
              >
                See all packages and compare
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      {/* What our DOT compliance services cover: the service-card grid */}
      <Section surface="cloud">
        <Container>
          <h2 className="font-display text-3xl font-bold text-ink">
            What our DOT compliance services cover
          </h2>
          <p className="mt-4 max-w-2xl text-slate">
            Need one filing rather than the full package? Each service below is
            available on its own. Prices are our service fee; where a government
            or third-party fee applies, it is shown separately.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {serviceCards.map((card) => (
              <ServiceCard
                key={card.title}
                icon={card.icon}
                title={card.title}
                href={card.href}
                description={card.description}
                price={card.price ?? (card.href ? pricing[card.href] : undefined)}
                govFeeNote={card.govFeeNote}
                note={card.note}
              />
            ))}
          </div>
        </Container>
      </Section>

      {/* Why carriers choose our trucking compliance services: three proof blocks */}
      <Section surface="paper">
        <Container>
          <h2 className="font-display text-3xl font-bold text-ink">
            Why carriers choose our trucking compliance services
          </h2>
          <p className="mt-4 max-w-2xl text-slate">
            Serving the trucking industry since 2021, with a compliance practice
            that has helped 40+ carriers, owner-operators, and brokers across more
            than 10 states.
          </p>

          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            {/* Block 1: bold styled lead-in (paragraph, not a heading) + worked example. */}
            <div>
              <p className="font-display text-lg font-bold text-ink">
                We catch what blocks activation.
              </p>
              <p className="mt-3 text-slate">
                Plenty of applications clear the 21-day protest period and still
                cannot operate because the BOC-3 or insurance was wrong. We
                sequence the filings so that does not happen.
              </p>
              <p className="mt-4 border-l-4 border-steel pl-4 text-slate">
                One carrier had registered as a freight forwarder instead of a
                motor carrier, which did not permit hauling freight in his own
                truck. We refiled under the correct classification with BOC-3 and
                UCR inside 24 hours, and the authority activated after the protest
                period.
              </p>
            </div>

            <div>
              <p className="font-display text-lg font-bold text-ink">
                We know the new MOTUS system.
              </p>
              <p className="mt-3 text-slate">
                FMCSA&apos;s move off the legacy portal has created PIN,
                data-linkage, and Pay.gov problems. We work these daily, including
                triggering FMCSA callbacks when records will not link.
              </p>
            </div>

            <div>
              <p className="font-display text-lg font-bold text-ink">
                We do not disappear after the filing.
              </p>
              <p className="mt-3 text-slate">
                An active authority is just the start. We keep your MCS-150, UCR,
                Clearinghouse, and driver files current, and when you are ready to
                keep the truck loaded we{" "}
                <Link
                  href="/services/"
                  className="font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
                >
                  dispatch you
                </Link>{" "}
                too.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* How it works: numbered 01 to 04 stepper (numbers via aria-hidden mono spans) */}
      <Section surface="cloud">
        <Container>
          <h2 className="font-display text-3xl font-bold text-ink">
            How it works
          </h2>
          <ol className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <li key={step.copy} className="flex flex-col">
                <span
                  aria-hidden="true"
                  className="font-mono text-sm font-medium text-steel"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="mt-3 block h-px w-full bg-slate/25" aria-hidden />
                <p className="mt-4 text-ink">{step.copy}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* FAQ */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            Compliance services FAQ
          </h2>
          <div className="mt-6">
            <FaqAccordion items={faqs} />
          </div>
        </Container>
      </Section>

      <ClosingCta
        text="Ready to get road-legal without the guesswork? Start your compliance setup."
        cta={{ label: "Start your compliance setup", href: SETUP_CTA }}
      />
    </>
  );
}
