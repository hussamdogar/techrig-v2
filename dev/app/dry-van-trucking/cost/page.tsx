import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ClosingCta } from "@/components/closing-cta";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbNode, graph } from "@/lib/schema";
import { filingCtaHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "Dry Van Dispatch Cost",
  description:
    "What dry van dispatch costs with Tech Rig: a percentage of your gross, set by equipment, with no long-term contract and no forced dispatch.",
  alternates: { canonical: "/dry-van-trucking/cost/" },
  openGraph: {
    title: "Dry Van Dispatch Cost",
    description:
      "What dry van dispatch costs with Tech Rig: a percentage of your gross, no contract, no forced dispatch.",
    url: "/dry-van-trucking/cost/",
    type: "website",
  },
};

export default function DryVanDispatchCostPage() {
  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbNode([
            { name: "Home", slug: "/" },
            { name: "Dispatch Services", slug: "/services/" },
            { name: "Dry Van Dispatch", slug: "/dry-van-trucking/" },
            { name: "Cost" },
          ]),
        )}
      />

      <Section surface="paper" className="pt-8 md:pt-12">
        <Container className="max-w-3xl">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Dispatch Services", href: "/services/" },
              { name: "Dry Van Dispatch", href: "/dry-van-trucking/" },
              { name: "Cost" },
            ]}
          />
          <h1 className="mt-6 font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink">
            Dry Van Dispatch Cost
          </h1>
          <p className="mt-5 max-w-[60ch] text-lg text-slate">
            Dry van dispatch is priced as a percentage of your gross, so the cost
            scales with your revenue and we only win when you do. There is no
            long-term contract, no forced dispatch, and no sign-up lock-in.
          </p>

          <p className="mt-6 font-mono text-2xl text-ink">
            Rate on request
          </p>
          <p className="mt-2 text-sm text-slate">
            The dry van percentage is confirmed per carrier before you start. Ask
            and we will give you the number up front.
          </p>

          <p className="mt-6 text-slate">
            That percentage covers working the boards and broker relationships to
            protect your rate per mile, booking your loads, and the dispatch
            paperwork. Your insurance, fuel, and other operating costs are
            separate and paid by you.
          </p>

          <div className="mt-8">
            <Link
              href="/dry-van-trucking/"
              className="font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
            >
              Dry van dispatch
            </Link>
          </div>
        </Container>
      </Section>

      <ClosingCta
        text="Want your dry van kept loaded? Talk to us."
        cta={{ label: "Get dispatched", href: filingCtaHref }}
      />
    </>
  );
}
