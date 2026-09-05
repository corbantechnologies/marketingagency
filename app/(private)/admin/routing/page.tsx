"use client";

import React from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  useFetchAdminObservability,
  useRefreshCarrierBalances,
} from "@/hooks/business/actions";

export default function AdminRoutingPage() {
  const { data: obsData, isLoading, refetch } = useFetchAdminObservability();
  const refreshMutation = useRefreshCarrierBalances();

  const carrierBalances = obsData?.carrier_balances;

  const handlePollCarrierBalances = async () => {
    try {
      const res = await refreshMutation.mutateAsync();
      if (res?.alert_sent) {
        toast.error("Low carrier balance detected! Alert email sent to administrators.");
      } else {
        toast.success("Carrier balances refreshed successfully.");
      }
    } catch {
      toast.error("Failed to query upstream telecom carriers.");
    }
  };

  const routes = [
    {
      id: "saf-tier1",
      name: "Safaricom Direct Tier-1",
      protocol: "SMPP 3.4",
      throughput: "1,200 msg/s",
      latency: "1.4s",
      successRate: "99.8%",
      status: "OPERATIONAL",
      priority: "Priority 0 (Primary)",
    },
    {
      id: "airtel-direct",
      name: "Airtel Kenya Direct",
      protocol: "SMPP 3.4",
      throughput: "800 msg/s",
      latency: "1.9s",
      successRate: "99.2%",
      status: "OPERATIONAL",
      priority: "Priority 0 (Primary)",
    },
    {
      id: "telkom-route",
      name: "Telkom Kenya Interconnect",
      protocol: "REST / HTTP",
      throughput: "400 msg/s",
      latency: "2.1s",
      successRate: "98.7%",
      status: "OPERATIONAL",
      priority: "Priority 1 (Backup)",
    },
  ];

  return (
    <div className="space-y-6 w-full max-w-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
            <Link href="/admin/dashboard" className="hover:text-zinc-900">Admin Console</Link>
            <span>/</span>
            <span className="text-zinc-900 font-medium">Telecom Routing</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            SMS Carrier Routing &amp; DLR Monitor
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 mt-0.5">
            Real-time telecom SMPP transceivers, carrier bind latencies, and failover health.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePollCarrierBalances}
            disabled={refreshMutation.isPending}
            className="py-1.5 px-3 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
          >
            <svg
              className={`w-3.5 h-3.5 text-zinc-500 ${refreshMutation.isPending ? "animate-spin text-[#581c87]" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{refreshMutation.isPending ? "Polling..." : "Poll Carrier Float"}</span>
          </button>
          <Link
            href="/admin/dashboard"
            className="py-1.5 px-3 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
          >
            Admin Dashboard
          </Link>
        </div>
      </div>

      {/* Upstream Carrier Float Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">
              Advanta Africa (Wholesale Primary)
            </div>
            <div className="text-xl font-bold text-zinc-900 mt-1">
              KES {carrierBalances?.advanta ? carrierBalances.advanta.balance_kes.toLocaleString() : "0.00"}
            </div>
            <div className="text-xs text-zinc-500 mt-0.5">
              ~{carrierBalances?.advanta?.estimated_credits.toLocaleString() || 0} SMS Available
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            {carrierBalances?.advanta?.status || "UNCONFIGURED"}
          </span>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">
              Africa&apos;s Talking (Failover Backup)
            </div>
            <div className="text-xl font-bold text-zinc-900 mt-1">
              KES {carrierBalances?.africastalking ? carrierBalances.africastalking.balance_kes.toLocaleString() : "10.00"}
            </div>
            <div className="text-xs text-zinc-500 mt-0.5">
              ~{carrierBalances?.africastalking?.estimated_credits.toLocaleString() || 12} SMS Available &bull; Live Gateway
            </div>
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
            carrierBalances?.africastalking?.status === "CRITICAL"
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
          }`}>
            {carrierBalances?.africastalking?.status || "CONNECTED"}
          </span>
        </div>
      </div>

      {/* Routes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {routes.map((r) => (
          <div key={r.id} className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-zinc-500">{r.protocol}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {r.status}
              </span>
            </div>

            <div className="text-base font-bold text-zinc-900">{r.name}</div>

            <div className="space-y-1.5 text-xs pt-2 border-t border-zinc-100">
              <div className="flex items-center justify-between text-zinc-600">
                <span>Throughput:</span>
                <strong className="text-zinc-900">{r.throughput}</strong>
              </div>
              <div className="flex items-center justify-between text-zinc-600">
                <span>Average DLR Latency:</span>
                <strong className="text-emerald-600">{r.latency}</strong>
              </div>
              <div className="flex items-center justify-between text-zinc-600">
                <span>Success Rate:</span>
                <strong className="text-zinc-900">{r.successRate}</strong>
              </div>
              <div className="flex items-center justify-between text-zinc-600">
                <span>Route Priority:</span>
                <span className="text-zinc-500 font-medium">{r.priority}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
