"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  useFetchAdminRateCards,
  useSaveAdminRateCards,
  useSimulateRateMargins,
} from "@/hooks/plans/actions";

export default function AdminRateCardPage() {
  const { data, isLoading, isFetching, refetch } = useFetchAdminRateCards();
  const saveMutation = useSaveAdminRateCards();
  const simulateMutation = useSimulateRateMargins();

  // Benchmark form state
  const [safCost, setSafCost] = useState<number>(0.28);
  const [airCost, setAirCost] = useState<number>(0.25);
  const [telCost, setTelCost] = useState<number>(0.22);

  const [standardMarkup, setStandardMarkup] = useState<number>(180);
  const [volumeMarkup, setVolumeMarkup] = useState<number>(130);
  const [enterpriseMarkup, setEnterpriseMarkup] = useState<number>(90);

  // Simulation form state
  const [simVolume, setSimVolume] = useState<number>(50000);
  const [simRetailRate, setSimRetailRate] = useState<number>(0.80);
  const [simSafPct, setSimSafPct] = useState<number>(70);
  const [simAirPct, setSimAirPct] = useState<number>(25);
  const [simTelPct, setSimTelPct] = useState<number>(5);

  // Sync data from API into local form state
  useEffect(() => {
    if (data) {
      if (data.wholesale_benchmarks) {
        setSafCost(data.wholesale_benchmarks.safaricom_base_kes);
        setAirCost(data.wholesale_benchmarks.airtel_base_kes);
        setTelCost(data.wholesale_benchmarks.telkom_base_kes);
      }
      if (data.markup_targets) {
        setStandardMarkup(data.markup_targets.standard_markup_pct);
        setVolumeMarkup(data.markup_targets.volume_markup_pct);
        setEnterpriseMarkup(data.markup_targets.enterprise_markup_pct);
      }
    }
  }, [data]);

  // Compute live blended wholesale cost based on current inputs
  const blendedWholesale = Number(
    ((safCost * 0.70) + (airCost * 0.25) + (telCost * 0.05)).toFixed(4)
  );

  // Trigger initial simulation when data loads
  useEffect(() => {
    if (data) {
      simulateMutation.mutate({
        volume: simVolume,
        retail_rate_kes: simRetailRate,
        safaricom_pct: simSafPct,
        airtel_pct: simAirPct,
        telkom_pct: simTelPct,
      });
    }
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSaveBenchmarks = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveMutation.mutateAsync({
        wholesale: {
          safaricom_base_kes: safCost,
          airtel_base_kes: airCost,
          telkom_base_kes: telCost,
        },
        markup_targets: {
          standard_markup_pct: standardMarkup,
          volume_markup_pct: volumeMarkup,
          enterprise_markup_pct: enterpriseMarkup,
        },
      });
      toast.success("Carrier benchmarks & markup targets updated successfully!");
      refetch();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update benchmarks.");
    }
  };

  const handleSimulate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    simulateMutation.mutate({
      volume: simVolume,
      retail_rate_kes: simRetailRate,
      safaricom_pct: simSafPct,
      airtel_pct: simAirPct,
      telkom_pct: simTelPct,
    });
  };

  const simResult = simulateMutation.data?.simulation;

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Telecom Commercial Intelligence
            </span>
            <span className="text-xs text-zinc-500">Advanta &bull; Africa&apos;s Talking Margins</span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 mt-1">
            Telecom Rate Cards & Auto-Markup Engine
          </h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            Configure wholesale carrier benchmarks, audit plan gross margins per operator, and model campaign profitability.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <svg
              className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-purple-600" : "text-zinc-500"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Safaricom Benchmark */}
        <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-medium text-zinc-500">
            <span>Safaricom Base Rate</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px]">
              70% TRAFFIC
            </span>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-zinc-900 tracking-tight">
            KES {safCost.toFixed(4)}
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">Wholesale buy cost per SMS</p>
        </div>

        {/* Airtel Benchmark */}
        <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-medium text-zinc-500">
            <span>Airtel Kenya Base</span>
            <span className="px-2 py-0.5 rounded-md bg-red-50 text-red-700 font-bold text-[10px]">
              25% TRAFFIC
            </span>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-zinc-900 tracking-tight">
            KES {airCost.toFixed(4)}
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">Wholesale buy cost per SMS</p>
        </div>

        {/* Telkom Benchmark */}
        <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-medium text-zinc-500">
            <span>Telkom Kenya Base</span>
            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold text-[10px]">
              5% TRAFFIC
            </span>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-zinc-900 tracking-tight">
            KES {telCost.toFixed(4)}
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">Wholesale buy cost per SMS</p>
        </div>

        {/* Blended Cost */}
        <div className="p-4 bg-gradient-to-br from-purple-900 to-indigo-950 text-white rounded-xl shadow-xs border border-purple-800">
          <div className="flex items-center justify-between text-xs font-medium text-purple-200">
            <span>Blended Wholesale Cost</span>
            <span className="px-2 py-0.5 rounded-md bg-purple-800/80 text-purple-100 font-bold text-[10px]">
              WEIGHTED
            </span>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-white tracking-tight">
            KES {blendedWholesale.toFixed(4)}
          </div>
          <p className="text-[11px] text-purple-300 mt-1">Avg wholesale floor across Kenya</p>
        </div>
      </div>

      {/* SECTION 1: Wholesale Carrier Benchmarks & Markup Config */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-zinc-900">Carrier Wholesale Benchmark Config</h2>
            <p className="text-xs text-zinc-500">
              Set the true per-SMS wholesale purchase prices contracted with Advanta SMS or Africa&apos;s Talking.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-zinc-200 text-zinc-700">
            Single-Model Compliant &bull; Cache Persisted
          </span>
        </div>

        <form onSubmit={handleSaveBenchmarks} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Safaricom Input */}
            <div className="space-y-1.5 p-4 rounded-xl border border-zinc-200 bg-zinc-50/40">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                  Safaricom Base (KES)
                </label>
                <span className="text-[11px] text-zinc-400 font-medium">Std: 0.2800</span>
              </div>
              <input
                type="number"
                step="0.0001"
                min="0.10"
                max="1.50"
                value={safCost}
                onChange={(e) => setSafCost(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm font-semibold rounded-lg border border-zinc-300 bg-white text-zinc-900 focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
              />
              <p className="text-[11px] text-zinc-500">Applied to ~70% of Kenyan mobile subscribers.</p>
            </div>

            {/* Airtel Input */}
            <div className="space-y-1.5 p-4 rounded-xl border border-zinc-200 bg-zinc-50/40">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                  Airtel Base (KES)
                </label>
                <span className="text-[11px] text-zinc-400 font-medium">Std: 0.2500</span>
              </div>
              <input
                type="number"
                step="0.0001"
                min="0.10"
                max="1.50"
                value={airCost}
                onChange={(e) => setAirCost(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm font-semibold rounded-lg border border-zinc-300 bg-white text-zinc-900 focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
              />
              <p className="text-[11px] text-zinc-500">Applied to ~25% of Kenyan mobile subscribers.</p>
            </div>

            {/* Telkom Input */}
            <div className="space-y-1.5 p-4 rounded-xl border border-zinc-200 bg-zinc-50/40">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                  Telkom Base (KES)
                </label>
                <span className="text-[11px] text-zinc-400 font-medium">Std: 0.2200</span>
              </div>
              <input
                type="number"
                step="0.0001"
                min="0.10"
                max="1.50"
                value={telCost}
                onChange={(e) => setTelCost(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm font-semibold rounded-lg border border-zinc-300 bg-white text-zinc-900 focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
              />
              <p className="text-[11px] text-zinc-500">Applied to ~5% of Kenyan mobile subscribers.</p>
            </div>
          </div>

          {/* Markup Targets */}
          <div className="border-t border-zinc-100 pt-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">
              Agency Target Markup Margins (%)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-zinc-600 block mb-1">Standard SME Markup</label>
                <div className="relative">
                  <input
                    type="number"
                    min="10"
                    max="500"
                    value={standardMarkup}
                    onChange={(e) => setStandardMarkup(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm font-semibold rounded-lg border border-zinc-300 bg-white text-zinc-900 pr-8"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-zinc-400 font-bold">%</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-600 block mb-1">High-Volume Tier Markup</label>
                <div className="relative">
                  <input
                    type="number"
                    min="10"
                    max="500"
                    value={volumeMarkup}
                    onChange={(e) => setVolumeMarkup(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm font-semibold rounded-lg border border-zinc-300 bg-white text-zinc-900 pr-8"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-zinc-400 font-bold">%</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-600 block mb-1">Enterprise Tier Markup</label>
                <div className="relative">
                  <input
                    type="number"
                    min="10"
                    max="500"
                    value={enterpriseMarkup}
                    onChange={(e) => setEnterpriseMarkup(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm font-semibold rounded-lg border border-zinc-300 bg-white text-zinc-900 pr-8"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-zinc-400 font-bold">%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setSafCost(0.28);
                setAirCost(0.25);
                setTelCost(0.22);
                setStandardMarkup(180);
                setVolumeMarkup(130);
                setEnterpriseMarkup(90);
              }}
              className="px-4 py-2 text-xs font-semibold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors cursor-pointer"
            >
              Reset to Recommended
            </button>
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-[#581c87] hover:bg-[#43146b] rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {saveMutation.isPending ? "Saving Benchmarks..." : "Save Benchmark Changes"}
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 2: Commercial Plan Margin Analysis Table */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-zinc-900">Commercial Plan Gross Margin Heatmap</h2>
            <p className="text-xs text-zinc-500">
              Audit actual gross margins across active commercial plans based on current wholesale carrier costs.
            </p>
          </div>
          <span className="text-xs text-zinc-400">
            {data?.plans?.length || 0} active plans evaluated
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-100/70 border-b border-zinc-200 text-zinc-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-6 py-3.5">Plan Details</th>
                <th className="px-4 py-3.5">Retail Rate</th>
                <th className="px-4 py-3.5">Safaricom Margin</th>
                <th className="px-4 py-3.5">Airtel Margin</th>
                <th className="px-4 py-3.5">Telkom Margin</th>
                <th className="px-4 py-3.5">Blended Margin</th>
                <th className="px-6 py-3.5 text-right">Profit / 10k SMS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-700">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-zinc-400">
                    Loading commercial plan margin analysis...
                  </td>
                </tr>
              ) : !data?.plans || data.plans.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-zinc-400">
                    No active commercial plans found.
                  </td>
                </tr>
              ) : (
                data.plans.map((p) => {
                  const getBadge = (pct: number) => {
                    if (pct >= 55) {
                      return "bg-emerald-50 text-emerald-700 border-emerald-200";
                    }
                    if (pct >= 35) {
                      return "bg-amber-50 text-amber-700 border-amber-200";
                    }
                    return "bg-red-50 text-red-700 border-red-200";
                  };

                  return (
                    <tr key={p.reference} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-zinc-900">{p.name}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-zinc-100 text-zinc-600">
                            {p.category}
                          </span>
                          <span className="text-[11px] text-zinc-400">
                            KES {p.price_kes.toLocaleString()}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-4 font-bold text-zinc-900">
                        KES {p.sms_rate_kes.toFixed(2)}
                      </td>

                      <td className="px-4 py-4">
                        <span className={`inline-block px-2 py-0.5 rounded-full border text-[11px] font-bold ${getBadge(p.safaricom_margin_pct)}`}>
                          {p.safaricom_margin_pct.toFixed(1)}%
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span className={`inline-block px-2 py-0.5 rounded-full border text-[11px] font-bold ${getBadge(p.airtel_margin_pct)}`}>
                          {p.airtel_margin_pct.toFixed(1)}%
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span className={`inline-block px-2 py-0.5 rounded-full border text-[11px] font-bold ${getBadge(p.telkom_margin_pct)}`}>
                          {p.telkom_margin_pct.toFixed(1)}%
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span className={`inline-block px-2.5 py-1 rounded-md border text-xs font-extrabold ${getBadge(p.blended_margin_pct)}`}>
                          {p.blended_margin_pct.toFixed(1)}%
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="font-extrabold text-emerald-600 text-sm">
                          +KES {p.profit_per_10k_kes.toLocaleString()}
                        </div>
                        <span className="text-[10px] text-zinc-400">Gross agency profit</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: Real-Time Campaign Profitability Simulator */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 bg-purple-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-zinc-900">Campaign Profitability Simulator</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                Live Sandbox
              </span>
            </div>
            <p className="text-xs text-zinc-500">
              Model client quotes, high-volume broadcasting deals, and expected agency gross margins before signing.
            </p>
          </div>
          <button
            onClick={() => handleSimulate()}
            disabled={simulateMutation.isPending}
            className="px-4 py-1.5 text-xs font-semibold text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors cursor-pointer"
          >
            {simulateMutation.isPending ? "Calculating..." : "Recalculate Profit"}
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls column */}
          <div className="lg:col-span-6 space-y-5">
            {/* Campaign Volume Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-zinc-700 mb-1">
                <span>Campaign SMS Volume</span>
                <span className="text-sm font-extrabold text-purple-900">
                  {simVolume.toLocaleString()} SMS
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="500000"
                step="5000"
                value={simVolume}
                onChange={(e) => {
                  setSimVolume(parseInt(e.target.value));
                }}
                className="w-full accent-purple-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-400 mt-1">
                <span>1K</span>
                <span>50K</span>
                <span>100K</span>
                <span>250K</span>
                <span>500K</span>
              </div>
            </div>

            {/* Retail Rate Input */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-zinc-700 mb-1">
                <span>Client Quoted Retail Rate (KES / SMS)</span>
                <span className="text-sm font-extrabold text-purple-900">
                  KES {simRetailRate.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0.40"
                max="2.00"
                step="0.05"
                value={simRetailRate}
                onChange={(e) => {
                  setSimRetailRate(parseFloat(e.target.value));
                }}
                className="w-full accent-purple-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-400 mt-1">
                <span>KES 0.40 (Heavy Tier)</span>
                <span>KES 0.80 (Standard)</span>
                <span>KES 2.00 (Ad-hoc)</span>
              </div>
            </div>

            {/* Network Distribution Sliders */}
            <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 block">
                Audience Telco Distribution
              </span>

              {/* Safaricom % */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-zinc-700 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> Safaricom Share
                  </span>
                  <span>{simSafPct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={simSafPct}
                  onChange={(e) => setSimSafPct(parseInt(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              {/* Airtel % */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-zinc-700 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500" /> Airtel Share
                  </span>
                  <span>{simAirPct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={simAirPct}
                  onChange={(e) => setSimAirPct(parseInt(e.target.value))}
                  className="w-full accent-red-600 cursor-pointer"
                />
              </div>

              {/* Telkom % */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-zinc-700 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" /> Telkom Share
                  </span>
                  <span>{simTelPct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={simTelPct}
                  onChange={(e) => setSimTelPct(parseInt(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div className="pt-2 text-right">
                <button
                  type="button"
                  onClick={() => {
                    setSimSafPct(70);
                    setSimAirPct(25);
                    setSimTelPct(5);
                  }}
                  className="text-[11px] text-purple-700 hover:underline font-semibold"
                >
                  Reset to 70% / 25% / 5%
                </button>
              </div>
            </div>
          </div>

          {/* Result outputs column */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
            {/* Primary Simulation Output Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white shadow-lg space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-700/60 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Simulation Results
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {simResult?.margin_pct ? simResult.margin_pct.toFixed(1) : "0.0"}% Net Margin
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-zinc-400 block">Total Invoiced (Revenue)</span>
                  <span className="text-xl font-extrabold text-white">
                    KES {simResult?.total_invoiced_kes ? simResult.total_invoiced_kes.toLocaleString() : "0"}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-zinc-400 block">Wholesale Carrier Cost</span>
                  <span className="text-xl font-extrabold text-red-400">
                    KES {simResult?.total_wholesale_cost_kes ? simResult.total_wholesale_cost_kes.toLocaleString() : "0"}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs text-emerald-300 font-bold block">Estimated Gross Profit</span>
                  <span className="text-3xl font-black text-emerald-400 tracking-tight">
                    KES {simResult?.gross_profit_kes ? simResult.gross_profit_kes.toLocaleString() : "0"}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-lg">
                  💰
                </div>
              </div>

              {/* Telco breakdown pills */}
              <div className="space-y-2 pt-2 border-t border-zinc-700/60 text-xs">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Wholesale Telco Cost Breakdown
                </span>

                <div className="flex items-center justify-between py-1">
                  <span className="flex items-center gap-1.5 text-zinc-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Safaricom ({simResult?.breakdown?.safaricom?.volume.toLocaleString() || 0} SMS @ {safCost.toFixed(2)})
                  </span>
                  <span className="font-bold text-zinc-200">
                    KES {simResult?.breakdown?.safaricom?.cost_kes ? simResult.breakdown.safaricom.cost_kes.toLocaleString() : "0"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="flex items-center gap-1.5 text-zinc-300">
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    Airtel ({simResult?.breakdown?.airtel?.volume.toLocaleString() || 0} SMS @ {airCost.toFixed(2)})
                  </span>
                  <span className="font-bold text-zinc-200">
                    KES {simResult?.breakdown?.airtel?.cost_kes ? simResult.breakdown.airtel.cost_kes.toLocaleString() : "0"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="flex items-center gap-1.5 text-zinc-300">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    Telkom ({simResult?.breakdown?.telkom?.volume.toLocaleString() || 0} SMS @ {telCost.toFixed(2)})
                  </span>
                  <span className="font-bold text-zinc-200">
                    KES {simResult?.breakdown?.telkom?.cost_kes ? simResult.breakdown.telkom.cost_kes.toLocaleString() : "0"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
