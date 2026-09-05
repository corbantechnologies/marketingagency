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

  // Channel & Form State
  const [channel, setChannel] = useState<"SMS" | "WHATSAPP">("SMS");
  const [campaignName, setCampaignName] = useState("LJK Platform Announcement");
  const [senderId, setSenderId] = useState("LJK_AGENCY");
  const [targetAudience, setTargetAudience] = useState<"ALL_BUSINESSES" | "ALL_USERS" | "MANUAL">("ALL_BUSINESSES");
  const [manualNumbers, setManualNumbers] = useState("");
  const [messageBody, setMessageBody] = useState(
    "Hello {first_name}, this is an official announcement from LJK Marketing Agency."
  );

  // Live GSM 03.38 character and segment calculations (for SMS)
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
        channel,
        sender_id: channel === "WHATSAPP" ? "WHATSAPP" : (senderId.trim() || "LJK_AGENCY"),
        message_template: messageBody.trim(),
        target_audience: targetAudience,
        manual_numbers: targetAudience === "MANUAL" ? manualNumbers : undefined,
      },
      {
        onSuccess: (res) => {
          toast.success(res.message || `Agency ${channel === "WHATSAPP" ? "WhatsApp" : "SMS"} broadcast queued successfully!`);
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
      (c) => c.business_name === "LJK Marketing Agency" || c.sender_id === "LJK_AGENCY" || c.sender_id === "WHATSAPP"
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
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <div className={`inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
              channel === "WHATSAPP"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-purple-50 border-purple-200 text-[#581c87]"
            }`}>
              <span className={`w-2 h-2 rounded-full animate-pulse ${
                channel === "WHATSAPP" ? "bg-emerald-600" : "bg-[#581c87]"
              }`} />
              <span>
                {channel === "WHATSAPP"
                  ? "WhatsApp Business Cloud API (Meta Verified)"
                  : `Master Sender ID: ${senderId || "LJK_AGENCY"}`}
              </span>
              <span className="text-zinc-400">&bull;</span>
              <span className="capitalize">
                {channel === "WHATSAPP"
                  ? (metaData?.whatsapp_phone_number_id ? "Meta Live Cloud API" : "Meta Simulator Mode")
                  : (metaData?.gateway_provider === "africastalking" ? "Africa's Talking Live" : metaData?.gateway_provider || "Simulator")}
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 text-[10px] font-bold uppercase tracking-wider">
              Admin Master Bypass Active
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            LJK Omnichannel Agency Broadcast Console
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            Dispatch administrative broadcasts, critical system alerts, and direct corporate campaigns across Meta WhatsApp Business and Tier-1 Bulk SMS.
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
            href="/admin/inspector"
            className="py-2 px-3.5 bg-zinc-800 hover:bg-zinc-900 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
          >
            Message Inspector
          </Link>
        </div>
      </div>

      {/* 2. Main Composer & Live Handset Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Broadcast Composer */}
        <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-xl p-5 sm:p-7 shadow-xs space-y-5">
          {/* Channel Switcher Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-zinc-900">Compose Agency Broadcast</h2>
              <p className="text-xs text-zinc-500 mt-0.5 max-w-md">
                Choose delivery channel and target registered businesses, portal users, or external numbers.
              </p>
            </div>
            <div className="inline-flex items-center p-1 bg-zinc-100 rounded-xl border border-zinc-200 shrink-0 self-start sm:self-center shadow-2xs">
              <button
                type="button"
                onClick={() => setChannel("SMS")}
                title="Bulk SMS Gateway (1 Credit / SMS)"
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  channel === "SMS"
                    ? "bg-white text-purple-950 shadow-xs border border-purple-200/70"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50"
                }`}
              >
                <svg className="w-4 h-4 text-purple-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <span>Bulk SMS</span>
              </button>
              <button
                type="button"
                onClick={() => setChannel("WHATSAPP")}
                title="Meta WhatsApp Cloud API (2 Credits / Message)"
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  channel === "WHATSAPP"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50"
                }`}
              >
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.301-.15-1.781-.879-2.057-.98-.276-.1-.477-.15-.678.15-.2.301-.777.98-.953 1.18-.176.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.896-.799-1.501-1.787-1.677-2.088-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.176.2-.301.301-.502.1-.201.05-.377-.025-.527-.075-.15-.678-1.634-.929-2.237-.244-.588-.493-.509-.678-.518-.176-.009-.377-.009-.578-.009s-.527.075-.803.377c-.276.301-1.054 1.03-1.054 2.512s1.079 2.914 1.23 3.115c.15.201 2.122 3.24 5.141 4.544.718.31 1.279.496 1.716.635.722.23 1.379.197 1.898.12.578-.087 1.781-.728 2.032-1.431.251-.703.251-1.305.176-1.431-.075-.126-.276-.201-.577-.351z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.119.553 4.11 1.523 5.836L.055 23.518l5.882-1.446A11.936 11.936 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.854 0-3.593-.505-5.092-1.385l-.365-.215-3.784.931.947-3.69-.236-.376C2.518 15.736 2 13.929 2 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10z" />
                </svg>
                <span>WhatsApp</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campaign Name */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                Broadcast Title / Internal Campaign Label
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

            {/* Sender ID / Channel & Target Audience Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  {channel === "WHATSAPP" ? "Dispatch Channel" : "Sender ID Header"}
                </label>
                {channel === "WHATSAPP" ? (
                  <div className="px-3.5 py-2.5 rounded-lg border border-emerald-300 bg-emerald-50/50 text-xs sm:text-sm font-semibold text-emerald-900 flex items-center justify-between">
                    <span className="font-mono">WhatsApp Meta API</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-emerald-200/80 rounded text-emerald-900">
                      Verified
                    </span>
                  </div>
                ) : (
                  <input
                    type="text"
                    value={senderId}
                    onChange={(e) => setSenderId(e.target.value.toUpperCase())}
                    placeholder="LJK_AGENCY"
                    maxLength={11}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs sm:text-sm font-mono text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#581c87]"
                  />
                )}
                <p className="text-[11px] text-zinc-400 mt-1">
                  {channel === "WHATSAPP"
                    ? "Dispatched from official LJK Marketing Agency WhatsApp number."
                    : "Master alphanumeric telecom header (max 11 chars)"}
                </p>
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
                  Target count: <strong className="text-zinc-800 font-semibold">{recipientCountPreview}</strong>
                </p>
              </div>
            </div>

            {/* Manual Numbers textarea if selected */}
            {targetAudience === "MANUAL" && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                  Recipient Mobile Numbers (Comma or newline separated)
                </label>
                <textarea
                  rows={3}
                  value={manualNumbers}
                  onChange={(e) => setManualNumbers(e.target.value)}
                  placeholder="0712345678, 0798765432, 254711223344"
                  className="w-full p-3 rounded-lg border border-zinc-300 font-mono text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#581c87]"
                />
                <p className="text-[11px] text-zinc-400">
                  Accepts Kenyan formats: 07XX, 01XX, or 2547XX. Automatically formatted for {channel === "WHATSAPP" ? "WhatsApp Cloud API" : "Tier-1 SMS"}.
                </p>
              </div>
            )}

            {/* Message Body & Dynamic Tags */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                  {channel === "WHATSAPP" ? "WhatsApp Message Template / Copy" : "SMS Message Body"}
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
                placeholder={channel === "WHATSAPP" ? "Type your official WhatsApp announcement..." : "Type your official SMS announcement..."}
                maxLength={channel === "WHATSAPP" ? 1024 : undefined}
                className="w-full p-3.5 rounded-lg border border-zinc-300 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#581c87] leading-relaxed"
                required
              />

              {/* Counter Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                {channel === "WHATSAPP" ? (
                  <div className="flex items-center gap-3 text-zinc-500">
                    <span>
                      Characters: <strong className="text-zinc-900 font-bold">{messageBody.length}</strong> / 1024
                    </span>
                    <span>&bull;</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Meta Cloud API Rich Format
                    </span>
                    <span>&bull;</span>
                    <span className="text-sky-600 font-mono text-[11px]">Real-time Blue Ticks Included</span>
                  </div>
                ) : (
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
                )}

                <span className="text-purple-700 font-semibold text-[11px]">
                  Admin Cost: 0.00 Credits (Bypass Enabled)
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3 border-t border-zinc-100">
              <button
                type="submit"
                disabled={broadcastMutation.isPending || recipientCountPreview === 0}
                className={`w-full py-3 px-4 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50 ${
                  channel === "WHATSAPP"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-[#581c87] hover:bg-[#4a1572]"
                }`}
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
                    <span>Dispatching {channel === "WHATSAPP" ? "WhatsApp" : "SMS"} Agency Broadcast...</span>
                  </>
                ) : (
                  <>
                    <span>
                      Dispatch {channel === "WHATSAPP" ? "WhatsApp" : "SMS"} Broadcast ({recipientCountPreview} Recipients)
                    </span>
                    <span>&rarr;</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column (5 cols): Dynamic Handset Mockup & Guidance */}
        <div className="lg:col-span-5 space-y-6">
          {/* Dynamic Handset Preview Card */}
          <div className="bg-zinc-900 text-white rounded-2xl p-5 shadow-lg border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-zinc-800 pb-3">
              <span className="font-semibold uppercase tracking-wider text-[10px]">
                {channel === "WHATSAPP" ? "Live WhatsApp Chat Preview" : "Live SMS Handset Preview"}
              </span>
              <span className="font-mono text-emerald-400">
                {channel === "WHATSAPP" ? "WhatsApp Business" : "4G LTE"}
              </span>
            </div>

            {/* Handset Mockup Screen */}
            {channel === "WHATSAPP" ? (
              <div className="bg-[#0b141a] rounded-xl overflow-hidden border border-zinc-800 shadow-md">
                {/* WhatsApp Chat Header */}
                <div className="bg-[#1f2c34] px-4 py-3 flex items-center gap-3 border-b border-[#2a3942]">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-xs">
                    LJK
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-zinc-100 truncate">LJK Marketing Agency</span>
                      <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-[10px] text-zinc-400">Official Business Account</span>
                  </div>
                </div>

                {/* WhatsApp Message Body */}
                <div className="p-4 space-y-3 bg-[radial-gradient(#1f2c34_1px,transparent_1px)] [background-size:16px_16px] min-h-48 flex flex-col justify-between">
                  <div className="bg-[#005c4b] text-zinc-100 rounded-xl rounded-tr-xs p-3.5 text-xs leading-relaxed shadow-sm border border-[#02735e] max-w-[90%] self-end">
                    <div>
                      {messageBody.replace("{first_name}", "Client").replace("{name}", "Valued Client") || (
                        <span className="text-zinc-300 italic">Type your WhatsApp announcement to preview...</span>
                      )}
                    </div>
                    <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-zinc-300">
                      <span>Just now</span>
                      {/* Blue Ticks */}
                      <span className="text-sky-400 font-bold">✓✓</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-zinc-400 text-center font-mono pt-2">
                    Dispatched via Meta WhatsApp Cloud API
                  </div>
                </div>
              </div>
            ) : (
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
            )}
          </div>

          {/* Administrative Notice Card */}
          <div className="bg-purple-50/60 border border-purple-200/80 rounded-xl p-5 text-xs space-y-2">
            <div className="flex items-center gap-2 text-[#581c87] font-bold">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Omnichannel Master Privileges</span>
            </div>
            <p className="text-zinc-600 leading-relaxed">
              Agency broadcasts are automatically anchored under the <strong>LJK Marketing Agency</strong> master tenant. You can freely switch between high-converting Meta WhatsApp Business messages and universal Tier-1 Bulk SMS without quota limitations.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Recent Agency Broadcasts Table */}
      <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-zinc-900">Recent Agency Broadcasts</h2>
            <p className="text-xs text-zinc-500">History of outbound agency notifications and omnichannel dispatches.</p>
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
                  <th className="py-2.5 px-2">Channel</th>
                  <th className="py-2.5 px-2">Sender ID / Origin</th>
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
                    <td className="py-3 px-2">
                      {camp.channel === "WHATSAPP" ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          WHATSAPP
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                          SMS
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-2 font-mono font-bold text-zinc-800">
                      {camp.channel === "WHATSAPP" ? "Meta Verified API" : (camp.sender_id || "LJK_AGENCY")}
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
