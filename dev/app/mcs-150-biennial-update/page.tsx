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
  title: "MCS-150 Update and Biennial Filing",
  description:
    "Need an MCS-150 update? We file your biennial update and any address, fleet, or status change with FMCSA, fast, so your USDOT stays active and your record is right.",
  alternates: { canonical: "/mcs-150-biennial-update/" },
  openGraph: {
    title: "MCS-150 Update",
    description:
      "We file your biennial MCS-150 update and any address, fleet, or status change with FMCSA, so your USDOT stays active.",
    url: "/mcs-150-biennial-update/",
    type: "website",
  },
};

// Per design-system Section 13 (DZ2), the Authority Status Tracker is omitted
// here: the Biennial Update is record upkeep, not an authority-activation page,
// so it asserts no authority-lifecycle status. Do not reintroduce the tracker.

// One source feeds both the visible FAQ and the FAQPage schema (verbatim parity).
const faqs: Faq[] = [
  {
    q: "How often do I have to file an MCS-150?",
    a: "At least every two years for the biennial update, plus any time your information changes. The biennial schedule is based on your USDOT number.",
  },
  {
    q: "What happens if I miss my biennial update?",
    a: "FMCSA can deactivate your USDOT number. Operating on an inactive number is a compliance problem and can block insurance and loads.",
  },
  {
    q: "Can you update my address only?",
    a: "Yes. Address, fleet size, company name, and operation changes are all MCS-150 updates.",
  },
  {
    q: "I do not have my USDOT PIN. Can you still help?",
    a: "Yes. We handle PIN and MOTUS lockouts, including the FMCSA callback process, so we can move your update forward.",
  },
  {
    q: "How long does it take?",
    a: "Standard filings are quick on our side. Government processing time is outside our control, so we do not promise a date, but we make sure nothing on your end holds it up.",
  },
];

