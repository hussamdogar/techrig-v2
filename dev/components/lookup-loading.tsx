import { Container, Section } from "@/components/ui/container";

/**
 * Shared loading state for the two routes that await a live FMCSA/MOTUS
 * lookup before rendering anything (`/lookup/[usdot]/`, `/buy/[service]/
 * [usdot]/`). Found via a Lighthouse run that reported NO_FCP on the lookup
 * page: with no `loading.tsx` in either route segment, the server component's
 * `await performLookup(...)` blocks the entire response, so the browser
 * showed nothing at all for the lookup's full duration (up to several
 * seconds, longer on a slow provider). This is Next's App Router loading
 * convention: it streams in immediately while the server component still
 * awaits, so the visitor sees a real page instead of a blank tab.
 */
export function LookupLoading() {
  return (
    <Section surface="paper" className="pt-8 md:pt-12">
      <Container className="max-w-4xl">
        <div className="flex items-center gap-3">
          <svg className="h-5 w-5 animate-spin text-steel" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" className="opacity-25" />
            <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-slate">
            Looking up your carrier record
          </p>
        </div>
        <p className="mt-3 max-w-[50ch] text-slate">
          Pulling live FMCSA and MOTUS data. This usually takes a few seconds.
        </p>
      </Container>
    </Section>
  );
}
