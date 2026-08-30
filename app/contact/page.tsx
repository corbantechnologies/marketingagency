import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { ContactContent } from "@/components/contact/ContactContent";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Contact Us & Support | LJK Marketing Agency Kenya",
  description:
    "Get in touch with LJK Marketing Agency in Nairobi. Inquire about Bulk SMS wholesale rates, custom Alphanumeric Sender IDs, developer APIs, or emergency NOC support.",
  alternates: {
    canonical: "https://www.ljkmarketingagency.co.ke/contact",
  },
  openGraph: {
    title: "Contact Us & Support | LJK Marketing Agency Kenya",
    description:
      "Direct carrier routes, M-PESA SMS top-ups, and developer API assistance. Average response time under 15 minutes.",
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
