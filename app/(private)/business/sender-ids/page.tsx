/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  useFetchBusinesses,
  useUpdateBusiness,
  useConnectWhatsApp,
  useDisconnectWhatsApp,
  useRefreshWhatsAppStatus,
} from "@/hooks/business/actions";
import { Business } from "@/services/business";
import { launchWhatsAppEmbeddedSignup } from "@/lib/meta-sdk";

// ============================================================================
// SMS Sender ID Form Component
// ============================================================================
function SenderIdRegistrationForm({ activeBusiness }: { activeBusiness?: Business }) {
  const updateBusinessMutation = useUpdateBusiness();

  const [requestedName, setRequestedName] = useState(activeBusiness?.sender_id || "");
  const [taxPin, setTaxPin] = useState(activeBusiness?.tax_pin || "");
  const [regNumber, setRegNumber] = useState(activeBusiness?.registration_number || "");
  const [useCase, setUseCase] = useState("Promotional Alerts & Marketing");

  const handleRequestSenderId = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestedName.trim()) {
      toast.error("Please enter the requested Sender ID name");
      return;
    }
    if (requestedName.length > 11) {
      toast.error("Sender IDs cannot exceed 11 characters");
      return;
    }
    if (!/^[A-Za-z0-9_]{1,11}$/.test(requestedName.trim())) {
      toast.error("Sender ID must be alphanumeric (letters, numbers, underscores only)");
      return;
    }

    if (!activeBusiness) {
      toast.error("No active business workspace found.");
      return;
    }

    updateBusinessMutation.mutate(
      {
        reference: activeBusiness.reference,
        data: {
          sender_id: requestedName.trim().toUpperCase(),
          sender_id_status: "PENDING",
          tax_pin: taxPin.trim() || undefined,
          registration_number: regNumber.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success(`Sender ID "${requestedName.toUpperCase()}" submitted for carrier verification!`);
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.sender_id?.[0] || "Failed to submit Sender ID request");
        },
      }
    );
  };

  return (
    <form onSubmit={handleRequestSenderId} className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
          Requested Brand Header (Max 11 chars) *
        </label>
        <input
          type="text"
          maxLength={11}
          required
          value={requestedName}
          onChange={(e) => setRequestedName(e.target.value.toUpperCase().replace(/[^A-Za-z0-9_]/g, ""))}
          placeholder="e.g. YOURBRAND"
          className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 font-mono font-bold text-sm text-zinc-900 uppercase focus:outline-none focus:ring-2 focus:ring-[#581c87] placeholder:normal-case placeholder:font-sans placeholder:font-normal"
        />
        <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-1">
          <span>Letters, numbers, underscores only</span>
          <span>{requestedName.length}/11 chars</span>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
          KRA Tax PIN (For Telco Verification)
        </label>
        <input
          type="text"
          value={taxPin}
          onChange={(e) => setTaxPin(e.target.value.toUpperCase())}
          placeholder="e.g. P051234567Z"
          className="w-full px-3.5 py-2 text-xs rounded-lg border border-zinc-300 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#581c87]"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
          Business Registration / Certificate No.
        </label>
        <input
          type="text"
          value={regNumber}
          onChange={(e) => setRegNumber(e.target.value.toUpperCase())}
          placeholder="e.g. CPR/2024/123456"
          className="w-full px-3.5 py-2 text-xs rounded-lg border border-zinc-300 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#581c87]"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
          Primary Messaging Use Case
        </label>
        <select
          value={useCase}
          onChange={(e) => setUseCase(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#581c87] bg-white cursor-pointer"
        >
          <option value="Promotional Alerts & Marketing">Promotional Alerts &amp; Marketing</option>
          <option value="Transactional & OTP Verification">Transactional &amp; OTP Verification</option>
          <option value="Customer Support & Notifications">Customer Support &amp; Notifications</option>
        </select>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={updateBusinessMutation.isPending}
          className="w-full py-2.5 px-4 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
        >
          {updateBusinessMutation.isPending ? "Submitting for Review..." : "Submit for Telco Approval"}
        </button>
      </div>
    </form>
  );
}

// ============================================================================
// Main Channels & Sender IDs Management Page
// ============================================================================
export default function ChannelsAndSenderIdsPage() {
  const { data: businessesData, isLoading } = useFetchBusinesses();

  const businesses: Business[] = Array.isArray(businessesData)
    ? businessesData
    : (businessesData as any)?.results || [];

  const activeBusiness = businesses[0]; // Active workspace business

  // Active channel tab: whatsapp or sms
  const [activeTab, setActiveTab] = useState<"whatsapp" | "sms">("whatsapp");

  // Meta Signup & Connect Hooks
  const connectWhatsAppMutation = useConnectWhatsApp();
  const disconnectWhatsAppMutation = useDisconnectWhatsApp();
  const refreshWhatsAppMutation = useRefreshWhatsAppStatus();

  // Modal state for direct Phone Number ID connection
  const [isIdModalOpen, setIsIdModalOpen] = useState(false);
  const [directPhoneId, setDirectPhoneId] = useState("");
  const [directDisplayPhone, setDirectDisplayPhone] = useState("");
  const [directVerifiedName, setDirectVerifiedName] = useState("");

  // Preview message text
  const [waPreviewText, setWaPreviewText] = useState(
    "Hello! Special offer from our team: Enjoy 20% off your next purchase this week with code SAVE20."
  );
  const [smsPreviewText, setSmsPreviewText] = useState(
    "Hello, your order has been confirmed and dispatched! Thank you for choosing us."
  );

  const isWaConnected = activeBusiness?.whatsapp_onboarding_status === "CONNECTED";
  const senderIdStatus = activeBusiness?.sender_id_status || "PENDING";
  const currentSenderId = activeBusiness?.sender_id || "";

  // Trigger Meta Facebook Login popup
  const handleLaunchMetaSignup = async () => {
    if (!activeBusiness) {
      toast.error("No active business workspace found.");
      return;
    }

    toast.loading("Connecting to Meta...", { id: "meta-signup" });

    try {
      const result = await launchWhatsAppEmbeddedSignup();
      toast.loading("Linking WhatsApp account to your workspace...", { id: "meta-signup" });

      connectWhatsAppMutation.mutate(
        {
          reference: activeBusiness.reference,
          payload: {
            code: result.code,
            waba_id: result.waba_id,
            phone_number_id: result.phone_number_id,
          },
        },
        {
          onSuccess: (res) => {
            toast.success(res.message || "WhatsApp Business connected successfully!", {
              id: "meta-signup",
            });
          },
          onError: (err: any) => {
            toast.error(
              err?.response?.data?.error || "Failed to link WhatsApp account with Meta.",
              { id: "meta-signup" }
            );
          },
        }
      );
    } catch (err: any) {
      toast.error(err?.message || "Meta login dialog closed or cancelled.", {
        id: "meta-signup",
      });
    }
  };

  // Submit direct phone ID connection
  const handleDirectConnectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBusiness) return;

    if (!directPhoneId.trim()) {
      toast.error("Please enter your Meta Phone Number ID");
      return;
    }

    connectWhatsAppMutation.mutate(
      {
        reference: activeBusiness.reference,
        payload: {
          phone_number_id: directPhoneId.trim(),
          display_phone_number: directDisplayPhone.trim() || undefined,
          verified_name: directVerifiedName.trim() || activeBusiness.name,
        },
      },
      {
        onSuccess: () => {
          toast.success("WhatsApp Business connected successfully!");
          setIsIdModalOpen(false);
          setDirectPhoneId("");
          setDirectDisplayPhone("");
          setDirectVerifiedName("");
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.error || "Failed to connect WhatsApp number");
        },
      }
    );
  };

  // Disconnect WABA
  const handleDisconnect = () => {
    if (!activeBusiness) return;
    if (!confirm("Are you sure you want to disconnect your branded WhatsApp number? Outgoing messages will return to sending via LJK Marketing Agency.")) {
      return;
    }

    disconnectWhatsAppMutation.mutate(activeBusiness.reference, {
      onSuccess: () => {
        toast.success("WhatsApp number disconnected. Broadcasts will use LJK Marketing Agency sender.");
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.error || "Failed to disconnect WhatsApp number");
      },
    });
  };

  // Live Refresh
  const handleRefreshStatus = () => {
    if (!activeBusiness) return;
    refreshWhatsAppMutation.mutate(activeBusiness.reference, {
      onSuccess: (res) => {
        toast.success(res.message || "WhatsApp status synced from Meta!");
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.error || "Failed to sync status");
      },
    });
  };

  return (
    <div className="space-y-6 w-full max-w-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
            <Link href="/business/dashboard" className="hover:text-zinc-900">Dashboard</Link>
            <span>/</span>
            <span className="text-zinc-900 font-medium">Channels &amp; Sender IDs</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            Channels &amp; Sender IDs
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 mt-0.5">
            Manage your WhatsApp Business sender and Alphanumeric SMS Sender IDs.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center p-1 bg-zinc-100 rounded-xl border border-zinc-200 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("whatsapp")}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === "whatsapp"
                ? "bg-white text-emerald-800 shadow-xs border border-emerald-200"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>WhatsApp Business</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("sms")}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === "sms"
                ? "bg-white text-[#581c87] shadow-xs border border-purple-200"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#581c87]" />
            <span>SMS Sender ID</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-xs text-zinc-500">
          Loading channel settings...
        </div>
      ) : activeTab === "whatsapp" ? (
        /* ====================================================================
           WHATSAPP BUSINESS TAB
           ==================================================================== */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 7 Columns: Connection Status & Actions */}
          <div className="lg:col-span-7 space-y-6">
            {isWaConnected ? (
              /* Connected State */
              <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 mb-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                      Branded Number Connected
                    </div>
                    <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-1.5">
                      <span>{activeBusiness?.whatsapp_verified_name || activeBusiness?.name}</span>
                      <svg className="w-4 h-4 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                      </svg>
                    </h2>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Phone Number: <strong className="text-zinc-800">{activeBusiness?.whatsapp_display_phone_number || "Active"}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={refreshWhatsAppMutation.isPending}
                      onClick={handleRefreshStatus}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <svg className={`w-3.5 h-3.5 text-zinc-500 ${refreshWhatsAppMutation.isPending ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Sync Status</span>
                    </button>

                    <button
                      type="button"
                      disabled={disconnectWhatsAppMutation.isPending}
                      onClick={handleDisconnect}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-100">
                    <div className="text-[10px] font-semibold text-zinc-400 uppercase">Quality Rating</div>
                    <div className="font-bold text-zinc-900 mt-1 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span>{activeBusiness?.whatsapp_quality_rating === "GREEN" ? "High Quality (Green)" : activeBusiness?.whatsapp_quality_rating || "Active"}</span>
                    </div>
                  </div>

                  <div className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-100">
                    <div className="text-[10px] font-semibold text-zinc-400 uppercase">Dispatch Status</div>
                    <div className="font-bold text-emerald-700 mt-1">
                      Ready for Broadcasts
                    </div>
                  </div>

                  <div className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-100">
                    <div className="text-[10px] font-semibold text-zinc-400 uppercase">Connected Since</div>
                    <div className="font-medium text-zinc-800 mt-1">
                      {activeBusiness?.whatsapp_connected_at
                        ? new Date(activeBusiness.whatsapp_connected_at).toLocaleDateString()
                        : "Active"}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-xs text-emerald-900 leading-relaxed">
                  ✓ All WhatsApp campaigns dispatched from your workspace will originate from your verified business number (<strong>{activeBusiness?.whatsapp_display_phone_number}</strong>) with your official brand badge.
                </div>
              </div>
            ) : (
              /* Not Connected State: Clean and friendly */
              <div className="space-y-5">
                {/* Default Sender Notice */}
                <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 text-sm font-bold">
                    ✓
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-zinc-900 uppercase tracking-wide">
                        Default Sender: LJK Marketing Agency
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Active
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      Your workspace can send WhatsApp broadcasts immediately using our verified agency route. Customer messages are delivered with high priority.
                    </p>
                  </div>
                </div>

                {/* Branded Number Connect Card */}
                <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-base font-bold text-zinc-900">
                      Connect Your Branded WhatsApp Number
                    </h2>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      Send broadcasts displaying your own company name and brand badge, and receive direct customer replies on your business number.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-100 text-xs space-y-1">
                      <div className="font-bold text-zinc-800">Branded Experience</div>
                      <p className="text-[11px] text-zinc-500 leading-snug">
                        Displays your verified business name and profile logo on recipient phones.
                      </p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-100 text-xs space-y-1">
                      <div className="font-bold text-zinc-800">Direct Customer Replies</div>
                      <p className="text-[11px] text-zinc-500 leading-snug">
                        Customers who reply to your broadcasts chat directly with your team.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
                    <button
                      type="button"
                      onClick={handleLaunchMetaSignup}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                    >
                      <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      <span>Connect with Facebook</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsIdModalOpen(true)}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-zinc-300 hover:bg-zinc-50 text-zinc-700 text-xs font-semibold transition-all cursor-pointer"
                    >
                      Connect via Phone Number ID
                    </button>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/90 text-[11px] text-amber-900 leading-relaxed space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-amber-950">
                      <span>💡</span>
                      <span>Requirement for connecting your own number:</span>
                    </div>
                    <p>
                      Meta requires that any phone number connected to the official Cloud API cannot be active on the standard WhatsApp mobile phone app at the same time. We recommend using a dedicated secondary business SIM card.
                    </p>
                    <p className="text-amber-900/90 pt-0.5">
                      <strong>Don&apos;t have a second SIM?</strong> You don&apos;t need one! You can broadcast immediately through LJK&apos;s verified sender &mdash; your business name is featured in the message header, and you can include a direct <em>&ldquo;Chat with us&rdquo;</em> link to receive customer replies on your regular WhatsApp.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right 5 Columns: Handset Preview */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-bold text-zinc-900">
                  Customer Handset Preview
                </h3>
                <p className="text-xs text-zinc-500">
                  How recipients see your messages on WhatsApp.
                </p>
              </div>

              {/* Smartphone Frame Mockup */}
              <div className="max-w-[280px] mx-auto bg-zinc-900 rounded-3xl p-3 shadow-xl border-4 border-zinc-800">
                <div className="bg-[#e5ddd5] rounded-2xl overflow-hidden flex flex-col justify-between min-h-[340px]">
                  {/* WhatsApp Chat Header */}
                  <div className="bg-[#075e54] text-white p-3 flex items-center gap-2.5 shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#075e54] font-bold text-xs flex items-center justify-center shrink-0">
                      {(isWaConnected ? (activeBusiness?.whatsapp_verified_name || activeBusiness?.name) : "LJK")[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-xs truncate">
                          {isWaConnected
                            ? (activeBusiness?.whatsapp_verified_name || activeBusiness?.name)
                            : "LJK Marketing Agency"}
                        </span>
                        <svg className="w-3.5 h-3.5 text-emerald-300 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                          <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="text-[9px] text-emerald-100/80">
                        {isWaConnected ? "Official Business Account" : "Verified Sender"}
                      </div>
                    </div>
                  </div>

                  {/* Chat Message Bubble */}
                  <div className="p-3 space-y-2 flex-1">
                    <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-xs text-xs text-zinc-800 space-y-1.5 max-w-[95%]">
                      <p className="text-[11px] leading-relaxed whitespace-pre-wrap">
                        {waPreviewText}
                      </p>
                      <div className="flex items-center justify-end gap-1 text-[9px] text-zinc-400">
                        <span>10:45 AM</span>
                        <span className="text-blue-500 font-bold">✓✓</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Input Mockup */}
                  <div className="bg-[#f0f0f0] px-3 py-2 border-t border-zinc-200">
                    <div className="bg-white rounded-full px-3 py-1 text-[10px] text-zinc-400">
                      Message...
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-600 mb-1">
                  Preview Sample Message
                </label>
                <textarea
                  rows={2}
                  value={waPreviewText}
                  onChange={(e) => setWaPreviewText(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ====================================================================
           SMS SENDER ID TAB (Safaricom & Airtel Whitelisting)
           ==================================================================== */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 7 cols: Status & Preview */}
          <div className="lg:col-span-7 space-y-6">
            {/* Active Status Card */}
            <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-zinc-900">
                Workspace SMS Sender ID Status
              </h2>

              {currentSenderId ? (
                <div className={`p-5 rounded-xl border ${
                  senderIdStatus === "APPROVED"
                    ? "bg-emerald-50/50 border-emerald-200"
                    : senderIdStatus === "REJECTED"
                    ? "bg-red-50/50 border-red-200"
                    : "bg-amber-50/50 border-amber-200"
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Requested Header</div>
                      <div className="font-mono font-bold text-xl text-zinc-900 tracking-wider mt-0.5">
                        {currentSenderId}
                      </div>
                    </div>

                    <div>
                      {senderIdStatus === "APPROVED" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                          Approved &bull; Live on Telco Routes
                        </span>
                      )}
                      {senderIdStatus === "PENDING" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          Pending Telco Review
                        </span>
                      )}
                      {senderIdStatus === "REJECTED" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
                          Rejected by Regulator
                        </span>
                      )}
                    </div>
                  </div>

                  {senderIdStatus === "PENDING" && (
                    <p className="text-xs text-amber-800 mt-3 pt-3 border-t border-amber-200/60 leading-relaxed">
                      Your requested Sender ID is being reviewed with Safaricom &amp; Airtel. Turnaround time is typically <strong>12 to 24 hours</strong>. While pending, your SMS dispatches use our shared gateway.
                    </p>
                  )}

                  {senderIdStatus === "REJECTED" && (
                    <div className="text-xs text-red-700 mt-3 pt-3 border-t border-red-200/60 leading-relaxed">
                      <strong>Rejection Reason:</strong> {activeBusiness?.sender_id_rejection_reason || "Name does not match submitted registration records."}
                    </div>
                  )}

                  {senderIdStatus === "APPROVED" && (
                    <p className="text-xs text-emerald-800 mt-3 pt-3 border-t border-emerald-200/60 leading-relaxed">
                      ✓ Fully whitelisted. All outgoing SMS campaigns from <strong>{activeBusiness?.name}</strong> will show <strong>{currentSenderId}</strong> as the sender header.
                    </p>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-dashed border-zinc-300 text-center py-8">
                  <div className="text-xs text-zinc-500">
                    No custom Alphanumeric Sender ID registered yet. Outgoing SMS currently uses our default carrier route (<strong>LJK_AGENCY</strong>).
                  </div>
                </div>
              )}
            </div>

            {/* Handset Live Mockup Preview */}
            <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs">
              <h3 className="text-sm font-bold text-zinc-900 mb-3">
                Recipient Handset Preview
              </h3>

              <div className="max-w-[280px] mx-auto bg-zinc-900 rounded-3xl p-3 shadow-xl border-4 border-zinc-800">
                <div className="bg-zinc-100 rounded-2xl p-3.5 space-y-3 min-h-[240px] flex flex-col justify-between">
                  <div className="text-center border-b border-zinc-200 pb-2">
                    <div className="w-8 h-8 rounded-full bg-[#581c87] text-white flex items-center justify-center text-xs font-bold mx-auto mb-1 shadow-2xs">
                      {(currentSenderId || "LJK")[0]}
                    </div>
                    <div className="font-mono font-bold text-xs text-zinc-900 tracking-wider">
                      {currentSenderId || "LJK_AGENCY"}
                    </div>
                    <div className="text-[9px] text-zinc-400">Carrier SMS</div>
                  </div>

                  <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-xs border border-zinc-200 text-[11px] text-zinc-800 leading-relaxed space-y-1">
                    <p>{smsPreviewText}</p>
                    <div className="text-[9px] text-zinc-400 text-right">Just now &bull; Delivered</div>
                  </div>

                  <div className="bg-zinc-200/80 rounded-full px-3 py-1.5 text-[10px] text-zinc-500 text-center">
                    Text message (SMS)
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-[11px] font-semibold text-zinc-600 mb-1">
                  Test SMS Sample Content
                </label>
                <input
                  type="text"
                  value={smsPreviewText}
                  onChange={(e) => setSmsPreviewText(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#581c87]"
                />
              </div>
            </div>
          </div>

          {/* Right 5 cols: Registration Form */}
          <div className="lg:col-span-5 bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs h-fit space-y-4">
            <div>
              <h2 className="text-base font-bold text-zinc-900">
                {currentSenderId ? "Update / Re-request Sender ID" : "Register Brand Sender ID"}
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Submit your brand name for telco whitelisting across Safaricom and Airtel.
              </p>
            </div>

            <SenderIdRegistrationForm
              key={activeBusiness?.reference || "new"}
              activeBusiness={activeBusiness}
            />
          </div>
        </div>
      )}

      {/* Modal: Connect via Meta Phone Number ID */}
      {isIdModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-zinc-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-zinc-900">
                  Connect via Phone Number ID
                </h3>
                <p className="text-xs text-zinc-500">
                  Connect your WhatsApp Business number directly using your Meta ID.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsIdModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 text-sm font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleDirectConnectSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">
                  Meta Phone Number ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 104598273618492"
                  value={directPhoneId}
                  onChange={(e) => setDirectPhoneId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  Found in Meta Business Suite &gt; WhatsApp &gt; Phone Numbers.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">
                  Phone Number (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. +254 712 345 678"
                  value={directDisplayPhone}
                  onChange={(e) => setDirectDisplayPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">
                  Verified Brand Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder={activeBusiness?.name || "Your Company Brand"}
                  value={directVerifiedName}
                  onChange={(e) => setDirectVerifiedName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsIdModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-zinc-300 text-zinc-700 font-semibold hover:bg-zinc-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={connectWhatsAppMutation.isPending}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold cursor-pointer disabled:opacity-50"
                >
                  {connectWhatsAppMutation.isPending ? "Connecting..." : "Connect Number"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
