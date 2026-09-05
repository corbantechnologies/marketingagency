import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { GuideContent } from "@/components/landing/GuideContent";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "WhatsApp Marketing & Bulk SMS Business Guide | LJK Marketing Agency",
  description:
    "Complete step-by-step guide to launching WhatsApp Business broadcasts with Meta Cloud API, designing rich flyer campaigns, tracking Blue Ticks, and sending Tier-1 Bulk SMS in Kenya.",
  alternates: {
    canonical: "https://www.ljkmarketingagency.co.ke/guide",
  },
  openGraph: {
    title: "WhatsApp Marketing & Bulk SMS Business Guide | LJK Marketing Agency",
    description:
      "Learn how to set up your business workspace, design interactive WhatsApp templates with CTA buttons, upload contacts, and launch bulk broadcasts across Kenya.",
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
