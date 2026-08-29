"use client";

import React, { useState } from "react";

export function GrowthCalculator() {
  const [smsVolume, setSmsVolume] = useState<number>(25000);
  const [emailSubscribers, setEmailSubscribers] = useState<number>(15000);
  const [avgOrderValue, setAvgOrderValue] = useState<number>(85);
  const [campaignType, setCampaignType] = useState<"promotional" | "transactional" | "omnichannel">("omnichannel");

  // Realistic messaging performance benchmarks
  const rates = {
    promotional: { smsCtr: 0.112, emailCtr: 0.038, cvr: 0.042 },
    transactional: { smsCtr: 0.245, emailCtr: 0.085, cvr: 0.095 },
    omnichannel: { smsCtr: 0.148, emailCtr: 0.052, cvr: 0.064 },
  };

  const currentRate = rates[campaignType];

  const deliveredSms = Math.round(smsVolume * 0.994);
  const smsClicks = Math.round(deliveredSms * currentRate.smsCtr);
  const emailOpens = Math.round(emailSubscribers * 4 * 0.38); // 4 emails/month at 38% open
  const emailClicks = Math.round(emailOpens * currentRate.emailCtr);
  const totalClicks = smsClicks + emailClicks;
  const estimatedOrders = Math.round(totalClicks * currentRate.cvr);
  const projectedRevenue = estimatedOrders * avgOrderValue;

  return (
    <section id="calculator" className="bg-zinc-50 py-16 md:py-24 border-b border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-purple-50 border border-purple-200 text-xs font-semibold text-[#581c87] mb-3">
            Interactive Messaging Modeler
          </div>
          <h2 className="text-xl font-semibold text-zinc-900 tracking-tight">
            Calculate Your Bulk SMS & Email Campaign Revenue
          </h2>
          <p className="text-base font-normal text-zinc-600 mt-2">
            Estimate delivery volumes, click engagement, and projected sales output based on our Tier-1
            messaging delivery benchmarks.
          </p>
        </div>

        {/* Calculator Main Box */}
        <div className="max-w-4xl mx-auto bg-white border border-zinc-200 rounded p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Controls (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Campaign Type Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-2">
                  Campaign Objective
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { id: "omnichannel", label: "Omnichannel Flows" },
                    { id: "promotional", label: "Flash Sales & Promo" },
                    { id: "transactional", label: "Alerts & OTPs" },
                  ] as const).map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setCampaignType(tab.id)}
                      className={`py-2 px-3 rounded text-xs font-medium transition-colors border text-center ${
                        campaignType === tab.id
                          ? "bg-[#581c87] text-white border-[#581c87]"
                          : "bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Monthly SMS Volume Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                    Monthly Bulk SMS Volume
                  </label>
                  <span className="text-sm font-semibold text-[#581c87] bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200">
                    {smsVolume.toLocaleString()} SMS / mo
                  </span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="200000"
                  step="5000"
                  value={smsVolume}
                  onChange={(e) => setSmsVolume(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-200 rounded appearance-none cursor-pointer accent-[#581c87]"
                />
                <div className="flex justify-between text-[11px] text-zinc-400 mt-1">
                  <span>5,000</span>
                  <span>100,000</span>
                  <span>200,000+ SMS</span>
                </div>
              </div>

              {/* Email List Size Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                    Active Email Subscribers
                  </label>
                  <span className="text-sm font-semibold text-[#581c87] bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200">
                    {emailSubscribers.toLocaleString()} Contacts
                  </span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="100000"
                  step="2000"
                  value={emailSubscribers}
                  onChange={(e) => setEmailSubscribers(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-200 rounded appearance-none cursor-pointer accent-[#581c87]"
                />
                <div className="flex justify-between text-[11px] text-zinc-400 mt-1">
                  <span>2,000</span>
                  <span>50,000</span>
                  <span>100,000+</span>
                </div>
              </div>

              {/* Average Order Value Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                    Average Order Value (AOV) / Customer Value
                  </label>
                  <span className="text-sm font-semibold text-[#581c87] bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200">
                    ${avgOrderValue.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="500"
                  step="5"
                  value={avgOrderValue}
                  onChange={(e) => setAvgOrderValue(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-200 rounded appearance-none cursor-pointer accent-[#581c87]"
                />
                <div className="flex justify-between text-[11px] text-zinc-400 mt-1">
                  <span>$20</span>
                  <span>$250</span>
                  <span>$500+</span>
                </div>
              </div>

              <div className="p-3 bg-purple-50/60 border border-purple-100 rounded text-xs text-zinc-600">
                <span className="font-semibold text-[#581c87]">Carrier SLA:</span> Bulk SMS broadcast
                maintains 99.4% handset delivery with Tier-1 direct interconnects and instant DLR feedback.
              </div>
            </div>

            {/* Right Projected Results Card (5 Cols) */}
            <div className="lg:col-span-5 bg-purple-950 text-white rounded p-6 flex flex-col justify-between" style={{ backgroundColor: "#3b0764" }}>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-purple-300 mb-1">
                  Projected Revenue & Engagement
                </div>
                <div className="text-xs text-purple-200/80 mb-6">
                  Based on direct carrier delivery routes
                </div>

                <div className="space-y-4">
                  <div className="p-3 bg-white/5 border border-white/10 rounded">
                    <div className="text-xs font-normal text-purple-200">Estimated Monthly Revenue</div>
                    <div className="text-xl font-semibold text-white mt-0.5">
                      ${projectedRevenue.toLocaleString()}
                    </div>
                  </div>

                  <div className="p-3 bg-white/5 border border-white/10 rounded">
                    <div className="text-xs font-normal text-purple-200">Estimated Direct Orders</div>
                    <div className="text-xl font-semibold text-purple-300 mt-0.5">
                      {estimatedOrders.toLocaleString()} Conversions
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-white/5 border border-white/10 rounded">
                      <div className="text-purple-200">Delivered SMS</div>
                      <div className="text-base font-semibold text-white mt-0.5">
                        {deliveredSms.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-2.5 bg-white/5 border border-white/10 rounded">
                      <div className="text-purple-200">High-Intent Clicks</div>
                      <div className="text-base font-semibold text-emerald-400 mt-0.5">
                        {totalClicks.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <a
                  href="#audit"
                  className="w-full inline-flex items-center justify-center bg-white text-[#581c87] hover:bg-purple-50 py-2.5 px-4 rounded text-sm font-semibold transition-colors text-center"
                >
                  Claim 50 Free Test SMS Credits
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
