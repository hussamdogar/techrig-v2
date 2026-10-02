/**
 * Google Tag Manager (GTM-W7BD5J6W, installed site-wide in app/layout.tsx).
 * Single helper for every custom dataLayer push in the app, so event shapes
 * stay consistent and GTM triggers can be built once against a known set of
 * event names instead of scattered ad hoc pushes.
 *
 * Safe to call from anywhere, including server-rendered code paths: it is a
 * no-op outside the browser.
 */

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/** Push a custom event onto the dataLayer. `data` becomes sibling keys on the
 *  event object (GTM convention), e.g. pushDataLayerEvent("purchase", { value: 100 }).
 *
 *  Creates the dataLayer if GTM has not yet: GTM replays everything already in
 *  the array when it loads, so an event pushed before GTM initialises is
 *  delayed, never silently dropped. (Also why this is safe where GTM is not
 *  loaded at all, e.g. non-production deployments: the array just fills.)
 *
 *  A GA4 `ecommerce` payload is preceded by `{ ecommerce: null }`, Google's
 *  documented pattern, so fields from an earlier ecommerce event can never
 *  merge into this one. */
export function pushDataLayerEvent(event: string, data?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  if (data && "ecommerce" in data) window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({ event, ...data });
}
