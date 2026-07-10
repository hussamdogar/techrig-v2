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
  ShieldIcon,
} from "@/components/icons";
import {
  breadcrumbNode,
  faqNode,
  graph,
  personNode,
  serviceNode,
} from "@/lib/schema";
import { pricing } from "@/lib/services";

// Primary file/apply CTAs route into the /apply engine, prefilled for the Clearinghouse.
const applyHref = "/apply/?service=clearinghouse";

export const metadata: Metadata = {
  title: "FMCSA Clearinghouse Registration",
  description:
    "FMCSA Clearinghouse registration handled for you. We register your company and drivers and connect it to your testing program so your compliance is complete.",
  alternates: { canonical: "/fmcsa-clearinghouse-registration/" },
  openGraph: {
    title: "FMCSA Clearinghouse Registration",
    description:
      "FMCSA Clearinghouse registration handled for you. We register your company and drivers and connect it to your testing program so your compliance is complete.",
    url: "/fmcsa-clearinghouse-registration/",
    type: "website",
  },
};

// Tracker scoped to where Clearinghouse registration sits: a driver-readiness
// step that runs once a CDL driver is put to work. It shows the federal sequence
// resolving to "Authority active", then marks this filing as a driver-readiness
// step that sits after authority and alongside the consortium, never as a node
// that gates activation. Honesty rules: no guaranteed dates, no countdown, no
// implied government endorsement.
const clearinghouseSteps: Step[] = [
  { label: "Application filed", status: "Filed", state: "filed", icon: "stamp" },
  {
    label: "21-day federal protest period",
    status: "Federal step",
    state: "progress",
    icon: "clock",
  },
  { label: "Authority active", status: "Active", state: "active", icon: "checkSeal" },
  {
    label: "Driver readiness: Clearinghouse + consortium",
    status: "Alongside",
    state: "progress",
    icon: "shield",
  },
];

// One source feeds both the visible FAQ and the FAQPage schema (verbatim parity).
// The consortium-vs-Clearinghouse answer carries an inline Steel anchor via aNode,
// whose visible text matches the plain `a` string used by the schema.
const faqs: Faq[] = [
  {
    q: "What is the FMCSA Clearinghouse?",
    a: "A federal database of CDL drug and alcohol violations that carriers must register with and query.",
  },
  {
    q: "Do I need it if I am an owner-operator?",
    a: "If you drive a CDL vehicle under FMCSA, the drug-and-alcohol rules generally apply, which includes Clearinghouse obligations. We confirm for your situation.",
  },
  {
    q: "Is the Clearinghouse the same as a consortium?",
    a: "No. The consortium administers your testing; the Clearinghouse records violations. You typically need both.",
    aNode: (
      <>
        No. The{" "}
        <CrossLink href="/drug-and-alcohol-consortium/">consortium</CrossLink>{" "}
        administers your testing; the Clearinghouse records violations. You
        typically need both.
      </>
    ),
  },
  {
    q: "How much does it cost?",
    a: "$100 for Clearinghouse registration assistance.",
    aNode: (
      <>
        <span className="font-mono tabular-nums text-ink">$100</span> for
        Clearinghouse registration assistance.
      </>
    ),
  },
];

