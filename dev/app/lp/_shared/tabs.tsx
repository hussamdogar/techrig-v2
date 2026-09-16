"use client";

import { useState } from "react";
import { pushDataLayerEvent } from "@/lib/gtm";

type Tab = { id: string; label: string; content: React.ReactNode };

/**
 * Lightweight tab control for the BOC-3 landing pages' "Know before you file"
 * section (dev/app/lp/_shared/boc3-landing.tsx). Scoped to this page template,
 * not components/ui: if a different landing page needs a tab control, give it
 * the system's focus-ring and motion conventions there rather than reusing
 * this one as-is.
 */
export function LandingTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0].id);
  const current = tabs.find((t) => t.id === active) ?? tabs[0];

  return (
    <div>
      <div role="tablist" className="flex flex-wrap gap-1 border-b border-slate/15">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={t.id === active}
            onClick={() => {
              pushDataLayerEvent("faq_tab_view", { tab: t.id });
              setActive(t.id);
            }}
            className={`-mb-px rounded-t-card border-b-2 px-4 py-2.5 text-sm font-semibold outline-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel ${
              t.id === active
                ? "border-steel text-ink"
                : "border-transparent text-slate hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="pt-6">{current.content}</div>
    </div>
  );
}
