import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { PricingContent } from "@/components/landing/PricingContent";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "WhatsApp Marketing & Bulk SMS Pricing Kenya | Unified Credit Plans",
  description:
    "Transparent pricing for Meta WhatsApp Business broadcasts and Tier-1 Bulk SMS in Kenya. 1 Credit = 1 SMS, 2 Credits = 1 WhatsApp flyer. Instant M-PESA top-ups, no monthly expiry.",
  alternates: {
    canonical: "https://www.ljkmarketingagency.co.ke/pricing",
  },
  openGraph: {
    title: "WhatsApp Marketing & Bulk SMS Pricing Kenya | LJK Marketing Agency",
    description:
      "Send interactive WhatsApp flyers with CTA buttons and Tier-1 Bulk SMS from KSh 0.28/credit. Instant M-PESA wallet top-ups, verified Meta API, and real-time Blue Ticks.",
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