import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { FaqAccordion, type Faq } from "@/components/faq-accordion";
import { ReviewedBy } from "@/components/reviewed-by";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ClosingCta } from "@/components/closing-cta";
import { JsonLd } from "@/components/json-ld";
import { Boc3IncludedBadge } from "@/components/boc3-included-badge";
import { PackageCard } from "@/components/package-card";
import { PackageMatrixMap } from "@/components/package-matrix-map";
import { PackageSelector } from "@/components/package-selector";
import { PackageComparisonTable } from "@/components/package-comparison-table";
import { breadcrumbNode, faqNode, graph, personNode, pricedOfferCatalogNode } from "@/lib/schema";
import { BUNDLES, BUNDLE_KEYS, getBundleBreakdown } from "@/lib/services-registry";

const applyHref = "/apply/";

export const metadata: Metadata = {
  title: { absolute: "Trucking Compliance Packages and Bundles | Tech Rig" },
  description:
    "Four trucking compliance packages, from $400. Pick by authority status and vehicle type, get BOC-3, UCR, and driver compliance bundled at a lower price.",
  alternates: { canonical: "/compliance-packages/" },
  openGraph: {
    title: "Trucking Compliance Packages and Bundles | Tech Rig",
    description:
      "Four trucking compliance packages, from $400. Pick by authority status and vehicle type, get BOC-3, UCR, and driver compliance bundled at a lower price.",
    url: "/compliance-packages/",
    type: "website",
  },
};

const faqs: Faq[] = [
  {
    q: "How do I pick a package?",
    a: "By your authority status (already running vs new) and your vehicle (CDL/heavy vs not). Choose by the vehicle you operate, not only whether the driver holds a CDL.",
  },
  {
    q: "Is BOC-3 included?",
    a: "Yes, in every package. For existing carriers it is a BOC-3 filing when required, or verification your BOC-3 is correctly on file.",
  },
  {
    q: "What is not included?",
    a: "IRP and IFTA government, state, plate, credential, and jurisdiction fees are billed separately. Additional drivers beyond the first are priced by count.",
  },
  {
    q: "Can I buy a service on its own instead?",
    a: "Yes. Every service is available a la carte at its standalone price; the packages are a lower-priced bundle.",
  },
];