export default function Mcs150BiennialUpdatePage() {
  return (
    <>
      <JsonLd
        data={graph(
          serviceNode({
            serviceType: "MCS-150 update",
            slug: "/mcs-150-biennial-update/",
            description:
              "Tech Rig files your biennial MCS-150 update and any address, fleet, or status change with FMCSA, so your USDOT number stays active and your record is correct.",
            price: 125,
          }),
          breadcrumbNode([
            { name: "Home", slug: "/" },
            { name: "Compliance Services", slug: "/compliance-services/" },
            { name: "MCS-150 Update" },
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
              { name: "MCS-150 Update" },
            ]}
          />
          <div className="mt-6 max-w-3xl">
            <div>
              <h1 className="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink">
                MCS-150 Update and Biennial Filing
              </h1>
              <p className="mt-5 max-w-[60ch] text-lg text-slate">
                Your USDOT record is not set-and-forget. FMCSA requires an
                MCS-150 update every two years, and again any time your address,
                fleet size, company name, or operation changes. Let it lapse and
                FMCSA can deactivate your USDOT number, which stops you from
                operating legally. Tech Rig files your MCS-150 update for you, so
                your record stays current and your number stays active.
              </p>
              <div className="mt-7">
                <Link
                  href={filingCtaHref}
                  className={buttonVariants({ variant: "primary", size: "md" })}
                >
                  Update my MCS-150
                </Link>
              </div>
              <div className="mt-5">
                <ReviewedBy name="Adam Smith" />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* What the MCS-150 is */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            What the MCS-150 is
          </h2>
          <div className="mt-4 flex gap-3">
            <FilingIcon size={24} className="mt-1 shrink-0 text-steel" />
            <p className="text-slate">
              The MCS-150 is the form that creates and maintains your USDOT
              number record with FMCSA. It carries your company details, your
              operation type, your number of power units and drivers, and your
              mileage. FMCSA uses it to keep your safety profile accurate. There
              are two reasons you file one: the regular biennial update, and an
              out-of-cycle update when something changes.
            </p>
          </div>
        </Container>
      </Section>

      {/* When you need an MCS-150 update */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            When you need an MCS-150 update
          </h2>

          <ul className="mt-6 space-y-3">
            {[
              {
                Icon: ClockIcon,
                lead: "Every two years (the biennial update).",
                rest: " This is required even if nothing changed. The deadline is tied to your USDOT number, based on the last two digits and whether the number is odd or even.",
              },
              {
                Icon: FilingIcon,
                lead: "You moved.",
                rest: " A new business or mailing address has to be reflected, and an out-of-date address causes real problems (see the example below).",
              },
              {
                Icon: FilingIcon,
                lead: "Your fleet changed.",
                rest: " More or fewer trucks or drivers.",
              },
              {
                Icon: FilingIcon,
                lead: "Your operation changed.",
                rest: " New cargo, a new authority type, going from intrastate to interstate.",
              },
              {
                Icon: CheckSealIcon,
                lead: "You are reactivating.",
                rest: " Bringing a dormant USDOT back often starts with an MCS-150.",
              },
            ].map(({ Icon, lead, rest }) => (
              <li key={lead} className="flex gap-3 text-ink">
                <Icon size={20} className="mt-0.5 shrink-0 text-steel" />
                <span>
                  <span className="font-medium text-ink">{lead}</span>
                  <span className="text-slate">{rest}</span>
                </span>
              </li>
            ))}
          </ul>

          {/* Lapse warning: the deactivation risk shown as a status cue (icon +
              label + color), felt without alarmist styling. */}
          <p className="mt-6 flex gap-3 border-l-4 border-status-progress pl-4 text-slate">
            <ClockIcon
              size={20}
              className="mt-0.5 shrink-0 text-status-progress"
            />
            <span>
              <span className="font-medium text-status-progress">
                Why the biennial update matters:
              </span>{" "}
              if you skip it, FMCSA can mark your USDOT inactive. An inactive
              number can stall insurance, new authority, and load access until it
              is fixed.
            </span>
          </p>
        </Container>
      </Section>

      {/* Why a wrong record is more than paperwork */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            Why a wrong record is more than paperwork
          </h2>

          {/* The page's unique worked example. Real past result, framed as past. */}
          <p className="mt-6 border-l-4 border-steel pl-4 text-slate">
            A New Jersey power-only carrier had left the apartment number off his
            address when he first registered. His insurer warned that the policy
            could be cancelled unless the FMCSA record was corrected. We filed the
            MCS-150 correction, and the right address appeared on his record
            within 24 hours, which resolved the insurance issue. Small record
            errors create big operational problems, and they are usually quick for
            us to fix.
          </p>
        </Container>
      </Section>

      {/* What our MCS-150 update service includes */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            What our MCS-150 update service includes
          </h2>
          <ul className="mt-6 space-y-5">
            {[
              {
                Icon: CheckSealIcon,
                text: "We confirm what triggered the update (biennial, address, fleet, status) and what FMCSA needs.",
              },
              {
                Icon: StampIcon,
                text: "We complete and submit the MCS-150 for you.",
              },
              {
                Icon: FilingIcon,
                text: "If you are locked out of MOTUS or missing a USDOT PIN, we work the issue, including the FMCSA callback process when records will not update online.",
              },
              {
                Icon: CheckSealIcon,
                text: "We confirm the change is reflected on your record.",
              },
            ].map(({ Icon, text }) => (
              <li key={text} className="flex gap-4">
                <Icon size={24} className="mt-0.5 shrink-0 text-steel" />
                <span className="text-ink">{text}</span>
              </li>
            ))}
          </ul>

          {/* Flat $125 price chip from the single source. No gov fee applies to a
              standard MCS-150, so no gov-fee line is forced. */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <PriceChip
              price={pricing["/mcs-150-biennial-update/"]}
              label="MCS-150 update or correction"
            />
            <p className="max-w-[42ch] text-sm text-slate">
              Our MCS-150 update or correction service is a flat $125. If FMCSA
              processing requires anything beyond the standard filing, we tell you
              before any extra step.
            </p>
          </div>

          <p className="mt-6">
            <Link
              href={filingCtaHref}
              className="font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
            >
              Update my MCS-150
            </Link>
          </p>
        </Container>
      </Section>

      {/* MOTUS, PINs, and why updates get stuck */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            MOTUS, PINs, and why updates get stuck
          </h2>
          <p className="mt-4 text-slate">
            FMCSA&apos;s move to the MOTUS system has made some updates harder than
            they used to be. To claim or change an existing USDOT online you may
            need a USDOT PIN, and getting one can lag during the MOTUS transition,
            since the record has to be claimed and linked and account lockouts are
            common, which can leave carriers waiting. When the online
            path is blocked, we know the workarounds, including paper filings and
            triggering an official FMCSA callback so a live agent can verify your
            identity and unlock the record. This is daily work for us.
          </p>
        </Container>
      </Section>

      {/* FAQ */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            MCS-150 update FAQ
          </h2>
          <div className="mt-6">
            <FaqAccordion items={faqs} />
          </div>
        </Container>
      </Section>

      {/* Quiet funnel handoff forward to dispatch. */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <p className="text-slate">
            Keeping your number active is the upkeep side of running. When you are
            ready to keep it loaded, see our{" "}
            <CrossLink href="/services/">dispatch services</CrossLink>.
          </p>
        </Container>
      </Section>

      <ClosingCta
        text="Due for your biennial update, or need a correction? We will file it and confirm it landed."
        cta={{ label: "Update my MCS-150", href: filingCtaHref }}
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
