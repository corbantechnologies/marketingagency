import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { ContactContent } from "@/components/contact/ContactContent";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Contact Us & Omnichannel Support | LJK Marketing Agency Kenya",
  description:
    "Get in touch with LJK Marketing Agency in Nairobi. Inquire about Meta WhatsApp Business setup, Bulk SMS wholesale routes, custom Sender IDs, or developer APIs.",
  alternates: {
    canonical: "https://www.ljkmarketingagency.co.ke/contact",
  },
  openGraph: {
    title: "Contact Us & Omnichannel Support | LJK Marketing Agency Kenya",
    description:
      "Direct carrier SMS routes, Meta WhatsApp Cloud API onboarding, M-PESA top-ups, and developer API assistance in Nairobi.",
    url: "https://www.ljkmarketingagency.co.ke/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <ContactContent />
      </main>
      <Footer />
    </div>
  );
}
