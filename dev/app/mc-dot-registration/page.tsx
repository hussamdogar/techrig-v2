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
import { FilingIcon, RouteNodeIcon } from "@/components/icons";
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
  // Brief title tag does not end in " | Tech Rig" in the strippable template
  // form, so keep it absolute and verbatim.
  title: { absolute: "Get Your MC and DOT Number Together | Tech Rig" },
  description:
    "Get your MC and DOT number as one package. Tech Rig files your USDOT, MC authority, BOC-3, and UCR together so your trucking authority activates without gaps.",
  alternates: { canonical: "/mc-dot-registration/" },
  openGraph: {
    title: "Get Your MC and DOT Number Together | Tech Rig",
    description:
      "Get your MC and DOT number as one package. Tech Rig files your USDOT, MC authority, BOC-3, and UCR together so your trucking authority activates without gaps.",
    url: "/mc-dot-registration/",
    type: "website",
  },
};

// Tracker scoped to the whole journey the bundle delivers, because this page
// sells every step at once: the tracker reads as the visual promise of the
// offer. Application filed -> 21-day federal protest period (the fixed federal
// step, never a countdown) -> Authority active. Honesty rules: no dates.
const bundleSteps: Step[] = [
  { label: "Application filed", status: "Filed", state: "filed", icon: "stamp" },
  {
    label: "21-day federal protest period",
    status: "Federal step",
    state: "progress",
    icon: "clock",
  },
  { label: "Authority active", status: "Active", state: "active", icon: "checkSeal" },
];

// One source feeds both the visible FAQ accordion and the FAQPage schema
// (verbatim parity). `a` stays plain for schema; `aNode` carries inline links.
const faqs: Faq[] = [
  {
    q: "What is the difference between a USDOT and an MC number?",
    a: "The USDOT number identifies your operation; the MC number is your authority to haul regulated freight for hire. Many interstate carriers need both. See USDOT and MC authority.",
    aNode: (
      <>
        The USDOT number identifies your operation; the MC number is your
        authority to haul regulated freight for hire. Many interstate carriers
        need both. See <CrossLink href="/dot-registration/">USDOT</CrossLink>{" "}
        and <CrossLink href="/mc-registration/">MC authority</CrossLink>.
      </>
    ),
  },
  {
    q: "Do I need the package, or can I buy one filing?",
    a: "You can buy any filing on its own. The package is for new carriers who want the whole authority handled together so the pieces line up.",
  },
  {
    q: "How long until I am active?",
    a: "After filing, FMCSA requires a mandatory 21-day protest period, and activation depends on your insurance and BOC-3 being in. We do not promise a date; we make sure nothing on your side delays it.",
  },
  {
    q: "Can you fix a dismissed or stalled authority?",
    a: "Yes. We file new authority applications and untangle stalled ones regularly.",
  },
];

// The five connected pieces of the bundle. The inline 1 to 3 word link and its
// short descriptor are rendered as one sequence joined by a Steel connector, so
// the set reads as "filed in order," the differentiator from buying one filing.
const includes: { link: { href: string; label: string }; rest: React.ReactNode }[] = [
  {
    link: { href: "/dot-registration/", label: "USDOT number" },
    rest: <> registration and MOTUS Portal setup.</>,
  },
  {
    link: { href: "/mc-registration/", label: "MC operating authority" },
    rest: <> application.</>,
  },
  {
    link: { href: "/boc-3-filing/", label: "BOC-3" },
    rest: <> blanket process-agent filing (we are FMCSA-listed).</>,
  },
  {
    link: { href: "/ucr-registration/", label: "UCR registration" },
    rest: <> for the current year.</>,
  },
];

