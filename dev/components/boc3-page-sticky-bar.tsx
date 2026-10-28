"use client";

import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { scrollToUsdotForm } from "@/app/lp/_shared/scroll-to-form";
import { cn } from "@/lib/utils";

/**
 * Phone-only sticky bar for /boc-3-filing/ (owner, 2026-10-27;
 * shared/design/boc-3-filing-v2.md §4.7). Shows only between the hero order
 * card (#file) and the closing one (#file-closing): never over either card,
 * so it never competes with a real form. "Start" goes back to the hero's
 * USDOT field and opens the keypad, the same helper the /lp/ pages use.
 */
export function Boc3PageStickyBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Two getBoundingClientRect reads per scroll event: cheap enough to run
    // directly, with no animation-frame dependency.
    const check = () => {
      const hero = document.getElementById("file");
      const closing = document.getElementById("file-closing");
      if (!hero) return;
      const heroGone = hero.getBoundingClientRect().bottom < 0;
      const closingReached = closing ? closing.getBoundingClientRect().top < window.innerHeight : false;
      setShow(heroGone && !closingReached);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  return (
    <div
      inert={!show}
      aria-hidden={!show}
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-slate/15 bg-cloud px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-2.5 shadow-[0_-8px_24px_rgba(14,34,51,.10)] motion-safe:transition-transform motion-safe:duration-200 lg:hidden",
        show ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="font-display font-bold leading-5 text-ink">File your BOC-3</p>
        <p className="text-[13px] leading-[18px] text-slate">$50 one time, all 50 states</p>
      </div>
      <a
        href="#file"
        onClick={(e) => scrollToUsdotForm(e, "boc3_page_sticky")}
        className={cn(buttonVariants({ variant: "primary", size: "md" }), "shrink-0")}
      >
        Start
      </a>
    </div>
  );
}
