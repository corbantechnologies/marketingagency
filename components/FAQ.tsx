"use client";

import React, { useState } from "react";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What makes LJK Marketing Agency different from standard agencies?",
      answer:
        "Unlike traditional agencies that separate media buying from creative and conversion optimization, LJK operates as a fully integrated growth engineering unit. We pair senior media buyers with dedicated creative strategists, full-stack landing page engineers, and data analysts. You work directly with senior growth practitioners, not junior account managers.",
    },
    {
      question: "What minimum ad spend or revenue level do you work with?",
      answer:
        "We typically partner with brands spending at least $10,000/month on paid advertising or generating $500,000+ in annual gross revenue. This ensures there is sufficient historical conversion data and budget velocity to run statistically valid multivariate testing and unlock rapid scale.",
    },
    {
      question: "How long does onboarding take and when can we expect results?",
      answer:
        "Our onboarding sprint takes 7 to 10 business days. During this period, we complete your technical pixel audit, rebuild tracking infrastructure, analyze competitor creative, and deliver your first round of performance ads and landing page tests. First campaign optimizations typically demonstrate measurable CAC improvements within the first 21 to 30 days.",
    },
    {
      question: "Do you require long-term lock-in contracts?",
      answer:
        "No. We operate on initial 90-day growth sprints (the optimal timeline to audit, test, and scale systematically), followed by month-to-month retainers. We believe client retention should be earned through consistent ROI, not restrictive contractual lock-ins. Our 98.2% retention rate reflects that commitment.",
    },
    {
      question: "How does reporting and communication work?",
      answer:
        "Transparency is core to our partnership. You receive 24/7 access to a live real-time BI dashboard combining first-party analytics (GA4, Shopify, CRM) with platform spend data. In addition, we conduct weekly strategic sync calls and maintain a dedicated Slack/Teams communication channel for rapid turnarounds.",
    },
    {
      question: "Who owns the ad accounts, creative assets, and landing page code?",
      answer:
        "You do. 100%. All advertising accounts, custom tracking scripts, video creatives, ad copy, and landing page code developed by LJK belong entirely to your company. Even if we ever part ways, everything built remains your permanent asset.",
    },
  ];

  return (
    <section id="faq" className="bg-zinc-50 py-16 md:py-24 border-b border-zinc-100" aria-label="Frequently Asked Questions">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-purple-50 border border-purple-200 text-xs font-semibold text-[#581c87] mb-3">
            Common Questions
          </div>
          <h2 className="text-xl font-semibold text-zinc-900 tracking-tight">
            Frequently Asked Questions About Partnering With LJK
          </h2>
          <p className="text-base font-normal text-zinc-600 mt-2">
            Clear, transparent answers on our process, commercials, deliverables, and tech stack.
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
          Have a unique question not covered here?{" "}
          <a
            href="mailto:growth@ljkmarketingagency.com"
            className="text-[#581c87] font-semibold hover:underline"
          >
            Email our partner desk directly
          </a>
        </div>

      </div>
    </section>
  );
}
