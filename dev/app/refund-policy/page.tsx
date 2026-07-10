import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbNode, graph } from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Refund Policy | Tech Rig",
  description:
    "Tech Rig's refund policy: when a full or partial refund applies, how processing fees work, and which government and third-party fees are non-refundable.",
  alternates: { canonical: "/refund-policy/" },
};

// Shared styles for the legal copy so the sections read consistently.
const h2 =
  "mt-12 font-display text-2xl font-bold tracking-[-0.01em] text-ink";
const p = "mt-4 max-w-[68ch] text-slate";
const ul = "mt-4 max-w-[68ch] list-disc space-y-2 pl-6 text-slate";
const link =
  "font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel";

export default function Page() {
  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbNode([
            { name: "Home", slug: "/" },
            { name: "Refund Policy" },
          ]),
        )}
      />
      <Section surface="paper" className="pt-8 md:pt-12">
        <Container className="max-w-3xl">
          <Breadcrumbs
            items={[{ name: "Home", href: "/" }, { name: "Refund Policy" }]}
          />
          <h1 className="mt-6 font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink">
            Refund Policy
          </h1>
          <p className="mt-4 text-sm italic text-slate">
            Last updated: June 25, 2026
          </p>

          <p className={p}>
            This policy explains when refunds apply to Tech Rig (DGR Tech Rig
            LLC) services. It covers our service fees only. Government,
            laboratory, partner, and other third-party fees follow the rules
            below.
          </p>

          <h2 className={h2}>
            Full refund (within 3 days, before work begins)
          </h2>
          <p className={p}>
            You may receive a full refund of your service fee when all of the
            following are true:
          </p>
          <ul className={ul}>
            <li>No work has started.</li>
            <li>
              No filing has been submitted to FMCSA or any other agency.
            </li>
            <li>No consultation or service has been delivered.</li>
            <li>You request the refund within 3 days of payment.</li>
          </ul>
          <p className={p}>
            In this case we refund your payment in full, less only the actual
            payment-processing fee that our payment processor does not return to
            us. For example, if you paid $100 and the non-refundable processing
            fee is $3, we refund $97.
          </p>

          <h2 className={h2}>Partial refund (work started, nothing filed)</h2>
          <p className={p}>
            If we have started reviewing or preparing your order but have not
            yet submitted a filing, you may be eligible for a partial refund of
            up to 75% of the service fee, depending on the work already
            completed.
          </p>

          <h2 className={h2}>When service fees are non-refundable</h2>
          <ul className={ul}>
            <li>
              Filing fees become non-refundable once work has substantially
              started or a filing has been submitted to FMCSA or another agency.
            </li>
            <li>
              Government, laboratory, partner, and third-party fees are
              non-refundable once they have been paid or committed on your
              behalf.
            </li>
            <li>
              Service fees are non-refundable when the order cannot proceed
              because the client has been inactive for 30 days due to missing
              documents or a delayed response.
            </li>
          </ul>

          <h2 className={h2}>Recurring and renewable services</h2>
          <p className={p}>
            Renewable services (such as UCR, consortium enrollment, Driver
            Qualification files, and IFTA quarterly filing) are invoiced before
            each renewal. We only auto-charge a renewal when you have expressly
            agreed to recurring billing.
          </p>

          <h2 className={h2}>How to request a refund</h2>
          <p className={p}>
            Contact us at{" "}
            <a href={`mailto:${site.email}`} className={link}>
              {site.email}
            </a>{" "}
            or{" "}
            <a href={site.telHref} className={link}>
              {site.telephone}
            </a>{" "}
            with your order details. We will confirm which part of your payment
            is eligible under this policy before processing any refund.
          </p>
        </Container>
      </Section>
    </>
  );
}
