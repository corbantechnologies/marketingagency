import React from "react";

export function CaseStudies() {
  const cases = [
    {
      client: "Aura Luxe Skincare",
      industry: "DTC E-Commerce & Beauty",
      highlightMetric: "+340% YoY Revenue",
      subMetric: "5.2x Blended ROAS on Meta & TikTok",
      challenge:
        "Struggling with rising customer acquisition costs (CAC) on Meta ads and poor second-purchase retention.",
      solution:
        "Rebuilt ad creative engine with UGC hooks, deployed a high-speed custom checkout landing page, and engineered a 6-tier Klaviyo retention flow.",
      results: [
        { label: "Revenue Scale", val: "$1.4M → $6.2M" },
        { label: "CAC Reduction", val: "-38.4%" },
        { label: "Repeat Purchase Rate", val: "34.6%" },
      ],
    },
    {
      client: "OmniFlow Cloud",
      industry: "B2B SaaS Enterprise",
      highlightMetric: "+215% Demo Pipeline",
      subMetric: "-45% Cost Per Qualified Opportunity",
      challenge:
        "High CPC on Google Search and low conversion rates on demo request pages with disjointed LinkedIn tracking.",
      solution:
        "Implemented high-intent competitor conquesting campaigns, streamlined the demo funnel to 2 steps, and launched personalized ABM ads.",
      results: [
        { label: "Qualified Pipeline", val: "$8.4M ARR" },
        { label: "Search CVR Lift", val: "+72%" },
        { label: "Sales Cycle", val: "-22 Days" },
      ],
    },
    {
      client: "Apex Wealth Partners",
      industry: "Financial & Advisory Services",
      highlightMetric: "$18.5M New AUM",
      subMetric: "14.2x Client Lifetime ROI",
      challenge:
        "Over-reliance on local referrals and weak organic presence for high-net-worth wealth management queries.",
      solution:
        "Engineered a nationwide programmatic SEO content hub, authoritative digital PR strategy, and local search dominance.",
      results: [
        { label: "Organic Inbound", val: "+410%" },
        { label: "Average Deal Value", val: "$450k AUM" },
        { label: "Rank 1 Keywords", val: "148 Terms" },
      ],
    },
  ];

  return (
    <section id="results" className="bg-zinc-50 py-16 md:py-24 border-b border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-purple-50 border border-purple-200 text-xs font-semibold text-[#581c87] mb-3">
            Proven Track Record
          </div>
          <h2 className="text-xl font-semibold text-zinc-900 tracking-tight">
            Measurable Case Studies Across High-Growth Sectors
          </h2>
          <p className="text-base font-normal text-zinc-600 mt-2">
            Real data from real campaigns. Discover how we helped ambitious founders and enterprise
            marketing directors unlock compounding growth.
          </p>
        </div>

        {/* Case Studies Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {cases.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-zinc-200 hover:border-[#581c87] rounded p-6 sm:p-7 transition-all duration-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                {/* Header info */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded">
                    {item.industry}
                  </span>
                  <span className="text-xs font-normal text-zinc-400">Verified Client</span>
                </div>

                <h3 className="text-base font-semibold text-zinc-900 mb-1">
                  {item.client}
                </h3>

                {/* Primary Metric Callout */}
                <div className="my-4 p-3.5 bg-purple-50/50 border border-purple-100 rounded">
                  <div className="text-xl font-semibold text-[#581c87]">
                    {item.highlightMetric}
                  </div>
                  <div className="text-xs font-medium text-zinc-600 mt-0.5">
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
          <a
            href="#audit"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#581c87] hover:text-[#4a1572] underline underline-offset-4"
          >
            <span>Want to see full un-redacted tear downs and performance logs? Request our portfolio</span>
            <span>→</span>
          </a>
        </div>

      </div>
    </section>
  );
}
