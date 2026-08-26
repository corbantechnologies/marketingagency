"use client";

import React, { useState } from "react";

export function GrowthCalculator() {
  const [monthlySpend, setMonthlySpend] = useState<number>(25000);
  const [avgOrderValue, setAvgOrderValue] = useState<number>(120);
  const [industry, setIndustry] = useState<"ecommerce" | "saas" | "services">("ecommerce");

  // Multiplier models based on historical client benchmark data
  const industryBenchmarks = {
    ecommerce: { roas: 4.8, conversionLift: 0.38, label: "DTC & E-Commerce" },
    saas: { roas: 5.4, conversionLift: 0.45, label: "B2B SaaS & Tech" },
    services: { roas: 4.2, conversionLift: 0.32, label: "Professional Services" },
  };

  const benchmark = industryBenchmarks[industry];
  const projectedRevenue = Math.round(monthlySpend * benchmark.roas);
  const projectedOrders = Math.round(projectedRevenue / avgOrderValue);
  const incrementalGain = Math.round(projectedRevenue * benchmark.conversionLift);

  return (
    <section id="calculator" className="bg-zinc-50 py-16 md:py-24 border-b border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-purple-50 border border-purple-200 text-xs font-semibold text-[#581c87] mb-3">
            Interactive Growth Modeler
          </div>
          <h2 className="text-xl font-semibold text-zinc-900 tracking-tight">
            Estimate Your Revenue Potential With LJK Growth Systems
          </h2>
          <p className="text-base font-normal text-zinc-600 mt-2">
            Simulate your monthly revenue output based on our client performance benchmarks across
            different verticals and budget tiers.
          </p>
        </div>

        {/* Calculator Main Box */}
        <div className="max-w-4xl mx-auto bg-white border border-zinc-200 rounded p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Controls (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Industry Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-2">
                  Select Your Business Model
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["ecommerce", "saas", "services"] as const).map((ind) => (
                    <button
                      key={ind}
                      type="button"
                      onClick={() => setIndustry(ind)}
                      className={`py-2 px-3 rounded text-xs font-medium transition-colors border text-center ${
                        industry === ind
                          ? "bg-[#581c87] text-white border-[#581c87]"
                          : "bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300"
                      }`}
                    >
                      {industryBenchmarks[ind].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Monthly Ad Spend Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                    Monthly Marketing / Ad Spend
                  </label>
                  <span className="text-sm font-semibold text-[#581c87] bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200">
                    ${monthlySpend.toLocaleString()}/mo
                  </span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="150000"
                  step="5000"
                  value={monthlySpend}
                  onChange={(e) => setMonthlySpend(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-200 rounded appearance-none cursor-pointer accent-[#581c87]"
                />
                <div className="flex justify-between text-[11px] text-zinc-400 mt-1">
                  <span>$5,000</span>
                  <span>$75,000</span>
                  <span>$150,000+</span>
                </div>
              </div>

              {/* Average Order Value / ACV Slider */}
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
                  min="30"
                  max="1000"
                  step="10"
                  value={avgOrderValue}
                  onChange={(e) => setAvgOrderValue(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-200 rounded appearance-none cursor-pointer accent-[#581c87]"
                />
                <div className="flex justify-between text-[11px] text-zinc-400 mt-1">
                  <span>$30</span>
                  <span>$500</span>
                  <span>$1,000+</span>
                </div>
              </div>

              <div className="p-3 bg-purple-50/60 border border-purple-100 rounded text-xs text-zinc-600">
                <span className="font-semibold text-[#581c87]">Methodology:</span> Models are based on
                aggregated performance of 120+ active campaigns managed by LJK over the past 18 months.
              </div>
            </div>

            {/* Right Projected Results Card (5 Cols) */}
            <div className="lg:col-span-5 bg-purple-950 text-white rounded p-6 flex flex-col justify-between" style={{ backgroundColor: "#3b0764" }}>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-purple-300 mb-1">
                  Projected Performance Output
                </div>
                <div className="text-xs text-purple-200/80 mb-6">
                  Based on {benchmark.label} framework
                </div>

                <div className="space-y-4">
                  <div className="p-3 bg-white/5 border border-white/10 rounded">
                    <div className="text-xs font-normal text-purple-200">Estimated Monthly Revenue</div>
                    <div className="text-xl font-semibold text-white mt-0.5">
                      ${projectedRevenue.toLocaleString()}
                    </div>
                  </div>

                  <div className="p-3 bg-white/5 border border-white/10 rounded">
                    <div className="text-xs font-normal text-purple-200">Target Blended ROAS</div>
                    <div className="text-xl font-semibold text-purple-300 mt-0.5">
                      {benchmark.roas.toFixed(1)}x ROAS
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-white/5 border border-white/10 rounded">
                      <div className="text-purple-200">Est. Conversions</div>
                      <div className="text-base font-semibold text-white mt-0.5">
                        {projectedOrders.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-2.5 bg-white/5 border border-white/10 rounded">
                      <div className="text-purple-200">LJK Value Add</div>
                      <div className="text-base font-semibold text-emerald-400 mt-0.5">
                        +${incrementalGain.toLocaleString()}
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
                  Lock In This Growth Model
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
