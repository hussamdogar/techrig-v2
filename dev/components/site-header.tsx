"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { Container } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import {
  ChevronDownIcon,
  CloseIcon,
  FilingIcon,
  MenuIcon,
  PhoneIcon,
  TrailerNavIcon,
  icons,
} from "@/components/icons";
import { site } from "@/lib/site";
import {
  companyNav,
  complianceNav,
  dispatchNav,
  type NavLink,
} from "@/lib/services";

/**
 * The page's single primary action. Defaults to the compliance-led action used
 * on home and the compliance hub; pages with a different action (e.g. a trailer
 * page) can pass their own. This is the header's only Signal element.
 */
type Cta = { label: string; href: string };
const defaultCta: Cta = {
  label: "Start your compliance setup",
  href: "/compliance-services/",
};

const navLinkClass =
  "text-sm text-cloud/85 transition-colors hover:text-cloud outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cloud";

// A mega-menu: opens on hover and on keyboard focus (focus-within), no JS state,
// so it is operable by tab. The leading icon + chevron distinguish the two silo
// triggers from the plain About/Contact links.
function MegaMenu({
  label,
  icon: TriggerIcon,
  children,
}: {
  label: string;
  icon: typeof FilingIcon;
  children: React.ReactNode;
}) {
  return (
    <div className="group relative">
      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded px-1 py-2 text-sm font-medium text-cloud/85 transition-colors hover:text-cloud outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cloud"
        aria-haspopup="true"
      >
        <TriggerIcon size={18} className="text-cloud/70" />
        {label}
        <ChevronDownIcon
          size={16}
          className="text-cloud/60 transition-transform group-hover:rotate-180 group-focus-within:rotate-180"
        />
      </button>
      {/* Cloud panel under the bar. Invisible until hover/focus. */}
      <div className="invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition-opacity duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <div className="rounded-card border border-slate/15 bg-cloud p-4 shadow-card">
          {children}
        </div>
      </div>
    </div>
  );
}

// A link inside a mega panel (Ink text on the Cloud panel).
function PanelLink({ link }: { link: NavLink }) {
  const Icon = link.icon ? icons[link.icon] : null;
  return (
    <Link
      href={link.slug}
      className="flex items-center gap-2 rounded px-2 py-1.5 text-sm text-ink transition-colors hover:bg-paper outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
    >
      {Icon ? <Icon size={18} className="shrink-0 text-steel" /> : null}
      {link.label}
    </Link>
  );
}

export function SiteHeader({ cta = defaultCta }: { cta?: Cta }) {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // A hairline appears under the bar only after scroll, so the resting hero
  // reads as one calm field.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  return (
    <header
      className={`sticky top-0 z-40 bg-ink ${
        scrolled ? "border-b border-cloud/15" : "border-b border-transparent"
      }`}
    >
      <Container className="flex h-14 items-center justify-between gap-4 md:h-16">
        {/* Wordmark, at/above the 80px mobile / 96px desktop minimum width. */}
        <Link
          href="/"
          aria-label="Tech Rig home"
          className="rounded outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cloud"
        >
          <Logo className="w-[88px] text-cloud md:w-[104px]" />
        </Link>

        {/* Desktop nav */}
        <nav
          aria-label="Primary"
          className="hidden items-center gap-6 lg:flex"
        >
          <MegaMenu label="Compliance" icon={FilingIcon}>
            <p className="mb-2 px-2 font-display text-xs font-semibold uppercase tracking-wide text-slate">
              Compliance &amp; setup
            </p>
            <div className="grid w-[34rem] grid-cols-2 gap-x-4">
              <div>
                {complianceNav.slice(0, 8).map((link) => (
                  <PanelLink key={link.slug} link={link} />
                ))}
              </div>
              <div>
                {complianceNav.slice(8).map((link) => (
                  <PanelLink key={link.slug} link={link} />
                ))}
              </div>
            </div>
          </MegaMenu>

          <MegaMenu label="Dispatch" icon={TrailerNavIcon}>
            <p className="mb-2 px-2 font-display text-xs font-semibold uppercase tracking-wide text-slate">
              Truck dispatch
            </p>
            <div className="w-64">
              {dispatchNav.map((link) => (
                <PanelLink key={link.slug} link={link} />
              ))}
            </div>
          </MegaMenu>

          <Link href="/about-us/" className={navLinkClass}>
            About
          </Link>
          <Link href="/contact-us/" className={navLinkClass}>
            Contact
          </Link>
        </nav>

        {/* Conversion pair: amber primary (the only Signal element) + Call. */}
        <div className="flex items-center gap-2">
          <Link
            href={cta.href}
            className={`${buttonVariants({ variant: "primary", size: "sm" })} hidden sm:inline-flex`}
          >
            {cta.label}
          </Link>
          <a
            href={site.telHref}
            className={buttonVariants({ variant: "outlineOnInk", size: "sm" })}
            aria-label={`Call Tech Rig at ${site.telephone}`}
          >
            <PhoneIcon size={16} />
            <span className="hidden sm:inline">Call</span>
          </a>
          {/* Mobile drawer toggle */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded text-cloud lg:hidden outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cloud"
            aria-label="Open menu"
            aria-expanded={drawerOpen}
          >
            <MenuIcon />
          </button>
        </div>
      </Container>

      {drawerOpen ? (
        <MobileDrawer cta={cta} onClose={() => setDrawerOpen(false)} />
      ) : null}
    </header>
  );
}

