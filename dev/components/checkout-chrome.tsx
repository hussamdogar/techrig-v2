import Link from "next/link";
import { Logo } from "@/components/logo";
import { Container } from "@/components/ui/container";
import { PhoneIcon } from "@/components/icons";
import { TrackedAnchor } from "@/components/tracked-anchor";
import { legalNav } from "@/lib/services";
import { site } from "@/lib/site";

/**
 * Slim header and footer for the quick-buy checkout (/buy/..., owner
 * 2026-10-13), rendered by the root layout on /buy/ in place of the
 * site-wide header and mega-footer. The header is the /lp/ landing header
 * (app/lp/_shared/landing-header.tsx) reduced to the logo and the call
 * button: no nav, no menu and no page CTA, so nothing pulls a carrier out of
 * checkout, while the phone number stays one tap away. Same height as the
 * landing header (h-14 / md:h-16), which the cookie notice's under-the-header
 * bar relies on.
 */
export function CheckoutHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-cloud/15 bg-ink">
      <Container className="flex h-14 items-center justify-between gap-4 md:h-16">
        <Link
          href="/"
          aria-label="Tech Rig home"
          className="rounded outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cloud"
        >
          <Logo className="w-[88px] text-cloud md:w-[104px]" />
        </Link>
        <TrackedAnchor
          href={site.telHref}
          event="call_click"
          data={{ location: "checkout_header" }}
          aria-label={`Call Tech Rig at ${site.telephone}`}
          className="inline-flex min-h-11 items-center gap-1.5 rounded px-1 text-sm font-medium text-cloud/85 outline-none transition-colors hover:text-cloud focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cloud"
        >
          <PhoneIcon size={16} aria-hidden="true" />
          {site.telephone}
        </TrackedAnchor>
      </Container>
    </header>
  );
}

/** One dark strip: contact, the legal links and the copyright line. */
export function CheckoutFooter() {
  return (
    <footer className="bg-ink text-cloud">
      <Container className="flex flex-col gap-4 py-8 text-sm text-cloud/75 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <a
            href={site.telHref}
            className="underline-offset-4 hover:text-cloud hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cloud"
          >
            {site.telephone}
          </a>
          <a
            href={`mailto:${site.email}`}
            className="underline-offset-4 hover:text-cloud hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cloud"
          >
            {site.email}
          </a>
          {legalNav.map((link) => (
            <Link
              key={link.slug}
              href={link.slug}
              className="underline-offset-4 hover:text-cloud hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cloud"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <p className="text-xs text-cloud/60">
          &copy; {new Date().getFullYear()} {site.legalName}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
