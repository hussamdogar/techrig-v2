"use client";

import { useState } from "react";
import { ChevronDownIcon } from "@/components/icons";
import { pushDataLayerEvent } from "@/lib/gtm";

type Tab = { id: string; label: string; content: React.ReactNode };

/**
 * Lightweight tab control for the BOC-3 landing pages' "Know before you file"
 * section (dev/app/lp/_shared/boc3-landing.tsx). Scoped to this page template,
 * not components/ui: if a different landing page needs a tab control, give it
 * the system's focus-ring and motion conventions there rather than reusing
 * this one as-is.
 *
 * Below `sm` the three labels don't fit on one row (they wrapped to two), so
 * phones get the same content as a native <details> accordion instead, which
 * fires the same faq_tab_view event when a panel is opened. Both versions are
 * in the DOM; CSS shows exactly one per breakpoint.
 */
export function LandingTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0].id);
  const current = tabs.find((t) => t.id === active) ?? tabs[0];

  return (
    <>
      <div className="border-t border-cloud/15 sm:hidden">
        {tabs.map((t, i) => (
          <details
            key={t.id}
            open={i === 0}
            onToggle={(e) => {
              if (e.currentTarget.open) pushDataLayerEvent("faq_tab_view", { tab: t.id });
            }}
            className="group border-b border-cloud/15"
          >
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-3 font-semibold text-cloud marker:hidden outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cloud [&::-webkit-details-marker]:hidden">
              {t.label}
              <ChevronDownIcon
                size={20}
                className="shrink-0 text-signal transition-transform group-open:rotate-180"
              />
            </summary>
            <div className="pb-5">{t.content}</div>
          </details>
        ))}
      </div>

      <div className="hidden sm:block">
        <div role="tablist" className="flex flex-wrap gap-1 border-b border-cloud/15">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={t.id === active}
              onClick={() => {
                pushDataLayerEvent("faq_tab_view", { tab: t.id });
                setActive(t.id);
              }}
              className={`-mb-px rounded-t-card border-b-2 px-4 py-2.5 text-sm font-semibold outline-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cloud ${
                t.id === active
                  ? "border-signal text-cloud"
                  : "border-transparent text-cloud/50 hover:text-cloud"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="pt-6">{current.content}</div>
      </div>
    </>
  );
}
