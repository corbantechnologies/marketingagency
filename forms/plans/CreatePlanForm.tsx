/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useCreatePlan } from "@/hooks/plans/actions";
import { CreatePlanPayload, Plan } from "@/services/plans";
import toast from "react-hot-toast";

interface CreatePlanFormProps {
  onSuccess?: (plan: Plan) => void;
  onCancel?: () => void;
}

export function CreatePlanForm({ onSuccess, onCancel }: CreatePlanFormProps) {
  const createMutation = useCreatePlan();

  const [formData, setFormData] = useState<any>({
    name: "",
    tagline: "",
    category: "SUBSCRIPTION",
    target_audience: "ALL",
    is_featured: false,
    is_active: true,
    sort_order: 0,
    price_kes: "4999.00",
    price_usd: "39.00",
    annual_discount_percent: 15,
    billing_cycle: "MONTHLY",
    sms_rate_kes: "0.4500",
    email_rate_kes: "0.0500",
    included_sms_credits: 10000,
    included_email_credits: 0,
    max_contacts: 25000,
    max_sender_ids: 1,
    has_api_access: true,
    has_smpp_access: false,
    has_autoresponders: true,
    has_dedicated_ip: false,
    support_tier: "EMAIL",
    features_list: [
      "High-speed Tier-1 Direct Safaricom & Airtel Gateway",
      "Real-time Handset Delivery Reports (DLR)",
      "1-Click Excel / CSV Contact Group Manager",
      "1 Custom Alphanumeric Sender ID",
    ],
    badge_text: "",
  });

  const [newFeatureInput, setNewFeatureInput] = useState("");

  const monthlyKes = Number(formData.price_kes || 0);
  const discountPercent = Number(formData.annual_discount_percent || 0);
  const calculatedAnnualMonthlyKes = Math.round(monthlyKes * (1 - discountPercent / 100));
  const calculatedAnnualTotalKes = calculatedAnnualMonthlyKes * 12;

  const handleAddFeature = () => {
    if (!newFeatureInput.trim()) return;
    setFormData((prev: any) => ({
      ...prev,
      features_list: [...(prev.features_list || []), newFeatureInput.trim()],
    }));
    setNewFeatureInput("");
  };

  const handleRemoveFeature = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      features_list: (prev.features_list || []).filter((_: any, i: number) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name?.trim()) {
      toast.error("Please enter a plan name");
      return;
    }
    if (!formData.tagline?.trim()) {
      toast.error("Please enter a tagline / benefit statement");
      return;
    }

    const payload: CreatePlanPayload = {
      ...formData,
      price_kes: formData.price_kes === "" ? "0.00" : String(formData.price_kes),
      price_usd: formData.price_usd === "" ? "0.00" : String(formData.price_usd),
      sms_rate_kes: formData.sms_rate_kes === "" ? "0.4500" : String(formData.sms_rate_kes),
      email_rate_kes: formData.email_rate_kes === "" ? "0.0500" : String(formData.email_rate_kes),
      annual_discount_percent: formData.annual_discount_percent === "" ? 0 : Number(formData.annual_discount_percent),
      included_sms_credits: formData.included_sms_credits === "" ? 0 : Number(formData.included_sms_credits),
      included_email_credits: formData.included_email_credits === "" ? 0 : Number(formData.included_email_credits),
      max_contacts: formData.max_contacts === "" ? 0 : Number(formData.max_contacts),
      max_sender_ids: formData.max_sender_ids === "" ? 0 : Number(formData.max_sender_ids),
    };

    createMutation.mutate(payload, {
      onSuccess: (newPlan) => {
        toast.success(`Plan "${newPlan.name}" created successfully!`);
        if (onSuccess) onSuccess(newPlan);
      },
      onError: (error: any) => {
        const resData = error?.response?.data;
        const msg =
          resData?.name?.[0] ||
          resData?.detail ||
          resData?.message ||
          error?.message ||
          "Failed to create plan. Please verify all inputs.";
        toast.error(msg);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* ==================================================================== */}
      {/* SECTION 1: GENERAL INFORMATION */}
      {/* ==================================================================== */}
      <div className="bg-zinc-50/60 border border-zinc-200/80 rounded-xl p-5 sm:p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-zinc-200/70 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-[#581c87] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
              1
            </span>
            <h3 className="text-sm font-bold text-zinc-900 tracking-tight">
              General Information &amp; Classification
            </h3>
          </div>
          <span className="text-[11px] text-zinc-500 font-medium">Basic tier properties</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Plan Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Business Growth, Starter PAYG, Enterprise SLA"
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs sm:text-sm text-zinc-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#581c87]/20 focus:border-[#581c87] transition-all shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Highlight Badge (Optional)
            </label>
            <input
              type="text"
              value={formData.badge_text || ""}
              onChange={(e) => setFormData({ ...formData, badge_text: e.target.value })}
              placeholder="e.g. Most Popular, Best Value, 20% Off"
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs sm:text-sm text-zinc-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#581c87]/20 focus:border-[#581c87] transition-all shadow-2xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
            Tagline / Value Proposition <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.tagline || ""}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            placeholder="e.g. Most popular for scaling retail shops, clinics &amp; salons"
            className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs sm:text-sm text-zinc-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#581c87]/20 focus:border-[#581c87] transition-all shadow-2xs"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Category Tag
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs sm:text-sm text-zinc-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#581c87]/20 focus:border-[#581c87] transition-all shadow-2xs cursor-pointer"
            >
              <option value="SUBSCRIPTION">Monthly Subscription</option>
              <option value="PAYG">Pay As You Go</option>
              <option value="BUNDLE">Credit Bundle</option>
              <option value="ENTERPRISE">Enterprise SLA</option>
              <option value="HYBRID">All-In-One Hybrid (Sub + PAYG + Bundle)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Target Audience
            </label>
            <select
              value={formData.target_audience}
              onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs sm:text-sm text-zinc-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#581c87]/20 focus:border-[#581c87] transition-all shadow-2xs cursor-pointer"
            >
              <option value="ALL">All Audiences</option>
              <option value="SME">Small &amp; Medium Business (SME)</option>
              <option value="CORPORATE">Corporate &amp; Enterprise</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Primary Billing Cycle
            </label>
            <select
              value={formData.billing_cycle}
              onChange={(e) => setFormData({ ...formData, billing_cycle: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs sm:text-sm text-zinc-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#581c87]/20 focus:border-[#581c87] transition-all shadow-2xs cursor-pointer"
            >
              <option value="MONTHLY">Monthly Recurring</option>
              <option value="ANNUAL">Annual Recurring</option>
              <option value="ONCE">One-Time Purchase</option>
            </select>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* SECTION 2: PRICING, ANNUAL DISCOUNT & CREDITS */}
      {/* ==================================================================== */}
      <div className="bg-zinc-50/60 border border-zinc-200/80 rounded-xl p-5 sm:p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-zinc-200/70 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-[#581c87] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
              2
            </span>
            <h3 className="text-sm font-bold text-zinc-900 tracking-tight">
              Pricing, Annual Discounts &amp; Credit Allowances
            </h3>
          </div>
          <span className="text-[11px] text-zinc-500 font-medium">Single plan handles all cycles</span>
        </div>

        {/* Row 1: Base Pricing & Annual Discount */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Monthly Base Price (KES) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.price_kes ?? ""}
              onChange={(e) => setFormData({ ...formData, price_kes: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs sm:text-sm text-zinc-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#581c87]/20 focus:border-[#581c87] transition-all shadow-2xs"
            />
            <span className="text-[11px] text-zinc-500 mt-1 block">Set 0 for pure Pay-As-You-Go</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Annual Discount (%)
            </label>
            <input
              type="number"
              min="0"
              max="99"
              value={formData.annual_discount_percent ?? ""}
              onChange={(e) => setFormData({ ...formData, annual_discount_percent: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs sm:text-sm text-zinc-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#581c87]/20 focus:border-[#581c87] transition-all shadow-2xs"
            />
            <span className="text-[11px] text-zinc-500 mt-1 block">Percentage savings on yearly billing</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Price (USD Equivalent)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.price_usd ?? ""}
              onChange={(e) => setFormData({ ...formData, price_usd: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs sm:text-sm text-zinc-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#581c87]/20 focus:border-[#581c87] transition-all shadow-2xs"
            />
            <span className="text-[11px] text-zinc-500 mt-1 block">For international USD billing</span>
          </div>
        </div>

        {/* Live Calculation Preview Banner */}
        {monthlyKes > 0 && (
          <div className="p-4 bg-purple-50/80 border border-purple-200 rounded-xl text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
            <div className="space-y-0.5">
              <div className="font-bold text-[#581c87] text-xs uppercase tracking-wide">
                Live Annual Discount Preview
              </div>
              <div className="text-zinc-800 text-xs sm:text-sm">
                Billed monthly at <strong>KES {calculatedAnnualMonthlyKes.toLocaleString()}</strong> / month (billed as <strong>KES {calculatedAnnualTotalKes.toLocaleString()}</strong> / year).
              </div>
            </div>
            <span className="shrink-0 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
              Save {discountPercent}% Annual
            </span>
          </div>
        )}

        {/* Row 2: Telecom Unit Rates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 border-t border-zinc-200/60">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              PAYG / Extra SMS Rate (KES) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.0001"
              required
              value={formData.sms_rate_kes ?? ""}
              onChange={(e) => setFormData({ ...formData, sms_rate_kes: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs sm:text-sm text-zinc-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#581c87]/20 focus:border-[#581c87] transition-all shadow-2xs font-mono font-semibold"
            />
            <span className="text-[11px] text-zinc-500 mt-1 block">Cost per extra SMS unit above allowance</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Email Unit Rate (KES)
            </label>
            <input
              type="number"
              step="0.0001"
              value={formData.email_rate_kes ?? ""}
              onChange={(e) => setFormData({ ...formData, email_rate_kes: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs sm:text-sm text-zinc-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#581c87]/20 focus:border-[#581c87] transition-all shadow-2xs font-mono"
            />
            <span className="text-[11px] text-zinc-500 mt-1 block">Cost per transactional email dispatch</span>
          </div>
        </div>

        {/* Row 3: Included Allowances & Limits */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-1 border-t border-zinc-200/60">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Included Monthly SMS
            </label>
            <input
              type="number"
              value={formData.included_sms_credits ?? ""}
              onChange={(e) => setFormData({ ...formData, included_sms_credits: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs sm:text-sm text-zinc-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#581c87]/20 focus:border-[#581c87] transition-all shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Included Monthly Emails
            </label>
            <input
              type="number"
              value={formData.included_email_credits ?? ""}
              onChange={(e) => setFormData({ ...formData, included_email_credits: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs sm:text-sm text-zinc-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#581c87]/20 focus:border-[#581c87] transition-all shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Max Contacts Limit
            </label>
            <input
              type="number"
              value={formData.max_contacts ?? ""}
              onChange={(e) => setFormData({ ...formData, max_contacts: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs sm:text-sm text-zinc-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#581c87]/20 focus:border-[#581c87] transition-all shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Max Custom Sender IDs
            </label>
            <input
              type="number"
              value={formData.max_sender_ids ?? ""}
              onChange={(e) => setFormData({ ...formData, max_sender_ids: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs sm:text-sm text-zinc-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#581c87]/20 focus:border-[#581c87] transition-all shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* SECTION 3: CAPABILITIES & FEATURE HIGHLIGHTS */}
      {/* ==================================================================== */}
      <div className="bg-zinc-50/60 border border-zinc-200/80 rounded-xl p-5 sm:p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-zinc-200/70 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-[#581c87] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
              3
            </span>
            <h3 className="text-sm font-bold text-zinc-900 tracking-tight">
              Support Tier, Features &amp; Capabilities
            </h3>
          </div>
          <span className="text-[11px] text-zinc-500 font-medium">Public marketing bullets</span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
            Support Tier SLA
          </label>
          <select
            value={formData.support_tier}
            onChange={(e) => setFormData({ ...formData, support_tier: e.target.value })}
            className="w-full sm:w-80 px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs sm:text-sm text-zinc-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#581c87]/20 focus:border-[#581c87] transition-all shadow-2xs cursor-pointer"
          >
            <option value="EMAIL">Standard Email Support</option>
            <option value="PRIORITY_WHATSAPP">Priority WhatsApp &amp; Phone Support</option>
            <option value="DEDICATED_MANAGER">Dedicated Account Strategist / Manager</option>
            <option value="COMMUNITY">Community / FAQ</option>
          </select>
        </div>

        {/* Dynamic Feature Highlights List Manager */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-zinc-700">
            Feature Bullet Points (Displayed on Public Pricing Cards)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newFeatureInput}
              onChange={(e) => setNewFeatureInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddFeature();
                }
              }}
              placeholder="e.g. Free 11-char Alphanumeric Sender ID, Scheduled SMS Campaigns"
              className="flex-1 px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs sm:text-sm text-zinc-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#581c87]/20 focus:border-[#581c87] transition-all shadow-2xs"
            />
            <button
              type="button"
              onClick={handleAddFeature}
              className="py-2.5 px-5 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs cursor-pointer shrink-0"
            >
              + Add Feature
            </button>
          </div>

          {/* Render Active Feature Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            {formData.features_list?.map((feature: string, idx: number) => (
              <span
                key={idx}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs bg-purple-50 text-[#581c87] border border-purple-200 font-medium shadow-2xs"
              >
                <span>{feature}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(idx)}
                  className="text-purple-400 hover:text-red-600 font-bold ml-1 cursor-pointer transition-colors"
                  title="Remove Feature"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Feature & Status Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-zinc-200/60">
          <label className="flex items-center gap-3 p-3 bg-white border border-zinc-200 rounded-lg cursor-pointer hover:border-zinc-300 transition-colors">
            <input
              type="checkbox"
              checked={formData.has_api_access}
              onChange={(e) => setFormData({ ...formData, has_api_access: e.target.checked })}
              className="rounded text-[#581c87] focus:ring-[#581c87] w-4 h-4"
            />
            <span className="text-xs font-medium text-zinc-800">REST API &amp; Webhooks</span>
          </label>

          <label className="flex items-center gap-3 p-3 bg-white border border-zinc-200 rounded-lg cursor-pointer hover:border-zinc-300 transition-colors">
            <input
              type="checkbox"
              checked={formData.has_autoresponders}
              onChange={(e) => setFormData({ ...formData, has_autoresponders: e.target.checked })}
              className="rounded text-[#581c87] focus:ring-[#581c87] w-4 h-4"
            />
            <span className="text-xs font-medium text-zinc-800">Autoresponders</span>
          </label>

          <label className="flex items-center gap-3 p-3 bg-purple-50/60 border border-purple-200 rounded-lg cursor-pointer hover:border-purple-300 transition-colors">
            <input
              type="checkbox"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="rounded text-[#581c87] focus:ring-[#581c87] w-4 h-4"
            />
            <span className="text-xs font-bold text-[#581c87]">Featured Card Highlight</span>
          </label>

          <label className="flex items-center gap-3 p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg cursor-pointer hover:border-emerald-300 transition-colors">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
            />
            <span className="text-xs font-bold text-emerald-800">Active (Public View)</span>
          </label>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* BOTTOM ACTION BUTTONS */}
      {/* ==================================================================== */}
      <div className="pt-4 flex items-center justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="py-2.5 px-5 rounded-lg text-xs sm:text-sm font-semibold text-zinc-700 bg-white hover:bg-zinc-50 border border-zinc-300 transition-colors shadow-2xs cursor-pointer"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={createMutation.isPending}
          className="py-2.5 px-7 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
        >
          {createMutation.isPending ? "Creating Plan..." : "Save & Publish Plan"}
        </button>
      </div>
    </form>
  );
}

export default CreatePlanForm;
