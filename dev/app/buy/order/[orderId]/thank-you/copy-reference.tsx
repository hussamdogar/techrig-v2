"use client";

import { useState } from "react";
import { CHECKOUT_FOCUS } from "@/components/checkout-ui";
import { cn } from "@/lib/utils";

/** The order number in a chip with a Copy button, so it can be read out or
 *  pasted when the customer calls. */
export function CopyReference({ reference }: { reference: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <span className="inline-flex min-h-11 items-center gap-2 rounded-[10px] border border-line bg-cloud py-1 pl-3 pr-1.5">
      <span className="text-[13px] text-slate">Order</span>
      <span className="font-mono text-[15px] font-semibold tracking-[0.01em] text-ink">{reference}</span>
      <button
        type="button"
        aria-label="Copy order number"
        onClick={() => {
          navigator.clipboard
            ?.writeText(reference)
            .then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            })
            .catch(() => {});
        }}
        className={cn("min-h-9 rounded-lg bg-steel-50 px-2.5 text-[13px] font-semibold text-steel", CHECKOUT_FOCUS)}
      >
        {copied ? "Copied" : "Copy"}
      </button>
      <span role="status" className="sr-only">
        {copied ? "Order number copied" : ""}
      </span>
    </span>
  );
}
