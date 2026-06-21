import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbNode, graph } from "@/lib/schema";

export const metadata: Metadata = {
  title: "How to Start a Box Truck Business",
  description:
    "How to start a box truck business: get road-legal with the right filings, then keep the truck loaded with dispatch. The two halves, from one team.",
  alternates: { canonical: "/how-to-start-a-box-truck-business/" },
  openGraph: {
    title: "How to Start a Box Truck Business",
    description:
      "Get road-legal with the right filings, then keep the truck loaded with dispatch.",
    url: "/how-to-start-a-box-truck-business/",
    type: "website",
  },
};

// Bridge guide: connects the setup (compliance) and dispatch silos for box truck
// operators. A short bridge that routes to the full pillar and the box-truck
// dispatch page; a fuller standalone spec can replace this if SEO writes one.
export default function HowToStartABoxTruckBusinessPage() {
  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbNode([
            { name: "Home", slug: "/" },
            { name: "How to Start a Box Truck Business" },
          ]),
        )}
      />

      <Section surface="paper" className="pt-8 md:pt-12">
        <Container className="max-w-3xl">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "How to Start a Box Truck Business" },
            ]}
          />
          <h1 className="mt-6 font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink">
            How to Start a Box Truck Business
          </h1>
          <p className="mt-5 max-w-[60ch] text-lg text-slate">
            Starting a box truck business has two halves: getting road-legal, then
            keeping the truck earning. You get set up with the right filings, then
            you keep the wheels loaded. The same team can handle both.
          </p>

          <h2 className="mt-12 font-display text-2xl font-bold text-ink">
            First, get road-legal
          </h2>
          <p className="mt-4 text-slate">
            Box truck operators running interstate need their federal setup done
            right. Our{" "}
            <Link
              href="/how-to-start-a-trucking-company/"
              className="font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
            >
              setup guide
            </Link>{" "}
            walks through USDOT, operating authority, BOC-3, UCR, and the rest, or
            we can handle the whole{" "}
            <Link
              href="/compliance-services/"
              className="font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
            >
              compliance setup
            </Link>{" "}
            for you.
          </p>

          <h2 className="mt-12 font-display text-2xl font-bold text-ink">
            Then, keep it loaded
          </h2>
          <p className="mt-4 text-slate">
            Once your authority is active, the truck has to earn. Our{" "}
            <Link
              href="/box-truck-dispatch/"
              className="font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
            >
              box truck dispatch
            </Link>{" "}
            service finds and books your loads, with no long-term contract and no
            forced dispatch.
          </p>

          <div className="mt-10">
            <Link
              href="/compliance-services/"
              className={buttonVariants({ variant: "primary", size: "md" })}
            >
              Start your compliance setup
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
