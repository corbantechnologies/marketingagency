/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useFetchBusinesses } from "@/hooks/business/actions";
import { useFetchBusinessWallets } from "@/hooks/businesswallets/actions";
import { useFetchContactGroups } from "@/hooks/contactgroups/actions";
import { useFetchContacts } from "@/hooks/contacts/actions";
import { useFetchCampaigns, useCreateCampaign } from "@/hooks/campaigns/actions";
import { useFetchMessageTemplates } from "@/hooks/messagetemplates/actions";
import { useFetchWhatsAppTemplates } from "@/hooks/broadcastmessages/actions";

interface ComposerFormProps {
  activeBusiness: any;
  wallet: any;
  groups: any[];
  allContacts: any[];
  recentCampaigns: any[];
  templates: any[];
  preselectedGroupRef: string | null;
  preselectedTemplateRef: string | null;
  preselectedChannel?: string | null;
}

function renderPreviewWithLinks(text: string) {
  if (!text) return null;
  const regex = /(https?:\/\/[^\s]+|wa\.me\/[^\s]+|www\.[^\s]+)/gi;
  const parts = text.split(regex);
  return parts.map((part, i) => {
    if (part && part.match(/^(https?:\/\/|wa\.me\/|www\.)/i)) {
      return (
        <span key={i} className="text-sky-300 underline font-medium break-all">
          {part}
        </span>
      );
    }
    return part;
  });
}

function formatTemplateForComposer(tName: string, rawText: string) {
  if (tName === "universal_business_promo") {
    return "Hello {first_name}, {business_name} has a special update for you: 50% discount on all services.\n\nVisit or shop at {website_url} to enjoy exclusive rates! Reply STOP to opt out.";
  }
  if (tName === "general_business_promo") {
    return "Hello {first_name}, {business_name} is excited to bring you an exclusive offer: 50% offer.\n\nVisit us today or shop online at {website_url} before 20th September to enjoy special rates! Reply STOP to opt out.";
  }
  if (tName === "order_status_update") {
    return "Hello {first_name}, your order #ORD-10023 has been confirmed and is now being prepared for dispatch. Thank you for your business!";
  }
  if (tName === "customer_order_dispatch") {
    return "Hello {first_name}, your order #ORD-10023 has been confirmed and dispatched. Track your delivery here: {website_url}";
  }
  return rawText
    .replace(/\{\{1\}\}/g, "{first_name}")
    .replace(/\{\{2\}\}/g, "{business_name}")
    .replace(/\{\{3\}\}/g, "Special Promotional Offer")
    .replace(/\{\{4\}\}/g, "{website_url}");
}

