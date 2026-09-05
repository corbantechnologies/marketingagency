/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  useFetchAgencyBroadcastMetadata,
  useCreateAgencyBroadcast,
  useFetchCampaigns,
} from "@/hooks/campaigns/actions";
import { BaseSMSGateway } from "@/tools/sms";

export default function AdminBroadcastPage() {
  const { data: metaData, isLoading: isMetaLoading } = useFetchAgencyBroadcastMetadata();
  const { data: campaignsData, isLoading: isCampaignsLoading } = useFetchCampaigns({
    ordering: "-created_at",
  });
  const broadcastMutation = useCreateAgencyBroadcast();

  // Form State
  const [campaignName, setCampaignName] = useState("LJK Platform Announcement");
  const [senderId, setSenderId] = useState("LJK_AGENCY");
  const [targetAudience, setTargetAudience] = useState<"ALL_BUSINESSES" | "ALL_USERS" | "MANUAL">("ALL_BUSINESSES");
  const [manualNumbers, setManualNumbers] = useState("");
  const [messageBody, setMessageBody] = useState(
    "Hello {first_name}, this is an official announcement from LJK Marketing Agency."
  );

  // Live GSM 03.38 character and segment calculations
  const { charCount, segments, isUnicode } = useMemo(() => {
    return BaseSMSGateway.calculate_segments(messageBody);
  }, [messageBody]);

  // Audience Count Preview
  const recipientCountPreview = useMemo(() => {
    if (targetAudience === "ALL_BUSINESSES") {
      return metaData?.all_businesses_count ?? 0;
    }
    if (targetAudience === "ALL_USERS") {
      return metaData?.all_users_count ?? 0;
    }
    // Manual
    const nums = manualNumbers
      .split(/[,\n\r\t]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    return nums.length;
  }, [targetAudience, manualNumbers, metaData]);

  const handleInsertToken = (token: string) => {
    setMessageBody((prev) => `${prev} ${token}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!campaignName.trim()) {
      toast.error("Please enter a campaign title.");
      return;
    }
    if (!messageBody.trim()) {
      toast.error("Message body cannot be empty.");
      return;
    }
    if (targetAudience === "MANUAL" && recipientCountPreview === 0) {
      toast.error("Please enter at least one valid phone number.");
      return;
    }

    broadcastMutation.mutate(
      {
        name: campaignName.trim(),
        sender_id: senderId.trim() || "LJK_AGENCY",
        message_template: messageBody.trim(),
        target_audience: targetAudience,
        manual_numbers: targetAudience === "MANUAL" ? manualNumbers : undefined,
      },
      {
        onSuccess: (res) => {
          toast.success(res.message || "Agency broadcast queued successfully!");
          if (targetAudience === "MANUAL") {
            setManualNumbers("");
          }
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.detail || "Failed to dispatch agency broadcast.");
        },
      }
    );
  };

  const agencyCampaigns = useMemo(() => {
    if (!campaignsData) return [];
    return campaignsData.filter(
      (c) => c.business_name === "LJK Marketing Agency" || c.sender_id === "LJK_AGENCY"
    );
  }, [campaignsData]);

  const formatDate = (isoString?: string) => {
    if (!isoString) return "—";
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("en-KE", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6 w-full max-w-none">
      {/* 1. Header Ribbon */}
      <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
            <Link href="/admin/dashboard" className="hover:text-zinc-900">Admin Console</Link>
            <span>/</span>
            <span className="text-zinc-900 font-medium">Agency Broadcast</span>
          </div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-[11px] font-semibold text-[#581c87] mb-2">
            <span className="w-2 h-2 rounded-full bg-[#581c87] animate-pulse" />
            <span>Master Sender ID: {senderId || "LJK_AGENCY"}</span>
            <span className="text-zinc-400">&bull;</span>
            <span className="capitalize">
              Gateway: {metaData?.gateway_provider === "africastalking" ? "Africa's Talking Live" : metaData?.gateway_provider || "Simulator"}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            LJK Marketing Agency Broadcast Console
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            Dispatch administrative SMS blasts, system notifications, or direct corporate marketing campaigns as LJK Marketing.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/admin/dashboard"
            className="py-2 px-3.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-lg transition-colors"
          >
            Telemetry Overview
          </Link>
          <Link
            href="/admin/routing"
            className="py-2 px-3.5 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
          >
            Carrier Routes
          </Link>
        </div>
      </div>

      {/* 2. Main Composer & Live Handset Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Broadcast Composer */}
        <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-xl p-5 sm:p-7 shadow-xs space-y-5">
          <div>
            <h2 className="text-base font-bold text-zinc-900">Compose Agency SMS Blast</h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Target registered client businesses, portal users, or external leads.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campaign Name */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                Campaign Title / Internal Label
              </label>
              <input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="e.g. Scheduled System Upgrade Notice"
                className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#581c87]"
                required
              />
            </div>

            {/* Sender ID & Target Audience Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Sender ID Header
                </label>
                <input
                  type="text"
                  value={senderId}
                  onChange={(e) => setSenderId(e.target.value.toUpperCase())}
                  placeholder="LJK_AGENCY"
                  maxLength={11}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs sm:text-sm font-mono text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#581c87]"
                />
                <p className="text-[11px] text-zinc-400 mt-1">Master alphanumeric header (max 11 chars)</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Target Audience
                </label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs sm:text-sm text-zinc-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#581c87]"
                >
                  <option value="ALL_BUSINESSES">
                    All Active Business Contacts ({isMetaLoading ? "..." : metaData?.all_businesses_count ?? 0})
                  </option>
                  <option value="ALL_USERS">
                    All Portal User Accounts ({isMetaLoading ? "..." : metaData?.all_users_count ?? 0})
                  </option>
                  <option value="MANUAL">Manual Phone Numbers / CSV Paste</option>
                </select>
                <p className="text-[11px] text-zinc-400 mt-1">
                  Estimated recipients: <strong className="text-zinc-800 font-semibold">{recipientCountPreview}</strong>
                </p>
              </div>
            </div>

            {/* Manual Numbers textarea if selected */}
            {targetAudience === "MANUAL" && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                  Recipient Numbers (Comma or newline separated)
                </label>
                <textarea
                  rows={3}
                  value={manualNumbers}
                  onChange={(e) => setManualNumbers(e.target.value)}
                  placeholder="0712345678, 0798765432, 254711223344"
                  className="w-full p-3 rounded-lg border border-zinc-300 font-mono text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#581c87]"
                />
                <p className="text-[11px] text-zinc-400">
                  Enter Kenyan mobile numbers in 07XX, 01XX, or 2547XX format.
                </p>
              </div>
            )}

            {/* Message Body & Dynamic Tags */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                  Message Body
                </label>
                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-zinc-400">Insert tag:</span>
                  <button
                    type="button"
                    onClick={() => handleInsertToken("{first_name}")}
                    className="px-1.5 py-0.5 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-mono text-[10px] transition-colors cursor-pointer"
                  >
                    {"{first_name}"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertToken("{name}")}
                    className="px-1.5 py-0.5 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-mono text-[10px] transition-colors cursor-pointer"
                  >
                    {"{name}"}
                  </button>
                </div>
              </div>

              <textarea
                rows={5}
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                placeholder="Type your official announcement here..."
                className="w-full p-3.5 rounded-lg border border-zinc-300 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#581c87] leading-relaxed"
                required
              />

              {/* GSM Counter Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                <div className="flex items-center gap-3 text-zinc-500">
                  <span>
                    Characters: <strong className="text-zinc-900 font-bold">{charCount}</strong>
                  </span>
                  <span>&bull;</span>
                  <span>
                    Segments:{" "}
                    <strong className={`font-bold ${segments > 1 ? "text-amber-600" : "text-zinc-900"}`}>
                      {segments} SMS
                    </strong>
                  </span>
                  <span>&bull;</span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${isUnicode ? "bg-amber-100 text-amber-900" : "bg-zinc-100 text-zinc-600"}`}>
                    {isUnicode ? "Unicode (UCS-2)" : "GSM 03.38"}
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3 border-t border-zinc-100">
              <button
                type="submit"
                disabled={broadcastMutation.isPending || recipientCountPreview === 0}
                className="w-full py-3 px-4 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
              >
                {broadcastMutation.isPending ? (
                  <>
                    <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Dispatching Agency Broadcast...</span>
                  </>
                ) : (
                  <>
                    <span>Dispatch Agency Broadcast ({recipientCountPreview} Recipients)</span>
                    <span>&rarr;</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column (5 cols): Handset Mockup & Guidance */}
        <div className="lg:col-span-5 space-y-6">
          {/* Handset Preview Card */}
          <div className="bg-zinc-900 text-white rounded-2xl p-5 shadow-lg border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-zinc-800 pb-3">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Live Handset Preview</span>
              <span className="font-mono text-emerald-400">4G LTE</span>
            </div>

            {/* Handset Mockup Screen */}
            <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-800 space-y-3 min-h-48 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-400 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="font-mono font-bold text-white">{senderId || "LJK_AGENCY"}</span>
                  <span>&bull;</span>
                  <span>Now</span>
                </div>

                <div className="bg-zinc-800/90 text-zinc-100 rounded-2xl rounded-tl-xs p-3.5 text-xs leading-relaxed border border-zinc-700/50 shadow-inner">
                  {messageBody.replace("{first_name}", "Client").replace("{name}", "Valued Client") || (
                    <span className="text-zinc-500 italic">Type your message to see a live handset preview...</span>
                  )}
                </div>
              </div>

              <div className="text-[10px] text-zinc-500 text-center font-mono">
                Delivered via Africa&apos;s Talking Tier-1 SMSC
              </div>
            </div>
          </div>

          {/* Administrative Notice Card */}
          <div className="bg-purple-50/60 border border-purple-200/80 rounded-xl p-5 text-xs space-y-2">
            <div className="flex items-center gap-2 text-[#581c87] font-bold">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Agency Administrative Privileges</span>
            </div>
            <p className="text-zinc-600 leading-relaxed">
              Agency broadcasts are automatically anchored under the <strong>LJK Marketing Agency</strong> master account. Messages dispatch directly through your connected carrier transceivers with full DLR delivery receipts tracked in your admin console.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Recent Agency Broadcasts Table */}
      <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-zinc-900">Recent Agency Broadcasts</h2>
            <p className="text-xs text-zinc-500">History of outbound agency notifications and dispatches.</p>
          </div>
          <span className="text-xs font-mono font-semibold text-zinc-500">
            {agencyCampaigns.length} Dispatches
          </span>
        </div>

        {isCampaignsLoading ? (
          <div className="py-12 text-center text-xs text-zinc-400">Loading agency campaigns...</div>
        ) : agencyCampaigns.length > 0 ? (
          <div className="divide-y divide-zinc-100 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-zinc-400 font-bold uppercase tracking-wider border-b border-zinc-200 pb-2">
                  <th className="py-2.5 px-2">Campaign Title</th>
                  <th className="py-2.5 px-2">Sender ID</th>
                  <th className="py-2.5 px-2">Recipients</th>
                  <th className="py-2.5 px-2">Status</th>
                  <th className="py-2.5 px-2 text-right">Dispatched At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {agencyCampaigns.map((camp) => (
                  <tr key={camp.id || camp.reference} className="hover:bg-zinc-50/60 transition-colors">
                    <td className="py-3 px-2 font-semibold text-zinc-900">
                      <div>{camp.name}</div>
                      <div className="text-[11px] text-zinc-400 font-mono">Ref: {camp.reference || camp.code}</div>
                    </td>
                    <td className="py-3 px-2 font-mono font-bold text-zinc-800">
                      {camp.sender_id || "LJK_AGENCY"}
                    </td>
                    <td className="py-3 px-2 text-zinc-700 font-medium">
                      {camp.recipient_count} recipients
                    </td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        camp.status === "COMPLETED"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : camp.status === "PROCESSING"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-blue-50 text-blue-700 border border-blue-200"
                      }`}>
                        {camp.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right text-zinc-500 whitespace-nowrap">
                      {formatDate(camp.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-10 text-center text-xs text-zinc-400">
            No agency broadcasts dispatched yet. Use the composer above to send your first message.
          </div>
        )}
      </div>
    </div>
  );
}
