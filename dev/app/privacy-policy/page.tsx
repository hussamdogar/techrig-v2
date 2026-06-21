import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Tech Rig privacy policy. The full policy is being migrated from our existing site.",
  alternates: { canonical: "/privacy-policy/" },
};

export default function Page() {
  return <LegalPage title="Privacy Policy" />;
}
