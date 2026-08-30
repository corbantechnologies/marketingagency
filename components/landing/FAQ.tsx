"use client";

import React, { useState } from "react";
import Link from "next/link";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How do your Tier-1 direct SMS routes compare to standard aggregators?",
      answer:
        "Unlike low-cost grey routes that route messages through multiple overseas hops (leading to high failure rates and 10–45 minute delays), LJK connects directly with Tier-1 mobile network operators. This guarantees 99.4%+ handset delivery, sub-2.4 second transit latency, and immediate real-time DLR callbacks.",
    },
    {
      question: "How long does custom Alphanumeric Sender ID registration take?",
      answer:
        "Custom Sender ID registration (e.g. your exact brand name up to 11 characters) typically takes 24 to 48 business hours, depending on regional telecom regulator approvals. During registration, we provide instant access to high-priority shared alphanumeric routes so you can test campaigns immediately.",
    },
    {
      question: "Can we integrate your SMS & Email gateways into our own app via API?",
      answer:
        "Yes. We support standard HTTPS REST APIs with JSON payloads, as well as enterprise SMPP 3.4 protocols for high-throughput transactional OTPs and alerts. We provide SDKs and direct plugins for Shopify, WooCommerce, and CRM webhooks.",
    },
    {
      question: "How do you guarantee primary inbox placement for Email Marketing?",
      answer:
        "We execute a comprehensive 4-stage deliverability protocol: 1) Full DNS alignment (SPF, DKIM, DMARC, BIMI), 2) Automated list cleaning to eliminate spam traps and hard bounces, 3) Dedicated IP provisioning with progressive warming schedules, and 4) Engagement-based segmentation to keep sender reputation in the top 99th percentile.",
    },
    {
      question: "Do SMS credits expire, and what are the volume discount tiers?",
      answer:
        "Prepaid SMS credits never expire. As your monthly broadcast volume increases beyond 50,000, 200,000, and 1,000,000+ units, unit costs decrease significantly. Custom enterprise pricing and post-paid billing agreements are available for verified businesses.",
    },
    {
      question: "Are your messaging services compliant with TCPA, GDPR, and local carrier guidelines?",
      answer:
        "Yes. Our platform includes built-in automated opt-out (STOP) handling, suppression list management, time-zone sensitive dispatch windows (preventing late-night promotional SMS), and two-step opt-in verification tools to ensure full regulatory compliance.",
    },
  ];

  return (
    <section id="faq" className="bg-zinc-50 py-16 md:py-24 border-b border-zinc-100" aria-label="Frequently Asked Questions">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-purple-50 border border-purple-200 text-xs font-semibold text-[#581c87] mb-3">
            Messaging & Gateway FAQs
          </div>
          <h2 className="text-xl font-semibold text-zinc-900 tracking-tight">
            Frequently Asked Questions About Bulk SMS & Email Marketing
          </h2>
          <p className="text-base font-normal text-zinc-600 mt-2">
            Everything you need to know about carrier routes, sender IDs, deliverability, and developer APIs.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-zinc-200 rounded overflow-hidden shadow-xs transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 focus:outline-hidden hover:bg-zinc-50/70 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-semibold text-zinc-900">
                    {faq.question}
                  </span>
                  <span
                    className={`shrink-0 w-6 h-6 rounded bg-purple-50 border border-purple-200 text-[#581c87] flex items-center justify-center text-xs font-semibold transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-[#581c87] text-white border-[#581c87]" : ""
                    }`}
                  >
                    ↓
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm font-normal text-zinc-600 leading-relaxed border-t border-zinc-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom support line */}
        <div className="mt-8 text-center text-xs text-zinc-500">
          Need a custom carrier interconnect or high-volume SMPP quote?{" "}
          <Link
            href="/contact"
            className="text-[#581c87] font-semibold hover:underline"
          >
            Contact our telecom engineering desk
          </Link>
        </div>

      </div>
    </section>
  );
}
