"use client";

import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { PhoneIcon } from "@/components/icons";
import { TrackedAnchor } from "@/components/tracked-anchor";
import { site } from "@/lib/site";
import { scrollToUsdotForm } from "./scroll-to-form";

/**
 * Mobile-only sticky Call / File bar for the BOC-3 landing pages.
 *
 * Hidden while the hero's USDOT form (#file) is on screen: on a phone the bar
 * otherwise sits directly on top of the form's own submit button on first
 * load, and a second "File" button next to the real one only competes with
 * it. It slides in once the form scrolls out of view, and its File button
 * scrolls back to that same form (focusing the field) rather than opening
 * /buy/, so every mobile path ends in one form with no extra page load.
 *
 * Starts hidden (server render and first paint) so it can never flash over
 * the form before the observer reports in.
 */
export function StickyCta() {
  const [formVisible, setFormVisible] = useState(true);

  useEffect(() => {
    const form = document.getElementById("file");
    if (!form) return;
    const observer = new IntersectionObserver(([entry]) => setFormVisible(entry.isIntersecting));
    observer.observe(form);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      inert={formVisible}
      aria-hidden={formVisible}
      className={`fixed inset-x-0 bottom-0 z-30 flex items-center gap-2 border-t border-slate/15 bg-cloud px-4 py-3 shadow-card transition-transform duration-300 md:hidden ${
        formVisible ? "translate-y-full" : "translate-y-0"
      }`}
    >
      <TrackedAnchor
        href={site.telHref}
        event="call_click"
        data={{ location: "sticky_mobile" }}
        className={`${buttonVariants({ variant: "secondary", size: "sm" })} flex-1`}
      >
        <PhoneIcon size={16} aria-hidden="true" />
        Call
      </TrackedAnchor>
      <a
        href="#file"
        onClick={(e) => scrollToUsdotForm(e, "sticky_mobile")}
        className={`${buttonVariants({ variant: "primary", size: "sm" })} flex-[2]`}
      >
        File my BOC-3
      </a>
    </div>
  );
}
