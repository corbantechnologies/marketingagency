import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { PricingContent } from "@/components/landing/PricingContent";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Pricing & Plans | LJK Marketing Agency Kenya",
  description:
    "Transparent Bulk SMS, Email Marketing & Messaging pricing plans in Kenya. Tier-1 direct Safaricom & Airtel carrier routes, M-PESA top-ups, and no expiring credits.",
  alternates: {
    canonical: "https://www.ljkmarketingagency.co.ke/pricing",
  },
  openGraph: {
    title: "Pricing & Plans | LJK Marketing Agency Kenya",
    description:
      "Wholesale Bulk SMS from KSh 0.28/SMS, M-PESA instant top-ups, custom Alphanumeric Sender IDs, and developer REST APIs.",
    url: "https://www.ljkmarketingagency.co.ke/pricing",
  },
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <PricingContent />
      </main>
      <Footer />
    </div>
  );
}