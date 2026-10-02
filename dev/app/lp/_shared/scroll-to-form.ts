import { pushDataLayerEvent } from "@/lib/gtm";

const SCROLL_DURATION_MS = 900;
const HINT_VISIBLE_MS = 4000;

/**
 * Takes the visitor to the hero's USDOT form (#file) and opens the keypad.
 *
 * The field is focused FIRST, synchronously inside the tap/click handler:
 * iOS Safari only opens the on-screen keyboard for a focus() made during the
 * user's gesture, and ignores one made after an animation (Android is more
 * lenient, but this works for both). `preventScroll` stops the browser's own
 * jump so our scroll stays in charge, and the field's inputMode="numeric"
 * makes that keyboard the number pad.
 *
 * Then a deliberately slow, eased scroll to the form, instead of an instant
 * anchor jump or the browser's (fast, inconsistent) native smooth scroll,
 * ending with a short-lived "Start here" hint by the field. Skips the
 * animation for `prefers-reduced-motion` and jumps straight there.
 *
 * Every "File my BOC-3" control on the landing page uses this (header,
 * mobile menu, sticky bar, pricing card, final CTA), so all of them land on
 * the same form instead of a separate /buy/ page. `location` tags the
 * cta_click event with which one fired.
 */
export function scrollToUsdotForm(e: React.MouseEvent<HTMLAnchorElement>, location: string) {
  e.preventDefault();
  pushDataLayerEvent("cta_click", { location });
  const target = document.getElementById("file");
  if (!target) return;

  const input = document.getElementById("usdot") as HTMLInputElement | null;
  input?.focus({ preventScroll: true });

  const offset = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
  const targetY = target.getBoundingClientRect().top + window.scrollY - offset;

  const onArrive = () => {
    const hint = document.getElementById("usdot-hint");
    // Usually still focused from above; re-focus only if something took it.
    if (input && document.activeElement !== input) input.focus({ preventScroll: true });
    if (hint) {
      window.clearTimeout(Number(hint.dataset.hideTimer));
      hint.style.opacity = "1";
      const timer = window.setTimeout(() => {
        hint.style.opacity = "0";
      }, HINT_VISIBLE_MS);
      hint.dataset.hideTimer = String(timer);
    }
  };

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo(0, targetY);
    onArrive();
    return;
  }

  const startY = window.scrollY;
  const distance = targetY - startY;
  const start = performance.now();

  function step(now: number) {
    const t = Math.min((now - start) / SCROLL_DURATION_MS, 1);
    const eased = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2; // ease-in-out quad
    window.scrollTo(0, startY + distance * eased);
    if (t < 1) requestAnimationFrame(step);
    else onArrive();
  }
  requestAnimationFrame(step);
}
