"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  useFetchAdminMessageInspector,
  useExportAdminMessageLogs,
} from "@/hooks/broadcastmessages/actions";
import { MessageInspectorItem } from "@/services/broadcastmessages";

export default function AdminInspectorPage() {
  const [search, setSearch] = useState("");
  const [operator, setOperator] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [selectedMessageForTrace, setSelectedMessageForTrace] = useState<MessageInspectorItem | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const { data, isLoading, isFetching, refetch } = useFetchAdminMessageInspector({
    search: search.trim(),
    operator: operator !== "ALL" ? operator : undefined,
    status: status !== "ALL" ? status : undefined,
    page,
    page_size: 25,
  });

  const exportCsv = useExportAdminMessageLogs();

  const vitals = data?.vitals;
  const pagination = data?.pagination;
  const results = data?.results || [];

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportCsv({
        search: search.trim(),
        operator: operator !== "ALL" ? operator : undefined,
        status: status !== "ALL" ? status : undefined,
      });
      toast.success("CSV export downloaded successfully.");
    } catch (err: any) {
      toast.error(err?.message || "Failed to export messages.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    refetch();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-100 text-cyan-800 border border-cyan-200">
              Deep DLR Diagnostics
            </span>
            <span className="text-xs text-zinc-500">Safaricom &bull; Airtel &bull; Telkom Trace</span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 mt-1">
            Global Message Inspector & Carrier DLR Search
          </h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            Real-time delivery verification across phone numbers, carrier IDs, and telco failure codes.
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

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#581c87] hover:bg-[#43146b] rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4 text-purple-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {isExporting ? "Exporting..." : "Export CSV"}
          </button>
        </div>
      </div>

      {/* KPI Vitals Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Messages Inspected */}
        <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
            <span>Total Inspected Messages</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-zinc-900 tracking-tight">
            {vitals?.total_messages ? vitals.total_messages.toLocaleString() : "0"}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500 pt-2 border-t border-zinc-100">
            <span>Saf: {vitals?.safaricom_count || 0}</span>
            <span>Airtel: {vitals?.airtel_count || 0}</span>
            <span>Telkom: {vitals?.telkom_count || 0}</span>
          </div>
        </div>

        {/* Delivery Rate */}
        <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
            <span>Handset Delivery Rate</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-emerald-600 tracking-tight">
            {vitals?.delivery_rate_pct?.toFixed(1) || "100.0"}%
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">Confirmed telco receipt</p>
        </div>

        {/* Delivered Messages */}
        <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
            <span>Delivered Handsets</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-zinc-900 tracking-tight">
            {vitals?.delivered_count ? vitals.delivered_count.toLocaleString() : "0"}
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">DLR acknowledged by telco</p>
        </div>

        {/* Failed / Bounced */}
        <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
            <span>Failed / Bounced</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-rose-600 tracking-tight">
            {vitals?.failed_count ?? 0}
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">Absent subscriber / DND</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs p-4 space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search phone number (07..., +254...), Carrier ID (ATXid_...), or Business name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-600 text-zinc-800"
            />
            <svg className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold text-white bg-[#581c87] hover:bg-[#43146b] rounded-lg shadow-xs cursor-pointer shrink-0"
          >
            Search Logs
          </button>
        </form>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-100 text-xs">
          {/* Operator Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-500 font-medium">Carrier:</span>
            {["ALL", "SAFARICOM", "AIRTEL", "TELKOM"].map((op) => (
              <button
                key={op}
                type="button"
                onClick={() => {
                  setOperator(op);
                  setPage(1);
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                  operator === op
                    ? "bg-[#581c87] text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                {op === "ALL" ? "All Networks" : op}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-500 font-medium">DLR Status:</span>
            {["ALL", "DELIVERED", "SENT", "FAILED"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => {
                  setStatus(st);
                  setPage(1);
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                  status === st
                    ? "bg-[#581c87] text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                {st === "ALL" ? "All Statuses" : st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Message Inspection Table */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                <th className="py-3 px-4">Recipient Phone</th>
                <th className="py-3 px-4">Network</th>
                <th className="py-3 px-4">Carrier ID</th>
                <th className="py-3 px-4">Sender ID / Business</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Delivered At</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs">
              {results.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-zinc-400">
                    No message logs found matching your search query.
                  </td>
                </tr>
              ) : (
                results.map((msg) => (
                  <tr key={msg.reference} className="hover:bg-zinc-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-zinc-900">
                      {msg.phone_number}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          msg.network_operator === "SAFARICOM"
                            ? "bg-emerald-100 text-emerald-800"
                            : msg.network_operator === "AIRTEL"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {msg.network_operator}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-zinc-500 text-[11px] truncate max-w-[140px]" title={msg.message_id}>
                      {msg.message_id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-zinc-900 font-mono text-[11px]">
                        [{msg.sender_id}]
                      </div>
                      <div className="text-[11px] text-zinc-500 truncate max-w-[150px]">
                        {msg.business_name}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          msg.status === "DELIVERED"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : msg.status === "FAILED" || msg.status === "UNDELIVERABLE"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {msg.status}
                      </span>
                      {msg.failure_reason && (
                        <div className="text-[10px] text-rose-600 mt-0.5 truncate max-w-[140px]" title={msg.failure_reason}>
                          {msg.failure_reason}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-zinc-400 text-[11px] whitespace-nowrap">
                      {msg.delivery_timestamp ? new Date(msg.delivery_timestamp).toLocaleString() : (msg.status === "DELIVERED" ? "Acknowledged" : "—")}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedMessageForTrace(msg)}
                        className="px-2.5 py-1 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-md border border-purple-200 transition-colors cursor-pointer"
                      >
                        Inspect Trace
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {pagination && pagination.total_pages > 1 && (
          <div className="px-5 py-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500 bg-zinc-50/50">
            <span>
              Page {pagination.page} of {pagination.total_pages} ({vitals?.total_messages} total messages)
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="px-3 py-1 bg-white border border-zinc-200 rounded-md hover:bg-zinc-100 disabled:opacity-50 cursor-pointer"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= pagination.total_pages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 bg-white border border-zinc-200 rounded-md hover:bg-zinc-100 disabled:opacity-50 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DLR Trace Modal Drawer */}
      {selectedMessageForTrace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-zinc-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                  <span>Carrier DLR Diagnostics Trace</span>
                </h3>
                <p className="text-xs text-zinc-500 font-mono mt-0.5">
                  Ref: {selectedMessageForTrace.reference} &bull; {selectedMessageForTrace.phone_number}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMessageForTrace(null)}
                className="text-zinc-400 hover:text-zinc-600 p-1 rounded-md"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Rendered Text snippet */}
              <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200 text-xs text-zinc-800">
                <div className="font-semibold text-zinc-500 text-[11px] mb-1">
                  Rendered Message Content ({selectedMessageForTrace.segments} segment(s), {selectedMessageForTrace.cost_credits} credit(s)):
                </div>
                <div className="font-mono bg-white p-2 rounded border border-zinc-200">
                  {selectedMessageForTrace.rendered_message}
                </div>
              </div>

              {/* 3-Step Delivery Timeline */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
                  Telco Handshake Lifecycle
                </div>

                <div className="space-y-2.5">
                  {selectedMessageForTrace.timeline.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-[10px] mt-0.5 ${
                        step.status === "COMPLETED"
                          ? "bg-emerald-600"
                          : step.status === "FAILED"
                          ? "bg-rose-600"
                          : "bg-amber-500"
                      }`}>
                        {step.status === "COMPLETED" ? "✓" : step.status === "FAILED" ? "✕" : "⏳"}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-zinc-900">{step.step}</span>
                          <span className="text-[11px] text-zinc-400">
                            {step.timestamp ? new Date(step.timestamp).toLocaleTimeString() : "—"}
                          </span>
                        </div>
                        <p className="text-zinc-500 text-[11px] mt-0.5 leading-relaxed">
                          {step.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metadata Details */}
              <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200 text-xs text-zinc-600 space-y-1">
                <div><strong>Carrier Message ID:</strong> <span className="font-mono">{selectedMessageForTrace.message_id}</span></div>
                <div><strong>Business:</strong> {selectedMessageForTrace.business_name} ({selectedMessageForTrace.business_reference})</div>
                <div><strong>Sender ID:</strong> {selectedMessageForTrace.sender_id}</div>
                {selectedMessageForTrace.failure_reason && (
                  <div className="text-rose-600"><strong>Telco Failure Reason:</strong> {selectedMessageForTrace.failure_reason}</div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedMessageForTrace(null)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg cursor-pointer"
                >
                  Close Trace
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
