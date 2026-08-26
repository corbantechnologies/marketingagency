"use client";

import React, { useState } from "react";

export function Services() {
  const [activeTab, setActiveTab] = useState<string>("all");

  const services = [
    {
      id: "paid-media",
      category: "acquisition",
      title: "Performance Paid Advertising",
      tagline: "High-ROAS Scaled Customer Acquisition",
      description:
        "We engineer high-efficiency ad campaigns across Meta, Google Search/Shopping, TikTok, YouTube, and LinkedIn. Our scientific media buying combines algorithmic bidding with deep creative testing.",
      metrics: "Average 4.8x ROAS across active client spend",
      deliverables: [
        "Full-funnel Meta & Google Ads management",
        "Algorithmic budget allocation & bid optimization",
        "Creative testing framework (50+ variations/mo)",
        "First-party server-side tracking (CAPI & GA4)",
      ],
      icon: (
        <svg className="w-5 h-5 text-[#581c87]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.25 2.25L15 6" />
        </svg>
      ),
    },
    {
      id: "seo-strategy",
      category: "acquisition",
      title: "Technical SEO & Organic Visibility",
      tagline: "Dominating High-Intent Search Queries",
      description:
        "Systematic organic growth built on technical integrity, programmatic content architecture, and authority link acquisition that delivers defensible, compounding traffic without ongoing ad costs.",
      metrics: "+280% Average Organic Inbound Pipeline",
      deliverables: [
        "Technical audit & Core Web Vitals optimization",
        "High-intent keyword taxonomy & competitor gap analysis",
        "Programmatic and editorial SEO content strategy",
        "High-authority editorial link acquisition",
      ],
      icon: (
        <svg className="w-5 h-5 text-[#581c87]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      ),
    },
    {
      id: "cro-funnels",
      category: "conversion",
      title: "Conversion Rate Optimization (CRO)",
      tagline: "Turning Existing Traffic Into Pure Revenue",
      description:
        "Every 0.5% increase in conversion rate compounds your marketing efficiency. We design, build, and multivariate-test custom landing pages and checkout flows to maximize revenue per visitor.",
      metrics: "+42% Average Conversion Lift",
      deliverables: [
        "Heatmap, session replay, and drop-off analysis",
        "Continuous A/B testing & hypothesis validation",
        "Checkout friction removal & one-click upsells",
        "Mobile-first responsive UX/UI optimization",
      ],
      icon: (
        <svg className="w-5 h-5 text-[#581c87]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
        </svg>
      ),
    },
    {
      id: "retention-lifecycle",
      category: "retention",
      title: "Lifecycle & Retention Automation",
      tagline: "Maximizing Customer Lifetime Value (LTV)",
      description:
        "Customer acquisition is only half the battle. We build automated email, SMS, and CRM retention engines that nurture leads, re-engage dormant buyers, and drive predictable repeat purchases.",
      metrics: "34% of Total Revenue Generated via Email/SMS",
      deliverables: [
        "Behavior-triggered multi-channel automations",
        "Predictive customer segmentation & RFM scoring",
        "High-converting promotional campaigns & newsletters",
        "VIP customer loyalty & subscription retention systems",
      ],
      icon: (
        <svg className="w-5 h-5 text-[#581c87]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      ),
    },
    {
      id: "creative-engine",
      category: "conversion",
      title: "Performance Creative & Content Studio",
      tagline: "Scroll-Stopping Visuals That Convert",
      description:
        "Creative is the new targeting. Our in-house creative strategists produce UGC, high-energy motion design, product demos, and direct-response ad copy engineered to lower CAC.",
      metrics: "3x Higher Click-Through Rates (CTR)",
      deliverables: [
        "Creator & influencer UGC production pipelines",
        "Direct-response video editing & dynamic motion design",
        "High-converting ad copywriting & hook variations",
        "Rapid weekly creative refresh and iteration cycles",
      ],
      icon: (
        <svg className="w-5 h-5 text-[#581c87]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
        </svg>
      ),
    },
    {
      id: "growth-web",
      category: "conversion",
      title: "High-Speed Landing Page Engineering",
      tagline: "Sub-Second Load Times & Frictionless UX",
      description:
        "We build blazing-fast landing pages, microsites, and custom funnels using modern web frameworks. Every millisecond shaved off load speed directly protects your paid advertising investment.",
      metrics: "<0.8s Average Page Speed & 100 SEO Score",
      deliverables: [
        "Custom Next.js & headless conversion landing pages",
        "Flawless tracking & multi-pixel server integration",
        "Dynamic content personalization based on UTM tags",
        "Frictionless lead capture & instant CRM sync",
      ],
      icon: (
        <svg className="w-5 h-5 text-[#581c87]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
        </svg>
      ),
    },
  ];

  const filteredServices =
    activeTab === "all"
      ? services
      : services.filter((s) => s.category === activeTab);

  return (
    <section id="services" className="bg-white py-16 md:py-24 border-b border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-purple-50 border border-purple-200 text-xs font-semibold text-[#581c87] mb-3">
              Full-Suite Growth Capabilities
            </div>
            <h2 className="text-xl font-semibold text-zinc-900 tracking-tight">
              Specialized Marketing Services Engineered for Predictable Scale
            </h2>
            <p className="text-base font-normal text-zinc-600 mt-2">
              We integrate media buying, technical optimization, creative strategy, and retention
              into a unified revenue generation machine.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="mt-6 md:mt-0 flex items-center gap-1.5 p-1 bg-zinc-50 border border-zinc-200 rounded self-start md:self-auto">
            {[
              { id: "all", label: "All Capabilities" },
              { id: "acquisition", label: "Acquisition" },
              { id: "conversion", label: "Conversion" },
              { id: "retention", label: "Retention" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-[#581c87] text-white shadow-xs"
                    : "text-zinc-600 hover:text-[#581c87]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="group bg-white border border-zinc-200 hover:border-[#581c87] rounded p-6 transition-all duration-200 shadow-xs hover:shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded bg-purple-50 border border-purple-100 flex items-center justify-center group-hover:bg-[#581c87]/10 transition-colors">
                    {service.icon}
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                    {service.category}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-zinc-900 group-hover:text-[#581c87] transition-colors mb-1">
                  {service.title}
                </h3>
                <p className="text-xs font-medium text-purple-900 mb-3">
                  {service.tagline}
                </p>
                <p className="text-sm font-normal text-zinc-600 leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Key Deliverables */}
                <div className="space-y-2 mb-6 pt-4 border-t border-zinc-100">
                  <div className="text-xs font-semibold text-zinc-800 mb-2">Core Deliverables:</div>
                  {service.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs font-normal text-zinc-600">
                      <svg className="w-3.5 h-3.5 text-[#581c87] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metric Callout */}
              <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded">
                  {service.metrics}
                </span>
                <a
                  href="#audit"
                  className="font-medium text-[#581c87] hover:text-[#4a1572] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Explore</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Callout banner */}
        <div className="mt-12 p-6 bg-zinc-50 border border-zinc-200 rounded flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-zinc-900">
              Need a tailored multi-channel strategy for your business?
            </div>
            <div className="text-xs font-normal text-zinc-600 mt-0.5">
              We audit your historical account data and deliver a bespoke 90-day growth roadmap.
            </div>
          </div>
          <a
            href="#audit"
            className="inline-flex items-center gap-2 bg-[#581c87] hover:bg-[#4a1572] text-white px-5 py-2.5 rounded text-sm font-semibold transition-colors shrink-0"
          >
            Request Bespoke Roadmap
          </a>
        </div>

      </div>
    </section>
  );
}
