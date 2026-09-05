"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  useFetchAdminComplianceOverview,
  useAdminComplianceAction,
  useAdminManageComplianceKeywords,
} from "@/hooks/campaigns/actions";

export default function AdminCompliancePage() {
  const { data, isLoading, isFetching, refetch } = useFetchAdminComplianceOverview();
  const actionMutation = useAdminComplianceAction();
  const keywordMutation = useAdminManageComplianceKeywords();

  const [newKeyword, setNewKeyword] = useState("");
  const [isAddingKeyword, setIsAddingKeyword] = useState(false);
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  const cakStatus = data?.cak_status;
  const vitals = data?.vitals;
  const flaggedList = data?.flagged_campaigns || [];
  const bannedTerms = data?.banned_terms || [];

  const handleQuarantineAction = async (campaignRef: string, campaignName: string, action: "QUARANTINE" | "ALLOW_OVERRIDE") => {
    const promptMsg = action === "QUARANTINE"
      ? `Are you sure you want to QUARANTINE and ABORT campaign "${campaignName}"? Telecom dispatch will be halted immediately.`
      : `Are you sure you want to OVERRIDE compliance flags and permit campaign "${campaignName}" to dispatch?`;

    if (!confirm(promptMsg)) return;

    setIsProcessingAction(true);
    try {
      const res = await actionMutation.mutateAsync({
        campaign_reference: campaignRef,
        action,
      });
      if (res?.success) {
        toast.success(res.message || "Action executed successfully.");
      } else {
        toast.error("Could not execute action.");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || err?.message || "Action failed.");
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleAddKeyword = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newKeyword.trim().toLowerCase();
    if (!clean || clean.length < 2) {
      toast.error("Please enter a valid word or phrase (at least 2 characters).");
      return;
    }

    setIsAddingKeyword(true);
    try {
      const res = await keywordMutation.mutateAsync({
        action: "add",
        term: clean,
      });
      if (res?.success) {
        toast.success(res.detail || `Added "${clean}" to blocklist.`);
        setNewKeyword("");
      } else {
        toast.error(res?.detail || "Term is already in the blocklist.");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || err?.message || "Failed to add keyword.");
    } finally {
      setIsAddingKeyword(false);
    }
  };

  const handleRemoveKeyword = async (term: string) => {
    try {
      const res = await keywordMutation.mutateAsync({
        action: "remove",
        term,
      });
      if (res?.success) {
        toast.success(`Removed "${term}" from blocklist.`);
      } else {
        toast.error("Could not remove term.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to remove keyword.");
    }
  };

  const handleResetKeywords = async () => {
    if (!confirm("Restore default Communications Authority of Kenya (CAK) anti-phishing dictionary?")) {
      return;
    }
    try {
      const res = await keywordMutation.mutateAsync({ action: "reset" });
      if (res?.success) {
        toast.success("Restored standard CAK blocklist keywords.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to reset keywords.");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
              Regulatory Shield Active
            </span>
            <span className="text-xs text-zinc-500">CAK Kenya Anti-Fraud & Spam Protection</span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 mt-1">
            Anti-Fraud & Phishing Compliance Shield
          </h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            Automated message inspection, heuristic risk scores, regulatory curfew enforcement, and blocklist manager.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <svg
              className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-purple-600" : "text-zinc-500"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Re-scan Campaigns
          </button>
        </div>
      </div>

      {/* CAK Operating Hours Banner */}
      <div
        className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          cakStatus?.is_open
            ? "bg-emerald-50/80 border-emerald-200 text-emerald-950"
            : "bg-amber-50/80 border-amber-200 text-amber-950"
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
              cakStatus?.is_open
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">
                Communications Authority of Kenya (CAK) Commercial SMS Window:
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold uppercase ${
                  cakStatus?.is_open
                    ? "bg-emerald-200 text-emerald-900"
                    : "bg-amber-200 text-amber-900"
                }`}
              >
                {cakStatus?.status || "OPEN"}
              </span>
            </div>
            <p className="text-xs opacity-90 mt-0.5">
              {cakStatus?.notice} (Current Local Clock: <strong>{cakStatus?.current_eat_time || "—"}</strong>)
            </p>
          </div>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 bg-white/80 rounded-lg border border-zinc-200 shrink-0 self-start md:self-auto text-zinc-700">
          Legal Envelope: 07:00 AM &ndash; 07:00 PM EAT
        </div>
      </div>

      {/* Compliance Vitals KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* High Risk Flags */}
        <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
            <span>High-Risk Phishing Flags</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-rose-600 tracking-tight">
            {vitals?.high_risk_count ?? 0}
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">Requires immediate admin review</p>
        </div>

        {/* Quarantined Campaigns */}
        <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
            <span>Quarantined Broadcasts</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-amber-600 tracking-tight">
            {vitals?.quarantined_count ?? 0}
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">Dispatches blocked from telco</p>
        </div>

        {/* Clean Dispatches */}
        <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
            <span>Compliant Broadcasts</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-emerald-600 tracking-tight">
            {vitals?.clean_count ?? 0}
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">Cleared and safe messages</p>
        </div>

        {/* Active Blocklist Terms */}
        <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
            <span>Active Blocklist Terms</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-purple-700 tracking-tight">
            {vitals?.active_terms_count ?? bannedTerms.length}
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">Heuristic dictionary rules</p>
        </div>
      </div>

      {/* Flagged / Quarantined Campaigns Table */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div>
            <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <span>🛡️ Flagged & Quarantined Messages</span>
              <span className="text-xs font-normal text-zinc-500">
                (Campaigns containing sensitive phrases or phishing vectors)
              </span>
            </h2>
          </div>
          <span className="text-xs text-zinc-500 font-medium">
            {flaggedList.length} Flagged
          </span>
        </div>

        {flaggedList.length === 0 ? (
          <div className="p-10 text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-zinc-900">All Campaigns Clean</h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              No recent campaigns contain banned phrases, betting scams, or banking phishing words.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {flaggedList.map((item) => (
              <div key={item.reference} className="p-4 hover:bg-zinc-50/50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          item.risk_level === "HIGH"
                            ? "bg-rose-100 text-rose-800 border border-rose-200"
                            : "bg-amber-100 text-amber-800 border border-amber-200"
                        }`}
                      >
                        Risk: {item.risk_level} ({item.risk_score}/100)
                      </span>

                      {item.is_quarantined && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-zinc-900 text-amber-400 border border-zinc-800">
                          QUARANTINED / CANCELLED
                        </span>
                      )}

                      <span className="text-xs font-semibold text-zinc-900">{item.name}</span>
                      <span className="text-xs text-zinc-400">&bull; Business: {item.business_name}</span>
                      <span className="text-xs font-mono text-zinc-400">Header: [{item.sender_id}]</span>
                    </div>

                    <p className="text-xs text-zinc-700 bg-zinc-50 p-2.5 rounded-lg border border-zinc-200 font-mono">
                      &quot;{item.message_snippet}&quot;
                    </p>

                    {item.flagged_terms && item.flagged_terms.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 text-xs">
                        <span className="text-zinc-400 font-semibold text-[11px]">Matched Blacklist Terms:</span>
                        {item.flagged_terms.map((t) => (
                          <span
                            key={t}
                            className="px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 font-mono font-medium border border-rose-200 text-[11px]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                    {!item.is_quarantined ? (
                      <button
                        onClick={() => handleQuarantineAction(item.reference, item.name, "QUARANTINE")}
                        disabled={isProcessingAction}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs cursor-pointer disabled:opacity-50"
                      >
                        🚨 Quarantine & Halt
                      </button>
                    ) : (
                      <button
                        onClick={() => handleQuarantineAction(item.reference, item.name, "ALLOW_OVERRIDE")}
                        disabled={isProcessingAction}
                        className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg cursor-pointer disabled:opacity-50"
                      >
                        ✓ Admin Override
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dynamic Anti-Phishing Blocklist Manager */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-zinc-900">
              Heuristic Anti-Phishing & Spam Blocklist Manager
            </h2>
            <p className="text-xs text-zinc-500">
              Outbound campaigns matching these phrases are automatically flagged or held for inspection.
            </p>
          </div>

          <button
            type="button"
            onClick={handleResetKeywords}
            className="px-3 py-1.5 text-xs font-semibold text-zinc-600 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg cursor-pointer"
          >
            Restore CAK Standards
          </button>
        </div>

        {/* Add Keyword Form */}
        <form onSubmit={handleAddKeyword} className="flex gap-2 max-w-md">
          <input
            type="text"
            placeholder="Add new phrase (e.g. 'crypto guarantee', 'bit.ly/')"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            className="flex-1 text-xs px-3 py-2 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-600 text-zinc-800"
          />
          <button
            type="submit"
            disabled={isAddingKeyword}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#581c87] hover:bg-[#43146b] rounded-lg shadow-xs cursor-pointer disabled:opacity-50"
          >
            {isAddingKeyword ? "Adding..." : "Add Term"}
          </button>
        </form>

        {/* Tag Cloud */}
        <div className="flex flex-wrap gap-2 pt-2">
          {bannedTerms.map((term) => (
            <span
              key={term}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-zinc-100 text-zinc-800 border border-zinc-200"
            >
              <span>{term}</span>
              <button
                type="button"
                onClick={() => handleRemoveKeyword(term)}
                title={`Remove "${term}"`}
                className="text-zinc-400 hover:text-red-600 cursor-pointer p-0.5"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
