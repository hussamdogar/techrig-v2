"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";

const DISMISSED_KEY = "cookie-notice-dismissed";

/**
 * Lightweight, informational cookie notice (pre-launch audit, 2026-09). This
 * site is US-only and, per the Privacy Policy §"Your California Privacy
 * Rights", does not sell or share personal information with third parties —
 * so CCPA's "Do Not Sell/Share" opt-out mechanism doesn't apply here, and a
 * full consent-management platform with granular category toggles would be
 * over-building for what's actually required. This is just honest disclosure
 * that the site sets cookies (session/lead-token cookies during checkout,
 * primarily) with a link to the real Privacy Policy, dismissed once and
 * remembered per browser — no consent gate blocks anything, since nothing
 * here depends on affirmative consent to function.
 *
 * On Google Ads landing pages (/lp/...) the full-width bottom notice sat
 * directly on top of the hero's USDOT form for nearly every ad visitor (each
 * click is usually a first visit). There it renders as a one-line bar pinned
 * under the page header instead, clear of the form and of the page's sticky
 * bottom CTA, and only once the visitor has scrolled past the first screen.
 * Same disclosure, same link, same dismissal key.
 */
export function CookieNotice() {
  const [visible, setVisible] = useState(false);
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const isLanding = usePathname()?.startsWith("/lp/") ?? false;

  useEffect(() => {
    if (!isLanding) return;
    const onScroll = () => {
      if (window.scrollY > window.innerHeight) {
        setScrolledPastHero(true);
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isLanding]);

  useEffect(() => {
    // Deliberate exception: localStorage doesn't exist during SSR, so the
    // server (and the client's first render, to match it and avoid a
    // hydration mismatch) always renders "hidden". This effect runs once
    // after mount purely to reveal the notice client-side if it hasn't been
    // dismissed before — there's no external-system subscription to model
    // this as instead, just a one-time client-only read.
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (!window.localStorage.getItem(DISMISSED_KEY)) setVisible(true);
    } catch {
      // Private browsing / storage blocked: default to not showing rather
      // than risk showing it on every single page load.
    }
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      window.localStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // Storage blocked: the notice will just reappear next visit, not fatal.
    }
  }

  if (!visible) return null;

  if (isLanding) {
    if (!scrolledPastHero) return null;
    // top-14 / md:top-16 = the landing header's height (landing-header.tsx).
    return (
      <div
        role="region"
        aria-label="Cookie notice"
        className="fixed inset-x-0 top-14 z-30 border-b border-slate/15 bg-cloud shadow-card md:top-16"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-1 md:px-6">
          <p className="text-xs text-slate">
            We use cookies.{" "}
            <Link
              href="/privacy-policy/"
              className="font-medium text-steel underline underline-offset-2 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
            >
              Privacy Policy
            </Link>
          </p>
          <button
            type="button"
            onClick={dismiss}
            className={`${buttonVariants({ variant: "ghost", size: "sm" })} shrink-0`}
          >
            OK
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-slate/15 bg-cloud px-4 py-4 shadow-card md:px-6"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate">
          We use cookies to run this site, including to keep your session working while you complete an order. See
          our{" "}
          <Link
            href="/privacy-policy/"
            className="font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
          >
            Privacy Policy
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={dismiss}
          className={`${buttonVariants({ variant: "solidInk", size: "sm" })} shrink-0`}
        >
          Got it
        </button>
      </div>
    </div>
  );
}
