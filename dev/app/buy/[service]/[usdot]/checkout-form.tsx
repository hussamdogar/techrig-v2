"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CHECKOUT_FOCUS as FOCUS, CheckoutSpinner, CheckoutSteps } from "@/components/checkout-ui";
import { pushDataLayerEvent } from "@/lib/gtm";
import {
  AlertIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  BuildingIcon,
  CardIcon,
  ChevronDownIcon,
  InfoIcon,
  ShieldIcon,
} from "@/components/icons";
import { SERVICES, computeQuickBuyPricing, type QuickBuyServiceKey } from "@/lib/services-registry";
import {
  ADD_ON_SHORT_NAME,
  CHECKOUT_FIELDS,
  addOnDescription,
  checkField,
  checkoutAddOns,
  featuredAddOn,
  formatUsPhone,
  suggestEmail,
  validateCheckout,
  type CheckoutErrors,
  type CheckoutField,
  type CheckoutValues,
} from "@/lib/quick-buy-checkout";
import { preselectQuery } from "@/lib/quick-buy-preselect";
import type { PlaceOrderState } from "./actions";

/**
 * The one-screen quick-buy checkout (owner, 2026-10-13: confirm + review
 * merged), built to shared/design/quick-buy-checkout-v2.md. One DOM, two
 * layouts: one column on phones with a sticky total bar, two columns from
 * `lg` with the order summary, signature and button in a right column that
 * stays in view while it fits.
 *
 * Prices come from computeQuickBuyPricing, the same function payment charges
 * with; the server action recomputes everything and never trusts this total.
 * Validation and add-on rules live in lib/quick-buy-checkout.ts, shared with
 * the server action, so a field the form accepts the server accepts too.
 */

type Contact = { first: string; last: string; email: string; phone: string };

export type CheckoutFormProps = {
  action: (state: PlaceOrderState, formData: FormData) => Promise<PlaceOrderState>;
  primary: QuickBuyServiceKey;
  usdot: string;
  token: string;
  carrier: { legalName: string | null; powerUnits: number | null; address: string | null };
  /** Pre-filled from the FMCSA record. */
  contact: Contact;
  /** Qualifying CMVs (truck tractors + straight trucks): sets the UCR bracket. */
  qualifyingPowerUnits: number;
  truckTractors: number;
  boc3OnFile: boolean;
  /** Add-ons pre-ticked by the compliance check (?add=). */
  preselected: QuickBuyServiceKey[];
  /** Filings already bought in the paid order this checkout was opened from
   *  (?from=, the thank-you page's Order buttons): never offered again. */
  alreadyOrdered?: QuickBuyServiceKey[];
  /** Carried through to the order unchanged (structured address for Stripe). */
  hiddenFields: Record<string, string>;
};

const money = (n: number) => `$${n.toLocaleString("en-US")}`;
const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const INPUT =
  "mt-1.5 block h-[52px] w-full rounded-[10px] border bg-cloud px-3.5 text-base text-ink outline-none transition-[border-color,box-shadow] scroll-mt-28 placeholder:text-slate/70 focus:border-steel focus:ring-3 focus:ring-steel/30";

