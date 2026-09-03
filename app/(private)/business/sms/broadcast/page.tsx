/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useFetchBusinesses } from "@/hooks/business/actions";
import { useFetchBusinessWallets } from "@/hooks/businesswallets/actions";
import { useFetchContactGroups } from "@/hooks/contactgroups/actions";
import { useFetchContacts } from "@/hooks/contacts/actions";
import { useFetchCampaigns, useCreateCampaign } from "@/hooks/campaigns/actions";

interface ComposerFormProps {
  activeBusiness: any;
  wallet: any;
  groups: any[];
  allContacts: any[];
  recentCampaigns: any[];
  preselectedGroupRef: string | null;
}

function BroadcastComposerForm({
  activeBusiness,
  wallet,
  groups,
  allContacts,
  recentCampaigns,
  preselectedGroupRef,
}: ComposerFormProps) {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const createCampaignMutation = useCreateCampaign();

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

  // Form state
  const [campaignName, setCampaignName] = useState("");
  const [senderId, setSenderId] = useState(initialSenderId);
  const [audienceMode, setAudienceMode] = useState<"group" | "all" | "manual">("group");
  const [selectedGroupRef, setSelectedGroupRef] = useState<string>(initialGroupRef);
  const [manualNumbers, setManualNumbers] = useState("");
  const [message, setMessage] = useState("");

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

  // Total credits calculation
  const totalCostCredits = recipientCount * segments;
  const hasInsufficientCredits = totalCostCredits > smsBalance;

  // Variable-Length Inflation Detection
  const hasDynamicTags = /\{(first_name|last_name|name|phone_number|email)\}/.test(message);
  const isNearBoundary = !isUnicode ? charCount >= 148 && charCount <= 160 : charCount >= 62 && charCount <= 70;
  const showInflationWarning = hasDynamicTags && isNearBoundary;

  // Handset preview interpolation
  const samplePreviewText = useMemo(() => {
    if (!message) return "Your SMS message will appear here in real-time as you compose...";
    return message
      .replace(/\{first_name\}/g, "Sarah")
      .replace(/\{last_name\}/g, "Kamau")
      .replace(/\{name\}/g, "Sarah Kamau")
      .replace(/\{phone_number\}/g, "+254712345678")
      .replace(/\{email\}/g, "sarah@gmail.com");
  }, [message]);

  // Tag Inserter into textarea cursor position
  const handleInsertTag = (tag: string) => {
    const el = textareaRef.current;
    if (!el) {
      setMessage((prev) => prev + tag);
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

    createCampaignMutation.mutate(
      {
        name: campaignName.trim(),
        sender_id: senderId,
        message_template: message,
        channel: "SMS",
        target_group_reference: audienceMode === "group" ? selectedGroupRef : undefined,
        send_to_all_contacts: audienceMode === "all",
        manual_numbers: audienceMode === "manual" ? manualNumbers : undefined,
      },
      {
        onSuccess: (data) => {
          toast.success(`Broadcast queued! Dispatched to ${data.recipient_count} recipients via Celery worker.`);
          setCampaignName("");
          setMessage("");
          setManualNumbers("");
          router.push("/business/reports");
        },
        onError: (err: any) => {
          const errMsg =
            err?.response?.data?.credits ||
            err?.response?.data?.target_group?.[0] ||
            err?.response?.data?.sender_id?.[0] ||
            err?.response?.data?.error ||
            "Failed to launch campaign";
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
            <span className="text-zinc-900 font-medium">Bulk SMS Broadcast</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            Compose &amp; Launch Bulk SMS
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 mt-0.5">
            Asynchronous Tier-1 carrier dispatch across Safaricom, Airtel, and partner gateway networks.
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
            {/* Campaign Title & Sender ID Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Campaign Title
                </label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="e.g. Weekend Flash Sale Promo"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#581c87]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Sender ID Header
                </label>
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
              </div>
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

            {/* Message Body & Dynamic Tag Pill Inserter */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                  SMS Message Body
                </label>

                {/* Character & Segment Telemetry */}
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-zinc-500 font-semibold">{charCount} chars</span>
                  <span className="text-zinc-300">&bull;</span>
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
                </div>
              </div>

              {/* Dynamic Tag Inserter Toolbar */}
              <div className="flex flex-wrap items-center gap-1.5 mb-2 bg-zinc-50 p-2 rounded-lg border border-zinc-200">
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mr-1">
                  Insert Tag:
                </span>
                {[
                  { tag: "{first_name}", label: "First Name" },
                  { tag: "{last_name}", label: "Last Name" },
                  { tag: "{name}", label: "Full Name" },
                  { tag: "{phone_number}", label: "Phone" },
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

              {/* Message Textarea */}
              <textarea
                ref={textareaRef}
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your promotional campaign or alert message here. Use {first_name} to personalize each SMS."
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
                  <span className="font-extrabold text-base text-[#581c87] font-mono">
                    {totalCostCredits.toLocaleString()} Credits
                  </span>{" "}
                  <span className="text-zinc-400">
                    ({recipientCount.toLocaleString()} recipients &times; {segments} {segments === 1 ? "part" : "parts"})
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
                    className="py-2.5 px-6 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
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
                        <span>Enqueuing Dispatch...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        <span>Queue &amp; Send Broadcast</span>
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
              <span>Handset Preview</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            {/* Handset Notification bubble */}
            <div className="bg-zinc-800/95 rounded-2xl p-4 border border-zinc-700/60 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-zinc-400 pb-1.5 border-b border-zinc-700/40">
                <span className="text-purple-300 font-bold font-mono tracking-wider">{senderId}</span>
                <span className="text-[10px]">Direct Tier-1</span>
              </div>
              <p className="text-xs text-zinc-100 leading-relaxed break-words font-sans">
                {samplePreviewText}
              </p>
              <div className="text-[9px] text-zinc-400 text-right pt-1">
                Just now &bull; Delivered
              </div>
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs space-y-3 text-xs">
            <h3 className="font-bold text-zinc-900">CA Regulatory &amp; Gateway Rules</h3>
            <ul className="space-y-2 text-zinc-600 list-disc list-inside leading-relaxed text-[11px]">
              <li>Promotional SMS permitted between <strong>8:00 AM &ndash; 7:00 PM</strong> in Kenya.</li>
              <li>Include your business brand or helpline for transparent identification.</li>
              <li>Every dispatch writes an immutable ledger entry on your business wallet.</li>
              <li>Delivery reports (DLR) appear in real time under Delivery Reports.</li>
            </ul>
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

  const { data: businessesData } = useFetchBusinesses();
  const { data: walletsData } = useFetchBusinessWallets();
  const { data: groupsData } = useFetchContactGroups();
  const { data: contactsData } = useFetchContacts();
  const { data: campaignsData } = useFetchCampaigns();

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

  return (
    <BroadcastComposerForm
      key={`${activeBusiness?.reference || "biz"}-${preselectedGroupRef || "none"}-${groups.length}`}
      activeBusiness={activeBusiness}
      wallet={wallet}
      groups={groups}
      allContacts={allContacts}
      recentCampaigns={recentCampaigns}
      preselectedGroupRef={preselectedGroupRef}
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
