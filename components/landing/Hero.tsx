"use client";

import React, { useState } from "react";

export function Hero() {
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleQuickAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmail) return;
    setSubmitted(true);
    setTimeout(() => {
      const auditSection = document.getElementById("audit");
      if (auditSection) {
        auditSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 600);
  };

  return (
    <section className="relative bg-white pt-10 pb-16 md:pt-16 md:pb-24 border-b border-zinc-100 overflow-hidden">
      {/* Subtle background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(#581c87 1px, transparent 1px), radial-gradient(#581c87 1px, #ffffff 1px)",
          backgroundSize: "24px 24px",
          backgroundPosition: "0 0, 12px 12px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Hero Content (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-purple-50 border border-purple-200 text-xs font-medium text-[#581c87] mb-6">
              <span className="w-2 h-2 rounded bg-[#581c87] inline-block animate-pulse" />
              <span>Enterprise Bulk SMS Gateway & High-Inbox Email Marketing</span>
            </div>

            {/* Main H1 Headline - strictly text-xl font-semibold */}
            <h1 className="text-xl font-semibold text-zinc-900 tracking-tight leading-snug mb-4">
              High-Deliverability Bulk SMS, Precision Email Marketing & Revenue Automation at Scale
            </h1>

            {/* Subheading / Value Proposition */}
            <p className="text-base font-normal text-zinc-600 leading-relaxed mb-8 max-w-xl">
              LJK Marketing Agency delivers Tier-1 direct telecom SMS routes, high-inbox email
              infrastructure, and automated customer communication systems that turn contacts into
              repeat revenue with sub-second delivery speed.
            </p>

            {/* Quick Audit Form */}
            <form onSubmit={handleQuickAudit} className="w-full max-w-lg mb-8">
              <div className="flex flex-col sm:flex-row gap-2.5 p-1.5 bg-zinc-50 border border-zinc-300 rounded shadow-xs">
                <input
                  type="text"
                  required
                  placeholder="Enter business email or website"
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 bg-white border border-zinc-200 rounded text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-[#581c87] focus:border-[#581c87]"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-[#581c87] hover:bg-[#4a1572] text-white px-5 py-2.5 rounded text-xs sm:text-sm font-semibold transition-colors shadow-xs shrink-0 cursor-pointer"
                >
                  <span>{submitted ? "Preparing Audit..." : "Get Free Deliverability Audit"}</span>
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-zinc-500 mt-2 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-[#581c87]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Includes full telecom carrier route benchmark & deliverability audit.
              </p>
            </form>

            {/* Quick Badges */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-zinc-600">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded bg-[#581c87]" /> Tier-1 Direct Telecom Routes
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded bg-[#581c87]" /> Custom Branded Sender ID
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded bg-[#581c87]" /> REST API & Webhook Ready
              </span>
            </div>
          </div>

          {/* Hero Interactive Messaging Metric Board (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-zinc-200 rounded p-6 shadow-xs relative">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-6">
                <div>
                  <h2 className="text-sm font-semibold text-zinc-900">
                    Live Messaging Gateway Status
                  </h2>
                  <p className="text-xs text-zinc-500">Real-time throughput & delivery health</p>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded bg-emerald-500 animate-pulse" />
                  100% Operational
                </span>
              </div>

              {/* 4 Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 bg-zinc-50 border border-zinc-100 rounded">
                  <div className="text-xs font-medium text-zinc-500 mb-1">SMS Delivery Rate</div>
                  <div className="text-xl font-semibold text-[#581c87]">99.4%</div>
                  <div className="text-xs font-medium text-emerald-600 mt-1 flex items-center gap-1">
                    <span>Direct Routes</span>
                    <span className="text-zinc-400 font-normal">· Instant DLR</span>
                  </div>
                </div>

                <div className="p-3.5 bg-zinc-50 border border-zinc-100 rounded">
                  <div className="text-xs font-medium text-zinc-500 mb-1">Email Inbox Placement</div>
                  <div className="text-xl font-semibold text-[#581c87]">98.9%</div>
                  <div className="text-xs font-medium text-emerald-600 mt-1 flex items-center gap-1">
                    <span>SPF / DKIM</span>
                    <span className="text-zinc-400 font-normal">· Warm IPs</span>
                  </div>
                </div>

                <div className="p-3.5 bg-zinc-50 border border-zinc-100 rounded">
                  <div className="text-xs font-medium text-zinc-500 mb-1">Messages Dispatched</div>
                  <div className="text-xl font-semibold text-zinc-900">14.8M+</div>
                  <div className="text-xs font-medium text-zinc-500 mt-1">SMS & Email Campaigns</div>
                </div>

                <div className="p-3.5 bg-zinc-50 border border-zinc-100 rounded">
                  <div className="text-xs font-medium text-zinc-500 mb-1">Avg. Gateway Latency</div>
                  <div className="text-xl font-semibold text-zinc-900">&lt;2.4s</div>
                  <div className="text-xs font-medium text-zinc-500 mt-1">Ultra-Low Transit Time</div>
                </div>
              </div>

              {/* Live Status Highlight */}
              <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs">
                <span className="text-zinc-500 font-normal">Protocol: SMPP 3.4 / HTTPS REST</span>
                <span className="font-medium text-[#581c87]">Capacity: 50,000 SMS / min</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
