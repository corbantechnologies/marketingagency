import React from "react";
import Link from "next/link";

export function CaseStudies() {
  const cases = [
    {
      client: "Nova Retail & DTC",
      industry: "E-Commerce Flash Sales",
      highlightMetric: "KES 2.85M in 4 Hours",
      subMetric: "(~$22,000 USD) · 99.4% SMS Handset Delivery on 185k Contacts",
      challenge:
        "Previous SMS provider suffered from delayed delivery queues (up to 45 min delay), causing flash sales to miss high-urgency buying windows.",
      solution:
        "Migrated to LJK Tier-1 direct Safaricom & Airtel carrier routes with custom Sender ID. Broadcasted 185,000 personalized SMS in under 6 minutes.",
      results: [
        { label: "Dispatch Speed", val: "5.8 Mins" },
        { label: "SMS CTR", val: "18.4%" },
        { label: "Campaign ROI", val: "14.2x" },
      ],
    },
    {
      client: "PayCore Digital",
      industry: "FinTech & Banking API",
      highlightMetric: "<1.6s OTP Delivery",
      subMetric: "99.98% Gateway SLA & Zero Failed Auth",
      challenge:
        "High user drop-off during 2FA signup and withdrawal verification due to slow third-party SMS aggregator routing.",
      solution:
        "Implemented LJK SMPP 3.4 low-latency transactional SMS gateway with multi-carrier failover routing and instant DLR webhooks.",
      results: [
        { label: "Avg Latency", val: "1.48s" },
        { label: "Drop-off Cut", val: "-42%" },
        { label: "Monthly OTPs", val: "1.2M+" },
      ],
    },
    {
      client: "Aura Skincare & Wellness",
      industry: "Omnichannel Lifecycle",
      highlightMetric: "38.2% of Store Revenue",
      subMetric: "+290% Increase in Repeat Buyer LTV",
      challenge:
        "Emails landing in Gmail Promotions tab with 12% open rates and no active SMS abandoned cart recovery.",
      solution:
        "Dedicated IP warmup, DMARC domain alignment, and 8-stage omnichannel SMS + Email automation flows.",
      results: [
        { label: "Inbox Open Rate", val: "44.6%" },
        { label: "Cart Recovery", val: "28.4%" },
        { label: "Repeat LTV", val: "+290%" },
      ],
    },
  ];

  return (
    <section id="results" className="bg-zinc-50 py-16 md:py-24 border-b border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-purple-50 border border-purple-200 text-xs font-semibold text-[#581c87] mb-3">
            Proven Performance Data
          </div>
          <h2 className="text-xl font-semibold text-zinc-900 tracking-tight">
            Verified Bulk SMS & Email Campaign Case Studies
          </h2>
          <p className="text-base font-normal text-zinc-600 mt-2">
            Real delivery telemetry and revenue data from enterprise SMS broadcasts, FinTech transactional
            gateways, and automated retention engines.
          </p>
        </div>

        {/* Case Studies Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {cases.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-zinc-200 hover:border-[#581c87] rounded p-6 sm:p-7 transition-all duration-200 shadow-xs flex flex-col justify-between h-full"
            >
              <div>
                {/* Header info */}
                <div className="flex items-center justify-between mb-3 gap-2">
                  <span className="text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded whitespace-nowrap">
                    {item.industry}
                  </span>
                  <span className="text-xs font-normal text-zinc-400 shrink-0">Carrier Verified</span>
                </div>

                <h3 className="text-base font-semibold text-zinc-900 mb-1">
                  {item.client}
                </h3>

                {/* Primary Metric Callout */}
                <div className="my-4 p-3.5 bg-purple-50/50 border border-purple-100 rounded">
                  <div className="text-xl font-semibold text-[#581c87]">
                    {item.highlightMetric}
                  </div>
                  <div className="text-xs font-medium text-zinc-600 mt-0.5 leading-relaxed">
                    {item.subMetric}
                  </div>
                </div>

                {/* Challenge & Solution */}
                <div className="space-y-3 text-xs text-zinc-600 mb-6">
                  <div>
                    <span className="font-semibold text-zinc-800">Challenge: </span>
                    <span>{item.challenge}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-[#581c87]">Solution: </span>
                    <span>{item.solution}</span>
                  </div>
                </div>
              </div>

              {/* 3 Metric Pills */}
              <div className="pt-4 border-t border-zinc-100">
                <div className="grid grid-cols-3 gap-2 text-center">
                  {item.results.map((res, rIdx) => (
                    <div key={rIdx} className="p-2 bg-zinc-50 border border-zinc-100 rounded">
                      <div className="text-xs font-semibold text-zinc-900">{res.val}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5 leading-tight">{res.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-12 text-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#581c87] hover:text-[#4a1572] underline underline-offset-4"
          >
            <span>Need high-volume enterprise SMS pricing or SMPP interconnect details? Request a route teardown</span>
            <span>→</span>
          </Link>
        </div>

      </div>
    </section>
  );
}

export default CaseStudies;
