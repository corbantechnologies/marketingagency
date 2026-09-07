import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { DeveloperDocsContent } from "@/components/landing/DeveloperDocsContent";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Developer REST API Documentation & SDK Guides | LJK Marketing Agency",
  description:
    "Official developer documentation for LJK Marketing Agency. Dispatch high-speed Bulk SMS and Meta WhatsApp Business Cloud API messages with unified credit billing, Blue Ticks telemetry, and developer sandbox.",
  alternates: {
    canonical: "https://www.ljkmarketingagency.co.ke/docs",
  },
  openGraph: {
    title: "Developer REST API & SDK Reference | LJK Marketing Agency",
    description:
      "Integrate WhatsApp Business and Tier-1 Bulk SMS into your web, mobile, CRM, or core banking applications using LJK's REST API.",
    url: "https://www.ljkmarketingagency.co.ke/docs",
  },
};

export default function DeveloperDocsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <DeveloperDocsContent />
      </main>
      <Footer />
    </div>
  );
}