export default function McDotRegistrationPage() {
  return (
    <>
      <JsonLd
        data={graph(
          serviceNode({
            serviceType: "Trucking operating authority package",
            slug: "/mc-dot-registration/",
            description:
              "Tech Rig files your USDOT number, MC operating authority, BOC-3, and UCR together and coordinates your insurance filing so your trucking authority activates without gaps.",
          }),
          breadcrumbNode([
            { name: "Home", slug: "/" },
            { name: "Compliance Services", slug: "/compliance-services/" },
            { name: "MC and DOT Authority" },
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
              { name: "MC and DOT Authority" },
            ]}
          />
          <div className="mt-6 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h1 className="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink">
                Get Your MC and DOT Number Together
              </h1>
              <p className="mt-5 max-w-[60ch] text-lg text-slate">
                Most new for-hire carriers do not need one filing, they need the
                set, in the right order. Our trucking authority package files
                your USDOT number, your MC operating authority, your BOC-3, and
                your UCR together, and coordinates your insurance filing, so the
                pieces line up and your authority actually activates. One
                process, one point of contact, no gaps for something to fall
                through.
              </p>
              <div className="mt-7">
                <Link
                  href={filingCtaHref}
                  className={buttonVariants({ variant: "primary", size: "md" })}
                >
                  Get my authority package
                </Link>
              </div>
              <div className="mt-5">
                <ReviewedBy name="Adam Smith" role="Co-Founder" />
              </div>
            </div>

            <AuthorityStatusTracker steps={bundleSteps} />
          </div>
        </Container>
      </Section>

      {/* What the trucking authority package includes */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            What the trucking authority package includes
          </h2>

          {/* The five core pieces as one connected checklist: a vertical
              sequence joined by a thin Steel connector so the set reads as
              "filed in order." Check marks pair the status-active color with an
              icon, never color alone. */}
          <ul className="mt-6 space-y-5">
            {includes.map(({ link, rest }) => (
              <li key={link.href} className="relative flex gap-4 pl-1">
                <FilingIcon
                  size={20}
                  className="mt-0.5 shrink-0 text-status-active"
                />
                <span className="text-ink">
                  <CrossLink href={link.href}>{link.label}</CrossLink>
                  {rest}
                </span>
              </li>
            ))}
          </ul>

          {/* Insurance is coordinate-only (client QA 2026-06): never sold or
              filed by us, so it is a neutral note, not a bundled service item. */}
          <p className="mt-6 text-slate">
            Insurance is coordinated, not sold or filed by us: your insurer files
            the required proof of insurance directly with FMCSA, and we make sure
            it lands before your authority activates.
          </p>

          {/* Step-up line: visually subordinate Slate cross-link that routes the
              bigger-need carrier up without competing with the package CTA. */}
          <p className="mt-8 text-slate">
            Need driver compliance and interstate filings too (DQ files,
            Clearinghouse, consortium, IRP, IFTA, ELD)? Step up to the{" "}
            <CrossLink href="/compliance-services/">
              full compliance package
            </CrossLink>{" "}
            at $1,700.
          </p>
        </Container>
      </Section>

      {/* What it costs */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            What it costs
          </h2>
          <p className="mt-4 text-slate">
            Filed together, the core authority pieces are priced from the
            individual services. You see the combined value up front, with no
            government fee folded into a service-fee number.
          </p>

          {/* Core service-fee chips, single-sourced from services.md. The MC
              fee ($600) includes the USDOT number, so there is no separate USDOT
              chip; BOC-3 and UCR complete the core. UCR keeps its "from $50". */}
          <div className="mt-6 flex flex-wrap gap-4">
            <PriceChip
              price={{ ...pricing["/mc-registration/"], govFee: false }}
              label="MC operating authority"
              note="includes USDOT number"
            />
            <PriceChip
              price={pricing["/boc-3-filing/"]}
              label="BOC-3 filing"
            />
            <PriceChip
              price={pricing["/ucr-registration/"]}
              label="UCR registration"
              govFeeNote="+ gov fee, set by fleet bracket"
            />
          </div>

          {/* Fee separation, explicit and visually distinct from the chips. */}
          <p className="mt-6 text-slate">
            Government fees and your insurance premium are separate and shown up
            front.
          </p>

          <p className="mt-6 text-slate">
            The complete setup with driver and interstate compliance is the{" "}
            <CrossLink href="/compliance-services/">
              $1,700 full package
            </CrossLink>
            , which already includes the MC and UCR (0 to 2 bracket) government
            fees.
          </p>
        </Container>
      </Section>

      {/* Why a trucking authority package beats filing piecemeal */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            Why a trucking authority package beats filing piecemeal
          </h2>

          {/* The page's distinct facet (CA dismissed-MC carrier, one-day
              combined-filing speed angle), set as a quiet Steel-rule example
              callout tied back to the hero tracker. Past result, not a promise. */}
          <p className="mt-4 border-l-4 border-steel pl-4 text-slate">
            A California box-truck owner whose MC had been dismissed needed a new
            authority application, MOTUS Portal setup, BOC-3, and UCR. We filed
            all of it in a single day, then waited out the protest period, and he
            is active and hiring. Doing those filings separately, in the wrong
            order, is exactly how carriers end up at day 21 with an authority
            that will not activate. The package exists so nothing is missed and
            nothing waits on something you did not know you needed.
          </p>
        </Container>
      </Section>

      {/* FAQ */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            Trucking authority package FAQ
          </h2>
          <div className="mt-6">
            <FaqAccordion items={faqs} />
          </div>
        </Container>
      </Section>

      {/* Dispatch handoff: a deliberate styled funnel forward before the close,
          Steel and subordinate, on the brief's closing funnel intent. */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <p className="flex gap-4 text-slate">
            <RouteNodeIcon size={24} className="mt-0.5 shrink-0 text-steel" />
            <span>
              Authority active, keep your truck loaded. Once you are road-legal,
              our <CrossLink href="/services/">dispatch team</CrossLink> keeps
              freight moving.
            </span>
          </p>
        </Container>
      </Section>

      <ClosingCta
        text="Get the whole authority handled, in the right order. Start your package."
        cta={{ label: "Get my authority package", href: filingCtaHref }}
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
