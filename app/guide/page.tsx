import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { GuideContent } from "@/components/landing/GuideContent";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Platform User Guide & Navigation | LJK Marketing Agency Kenya",
  description:
    "Complete step-by-step guide to navigating LJK Marketing Agency: registering custom Alphanumeric Sender IDs, uploading contacts, M-PESA billing top-ups, and launching Bulk SMS campaigns.",
  alternates: {
    canonical: "https://www.ljkmarketingagency.co.ke/guide",
  },
  openGraph: {
    title: "Platform User Guide & Navigation | LJK Marketing Agency Kenya",
    description:
      "Learn how to set up your business workspace, register custom Sender IDs, upload contacts, and launch bulk SMS broadcasts across Safaricom & Airtel.",
    url: "https://www.ljkmarketingagency.co.ke/guide",
  },
};

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <GuideContent />
      </main>
      <Footer />
    </div>
  );
}
