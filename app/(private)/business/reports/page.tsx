/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";

import {
  useFetchBroadcastMessages,
  useFetchBroadcastMessageStats,
} from "@/hooks/broadcastmessages/actions";
import { useFetchCampaigns } from "@/hooks/campaigns/actions";

export default function DeliveryReportsPage() {
  const [activeTab, setActiveTab] = useState<"messages" | "campaigns">("messages");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [operatorFilter, setOperatorFilter] = useState<string>("ALL");

  // React Queries
  const { data: statsData, isLoading: isLoadingStats } = useFetchBroadcastMessageStats();
  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    refetch: refetchMessages,
  } = useFetchBroadcastMessages({
    search: searchTerm || undefined,
    status: statusFilter !== "ALL" ? (statusFilter as any) : undefined,
    network_operator: operatorFilter !== "ALL" ? operatorFilter : undefined,
  });
  const { data: campaignsData, isLoading: isLoadingCampaigns } = useFetchCampaigns({
    search: searchTerm || undefined,
  });

  const messages = useMemo(() => {
    if (!messagesData) return [];
    return Array.isArray(messagesData) ? messagesData : (messagesData as any)?.results || [];
  }, [messagesData]);

  const campaigns = useMemo(() => {
    if (!campaignsData) return [];
    return Array.isArray(campaignsData) ? campaignsData : (campaignsData as any)?.results || [];
  }, [campaignsData]);

  const totalCount = statsData?.total_messages ?? messages.length;
  const deliveredCount = statsData?.delivered ?? 0;
  const sentCount = statsData?.sent ?? 0;
  const failedCount = statsData?.failed ?? 0;
  const deliveryRate = statsData?.delivery_rate_percent ?? 0;

  return (
    <div className="space-y-6 w-full max-w-none">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
            <Link href="/business/dashboard" className="hover:text-zinc-900">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-zinc-900 font-medium">Delivery Reports</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            Delivery Reports &amp; Dispatched Messages
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 mt-0.5">
            Real-time telecom handset delivery logs (DLR), carrier operator routing, and campaign telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => refetchMessages()}
            className="py-2 px-3 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-semibold rounded-lg border border-zinc-200 transition-colors shadow-2xs cursor-pointer inline-flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>
          <Link
            href="/business/sms/broadcast"
            className="py-2 px-3.5 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
          >
            + New Broadcast
          </Link>
        </div>
      </div>

      {/* 2. Live Telecom KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
            Total Messages Sent
          </div>
          <div className="text-2xl font-black text-zinc-900 mt-1">
            {isLoadingStats ? "..." : totalCount.toLocaleString()}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">All time across all campaigns</div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
            Delivered to Handset
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {isLoadingStats ? "..." : deliveredCount.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-700/80 mt-1">Verified DLR receipts</div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
            Carrier In-Flight / Sent
          </div>
          <div className="text-2xl font-black text-purple-700 mt-1">
            {isLoadingStats ? "..." : sentCount.toLocaleString()}
          </div>
          <div className="text-[11px] text-purple-700/80 mt-1">Awaiting carrier receipt</div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
            Delivery Success Rate
          </div>
          <div className="text-2xl font-black text-zinc-900 mt-1">
            {isLoadingStats ? "..." : `${deliveryRate}%`}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">
            Failed: {failedCount.toLocaleString()}
          </div>
        </div>
      </div>

      {/* 3. Main Data Container */}
      <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
        {/* View Switcher Tabs & Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("messages")}
              className={`py-1.5 px-3.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === "messages"
                  ? "bg-[#581c87] text-white shadow-xs"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              Per-Recipient Message Logs ({messages.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("campaigns")}
              className={`py-1.5 px-3.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeTab === "campaigns"
                  ? "bg-[#581c87] text-white shadow-xs"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              Campaign Broadcasts ({campaigns.length})
            </button>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                activeTab === "messages"
                  ? "Search by phone number, message text, or msg ID..."
                  : "Search campaigns by name or sender ID..."
              }
              className="w-full sm:w-64 px-3 py-1.5 rounded-lg border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#581c87]"
            />

            {activeTab === "messages" && (
              <>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-zinc-300 text-xs text-zinc-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#581c87] cursor-pointer"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="READ">Read (Blue Ticks)</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="SENT">Sent (In-Flight)</option>
                  <option value="QUEUED">Queued</option>
                  <option value="FAILED">Failed</option>
                </select>

                <select
                  value={operatorFilter}
                  onChange={(e) => setOperatorFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-zinc-300 text-xs text-zinc-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#581c87] cursor-pointer"
                >
                  <option value="ALL">All Channels</option>
                  <option value="WHATSAPP">WhatsApp Business</option>
                  <option value="SAFARICOM">Safaricom</option>
                  <option value="AIRTEL">Airtel</option>
                  <option value="TELKOM">Telkom</option>
                </select>
              </>
            )}
          </div>
        </div>

        {/* TAB 1: Individual Message DLR Logs */}
        {activeTab === "messages" && (
          <div>
            {isLoadingMessages ? (
              <div className="py-12 text-center text-xs text-zinc-500">
                Loading dispatched messages...
              </div>
            ) : messages.length === 0 ? (
              <div className="border border-zinc-100 rounded-lg p-10 text-center my-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-purple-50 text-[#581c87] flex items-center justify-center mb-3">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-zinc-900">No message logs found</h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1 mb-4">
                  Once you launch a bulk SMS broadcast or send messages via API, real-time DLR records will appear here.
                </p>
                <Link
                  href="/business/sms/broadcast"
                  className="inline-flex items-center gap-1.5 py-2 px-3.5 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs font-semibold rounded-md transition-colors"
                >
                  Launch a Broadcast &rarr;
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-600">
                  <thead className="bg-zinc-50 text-zinc-700 font-semibold border-b border-zinc-200">
                    <tr>
                      <th className="py-3 px-3">Recipient</th>
                      <th className="py-3 px-3">Rendered Message</th>
                      <th className="py-3 px-3">Sender ID</th>
                      <th className="py-3 px-3">Carrier</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Message ID</th>
                      <th className="py-3 px-3">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {messages.map((msg: any) => (
                      <tr key={msg.id || msg.reference} className="hover:bg-zinc-50/80 transition-colors">
                        <td className="py-3 px-3 font-medium text-zinc-900 whitespace-nowrap">
                          <div>{msg.contact_name || msg.phone_number}</div>
                          {msg.contact_name && (
                            <div className="text-[11px] font-mono text-zinc-400">{msg.phone_number}</div>
                          )}
                        </td>

                        <td className="py-3 px-3 max-w-xs">
                          <p className="line-clamp-2 text-zinc-800 leading-relaxed font-sans">
                            {msg.rendered_message}
                          </p>
                          <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                            {msg.segments} {msg.segments === 1 ? "part" : "parts"} &bull; {msg.cost_credits} credit
                          </div>
                        </td>

                        <td className="py-3 px-3 font-mono font-semibold text-purple-900 whitespace-nowrap">
                          {msg.sender_id || "LJK_AGENCY"}
                        </td>

                        <td className="py-3 px-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              msg.network_operator === "WHATSAPP"
                                ? "bg-emerald-600 text-white border border-emerald-700"
                                : msg.network_operator === "SAFARICOM"
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : msg.network_operator === "AIRTEL"
                                ? "bg-red-50 text-red-800 border border-red-200"
                                : "bg-zinc-100 text-zinc-700 border border-zinc-200"
                            }`}
                          >
                            {msg.network_operator || "DETECTED"}
                          </span>
                        </td>

                        <td className="py-3 px-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              msg.status === "READ"
                                ? "bg-sky-50 text-sky-800 border border-sky-300"
                                : msg.status === "DELIVERED"
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : msg.status === "SENT"
                                ? "bg-purple-50 text-purple-800 border border-purple-200"
                                : msg.status === "QUEUED"
                                ? "bg-amber-50 text-amber-800 border border-amber-200"
                                : "bg-red-50 text-red-800 border border-red-200"
                            }`}
                          >
                            {msg.status === "READ" ? "READ ✓✓" : msg.status}
                          </span>
                        </td>

                        <td className="py-3 px-3 font-mono text-[11px] text-zinc-500 whitespace-nowrap">
                          {msg.message_id || "-"}
                        </td>

                        <td className="py-3 px-3 text-zinc-500 whitespace-nowrap text-[11px]">
                          {msg.created_at ? new Date(msg.created_at).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true }) : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Aggregated Campaigns */}
        {activeTab === "campaigns" && (
          <div>
            {isLoadingCampaigns ? (
              <div className="py-12 text-center text-xs text-zinc-500">Loading campaigns...</div>
            ) : campaigns.length === 0 ? (
              <div className="border border-zinc-100 rounded-lg p-10 text-center my-4">
                <h3 className="text-sm font-semibold text-zinc-900">No campaigns launched yet</h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1 mb-4">
                  When you create a broadcast campaign, the aggregated statistics will show here.
                </p>
                <Link
                  href="/business/sms/broadcast"
                  className="inline-flex items-center gap-1.5 py-2 px-3.5 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs font-semibold rounded-md transition-colors"
                >
                  Create Campaign &rarr;
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-600">
                  <thead className="bg-zinc-50 text-zinc-700 font-semibold border-b border-zinc-200">
                    <tr>
                      <th className="py-3 px-3">Campaign Title</th>
                      <th className="py-3 px-3">Sender ID</th>
                      <th className="py-3 px-3">Target Audience</th>
                      <th className="py-3 px-3">Recipients</th>
                      <th className="py-3 px-3">Total Cost</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Date Queued</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {campaigns.map((camp: any) => (
                      <tr key={camp.id || camp.reference} className="hover:bg-zinc-50/80 transition-colors">
                        <td className="py-3 px-3 font-semibold text-zinc-900">
                          <div>{camp.name}</div>
                          <div className="text-[10px] font-mono text-zinc-400">{camp.code}</div>
                        </td>

                        <td className="py-3 px-3 font-mono font-semibold text-purple-900">
                          {camp.sender_id}
                        </td>

                        <td className="py-3 px-3 text-zinc-600">
                          {camp.target_group_name ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 text-[11px]">
                              Group: {camp.target_group_name}
                            </span>
                          ) : (
                            <span className="text-[11px] text-zinc-500">All Subscribed Contacts</span>
                          )}
                        </td>

                        <td className="py-3 px-3 font-semibold text-zinc-900">
                          {camp.recipient_count?.toLocaleString()}
                        </td>

                        <td className="py-3 px-3 font-mono font-bold text-[#581c87]">
                          {camp.total_cost_credits?.toLocaleString()} Credits
                        </td>

                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              camp.status === "COMPLETED"
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : camp.status === "PROCESSING"
                                ? "bg-purple-50 text-purple-800 border border-purple-200"
                                : camp.status === "QUEUED"
                                ? "bg-amber-50 text-amber-800 border border-amber-200"
                                : "bg-red-50 text-red-800 border border-red-200"
                            }`}
                          >
                            {camp.status}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-zinc-500 whitespace-nowrap text-[11px]">
                          {camp.created_at ? new Date(camp.created_at).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true }) : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
