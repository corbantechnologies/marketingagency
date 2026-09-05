"use client";

import React, { useState } from "react";
import Link from "next/link";

export function GrowthCalculator() {
  const [currency, setCurrency] = useState<"KES" | "USD">("KES");
  const [whatsappVolume, setWhatsappVolume] = useState<number>(10000);
  const [smsVolume, setSmsVolume] = useState<number>(25000);
  const [emailSubscribers, setEmailSubscribers] = useState<number>(15000);
  const [avgOrderValue, setAvgOrderValue] = useState<number>(3500); // KES default
  const [campaignType, setCampaignType] = useState<"promotional" | "transactional" | "omnichannel">("omnichannel");

  // Approximate KES/USD exchange rate for clean dual representation
  const KES_TO_USD_RATE = 130;

  // Realistic verified Kenya telecom & Meta Cloud API benchmarks
  const rates = {
    promotional: {
      waOpen: 0.98,
      waCtr: 0.28,
      waCvr: 0.085,
      smsDelivery: 0.994,
      smsCtr: 0.118,
      smsCvr: 0.045,
      emailOpen: 0.38,
      emailCtr: 0.038,
      emailCvr: 0.024,
    },
    transactional: {
      waOpen: 0.995,
      waCtr: 0.42,
      waCvr: 0.125,
      smsDelivery: 0.998,
      smsCtr: 0.245,
      smsCvr: 0.095,
      emailOpen: 0.52,
      emailCtr: 0.082,
      emailCvr: 0.048,
    },
    omnichannel: {
      waOpen: 0.985,
      waCtr: 0.32,
      waCvr: 0.095,
      smsDelivery: 0.994,
      smsCtr: 0.148,
      smsCvr: 0.062,
      emailOpen: 0.42,
      emailCtr: 0.052,
      emailCvr: 0.034,
    },
  };

  const currentRate = rates[campaignType];

  // WhatsApp Funnel (Flagship channel)
  const deliveredWhatsApp = Math.round(whatsappVolume * currentRate.waOpen);
  const whatsappClicks = Math.round(deliveredWhatsApp * currentRate.waCtr);
  const whatsappOrders = Math.round(whatsappClicks * currentRate.waCvr);

  // SMS Funnel (Universal Fallback)
  const deliveredSms = Math.round(smsVolume * currentRate.smsDelivery);
  const smsClicks = Math.round(deliveredSms * currentRate.smsCtr);
  const smsOrders = Math.round(smsClicks * currentRate.smsCvr);

  // Email Funnel
  const emailOpens = Math.round(emailSubscribers * 4 * currentRate.emailOpen); // 4 sends / mo
  const emailClicks = Math.round(emailOpens * currentRate.emailCtr);
  const emailOrders = Math.round(emailClicks * currentRate.emailCvr);

  // Combined Totals
  const totalClicks = whatsappClicks + smsClicks + emailClicks;
  const estimatedOrders = whatsappOrders + smsOrders + emailOrders;
  const projectedRevenue = estimatedOrders * avgOrderValue;

  // Estimated Unified Wallet Broadcast Spend (KES)
  // WhatsApp: 2 credits/msg @ KSh 0.50 = KSh 1.00/msg
  // SMS: 1 credit/msg @ KSh 0.45 = KSh 0.45/msg
  const estimatedSpendKes = Math.round((whatsappVolume * 1.0) + (smsVolume * 0.45) + (emailSubscribers * 0.05));
  const estimatedSpend = currency === "KES" ? estimatedSpendKes : Math.round(estimatedSpendKes / KES_TO_USD_RATE);
  
  // Real ROI Multiplier (Revenue / Spend)
  const roiMultiplier = estimatedSpend > 0 ? (projectedRevenue / (currency === "KES" ? estimatedSpendKes : estimatedSpendKes / KES_TO_USD_RATE)).toFixed(1) : "0.0";

  const secondaryRevenueUsd = currency === "KES"
    ? Math.round(projectedRevenue / KES_TO_USD_RATE)
    : projectedRevenue;
  const secondaryRevenueKes = currency === "USD"
    ? Math.round(projectedRevenue * KES_TO_USD_RATE)
    : projectedRevenue;

  // Handle currency switch
  const handleCurrencyChange = (newCurr: "KES" | "USD") => {
    if (newCurr === currency) return;
    setCurrency(newCurr);
    if (newCurr === "USD") {
      setAvgOrderValue(Math.max(10, Math.round(avgOrderValue / KES_TO_USD_RATE)));
    } else {
      setAvgOrderValue(Math.max(500, Math.round(avgOrderValue * KES_TO_USD_RATE)));
    }
  };

  return (
    <section id="calculator" className="bg-zinc-50 py-16 md:py-24 border-b border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Interactive Omnichannel ROI Modeler</span>
          </div>
          <h2 className="text-xl font-semibold text-zinc-900 tracking-tight">
            Calculate Your WhatsApp & Bulk SMS Campaign Return
          </h2>
          <p className="text-base font-normal text-zinc-600 mt-2">
            Model real-world engagement, conversion volume, and gross revenue generated across Meta WhatsApp Cloud API and Tier-1 Bulk SMS.
          </p>
        </div>

        {/* Calculator Main Box */}
        <div className="max-w-5xl mx-auto bg-white border border-zinc-200 rounded-xl p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Controls (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Campaign Type & Currency Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-2">
                    Campaign Focus
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {([
                      { id: "omnichannel", label: "Omnichannel" },
                      { id: "promotional", label: "Flash Sales" },
                      { id: "transactional", label: "Alerts & OTP" },
                    ] as const).map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setCampaignType(tab.id)}
                        className={`py-1.5 px-2 rounded text-xs font-medium transition-colors border text-center cursor-pointer ${
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

                {/* Currency Switcher */}
                <div className="shrink-0 self-start sm:self-auto">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-2 text-left sm:text-right">
                    Currency
                  </label>
                  <div className="inline-flex p-0.5 bg-zinc-100 border border-zinc-200 rounded">
                    <button
                      type="button"
                      onClick={() => handleCurrencyChange("KES")}
                      className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                        currency === "KES"
                          ? "bg-white text-[#581c87] shadow-xs"
                          : "text-zinc-500 hover:text-zinc-800"
                      }`}
                    >
                      KES (KSh)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCurrencyChange("USD")}
                      className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                        currency === "USD"
                          ? "bg-white text-[#581c87] shadow-xs"
                          : "text-zinc-500 hover:text-zinc-800"
                      }`}
                    >
                      USD ($)
                    </button>
                  </div>
                </div>
              </div>

              {/* 1. Monthly WhatsApp Audience Slider (Hero Channel) */}
              <div className="p-3.5 rounded-lg bg-emerald-50/40 border border-emerald-200/80">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.301-.15-1.781-.879-2.057-.98-.276-.1-.477-.15-.678.15-.2.301-.777.98-.953 1.18-.176.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.896-.799-1.501-1.787-1.677-2.088-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.176.2-.301.301-.502.1-.201.05-.377-.025-.527-.075-.15-.678-1.634-.929-2.237-.244-.588-.493-.509-.678-.518-.176-.009-.377-.009-.578-.009s-.527.075-.803.377c-.276.301-1.054 1.03-1.054 2.512s1.079 2.914 1.23 3.115c.15.201 2.122 3.24 5.141 4.544.718.31 1.279.496 1.716.635.722.23 1.379.197 1.898.12.578-.087 1.781-.728 2.032-1.431.251-.703.251-1.305.176-1.431-.075-.126-.276-.201-.577-.351z" />
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.119.553 4.11 1.523 5.836L.055 23.518l5.882-1.446A11.936 11.936 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.854 0-3.593-.505-5.092-1.385l-.365-.215-3.784.931.947-3.69-.236-.376C2.518 15.736 2 13.929 2 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10z" />
                    </svg>
                    <label className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                      WhatsApp Audience Broadcasts
                    </label>
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-emerald-800 bg-white px-2.5 py-0.5 rounded border border-emerald-300">
                    {whatsappVolume.toLocaleString()} Messages / mo
                  </span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="100000"
                  step="2000"
                  value={whatsappVolume}
                  onChange={(e) => setWhatsappVolume(Number(e.target.value))}
                  className="w-full h-2 bg-emerald-200 rounded appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-[11px] text-emerald-700 mt-1">
                  <span>2,000</span>
                  <span>50,000</span>
                  <span>100,000+ WhatsApp</span>
                </div>
              </div>

              {/* 2. Monthly SMS Volume Slider */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                    Monthly Bulk SMS Volume (Universal Fallback)
                  </label>
                  <span className="text-xs sm:text-sm font-semibold text-[#581c87] bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200">
                    {smsVolume.toLocaleString()} SMS / mo
                  </span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="250000"
                  step="5000"
                  value={smsVolume}
                  onChange={(e) => setSmsVolume(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-200 rounded appearance-none cursor-pointer accent-[#581c87]"
                />
                <div className="flex justify-between text-[11px] text-zinc-400 mt-1">
                  <span>5,000</span>
                  <span>100,000</span>
                  <span>250,000+ SMS</span>
                </div>
              </div>

              {/* 3. Email List Size Slider */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                    Active Email Subscribers
                  </label>
                  <span className="text-xs sm:text-sm font-semibold text-[#581c87] bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200">
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

              {/* 4. Average Order Value Slider */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                    Average Order Value (AOV) / Sale Value
                  </label>
                  <div className="text-right">
                    <span className="text-xs sm:text-sm font-semibold text-[#581c87] bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200">
                      {currency === "KES" ? `KES ${avgOrderValue.toLocaleString()}` : `$${avgOrderValue.toLocaleString()}`}
                    </span>
                    {currency === "KES" && (
                      <span className="text-[11px] text-zinc-400 block mt-0.5">
                        (~${Math.round(avgOrderValue / KES_TO_USD_RATE)})
                      </span>
                    )}
                  </div>
                </div>
                <input
                  type="range"
                  min={currency === "KES" ? 500 : 10}
                  max={currency === "KES" ? 30000 : 250}
                  step={currency === "KES" ? 250 : 5}
                  value={avgOrderValue}
                  onChange={(e) => setAvgOrderValue(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-200 rounded appearance-none cursor-pointer accent-[#581c87]"
                />
                <div className="flex justify-between text-[11px] text-zinc-400 mt-1">
                  <span>{currency === "KES" ? "KES 500" : "$10"}</span>
                  <span>{currency === "KES" ? "KES 15,000" : "$125"}</span>
                  <span>{currency === "KES" ? "KES 30,000+" : "$250+"}</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-lg text-xs text-zinc-700 flex items-start gap-2">
                <span className="text-emerald-700 font-bold text-sm leading-none">✓</span>
                <div>
                  <strong className="text-emerald-950 font-semibold">Unified Wallet Economics:</strong> 1 Credit = 1 Plain SMS (KSh 0.45), 2 Credits = 1 WhatsApp Flyer (KSh 0.90–1.00). Credits never expire and draw seamlessly from one shared balance.
                </div>
              </div>
            </div>

            {/* Right Projected Results Card (5 Cols) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-purple-950 via-purple-900 to-zinc-950 text-white rounded-xl p-6 flex flex-col justify-between h-full shadow-lg border border-purple-800/40">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-purple-300 mb-1">
                  <span>Projected Campaign Output</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono text-[10px]">
                    {roiMultiplier}x Estimated ROI
                  </span>
                </div>
                <div className="text-xs text-purple-200/70 mb-5">
                  Blended WhatsApp + SMS + Email forecast
                </div>

                <div className="space-y-3.5">
                  {/* Revenue Card */}
                  <div className="p-3.5 bg-white/10 border border-white/15 rounded-lg backdrop-blur-xs">
                    <div className="text-xs font-medium text-purple-200">Estimated Incremental Revenue</div>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        {currency === "KES" ? `KES ${projectedRevenue.toLocaleString()}` : `$${projectedRevenue.toLocaleString()}`}
                      </span>
                    </div>
                    <span className="text-[11px] text-purple-300/80 block mt-0.5">
                      {currency === "KES" ? `(~ $${secondaryRevenueUsd.toLocaleString()} USD)` : `(~ KES ${secondaryRevenueKes.toLocaleString()})`}
                    </span>
                  </div>

                  {/* Orders Card */}
                  <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-purple-200">Total Projected Orders</span>
                      <span className="text-sm font-bold text-emerald-400">
                        {estimatedOrders.toLocaleString()} Conversions
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-1 flex justify-between">
                      <span>WhatsApp: {whatsappOrders.toLocaleString()}</span>
                      <span>SMS: {smsOrders.toLocaleString()}</span>
                      <span>Email: {emailOrders.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Clicks & Estimated Spend Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-white/5 border border-white/10 rounded-lg">
                      <div className="text-purple-200">High-Intent Clicks</div>
                      <div className="text-base font-bold text-white mt-0.5">
                        {totalClicks.toLocaleString()}
                      </div>
                      <span className="text-[10px] text-emerald-400 mt-0.5 block">
                        WA: {whatsappClicks.toLocaleString()} ({currentRate.waCtr * 100}% CTR)
                      </span>
                    </div>
                    <div className="p-2.5 bg-white/5 border border-white/10 rounded-lg">
                      <div className="text-purple-200">Est. Credit Spend</div>
                      <div className="text-base font-bold text-white mt-0.5">
                        {currency === "KES" ? `KES ${estimatedSpend.toLocaleString()}` : `$${estimatedSpend.toLocaleString()}`}
                      </div>
                      <span className="text-[10px] text-purple-300 mt-0.5 block">
                        Unified Wallet Cost
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 space-y-2">
                <Link
                  href="/pricing"
                  className="w-full inline-flex items-center justify-center bg-white text-[#581c87] hover:bg-purple-50 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold transition-colors text-center shadow-xs"
                >
                  View Unified Pricing Plans
                </Link>
                <div className="text-[10px] text-center text-purple-300/80">
                  Backed by direct carrier delivery reports and official Meta Blue Ticks.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GrowthCalculator;
