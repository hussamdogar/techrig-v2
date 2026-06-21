import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbNode, graph } from "@/lib/schema";
import { site } from "@/lib/site";

/**
 * Minimal scaffold for the legal/utility pages. These pages are PRESERVE items:
 * their real content lives on the existing site and must be migrated in verbatim
 * before launch. Until then this renders an honest interim notice (never
 * fabricated legal terms) so the footer links resolve and nothing 404s.
 */
export function LegalPage({ title }: { title: string }) {
  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbNode([{ name: "Home", slug: "/" }, { name: title }]),
        )}
      />
      <Section surface="paper" className="pt-8 md:pt-12">
        <Container className="max-w-3xl">
          <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: title }]} />
          <h1 className="mt-6 font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-ink">
            {title}
          </h1>
          <p className="mt-6 max-w-[68ch] text-slate">
            The full {title} is being migrated from our existing site. For any
            question in the meantime, reach us at{" "}
            <a
              href={site.telHref}
              className="font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
            >
              {site.telephone}
            </a>{" "}
            or{" "}
            <a
              href={`mailto:${site.email}`}
              className="font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
            >
              {site.email}
            </a>
            , or visit{" "}
            <Link
              href="/contact-us/"
              className="font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
            >
              contact
            </Link>
            .
          </p>
        </Container>
      </Section>
    </>
  );
}
