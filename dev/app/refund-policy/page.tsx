import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Refund Policy",
  description:
    "Tech Rig refund policy. The full policy is being migrated from our existing site.",
  alternates: { canonical: "/refund-policy/" },
};

export default function Page() {
  return <LegalPage title="Refund Policy" />;
}
