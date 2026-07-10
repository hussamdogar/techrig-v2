import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container, Section } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { BUNDLES, SERVICES, isBundleKey, isServiceKey } from "@/lib/services-registry";
import { createApplication } from "./actions";

// Authed, noindex (ADR-5).
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Start an application",
  robots: { index: false, follow: false },
};

export default async function ApplyStartPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; bundle?: string }>;
}) {
  const { service, bundle } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login/?next=/apply/");

  const preselect = isServiceKey(service) ? service : null;
  const preselectBundle = isBundleKey(bundle) ? bundle : null;

  return (
    <Section surface="paper" className="pt-12 md:pt-16">
      <Container className="max-w-2xl">
        <h1 className="font-display text-3xl font-extrabold tracking-[-0.02em] text-ink">Start an application</h1>
        <p className="mt-3 text-slate">
          Pick your services on the next step, fill in only what they need, and we&apos;ll handle the filings.
          You can save and come back anytime.
        </p>
        {preselectBundle ? (
          <p className="mt-4 rounded-card border border-slate/15 bg-cloud p-3 text-sm text-ink">
            Starting with the <span className="font-semibold">{BUNDLES[preselectBundle].name}</span> package
            selected. You can change it on the next step.
          </p>
        ) : preselect ? (
          <p className="mt-4 rounded-card border border-slate/15 bg-cloud p-3 text-sm text-ink">
            Starting with <span className="font-semibold">{SERVICES[preselect].name}</span> selected. You can add
            more on the next step.
          </p>
        ) : null}
        <form action={createApplication} className="mt-7">
          {preselectBundle ? <input type="hidden" name="bundle" value={preselectBundle} /> : null}
          {preselect ? <input type="hidden" name="service" value={preselect} /> : null}
          <button type="submit" className={buttonVariants({ variant: "primary", size: "md" })}>
            Start application
          </button>
        </form>
      </Container>
    </Section>
  );
}
