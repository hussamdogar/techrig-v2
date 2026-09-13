/**
 * Google Tag Manager (GTM-W7BD5J6W, installed site-wide in app/layout.tsx).
 * Single helper for every custom dataLayer push in the app, so event shapes
 * stay consistent and GTM triggers can be built once against a known set of
 * event names instead of scattered ad hoc pushes.
 *
 * Safe to call from anywhere, including server-rendered code paths: it is a
 * no-op unless `window.dataLayer` exists (i.e. unless we are in the browser
 * and GTM's own snippet has already initialised the array).
 */

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/** Push a custom event onto the dataLayer. `data` becomes sibling keys on the
 *  event object (GTM convention), e.g. pushDataLayerEvent("purchase", { value: 100 }). */
export function pushDataLayerEvent(event: string, data?: Record<string, unknown>) {
  if (typeof window === "undefined" || !window.dataLayer) return;
  window.dataLayer.push({ event, ...data });
}