function BroadcastComposerForm({
  activeBusiness,
  wallet,
  groups,
  allContacts,
  recentCampaigns,
  templates,
  preselectedGroupRef,
  preselectedTemplateRef,
  preselectedChannel,
}: ComposerFormProps) {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const createCampaignMutation = useCreateCampaign();
  const { data: waTemplatesData } = useFetchWhatsAppTemplates("all");

  const waTemplates = useMemo(() => {
    if (!waTemplatesData) return [];
    if (Array.isArray(waTemplatesData)) return waTemplatesData;
    return waTemplatesData.templates || (waTemplatesData as any)?.results || [];
  }, [waTemplatesData]);

  const smsBalance = wallet?.sms_credit_balance ?? 0;

  // Initial values computed without effect
  const initialSenderId =
    activeBusiness?.sender_id && activeBusiness.sender_id_status === "APPROVED"
      ? activeBusiness.sender_id
      : "LJK_AGENCY";

  const initialGroupRef = useMemo(() => {
    if (preselectedGroupRef) {
      const match = groups.find((g) => g.reference === preselectedGroupRef);
      if (match) return match.reference;
    }
    return groups[0]?.reference || "";
  }, [preselectedGroupRef, groups]);

  // Default to WhatsApp unless explicitly instructed otherwise
  const initialChannel: "SMS" | "WHATSAPP" = useMemo(() => {
    if (preselectedChannel?.toUpperCase() === "SMS") return "SMS";
    return "WHATSAPP";
  }, [preselectedChannel]);

  const initialMessage = useMemo(() => {
    if (preselectedTemplateRef) {
      const smsMatch = templates.find((t) => t.reference === preselectedTemplateRef);
      if (smsMatch) return smsMatch.body;
      const waMatch = waTemplates.find((t: any) => t.name === preselectedTemplateRef);
      if (waMatch) {
        const bodyComp = waMatch.components?.find((c: any) => c.type === "BODY");
        if (bodyComp?.text) return bodyComp.text;
      }
    }
    return "";
  }, [preselectedTemplateRef, templates, waTemplates]);

  // Form state
  const [channel, setChannel] = useState<"SMS" | "WHATSAPP">(initialChannel);
  const [campaignName, setCampaignName] = useState("");
  const [senderId, setSenderId] = useState(initialSenderId);
  const [audienceMode, setAudienceMode] = useState<"group" | "all" | "manual">("group");
  const [selectedGroupRef, setSelectedGroupRef] = useState<string>(initialGroupRef);
  const [manualNumbers, setManualNumbers] = useState("");
  const [message, setMessage] = useState(initialMessage);
  const [selectedWaTemplateName, setSelectedWaTemplateName] = useState<string>("");
  const [selectedSmsTemplateRef, setSelectedSmsTemplateRef] = useState<string>("");
  const [customWebsiteLink, setCustomWebsiteLink] = useState<string>(() => {
    if (activeBusiness?.website) return activeBusiness.website;
    if (activeBusiness?.phone) {
      const digits = activeBusiness.phone.replace(/\D/g, "");
      if (digits) return `https://wa.me/${digits}`;
    }
    return "";
  });

  const businessWebsiteFallback = useMemo(() => {
    if (customWebsiteLink.trim()) return customWebsiteLink.trim();
    if (activeBusiness?.website) return activeBusiness.website;
    if (activeBusiness?.phone) {
      const digits = activeBusiness.phone.replace(/\D/g, "");
      if (digits) return `https://wa.me/${digits}`;
    }
    return "https://yourbrand.co.ke";
  }, [customWebsiteLink, activeBusiness]);

  // Automatically preselect approved Meta template when on WhatsApp (unless user explicitly chose Free-form)
  useEffect(() => {
    if (channel === "WHATSAPP" && !message && waTemplates.length > 0 && selectedWaTemplateName !== "FREEFORM") {
      const preferred =
        waTemplates.find((t: any) => t.name === "universal_business_promo" && t.status === "APPROVED") ||
        waTemplates.find((t: any) => t.name === "general_business_promo" && t.status === "APPROVED") ||
        waTemplates.find((t: any) => t.status === "APPROVED") ||
        waTemplates[0];
      if (preferred) {
        setSelectedWaTemplateName(preferred.name);
        const bodyComp = preferred.components?.find((c: any) => c.type === "BODY");
        const rawText = bodyComp?.text || "";
        if (rawText) {
          const formatted = formatTemplateForComposer(preferred.name, rawText);
          setMessage(formatted);
          if (!campaignName) {
            setCampaignName(`WhatsApp - ${preferred.name}`);
          }
        }
      }
    }
  }, [channel, waTemplates, message, campaignName, selectedWaTemplateName]);

  const isWhatsApp = channel === "WHATSAPP";

  // Recipient resolution
  const recipientCount = useMemo(() => {
    if (audienceMode === "group") {
      if (!selectedGroupRef) return 0;
      const group = groups.find((g) => g.reference === selectedGroupRef);
      return group?.total_contacts ?? 0;
    }
    if (audienceMode === "all") {
      return allContacts.length;
    }
    // Manual
    const nums = manualNumbers
      .split(/[\n,;]+/)
      .map((n) => n.trim())
      .filter((n) => n.length >= 9);
    return nums.length;
  }, [audienceMode, selectedGroupRef, groups, allContacts, manualNumbers]);

  // GSM 03.38 calculation
  const charCount = message.length;
  const isUnicode = useMemo(() => /[^\u0000-\u007F]/.test(message), [message]);

  const { segments, charsRemaining, maxSingle } = useMemo(() => {
    if (charCount === 0) return { segments: 1, charsRemaining: isUnicode ? 70 : 160, maxSingle: isUnicode ? 70 : 160 };

    if (!isUnicode) {
      if (charCount <= 160) {
        return { segments: 1, charsRemaining: 160 - charCount, maxSingle: 160 };
      }
      const segs = Math.ceil(charCount / 153);
      const rem = segs * 153 - charCount;
      return { segments: segs, charsRemaining: rem, maxSingle: 160 };
    } else {
      if (charCount <= 70) {
        return { segments: 1, charsRemaining: 70 - charCount, maxSingle: 70 };
      }
      const segs = Math.ceil(charCount / 67);
      const rem = segs * 67 - charCount;
      return { segments: segs, charsRemaining: rem, maxSingle: 70 };
    }
  }, [charCount, isUnicode]);

  // Total credits calculation (WhatsApp: flat 2 credits/msg, SMS: segments)
  const totalCostCredits = isWhatsApp ? recipientCount * 2 : recipientCount * segments;
  const hasInsufficientCredits = totalCostCredits > smsBalance;

  // Variable-Length Inflation Detection (only for 160-char SMS)
  const hasDynamicTags = /\{(first_name|last_name|name|phone_number|email)\}/.test(message);
  const isNearBoundary = !isUnicode ? charCount >= 148 && charCount <= 160 : charCount >= 62 && charCount <= 70;
  const showInflationWarning = !isWhatsApp && hasDynamicTags && isNearBoundary;

  // Handset preview interpolation
  const samplePreviewText = useMemo(() => {
    if (!message) {
      return isWhatsApp
        ? "Your WhatsApp message will appear here in real-time as you compose..."
        : "Your SMS message will appear here in real-time as you compose...";
    }
    return message
      .replace(/\{first_name\}/g, "Sarah")
      .replace(/\{last_name\}/g, "Kamau")
      .replace(/\{name\}/g, "Sarah Kamau")
      .replace(/\{phone_number\}/g, "+254712345678")
      .replace(/\{email\}/g, "sarah@gmail.com")
      .replace(/\{business_name\}/g, activeBusiness?.name || "Your Brand")
      .replace(/\{business_phone\}/g, activeBusiness?.phone || "+254 7XX XXX XXX")
      .replace(/\{business_email\}/g, activeBusiness?.email || "info@brand.co.ke")
      .replace(/\{business_website\}/g, businessWebsiteFallback)
      .replace(/\{website_url\}/g, businessWebsiteFallback)
      .replace(/\{link\}/g, businessWebsiteFallback);
  }, [message, isWhatsApp, activeBusiness, businessWebsiteFallback]);

  // Tag Inserter into textarea cursor position
  const handleInsertTag = (tag: string) => {
    const el = textareaRef.current;
    if (!el) {
      setMessage((prev: string) => prev + tag);
      return;
    }
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const nextText = message.substring(0, start) + tag + message.substring(end);
    setMessage(nextText);

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + tag.length, start + tag.length);
    }, 0);
  };

  // Submit Handler
  const handleLaunchBroadcast = (e: React.FormEvent) => {
    e.preventDefault();

    if (!campaignName.trim()) {
      toast.error("Please enter a campaign title");
      return;
    }
    if (recipientCount === 0) {
      toast.error("Audience has 0 recipients. Please select a group with contacts or paste numbers.");
      return;
    }
    if (!message.trim()) {
      toast.error("Please compose an SMS message body");
      return;
    }
    if (hasInsufficientCredits) {
      toast.error(`Insufficient SMS credits (${totalCostCredits} needed, ${smsBalance} available). Please top up.`);
      return;
    }

    let finalMessage = message;
    if (customWebsiteLink.trim()) {
      finalMessage = finalMessage
        .replace(/\{website_url\}/g, customWebsiteLink.trim())
        .replace(/\{business_website\}/g, customWebsiteLink.trim())
        .replace(/\{link\}/g, customWebsiteLink.trim());
    }

    createCampaignMutation.mutate(
      {
        name: campaignName.trim(),
        sender_id: isWhatsApp ? "WHATSAPP" : senderId,
        message_template: finalMessage,
        channel: channel,
        target_group_reference: audienceMode === "group" ? selectedGroupRef : undefined,
        send_to_all_contacts: audienceMode === "all",
        manual_numbers: audienceMode === "manual" ? manualNumbers : undefined,
      },
      {
        onSuccess: (data) => {
          toast.success(
            `${isWhatsApp ? "WhatsApp" : "SMS"} broadcast queued! Dispatched to ${data.recipient_count} recipients via Celery worker.`
          );
          setCampaignName("");
          setMessage("");
          setManualNumbers("");
          router.push("/business/reports");
        },
        onError: (err: any) => {
          const data = err?.response?.data;
          let errMsg = "Failed to launch campaign";
          if (typeof data === "string") {
            errMsg = data;
          } else if (data && typeof data === "object") {
            const firstVal =
              data.credits ||
              data.manual_numbers ||
              data.target_group ||
              data.sender_id ||
              data.message_template ||
              data.channel ||
              data.name ||
              data.error ||
              data.detail ||
              Object.values(data)[0];
            if (Array.isArray(firstVal)) {
              errMsg = firstVal[0];
            } else if (typeof firstVal === "string") {
              errMsg = firstVal;
            } else if (firstVal) {
              errMsg = JSON.stringify(firstVal);
            }
          }
          toast.error(errMsg);
        },
      }
    );
  };

  return (
    <div className="space-y-8 w-full max-w-none">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
            <Link href="/business/dashboard" className="hover:text-zinc-900">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-zinc-900 font-medium">
              {isWhatsApp ? "WhatsApp Broadcast" : "Bulk SMS Broadcast"}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            {isWhatsApp ? "Compose & Launch WhatsApp Broadcast" : "Compose & Launch Bulk SMS"}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 mt-0.5">
            {isWhatsApp
              ? "Official Meta WhatsApp Business Cloud API broadcast with rich cards and real-time Blue Ticks."
              : "Asynchronous Tier-1 carrier dispatch across Safaricom, Airtel, and partner gateway networks."}
          </p>
        </div>

        {/* Live Wallet Balance Badge */}
        <div className="flex items-center gap-3">
          <Link
            href="/business/billing"
            className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-colors inline-flex items-center gap-2 ${
              hasInsufficientCredits && recipientCount > 0
                ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                : "bg-purple-50 text-[#581c87] border-purple-200 hover:bg-purple-100"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                hasInsufficientCredits && recipientCount > 0 ? "bg-red-500 animate-ping" : "bg-emerald-500"
              }`}
            />
            <span>
              Balance: <strong>{smsBalance.toLocaleString()} Credits</strong>
            </span>
            <span className="text-[10px] text-zinc-400">&bull; Top Up &rarr;</span>
          </Link>
        </div>
      </div>

      {/* 2. Main Grid: Composer (8 cols) & Live Preview (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 cols: Campaign Composer Form */}
        <div className="lg:col-span-8 bg-white border border-zinc-200 rounded-xl p-5 sm:p-7 shadow-xs">
          <form onSubmit={handleLaunchBroadcast} className="space-y-6">
            {/* Channel Selector Switcher */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                Dispatch Channel
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setChannel("SMS")}
                  className={`p-3.5 rounded-xl border flex items-center gap-3 text-left transition-all cursor-pointer ${
                    channel === "SMS"
                      ? "bg-purple-50/90 border-[#581c87] ring-1 ring-[#581c87] shadow-xs"
                      : "bg-zinc-50 border-zinc-200 hover:bg-zinc-100"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                      channel === "SMS" ? "bg-[#581c87] text-white" : "bg-zinc-200 text-zinc-700"
                    }`}
                  >
                    📱
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                      <span>Bulk SMS</span>
                      {channel === "SMS" && (
                        <span className="text-[10px] bg-purple-200 text-[#581c87] font-semibold px-1.5 py-0.2 rounded">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">Tier-1 Direct Carrier &bull; 1 credit/part</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setChannel("WHATSAPP")}
                  className={`p-3.5 rounded-xl border flex items-center gap-3 text-left transition-all cursor-pointer ${
                    channel === "WHATSAPP"
                      ? "bg-emerald-50/90 border-emerald-600 ring-1 ring-emerald-600 shadow-xs"
                      : "bg-zinc-50 border-zinc-200 hover:bg-zinc-100"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                      channel === "WHATSAPP" ? "bg-emerald-600 text-white" : "bg-zinc-200 text-zinc-700"
                    }`}
                  >
                    💬
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                      <span>WhatsApp Business</span>
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded border border-emerald-300">
                        Meta Cloud API
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">Rich Cards &bull; 2 credits/msg &bull; 98% Read Rate</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Sender ID Header / WhatsApp Business Identity */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                {isWhatsApp ? "WhatsApp Business Identity" : "Sender ID Header"}
              </label>
              {isWhatsApp ? (
                <div className="w-full px-3.5 py-2.5 rounded-lg border border-emerald-200 bg-emerald-50/60 text-xs text-emerald-900 font-medium flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <svg className="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    LJK Marketing Agency
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
                    Meta Verified
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <select
                    value={senderId}
                    onChange={(e) => setSenderId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs sm:text-sm text-zinc-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#581c87] cursor-pointer"
                  >
                    {activeBusiness?.sender_id && activeBusiness.sender_id_status === "APPROVED" && (
                      <option value={activeBusiness.sender_id}>
                        {activeBusiness.sender_id} (Official Verified)
                      </option>
                    )}
                    <option value="LJK_AGENCY">LJK_AGENCY (Tier-1 Shared Route)</option>
                    <option value="PROMOTIONAL">PROMOTIONAL (Standard Bulk)</option>
                  </select>
                </div>
              )}
            </div>

            {/* Audience Targeting Selector */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                Target Audience
              </label>

              {/* Mode Switcher Pills */}
              <div className="flex flex-wrap gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setAudienceMode("group")}
                  className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                    audienceMode === "group"
                      ? "bg-[#581c87] text-white border-[#581c87]"
                      : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100"
                  }`}
                >
                  By Contact Group ({groups.length})
                </button>
                <button
                  type="button"
                  onClick={() => setAudienceMode("all")}
                  className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                    audienceMode === "all"
                      ? "bg-[#581c87] text-white border-[#581c87]"
                      : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100"
                  }`}
                >
                  All Subscribed Contacts ({allContacts.length})
                </button>
                <button
                  type="button"
                  onClick={() => setAudienceMode("manual")}
                  className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                    audienceMode === "manual"
                      ? "bg-[#581c87] text-white border-[#581c87]"
                      : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100"
                  }`}
                >
                  Manual Phone Numbers
                </button>
              </div>

              {/* Mode Sub-inputs */}
              {audienceMode === "group" && (
                <div className="space-y-1.5">
                  <select
                    value={selectedGroupRef}
                    onChange={(e) => setSelectedGroupRef(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs sm:text-sm text-zinc-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#581c87] cursor-pointer"
                  >
                    {groups.length === 0 ? (
                      <option value="">No contact groups found</option>
                    ) : (
                      groups.map((g: any) => (
                        <option key={g.reference} value={g.reference}>
                          {g.name} &bull; {g.total_contacts} subscribed contacts
                        </option>
                      ))
                    )}
                  </select>
                  <p className="text-[11px] text-zinc-500">
                    Selected segment has <strong>{recipientCount}</strong> subscribed contacts.
                  </p>
                </div>
              )}

              {audienceMode === "all" && (
                <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-lg text-xs text-purple-900 flex items-center justify-between">
                  <span>
                    Broadcasting to all active directory contacts: <strong>{allContacts.length} recipients</strong>.
                  </span>
                  <Link href="/business/contacts" className="text-[#581c87] font-bold hover:underline">
                    Manage Contacts &rarr;
                  </Link>
                </div>
              )}

              {audienceMode === "manual" && (
                <div className="space-y-1.5">
                  <textarea
                    rows={3}
                    value={manualNumbers}
                    onChange={(e) => setManualNumbers(e.target.value)}
                    placeholder="Enter phone numbers separated by commas or line breaks (e.g. 0712345678, 254722000000, 0733000000)"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs sm:text-sm font-mono text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#581c87]"
                  />
                  <p className="text-[11px] text-zinc-500">
                    Identified: <strong>{recipientCount}</strong> valid phone numbers.
                  </p>
                </div>
              )}
            </div>

            {/* Store Website & Call-to-Action Link Card */}
            <div className="p-3.5 bg-sky-50/70 border border-sky-200 rounded-xl space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <label className="text-xs font-bold text-sky-950 uppercase tracking-wider flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Store Website / Call-to-Action Link
                </label>
                <span className="text-[11px] text-sky-700 font-medium">
                  {isWhatsApp ? "Direct clickable link in WhatsApp chat" : "Target URL in SMS"}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  value={customWebsiteLink}
                  onChange={(e) => setCustomWebsiteLink(e.target.value)}
                  placeholder="e.g. https://yourbusiness.co.ke or https://wa.me/254712345678"
                  className="flex-1 px-3 py-2 rounded-lg border border-sky-300 text-xs sm:text-sm text-zinc-900 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                />
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleInsertTag("{website_url}")}
                    className="px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>+ Insert Tag</span>
                  </button>
                  {activeBusiness?.phone && (
                    <button
                      type="button"
                      onClick={() => {
                        const digits = activeBusiness.phone.replace(/\D/g, "");
                        const link = `https://wa.me/${digits}`;
                        setCustomWebsiteLink(link);
                        toast.success("Loaded direct WhatsApp chat link!");
                      }}
                      className="px-2.5 py-2 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                      title="Generate direct wa.me link from business phone"
                    >
                      <span>💬 Use wa.me</span>
                    </button>
                  )}
                </div>
              </div>

              <p className="text-[11px] text-sky-900/80 leading-relaxed">
                💡 <strong>Direct WhatsApp Link:</strong> WhatsApp automatically renders links in your message body (e.g. <code className="text-[10px] bg-sky-100 px-1 py-0.5 rounded text-sky-900">&#123;website_url&#125;</code>) as a clickable blue hyperlink with rich previews. Customers tapping it open your website directly with zero third-party redirects.
              </p>
            </div>

            {/* Campaign Title (Rearranged directly above Message Body so it is not forgotten) */}
            <div className="p-3.5 bg-purple-50/40 border border-purple-200/90 rounded-xl space-y-1.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-zinc-800 uppercase tracking-wider">
                  Campaign Title <span className="text-purple-700">*</span>
                </label>
                <span className="text-[11px] text-zinc-500">
                  Visible in your reports & analytics
                </span>
              </div>
              <input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder={isWhatsApp ? "e.g. Weekend Flash Sale WhatsApp Promo" : "e.g. Weekend Flash Sale SMS Promo"}
                className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs sm:text-sm text-zinc-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#581c87] font-medium placeholder:font-normal placeholder:text-zinc-400"
              />
            </div>

            {/* Message Body & Dynamic Tag Pill Inserter */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                  {isWhatsApp ? "WhatsApp Message Body" : "SMS Message Body"}
                </label>

                {/* Character & Segment Telemetry */}
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-zinc-500 font-semibold">{charCount} chars</span>
                  <span className="text-zinc-300">&bull;</span>
                  {isWhatsApp ? (
                    <span className="font-bold text-emerald-600">
                      2 Credits / Recipient
                    </span>
                  ) : (
                    <>
                      <span className="text-zinc-500">
                        {charsRemaining} left in part
                      </span>
                      <span className="text-zinc-300">&bull;</span>
                      <span className={`font-bold ${segments > 1 ? "text-purple-700" : "text-emerald-600"}`}>
                        {segments} {segments === 1 ? "SMS part" : "SMS parts"}
                      </span>
                      {isUnicode && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                          Unicode
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Template Selector & Dynamic Tag Inserter Toolbar */}
              <div className="space-y-2 mb-2">
                {isWhatsApp ? (
                  /* WhatsApp Meta Template Selector */
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-emerald-50/80 border border-emerald-200 rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1">
                      <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
                        <svg className="w-4 h-4 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                        Meta Template:
                      </span>
                      <select
                        value={selectedWaTemplateName}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSelectedWaTemplateName(val);
                          if (!val) return;
                          if (val === "FREEFORM") {
                            toast("Free-form mode: You can write any custom text directly in the box below.", {
                              icon: "✏️",
                            });
                            return;
                          }
                          const tpl = waTemplates.find((t: any) => t.name === val);
                          if (tpl) {
                            const bodyComp = tpl.components?.find((c: any) => c.type === "BODY");
                            const rawText = bodyComp?.text || "";
                            if (rawText) {
                              const formatted = formatTemplateForComposer(tpl.name, rawText);
                              setMessage(formatted);
                              if (!campaignName || campaignName.startsWith("WhatsApp - ")) {
                                setCampaignName(`WhatsApp - ${tpl.name}`);
                              }
                              toast.success(`Loaded Meta template: ${tpl.name}`);
                            }
                          }
                        }}
                        className="py-1 px-2.5 rounded border border-emerald-300 text-xs text-zinc-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer w-full sm:w-auto font-medium"
                      >
                        <option value="">Choose an approved Meta template...</option>
                        <option value="FREEFORM">✏️ Custom Free-form Message (Write your own text)</option>
                        {waTemplates.map((t: any) => (
                          <option key={t.id || t.name} value={t.name}>
                            {t.name} ({t.category} &bull; {t.status})
                          </option>
                        ))}
                      </select>
                    </div>

                    <Link
                      href="/business/templates"
                      className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 hover:underline shrink-0"
                    >
                      Browse Templates &rarr;
                    </Link>
                  </div>
                ) : (
                  /* Saved SMS Template Selector */
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 bg-purple-50/50 border border-purple-200 rounded-lg">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-[11px] font-bold text-purple-900 uppercase tracking-wider shrink-0">
                        Use Template:
                      </span>
                      <select
                        value={selectedSmsTemplateRef}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSelectedSmsTemplateRef(val);
                          if (!val) return;
                          if (val === "FREEFORM") {
                            toast("Free-form mode: Write your custom message directly in the box below.", {
                              icon: "✏️",
                            });
                            return;
                          }
                          const tpl = templates.find((t) => t.reference === val);
                          if (tpl) {
                            setMessage(tpl.body);
                            if (!campaignName || campaignName.startsWith("SMS - ")) {
                              setCampaignName(`SMS - ${tpl.name}`);
                            }
                            toast.success(`Loaded template: ${tpl.name}`);
                          }
                        }}
                        className="py-1 px-2.5 rounded border border-purple-300 text-xs text-zinc-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#581c87] cursor-pointer w-full sm:w-auto font-medium"
                      >
                        <option value="FREEFORM">✏️ Custom Free-form Message (Write your own text)</option>
                        {templates.map((t) => (
                          <option key={t.reference} value={t.reference}>
                            {t.name} ({t.category})
                          </option>
                        ))}
                      </select>
                    </div>

                    <Link
                      href="/business/templates"
                      className="text-[11px] font-bold text-[#581c87] hover:underline shrink-0"
                    >
                      Manage Templates &rarr;
                    </Link>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-1.5 bg-zinc-50 p-2 rounded-lg border border-zinc-200">
                  <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mr-1">
                    Insert Tag:
                  </span>
                  {[
                    { tag: "{first_name}", label: "First Name" },
                    { tag: "{last_name}", label: "Last Name" },
                    { tag: "{name}", label: "Full Name" },
                    { tag: "{business_name}", label: "Business Name" },
                    { tag: "{business_phone}", label: "Business Phone" },
                    { tag: "{website_url}", label: "Website Link" },
                    { tag: "{phone_number}", label: "Recipient Phone" },
                    { tag: "{email}", label: "Email" },
                  ].map((item) => (
                    <button
                      key={item.tag}
                      type="button"
                      onClick={() => handleInsertTag(item.tag)}
                      className="py-1 px-2.5 bg-white hover:bg-purple-50 text-zinc-700 hover:text-[#581c87] border border-zinc-200 hover:border-purple-300 rounded text-[11px] font-mono transition-colors cursor-pointer shadow-2xs"
                    >
                      + {item.tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Textarea */}
              <textarea
                ref={textareaRef}
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  isWhatsApp
                    ? "Choose an approved Meta template above or write your custom WhatsApp message. Use dynamic variables like {first_name} and {website_url}."
                    : "Write your promotional campaign or alert message here. Use {first_name} to personalize each SMS."
                }
                className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#581c87] placeholder:text-zinc-400 leading-relaxed font-sans"
              />

              {/* Variable Length Inflation Safeguard Banner */}
              {showInflationWarning && (
                <div className="mt-2.5 p-3 rounded-lg bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-start gap-2.5 leading-relaxed">
                  <span className="text-amber-600 font-bold shrink-0 mt-0.5">⚠️</span>
                  <div>
                    <strong>Variable Length Notice:</strong> Your message template is close to the single-SMS threshold ({charCount}/{maxSingle} chars). For recipients with longer names (e.g. 15+ characters), personalized tags like <code>{`{first_name}`}</code> may push the rendered text past 160 characters, turning those messages into 2-part SMS.
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-zinc-500 mt-1.5">
                <span>GSM standard: 160 chars single, 153 chars per part concatenated.</span>
                <span>Opt-out text required by CA for promotional broadcasts.</span>
              </div>
            </div>

            {/* Quota & Cost Summary Bar */}
            <div className="pt-5 border-t border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs text-zinc-600">
                  Estimated Total Cost:{" "}
                  <span className={`font-extrabold text-base font-mono ${isWhatsApp ? "text-emerald-700" : "text-[#581c87]"}`}>
                    {totalCostCredits.toLocaleString()} Credits
                  </span>{" "}
                  <span className="text-zinc-400">
                    {isWhatsApp ? (
                      `(${recipientCount.toLocaleString()} recipients × 2 Credits/msg)`
                    ) : (
                      `(${recipientCount.toLocaleString()} recipients × ${segments} ${segments === 1 ? "part" : "parts"})`
                    )}
                  </span>
                </div>
                {hasInsufficientCredits && (
                  <div className="text-xs text-red-600 font-medium mt-0.5">
                    Insufficient balance ({smsBalance.toLocaleString()} available). Top up {totalCostCredits - smsBalance} credits.
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                {hasInsufficientCredits ? (
                  <Link
                    href="/business/billing"
                    className="py-2.5 px-5 bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-colors"
                  >
                    Top Up Credits &rarr;
                  </Link>
                ) : (
                  <button
                    type="submit"
                    disabled={createCampaignMutation.isPending || recipientCount === 0}
                    className={`py-2.5 px-6 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50 ${
                      isWhatsApp ? "bg-emerald-600 hover:bg-emerald-700" : "bg-[#581c87] hover:bg-[#4a1572]"
                    }`}
                  >
                    {createCampaignMutation.isPending ? (
                      <>
                        <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        <span>Enqueuing {isWhatsApp ? "WhatsApp" : "SMS"} Dispatch...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        <span>Queue &amp; Send {isWhatsApp ? "WhatsApp Broadcast" : "SMS Broadcast"}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Right 4 cols: Live Smartphone Mockup & Best Practices */}
        <div className="lg:col-span-4 space-y-6">
          {/* Mobile Handset Preview */}
          <div className="bg-zinc-900 text-white rounded-2xl p-5 shadow-xl border-4 border-zinc-800">
            <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center justify-between">
              <span>{isWhatsApp ? "WhatsApp Handset Preview" : "SMS Handset Preview"}</span>
              <span className={`w-2 h-2 rounded-full ${isWhatsApp ? "bg-emerald-400" : "bg-purple-400"} animate-pulse`} />
            </div>

            {isWhatsApp ? (
              /* WhatsApp Screen Mockup */
              <div className="bg-[#0b141a] rounded-2xl overflow-hidden border border-zinc-700/60 shadow-inner">
                {/* WhatsApp Chat App Bar */}
                <div className="bg-[#1f2c34] px-3 py-2.5 flex items-center gap-2.5 border-b border-[#2a3942]">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-[11px] text-white shrink-0">
                    LJK
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-zinc-100 truncate">LJK Marketing</span>
                      <svg className="w-3 h-3 text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                    </div>
                    <div className="text-[9px] text-emerald-400 font-medium">Official Business Account</div>
                  </div>
                </div>

                {/* WhatsApp Chat Body */}
                <div className="p-3.5 space-y-2 bg-[radial-gradient(#1f2c34_1px,transparent_1px)] [background-size:12px_12px] min-h-[140px] flex flex-col justify-end">
                  <div className="ml-auto max-w-[90%] bg-[#005c4b] text-zinc-100 rounded-lg rounded-tr-xs p-2.5 shadow-sm space-y-1.5 border border-[#025142]">
                    <p className="text-xs leading-relaxed break-words font-sans whitespace-pre-wrap">
                      {renderPreviewWithLinks(samplePreviewText)}
                    </p>
                    <div className="flex items-center justify-end gap-1 text-[9px] text-emerald-200/80 pt-0.5">
                      <span>10:45 AM</span>
                      {/* Double Blue Ticks */}
                      <span className="text-sky-400 font-bold">✓✓</span>
                    </div>
                  </div>

                  {/* Interactive Button CTA Previews */}
                  {selectedWaTemplateName === "general_business_promo" ? (
                    <div className="ml-auto max-w-[90%] w-full space-y-1.5 pt-1">
                      <div className="py-2 px-3 bg-[#1f2c34] rounded text-[11px] text-sky-400 font-semibold text-center border border-[#2a3942] flex items-center justify-center gap-1.5 shadow-sm">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span>Shop Online</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 leading-normal text-center px-1">
                        Notice: Button routes via Meta catalog. For direct visits to your site, your website link is included in the message text.
                      </p>
                    </div>
                  ) : (
                    <div className="ml-auto max-w-[90%] w-full pt-1">
                      <div className="py-1.5 px-3 bg-emerald-950/50 rounded text-[10px] text-emerald-300 font-medium text-center border border-emerald-800/40 flex items-center justify-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Direct Clickable Link in Chat &bull; 0 Third-Party Redirects</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* SMS Notification bubble */
              <div className="bg-zinc-800/95 rounded-2xl p-4 border border-zinc-700/60 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-zinc-400 pb-1.5 border-b border-zinc-700/40">
                  <span className="text-purple-300 font-bold font-mono tracking-wider">{senderId}</span>
                  <span className="text-[10px]">Direct Tier-1 SMS</span>
                </div>
                <p className="text-xs text-zinc-100 leading-relaxed break-words font-sans">
                  {samplePreviewText}
                </p>
                <div className="text-[9px] text-zinc-400 text-right pt-1">
                  Just now &bull; Delivered
                </div>
              </div>
            )}
          </div>

          {/* Guidelines */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs space-y-3 text-xs">
            <h3 className="font-bold text-zinc-900">
              {isWhatsApp ? "Meta WhatsApp Cloud API Guidelines" : "CA Regulatory & Gateway Rules"}
            </h3>
            {isWhatsApp ? (
              <ul className="space-y-2 text-zinc-600 list-disc list-inside leading-relaxed text-[11px]">
                <li>Dispatches through <strong>Meta WhatsApp Cloud API</strong> under Corban Technologies LTD.</li>
                <li>Instant <strong>98%+ read rate</strong> with guaranteed delivery directly to WhatsApp chat.</li>
                <li>Real-time <strong>Blue Ticks (Read Receipts)</strong> tracked in delivery reports.</li>
                <li>Replies open a <strong>24-hour free customer care window</strong> for instant engagement.</li>
              </ul>
            ) : (
              <ul className="space-y-2 text-zinc-600 list-disc list-inside leading-relaxed text-[11px]">
                <li>Promotional SMS permitted between <strong>8:00 AM &ndash; 7:00 PM</strong> in Kenya.</li>
                <li>Include your business brand or helpline for transparent identification.</li>
                <li>Every dispatch writes an immutable ledger entry on your business wallet.</li>
                <li>Delivery reports (DLR) appear in real time under Delivery Reports.</li>
              </ul>
            )}
          </div>

          {/* Recent Broadcasts Mini-List */}
          {recentCampaigns.length > 0 && (
            <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                  Recent Broadcasts
                </h3>
                <Link href="/business/reports" className="text-[11px] text-[#581c87] hover:underline font-semibold">
                  View All &rarr;
                </Link>
              </div>

              <div className="divide-y divide-zinc-100">
                {recentCampaigns.map((camp: any) => (
                  <div key={camp.id || camp.reference} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="min-w-0 pr-2">
                      <div className="font-semibold text-zinc-900 truncate">{camp.name}</div>
                      <div className="text-[11px] text-zinc-500 font-mono">
                        {camp.recipient_count} recipients &bull; {camp.sender_id}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        camp.status === "COMPLETED"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : camp.status === "PROCESSING"
                          ? "bg-purple-50 text-purple-700 border border-purple-200"
                          : "bg-zinc-100 text-zinc-600 border border-zinc-200"
                      }`}
                    >
                      {camp.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BroadcastContent() {
  const searchParams = useSearchParams();
  const preselectedGroupRef = searchParams.get("group");
  const preselectedTemplateRef = searchParams.get("template");
  const preselectedChannel = searchParams.get("channel");

  const { data: businessesData } = useFetchBusinesses();
  const { data: walletsData } = useFetchBusinessWallets();
  const { data: groupsData } = useFetchContactGroups();
  const { data: contactsData } = useFetchContacts();
  const { data: campaignsData } = useFetchCampaigns();
  const { data: templatesData } = useFetchMessageTemplates();

  const activeBusiness = useMemo(() => {
    if (!businessesData) return null;
    const list = Array.isArray(businessesData) ? businessesData : (businessesData as any).results || [];
    return list[0] || null;
  }, [businessesData]);

  const wallet = useMemo(() => {
    if (!walletsData) return null;
    const list = Array.isArray(walletsData) ? walletsData : (walletsData as any).results || [];
    return list[0] || null;
  }, [walletsData]);

  const groups = useMemo(() => {
    if (!groupsData) return [];
    const list = Array.isArray(groupsData) ? groupsData : (groupsData as any).results || [];
    return list.filter((g: any) => g.is_active !== false);
  }, [groupsData]);

  const allContacts = useMemo(() => {
    if (!contactsData) return [];
    const list = Array.isArray(contactsData) ? contactsData : (contactsData as any).results || [];
    return list.filter((c: any) => c.is_active !== false && c.is_subscribed !== false);
  }, [contactsData]);

  const recentCampaigns = useMemo(() => {
    if (!campaignsData) return [];
    const list = Array.isArray(campaignsData) ? campaignsData : (campaignsData as any).results || [];
    return list.slice(0, 5);
  }, [campaignsData]);

  const templates = useMemo(() => {
    if (!templatesData) return [];
    const list = Array.isArray(templatesData) ? templatesData : (templatesData as any)?.results || [];
    return list.filter((t: any) => t.is_active !== false);
  }, [templatesData]);

  return (
    <BroadcastComposerForm
      key={`${activeBusiness?.reference || "biz"}-${preselectedGroupRef || "none"}-${preselectedTemplateRef || "notpl"}-${preselectedChannel || "nochn"}-${groups.length}-${templates.length}`}
      activeBusiness={activeBusiness}
      wallet={wallet}
      groups={groups}
      allContacts={allContacts}
      recentCampaigns={recentCampaigns}
      templates={templates}
      preselectedGroupRef={preselectedGroupRef}
      preselectedTemplateRef={preselectedTemplateRef}
      preselectedChannel={preselectedChannel}
    />
  );
}

export default function BulkSMSBroadcastPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-500">Loading broadcast composer...</div>}>
      <BroadcastContent />
    </Suspense>
  );
}
