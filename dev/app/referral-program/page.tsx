import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Referral Program",
  description:
    "Tech Rig referral program. The full details are being migrated from our existing site.",
  alternates: { canonical: "/referral-program/" },
};

export default function Page() {
  return <LegalPage title="Referral Program" />;
}
