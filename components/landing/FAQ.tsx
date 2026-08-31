"use client";

import React, { useState } from "react";
import Link from "next/link";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How do your Tier-1 direct SMS routes compare to standard aggregators?",
      answer:
        "Unlike low-cost grey routes that route messages through multiple overseas hops (leading to high failure rates and 10–45 minute delays), LJK provides direct technical interconnects with Tier-1 carrier networks. This enables 99.4%+ platform dispatch reliability, sub-2.4 second transit latency, and immediate real-time DLR callbacks.",
    },
    {
      question: "How long does custom Alphanumeric Sender ID registration take?",
      answer:
        "Custom Sender ID registration (e.g. your verified brand name up to 11 characters) typically takes 24 to 72 business hours, subject to regulatory vetting and approval by the Communications Authority of Kenya (CAK) and telecom operators (Safaricom & Airtel). LJK operates strictly as your technical processing agent; approval decisions reside exclusively with the regulators and operators with zero agency liability for carrier rejections or vetting delays. You can immediately test campaigns via shared approved routes while vetting is underway.",
    },
    {
      question: "What is LJK's role regarding campaign content, spam, and carrier blocking?",
      answer:
        "LJK Marketing Agency is a technical software intermediary and Data Processor, not a communications carrier. Clients act as sole Data Controllers and are strictly responsible for maintaining verifiable opt-in consent from all recipients. If a client transmits unsolicited messages, spam, or misleading content resulting in carrier filtering, recipient complaints, or carrier blacklisting, LJK holds zero liability. In accordance with our Terms of Service, abusive accounts are subject to immediate suspension without refund.",
    },
    {
      question: "Can we integrate your SMS & Email gateways into our own app via API?",
      answer:
        "Yes. We support standard HTTPS REST APIs with JSON payloads, as well as enterprise SMPP 3.4 protocols for high-throughput transactional OTPs and alerts. We provide SDKs and direct connectors for Shopify, WooCommerce, and CRM webhooks.",
    },
    {
      question: "How do you ensure high deliverability for Email Marketing?",
      answer:
        "We execute a comprehensive 4-stage deliverability protocol: 1) Full DNS alignment (SPF, DKIM, DMARC), 2) Automated list hygiene to eliminate invalid addresses, 3) Dedicated IP provisioning with progressive warming schedules, and 4) Behavioral segmentation to keep sender domain health in top standing.",
    },
    {
      question: "Do SMS credits expire, and what are the volume discount tiers?",
      answer:
        "Prepaid SMS credits loaded into your active account ledger do not expire. As your monthly broadcast volume increases beyond 50,000, 200,000, and 1,000,000+ units, wholesale unit rates decrease. Custom enterprise volume tiers and dedicated account support are available upon request.",
    },
    {
      question: "Are your services compliant with the Kenya Data Protection Act 2019?",
      answer:
        "Yes. LJK operates in strict compliance with the Kenya Data Protection Act 2019. We implement TLS 1.3 in transit and AES-256 encryption at rest. We never sell, rent, trade, or share client contact lists with third parties under any circumstance. Our platform includes automated opt-out (STOP) handling and compliant daytime dispatch controls.",
    },
  ];

  return (
    <section id="faq" className="bg-zinc-50 py-16 md:py-24 border-b border-zinc-100" aria-label="Frequently Asked Questions">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-purple-50 border border-purple-200 text-xs font-semibold text-[#581c87] mb-3">
            Messaging &amp; Gateway FAQs
          </div>
          <h2 className="text-xl font-semibold text-zinc-900 tracking-tight">
            Frequently Asked Questions About Bulk SMS &amp; Email Marketing
          </h2>
          <p className="text-base font-normal text-zinc-600 mt-2">
            Clear details on carrier routes, sender ID vetting, anti-spam policies, and technical intermediary terms.
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
          Have compliance questions or need enterprise routing details?{" "}
          <Link
            href="/contact"
            className="text-[#581c87] font-semibold hover:underline"
          >
            Contact our compliance &amp; engineering desk
          </Link>
        </div>

      </div>
    </section>
  );
}

export default FAQ;
