import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { FeaturesContent } from "@/components/landing/FeaturesContent";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Platform Features & Capabilities | LJK Marketing Agency Kenya",
  description:
    "Explore enterprise Bulk SMS, Alphanumeric Sender IDs, smart contact segmentation, M-PESA STK push billing, and developer REST APIs in Kenya.",
  alternates: {
    canonical: "https://www.ljkmarketingagency.co.ke/features",
  },
  openGraph: {
    title: "Platform Features & Capabilities | LJK Marketing Agency Kenya",
    description:
      "Direct carrier interconnects, sub-3s delivery latency, Alphanumeric Sender IDs, M-PESA billing, and developer REST APIs.",
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
