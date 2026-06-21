import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbNode, graph } from "@/lib/schema";
import { PhoneIcon } from "@/components/icons";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Tech Rig",
  description:
    "Talk to Tech Rig about trucking compliance, authority setup, or truck dispatch. Call, email, or tell us where you are in the process and we will help.",
  alternates: { canonical: "/contact-us/" },
  openGraph: {
    title: "Contact Tech Rig",
    description:
      "Talk to Tech Rig about trucking compliance, authority setup, or truck dispatch.",
    url: "/contact-us/",
    type: "website",
  },
};

// The conversion endpoint for the site's CTAs. Leads with the two contact
// methods that work today (tel + email); a submitting contact form is a planned
// follow-up once the backend is wired (see build-report). NAP is the registered
// address, presented without implying a walk-in office or hours.
export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbNode([
            { name: "Home", slug: "/" },
            { name: "Contact" },
          ]),
        )}
      />

      <Section surface="paper" className="pt-8 md:pt-12">
        <Container className="max-w-3xl">
          <Breadcrumbs
            items={[{ name: "Home", href: "/" }, { name: "Contact" }]}
          />
          <h1 className="mt-6 font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink">
            Contact Tech Rig
          </h1>
          <p className="mt-5 max-w-[60ch] text-lg text-slate">
            Whether you are getting road-legal or keeping your truck loaded, tell
            us where you are and we will point you to the next step. The fastest
            way to reach us is a call or an email.
          </p>

          {/* Functional contact methods. */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <a
              href={site.telHref}
              className="flex flex-col gap-1 rounded-card border border-slate/15 bg-cloud p-5 transition-colors hover:border-steel outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
            >
              <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-slate">
                <PhoneIcon size={16} className="text-steel" />
                Call
              </span>
              <span className="font-mono text-lg text-ink">
                {site.telephone}
              </span>
            </a>
            <a
              href={`mailto:${site.email}`}
              className="flex flex-col gap-1 rounded-card border border-slate/15 bg-cloud p-5 transition-colors hover:border-steel outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
            >
              <span className="font-mono text-xs uppercase tracking-[0.08em] text-slate">
                Email
              </span>
              <span className="font-mono text-lg text-ink">{site.email}</span>
            </a>
          </div>

          {/* What to tell us, so the first reply is useful. */}
          <h2 className="mt-12 font-display text-2xl font-bold text-ink">
            What to tell us
          </h2>
          <ul className="mt-4 space-y-2 text-slate">
            <li>Whether you are starting out, fixing a stalled setup, or already running.</li>
            <li>Your equipment type if you want dispatch (box truck, reefer, flatbed, dry van, power only, hot shot).</li>
            <li>Which filings you think you need, or ask us to confirm what applies.</li>
          </ul>

          <h2 className="mt-12 font-display text-2xl font-bold text-ink">
            Where we are
          </h2>
          <address className="mt-4 font-mono text-sm not-italic text-slate">
            <p>{site.address.street}</p>
            <p>
              {site.address.locality}, {site.address.region}{" "}
              {site.address.postalCode}
            </p>
          </address>
          <p className="mt-4 text-sm text-slate">{site.fmcsaLine}</p>

          <p className="mt-10 text-slate">
            Not sure where to start? See{" "}
            <Link
              href="/compliance-services/"
              className="font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
            >
              compliance services
            </Link>{" "}
            or{" "}
            <Link
              href="/services/"
              className="font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
            >
              truck dispatch
            </Link>
            .
          </p>
        </Container>
      </Section>
    </>
  );
}
