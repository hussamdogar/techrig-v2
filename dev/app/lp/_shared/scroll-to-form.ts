import { pushDataLayerEvent } from "@/lib/gtm";

const SCROLL_DURATION_MS = 900;
const HINT_VISIBLE_MS = 4000;

/**
 * Deliberately slow, eased scroll to the hero's USDOT form (#file), instead of
 * an instant anchor jump or the browser's (fast, inconsistent-across-browsers)
 * native smooth scroll. On arrival: focus the field (native focus ring) and
 * flash a short-lived "enter it here" hint above it. Skips the animation for
 * `prefers-reduced-motion` and jumps straight there instead.
 *
 * Shared by every in-page "File my BOC-3" control (header, mobile sticky bar)
 * so they all land the visitor on the same form instead of a separate
 * /buy/ page load. `location` tags the cta_click event with which one fired.
 */
export function scrollToUsdotForm(e: React.MouseEvent<HTMLAnchorElement>, location: string) {
  e.preventDefault();
  pushDataLayerEvent("cta_click", { location });
  const target = document.getElementById("file");
  if (!target) return;

  const offset = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
  const targetY = target.getBoundingClientRect().top + window.scrollY - offset;

  const onArrive = () => {
    const input = document.getElementById("usdot") as HTMLInputElement | null;
    const hint = document.getElementById("usdot-hint");
    input?.focus();
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
