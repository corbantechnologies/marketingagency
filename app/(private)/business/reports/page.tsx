"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function DeliveryReportsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  return (
    <div className="space-y-6 w-full max-w-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
            <Link href="/business/dashboard" className="hover:text-zinc-900">Dashboard</Link>
            <span>/</span>
            <span className="text-zinc-900 font-medium">Delivery Reports</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            Delivery Reports &amp; DLR Logs
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 mt-0.5">
            Real-time handset delivery logs, latency metrics, and carrier response codes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/business/sms/broadcast"
            className="py-2 px-3.5 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
          >
            + New Broadcast
          </Link>
        </div>
      </div>

      {/* Summary KPI Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Average Latency</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">1.8s</div>
          <div className="text-[11px] text-zinc-400 mt-1">Direct SMPP handoff</div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Carrier Success Rate</div>
          <div className="text-2xl font-bold text-zinc-900 mt-1">99.4%</div>
          <div className="text-[11px] text-zinc-400 mt-1">Safaricom &bull; Airtel Networks</div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Failed / Undelivered</div>
          <div className="text-2xl font-bold text-zinc-900 mt-1">0.6%</div>
          <div className="text-[11px] text-zinc-400 mt-1">Auto credit refund on failed DLR</div>
        </div>
      </div>

      {/* Log Table Container */}
      <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by phone number or message ID..."
            className="w-full sm:w-72 px-3.5 py-2 rounded-lg border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#581c87]"
          />

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 rounded-lg border border-zinc-300 text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#581c87] bg-white cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="DELIVERED">Delivered</option>
              <option value="PENDING">Pending Carrier</option>
              <option value="FAILED">Failed / Expired</option>
            </select>
          </div>
        </div>

        {/* Empty State / Logs Table */}
        <div className="border border-zinc-100 rounded-lg p-10 text-center my-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center mb-3">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-zinc-800">No message logs to display</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1 mb-4">
            Once you launch an SMS broadcast or send messages via API, detailed DLR logs will appear here.
          </p>
          <Link
            href="/business/sms/broadcast"
            className="inline-flex items-center gap-1.5 py-2 px-3.5 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs font-semibold rounded-md transition-colors"
          >
            Launch Test SMS
          </Link>
        </div>
      </div>
    </div>
  );
}
