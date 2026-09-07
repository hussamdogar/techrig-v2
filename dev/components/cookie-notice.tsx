"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
 */
export function CookieNotice() {
  const [visible, setVisible] = useState(false);

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
