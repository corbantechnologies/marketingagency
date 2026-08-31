"use client";

import React, { useState } from "react";
import Link from "next/link";

export function Services() {
  const [activeTab, setActiveTab] = useState<string>("all");

  const services = [
    {
      id: "bulk-sms",
      category: "messaging",
      title: "Enterprise Bulk SMS Gateway",
      tagline: "Direct Tier-1 Telecom Routing & 99.4% Delivery",
      description:
        "High-throughput SMS broadcasting for promotional flash sales, product alerts, and mission-critical transactional OTPs with custom branded alphanumeric Sender IDs and real-time delivery receipts (DLR).",
      metrics: "99.4% Delivery · <2.4s Latency",
      deliverables: [
        "Custom Alphanumeric Sender ID registration",
        "High-throughput dispatch (up to 50,000 SMS/min)",
        "Transactional OTP, billing & alert automation",
        "Live delivery reports (DLR) & failure analytics",
      ],
      icon: (
        <svg className="w-5 h-5 text-[#581c87]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
        </svg>
      ),
    },
    {
      id: "email-marketing",
      category: "messaging",
      title: "High-Inbox Email Marketing",
      tagline: "Dedicated IP Warming & Primary Tab Inboxing",
      description:
        "We build high-converting email newsletters, automated drip series, and dynamic behavioral campaigns. We handle complete domain authentication (SPF, DKIM, DMARC) and list cleaning to bypass spam filters.",
      metrics: "98.9% Primary Inbox Rate",
      deliverables: [
        "Dedicated IP setup, warmup & reputation monitoring",
        "High-converting visual template design & copywriting",
        "Dynamic personalization based on user purchasing habits",
        "Automated list hygiene & bounce rate suppression",
      ],
      icon: (
        <svg className="w-5 h-5 text-[#581c87]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      ),
    },
    {
      id: "lifecycle-automation",
      category: "automation",
      title: "Omnichannel Lifecycle & Retention Flows",
      tagline: "Triggered Workflows That Compound LTV",
      description:
        "Turn one-time buyers into loyal repeat customers. We configure automated multi-channel sequences combining SMS urgency with detailed email storytelling for cart recovery, post-purchase, and win-backs.",
      metrics: "+34% Automated Revenue",
      deliverables: [
        "Abandoned cart & browse recovery SMS/Email sequences",
        "Post-purchase onboarding & cross-sell triggers",
        "Predictive VIP customer churn prevention",
        "Automated anniversary, birthday & restock alerts",
      ],
      icon: (
        <svg className="w-5 h-5 text-[#581c87]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
      ),
    },
    {
      id: "api-integrations",
      category: "automation",
      title: "Developer SMS & Email APIs / SMPP",
      tagline: "Seamless Integration With Your Backend & CRM",
      description:
        "Connect our high-speed messaging infrastructure directly into your custom apps, e-commerce stores, ERPs, and databases using robust REST APIs, SMPP 3.4 protocols, and bidirectional webhook callbacks.",
      metrics: "<50ms API Latency",
      deliverables: [
        "REST API with comprehensive SDK documentation",
        "SMPP 3.4 server support for high-volume enterprise relays",
        "Instant delivery webhook payloads & status callbacks",
        "Shopify, WooCommerce, HubSpot & CRM 1-click connectors",
      ],
      icon: (
        <svg className="w-5 h-5 text-[#581c87]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
        </svg>
      ),
    },
    {
      id: "traffic-acquisition",
      category: "growth",
      title: "Subscriber Acquisition & Paid Ads",
      tagline: "Scaling Your Owned Customer Database",
      description:
        "Your messaging is only as profitable as your subscriber list. We run high-intent Meta and Google ad funnels engineered specifically to capture verified phone numbers and opt-in emails at the lowest cost per lead.",
      metrics: "Avg. KSh 45 / Opt-In Lead",
      deliverables: [
        "Meta & Google lead generation campaign management",
        "High-converting direct response ad creative",
        "Instant lead form sync to SMS and email databases",
        "TCPA & GDPR compliant two-step opt-in verification",
      ],
      icon: (
        <svg className="w-5 h-5 text-[#581c87]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.25 2.25L15 6" />
        </svg>
      ),
    },
    {
      id: "cro-optins",
      category: "growth",
      title: "Conversion Optimization & Opt-In Funnels",
      tagline: "Maximizing On-Site Contact Capture Rates",
      description:
        "We build gamified spin-to-win, two-tier discount popups, and friction-free checkout capture forms that turn anonymous website visitors into verified SMS and email subscribers.",
      metrics: "+3.8x Contact Capture Rate",
      deliverables: [
        "Exit-intent and scroll-triggered smart popups",
        "Phone number validation & auto-formatting scripts",
        "A/B testing of discount incentives and copy offers",
        "Sub-second load times with zero layout shift",
      ],
      icon: (
        <svg className="w-5 h-5 text-[#581c87]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
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
              Core Capabilities & Infrastructure
            </div>
            <h2 className="text-xl font-semibold text-zinc-900 tracking-tight">
              Enterprise Messaging & Full-Funnel Growth Solutions
            </h2>
            <p className="text-base font-normal text-zinc-600 mt-2">
              From direct carrier Bulk SMS routes and inbox-guaranteed email marketing to developer
              APIs and full-funnel customer acquisition.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="mt-6 md:mt-0 flex flex-wrap items-center gap-1.5 p-1 bg-zinc-50 border border-zinc-200 rounded self-start md:self-auto">
            {[
              { id: "all", label: "All Solutions" },
              { id: "messaging", label: "SMS & Email" },
              { id: "automation", label: "Automations & API" },
              { id: "growth", label: "Traffic & Opt-Ins" },
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="group bg-white border border-zinc-200 hover:border-[#581c87] rounded p-6 transition-all duration-200 shadow-xs hover:shadow-sm flex flex-col justify-between h-full"
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

                <h3 className="text-base font-semibold text-zinc-900 group-hover:text-[#581c87] transition-colors mb-1">
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
                  <div className="text-xs font-semibold text-zinc-800 mb-2">Key Specifications:</div>
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

              {/* Metric Callout & Action Link (Responsive, No Collision) */}
              <div className="pt-4 border-t border-zinc-100 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5 text-xs">
                <span className="font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded text-xs whitespace-nowrap">
                  {service.metrics}
                </span>
                <Link
                  href="/contact"
                  className="font-semibold text-[#581c87] hover:text-[#4a1572] inline-flex items-center gap-1 shrink-0 whitespace-nowrap group-hover:translate-x-0.5 transition-transform ml-auto sm:ml-0"
                >
                  <span>Request Setup</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Callout banner */}
        <div className="mt-12 p-6 bg-zinc-50 border border-zinc-200 rounded flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-zinc-900">
              Need custom Sender ID registration or high-volume SMPP gateway connectivity?
            </div>
            <div className="text-xs font-normal text-zinc-600 mt-0.5">
              Our telecom engineers set up your dedicated routes and domain warm-up in under 48 hours.
            </div>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 bg-[#581c87] hover:bg-[#4a1572] text-white px-5 py-2.5 rounded text-sm font-semibold transition-colors shrink-0 text-center w-full sm:w-auto"
          >
            Connect With Messaging Engineers
          </Link>
        </div>

      </div>
    </section>
  );
}

export default Services;
