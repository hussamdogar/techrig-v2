/**
 * Google Ads click identifiers, captured first-party so a sale that closes
 * later (by phone, or after follow-ups) can still be uploaded to Google Ads
 * against the exact ad click (Goals > Uploads, "conversions from clicks").
 *
 * Google appends one of these to the landing URL when auto-tagging is on:
 *  - gclid:  standard web clicks
 *  - gbraid / wbraid: iOS app-to-web / web-to-app clicks (no gclid there)
 *
 * Shared by the client capture component and the server-side reader, so the
 * cookie names can't drift between the two.
 */
export const AD_CLICK_ID_PARAMS = ["gclid", "gbraid", "wbraid"] as const;
export type AdClickIdParam = (typeof AD_CLICK_ID_PARAMS)[number];
export type AdClickIds = Record<AdClickIdParam, string | null>;

/** Cookie name per click id, e.g. "tr_gclid". */
export const adClickIdCookie = (param: AdClickIdParam) => `tr_${param}`;

/** 90 days: Google Ads accepts click-based uploads up to 90 days after the click. */
export const AD_CLICK_ID_MAX_AGE_SECONDS = 90 * 24 * 60 * 60;

/** Click ids are opaque tokens from Google; reject anything that isn't, so a
 *  crafted URL can't plant arbitrary text in our cookies or database. */
export function isPlausibleClickId(value: string): boolean {
  return /^[A-Za-z0-9_\-.]{10,200}$/.test(value);
}
