import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { UsdotLookupCard } from "@/components/usdot-lookup-card";
import { dispatchNav } from "@/lib/services";
import { site } from "@/lib/site";
import {
  ArrowRightIcon,
  FilingIcon,
  RouteNodeIcon,
  ShieldIcon,
  StampIcon,
  icons,
} from "@/components/icons";

// Home inherits the root default title (the brief's exact title tag). It adds
// its own canonical and Open Graph data; the OG image is app/opengraph-image.tsx.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    title: "Trucking compliance and dispatch",
    description:
      "Tech Rig gets new carriers road-legal and keeps trucks loaded: compliance and authority setup, plus truck dispatch for owner-operators and fleets.",
    url: "/",
    type: "website",
  },
};

// The four curated top filings shown in the compliance silo block (brief: these
// four only; the full list lives in the mega-footer).
const topFilings = [
  { label: "USDOT", href: "/dot-registration/", Icon: FilingIcon },
  { label: "MC authority", href: "/mc-registration/", Icon: StampIcon },
  { label: "BOC-3", href: "/boc-3-filing/", Icon: ShieldIcon },
  { label: "UCR", href: "/ucr-registration/", Icon: RouteNodeIcon },
];

// The six trailer types, as a quiet capability strip (icons from the trailer set).
const trailers = dispatchNav.filter((t) => t.icon);

