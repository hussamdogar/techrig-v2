import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/container";
import { decodeLeadAccessToken } from "@/lib/server/security";
import { service } from "@/lib/server/supabase";

// Public but noindex: a one-click CAN-SPAM unsubscribe from promotional reminders.
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: { index: false, follow: false },
};

export default async function UnsubscribePage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  const decoded = token ? decodeLeadAccessToken(token) : null;
  let ok = false;
  if (decoded) {
    await service().from("leads").update({ email_opt_out: true }).eq("id", decoded.leadId);
    ok = true;
  }

  return (
    <Section surface="paper" className="pt-12 md:pt-16">
      <Container className="max-w-xl">
        <h1 className="font-display text-3xl font-extrabold tracking-[-0.02em] text-ink">
          {ok ? "You're unsubscribed" : "Link not recognized"}
        </h1>
        <p className="mt-3 text-slate">
          {ok
            ? "You won't receive promotional reminders from us. Transactional messages about an active application (receipts and status updates) will still reach you."
            : "We couldn't process this unsubscribe link. It may have expired. Email us and we'll take care of it."}
        </p>
      </Container>
    </Section>
  );
}
