import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";

/**
 * The template closing band: full-bleed Ink (the reserved high-emphasis surface)
 * with one styled line and the page's single dominant CTA. One action only, so
 * Signal stays rationed.
 */
export function ClosingCta({
  text,
  cta,
}: {
  text: string;
  cta: { label: string; href: string };
}) {
  return (
    <Section surface="ink">
      <Container className="max-w-2xl text-center">
        <p className="font-display text-2xl font-bold text-cloud">{text}</p>
        <div className="mt-6 flex justify-center">
          <Link
            href={cta.href}
            className={buttonVariants({ variant: "primary", size: "md" })}
          >
            {cta.label}
          </Link>
        </div>
      </Container>
    </Section>
  );
}
