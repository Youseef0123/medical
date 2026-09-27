import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { privacyPolicy } from "@/data/legal";

export const metadata: Metadata = {
  title: "Privacy Policy | Medisave Pharma",
  description:
    "Learn how Medisave Pharma collects, uses and protects the personal information you share through our website.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return <LegalPage doc={privacyPolicy} related={{ label: "Terms of Service", href: "/terms" }} />;
}
