import Link from "next/link";
import { Logo } from "@/components/logo";
import { Container } from "@/components/ui/container";
import { icons } from "@/components/icons";
import { site, socialLinks } from "@/lib/site";
import {
  companyNav,
  complianceNav,
  dispatchNav,
  legalNav,
  type NavLink,
} from "@/lib/services";

// Cloud-on-Ink nav link with a visible focus ring (Cloud outline reads on Ink).
const footerLinkClass =
  "inline-flex items-center gap-2 text-sm text-cloud/75 underline-offset-4 transition-colors hover:text-cloud hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cloud";

function FooterLink({ link }: { link: NavLink }) {
  const Icon = link.icon ? icons[link.icon] : null;
  return (
    <li>
      <Link href={link.slug} className={footerLinkClass}>
        {Icon ? <Icon size={16} className="shrink-0 text-cloud/50" /> : null}
        {link.label}
      </Link>
    </li>
  );
}

// Column heading: an Archivo navigation label (a styled paragraph, not a heading).
function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 font-display text-sm font-semibold tracking-wide text-cloud">
      {children}
    </p>
  );
}

/**
 * The global mega-footer. Identical on every page so the internal-link equity is
 * consistent. Full-bleed Ink (a reserved high-emphasis surface): trust + NAP
 * band, four nav columns (Compliance split into two sub-columns), the single
 * FMCSA trust line, the social slot (empty until URLs arrive), and the legal
 * baseline. Text-and-CSS only, no heavy assets, to protect Core Web Vitals.
 * Carries no Signal element: the funnel CTAs live in page bodies.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();
  const half = Math.ceil(complianceNav.length / 2);

  return (
    <footer className="bg-ink text-cloud">
      <Container className="py-14 md:py-16">
        {/* Trust + NAP band */}
        <div className="flex flex-col gap-8 border-b border-cloud/15 pb-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Link
              href="/"
              aria-label="Tech Rig home"
              className="inline-block outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cloud"
            >
              <Logo className="w-[150px] text-cloud" />
            </Link>
            <p className="mt-4 text-sm text-cloud/75">{site.positioning}</p>
          </div>

          {/* NAP in the mono "official record" treatment. */}
          <address className="font-mono text-sm not-italic text-cloud/75">
            <p>{site.address.street}</p>
            <p>
              {site.address.locality}, {site.address.region}{" "}
              {site.address.postalCode}
            </p>
            <p className="mt-3">
              <a
                href={site.telHref}
                className="underline-offset-4 hover:text-cloud hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cloud"
              >
                {site.telephone}
              </a>
            </p>
            <p>
              <a
                href={`mailto:${site.email}`}
                className="underline-offset-4 hover:text-cloud hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cloud"
              >
                {site.email}
              </a>
            </p>
          </address>
        </div>

        {/* Navigation columns */}
        <nav
          aria-label="Footer"
          className="grid grid-cols-2 gap-x-8 gap-y-10 py-10 md:grid-cols-4"
        >
          {/* Column 1: Compliance, split into two balanced sub-columns. */}
          <div className="col-span-2 md:col-span-2">
            <Link
              href="/compliance-services/"
              className="mb-4 inline-block font-display text-sm font-semibold tracking-wide text-cloud underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cloud"
            >
              Compliance Services
            </Link>
            <div className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
              <ul className="space-y-2">
                {complianceNav.slice(0, half).map((link) => (
                  <FooterLink key={link.slug} link={link} />
                ))}
              </ul>
              <ul className="space-y-2">
                {complianceNav.slice(half).map((link) => (
                  <FooterLink key={link.slug} link={link} />
                ))}
              </ul>
            </div>
          </div>

          {/* Column 2: Dispatch */}
          <div>
            <Link
              href="/services/"
              className="mb-4 inline-block font-display text-sm font-semibold tracking-wide text-cloud underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cloud"
            >
              Dispatch Services
            </Link>
            <ul className="space-y-2">
              {dispatchNav.map((link) => (
                <FooterLink key={link.slug} link={link} />
              ))}
            </ul>
          </div>

          {/* Columns 3 + 4 stacked on the right */}
          <div className="space-y-10">
            <div>
              <ColumnHeading>Company</ColumnHeading>
              <ul className="space-y-2">
                {companyNav.map((link) => (
                  <FooterLink key={link.slug} link={link} />
                ))}
              </ul>
            </div>
            <div>
              <ColumnHeading>Legal</ColumnHeading>
              <ul className="space-y-2">
                {legalNav.map((link) => (
                  <FooterLink key={link.slug} link={link} />
                ))}
              </ul>
            </div>
          </div>
        </nav>

        {/* FMCSA line: the only trust claim, a sentence, never a badge or seal. */}
        <p className="border-t border-cloud/15 pt-8 text-sm text-cloud/75">
          {site.fmcsaLine}
        </p>

        {/* Social slot: renders nothing while socialLinks is empty (URLs pending). */}
        {socialLinks.length > 0 ? (
          <ul className="mt-6 flex gap-4">
            {socialLinks.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  className="text-cloud/70 hover:text-cloud outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cloud"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        ) : null}

        {/* Legal baseline. Legal entity name appears here (and only here + legal pages + schema). */}
        <p className="mt-8 text-xs text-cloud/60">
          &copy; {year} {site.legalName}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
