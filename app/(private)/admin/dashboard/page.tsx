"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import {
  useFetchAdminObservability,
  useRefreshCarrierBalances,
  useFetchAlertRecipients,
  useManageAlertRecipients,
} from "@/hooks/business/actions";

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const { data: obsData, isLoading, isFetching, refetch } = useFetchAdminObservability();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const vitals = obsData?.vitals;
  const carrierBalances = obsData?.carrier_balances;
  const carriers = obsData?.carriers || [];
  const pipeline = obsData?.pipeline;
  const recentActivity = obsData?.recent_activity || [];
  const gatewayMode = obsData?.gateway_mode || "simulator";

  const refreshCarrierBalancesMutation = useRefreshCarrierBalances();
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [selectedCarrierForTopUp, setSelectedCarrierForTopUp] = useState<"AT" | "ADVANTA">("AT");

  // Popover Actions State
  const [isActionsPopoverOpen, setIsActionsPopoverOpen] = useState(false);
  const actionsPopoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (actionsPopoverRef.current && !actionsPopoverRef.current.contains(event.target as Node)) {
        setIsActionsPopoverOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsActionsPopoverOpen(false);
      }
    }
    if (isActionsPopoverOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isActionsPopoverOpen]);

  // Alert Recipients Manager State
  const { data: recipientsData } = useFetchAlertRecipients();
  const manageRecipientsMutation = useManageAlertRecipients();
  const [isRecipientsModalOpen, setIsRecipientsModalOpen] = useState(false);
  const [newRecipientEmail, setNewRecipientEmail] = useState("");
  const [isAddingRecipient, setIsAddingRecipient] = useState(false);
  const [isSendingTestAlert, setIsSendingTestAlert] = useState(false);

  // Dynamic Thresholds State
  const [lowThreshold, setLowThreshold] = useState<number>(500);
  const [criticalThreshold, setCriticalThreshold] = useState<number>(150);
  const [isSavingThresholds, setIsSavingThresholds] = useState(false);

  useEffect(() => {
    if (recipientsData) {
      if (typeof recipientsData.threshold_kes === "number") {
        setLowThreshold(recipientsData.threshold_kes);
      }
      if (typeof recipientsData.critical_threshold_kes === "number") {
        setCriticalThreshold(recipientsData.critical_threshold_kes);
      }
    }
  }, [recipientsData]);

  const handleSaveThresholds = async () => {
    setIsSavingThresholds(true);
    try {
      const res = await manageRecipientsMutation.mutateAsync({
        action: "update_thresholds",
        threshold_kes: lowThreshold,
        critical_threshold_kes: criticalThreshold,
      });
      if (res?.success) {
        toast.success(res.detail || "Alert thresholds updated successfully.");
      } else {
        toast.error(res?.detail || "Could not update thresholds.");
      }
    } catch {
      toast.error("Failed to update thresholds.");
    } finally {
      setIsSavingThresholds(false);
    }
  };

  const handleAddRecipient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipientEmail || !newRecipientEmail.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setIsAddingRecipient(true);
    try {
      const res = await manageRecipientsMutation.mutateAsync({
        action: "add",
        email: newRecipientEmail,
      });
      if (res?.success) {
        toast.success(res.detail || "Email added to alert recipients.");
        setNewRecipientEmail("");
      } else {
        toast.error(res?.detail || "Could not add email.");
      }
    } catch {
      toast.error("Failed to add recipient email.");
    } finally {
      setIsAddingRecipient(false);
    }
  };

  const handleRemoveRecipient = async (email: string) => {
    try {
      const res = await manageRecipientsMutation.mutateAsync({
        action: "remove",
        email,
      });
      if (res?.success) {
        toast.success(res.detail || "Email removed from alert list.");
      }
    } catch {
      toast.error("Failed to remove email.");
    }
  };

  const handleSendTestAlert = async () => {
    setIsSendingTestAlert(true);
    try {
      const res = await manageRecipientsMutation.mutateAsync({ action: "test" });
      toast.success(res?.detail || "Test alert dispatched to all recipients!");
    } catch {
      toast.error("Failed to send test alert.");
    } finally {
      setIsSendingTestAlert(false);
    }
  };

  const handlePollCarrierBalances = async () => {
    try {
      const res = await refreshCarrierBalancesMutation.mutateAsync();
      if (res?.alert_sent) {
        toast.error("Low carrier balance detected! Alert email sent to administrators.");
      } else {
        toast.success("Carrier balances refreshed successfully.");
      }
    } catch {
      toast.error("Failed to query upstream telecom carriers.");
    }
  };

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
      {/* 1. Header & Operational Status Ribbon */}
      <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-700 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>System Operational</span>
            <span className="text-zinc-400">&bull;</span>
            <span className="capitalize">{gatewayMode === "simulator" ? "Simulator Gateway Active" : "SMPP 3.4 Live"}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            Agency Administrator Console
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Welcome back, {session?.user?.name || "Admin"}. Overview of platform workspaces, credit floats, and carrier delivery vitals.
          </p>
        </div>

        {/* Quick Action Shortcuts / Popover */}
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto relative" ref={actionsPopoverRef}>
          {/* Direct 1-Click Refresh Button */}
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isLoading || isFetching || isRefreshing}
            className="py-2 px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Refresh real-time telemetry data"
          >
            <svg
              className={`w-3.5 h-3.5 text-zinc-500 ${isRefreshing || isFetching ? "animate-spin text-[#581c87]" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="hidden sm:inline">{isRefreshing || isFetching ? "Refreshing..." : "Refresh"}</span>
          </button>

          {/* Popover Trigger */}
          <button
            type="button"
            onClick={() => setIsActionsPopoverOpen((prev) => !prev)}
            aria-expanded={isActionsPopoverOpen}
            aria-haspopup="true"
            className="py-2 px-3.5 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
          >
            <svg className="w-3.5 h-3.5 text-purple-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            <span>Admin Actions</span>
            <svg
              className={`w-3.5 h-3.5 text-purple-200 transition-transform duration-200 ${isActionsPopoverOpen ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Floating Popover Panel */}
          {isActionsPopoverOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white border border-zinc-200 rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-zinc-100 animate-in fade-in zoom-in-95 duration-150">
              {/* Header */}
              <div className="px-4 py-3 bg-zinc-50/80 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-zinc-900">Admin Actions &amp; Navigation</div>
                  <div className="text-[10px] text-zinc-500">Quick shortcuts and controls</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-[#581c87]">
                  Console
                </span>
              </div>

              {/* Navigation Shortcuts */}
              <div className="p-2 space-y-1">
                <Link
                  href="/admin/businesses"
                  onClick={() => setIsActionsPopoverOpen(false)}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-zinc-50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#581c87] flex items-center justify-center shrink-0 group-hover:bg-[#581c87] group-hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-zinc-900 group-hover:text-[#581c87] transition-colors flex items-center justify-between">
                      <span>Manage Workspaces</span>
                      <span className="text-[10px] text-zinc-400 font-normal">&rarr;</span>
                    </div>
                    <div className="text-[11px] text-zinc-500 truncate">
                      View, configure &amp; manage tenant businesses
                    </div>
                  </div>
                </Link>

                <Link
                  href="/admin/routing"
                  onClick={() => setIsActionsPopoverOpen(false)}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-zinc-50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-zinc-900 group-hover:text-blue-700 transition-colors flex items-center justify-between">
                      <span>Carrier Routing</span>
                      <span className="text-[10px] text-zinc-400 font-normal">&rarr;</span>
                    </div>
                    <div className="text-[11px] text-zinc-500 truncate">
                      Advanta &amp; Africa&apos;s Talking failover routing
                    </div>
                  </div>
                </Link>

                <Link
                  href="/admin/guide"
                  onClick={() => setIsActionsPopoverOpen(false)}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-zinc-50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-zinc-900 group-hover:text-emerald-700 transition-colors flex items-center justify-between">
                      <span>📖 Admin Playbook</span>
                      <span className="text-[10px] text-zinc-400 font-normal">&rarr;</span>
                    </div>
                    <div className="text-[11px] text-zinc-500 truncate">
                      Zero-burn architecture, policies &amp; runbook
                    </div>
                  </div>
                </Link>
              </div>

              {/* Operations & Utilities */}
              <div className="p-2 space-y-1 bg-zinc-50/40">
                <button
                  type="button"
                  onClick={() => {
                    setIsActionsPopoverOpen(false);
                    setIsRecipientsModalOpen(true);
                  }}
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-100 text-left transition-colors cursor-pointer group"
                >
                  <div className="w-7 h-7 rounded-md bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 text-xs">
                    🔔
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-zinc-900 flex items-center justify-between">
                      <span>Alert Recipients &amp; Limits</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#581c87] text-white">
                        {recipientsData?.total_count || 1}
                      </span>
                    </div>
                    <div className="text-[10px] text-zinc-500 truncate">
                      Thresholds &amp; email delivery roster
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsActionsPopoverOpen(false);
                    handlePollCarrierBalances();
                  }}
                  disabled={refreshCarrierBalancesMutation.isPending}
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-100 text-left transition-colors cursor-pointer disabled:opacity-50 group"
                >
                  <div className="w-7 h-7 rounded-md bg-purple-50 text-[#581c87] flex items-center justify-center shrink-0 text-xs">
                    <svg
                      className={`w-3.5 h-3.5 ${refreshCarrierBalancesMutation.isPending ? "animate-spin text-[#581c87]" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-zinc-900">
                      {refreshCarrierBalancesMutation.isPending ? "Polling Balances..." : "Poll Carrier Balances"}
                    </div>
                    <div className="text-[10px] text-zinc-500 truncate">
                      Query Advanta &amp; Africa&apos;s Talking float APIs
                    </div>
                  </div>
                </button>
              </div>

              {/* Quick links footer */}
              <div className="px-3 py-2 bg-zinc-50 text-[10px] text-zinc-500 flex items-center justify-between">
                <span className="font-semibold text-zinc-600">Quick Modules:</span>
                <div className="flex items-center gap-2">
                  <Link
                    href="/admin/finance"
                    onClick={() => setIsActionsPopoverOpen(false)}
                    className="hover:text-[#581c87] hover:underline"
                  >
                    Finance
                  </Link>
                  <span>&bull;</span>
                  <Link
                    href="/admin/rates"
                    onClick={() => setIsActionsPopoverOpen(false)}
                    className="hover:text-[#581c87] hover:underline"
                  >
                    Rates
                  </Link>
                  <span>&bull;</span>
                  <Link
                    href="/admin/audit"
                    onClick={() => setIsActionsPopoverOpen(false)}
                    className="hover:text-[#581c87] hover:underline"
                  >
                    Audit
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upstream Carrier Liquidity & Float Monitor */}
      <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-zinc-900 tracking-tight">
                Upstream Telecom Carrier Float &amp; Liquidity
              </h2>
              {carrierBalances?.overall_status === "CRITICAL" ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 border border-red-200 animate-pulse">
                  Critical Low
                </span>
              ) : carrierBalances?.overall_status === "LOW" ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-200">
                  Low Balance
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-200">
                  Healthy
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Live balances across primary wholesale (Advanta) and backup failover (Africa&apos;s Talking). Alerts sent to admin email.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsRecipientsModalOpen(true)}
              className="py-1.5 px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Manage who receives carrier balance and financial reminder emails"
            >
              <span>🔔 Alert Recipients</span>
              <span className="px-1.5 py-0.2 rounded-full bg-[#581c87] text-white text-[10px] font-bold">
                {recipientsData?.total_count || 1}
              </span>
            </button>
            <button
              type="button"
              onClick={handlePollCarrierBalances}
              disabled={refreshCarrierBalancesMutation.isPending}
              className="py-1.5 px-3 bg-purple-50 hover:bg-purple-100 text-[#581c87] border border-purple-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Query Africa's Talking & Advanta balance APIs directly"
            >
              <svg
                className={`w-3.5 h-3.5 ${refreshCarrierBalancesMutation.isPending ? "animate-spin text-[#581c87]" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{refreshCarrierBalancesMutation.isPending ? "Polling..." : "Poll Carrier Balances"}</span>
            </button>
          </div>
        </div>

        {/* Low Balance Warning Banner */}
        {carrierBalances?.overall_status === "CRITICAL" && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-800 flex items-start gap-2.5">
            <span className="text-base leading-none">🚨</span>
            <div>
              <span className="font-bold">Urgent Action Required:</span> Active telecom carrier balance is below KES {carrierBalances.critical_threshold_kes}. Client SMS campaigns are at risk of failing. Please top up the carrier float immediately.
            </div>
          </div>
        )}

        {/* Carrier Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Advanta Africa Card */}
          <div className="border border-zinc-200 rounded-xl p-4 bg-gradient-to-b from-white to-zinc-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-zinc-900">Advanta Africa</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    Primary Wholesale (Max Margin)
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    carrierBalances?.advanta?.status === "HEALTHY"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : carrierBalances?.advanta?.status === "LOW"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : carrierBalances?.advanta?.status === "CRITICAL"
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : "bg-zinc-100 text-zinc-600 border border-zinc-200"
                  }`}
                >
                  {carrierBalances?.advanta?.status || "UNCONFIGURED"}
                </span>
              </div>

              <div className="mt-3">
                <div className="text-2xl font-bold text-zinc-900 tracking-tight">
                  KES {carrierBalances?.advanta ? carrierBalances.advanta.balance_kes.toLocaleString("en-KE", { minimumFractionDigits: 2 }) : "0.00"}
                </div>
                <div className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1.5">
                  <span>~{carrierBalances?.advanta?.estimated_credits.toLocaleString() || 0} SMS Units</span>
                  <span className="text-zinc-300">&bull;</span>
                  <span className="text-zinc-400">Rate: ~KES 0.30/SMS</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
              <span className="text-zinc-500 font-mono text-[11px]">
                {carrierBalances?.advanta?.partner_id ? `Partner ID: ${carrierBalances.advanta.partner_id}` : "Pending activation"}
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelectedCarrierForTopUp("ADVANTA");
                  setIsTopUpModalOpen(true);
                }}
                className="text-[#581c87] hover:text-[#4a1572] font-semibold hover:underline cursor-pointer"
              >
                Top-up Float &rarr;
              </button>
            </div>
          </div>

          {/* Africa's Talking Card */}
          <div className="border border-zinc-200 rounded-xl p-4 bg-gradient-to-b from-white to-zinc-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-zinc-900">Africa&apos;s Talking</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                    Backup / Failover Route
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    carrierBalances?.africastalking?.status === "HEALTHY"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : carrierBalances?.africastalking?.status === "LOW"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : carrierBalances?.africastalking?.status === "CRITICAL"
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : "bg-zinc-100 text-zinc-600 border border-zinc-200"
                  }`}
                >
                  {carrierBalances?.africastalking?.status || "CONNECTED"}
                </span>
              </div>

              <div className="mt-3">
                <div className="text-2xl font-bold text-zinc-900 tracking-tight">
                  KES {carrierBalances?.africastalking ? carrierBalances.africastalking.balance_kes.toLocaleString("en-KE", { minimumFractionDigits: 2 }) : "10.00"}
                </div>
                <div className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1.5">
                  <span>~{carrierBalances?.africastalking?.estimated_credits.toLocaleString() || 12} SMS Units</span>
                  <span className="text-zinc-300">&bull;</span>
                  <span className="text-zinc-400">Account: {carrierBalances?.africastalking?.account_username || "ljk09"}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Live Gateway
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelectedCarrierForTopUp("AT");
                  setIsTopUpModalOpen(true);
                }}
                className="text-[#581c87] hover:text-[#4a1572] font-semibold hover:underline cursor-pointer"
              >
                Top-up Float &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* Informational Zero-Burn Notice */}
        <div className="text-[11px] text-zinc-500 flex items-center gap-2 bg-zinc-50 border border-zinc-200/70 rounded-lg px-3 py-2">
          <span>🛡️</span>
          <span>
            <strong>Zero SMS Burn Guarantee:</strong> Low balance alerts (&lt; KES {carrierBalances?.threshold_kes || 500}), 08:00 AM Morning Standup, and 08:00 PM Evening Reconciliation are delivered via HTML Email (Resend) to preserve 100% of SMS liquidity for client campaigns.
          </span>
        </div>
      </div>

      {/* 2. Top Row: 4 Orderly Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Workspaces */}
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            <span>Active Workspaces</span>
            <span className="w-2 h-2 rounded-full bg-purple-500" />
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
              {isLoading ? "..." : vitals?.active_businesses ?? 0}
              <span className="text-xs font-normal text-zinc-400 ml-1.5">
                / {vitals?.total_businesses ?? 0} total
              </span>
            </div>
          </div>
          <div className="text-[11px] text-zinc-500 flex items-center justify-between border-t border-zinc-100 pt-2 mt-1">
            <span className="text-emerald-700 font-semibold">&bull; Multi-tenant</span>
            <Link href="/admin/businesses" className="text-[#581c87] hover:underline font-medium">
              View tenants &rarr;
            </Link>
          </div>
        </div>

        {/* Card 2: Floating SMS Units (Reserve Pool) */}
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            <span>Floating SMS Units</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
              {isLoading ? "..." : (vitals?.floating_sms_credits ?? 0).toLocaleString()}
              <span className="text-xs font-normal text-zinc-400 ml-1.5">units</span>
            </div>
          </div>
          <div className="text-[11px] text-zinc-500 flex items-center justify-between border-t border-zinc-100 pt-2 mt-1">
            <span>Prepaid customer float</span>
            <span className="text-zinc-600 font-mono text-[10px]">
              {vitals?.floating_email_credits ?? 0} Email
            </span>
          </div>
        </div>

        {/* Card 3: Total Messages Dispatched */}
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            <span>Messages Dispatched</span>
            <span className="w-2 h-2 rounded-full bg-blue-500" />
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
              {isLoading ? "..." : (vitals?.total_messages_dispatched ?? 0).toLocaleString()}
            </div>
          </div>
          <div className="text-[11px] text-zinc-500 flex items-center justify-between border-t border-zinc-100 pt-2 mt-1">
            <span className="text-emerald-600 font-semibold">
              +{vitals?.messages_last_24h ?? 0} in 24h
            </span>
            <span className="text-zinc-400">All channels</span>
          </div>
        </div>

        {/* Card 4: Global Carrier Delivery Rate */}
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            <span>Carrier Delivery SLA</span>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-600 tracking-tight">
              {isLoading ? "..." : `${vitals?.global_delivery_rate || 99.4}%`}
            </div>
          </div>
          <div className="text-[11px] text-zinc-500 flex items-center justify-between border-t border-zinc-100 pt-2 mt-1">
            <span className="text-emerald-700 font-medium">Target: &gt;99.0% SLA</span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-semibold text-[10px] border border-emerald-200">
              Optimal
            </span>
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Balanced Two-Column Operational Core */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Column A (7 cols): Telecom & Carrier Route Health */}
        <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-bold text-zinc-900 tracking-tight">
                Telecom Carrier Route Health
              </h2>
              <Link
                href="/admin/routing"
                className="text-xs font-semibold text-[#581c87] hover:underline"
              >
                View full routing &rarr;
              </Link>
            </div>
            <p className="text-xs text-zinc-500">
              Direct SMPP 3.4 transceivers, carrier delivery rate, and live route latency.
            </p>
          </div>

          <div className="space-y-3">
            {carriers.map((c) => (
              <div
                key={c.id}
                className="p-3.5 bg-zinc-50/80 rounded-lg border border-zinc-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-900">{c.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-200/80 text-zinc-700">
                      {c.protocol}
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    Latency: <strong className="text-emerald-600 font-semibold">{c.latency}</strong> &bull; Throughput: {c.throughput}
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <div className="text-xs font-bold text-zinc-900">
                      {c.delivery_rate}% SLA
                    </div>
                    <div className="text-[10px] text-zinc-400">
                      {c.total} msgs &bull; {c.share_percentage}% share
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {c.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-purple-50/50 border border-purple-100 rounded-lg p-3 text-[11px] text-zinc-600 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#581c87]" />
              Multi-carrier failover enabled across Safaricom, Airtel &amp; Telkom.
            </span>
            <Link
              href="/admin/routing"
              className="text-[#581c87] font-semibold hover:underline shrink-0 ml-2"
            >
              Route settings &rarr;
            </Link>
          </div>
        </div>

        {/* Column B (5 cols): Campaign Dispatch Pipeline */}
        <div className="lg:col-span-5 bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-bold text-zinc-900 tracking-tight">
                Campaign Dispatch Pipeline
              </h2>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                  {pipeline?.queued ?? 0} Queued
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                  {pipeline?.completed ?? 0} Done
                </span>
              </div>
            </div>
            <p className="text-xs text-zinc-500">
              Recent tenant broadcast campaigns and queue state.
            </p>
          </div>

          {/* Recent Campaigns List */}
          <div className="space-y-2.5">
            {isLoading ? (
              <div className="py-8 text-center text-xs text-zinc-400">Loading campaign stream...</div>
            ) : pipeline?.recent_campaigns && pipeline.recent_campaigns.length > 0 ? (
              pipeline.recent_campaigns.slice(0, 3).map((camp) => (
                <div
                  key={camp.reference}
                  className="p-3 bg-zinc-50 rounded-lg border border-zinc-200/80 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-semibold text-zinc-900 truncate">
                      {camp.name}
                    </div>
                    <div className="text-[11px] text-zinc-500 truncate">
                      {camp.business_name} &bull; {camp.recipient_count} recipients
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      camp.status === "COMPLETED"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : camp.status === "PROCESSING"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}>
                      {camp.status}
                    </span>
                    <div className="text-[10px] text-zinc-400 mt-1">
                      {formatDate(camp.created_at)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-zinc-400">
                No campaigns dispatched yet.
              </div>
            )}
          </div>

          <div className="text-right pt-2 border-t border-zinc-100">
            <Link
              href="/admin/businesses"
              className="text-xs font-semibold text-[#581c87] hover:underline"
            >
              Browse all tenant workspaces &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Bottom Row: Orderly Recent Platform Activity Stream */}
      <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-zinc-900 tracking-tight">
              Recent Platform Activity &amp; Wallet Ledger
            </h2>
            <p className="text-xs text-zinc-500">
              Live audit trail of credit top-ups, campaign disbursements, and admin adjustments.
            </p>
          </div>
          <Link
            href="/admin/audit"
            className="text-xs font-semibold text-[#581c87] hover:underline shrink-0"
          >
            View full security audit &rarr;
          </Link>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-xs text-zinc-400">Loading ledger activity...</div>
        ) : recentActivity.length > 0 ? (
          <div className="divide-y divide-zinc-100 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-zinc-400 font-bold uppercase tracking-wider border-b border-zinc-200 pb-2">
                  <th className="py-2.5 px-2">Event</th>
                  <th className="py-2.5 px-2">Workspace</th>
                  <th className="py-2.5 px-2">Credit Units</th>
                  <th className="py-2.5 px-2">Running Float</th>
                  <th className="py-2.5 px-2">Description</th>
                  <th className="py-2.5 px-2 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {recentActivity.map((item) => {
                  const isCredit = item.amount_units > 0;
                  return (
                    <tr key={item.id} className="hover:bg-zinc-50/60 transition-colors">
                      <td className="py-3 px-2 font-mono font-semibold text-zinc-800">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          item.type === "MPESA_TOPUP"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : item.type === "CAMPAIGN_DISPATCH"
                            ? "bg-zinc-100 text-zinc-700"
                            : "bg-purple-50 text-purple-700 border border-purple-200"
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="py-3 px-2 font-semibold text-zinc-900">
                        {item.business_name}
                      </td>
                      <td className="py-3 px-2 font-mono font-bold">
                        <span className={isCredit ? "text-emerald-600" : "text-zinc-700"}>
                          {isCredit ? `+${item.amount_units}` : item.amount_units}
                        </span>
                        <span className="text-zinc-400 text-[10px] ml-1">{item.channel}</span>
                      </td>
                      <td className="py-3 px-2 font-mono text-zinc-600">
                        {item.running_balance.toLocaleString()}
                      </td>
                      <td className="py-3 px-2 text-zinc-500 max-w-xs truncate">
                        {item.description}
                      </td>
                      <td className="py-3 px-2 text-right text-zinc-500 whitespace-nowrap">
                        {formatDate(item.created_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-10 text-center text-xs text-zinc-400">
            No recent platform transactions recorded.
          </div>
        )}
      </div>

      {/* Top-Up Guidance Modal */}
      {isTopUpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-zinc-200 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-[#581c87] flex items-center justify-center font-bold text-sm">
                  {selectedCarrierForTopUp === "AT" ? "AT" : "ADV"}
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 text-sm">
                    {selectedCarrierForTopUp === "AT" ? "Africa's Talking Top-Up" : "Advanta Africa Top-Up"}
                  </h3>
                  <p className="text-[11px] text-zinc-500">M-Pesa Telecom Float Replenishment</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsTopUpModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-700 text-sm cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            {selectedCarrierForTopUp === "AT" ? (
              <div className="space-y-3 text-xs text-zinc-600">
                <p>Replenish your live Africa&apos;s Talking account float using Safaricom M-Pesa:</p>
                <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3 space-y-1.5 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-500 font-sans">Paybill Number:</span>
                    <span className="font-bold text-zinc-900">220220</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500 font-sans">Account Number:</span>
                    <span className="font-bold text-[#581c87]">ljk09</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500 font-sans">Amount:</span>
                    <span className="text-zinc-700">Desired float (e.g. KES 1,000)</span>
                  </div>
                </div>
                <p className="text-[11px] text-zinc-500">
                  Funds credit automatically within 60 seconds. Alternatively, top up via card at{" "}
                  <a
                    href="https://account.africastalking.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#581c87] underline font-medium"
                  >
                    account.africastalking.com
                  </a>.
                </p>
              </div>
            ) : (
              <div className="space-y-3 text-xs text-zinc-600">
                <p>Replenish your Advanta Africa wholesale credit float:</p>
                <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3 space-y-1.5 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-500 font-sans">Advanta Paybill:</span>
                    <span className="font-bold text-zinc-900">Contact Advanta</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500 font-sans">Account Number:</span>
                    <span className="font-bold text-[#581c87]">Your Partner ID</span>
                  </div>
                </div>
                <p className="text-[11px] text-zinc-500">
                  Once your reseller account is activated by Advanta, payments made to their Paybill with your Partner ID credit directly to your wholesale float.
                </p>
              </div>
            )}

            <div className="pt-2 flex justify-end gap-2 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => setIsTopUpModalOpen(false)}
                className="py-2 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Recipients Manager Modal */}
      {isRecipientsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-zinc-200 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-[#581c87] flex items-center justify-center font-bold text-sm">
                  🔔
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 text-sm">Reminder &amp; Alert Recipients</h3>
                  <p className="text-[11px] text-zinc-500">
                    Who receives carrier float warnings, 8 AM standup &amp; 8 PM reconciliations
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsRecipientsModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-700 text-sm cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            {/* Add New Email Form */}
            <form onSubmit={handleAddRecipient} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email (e.g. finance@ljkmarketing.com)"
                value={newRecipientEmail}
                onChange={(e) => setNewRecipientEmail(e.target.value)}
                disabled={isAddingRecipient}
                className="flex-1 px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-[#581c87] transition-colors"
              />
              <button
                type="submit"
                disabled={isAddingRecipient || !newRecipientEmail}
                className="py-2 px-3.5 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 cursor-pointer shrink-0"
              >
                {isAddingRecipient ? "Adding..." : "+ Add Recipient"}
              </button>
            </form>

            {/* Recipients List */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                Active Notification Recipients ({recipientsData?.total_count || 0})
              </div>

              {recipientsData?.all_recipients && recipientsData.all_recipients.length > 0 ? (
                <div className="divide-y divide-zinc-100 border border-zinc-200 rounded-xl overflow-hidden text-xs">
                  {recipientsData.registered_admins.map((adm) => (
                    <div key={adm.email} className="p-3 flex items-center justify-between bg-white hover:bg-zinc-50">
                      <div>
                        <div className="font-semibold text-zinc-900">{adm.email}</div>
                        <div className="text-[10px] text-zinc-500">{adm.name} &bull; {adm.source}</div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                        Admin User
                      </span>
                    </div>
                  ))}

                  {recipientsData.env_emails.map((env) => (
                    <div key={env.email} className="p-3 flex items-center justify-between bg-white hover:bg-zinc-50">
                      <div>
                        <div className="font-semibold text-zinc-900">{env.email}</div>
                        <div className="text-[10px] text-zinc-500">{env.source}</div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                        .env Config
                      </span>
                    </div>
                  ))}

                  {recipientsData.custom_emails.map((cust) => (
                    <div key={cust.email} className="p-3 flex items-center justify-between bg-white hover:bg-zinc-50">
                      <div>
                        <div className="font-semibold text-zinc-900">{cust.email}</div>
                        <div className="text-[10px] text-zinc-500">{cust.source}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Custom
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveRecipient(cust.email)}
                          className="text-red-500 hover:text-red-700 text-xs font-bold p-1 cursor-pointer"
                          title="Remove email"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-zinc-400">
                  Loading alert recipients...
                </div>
              )}
            </div>

            {/* Carrier Balance Alert Thresholds Configuration */}
            <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                  <span>⚙️ Carrier Balance Alert Thresholds</span>
                </span>
                <button
                  type="button"
                  onClick={handleSaveThresholds}
                  disabled={isSavingThresholds}
                  className="px-3 py-1 bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-800 text-[11px] font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSavingThresholds ? "Saving..." : "Save Thresholds"}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-semibold text-zinc-600 block mb-1">
                    ⚠️ Low Balance Warning (KES)
                  </label>
                  <input
                    type="number"
                    step="50"
                    min="100"
                    value={lowThreshold}
                    onChange={(e) => setLowThreshold(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs font-bold text-zinc-900 focus:outline-none focus:border-[#581c87]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-zinc-600 block mb-1">
                    🚨 Critical Depletion (KES)
                  </label>
                  <input
                    type="number"
                    step="25"
                    min="50"
                    value={criticalThreshold}
                    onChange={(e) => setCriticalThreshold(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs font-bold text-zinc-900 focus:outline-none focus:border-[#581c87]"
                  />
                </div>
              </div>
              <p className="text-[10px] text-zinc-500">
                Alert emails are automatically throttled to at most 1 email every 4 hours to avoid inbox spam.
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
              <button
                type="button"
                onClick={handleSendTestAlert}
                disabled={isSendingTestAlert}
                className="py-1.5 px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                <span>{isSendingTestAlert ? "Sending..." : "✉️ Send Test Alert to All"}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsRecipientsModalOpen(false)}
                className="py-1.5 px-4 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