export function CheckoutForm({
  action,
  primary,
  usdot,
  token,
  carrier,
  contact,
  qualifyingPowerUnits,
  truckTractors,
  boc3OnFile,
  preselected,
  alreadyOrdered = [],
  hiddenFields,
}: CheckoutFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);

  // ---- add-ons ----
  const alreadyKey = alreadyOrdered.join(",");
  const addOns = useMemo(
    () => checkoutAddOns(primary, truckTractors, alreadyKey ? alreadyKey.split(",") : []),
    [primary, truckTractors, alreadyKey],
  );
  const featured = featuredAddOn(primary, addOns, { boc3OnFile, cdl: truckTractors > 0 });
  const initialPicked = preselected.filter((k) => addOns.includes(k));
  const [selected, setSelected] = useState<Set<QuickBuyServiceKey>>(() => new Set(initialPicked));
  // Add-ons shown outside "More services": pre-ticked ones on arrival, and
  // anything ticked inside the list once it is closed.
  const [promoted, setPromoted] = useState<Set<QuickBuyServiceKey>>(() => new Set(initialPicked));
  const [moreOpen, setMoreOpen] = useState(false);
  const visible = addOns.filter((k) => k === featured || promoted.has(k));
  const inMore = addOns.filter((k) => !visible.includes(k));

  // ---- contact + signature ----
  const contactComplete = !!(contact.first && contact.last && !checkField("email", { ...EMPTY, email: contact.email }));
  const contactMissing = !contact.first && !contact.email;
  const [values, setValues] = useState<CheckoutValues>({ ...contact, phone: formatUsPhone(contact.phone), sign: "", agree: false });
  const [editing, setEditing] = useState(!contactComplete);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [attempted, setAttempted] = useState(false);
  const [emailSuggestion, setEmailSuggestion] = useState<string | null>(null);
  const [focusRequest, setFocusRequest] = useState<{ field: CheckoutField; n: number } | null>(null);
  const fieldRefs = useRef<Partial<Record<CheckoutField, HTMLInputElement | null>>>({});
  // A new request object each time, so asking for the same field twice still
  // re-runs the focus effect.
  const requestFocus = (field: CheckoutField) => setFocusRequest((r) => ({ field, n: (r?.n ?? 0) + 1 }));

  // ---- pricing ----
  const keys = [primary, ...addOns.filter((k) => selected.has(k))];
  const ctx = { powerUnits: qualifyingPowerUnits, driverCount: selected.has("dq-files") || primary === "dq-files" ? 1 : null };
  const pricing = computeQuickBuyPricing(keys, ctx);
  const ucrTier = computeQuickBuyPricing(["ucr"], { powerUnits: qualifyingPowerUnits, driverCount: null }).lines[0]?.ucrTier;
  const priceOf = (k: QuickBuyServiceKey) => computeQuickBuyPricing([k], { powerUnits: qualifyingPowerUnits, driverCount: 1 }).total;
  const priceNote = (k: QuickBuyServiceKey) => (k === "ucr" ? `${ucrTier ?? "0-2"} trucks` : k === "dq-files" ? "1 driver" : null);

  // Server-side rejections land on the same fields as client ones. Adjusted
  // during render when a new result arrives (React's "storing information
  // from previous renders" pattern), not in an effect.
  const [seenState, setSeenState] = useState(state);
  if (state !== seenState) {
    setSeenState(state);
    if (state?.errors) {
      setErrors(state.errors);
      setAttempted(true);
      if (["first", "last", "email", "phone"].some((f) => state.errors?.[f as CheckoutField])) setEditing(true);
      const first = CHECKOUT_FIELDS.find((f) => state.errors?.[f]);
      if (first) requestFocus(first);
    }
  }

  // Scroll to and focus the top-most invalid field, after it has rendered.
  useEffect(() => {
    if (!focusRequest) return;
    const el = fieldRefs.current[focusRequest.field];
    if (!el) return;
    el.focus({ preventScroll: true });
    el.scrollIntoView({ block: "start", behavior: reducedMotion() ? "auto" : "smooth" });
  }, [focusRequest]);

  function update<K extends keyof CheckoutValues>(field: K, value: CheckoutValues[K]) {
    const next = { ...values, [field]: value };
    setValues(next);
    // A field that has shown an error re-checks on every change, so the
    // message clears the moment it's fixed.
    if (errors[field as CheckoutField]) {
      setErrors((e) => ({ ...e, [field]: checkField(field as CheckoutField, next) ?? undefined }));
    }
  }

  // Before the first submit, only format errors, and only on leaving a field
  // that has something in it.
  function onBlur(field: CheckoutField) {
    if (field === "email") setEmailSuggestion(suggestEmail(values.email));
    if (!attempted && !(field === "email" || field === "phone")) return;
    if (!attempted && !values[field]) return;
    setErrors((e) => ({ ...e, [field]: checkField(field, values) ?? undefined }));
  }

  function toggle(k: QuickBuyServiceKey) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  }

  function toggleMore() {
    // Closing the list moves anything ticked inside it into view, so nothing
    // being charged is ever hidden. Rows never move while the list is open.
    if (moreOpen) setPromoted((p) => new Set([...p, ...inMore.filter((k) => selected.has(k))]));
    setMoreOpen(!moreOpen);
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (isPending) {
      e.preventDefault();
      return;
    }
    const found = validateCheckout(values);
    const first = CHECKOUT_FIELDS.find((f) => found[f]);
    if (first) {
      e.preventDefault();
      setAttempted(true);
      setErrors(found);
      if (!editing && ["first", "last", "email", "phone"].some((f) => found[f as CheckoutField])) setEditing(true);
      requestFocus(first);
      return;
    }
    pushDataLayerEvent("quick_buy_review_submit", {
      primaryKey: primary,
      additionalServices: [...selected],
      orderValue: pricing.total,
    });
  }

  // ---- phone sticky bar: hidden while typing and while the in-page button shows ----
  const ctaRef = useRef<HTMLButtonElement>(null);
  const [ctaInView, setCtaInView] = useState(false);
  const [typing, setTyping] = useState(false);
  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setCtaInView(entry.intersectionRatio >= 0.5), {
      threshold: [0, 0.5, 1],
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // ---- laptop: the right column stays in view only while it fits ----
  const asideRef = useRef<HTMLDivElement>(null);
  const [asideFits, setAsideFits] = useState(true);
  useEffect(() => {
    const el = asideRef.current;
    if (!el) return;
    const check = () => setAsideFits(el.offsetHeight <= window.innerHeight - 112);
    const ro = new ResizeObserver(check);
    ro.observe(el);
    window.addEventListener("resize", check);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", check);
    };
  }, []);

  // Screen readers hear the new total once changes settle.
  const [liveTotal, setLiveTotal] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setLiveTotal(`Total due now ${money(pricing.total)}`), 500);
    return () => clearTimeout(t);
  }, [pricing.total]);

  const summaryHeadingRef = useRef<HTMLHeadingElement>(null);
  const addOnHeadingRef = useRef<HTMLHeadingElement>(null);
  const serviceName = SERVICES[primary].name;
  const fieldError = (f: CheckoutField) => errors[f];
  const describedBy = (f: CheckoutField, hint?: string) =>
    [hint, fieldError(f) ? `${f}-error` : null].filter(Boolean).join(" ") || undefined;

  return (
    <form
      action={formAction}
      onSubmit={onSubmit}
      noValidate
      onFocusCapture={(e) => setTyping(e.target instanceof HTMLInputElement && e.target.type !== "checkbox")}
      onBlurCapture={() => setTyping(false)}
      className="mx-auto max-w-[1120px] px-4 pb-6 pt-4 lg:grid lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start lg:gap-12 lg:px-10 lg:pb-16 lg:pt-9"
    >
      <input type="hidden" name="token" value={token} />
      {Object.entries(hiddenFields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      {[...selected].map((k) => (
        <input key={k} type="hidden" name="service" value={k} />
      ))}

      <div>
        <CheckoutSteps current="Review" />

        <h1 className="sr-only">
          {serviceName} for USDOT {usdot}
        </h1>

        {/* A. The carrier record, read-only. */}
        <section aria-label="Your carrier record" className="mt-4 rounded-[14px] border border-line bg-cloud p-4 shadow-[0_1px_2px_rgba(14,34,51,.05)] lg:p-6">
          <p className="font-display text-lg font-bold leading-6 text-ink">{carrier.legalName ?? "Carrier on file"}</p>
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5 lg:grid-cols-[1fr_1fr_2fr]">
            <div>
              <dt className="text-[13px] text-slate">USDOT number</dt>
              <dd className="font-mono font-medium">{usdot}</dd>
            </div>
            <div>
              <dt className="text-[13px] text-slate">Power units</dt>
              <dd className="font-medium">{carrier.powerUnits ?? <span className="text-slate">Not listed</span>}</dd>
            </div>
            <div className="col-span-2 lg:col-span-1">
              <dt className="text-[13px] text-slate">Physical address</dt>
              <dd className="font-medium">{carrier.address ?? <span className="text-slate">Not listed</span>}</dd>
            </div>
          </dl>
          <div className="mt-2 border-t border-line pt-1">
            <Link
              href={`/buy/${primary}/${preselectQuery([...selected])}`}
              className={cn("inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-steel underline underline-offset-[3px]", FOCUS)}
            >
              <ArrowLeftIcon size={16} />
              Not you? Use a different USDOT
            </Link>
          </div>
        </section>

        {/* B. Contact details: a confirmed summary when FMCSA had them. */}
        <section aria-labelledby="h-contact" className="mt-7 lg:mt-8">
          <h2 id="h-contact" className="font-display text-[19px] font-bold leading-6 text-ink">
            Contact details
          </h2>
          {contactMissing ? (
            <p className="mt-1 text-sm text-slate">
              FMCSA does not list contact details for this USDOT. Add where we should send your receipt and filing
              updates.
            </p>
          ) : null}

          {editing ? (
            <div className="mt-3 grid gap-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="First name" id="first" error={fieldError("first")}>
                  <input
                    ref={(el) => {
                      fieldRefs.current.first = el;
                    }}
                    id="first"
                    name="first_name"
                    type="text"
                    autoComplete="given-name"
                    autoCapitalize="words"
                    enterKeyHint="next"
                    aria-required="true"
                    aria-invalid={!!fieldError("first")}
                    aria-describedby={describedBy("first")}
                    value={values.first}
                    onChange={(e) => update("first", e.target.value)}
                    onBlur={() => onBlur("first")}
                    className={cn(INPUT, fieldError("first") ? "border-2 border-error" : "border-field")}
                  />
                </Field>
                <Field label="Last name" id="last" error={fieldError("last")}>
                  <input
                    ref={(el) => {
                      fieldRefs.current.last = el;
                    }}
                    id="last"
                    name="last_name"
                    type="text"
                    autoComplete="family-name"
                    autoCapitalize="words"
                    enterKeyHint="next"
                    aria-required="true"
                    aria-invalid={!!fieldError("last")}
                    aria-describedby={describedBy("last")}
                    value={values.last}
                    onChange={(e) => update("last", e.target.value)}
                    onBlur={() => onBlur("last")}
                    className={cn(INPUT, fieldError("last") ? "border-2 border-error" : "border-field")}
                  />
                </Field>
              </div>
              <div className="grid gap-4 lg:grid-cols-2 lg:gap-3">
                <Field label="Email" id="email" error={fieldError("email")} hint={{ id: "email-hint", text: "Your receipt goes here." }}>
                  <input
                    ref={(el) => {
                      fieldRefs.current.email = el;
                    }}
                    id="email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    autoCapitalize="off"
                    spellCheck={false}
                    aria-required="true"
                    aria-invalid={!!fieldError("email")}
                    aria-describedby={describedBy("email", "email-hint")}
                    value={values.email}
                    onChange={(e) => {
                      update("email", e.target.value);
                      setEmailSuggestion(null);
                    }}
                    onBlur={() => onBlur("email")}
                    className={cn(INPUT, fieldError("email") ? "border-2 border-error" : "border-field")}
                  />
                  {emailSuggestion ? (
                    <p className="mt-1.5 text-sm text-ink">
                      Did you mean{" "}
                      <button
                        type="button"
                        onClick={() => {
                          update("email", emailSuggestion);
                          setEmailSuggestion(null);
                          fieldRefs.current.email?.focus();
                        }}
                        className={cn("font-semibold text-steel underline underline-offset-2", FOCUS)}
                      >
                        {emailSuggestion}
                      </button>
                      ?
                    </p>
                  ) : null}
                </Field>
                <Field
                  label="Phone"
                  optional
                  id="phone"
                  error={fieldError("phone")}
                  hint={{ id: "phone-hint", text: "Only used if we need you to confirm a filing detail." }}
                >
                  <input
                    ref={(el) => {
                      fieldRefs.current.phone = el;
                    }}
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel-national"
                    placeholder="(555) 555-0123"
                    aria-invalid={!!fieldError("phone")}
                    aria-describedby={describedBy("phone", "phone-hint")}
                    value={values.phone}
                    onChange={(e) => update("phone", formatUsPhone(e.target.value))}
                    onBlur={() => onBlur("phone")}
                    className={cn(INPUT, fieldError("phone") ? "border-2 border-error" : "border-field")}
                  />
                </Field>
              </div>
            </div>
          ) : (
            <div className="mt-3 flex items-start justify-between gap-4 rounded-[14px] border border-line bg-cloud p-4 shadow-[0_1px_2px_rgba(14,34,51,.05)] lg:p-5">
              {/* Summary view still submits the values. */}
              <input type="hidden" name="first_name" value={values.first} />
              <input type="hidden" name="last_name" value={values.last} />
              <input type="hidden" name="email" value={values.email} />
              <input type="hidden" name="phone" value={values.phone} />
              <div className="min-w-0">
                <p className="font-semibold text-ink">
                  {values.first} {values.last}
                </p>
                <p className="break-words text-ink">{values.email}</p>
                <p className="text-sm text-slate">{values.phone || "No phone added"}</p>
              </div>
              <button
                type="button"
                aria-label="Edit contact details"
                onClick={() => {
                  setEditing(true);
                  requestFocus("first");
                }}
                className={cn("inline-flex min-h-11 min-w-16 shrink-0 items-center justify-center rounded-[10px] border border-line px-3 font-semibold text-steel hover:border-steel", FOCUS)}
              >
                Edit
              </button>
            </div>
          )}
        </section>

        {/* C. Add-ons: one shown, the rest one tap away. */}
        {addOns.length ? (
          <section aria-labelledby="h-addons" className="mt-7 lg:mt-8">
            <h2 id="h-addons" ref={addOnHeadingRef} tabIndex={-1} className="font-display text-[19px] font-bold leading-6 text-ink outline-none">
              Missing any of these?
            </h2>
            {/* Billing disclosure (Google Ads pricing policy): must stay visible. */}
            <p className="mt-1.5 flex items-start gap-2 text-sm font-medium text-ink">
              <InfoIcon size={16} className="mt-0.5 shrink-0 text-steel" />
              Carriers get fined for gaps at inspections. One-time fees, no auto-renewals.
            </p>

            <div className="mt-3 grid gap-2.5">
              {visible.map((k) => (
                <AddOnCard
                  key={k}
                  k={k}
                  on={selected.has(k)}
                  fromCheck={initialPicked.includes(k)}
                  description={addOnDescription(k, { boc3OnFile })}
                  price={money(priceOf(k))}
                  note={priceNote(k)}
                  onToggle={() => toggle(k)}
                />
              ))}
            </div>

            {inMore.length ? (
              <>
                <button
                  type="button"
                  aria-expanded={moreOpen}
                  aria-controls="more-services"
                  onClick={toggleMore}
                  className={cn(
                    "mt-2.5 flex min-h-15 w-full items-center justify-between gap-3 rounded-[14px] border border-dashed border-field px-4 py-3 text-left hover:border-steel",
                    FOCUS,
                  )}
                >
                  <span>
                    <span className="block font-semibold text-ink">
                      {moreOpen ? "Hide more services" : `More services (${inMore.length})`}
                    </span>
                    {moreOpen ? null : (
                      <span className="block text-[13px] text-slate">{inMore.map((k) => ADD_ON_SHORT_NAME[k]).join(", ")}</span>
                    )}
                  </span>
                  <ChevronDownIcon size={20} className={cn("shrink-0 text-steel motion-safe:transition-transform", moreOpen && "rotate-180")} />
                </button>
                <div id="more-services" hidden={!moreOpen} className="grid gap-2.5">
                  {inMore.map((k) => (
                    <AddOnCard
                      key={k}
                      k={k}
                      on={selected.has(k)}
                      fromCheck={false}
                      description={addOnDescription(k, { boc3OnFile })}
                      price={money(priceOf(k))}
                      note={priceNote(k)}
                      onToggle={() => toggle(k)}
                    />
                  ))}
                </div>
              </>
            ) : null}
          </section>
        ) : null}
      </div>

      {/* Right column on laptop: what they pay, then what they sign. */}
      <div ref={asideRef} className={cn("mt-7 grid gap-4 lg:mt-0", asideFits && "lg:sticky lg:top-24")}>
        {/* D. Order summary */}
        <section aria-labelledby="h-summary" className="rounded-[14px] border border-line bg-cloud p-4 shadow-[0_1px_2px_rgba(14,34,51,.05)] lg:p-6">
          <h2 id="h-summary" ref={summaryHeadingRef} tabIndex={-1} className="scroll-mt-28 font-display text-[19px] font-bold leading-6 text-ink outline-none">
            Order summary
          </h2>
          <ul className="mt-2 divide-y divide-line">
            {pricing.lines.map((line) => {
              const k = line.key as QuickBuyServiceKey;
              const isPrimary = k === primary;
              const sub = [
                k === "ucr" ? `${line.ucrTier ?? ucrTier ?? "0-2"} trucks, government fee included` : null,
                k === "dq-files" ? "1 driver" : null,
                isPrimary ? "Your selection" : null,
              ]
                .filter(Boolean)
                .join(". ");
              return (
                <li key={k} className="flex items-start justify-between gap-4 py-3">
                  <span>
                    <span className="block font-medium text-ink">{line.name}</span>
                    {sub ? <span className="block text-[13px] text-slate">{sub}</span> : null}
                  </span>
                  <span className="text-right">
                    <span className="block font-mono font-medium tabular-nums text-ink">{line.amount == null ? "Quote" : money(line.amount)}</span>
                    {isPrimary ? null : (
                      <button
                        type="button"
                        onClick={() => {
                          toggle(k);
                          summaryHeadingRef.current?.focus();
                        }}
                        className={cn("mt-0.5 min-h-7 text-[13px] font-medium text-steel underline underline-offset-2", FOCUS)}
                      >
                        Remove<span className="sr-only"> {line.name}</span>
                      </button>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="mt-1 flex items-baseline justify-between gap-4 border-t border-line pt-3">
            <span className="font-semibold text-ink">Total due now</span>
            <span className="font-display text-[30px] font-extrabold leading-9 tabular-nums text-ink">{money(pricing.total)}</span>
          </div>
          <p className="mt-1 text-[13px] text-slate">All fees included. Nothing is added at payment.</p>
          <p aria-live="polite" className="sr-only">
            {liveTotal}
          </p>
        </section>

        {/* E. Authorize the filing */}
        <section aria-labelledby="h-sign" className="rounded-[14px] border border-line bg-cloud p-4 shadow-[0_1px_2px_rgba(14,34,51,.05)] lg:p-6">
          <h2 id="h-sign" className="font-display text-[19px] font-bold leading-6 text-ink">
            Authorize the filing
          </h2>
          <p className="mt-1 text-sm text-slate">Typing your name signs this order for {carrier.legalName ?? "your company"}.</p>

          <div className="mt-3">
            <Field label="Your full legal name" id="sign" error={fieldError("sign")}>
              <input
                ref={(el) => {
                  fieldRefs.current.sign = el;
                }}
                id="sign"
                name="signature_name"
                type="text"
                // Deliberately not autofilled: a typed signature has to be typed.
                autoComplete="off"
                autoCapitalize="words"
                spellCheck={false}
                aria-required="true"
                aria-invalid={!!fieldError("sign")}
                aria-describedby={describedBy("sign")}
                value={values.sign}
                onChange={(e) => update("sign", e.target.value)}
                onBlur={() => onBlur("sign")}
                className={cn(INPUT, fieldError("sign") ? "border-2 border-error" : "border-field")}
              />
            </Field>
          </div>

          <label
            className={cn(
              "-mx-3 mt-3.5 grid cursor-pointer grid-cols-[24px_1fr] items-start gap-3 rounded-[10px] p-3 leading-[22px] text-ink",
              fieldError("agree") && "bg-error-50",
            )}
          >
            <input
              ref={(el) => {
                fieldRefs.current.agree = el;
              }}
              type="checkbox"
              name="terms_accepted"
              aria-required="true"
              aria-invalid={!!fieldError("agree")}
              aria-describedby={describedBy("agree")}
              checked={values.agree}
              onChange={(e) => update("agree", e.target.checked)}
              className={cn(CHECKBOX, "scroll-mt-28", fieldError("agree") && "border-error")}
            />
            <span>
              I agree to the{" "}
              <a
                href="/terms-of-service/"
                target="_blank"
                rel="noopener noreferrer"
                className={cn("font-semibold text-steel underline underline-offset-2", FOCUS)}
              >
                terms of service<span className="sr-only"> (opens in a new tab)</span>
              </a>{" "}
              and authorize this filing.
            </span>
          </label>
          {fieldError("agree") ? <FieldErrorText id="agree-error" text={fieldError("agree")!} /> : null}

          {state?.formError ? (
            <p role="alert" className="mt-4 rounded-[10px] border border-error bg-error-50 px-3.5 py-3 text-sm font-medium text-error">
              {state.formError}
            </p>
          ) : null}

          <button
            ref={ctaRef}
            type="submit"
            aria-disabled={isPending || undefined}
            aria-busy={isPending || undefined}
            className={cn(
              "mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-signal text-[17px] font-semibold text-ink shadow-[inset_0_-2px_0_rgba(14,34,51,.14),0_1px_2px_rgba(14,34,51,.12)] hover:bg-signal-hover active:translate-y-px focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-steel",
              isPending && "cursor-progress opacity-85",
            )}
          >
            {isPending ? (
              <>
                <CheckoutSpinner />
                Saving your order...
              </>
            ) : (
              <>
                Continue to payment
                <ArrowRightIcon size={20} />
              </>
            )}
          </button>

          <ul className="mt-4 grid gap-2.5 text-[13px] leading-[18px] text-slate">
            <li className="flex gap-2.5">
              <CardIcon size={18} className="shrink-0 text-steel" />
              <span>
                <strong className="font-semibold text-ink">Pay securely on the next step.</strong> Card payment is handled by
                Stripe. We never see your card number.
              </span>
            </li>
            <li className="flex gap-2.5">
              <ShieldIcon size={18} className="shrink-0 text-steel" />
              <span>
                <strong className="font-semibold text-ink">FMCSA-listed BOC-3 blanket process agent.</strong> We file on your
                behalf.
              </span>
            </li>
            <li className="flex gap-2.5">
              <BuildingIcon size={18} className="shrink-0 text-steel" />
              <span>DGR Tech Rig is a private filing service, not a government agency.</span>
            </li>
          </ul>
        </section>
      </div>

      {/* Phone only: the total, always a glance away. Hidden while the keyboard
          is up and while the in-page button is on screen. */}
      <div
        className={cn(
          "sticky bottom-0 z-10 -mx-4 mt-6 flex items-center gap-3 border-t border-line bg-cloud px-4 pb-[calc(14px+env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_24px_rgba(14,34,51,.08)] motion-safe:transition-transform motion-safe:duration-200 lg:hidden",
          (ctaInView || typing) && "invisible translate-y-full",
        )}
      >
        <button
          type="button"
          onClick={() => {
            summaryHeadingRef.current?.focus({ preventScroll: true });
            summaryHeadingRef.current?.scrollIntoView({ block: "start", behavior: reducedMotion() ? "auto" : "smooth" });
          }}
          className={cn("text-left", FOCUS)}
        >
          <span className="block text-xs text-slate">Total due now</span>
          <span className="block font-display text-[22px] font-extrabold leading-7 tabular-nums text-ink">{money(pricing.total)}</span>
        </button>
        <button
          type="submit"
          aria-disabled={isPending || undefined}
          tabIndex={ctaInView ? -1 : undefined}
          className="flex h-13 flex-1 items-center justify-center rounded-xl bg-signal text-base font-semibold text-ink hover:bg-signal-hover focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-steel"
        >
          {isPending ? "Saving..." : "Continue to payment"}
        </button>
      </div>
    </form>
  );
}

const EMPTY: CheckoutValues = { first: "", last: "", email: "", phone: "", sign: "", agree: false };

const CHECKBOX =
  "mt-px size-6 shrink-0 cursor-pointer appearance-none rounded-md border-2 border-field bg-cloud bg-center bg-no-repeat checked:border-steel checked:bg-steel checked:bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22white%22%20stroke-width=%223%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22%3E%3Cpath%20d=%22m5%2012.5%204.5%204.5L19%207.5%22/%3E%3C/svg%3E')] bg-[length:16px] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-steel";

function Field({
  label,
  id,
  optional,
  error,
  hint,
  children,
}: {
  label: string;
  id: string;
  optional?: boolean;
  error?: string;
  hint?: { id: string; text: string };
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-ink">
        {label}
        {optional ? <span className="font-normal text-slate"> (optional)</span> : null}
      </label>
      {children}
      {hint && !error ? (
        <p id={hint.id} className="mt-1.5 text-[13px] text-slate">
          {hint.text}
        </p>
      ) : null}
      {error ? <FieldErrorText id={`${id}-error`} text={error} /> : null}
    </div>
  );
}

function FieldErrorText({ id, text }: { id: string; text: string }) {
  return (
    <p id={id} className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-error">
      <AlertIcon size={16} className="mt-0.5 shrink-0" />
      {text}
    </p>
  );
}

function AddOnCard({
  k,
  on,
  fromCheck,
  description,
  price,
  note,
  onToggle,
}: {
  k: QuickBuyServiceKey;
  on: boolean;
  fromCheck: boolean;
  description: string;
  price: string;
  note: string | null;
  onToggle: () => void;
}) {
  return (
    <label
      className={cn(
        "grid min-h-16 cursor-pointer grid-cols-[24px_1fr_auto] items-start gap-3 rounded-[14px] border bg-cloud p-4 transition-[border-color,background-color] lg:px-5",
        on ? "border-steel bg-steel-50 shadow-[inset_0_0_0_1px_var(--color-steel)]" : "border-line hover:border-field",
      )}
    >
      {/* Named by the service alone; description and price are read as its description. */}
      <input
        type="checkbox"
        checked={on}
        onChange={onToggle}
        aria-labelledby={`addon-${k}-name`}
        aria-describedby={`addon-${k}-desc addon-${k}-price`}
        className={CHECKBOX}
      />
      <span className="min-w-0">
        <span id={`addon-${k}-name`} className="block font-semibold text-ink">
          {SERVICES[k].name}
        </span>
        {fromCheck ? (
          <span className="mt-1 inline-block rounded-full border border-steel/30 px-2 text-xs font-semibold leading-[18px] text-steel">
            From your compliance check
          </span>
        ) : null}
        <span id={`addon-${k}-desc`} className="mt-0.5 block text-sm text-slate">
          {description}
        </span>
      </span>
      <span id={`addon-${k}-price`} className="text-right">
        <span className="block font-semibold tabular-nums text-ink">{price}</span>
        {note ? <span className="block text-xs text-slate">{note}</span> : null}
      </span>
    </label>
  );
}
