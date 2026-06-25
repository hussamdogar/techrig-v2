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
import { pricing, type Price } from "@/lib/services";
import { filingCtaHref } from "@/lib/site";

// IFTA quarterly filing is a separate recurring service from the one-time $175
// setup: $150 service fee plus a government fee. Not in the per-slug map because
// it is a recurring filing, not a page-level setup price.
const quarterlyPrice: Price = { kind: "flat", amount: 150, govFee: true };

export const metadata: Metadata = {
  title: "IFTA Registration and Filing",
  description:
    "IFTA registration and quarterly filing made simple. We set up your IFTA account and stickers so you report interstate fuel tax correctly and stay compliant.",
  alternates: { canonical: "/ifta-registration/" },
  openGraph: {
    title: "IFTA Registration and Filing",
    description:
      "IFTA registration and quarterly filing made simple. We set up your IFTA account and stickers so you report interstate fuel tax correctly and stay compliant.",
    url: "/ifta-registration/",
    type: "website",
  },
};

// Per design-system Section 13 (DZ2), the Authority Status Tracker is omitted
// here: IFTA is a fuel-tax setup, not an authority-activation page, so it asserts
// no authority-lifecycle status. Do not reintroduce the tracker.

// One source feeds both the visible FAQ and the FAQPage schema (verbatim parity).
// The IRP cross-link in "Do I need IFTA and IRP?" is rendered via aNode; the
// plain `a` string stays link-free so the schema text matches the visible copy.
const faqs: Faq[] = [
  {
    q: "What is an IFTA sticker?",
    a: "A decal placed on your vehicle showing it is registered under the International Fuel Tax Agreement. You get them with your IFTA license.",
  },
  {
    q: "How often do I file IFTA?",
    a: "Quarterly. You report miles and fuel by state and settle the difference. Keeping mileage and fuel records as you go makes this simple.",
  },
  {
    q: "Do I need IFTA and IRP?",
    a: "Most interstate carriers need both. IFTA is fuel tax; IRP is plates and registration.",
    aNode: (
      <>
        Most interstate carriers need both. IFTA is fuel tax;{" "}
        <CrossLink href="/irp-registration/">IRP</CrossLink> is plates and
        registration.
      </>
    ),
  },
  {
    q: "What if I run in only one state?",
    a: "IFTA is for interstate operation. If you run purely intrastate, it may not apply. We confirm before you pay.",
  },
];

