import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Tech Rig terms of service. The full terms are being migrated from our existing site.",
  alternates: { canonical: "/terms-of-service/" },
};

export default function Page() {
  return <LegalPage title="Terms of Service" />;
}
