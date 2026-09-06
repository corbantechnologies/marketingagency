/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  useFetchBusinesses,
  useDeactivateBusiness,
  useReactivateBusiness,
  useUpdateBusinessEntitlements,
} from "@/hooks/business/actions";
import { useFetchPlans } from "@/hooks/plans/actions";
import { Business } from "@/services/business";

export default function AdminBusinessesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: businessesData, isLoading } = useFetchBusinesses();
  const { data: plansData } = useFetchPlans();
  const deactivateMutation = useDeactivateBusiness();
  const reactivateMutation = useReactivateBusiness();
  const updateEntitlementsMutation = useUpdateBusinessEntitlements();

  // Entitlements Modal State
  const [selectedBiz, setSelectedBiz] = useState<Business | null>(null);
  const [isLifetime, setIsLifetime] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [featureFlags, setFeatureFlags] = useState({
    can_use_whatsapp: true,
    can_use_sms: true,
    has_api_access: false,
    has_smpp_access: false,
    has_autoresponders: false,
    sender_id_bypass: false,
  });
  const [customSmsRate, setCustomSmsRate] = useState("");

  const businesses: Business[] = Array.isArray(businessesData)
    ? businessesData
    : (businessesData as any)?.results || [];

  const plans = Array.isArray(plansData) ? plansData : (plansData as any)?.results || [];

  const filteredBusinesses = businesses.filter((b) =>
    (b.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.code || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.reference || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleBusinessStatus = (ref: string, isActive: boolean) => {
    if (isActive) {
      deactivateMutation.mutate(ref, {
        onSuccess: () => toast.success("Business marked inactive"),
        onError: () => toast.error("Failed to update status"),
      });
    } else {
      reactivateMutation.mutate(ref, {
        onSuccess: () => toast.success("Business reactivated successfully"),
        onError: () => toast.error("Failed to reactivate"),
      });
    }
  };

  const handleOpenEntitlements = (biz: Business) => {
    setSelectedBiz(biz);
    setIsLifetime(Boolean(biz.is_lifetime_access));
    setSelectedPlan(biz.active_plan || "");

    const overrides = biz.feature_overrides || {};
    setFeatureFlags({
      can_use_whatsapp: overrides.can_use_whatsapp !== false,
      can_use_sms: overrides.can_use_sms !== false,
      has_api_access: Boolean(overrides.has_api_access ?? biz.plan_detail?.id),
      has_smpp_access: Boolean(overrides.has_smpp_access),
      has_autoresponders: Boolean(overrides.has_autoresponders),
      sender_id_bypass: Boolean(overrides.sender_id_bypass),
    });
    setCustomSmsRate(overrides.custom_sms_rate ? String(overrides.custom_sms_rate) : "");
  };

  const handleSaveEntitlements = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBiz) return;

    const payload = {
      is_lifetime_access: isLifetime,
      active_plan: selectedPlan || null,
      feature_overrides: {
        ...featureFlags,
        custom_sms_rate: customSmsRate ? parseFloat(customSmsRate) : null,
      },
    };

    updateEntitlementsMutation.mutate(
      { reference: selectedBiz.reference, payload },
      {
        onSuccess: (res) => {
          toast.success(res.message || `Entitlements updated for ${selectedBiz.name}!`);
          setSelectedBiz(null);
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.detail || "Failed to save entitlements.");
        },
      }
    );
  };

  const handleResetToDefaults = () => {
    setIsLifetime(false);
    setFeatureFlags({
      can_use_whatsapp: true,
      can_use_sms: true,
      has_api_access: false,
      has_smpp_access: false,
      has_autoresponders: false,
      sender_id_bypass: false,
    });
    setCustomSmsRate("");
    toast.success("Reset entitlements to default settings.");
  };

  return (
    <div className="space-y-6 w-full max-w-none">
      {/* 1. Header Ribbon */}
      <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
            <Link href="/admin/dashboard" className="hover:text-zinc-900">Admin Console</Link>
            <span>/</span>
            <span className="text-zinc-900 font-medium">Businesses</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            Registered Businesses &amp; Workspaces
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 mt-0.5">
            Oversee tenant accounts, customer workspaces, lifetime partner bypasses, and granular feature entitlements.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/admin/rates"
            className="py-2 px-3.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-lg transition-colors"
          >
            Rate Cards &amp; Margins
          </Link>
          <Link
            href="/admin/plans"
            className="py-2 px-3.5 bg-zinc-800 hover:bg-zinc-900 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
          >
            Manage Plans
          </Link>
        </div>
      </div>

      {/* 2. Directory Table Card */}
      <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by business name, email, code or reference..."
            className="w-full sm:w-80 px-3.5 py-2 rounded-lg border border-zinc-300 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#581c87]"
          />
          <div className="text-xs text-zinc-500 self-end sm:self-center">
            Showing <strong>{filteredBusinesses.length}</strong> of {businesses.length} businesses
          </div>
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-xs text-zinc-500">Loading business directory...</div>
        ) : filteredBusinesses.length > 0 ? (
          <div className="divide-y divide-zinc-100 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-zinc-400 font-bold uppercase tracking-wider border-b border-zinc-200 pb-2">
                  <th className="py-3 px-2">Business Name &amp; Code</th>
                  <th className="py-3 px-2">Owner Contact</th>
                  <th className="py-3 px-2">Commercial Plan &amp; Access Tier</th>
                  <th className="py-3 px-2">Feature Entitlements</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredBusinesses.map((biz) => {
                  const overrides = biz.feature_overrides || {};
                  return (
                    <tr key={biz.id || biz.reference} className="hover:bg-zinc-50/60 transition-colors">
                      <td className="py-3.5 px-2 font-semibold text-zinc-900">
                        <div className="font-bold text-zinc-900">{biz.name}</div>
                        <div className="text-[11px] text-zinc-400 font-mono">
                          Ref: {biz.reference || biz.code}
                        </div>
                      </td>
                      <td className="py-3.5 px-2">
                        <div className="text-zinc-800 font-medium">{biz.owner || "—"}</div>
                        <div className="text-[11px] text-zinc-500">{biz.email || biz.phone || "—"}</div>
                      </td>
                      <td className="py-3.5 px-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {biz.is_lifetime_access ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-300/80 inline-flex items-center gap-1 shadow-2xs">
                              <span>👑</span>
                              <span>LIFETIME VIP</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-100 text-zinc-700 border border-zinc-200">
                              {biz.active_plan || "Default Tier"}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-2">
                        <div className="flex flex-wrap items-center gap-1">
                          {overrides.can_use_whatsapp !== false ? (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200" title="WhatsApp Enabled">
                              WA
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-red-50 text-red-700 border border-red-200 line-through" title="WhatsApp Disabled">
                              WA
                            </span>
                          )}

                          {overrides.can_use_sms !== false ? (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-50 text-purple-700 border border-purple-200" title="SMS Enabled">
                              SMS
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-red-50 text-red-700 border border-red-200 line-through" title="SMS Disabled">
                              SMS
                            </span>
                          )}

                          {overrides.has_api_access && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200" title="REST API Active">
                              API
                            </span>
                          )}
                          {overrides.sender_id_bypass && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200" title="Sender ID Bypass Active">
                              Bypass
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          biz.is_active ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-zinc-100 text-zinc-600"
                        }`}>
                          {biz.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEntitlements(biz)}
                            className="py-1 px-2.5 rounded text-[11px] font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-800 transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <span>⚙️ Entitlements</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleBusinessStatus(biz.reference, biz.is_active)}
                            className={`py-1 px-2.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                              biz.is_active
                                ? "text-red-700 hover:bg-red-50 border border-red-200"
                                : "text-emerald-700 hover:bg-emerald-50 border border-emerald-200"
                            }`}
                          >
                            {biz.is_active ? "Deactivate" : "Reactivate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-zinc-500">
            No businesses found matching &ldquo;{searchTerm}&rdquo;.
          </div>
        )}
      </div>

      {/* 3. Entitlements & Lifetime Access Modal */}
      {selectedBiz && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-zinc-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
            <div className="bg-zinc-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 text-amber-200 border border-amber-400/30">
                    Administrator Controls
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">Ref: {selectedBiz.reference}</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                  Access &amp; Entitlements: {selectedBiz.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBiz(null)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveEntitlements} className="p-6 space-y-5">
              {/* Lifetime VIP Card */}
              <div className={`p-4 rounded-xl border transition-all ${
                isLifetime
                  ? "bg-amber-50 border-amber-300/80 text-amber-950"
                  : "bg-zinc-50 border-zinc-200 text-zinc-800"
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl shrink-0">👑</span>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                        <span>Lifetime Partner Privilege</span>
                        {isLifetime && (
                          <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-600 mt-0.5 leading-relaxed">
                        Exempt this business from recurring subscription renewals and payment paywalls.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsLifetime(!isLifetime)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 self-start sm:self-center shadow-xs ${
                      isLifetime
                        ? "bg-amber-500 hover:bg-amber-600 text-black"
                        : "bg-zinc-200 hover:bg-zinc-300 text-zinc-700"
                    }`}
                  >
                    {isLifetime ? "Active: Lifetime VIP" : "Standard Billing"}
                  </button>
                </div>
              </div>

              {/* Commercial Plan Selector */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Assigned Commercial Plan
                </label>
                <select
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs sm:text-sm text-zinc-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#581c87]"
                >
                  <option value="">— No Plan / Default Basic Tier —</option>
                  {plans.map((p: any) => (
                    <option key={p.id || p.slug} value={p.name}>
                      {p.name} ({p.billing_cycle}) • KSh {p.price_kes}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-zinc-400 mt-1">
                  Determines default rate cards, SMS allowances, and contact limits.
                </p>
              </div>

              {/* Granular Feature Entitlement Checkboxes */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                  Granular Channel &amp; Feature Flags
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* WhatsApp */}
                  <label className="flex items-start gap-3 p-3 rounded-lg border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={featureFlags.can_use_whatsapp}
                      onChange={(e) => setFeatureFlags({ ...featureFlags, can_use_whatsapp: e.target.checked })}
                      className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                    />
                    <div>
                      <div className="text-xs font-bold text-zinc-900">WhatsApp Cloud API</div>
                      <div className="text-[11px] text-zinc-500">Allow outbound WhatsApp broadcasts and template messaging.</div>
                    </div>
                  </label>

                  {/* Bulk SMS */}
                  <label className="flex items-start gap-3 p-3 rounded-lg border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={featureFlags.can_use_sms}
                      onChange={(e) => setFeatureFlags({ ...featureFlags, can_use_sms: e.target.checked })}
                      className="mt-0.5 rounded text-purple-600 focus:ring-purple-500 h-4 w-4"
                    />
                    <div>
                      <div className="text-xs font-bold text-zinc-900">Tier-1 Bulk SMS</div>
                      <div className="text-[11px] text-zinc-500">Allow SMS dispatches via Africa&apos;s Talking gateway.</div>
                    </div>
                  </label>

                  {/* Developer API */}
                  <label className="flex items-start gap-3 p-3 rounded-lg border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={featureFlags.has_api_access}
                      onChange={(e) => setFeatureFlags({ ...featureFlags, has_api_access: e.target.checked })}
                      className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <div>
                      <div className="text-xs font-bold text-zinc-900">Developer REST API</div>
                      <div className="text-[11px] text-zinc-500">Allow API key generation for remote backend integration.</div>
                    </div>
                  </label>

                  {/* Sender ID Bypass */}
                  <label className="flex items-start gap-3 p-3 rounded-lg border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={featureFlags.sender_id_bypass}
                      onChange={(e) => setFeatureFlags({ ...featureFlags, sender_id_bypass: e.target.checked })}
                      className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 h-4 w-4"
                    />
                    <div>
                      <div className="text-xs font-bold text-zinc-900">Sender ID Immediate Bypass</div>
                      <div className="text-[11px] text-zinc-500">Bypass telecom verification queue for trusted senders.</div>
                    </div>
                  </label>

                  {/* SMPP Gateway */}
                  <label className="flex items-start gap-3 p-3 rounded-lg border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={featureFlags.has_smpp_access}
                      onChange={(e) => setFeatureFlags({ ...featureFlags, has_smpp_access: e.target.checked })}
                      className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                    />
                    <div>
                      <div className="text-xs font-bold text-zinc-900">High-Throughput SMPP</div>
                      <div className="text-[11px] text-zinc-500">Direct carrier protocol access for enterprise traffic.</div>
                    </div>
                  </label>

                  {/* Autoresponders */}
                  <label className="flex items-start gap-3 p-3 rounded-lg border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={featureFlags.has_autoresponders}
                      onChange={(e) => setFeatureFlags({ ...featureFlags, has_autoresponders: e.target.checked })}
                      className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 h-4 w-4"
                    />
                    <div>
                      <div className="text-xs font-bold text-zinc-900">Automated Bot Flows</div>
                      <div className="text-[11px] text-zinc-500">Rule-based inbound auto-replies and triggers.</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Custom SMS Rate Override (Optional) */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Custom SMS Rate Override (KES / SMS) &bull; Optional
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={customSmsRate}
                  onChange={(e) => setCustomSmsRate(e.target.value)}
                  placeholder="e.g. 0.8000 (Cost price for internal partner)"
                  className="w-full px-3.5 py-2 rounded-lg border border-zinc-300 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#581c87]"
                />
                <p className="text-[11px] text-zinc-400 mt-1">
                  Leave blank to inherit the rate card from the commercial plan.
                </p>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-zinc-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleResetToDefaults}
                  className="text-xs text-zinc-500 hover:text-zinc-800 underline underline-offset-2 transition-colors cursor-pointer"
                >
                  Reset to Plan Defaults
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedBiz(null)}
                    className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateEntitlementsMutation.isPending}
                    className="px-5 py-2.5 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {updateEntitlementsMutation.isPending ? "Saving..." : "Save Entitlements"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