export default function FmcsaClearinghouseRegistrationPage() {
  return (
    <>
      <JsonLd
        data={graph(
          serviceNode({
            serviceType: "FMCSA Clearinghouse registration",
            slug: "/fmcsa-clearinghouse-registration/",
            description:
              "Tech Rig registers your company in the FMCSA Clearinghouse, helps set up the required driver queries, and connects it to your consortium and driver qualification files.",
            price: 100,
          }),
          breadcrumbNode([
            { name: "Home", slug: "/" },
            { name: "Compliance Services", slug: "/compliance-services/" },
            { name: "FMCSA Clearinghouse Registration" },
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
              { name: "FMCSA Clearinghouse Registration" },
            ]}
          />
          <div className="mt-6 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h1 className="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink">
                FMCSA Clearinghouse Registration
              </h1>
              <p className="mt-5 max-w-[60ch] text-lg text-slate">
                The FMCSA Clearinghouse is the federal database of CDL drug and
                alcohol violations, and carriers are required to register and run
                the right queries on their drivers. New carriers often have it on
                their setup list without knowing exactly what it does or how it
                connects to their testing program. Tech Rig handles your FMCSA
                Clearinghouse registration and ties it to your{" "}
                <CrossLink href="/drug-and-alcohol-consortium/">
                  consortium
                </CrossLink>{" "}
                so the whole driver-compliance picture is in place.
              </p>
              <div className="mt-7">
                <Link
                  href={applyHref}
                  className={buttonVariants({ variant: "primary", size: "md" })}
                >
                  Register with the Clearinghouse
                </Link>
              </div>
              <div className="mt-5">
                <ReviewedBy name="Adam Smith" />
              </div>
            </div>

            <AuthorityStatusTracker steps={clearinghouseSteps} />
          </div>
        </Container>
      </Section>

      {/* What FMCSA Clearinghouse registration is */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            What FMCSA Clearinghouse registration is
          </h2>
          <p className="mt-4 text-slate">
            The Clearinghouse is an FMCSA-run online database that records CDL
            drivers&apos; drug and alcohol program violations and the
            return-to-duty process. Carriers must register, run pre-employment
            and annual queries on their drivers, and report certain information.
            It works alongside your{" "}
            <CrossLink href="/drug-and-alcohol-consortium/">
              drug and alcohol consortium
            </CrossLink>
            : the consortium administers testing, the Clearinghouse records and
            surfaces violations.
          </p>

          {/* Content-bearing two-node line diagram (design spec §4): carries the
              core distinction visually, not decoration. Single-line SVG language. */}
          <div className="mt-8 rounded-card border border-slate/15 bg-paper p-6 md:p-8">
            <div className="flex flex-col items-stretch gap-4 md:flex-row md:items-center md:gap-2">
              <div className="flex flex-1 items-start gap-3">
                <ShieldIcon size={24} className="mt-0.5 shrink-0 text-steel" />
                <p className="font-display text-sm font-semibold leading-snug text-ink">
                  Consortium administers testing
                </p>
              </div>

              {/* Labeled connector: queries and reporting flow between the nodes. */}
              <div
                className="flex shrink-0 flex-col items-center justify-center px-2"
                aria-hidden="true"
              >
                <span className="font-mono text-[0.625rem] uppercase tracking-[0.08em] text-slate">
                  queries
                </span>
                <svg
                  width={64}
                  height={16}
                  viewBox="0 0 64 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="my-1 hidden text-slate md:block"
                >
                  <path d="M4 8h52" />
                  <path d="m50 3 6 5-6 5" />
                </svg>
                <svg
                  width={16}
                  height={48}
                  viewBox="0 0 16 48"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="my-1 text-slate md:hidden"
                >
                  <path d="M8 4v40" />
                  <path d="m3 38 5 6 5-6" />
                </svg>
                <span className="font-mono text-[0.625rem] uppercase tracking-[0.08em] text-slate">
                  reporting
                </span>
              </div>

              <div className="flex flex-1 items-start gap-3">
                <FilingIcon size={24} className="mt-0.5 shrink-0 text-steel" />
                <p className="font-display text-sm font-semibold leading-snug text-ink">
                  Clearinghouse records and surfaces violations
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Who needs to register */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            Who needs to register
          </h2>

          {/* Scope line, not an included-item list: a single line item with a
              driver glyph, no green-check styling. */}
          <ul className="mt-6">
            <li className="flex gap-3 text-ink">
              <RouteNodeIcon size={20} className="mt-0.5 shrink-0 text-steel" />
              <span>
                Carriers that employ CDL drivers (including owner-operators who
                drive their own CDL vehicle).
              </span>
            </li>
          </ul>

          {/* Pre-employment requirement, with the inline link to where the
              pre-employment drug test is detailed. No dedicated route exists, so
              the anchor points to the consortium page where that test has its own
              section and price. */}
          <p className="mt-6 text-slate">
            New CDL drivers, including owner-operators, must complete{" "}
            <CrossLink href="/drug-and-alcohol-consortium/">
              pre-employment drug testing
            </CrossLink>{" "}
            before they perform safety-sensitive work.
          </p>

          {/* The honesty qualifier, set apart in Slate so it reads as scope. */}
          <p className="mt-6 border-l-4 border-steel pl-4 text-slate">
            Whether CDL drug-and-alcohol rules apply depends on your operation.
            We confirm before registering you.
          </p>
        </Container>
      </Section>

      {/* What our service includes + price */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            What our FMCSA Clearinghouse registration service includes
          </h2>
          {/* Standing statement: Tech Rig is a registered C/TPA with the FMCSA
              Drug & Alcohol Clearinghouse. Styled paragraph, never a heading. */}
          <p className="mt-4 text-slate">
            Tech Rig is registered as a C/TPA (consortium/third-party
            administrator) with the FMCSA Drug &amp; Alcohol Clearinghouse, so we
            handle this as part of your program directly.
          </p>
          <ul className="mt-6 space-y-5">
            <li className="flex gap-4">
              <CheckSealIcon size={24} className="mt-0.5 shrink-0 text-steel" />
              <span className="text-ink">
                We register your company in the Clearinghouse.
              </span>
            </li>
            <li className="flex gap-4">
              <CheckSealIcon size={24} className="mt-0.5 shrink-0 text-steel" />
              <span className="text-ink">
                We help set up the required queries on your drivers.
              </span>
            </li>
            <li className="flex gap-4">
              <CheckSealIcon size={24} className="mt-0.5 shrink-0 text-steel" />
              <span className="text-ink">
                We connect your Clearinghouse registration to your{" "}
                <CrossLink href="/drug-and-alcohol-consortium/">
                  consortium
                </CrossLink>{" "}
                and{" "}
                <CrossLink href="/driver-qualification-files/">
                  driver qualification files
                </CrossLink>
                , so your driver compliance is one coordinated set.
              </span>
            </li>
          </ul>

          {/* Price chip from the single source. Related costs are listed below as
              separate figures on their own pages, never blended into the chip. */}
          <div className="mt-8">
            <PriceChip
              price={pricing["/fmcsa-clearinghouse-registration/"]}
              label="Clearinghouse registration assistance"
            />
          </div>
          <p className="mt-4 text-slate">
            <CrossLink href="/drug-and-alcohol-consortium/">
              Consortium enrollment
            </CrossLink>{" "}
            ($150) and{" "}
            <CrossLink href="/driver-qualification-files/">
              DQ files
            </CrossLink>{" "}
            ($200 per driver) are separate, on their own pages.
          </p>
        </Container>
      </Section>

      {/* Driver-compliance cluster cross-link strip */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.08em] text-slate">
            The rest of the driver-compliance set
          </p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:gap-8">
            <span className="flex items-center gap-3 text-ink">
              <ShieldIcon size={20} className="shrink-0 text-steel" />
              <CrossLink href="/drug-and-alcohol-consortium/">
                drug and alcohol consortium
              </CrossLink>
            </span>
            <span className="flex items-center gap-3 text-ink">
              <FilingIcon size={20} className="shrink-0 text-steel" />
              <CrossLink href="/driver-qualification-files/">
                driver qualification files
              </CrossLink>
            </span>
          </div>
        </Container>
      </Section>

      {/* Funnel cross-link forward to dispatch */}
      <Section surface="paper">
        <Container className="max-w-3xl">
          <p className="text-slate">
            Authority active, keep your truck loaded with{" "}
            <CrossLink href="/services/">truck dispatch</CrossLink>.
          </p>
        </Container>
      </Section>

      {/* FAQ */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            FMCSA Clearinghouse FAQ
          </h2>
          <div className="mt-6">
            <FaqAccordion items={faqs} />
          </div>
        </Container>
      </Section>

      <ClosingCta
        text="Setting up driver compliance? Get your Clearinghouse registration handled with your testing program."
        cta={{ label: "Register with the Clearinghouse", href: applyHref }}
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