export default function CompliancePackagesPage() {
  const bundles = BUNDLE_KEYS.map((k) => BUNDLES[k]);
  const breakdowns = Object.fromEntries(BUNDLE_KEYS.map((k) => [k, getBundleBreakdown(k)]));

  return (
    <>
      <JsonLd
        data={graph(
          pricedOfferCatalogNode(
            "Trucking compliance packages",
            bundles.map((b) => ({ name: b.name, slug: "/compliance-packages/", price: breakdowns[b.key].finalPrice })),
          ),
          breadcrumbNode([
            { name: "Home", slug: "/" },
            { name: "Compliance Services", slug: "/compliance-services/" },
            { name: "Packages" },
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
              { name: "Packages" },
            ]}
          />
          <div className="mt-6 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h1 className="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink">
                Trucking Compliance Packages
              </h1>
              <p className="mt-5 max-w-[60ch] text-lg text-slate">
                Buying your filings one by one adds up. Our compliance packages bundle the services a carrier needs
                at a lower price than a la carte, with BOC-3 included in every one. Pick the package that matches
                where you are (new authority or already running) and what you drive (a CDL/heavy vehicle or not).
              </p>
              <div className="mt-7">
                <Link href={applyHref} className={buttonVariants({ variant: "primary", size: "md" })}>
                  Choose your package
                </Link>
              </div>
              <div className="mt-5">
                <ReviewedBy name="Adam Smith" role="Co-Founder" />
              </div>
            </div>

            <PackageMatrixMap />
          </div>
        </Container>
      </Section>

      {/* Choose by authority status + vehicle */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            Choose the package that matches your authority status and vehicle type
          </h2>
          <p className="mt-4 text-slate">
            Every package includes BOC-3 filing or verification, UCR for the 0-2 vehicle bracket, and initial
            compliance for one driver. Packages for heavy interstate vehicles also include CDL-driver compliance,
            IRP setup, and IFTA setup. IRP and IFTA government and jurisdiction fees are separate.
          </p>
          <div className="mt-6">
            <PackageSelector />
          </div>
        </Container>
      </Section>

      {/* Choose by vehicle, not just license */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            Choose by the vehicle, not just the driver&apos;s license
          </h2>
          <p className="mt-4 text-slate">
            Choose based on the vehicle you will operate, not only whether the driver already holds a CDL. A driver
            may have a CDL but operate a vehicle that does not require one. In that case, the non-CDL vehicle
            package may apply.
          </p>
          <div className="mt-6 rounded-card border border-slate/25 bg-cloud p-5">
            <p className="text-ink">
              These packages are designed for interstate property carriers operating qualifying heavy vehicles or
              combinations that require CDL compliance, IRP, and IFTA.
            </p>
            <p className="mt-3 text-slate">
              Passenger and hazardous-material operations may require custom review.{" "}
              <Link
                href="/contact-us/"
                className="font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
              >
                Contact us
              </Link>
              .
            </p>
          </div>
        </Container>
      </Section>

      {/* The four packages */}
      <Section surface="cloud">
        <Container>
          <h2 className="font-display text-3xl font-bold text-ink">The four packages</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {bundles.map((b) => (
              <PackageCard key={b.key} bundle={b} id={`package-${b.key}`} />
            ))}
          </div>
        </Container>
      </Section>

      {/* BOC-3 Included band */}
      <Section surface="paper">
        <Container className="max-w-3xl text-center">
          <h2 className="font-display text-3xl font-bold text-ink">BOC-3 Included in every package</h2>
          <div className="mt-5 flex justify-center">
            <Boc3IncludedBadge />
          </div>
          <p className="mt-4 text-slate">
            For existing carriers: includes BOC-3 filing when required or verification that the carrier&apos;s
            existing BOC-3 is correctly on file.
          </p>
        </Container>
      </Section>

      {/* Comparison table */}
      <Section surface="cloud">
        <Container>
          <h2 className="font-display text-3xl font-bold text-ink">Compare the packages</h2>
          <div className="mt-6">
            <PackageComparisonTable />
          </div>
        </Container>
      </Section>

      {/* Additional drivers */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">Additional drivers</h2>
          <p className="mt-4 text-slate">
            Every package includes one driver. Additional drivers are priced by total count, and bundle pricing is
            always lower than standalone. In-bundle Driver Qualification pricing: 2 drivers $350 total (+$150), 3
            drivers $450 total (+$100), more than 3 is a custom quote. Additional CDL drivers may also need extra
            pre-employment drug tests, Clearinghouse work, and consortium/compliance work. See{" "}
            <Link
              href="/driver-qualification-files/"
              className="font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
            >
              driver qualification files
            </Link>
            .
          </p>
        </Container>
      </Section>

      {/* Renewals */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">Renewals and recurring billing</h2>
          <p className="mt-4 text-slate">
            Package pricing covers the initial filing and first service period. UCR, consortium enrollment, Driver
            Qualification files, and IRP require renewal. IFTA returns are filed quarterly. We send reminders and
            invoices before services become due. Automatic billing is only used when the customer expressly
            authorizes it.
          </p>
        </Container>
      </Section>

      {/* FAQ */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">Packages FAQ</h2>
          <div className="mt-6">
            <FaqAccordion items={faqs} />
          </div>
        </Container>
      </Section>

      <ClosingCta
        text="Not sure which one? Answer two questions and we will match you. Choose your package."
        cta={{ label: "Choose your package", href: applyHref }}
      />
    </>
  );
}
