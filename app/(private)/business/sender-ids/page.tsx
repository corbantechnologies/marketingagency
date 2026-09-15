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
  useToggleWhatsAppMode,
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
          Requested Brand Name (Max 11 chars) *
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

  // Active channel view tab
  const [activeTab, setActiveTab] = useState<"whatsapp" | "sms">("whatsapp");

  // Meta Signup & Connect Hooks
  const connectWhatsAppMutation = useConnectWhatsApp();
  const disconnectWhatsAppMutation = useDisconnectWhatsApp();
  const toggleWhatsAppModeMutation = useToggleWhatsAppMode();
  const refreshWhatsAppMutation = useRefreshWhatsAppStatus();

  // Local state for manual connect / simulation modal
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualPhoneId, setManualPhoneId] = useState("");
  const [manualWabaId, setManualWabaId] = useState("");
  const [manualDisplayPhone, setManualDisplayPhone] = useState("");
  const [manualVerifiedName, setManualVerifiedName] = useState("");

  // Preview message text
  const [waPreviewText, setWaPreviewText] = useState(
    "Hello John! 🎉 Special update from our team: Enjoy 20% off all new collections this weekend only! Use code SAVE20 at checkout."
  );
  const [smsPreviewText, setSmsPreviewText] = useState(
    "Hello John, your order #5432 has been confirmed and dispatched! Thank you for shopping with us."
  );

  const isWaConnected = activeBusiness?.whatsapp_onboarding_status === "CONNECTED";
  const currentWaMode = activeBusiness?.whatsapp_onboarding_mode || "SHARED";
  const senderIdStatus = activeBusiness?.sender_id_status || "PENDING";
  const currentSenderId = activeBusiness?.sender_id || "";

  // Trigger Meta Embedded Signup popup
  const handleLaunchMetaSignup = async () => {
    if (!activeBusiness) {
      toast.error("No active business workspace found.");
      return;
    }

    toast.loading("Opening Meta WhatsApp Signup...", { id: "meta-signup" });

    try {
      const result = await launchWhatsAppEmbeddedSignup();
      toast.loading("Linking WhatsApp account to LJK Platform...", { id: "meta-signup" });

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
      toast.error(err?.message || "Meta Signup dialog closed or cancelled.", {
        id: "meta-signup",
      });
    }
  };

  // Submit manual connection payload
  const handleManualConnectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBusiness) return;

    if (!manualPhoneId.trim()) {
      toast.error("Phone Number ID is required");
      return;
    }

    connectWhatsAppMutation.mutate(
      {
        reference: activeBusiness.reference,
        payload: {
          phone_number_id: manualPhoneId.trim(),
          waba_id: manualWabaId.trim() || undefined,
          display_phone_number: manualDisplayPhone.trim() || undefined,
          verified_name: manualVerifiedName.trim() || activeBusiness.name,
        },
      },
      {
        onSuccess: () => {
          toast.success("WhatsApp Business connected successfully!");
          setIsManualModalOpen(false);
          setManualPhoneId("");
          setManualWabaId("");
          setManualDisplayPhone("");
          setManualVerifiedName("");
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
    if (!confirm("Are you sure you want to disconnect your dedicated WhatsApp number? Broadcasts will revert to the LJK shared verified route.")) {
      return;
    }

    disconnectWhatsAppMutation.mutate(activeBusiness.reference, {
      onSuccess: () => {
        toast.success("Dedicated WhatsApp number disconnected.");
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.error || "Failed to disconnect WhatsApp number");
      },
    });
  };

  // Toggle mode
  const handleToggleMode = (mode: "SHARED" | "DEDICATED") => {
    if (!activeBusiness) return;
    toggleWhatsAppModeMutation.mutate(
      { reference: activeBusiness.reference, mode },
      {
        onSuccess: () => {
          toast.success(`Active WhatsApp route switched to ${mode === "DEDICATED" ? "Dedicated Brand Number" : "LJK Agency Verified Route"}`);
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.error || "Failed to change routing mode");
        },
      }
    );
  };

  // Live Refresh
  const handleRefreshStatus = () => {
    if (!activeBusiness) return;
    refreshWhatsAppMutation.mutate(activeBusiness.reference, {
      onSuccess: (res) => {
        toast.success(res.message || "WhatsApp status refreshed from Meta Cloud API!");
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.error || "Failed to refresh Meta status");
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
            Channels &amp; Brand Identities Hub
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 mt-0.5">
            Manage your official Meta WhatsApp Business Accounts and telecom Alphanumeric SMS Sender IDs in one unified center.
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
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-sm">
              Meta Official
            </span>
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
            <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded-sm">
              Safaricom &bull; Airtel
            </span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-xs text-zinc-500">
          Loading channel configurations...
        </div>
      ) : activeTab === "whatsapp" ? (
        /* ====================================================================
           WHATSAPP BUSINESS TAB
           ==================================================================== */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 7 Columns: Connection, Routing, and Live Status */}
          <div className="lg:col-span-7 space-y-6">
            {/* Meta Verified Provider Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950 to-emerald-900 text-white shadow-xs border border-emerald-800/40 relative overflow-hidden">
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-800/60 text-emerald-200 text-[10px] font-bold tracking-wider uppercase border border-emerald-700/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Meta Verified Tech Provider Platform
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    Corban Technologies LTD &times; Meta Cloud API
                  </h3>
                  <p className="text-xs text-emerald-200/90 leading-relaxed max-w-xl">
                    Connect your own branded WhatsApp Business phone number in under 60 seconds with zero manual API keys or webhook setup.
                  </p>
                </div>
                <div className="shrink-0 flex sm:flex-col items-center gap-2">
                  <span className="text-[11px] font-semibold text-emerald-300">
                    App ID: 1538356980456108
                  </span>
                </div>
              </div>
            </div>

            {/* Dual Route Architecture Card */}
            <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div>
                  <h2 className="text-base font-bold text-zinc-900">
                    Active Broadcast Delivery Route
                  </h2>
                  <p className="text-xs text-zinc-500">
                    Select how your WhatsApp marketing and transactional campaigns are dispatched to customer handsets.
                  </p>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                  currentWaMode === "DEDICATED"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-blue-50 text-blue-800 border-blue-200"
                }`}>
                  Current: {currentWaMode === "DEDICATED" ? "Dedicated Brand Number" : "LJK Shared Route"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Route Option 1: Shared Agency Route */}
                <div className={`p-4 rounded-xl border transition-all ${
                  currentWaMode === "SHARED"
                    ? "bg-purple-50/40 border-[#581c87] ring-1 ring-[#581c87]"
                    : "bg-zinc-50 border-zinc-200 hover:border-zinc-300"
                }`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-900 uppercase">
                        <span>LJK Verified Agency Route</span>
                      </div>
                      <div className="text-sm font-bold text-zinc-900 font-mono">
                        +254 740 964 423
                      </div>
                      <div className="text-[11px] text-zinc-500 leading-relaxed">
                        Default zero-setup route. Pre-approved for Tier-2 high throughput broadcasts. Zero setup fees or verification wait.
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-200/60 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                      ✓ Instant Active
                    </span>
                    <button
                      type="button"
                      disabled={currentWaMode === "SHARED" || toggleWhatsAppModeMutation.isPending}
                      onClick={() => handleToggleMode("SHARED")}
                      className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                        currentWaMode === "SHARED"
                          ? "bg-purple-200/80 text-purple-900 cursor-default"
                          : "bg-zinc-900 text-white hover:bg-zinc-800"
                      }`}
                    >
                      {currentWaMode === "SHARED" ? "Selected Route" : "Select Route"}
                    </button>
                  </div>
                </div>

                {/* Route Option 2: Dedicated Brand Route */}
                <div className={`p-4 rounded-xl border transition-all ${
                  currentWaMode === "DEDICATED"
                    ? "bg-emerald-50/40 border-emerald-600 ring-1 ring-emerald-600"
                    : "bg-zinc-50 border-zinc-200 hover:border-zinc-300"
                }`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-900 uppercase">
                        <span>Dedicated Brand Number</span>
                      </div>
                      <div className="text-sm font-bold text-zinc-900 font-mono">
                        {activeBusiness?.whatsapp_display_phone_number || (isWaConnected ? "Connected WABA" : "Not Linked Yet")}
                      </div>
                      <div className="text-[11px] text-zinc-500 leading-relaxed">
                        {isWaConnected
                          ? `Registered under ${activeBusiness?.whatsapp_verified_name || activeBusiness?.name}. Displays your brand badge.`
                          : "Connect your official WhatsApp number via Meta Embedded Signup popup to unlock branded broadcasts."}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-200/60 flex items-center justify-between">
                    <span className={`text-[11px] font-semibold flex items-center gap-1 ${
                      isWaConnected ? "text-emerald-700" : "text-zinc-400"
                    }`}>
                      {isWaConnected ? "✓ Verified & Linked" : "Not Connected"}
                    </span>
                    {isWaConnected ? (
                      <button
                        type="button"
                        disabled={currentWaMode === "DEDICATED" || toggleWhatsAppModeMutation.isPending}
                        onClick={() => handleToggleMode("DEDICATED")}
                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                          currentWaMode === "DEDICATED"
                            ? "bg-emerald-200/80 text-emerald-900 cursor-default"
                            : "bg-emerald-600 text-white hover:bg-emerald-700"
                        }`}
                      >
                        {currentWaMode === "DEDICATED" ? "Selected Route" : "Select Route"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleLaunchMetaSignup}
                        className="px-3 py-1 text-xs font-semibold rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer"
                      >
                        Connect
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Dedicated Number Health & Controls Card */}
            {isWaConnected ? (
              <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-3">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-zinc-900 flex items-center gap-2">
                      <span>{activeBusiness?.whatsapp_verified_name || activeBusiness?.name}</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        Meta Official
                      </span>
                    </h3>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Phone Number: <strong>{activeBusiness?.whatsapp_display_phone_number || "Active"}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={refreshWhatsAppMutation.isPending}
                      onClick={handleRefreshStatus}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <svg className={`w-3.5 h-3.5 text-zinc-500 ${refreshWhatsAppMutation.isPending ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Sync Meta Health</span>
                    </button>

                    <button
                      type="button"
                      disabled={disconnectWhatsAppMutation.isPending}
                      onClick={handleDisconnect}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                    <div className="text-[10px] font-semibold text-zinc-400 uppercase">Quality Rating</div>
                    <div className="font-bold text-zinc-900 mt-1 flex items-center gap-1">
                      <span className={`w-2 h-2 rounded-full ${
                        activeBusiness?.whatsapp_quality_rating === "GREEN"
                          ? "bg-emerald-500"
                          : activeBusiness?.whatsapp_quality_rating === "YELLOW"
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`} />
                      <span>{activeBusiness?.whatsapp_quality_rating || "High Quality"}</span>
                    </div>
                  </div>

                  <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                    <div className="text-[10px] font-semibold text-zinc-400 uppercase">Phone Number ID</div>
                    <div className="font-mono text-zinc-800 text-[11px] truncate mt-1" title={activeBusiness?.whatsapp_phone_number_id || ""}>
                      {activeBusiness?.whatsapp_phone_number_id || "Meta ID"}
                    </div>
                  </div>

                  <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                    <div className="text-[10px] font-semibold text-zinc-400 uppercase">WABA Account ID</div>
                    <div className="font-mono text-zinc-800 text-[11px] truncate mt-1" title={activeBusiness?.whatsapp_business_account_id || ""}>
                      {activeBusiness?.whatsapp_business_account_id || "Meta WABA"}
                    </div>
                  </div>

                  <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                    <div className="text-[10px] font-semibold text-zinc-400 uppercase">Connection Date</div>
                    <div className="font-medium text-zinc-800 text-[11px] mt-1">
                      {activeBusiness?.whatsapp_connected_at
                        ? new Date(activeBusiness.whatsapp_connected_at).toLocaleDateString()
                        : "Active"}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Connect Card when not connected */
              <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-2xs">
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.696c1.001.572 1.777.834 2.806.834 3.181 0 5.767-2.586 5.768-5.766.001-3.18-2.585-5.767-5.768-5.767zm3.344 8.163c-.144.405-.837.774-1.17.824-.312.045-.694.072-2.146-.531-1.856-.772-3.053-2.658-3.146-2.781-.092-.123-.746-.991-.746-1.892 0-.901.472-1.343.64-1.525.17-.183.372-.228.496-.228.124 0 .248.002.356.007.114.005.267-.043.418.321.155.372.531 1.292.577 1.386.046.094.077.204.015.328-.061.123-.092.2-.184.307-.092.108-.194.24-.277.323-.092.092-.188.192-.081.376.108.184.478.788 1.026 1.277.705.628 1.3.822 1.485.914.185.092.293.077.401-.046.108-.123.463-.538.586-.723.123-.185.247-.154.417-.092.17.062 1.079.509 1.264.601.185.093.308.139.354.216.046.077.046.446-.098.851z" />
                  </svg>
                </div>

                <div className="max-w-md mx-auto space-y-1">
                  <h3 className="text-base font-bold text-zinc-900">
                    Connect Your Branded WhatsApp Number
                  </h3>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Log in with Facebook to link your official WhatsApp Business Account. Receive automated customer replies, display your official logo, and broadcast with your verified name.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleLaunchMetaSignup}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span>Connect with WhatsApp (Meta Embedded Signup)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsManualModalOpen(true)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-zinc-300 hover:bg-zinc-50 text-zinc-700 text-xs font-semibold transition-all cursor-pointer"
                  >
                    Manual / Sandbox Connect
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right 5 Columns: WhatsApp Handset Mockup Preview */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs">
              <h3 className="text-sm font-bold text-zinc-900 mb-1">
                WhatsApp Handset Preview
              </h3>
              <p className="text-xs text-zinc-500 mb-4">
                How your broadcast template appears on recipient devices.
              </p>

              {/* Smartphone Mockup */}
              <div className="max-w-xs mx-auto bg-zinc-900 rounded-3xl p-3 shadow-xl border-4 border-zinc-800">
                <div className="bg-[#e5ddd5] rounded-2xl overflow-hidden flex flex-col justify-between min-h-[380px] shadow-inner">
                  {/* WhatsApp Top Chat Header */}
                  <div className="bg-[#075e54] text-white p-3 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#075e54] font-bold text-xs flex items-center justify-center shrink-0">
                      {((currentWaMode === "DEDICATED" && activeBusiness?.whatsapp_verified_name) || activeBusiness?.name || "LJK")[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-xs truncate">
                          {currentWaMode === "DEDICATED"
                            ? (activeBusiness?.whatsapp_verified_name || activeBusiness?.name)
                            : "LJK Marketing Agency"}
                        </span>
                        {/* Official Green Tick */}
                        <svg className="w-3.5 h-3.5 text-emerald-300 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                          <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="text-[9px] text-emerald-100/80">
                        {currentWaMode === "DEDICATED"
                          ? (activeBusiness?.whatsapp_display_phone_number || "Official Business Account")
                          : "+254 740 964 423"}
                      </div>
                    </div>
                  </div>

                  {/* Message Body Area */}
                  <div className="p-3 space-y-2 flex-1">
                    <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-xs text-xs text-zinc-800 space-y-2 max-w-[90%]">
                      <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">
                        Universal Business Promo
                      </div>
                      <p className="text-[11px] leading-relaxed whitespace-pre-wrap">
                        {waPreviewText}
                      </p>
                      <div className="flex items-center justify-end gap-1 text-[9px] text-zinc-400">
                        <span>10:45 AM</span>
                        <span className="text-blue-500 font-bold">✓✓</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer reply prompt */}
                  <div className="bg-[#f0f0f0] px-3 py-2 border-t border-zinc-200 flex items-center gap-2">
                    <div className="flex-1 bg-white rounded-full px-3 py-1.5 text-[10px] text-zinc-400">
                      Reply to business...
                    </div>
                  </div>
                </div>
              </div>

              {/* Sample text editor */}
              <div className="mt-4">
                <label className="block text-[11px] font-semibold text-zinc-600 mb-1">
                  Preview Sample Content
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
           SMS SENDER ID TAB (Existing Telco Alphanumeric Whitelisting)
           ==================================================================== */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 7 cols: Status & Live Preview */}
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
                          Pending Telco Compliance Review
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
                      Your requested Sender ID is currently being processed with Safaricom &amp; Airtel. Typical turnaround time is <strong>12 to 24 hours</strong>. While pending, your SMS dispatches will use our shared high-throughput gateway.
                    </p>
                  )}

                  {senderIdStatus === "REJECTED" && (
                    <div className="text-xs text-red-700 mt-3 pt-3 border-t border-red-200/60 leading-relaxed">
                      <strong>Rejection Reason:</strong> {activeBusiness?.sender_id_rejection_reason || "Brand name does not match submitted business registration records."}
                    </div>
                  )}

                  {senderIdStatus === "APPROVED" && (
                    <p className="text-xs text-emerald-800 mt-3 pt-3 border-t border-emerald-200/60 leading-relaxed">
                      ✓ Fully whitelisted. All outgoing SMS campaigns from <strong>{activeBusiness?.name}</strong> will originate from <strong>{currentSenderId}</strong>.
                    </p>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-dashed border-zinc-300 text-center py-8">
                  <div className="text-xs text-zinc-500">
                    No custom Alphanumeric Sender ID registered yet. You are currently sending from our default shared routes (<strong>LJK_AGENCY</strong>).
                  </div>
                </div>
              )}
            </div>

            {/* Handset Live Mockup Preview */}
            <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs">
              <h3 className="text-sm font-bold text-zinc-900 mb-3">
                Recipient Handset Preview
              </h3>

              {/* Smartphone mockup */}
              <div className="max-w-xs mx-auto bg-zinc-900 rounded-3xl p-3 shadow-xl border-4 border-zinc-800">
                <div className="bg-zinc-100 rounded-2xl p-3.5 space-y-3 min-h-[260px] flex flex-col justify-between">
                  {/* SMS Header */}
                  <div className="text-center border-b border-zinc-200 pb-2">
                    <div className="w-8 h-8 rounded-full bg-[#581c87] text-white flex items-center justify-center text-xs font-bold mx-auto mb-1 shadow-2xs">
                      {(currentSenderId || "LJK")[0]}
                    </div>
                    <div className="font-mono font-bold text-xs text-zinc-900 tracking-wider">
                      {currentSenderId || "LJK_AGENCY"}
                    </div>
                    <div className="text-[9px] text-zinc-400">Direct Carrier Interconnect</div>
                  </div>

                  {/* SMS Bubble */}
                  <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-xs border border-zinc-200 text-[11px] text-zinc-800 leading-relaxed space-y-1">
                    <p>{smsPreviewText}</p>
                    <div className="text-[9px] text-zinc-400 text-right">Just now &bull; Delivered</div>
                  </div>

                  {/* Reply Input Mockup */}
                  <div className="bg-zinc-200/80 rounded-full px-3 py-1.5 text-[10px] text-zinc-500 text-center">
                    Text message (SMS)
                  </div>
                </div>
              </div>

              {/* Sample text editor */}
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

            {/* Regulation Guidelines */}
            <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs text-xs space-y-3">
              <h3 className="font-bold text-zinc-900">Communication Authority (CA) &amp; Carrier Guidelines</h3>
              <ul className="space-y-2 text-zinc-600 list-disc list-inside leading-relaxed">
                <li>Maximum length: <strong>11 alphanumeric characters</strong> (A–Z, 0–9, underscores).</li>
                <li>Generic names like &ldquo;INFO&rdquo;, &ldquo;OFFER&rdquo;, or &ldquo;BANK&rdquo; are prohibited by telco regulators.</li>
                <li>Sender ID must be associated with your registered business name or valid trademark.</li>
                <li>Whitelisting is submitted to Safaricom and Airtel Kenya carrier networks.</li>
              </ul>
            </div>
          </div>

          {/* Right 5 cols: Registration Form */}
          <div className="lg:col-span-5 bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs h-fit space-y-4">
            <div>
              <h2 className="text-base font-bold text-zinc-900">
                {currentSenderId ? "Update / Re-request Sender ID" : "Register Brand Sender ID"}
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Submit your official brand name for carrier whitelisting.
              </p>
            </div>

            <SenderIdRegistrationForm
              key={activeBusiness?.reference || "new"}
              activeBusiness={activeBusiness}
            />
          </div>
        </div>
      )}

      {/* Manual / Sandbox Connect Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-zinc-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-zinc-900">
                  Manual WhatsApp Number Linking
                </h3>
                <p className="text-xs text-zinc-500">
                  Connect via Phone Number ID for testing or staging environments.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsManualModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 text-sm font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleManualConnectSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">
                  Meta Phone Number ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 104598273618492"
                  value={manualPhoneId}
                  onChange={(e) => setManualPhoneId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">
                  WhatsApp Business Account (WABA) ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. 293847561029384"
                  value={manualWabaId}
                  onChange={(e) => setManualWabaId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">
                  Display Phone Number (Handset format)
                </label>
                <input
                  type="text"
                  placeholder="e.g. +254 712 345 678"
                  value={manualDisplayPhone}
                  onChange={(e) => setManualDisplayPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">
                  Verified Brand Name
                </label>
                <input
                  type="text"
                  placeholder={activeBusiness?.name || "Official Brand Name"}
                  value={manualVerifiedName}
                  onChange={(e) => setManualVerifiedName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-zinc-300 text-zinc-700 font-semibold hover:bg-zinc-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={connectWhatsAppMutation.isPending}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold cursor-pointer disabled:opacity-50"
                >
                  {connectWhatsAppMutation.isPending ? "Connecting..." : "Save & Connect"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
