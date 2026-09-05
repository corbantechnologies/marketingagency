import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { FeaturesContent } from "@/components/landing/FeaturesContent";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Meta WhatsApp Business API & SMS Gateway Features | LJK Marketing Agency",
  description:
    "Launch high-converting WhatsApp marketing campaigns with rich image flyers, interactive CTA buttons, and real-time Blue Ticks tracking, backed by Tier-1 Bulk SMS and developer APIs in Kenya.",
  alternates: {
    canonical: "https://www.ljkmarketingagency.co.ke/features",
  },
  openGraph: {
    title: "Meta WhatsApp Business API & SMS Gateway Features | LJK Marketing Agency",
    description:
      "Interactive WhatsApp flyer broadcasts, CTA buttons, real-time Blue Ticks, Tier-1 carrier SMS interconnects, and M-PESA billing.",
    url: "https://www.ljkmarketingagency.co.ke/features",
  },
};

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <FeaturesContent />
      </main>
      <Footer />
    </div>
  );
}
