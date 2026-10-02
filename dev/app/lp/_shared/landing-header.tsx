"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { Container } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CloseIcon, MenuIcon, PhoneIcon } from "@/components/icons";
import { pushDataLayerEvent } from "@/lib/gtm";
import { site } from "@/lib/site";
import { scrollToUsdotForm } from "./scroll-to-form";

const NAV = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#reviews", label: "Reviews" },
  { href: "#faq", label: "FAQ" },
];

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
 *     here" hint above it (see scroll-to-form.ts and #usdot-hint in
 *     boc3-landing.tsx). Below `sm` the page's sticky bottom bar carries this
 *     CTA instead, so phones get one persistent "File" button, not two. The
 *     mobile drawer's copy of this CTA does the same scroll-and-focus.
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
            onClick={(e) => scrollToUsdotForm(e, "header")}
            // cn(), not string concatenation: buttonVariants carries
            // `inline-flex`, which otherwise beats `hidden` in the generated
            // CSS and shows this button on phones too.
            className={cn(buttonVariants({ variant: "primary", size: "sm" }), "hidden sm:inline-flex")}
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
              onClick={(e) => {
                setDrawerOpen(false);
                scrollToUsdotForm(e, "header_mobile");
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
