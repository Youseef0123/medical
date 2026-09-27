import { companyInfo } from "@/data/company";

export interface LegalSection {
  id: string;
  title: string;
  paragraphs?: string[];
  list?: string[];
  /** Optional closing paragraphs rendered after the list. */
  after?: string[];
}

export interface LegalDocument {
  kicker: string;
  title: string;
  highlight: string;
  intro: string;
  lastUpdated: string;
  heroImage: string;
  sections: LegalSection[];
}

const LAST_UPDATED = "September 27, 2026";

export const privacyPolicy: LegalDocument = {
  kicker: "Your Data, Protected",
  title: "Privacy",
  highlight: "Policy",
  intro:
    "How Medisave Pharma collects, uses and safeguards the personal information you share with us through this website.",
  lastUpdated: LAST_UPDATED,
  heroImage: "/images/about/quality.jpg",
  sections: [
    {
      id: "introduction",
      title: "Introduction",
      paragraphs: [
        `${companyInfo.name} ("Medisave", "we", "us" or "our") respects your privacy and is committed to protecting the personal data you share with us. This Privacy Policy explains what information we collect when you visit ${companyInfo.website}, how we use it, and the choices and rights available to you.`,
        "We process personal data in accordance with the Egyptian Personal Data Protection Law No. 151 of 2020 and other applicable regulations. By using this website, you acknowledge the practices described in this policy.",
      ],
    },
    {
      id: "information-we-collect",
      title: "Information We Collect",
      paragraphs: [
        "We only collect the information needed to respond to you and to operate this website. Depending on how you interact with us, this may include:",
      ],
      list: [
        "Contact inquiries — your full name, email address, optional phone number, inquiry subject and message details submitted through our contact form.",
        "Job applications — your name, contact details, CV / résumé and any other information you choose to include when applying for an open position.",
        "Newsletter subscriptions — your email address, if you subscribe to receive updates from us.",
        "Technical data — browser type, device information, IP address, pages visited and referring URLs, collected automatically for security and performance purposes.",
      ],
      after: [
        "We do not intentionally collect sensitive health data through this website. Please do not submit personal medical records or patient-identifiable information through our general contact form.",
      ],
    },
    {
      id: "how-we-use",
      title: "How We Use Your Information",
      paragraphs: ["We use the personal data we collect to:"],
      list: [
        "Respond to your inquiries and provide requested clinical or product information.",
        "Evaluate job applications and communicate with candidates about recruitment.",
        "Send newsletters and company updates you have subscribed to.",
        "Receive, assess and report product-safety information (pharmacovigilance) as required by the Egyptian Drug Authority.",
        "Maintain, secure and improve the performance of this website.",
        "Comply with legal, regulatory and audit obligations.",
      ],
    },
    {
      id: "adverse-events",
      title: "Adverse Event Reporting",
      paragraphs: [
        "As a pharmaceutical company, we are legally required to monitor the safety of our products. If you contact us with information about a side effect or adverse event related to a Medisave product, we will process that information — including relevant health details — for pharmacovigilance purposes and may share it with the Egyptian Drug Authority and other competent health authorities, as required by law.",
        "Where possible, reports are anonymized before being shared, and we retain them for the period mandated by pharmacovigilance regulations.",
      ],
    },
    {
      id: "sharing",
      title: "Sharing & Disclosure",
      paragraphs: [
        "We do not sell, rent or trade your personal data. We only share it when necessary and with appropriate safeguards:",
      ],
      list: [
        "With trusted service providers who host, maintain or support our website and communication tools, under confidentiality obligations.",
        "With regulatory and health authorities where required for product safety or legal compliance.",
        "With professional advisers, auditors or authorities when required by law, court order or to protect our legal rights.",
      ],
    },
    {
      id: "cookies",
      title: "Cookies & Analytics",
      paragraphs: [
        "This website may use essential cookies required for it to function correctly, as well as limited analytics to understand how visitors use our pages. Analytics data is aggregated and does not directly identify you.",
        "You can control or delete cookies through your browser settings at any time. Disabling certain cookies may affect how parts of the website work.",
      ],
    },
    {
      id: "data-security",
      title: "Data Security",
      paragraphs: [
        "We apply appropriate technical and organizational measures to protect your personal data against unauthorized access, loss, misuse or alteration. Access to personal data is restricted to authorized personnel who need it to perform their duties.",
        "While we work hard to protect your information, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.",
      ],
    },
    {
      id: "retention",
      title: "Data Retention",
      paragraphs: [
        "We retain personal data only for as long as necessary for the purposes described in this policy. Contact inquiries are kept for the time needed to resolve them, job applications are retained for up to 12 months for future opportunities unless you ask us to delete them sooner, and pharmacovigilance records are retained for the periods required by law.",
      ],
    },
    {
      id: "your-rights",
      title: "Your Rights",
      paragraphs: ["Subject to applicable law, you have the right to:"],
      list: [
        "Access the personal data we hold about you.",
        "Request correction of inaccurate or incomplete data.",
        "Request deletion of your data where it is no longer needed.",
        "Withdraw your consent, including unsubscribing from our newsletter at any time.",
        "Object to or request restriction of certain processing activities.",
      ],
      after: [
        "To exercise any of these rights, please contact us using the details below. We may need to verify your identity before responding.",
      ],
    },
    {
      id: "third-party-links",
      title: "Third-Party Links",
      paragraphs: [
        "Our website may contain links to external websites, including social media platforms. We are not responsible for the privacy practices or content of those sites, and we encourage you to review their privacy policies.",
      ],
    },
    {
      id: "changes",
      title: "Changes to This Policy",
      paragraphs: [
        "We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. The updated version will be posted on this page with a revised \"Last updated\" date.",
      ],
    },
  ],
};