export default function IftaRegistrationPage() {
  return (
    <>
      <JsonLd
        data={graph(
          // IFTA setup fee is $175 (confirmed). State fees are separate and are
          // never encoded as the price.
          serviceNode({
            serviceType: "IFTA registration",
            slug: "/ifta-registration/",
            price: 175,
            description:
              "Tech Rig sets up your IFTA account and decals and supports your quarterly fuel-tax filing.",
          }),
          breadcrumbNode([
            { name: "Home", slug: "/" },
            { name: "Compliance Services", slug: "/compliance-services/" },
            { name: "IFTA Registration" },
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
              { name: "IFTA Registration" },
            ]}
          />
          <div className="mt-6 max-w-3xl">
            <div>
              <h1 className="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink">
                IFTA Registration and Filing
              </h1>
              <p className="mt-5 max-w-[60ch] text-lg text-slate">
                IFTA registration is how interstate carriers report and pay fuel
                taxes across the states they run, through one quarterly return
                instead of dealing with each state separately. Get your IFTA
                account and stickers set up wrong, or miss a quarterly filing,
                and you face penalties and audit headaches. Tech Rig sets up your
                IFTA registration correctly so the fuel-tax side of running
                interstate is one less thing to worry about.
              </p>
              <div className="mt-7">
                <Link
                  href={filingCtaHref}
                  className={buttonVariants({ variant: "primary", size: "md" })}
                >
                  Set up my IFTA
                </Link>
              </div>
              <div className="mt-5">
                <ReviewedBy name="Robert Hooke" />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* What IFTA registration is */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            What IFTA registration is
          </h2>
          <p className="mt-4 text-slate">
            The International Fuel Tax Agreement (IFTA) simplifies fuel-tax
            reporting for carriers operating in more than one state or province.
            You register in your base jurisdiction, receive an IFTA license and
            decals (stickers) for your vehicles, and file one quarterly fuel-tax
            return that reconciles the fuel you bought against the miles you ran
            in each state. It applies when a commercial vehicle operates across
            multiple member jurisdictions and carries persons or property, and:
            has two axles with a gross or registered weight over 26,000 lbs; or
            three or more axles regardless of weight; or is used in combination
            with a combined weight over 26,000 lbs.
          </p>

          {/* Exemptions (client QA): so carriers can self-qualify out. */}
          <p className="mt-6 border-l-4 border-steel pl-4 text-slate">
            Some operations are exempt: running entirely within one
            jurisdiction, recreational vehicles and personal non-commercial use,
            and certain government vehicles. If you are not sure IFTA applies, we
            confirm before you pay.
          </p>
        </Container>
      </Section>

      {/* IFTA vs IRP */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            IFTA vs IRP
          </h2>
          <p className="mt-4 text-slate">
            <CrossLink href="/irp-registration/">IRP</CrossLink> is about
            registration and apportioned plates. IFTA is about fuel tax. Most
            interstate carriers need both, and we set them up together, but they
            are separate programs.
          </p>

          {/* Two-item comparison in the line system, not mirrored cards. */}
          <dl className="mt-6 space-y-4">
            <div className="flex gap-3 border-l-4 border-steel pl-4">
              <RouteNodeIcon size={20} className="mt-0.5 shrink-0 text-steel" />
              <div>
                <dt className="font-display font-semibold text-ink">IRP</dt>
                <dd className="text-slate">Plates and registration.</dd>
              </div>
            </div>
            <div className="flex gap-3 border-l-4 border-steel pl-4">
              <FilingIcon size={20} className="mt-0.5 shrink-0 text-steel" />
              <div>
                <dt className="font-display font-semibold text-ink">IFTA</dt>
                <dd className="text-slate">Fuel tax.</dd>
              </div>
            </div>
          </dl>
        </Container>
      </Section>

      {/* What our IFTA registration service includes */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            What our IFTA registration service includes
          </h2>
          <ul className="mt-6 space-y-5">
            {[
              {
                Icon: CheckSealIcon,
                node: "We confirm IFTA applies to your operation and identify your base jurisdiction.",
              },
              {
                Icon: StampIcon,
                node: "We complete your IFTA registration so you receive your license and decals.",
              },
              {
                Icon: ClockIcon,
                node: "We explain the quarterly filing schedule and what records you need to keep (mileage and fuel receipts), so your returns are accurate.",
              },
              {
                Icon: FilingIcon,
                node: (
                  <>
                    We coordinate IFTA with your{" "}
                    <CrossLink href="/irp-registration/">IRP</CrossLink> setup.
                  </>
                ),
              },
            ].map(({ Icon, node }, i) => (
              <li key={i} className="flex gap-4">
                <Icon size={24} className="mt-0.5 shrink-0 text-steel" />
                <span className="text-ink">{node}</span>
              </li>
            ))}
          </ul>

          {/* Price chip from the single source ($175 setup fee). The govFee flag
              renders state fees on a separate Slate line, never as the price. */}
          <div className="mt-8">
            <PriceChip
              price={pricing["/ifta-registration/"]}
              label="IFTA setup fee"
              govFeeNote="+ state fees (vary)"
            />
          </div>
          <p className="mt-4 text-slate">
            Our IFTA setup fee is $175. State fees are separate and shown up front.
          </p>
        </Container>
      </Section>

      {/* Quarterly filing: a separate recurring service, distinct from setup. */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            IFTA quarterly filing
          </h2>
          <p className="mt-4 text-slate">
            The setup above is a one-time account and decal setup. The quarterly
            filing is the recurring part: every quarter you file one fuel-tax
            return that reconciles the miles you ran and the fuel you bought in
            each member jurisdiction, then settle the balance. We prepare and
            file that return for you each quarter so you do not miss a deadline.
          </p>

          <div className="mt-8">
            <PriceChip
              price={quarterlyPrice}
              label="IFTA quarterly filing"
              govFeeNote="+ government fee"
            />
          </div>
          <p className="mt-4 text-slate">
            Our quarterly filing fee is $150, plus the government fee. This is
            separate from the one-time $175 setup.
          </p>

          <p className="mt-6">
            <Link
              href={filingCtaHref}
              className="font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
            >
              Set up quarterly filing
            </Link>
          </p>
        </Container>
      </Section>

      {/* FAQ */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            IFTA registration FAQ
          </h2>
          <div className="mt-6">
            <FaqAccordion items={faqs} />
          </div>

          {/* Quiet funnel handoff to dispatch (brief marks it optional). */}
          <p className="mt-8 text-sm text-slate">
            Set up and ready to run? See our{" "}
            <CrossLink href="/services/">dispatch services</CrossLink>.
          </p>
        </Container>
      </Section>

      <ClosingCta
        text="Running across state lines? Get your IFTA set up so quarterly filing is simple."
        cta={{ label: "Set up my IFTA", href: filingCtaHref }}
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
