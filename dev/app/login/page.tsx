import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/container";
import { LoginForm } from "./login-form";

// Authed-area entry; noindex (ADR-5), excluded from sitemap.
export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

function safeNext(next: string | undefined): string {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard/";
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;

  return (
    <Section surface="paper" className="pt-12 md:pt-16">
      <Container className="max-w-md">
        <h1 className="font-display text-3xl font-extrabold tracking-[-0.02em] text-ink">
          Sign in to Tech Rig
        </h1>
        <p className="mt-3 text-slate">
          Save and track your filings. Enter your email and we&apos;ll send you a secure
          sign-in link, no password to remember.
        </p>
        {error ? (
          <p className="mt-4 rounded-card border border-signal/40 bg-signal/10 p-3 text-sm text-ink">
            That sign-in link didn&apos;t work. Request a new one below.
          </p>
        ) : null}
        <div className="mt-6">
          <LoginForm next={safeNext(next)} />
        </div>
      </Container>
    </Section>
  );
}
