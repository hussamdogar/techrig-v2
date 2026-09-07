import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";

// Renders inside the root layout (header/footer still show), per Next's
// App Router convention for app/not-found.tsx.
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <Section surface="paper" className="pt-16 md:pt-24">
      <Container className="max-w-xl text-center">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-slate">404</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.02em] text-ink">
          We couldn&apos;t find that page
        </h1>
        <p className="mt-4 text-slate">
          The page you&apos;re looking for may have moved or no longer exists. Try the homepage, or reach
          out and we&apos;ll point you the right way.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/" className={buttonVariants({ variant: "primary", size: "md" })}>
            Back to homepage
          </Link>
          <Link
            href="/contact-us/"
            className="font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
          >
            Contact us
          </Link>
        </div>
      </Container>
    </Section>
  );
}
