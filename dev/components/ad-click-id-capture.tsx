"use client";

import { useEffect } from "react";
import {
  AD_CLICK_ID_MAX_AGE_SECONDS,
  AD_CLICK_ID_PARAMS,
  adClickIdCookie,
  isPlausibleClickId,
} from "@/lib/ad-click-ids";

/**
 * Saves a Google Ads click id from the landing URL into a first-party cookie
 * (see lib/ad-click-ids.ts). Rendered once in the root layout; renders nothing.
 * Independent of GTM, so it works even where tags don't load, and the server
 * reads the cookie when a lead or order is created (lib/server/ad-click-ids.ts).
 * A newer ad click overwrites an older one (last-click, matching Google Ads).
 */
export function AdClickIdCapture() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    for (const param of AD_CLICK_ID_PARAMS) {
      const value = params.get(param);
      if (value && isPlausibleClickId(value)) {
        document.cookie = `${adClickIdCookie(param)}=${value}; Path=/; Max-Age=${AD_CLICK_ID_MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
      }
    }
  }, []);
  return null;
}
