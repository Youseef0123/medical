import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { termsOfService } from "@/data/legal";

export const metadata: Metadata = {
  title: "Terms of Service | Medisave Pharma",
  description:
    "The terms and conditions governing your use of the Medisave Pharma website, including our medical information disclaimer.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return <LegalPage doc={termsOfService} related={{ label: "Privacy Policy", href: "/privacy" }} />;
}
