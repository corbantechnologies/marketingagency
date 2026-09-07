import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { UseCasesContent } from "@/components/landing/UseCasesContent";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Omnichannel Messaging Across All Industries & Use Cases | LJK Marketing Agency",
  description:
    "Explore how retail, fintech, healthcare, education, logistics, hospitality, real estate, and technology enterprises use LJK's Bulk SMS and official Meta WhatsApp Cloud API to scale customer communication.",
  alternates: {
    canonical: "https://www.ljkmarketingagency.co.ke/use-cases",
  },
  openGraph: {
    title: "Omnichannel Messaging Across All Industries & Use Cases | LJK Marketing Agency",
    description:
      "Enterprise SMS, Meta WhatsApp Business Cloud API, and Developer REST API engineered for every industry and high-volume business model.",
    url: "https://www.ljkmarketingagency.co.ke/use-cases",
  },
};

export default function UseCasesPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <UseCasesContent />
      </main>
      <Footer />
    </div>
  );
}
