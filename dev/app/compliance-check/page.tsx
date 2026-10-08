import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/container";
import { ComplianceCheck } from "@/components/compliance-check";

/*
 * The compliance check ("Am I road-legal?"), the site-wide replacement for the
 * old "Start your compliance setup" button (owner, 2026-10-08): two or three
 * questions, then the filings an interstate carrier typically needs, sendable
 * to quick-buy checkout pre-ticked. Rules: lib/compliance-check.ts. Noindex:
 * a tool, not a content page, and its answers depend on the visitor.
 */

export const metadata: Metadata = {
  title: "Am I Road-Legal? Compliance Check",
  description:
    "Answer two or three quick questions and see which federal filings your trucking company needs: BOC-3, UCR, driver files, and CDL requirements.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/compliance-check/" },
};

export default function ComplianceCheckPage() {
  return (
    <Section surface="ink" className="pt-10 md:pt-16">
      <Container className="grid items-start gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <h1 className="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-cloud">
            Am I <span className="text-signal">road-legal?</span>
          </h1>
          <p className="mt-4 max-w-[52ch] text-lg text-cloud/80">
            Answer two or three quick questions about how you haul and what you drive. We&apos;ll show you exactly
            which federal filings you need, and you can file them in one checkout.
          </p>
        </div>
        <ComplianceCheck />
      </Container>
    </Section>
  );
}
