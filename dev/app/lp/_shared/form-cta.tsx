"use client";

import { scrollToUsdotForm } from "./scroll-to-form";

/**
 * A "File my BOC-3" button for the landing page body (pricing card, final
 * CTA): takes the visitor to the hero's USDOT form on this page and opens the
 * keypad (see scroll-to-form.ts), rather than linking off to /buy/. A real
 * <a href="#file"> underneath, so it still works as a plain jump to the form
 * before JavaScript loads.
 */
export function FormCta({
  location,
  className,
  children,
}: {
  location: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a href="#file" onClick={(e) => scrollToUsdotForm(e, location)} className={className}>
      {children}
    </a>
  );
}