// Full-height Ink drawer: collapsible Compliance/Dispatch sections, then About
// and Contact, with the amber primary + Call repeated at the foot for thumb reach.
function MobileDrawer({ cta, onClose }: { cta: Cta; onClose: () => void }) {
  const [openSection, setOpenSection] = useState<"compliance" | "dispatch" | null>(
    "compliance",
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-ink lg:hidden">
      <Container className="flex h-14 items-center justify-between">
        <Logo className="w-[88px] text-cloud" />
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-11 w-11 items-center justify-center rounded text-cloud outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cloud"
          aria-label="Close menu"
        >
          <CloseIcon />
        </button>
      </Container>

      <nav
        aria-label="Mobile"
        className="flex-1 overflow-y-auto pb-6"
      >
        <Container className="space-y-1">
          <DrawerSection
            label="Compliance"
            links={complianceNav}
            open={openSection === "compliance"}
            onToggle={() =>
              setOpenSection((s) => (s === "compliance" ? null : "compliance"))
            }
            onNavigate={onClose}
          />
          <DrawerSection
            label="Dispatch"
            links={dispatchNav}
            open={openSection === "dispatch"}
            onToggle={() =>
              setOpenSection((s) => (s === "dispatch" ? null : "dispatch"))
            }
            onNavigate={onClose}
          />
          {companyNav.slice(0, 2).map((link) => (
            <Link
              key={link.slug}
              href={link.slug}
              onClick={onClose}
              className="block border-b border-cloud/10 py-3 font-display text-base text-cloud outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cloud"
            >
              {link.label}
            </Link>
          ))}
        </Container>
      </nav>

      {/* Conversion floor, repeated for thumb reach. */}
      <Container className="flex items-center gap-3 border-t border-cloud/15 py-4">
        <Link
          href={cta.href}
          onClick={onClose}
          className={`${buttonVariants({ variant: "primary", size: "md" })} flex-1`}
        >
          {cta.label}
        </Link>
        <a
          href={site.telHref}
          className={buttonVariants({ variant: "outlineOnInk", size: "md" })}
          aria-label={`Call Tech Rig at ${site.telephone}`}
        >
          <PhoneIcon size={18} />
        </a>
      </Container>
    </div>
  );
}

function DrawerSection({
  label,
  links,
  open,
  onToggle,
  onNavigate,
}: {
  label: string;
  links: NavLink[];
  open: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  return (
    <div className="border-b border-cloud/10">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-3 font-display text-base text-cloud outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cloud"
      >
        {label}
        <ChevronDownIcon
          size={18}
          className={`text-cloud/60 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open ? (
        <ul className="pb-3">
          {links.map((link) => {
            const Icon = link.icon ? icons[link.icon] : null;
            return (
              <li key={link.slug}>
                <Link
                  href={link.slug}
                  onClick={onNavigate}
                  className="flex items-center gap-2 py-2 pl-1 text-sm text-cloud/80 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cloud"
                >
                  {Icon ? <Icon size={18} className="text-cloud/50" /> : null}
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
