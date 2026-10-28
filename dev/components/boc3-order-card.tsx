import { buttonVariants } from "@/components/ui/button";
import { ArrowRightIcon, CheckSealIcon, StarIcon } from "@/components/icons";
import { TrackedForm } from "@/components/tracked-form";
import { startQuickBuyLookup } from "@/app/buy/[service]/actions";

/**
 * The BOC-3 order card: price in the title, the real USDOT quick-buy form,
 * the one-time-fee line and the Google rating. Shared by the Google Ads
 * landing pages (/lp/..., app/lp/_shared/boc3-landing.tsx) and the SEO page
 * /boc-3-filing/ (owner, 2026-10-27), so both sell the same way. A
 * submission goes into the real lookup-and-pay flow at /buy/<serviceKey>/.
 *
 * id="file" is the scroll target of the landing pages' header and sticky-bar
 * CTAs; scroll-mt-32 clears the header plus the landing cookie bar. A second
 * card on the same page passes `idSuffix` (e.g. "-closing") so its ids stay
 * unique; the first card keeps the plain ids those CTAs look for.
 */

// The "Tech Rig" Google Business Profile listing (5.0 aggregate). Every
// review card and the aggregate line link back here so a visitor can verify
// them in place rather than take the page's word for it.
export const GOOGLE_REVIEWS_URL = "https://maps.app.goo.gl/QJTUHyD5LkdomX1r6";

export function Boc3OrderCard({
  serviceKey,
  amount,
  location,
  idSuffix = "",
}: {
  /** Quick-buy lane: "boc-3" on the SEO page, "boc-3-b" on the landing pages. */
  serviceKey: string;
  amount: number;
  /** GTM `location` for the lookup submit, e.g. "lp_hero" or "boc3_page_hero". */
  location: string;
  idSuffix?: string;
}) {
  return (
    <div>
      <div id={`file${idSuffix}`} className="scroll-mt-32 rounded-card border border-slate/15 bg-cloud p-4 shadow-card sm:p-6">
        {/* Price in the card title for ad-to-page message match: the Google
            Ads headlines lead with the price, so it is the first thing
            confirmed here, not only on the button. */}
        <p className="font-display text-lg font-bold text-ink">File your BOC-3 today for ${amount}</p>
        <p className="mt-0.5 text-sm text-slate">Takes about 2 minutes. No forms to fill out.</p>
        <div className="mt-3 sm:mt-5">
          <UsdotForm serviceKey={serviceKey} location={location} idSuffix={idSuffix} />
        </div>
        {/* The two reassurances that matter at the moment of clicking. First
            and strongest: the price is a one-time fee with no annual renewal
            (most process agents bill yearly), so it is ink-colored and bold,
            not small grey print. Then the 5.0 rating, kept next to the button
            it reassures. */}
        <p className="mt-3 flex items-center justify-center gap-1.5 text-sm text-ink">
          <CheckSealIcon size={16} className="shrink-0 text-status-active" aria-hidden="true" />
          <span>
            ${amount} one-time fee. <strong className="font-semibold">No annual renewals.</strong>
          </span>
        </p>
        <a
          href={GOOGLE_REVIEWS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1.5 flex items-center justify-center gap-1.5 text-xs text-slate hover:text-ink"
        >
          <StarRating size={12} label="5.0 out of 5 stars" />
          5.0 on Google
        </a>
      </div>
      {/* Google Ads' government documents policy asks non-government
          providers to "clearly disclose that you are a private entity and not
          affiliated with any government" (support.google.com/adspolicy/
          answer/6368711). These pages say "Officially listed by FMCSA", so it
          is stated right under the form. Sits on a dark (Ink) hero. */}
      <p className="mt-3 text-xs text-cloud/60">
        We&apos;re a private BOC-3 process agent company listed with FMCSA, not part of FMCSA or any government agency.
      </p>
    </div>
  );
}

// A row of filled stars via the icon system (never typed star characters in a
// text node, per standards.md). `label` supplies the one accessible name for
// the whole row; the individual icons stay aria-hidden.
export function StarRating({ count = 5, size = 14, label }: { count?: number; size?: number; label: string }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-signal" role="img" aria-label={label}>
      {Array.from({ length: count }).map((_, i) => (
        <StarIcon key={i} size={size} aria-hidden="true" />
      ))}
    </span>
  );
}

// The real USDOT entry form: the same server action `/buy/<serviceKey>/` uses.
function UsdotForm({ serviceKey, location, idSuffix }: { serviceKey: string; location: string; idSuffix: string }) {
  const startLookup = startQuickBuyLookup.bind(null, serviceKey);
  return (
    <TrackedForm
      action={startLookup}
      event="quick_buy_lookup_submit"
      data={{ service: serviceKey, location }}
      className="space-y-2.5"
    >
      <div>
        <div className="flex items-baseline justify-between gap-3">
          <label htmlFor={`usdot${idSuffix}`} className="text-sm font-medium text-ink">
            USDOT number
          </label>
          {/* Hidden by default (opacity, not display, so no layout shift when
              it appears), and sharing the label's row so it reserves no extra
              height in the card. The landing pages' header and sticky-bar
              CTAs reveal it by id after scrolling here, then hide it again
              after a few seconds (app/lp/_shared/scroll-to-form.ts). */}
          <p
            id={`usdot-hint${idSuffix}`}
            aria-live="polite"
            className="flex items-center gap-1 text-xs font-medium text-steel opacity-0 transition-opacity duration-300"
          >
            <ArrowRightIcon size={12} className="rotate-90" aria-hidden="true" />
            Start here
          </p>
        </div>
        <input
          id={`usdot${idSuffix}`}
          name="usdot"
          inputMode="numeric"
          autoComplete="off"
          enterKeyHint="go"
          pattern="\d{1,12}"
          required
          placeholder="e.g. 1234567"
          className="mt-1 w-full rounded-card border border-slate/25 bg-paper px-4 py-2.5 text-lg text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
        />
      </div>
      <button type="submit" className={`${buttonVariants({ variant: "primary", size: "md" })} w-full`}>
        Start my BOC-3 filing
      </button>
    </TrackedForm>
  );
}
