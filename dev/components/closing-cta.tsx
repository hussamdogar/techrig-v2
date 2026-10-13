import Link from "next/link";
import { Container, Section } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { PhoneIcon } from "@/components/icons";
import { TrackedAnchor } from "@/components/tracked-anchor";

/**
 * The template closing band: full-bleed Ink (the reserved high-emphasis surface)
 * with one styled line and the page's single dominant CTA. One action only, so
 * Signal stays rationed. A `tel:` href renders as a tracked call button
 * (call_click, location "closing_cta") instead of a page link.
 */
export function ClosingCta({
  text,
  cta,
  note,
}: {
  text: string;
  cta: { label: string; href: string };
  /** Optional short line under the button, e.g. what happens after the click. */
  note?: string;
}) {
  return (
    <Section surface="ink">
      <Container className="max-w-2xl text-center">
        <p className="font-display text-2xl font-bold text-cloud">{text}</p>
        <div className="mt-6 flex justify-center">
          {cta.href.startsWith("tel:") ? (
            <TrackedAnchor
              href={cta.href}
              event="call_click"
              data={{ location: "closing_cta" }}
              className={buttonVariants({ variant: "primary", size: "md" })}
            >
              <PhoneIcon size={18} aria-hidden="true" />
              {cta.label}
            </TrackedAnchor>
          ) : (
            <Link
              href={cta.href}
              className={buttonVariants({ variant: "primary", size: "md" })}
            >
              {cta.label}
            </Link>
          )}
        </div>
        {note ? <p className="mt-3 text-sm text-cloud/70">{note}</p> : null}
      </Container>
    </Section>
  );
}
