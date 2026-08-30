"use client";

import React from "react";
import Link from "next/link";

export default function AdminRoutingPage() {
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