export default function Home() {
  return (
    <>
      {/* 1. Hero: compliance-led, dual offering legible, tracker as the signature. */}
      <Section surface="paper" className="pt-12 md:pt-16">
        <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-ink">
              Trucking Compliance and Truck Dispatch, Under One Roof
            </h1>
            {/* Styled subhead, not a heading. */}
            <p className="mt-6 max-w-[60ch] text-lg text-slate">
              Tech Rig does the two things a trucking business needs most: we get
              you legally set up to operate, and we keep your truck earning once
              you are. New carriers come to us to get their authority and
              compliance done right. Owner-operators stay with us to find and
              book loads. One team for the whole journey.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/compliance-services/"
                className={buttonVariants({ variant: "primary", size: "md" })}
              >
                Start your compliance setup
              </Link>
              <Link
                href="/services/"
                className={buttonVariants({ variant: "secondary", size: "md" })}
              >
                Get your truck dispatched
              </Link>
            </div>
          </div>

          {/* The hero's lead-generating front door (Application Platform M1).
              Replaces the decorative AuthorityStatusTracker, which is reserved
              for reuse as the real dashboard progress tracker in M5. Client
              island: the homepage stays prerendered and ships no DB/payment. */}
          <UsdotLookupCard />
        </Container>
      </Section>

      {/* 2. Compliance silo block (Cloud, Ink/Signal accents). */}
      <Section surface="cloud">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            Trucking compliance and company setup
          </h2>
          <p className="mt-4 text-slate">
            Starting out, or fixing a setup that stalled? We handle USDOT and MC
            authority, BOC-3, UCR, driver compliance, IRP and IFTA, plus ELD
            through our partner, individually or as one package. We are
            officially listed by FMCSA as a BOC-3 blanket process-agent company,
            and we know the new MOTUS system inside out.
          </p>

          {/* Curated cluster of the top filings, labeled links with line icons. */}
          <ul className="mt-6 flex flex-wrap gap-3">
            {topFilings.map(({ label, href, Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="inline-flex items-center gap-2 rounded-btn border border-slate/20 bg-paper px-3 py-2 text-sm font-medium text-ink transition-colors hover:border-steel hover:text-steel outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
                >
                  <Icon size={18} className="text-steel" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-6">
            <Link
              href="/compliance-services/"
              className="inline-flex items-center gap-1 font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
            >
              See compliance services
              <ArrowRightIcon size={16} />
            </Link>
          </p>
        </Container>
      </Section>

      {/* 3. Dispatch silo block (Paper, Steel accent, deliberately not symmetric). */}
      <Section surface="paper" className="border-l-4 border-steel">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-ink">
            Truck dispatch that keeps you loaded
          </h2>
          <p className="mt-4 text-slate">
            Once your authority is active, we keep the freight coming. We dispatch
            owner-operators and small fleets across box truck, reefer, flatbed,
            dry van, power only, and hot shot, with no long-term contracts and no
            forced dispatch. You keep your authority; we keep it busy.
          </p>

          {/* Pricing model in the mono "official record" treatment. */}
          <p className="mt-5 font-mono text-sm text-ink">
            We charge a percentage of your gross by equipment, so we only win when
            you do.
          </p>

          {/* Quiet capability strip: the six trailer line icons. */}
          <ul className="mt-6 grid grid-cols-3 gap-4 sm:grid-cols-6">
            {trailers.map((t) => {
              const Icon = icons[t.icon!];
              return (
                <li
                  key={t.slug}
                  className="flex flex-col items-center gap-2 text-center"
                >
                  <Icon size={28} className="text-steel" />
                  <span className="text-xs text-slate">
                    {t.label.replace(" Dispatch", "")}
                  </span>
                </li>
              );
            })}
          </ul>

          <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            <Link
              href="/services/"
              className="inline-flex items-center gap-1 font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
            >
              See dispatch services
              <ArrowRightIcon size={16} />
            </Link>
            <Link
              href="/box-truck-dispatch/"
              className="font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
            >
              Box truck dispatch
            </Link>
          </p>
        </Container>
      </Section>

      {/* 4. Trust band: documented proof only. */}
      <Section surface="cloud">
        <Container>
          <h2 className="font-display text-3xl font-bold text-ink">
            Why carriers trust Tech Rig
          </h2>

          {/* Track-record figures in the mono "official record" treatment. */}
          <dl className="mt-8 grid gap-6 sm:grid-cols-3">
            <div className="border-t-2 border-steel pt-3">
              <dt className="font-mono text-sm uppercase tracking-[0.08em] text-slate">
                Since 2021
              </dt>
              <dd className="mt-1 text-ink">
                Around 100 carriers dispatched.
              </dd>
            </div>
            <div className="border-t-2 border-steel pt-3">
              <dt className="font-mono text-sm uppercase tracking-[0.08em] text-slate">
                Since 2025
              </dt>
              <dd className="mt-1 text-ink">
                40+ compliance clients across 10+ states.
              </dd>
            </div>
            <div className="border-t-2 border-signal pt-3">
              <dt className="font-mono text-sm uppercase tracking-[0.08em] text-slate">
                FMCSA listed
              </dt>
              <dd className="mt-1 text-ink">
                BOC-3 blanket process-agent company.
              </dd>
            </div>
          </dl>

          <p className="mt-8 max-w-2xl text-slate">
            We work with Motive for ELD and with OTR Solutions and RTS Financial
            for factoring. {site.fmcsaLine}
          </p>

          {/* Graceful, empty-friendly review slot (no ratings, no invented proof). */}
          <p className="mt-6 max-w-2xl text-sm text-slate">
            Client stories appear here as permissions clear.
          </p>
        </Container>
      </Section>

      {/* 5. Funnel bridge: full-bleed Ink (reserved high-emphasis moment). */}
      <Section surface="ink">
        <Container className="max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-cloud">
            The whole journey, one team
          </h2>
          <p className="mt-4 text-cloud/80">
            Most providers do compliance or dispatch. We do both, which means the
            company that gets your authority active is the same one that keeps
            your truck loaded after. New here? Start with our{" "}
            <Link
              href="/how-to-start-a-trucking-company/"
              className="font-medium text-signal underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cloud"
            >
              guide to starting a trucking company
            </Link>
            .
          </p>

          {/* Two-step funnel diagram in the line system. */}
          <div className="mt-8 flex items-center gap-4">
            <span className="rounded-btn border border-cloud/30 px-4 py-2 font-display text-sm font-semibold text-cloud">
              Get road-legal
            </span>
            <ArrowRightIcon size={24} className="text-signal" />
            <span className="rounded-btn border border-cloud/30 px-4 py-2 font-display text-sm font-semibold text-cloud">
              Keep loaded
            </span>
          </div>
        </Container>
      </Section>

      {/* 6. Closing CTA: one dominant next step. */}
      <Section surface="paper">
        <Container className="max-w-2xl text-center">
          <p className="font-display text-2xl font-bold text-ink">
            Whether you are starting out or already rolling, we have the next
            step. Talk to us.
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              href="/compliance-services/"
              className={buttonVariants({ variant: "primary", size: "md" })}
            >
              Start your compliance setup
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
