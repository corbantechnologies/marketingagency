import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { UseCasesContent } from "@/components/landing/UseCasesContent";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Industry Solutions & Omnichannel Messaging | LJK Marketing Agency",
  description:
    "Discover how retail, fintech, healthcare, education, logistics, hospitality, real estate, and technology enterprises use LJK's Bulk SMS and official Meta WhatsApp Cloud API to scale customer communication.",
  alternates: {
    canonical: "https://www.ljkmarketingagency.co.ke/industries",
  },
};

export default function IndustriesPage() {
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
