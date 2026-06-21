import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ClosingCta } from "@/components/closing-cta";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbNode, graph } from "@/lib/schema";
import { filingCtaHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "Box Truck Dispatch Cost",
  description:
    "What box truck dispatch costs with Tech Rig: a flat percentage of your gross, no long-term contract, no forced dispatch, and no sign-up lock-in.",
  alternates: { canonical: "/box-truck-dispatch/cost/" },
  openGraph: {
    title: "Box Truck Dispatch Cost",
    description:
      "What box truck dispatch costs with Tech Rig: a flat percentage of your gross, no contract, no forced dispatch.",
    url: "/box-truck-dispatch/cost/",
    type: "website",
  },
};

export default function BoxTruckDispatchCostPage() {
  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbNode([
            { name: "Home", slug: "/" },
            { name: "Dispatch Services", slug: "/services/" },
            { name: "Box Truck Dispatch", slug: "/box-truck-dispatch/" },
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
              { name: "Box Truck Dispatch", href: "/box-truck-dispatch/" },
              { name: "Cost" },
            ]}
          />
          <h1 className="mt-6 font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink">
            Box Truck Dispatch Cost
          </h1>
          <p className="mt-5 max-w-[60ch] text-lg text-slate">
            Box truck dispatch is priced as a percentage of what you earn, so the
            cost scales with your revenue and we only win when you do. There is no
            long-term contract, no forced dispatch, and no sign-up lock-in.
          </p>

          <p className="mt-6 font-mono text-2xl text-ink">
            8%{" "}
            <span className="text-base text-slate">of gross monthly revenue</span>
          </p>

          <p className="mt-6 text-slate">
            That percentage covers finding and booking your loads, negotiating
            rates, and handling the dispatch paperwork. Government and third-party
            costs, like your own insurance and fuel, are separate and paid by you.
          </p>

          <div className="mt-8">
            <Link
              href="/box-truck-dispatch/"
              className="font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
            >
              Box truck dispatch
            </Link>
          </div>
        </Container>
      </Section>

      <ClosingCta
        text="Want your box truck kept loaded? Talk to us."
        cta={{ label: "Get my box truck dispatched", href: filingCtaHref }}
      />
    </>
  );
}
