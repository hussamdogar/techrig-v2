"use client";

import { useEffect } from "react";
import { site } from "@/lib/site";

const BASE_DIGITS = site.telHref.replace(/\D/g, ""); // "19179092257"

/** A US/Canada number in `text`, as 11 digits with the leading 1, or null. */
function usDigits(text: string | null): string | null {
  const digits = (text ?? "").replace(/\D/g, "");
  if (digits.length === 10) return `1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return digits;
  return null;
}

/**
 * Keeps every Call link dialing the number the visitor actually sees.
 *
 * For visitors who arrive from a Google ad, Google Ads' "calls from website"
 * tag (GTM) replaces the DISPLAYED phone number text with a Google forwarding
 * number, which is how it attributes the call to the ad. Google documents the
 * text swap, not rewriting tel: links, so a Call button would otherwise still
 * dial our real number and the call would go untracked. This:
 *  1. points any tel: link that shows a number at the number it shows, and
 *  2. points tel: links that show no number (icon-only and "Call" buttons) at
 *     the forwarding number, once one is on the page.
 * For everyone else nothing differs from our own number, so nothing changes.
 */
export function PhoneLinkSync() {
  useEffect(() => {
    let scheduled = false;
    const sync = () => {
      scheduled = false;
      const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href^="tel:"]'));
      let swapped: string | null = null;
      for (const a of links) {
        const shown = usDigits(a.textContent);
        if (shown && shown !== BASE_DIGITS) swapped = shown;
        if (shown) {
          const href = `tel:+${shown}`;
          if (a.getAttribute("href") !== href) a.setAttribute("href", href);
        }
      }
      if (!swapped) return;
      for (const a of links) {
        if (!usDigits(a.textContent) && a.getAttribute("href") !== `tel:+${swapped}`) {
          a.setAttribute("href", `tel:+${swapped}`);
        }
      }
    };
    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(sync);
    };
    schedule();
    // Google's tag swaps the number asynchronously, and the site changes pages
    // without full reloads, so re-check whenever the page content changes.
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, []);
  return null;
}
