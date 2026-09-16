"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { Container } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { CloseIcon, MenuIcon, PhoneIcon } from "@/components/icons";
import { pushDataLayerEvent } from "@/lib/gtm";
import { site } from "@/lib/site";

const NAV = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#reviews", label: "Reviews" },
  { href: "#faq", label: "FAQ" },
];

const SCROLL_DURATION_MS = 900;
const HINT_VISIBLE_MS = 4000;

/**
 * Deliberately slow, eased scroll to the hero's USDOT form, instead of an
 * instant anchor jump or the browser's (fast, inconsistent-across-browsers)
 * native smooth scroll. On arrival: focus the field (native focus ring) and
 * flash a short-lived "enter it here" hint above it. Skips the animation for
 * `prefers-reduced-motion` and jumps straight there instead.
 */
function scrollToUsdotForm(e: React.MouseEvent<HTMLAnchorElement>) {
  e.preventDefault();
  pushDataLayerEvent("cta_click", { location: "header" });
  const target = document.getElementById("file");
  if (!target) return;

  const offset = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
  const targetY = target.getBoundingClientRect().top + window.scrollY - offset;

  const onArrive = () => {
    const input = document.getElementById("usdot") as HTMLInputElement | null;
    const hint = document.getElementById("usdot-hint");
    input?.focus();
    if (hint) {
      window.clearTimeout(Number(hint.dataset.hideTimer));
      hint.style.opacity = "1";
      const timer = window.setTimeout(() => {
        hint.style.opacity = "0";
      }, HINT_VISIBLE_MS);
      hint.dataset.hideTimer = String(timer);
    }
  };

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo(0, targetY);
    onArrive();
    return;
  }

  const startY = window.scrollY;
  const distance = targetY - startY;
  const start = performance.now();

  function step(now: number) {
    const t = Math.min((now - start) / SCROLL_DURATION_MS, 1);
    const eased = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2; // ease-in-out quad
    window.scrollTo(0, startY + distance * eased);
    if (t < 1) requestAnimationFrame(step);
    else onArrive();
  }
  requestAnimationFrame(step);
}

/**
 * Single-purpose header for this Google Ads landing page, replacing the
 * site-wide <SiteHeader> (which self-suppresses on /lp/... routes, see
 * components/site-header.tsx). Two differences from the global header:
 *  1. Nav items are same-page anchors (#how-it-works etc.), never a route
 *     change, so nothing takes the visitor out of the page mid-consideration.
 *  2. The CTA is this page's own action ("File my BOC-3 now", scrolling to
 *     the hero's USDOT form) instead of the site-wide "Start your compliance
 *     setup" button. On desktop (this button is hidden below `sm`) that
 *     scroll is a deliberate eased animation, not an instant jump, and it
 *     ends by focusing the USDOT field and flashing a short-lived "enter it
 *     here" hint above it (see scrollToUsdotForm and #usdot-hint in page.tsx).
 *     The mobile drawer's copy of this CTA is a plain anchor jump for now.
 */
export function LandingHeader() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Lock body scroll while the mobile drawer is open (matches SiteHeader).
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

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

        {/* Desktop nav: on-page anchors only. */}
        <nav aria-label="On this page" className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => pushDataLayerEvent("nav_click", { label: item.label })}
              className="text-sm text-cloud/85 transition-colors hover:text-cloud outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cloud"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={site.telHref}
            onClick={() => pushDataLayerEvent("call_click", { location: "header" })}
            className="inline-flex items-center gap-1.5 rounded px-1 py-1 text-sm font-medium text-cloud/85 outline-none transition-colors hover:text-cloud focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cloud"
            aria-label={`Call Tech Rig at ${site.telephone}`}
          >
            <PhoneIcon size={16} aria-hidden="true" />
            <span className="hidden sm:inline">{site.telephone}</span>
          </a>
          <a
            href="#file"
            onClick={scrollToUsdotForm}
            className={`${buttonVariants({ variant: "primary", size: "sm" })} hidden sm:inline-flex`}
          >
            File my BOC-3 now
          </a>
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
        <div className="fixed inset-0 z-50 flex flex-col bg-ink lg:hidden">
          <Container className="flex h-14 items-center justify-between">
            <Logo className="w-[88px] text-cloud" />
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="inline-flex h-11 w-11 items-center justify-center rounded text-cloud outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cloud"
              aria-label="Close menu"
            >
              <CloseIcon />
            </button>
          </Container>

          <nav aria-label="On this page" className="flex-1 overflow-y-auto">
            <Container className="space-y-1">
              {NAV.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    pushDataLayerEvent("nav_click", { label: item.label, location: "mobile_drawer" });
                    setDrawerOpen(false);
                  }}
                  className="block border-b border-cloud/10 py-3 font-display text-base text-cloud outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cloud"
                >
                  {item.label}
                </a>
              ))}
            </Container>
          </nav>

          <Container className="flex items-center gap-3 border-t border-cloud/15 py-4">
            <a
              href="#file"
              onClick={() => {
                pushDataLayerEvent("cta_click", { location: "header_mobile" });
                setDrawerOpen(false);
              }}
              className={`${buttonVariants({ variant: "primary", size: "md" })} flex-1`}
            >
              File my BOC-3 now
            </a>
            <a
              href={site.telHref}
              onClick={() => pushDataLayerEvent("call_click", { location: "header_mobile" })}
              className={buttonVariants({ variant: "outlineOnInk", size: "md" })}
              aria-label={`Call Tech Rig at ${site.telephone}`}
            >
              <PhoneIcon size={18} />
            </a>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
