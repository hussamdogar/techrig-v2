import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import { signOut } from "@/app/auth/actions";

/**
 * Authed-area shell (M2). A lightweight sub-nav (Dashboard / Account / Sign out)
 * shown below the site header on the dashboard and account pages, built with the
 * existing design system. Kept in-content so the marketing chrome and route
 * layouts are untouched.
 */
export function AppShell({
  email,
  active,
  children,
}: {
  email: string;
  active: "dashboard" | "account";
  children: React.ReactNode;
}) {
  const link = (href: string, label: string, key: typeof active) => (
    <Link
      href={href}
      className={cn(
        "underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel",
        active === key ? "text-ink" : "text-slate hover:text-steel",
      )}
    >
      {label}
    </Link>
  );

  return (
    <Section surface="paper" className="pt-8 md:pt-10">
      <Container className="max-w-5xl">
        <div className="flex items-center justify-between gap-4 border-b border-slate/15 pb-4">
          <nav className="flex items-center gap-5 text-sm font-medium">
            {link("/dashboard/", "Dashboard", "dashboard")}
            {link("/account/", "Account", "account")}
          </nav>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden text-slate sm:inline">{email}</span>
            <form action={signOut}>
              <button
                type="submit"
                className="font-medium text-steel underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
        <div className="mt-8">{children}</div>
      </Container>
    </Section>
  );
}