export const termsOfService: LegalDocument = {
  kicker: "Website Usage",
  title: "Terms of",
  highlight: "Service",
  intro:
    "The terms and conditions that govern your access to and use of the Medisave Pharma website and its content.",
  lastUpdated: LAST_UPDATED,
  heroImage: "/images/about/facility.jpg",
  sections: [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      paragraphs: [
        `These Terms of Service ("Terms") govern your use of ${companyInfo.website} (the "Website"), operated by ${companyInfo.name}. By accessing or using the Website, you agree to be bound by these Terms. If you do not agree, please do not use the Website.`,
      ],
    },
    {
      id: "medical-disclaimer",
      title: "Medical Information Disclaimer",
      paragraphs: [
        "The content on this Website, including product descriptions, therapeutic categories, dosage information and articles, is provided for general informational purposes only and is primarily intended for healthcare professionals.",
        "It is not a substitute for professional medical advice, diagnosis or treatment. Always consult a qualified physician or pharmacist before starting, stopping or changing any medication. Never disregard professional medical advice or delay seeking it because of something you have read on this Website.",
        "Many of our products are prescription-only medicines and must be used only under the supervision of a licensed healthcare professional.",
      ],
    },
    {
      id: "use-of-website",
      title: "Use of the Website",
      paragraphs: ["You agree to use the Website only for lawful purposes. You must not:"],
      list: [
        "Use the Website in any way that violates applicable local or international laws or regulations.",
        "Submit false, misleading or impersonated information through our contact or job application forms.",
        "Attempt to gain unauthorized access to the Website, its servers or any connected systems.",
        "Upload or transmit viruses, malicious code or any material that could damage or disrupt the Website.",
        "Copy, scrape or harvest content or data from the Website by automated means without our written permission.",
      ],
    },
    {
      id: "product-information",
      title: "Product Information",
      paragraphs: [
        "We make reasonable efforts to keep product information accurate and up to date. However, product specifications, pack sizes, availability and approved indications may change and may vary by market. Product images are for illustration only.",
        "Information on this Website does not constitute an offer to sell, and product availability is subject to approval by the relevant regulatory authorities.",
      ],
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property",
      paragraphs: [
        `All content on this Website — including the Medisave name and logo, product names, trademarks, text, graphics, images and design — is the property of ${companyInfo.name} or its licensors and is protected by intellectual property laws.`,
        "You may view and print content for personal, non-commercial reference only. Any other reproduction, modification, distribution or public display without our prior written consent is prohibited.",
      ],
    },
    {
      id: "submissions",
      title: "Inquiries & Job Applications",
      paragraphs: [
        "When you submit an inquiry or job application through the Website, you confirm that the information you provide is accurate and that you have the right to share it. Submitting an application does not guarantee employment or an interview.",
        "The handling of any personal data you submit is described in our Privacy Policy.",
      ],
    },
    {
      id: "adverse-events",
      title: "Reporting Side Effects",
      paragraphs: [
        "If you experience a side effect or adverse reaction while using a Medisave product, please consult your healthcare provider immediately and report it to us through our contact channels or directly to the Egyptian Drug Authority's pharmacovigilance center. In a medical emergency, contact your local emergency services.",
      ],
    },
    {
      id: "third-party-links",
      title: "Third-Party Links",
      paragraphs: [
        "The Website may contain links to third-party websites for your convenience. We do not control and are not responsible for the content, policies or practices of any third-party website, and linking does not imply endorsement.",
      ],
    },
    {
      id: "liability",
      title: "Limitation of Liability",
      paragraphs: [
        "The Website and its content are provided on an \"as is\" and \"as available\" basis without warranties of any kind, express or implied. To the fullest extent permitted by law, Medisave Pharma shall not be liable for any direct, indirect, incidental or consequential damages arising from your use of, or inability to use, the Website or reliance on its content.",
        "We do not guarantee that the Website will be uninterrupted, error-free or free of viruses or other harmful components.",
      ],
    },
    {
      id: "governing-law",
      title: "Governing Law",
      paragraphs: [
        "These Terms are governed by and construed in accordance with the laws of the Arab Republic of Egypt. Any dispute arising from or relating to these Terms or the Website shall be subject to the exclusive jurisdiction of the competent courts of Cairo, Egypt.",
      ],
    },
    {
      id: "changes",
      title: "Changes to These Terms",
      paragraphs: [
        "We may revise these Terms at any time by updating this page. Changes take effect once posted, and your continued use of the Website after that constitutes acceptance of the revised Terms.",
      ],
    },
  ],
};
