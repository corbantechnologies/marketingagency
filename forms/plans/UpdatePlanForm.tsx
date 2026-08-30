/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useUpdatePlan } from "@/hooks/plans/actions";
import { Plan, UpdatePlanPayload } from "@/services/plans";
import toast from "react-hot-toast";

interface UpdatePlanFormProps {
  plan: Plan;
  onSuccess?: (plan: Plan) => void;
  onCancel?: () => void;
}

export function UpdatePlanForm({ plan, onSuccess, onCancel }: UpdatePlanFormProps) {
  const updateMutation = useUpdatePlan();

  const [formData, setFormData] = useState<UpdatePlanPayload>({
    name: plan.name,
    tagline: plan.tagline,
    category: plan.category,
    target_audience: plan.target_audience,
    is_featured: plan.is_featured,
    is_active: plan.is_active,
    sort_order: plan.sort_order,
    price_kes: plan.price_kes,
    price_usd: plan.price_usd || "0.00",
    billing_cycle: plan.billing_cycle,
    sms_rate_kes: plan.sms_rate_kes,
    email_rate_kes: plan.email_rate_kes,
    included_sms_credits: plan.included_sms_credits,
    included_email_credits: plan.included_email_credits,
    max_contacts: plan.max_contacts,
    max_sender_ids: plan.max_sender_ids,
    has_api_access: plan.has_api_access,
    has_smpp_access: plan.has_smpp_access,
    has_autoresponders: plan.has_autoresponders,
    has_dedicated_ip: plan.has_dedicated_ip,
    support_tier: plan.support_tier,
    features_list: plan.features_list || [],
    badge_text: plan.badge_text || "",
  });

  const [newFeatureInput, setNewFeatureInput] = useState("");

  const handleAddFeature = () => {
    if (!newFeatureInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      features_list: [...(prev.features_list || []), newFeatureInput.trim()],
    }));
    setNewFeatureInput("");
  };

  const handleRemoveFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features_list: (prev.features_list || []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name?.trim()) {
      toast.error("Please enter a plan name");
      return;
    }

    updateMutation.mutate(
      {
        reference: plan.reference,
        data: formData,
      },
      {
        onSuccess: (updatedPlan) => {
          toast.success(`Plan "${updatedPlan.name}" updated successfully!`);
          if (onSuccess) onSuccess(updatedPlan);
        },
        onError: (error: any) => {
          const resData = error?.response?.data;
          const msg =
            resData?.name?.[0] ||
            resData?.detail ||
            resData?.message ||
            error?.message ||
            "Failed to update plan.";
          toast.error(msg);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section 1: Basic Information */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#581c87] border-b border-purple-100 pb-1.5">
          1. General Information &bull; Ref: <span className="font-mono text-zinc-600">{plan.reference}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Plan Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#581c87]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Badge Text (Optional)
            </label>
            <input
              type="text"
              value={formData.badge_text || ""}
              onChange={(e) => setFormData({ ...formData, badge_text: e.target.value })}
              placeholder="e.g. Most Popular, Best Value"
              className="w-full px-3.5 py-2 rounded-lg border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#581c87]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">
            Tagline / Benefit Statement
          </label>
          <input
            type="text"
            value={formData.tagline}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            className="w-full px-3.5 py-2 rounded-lg border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#581c87]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#581c87] bg-white cursor-pointer"
            >
              <option value="SUBSCRIPTION">Monthly Subscription</option>
              <option value="PAYG">Pay As You Go</option>
              <option value="BUNDLE">Credit Bundle</option>
              <option value="ENTERPRISE">Enterprise SLA</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Target Audience
            </label>
            <select
              value={formData.target_audience}
              onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#581c87] bg-white cursor-pointer"
            >
              <option value="ALL">All Audiences</option>
              <option value="SME">Small &amp; Medium Business (SME)</option>
              <option value="CORPORATE">Corporate &amp; Enterprise</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Billing Cycle
            </label>
            <select
              value={formData.billing_cycle}
              onChange={(e) => setFormData({ ...formData, billing_cycle: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#581c87] bg-white cursor-pointer"
            >
              <option value="MONTHLY">Monthly Recurring</option>
              <option value="ANNUAL">Annual Recurring</option>
              <option value="ONCE">One-Time Purchase</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section 2: Pricing & Credits */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#581c87] border-b border-purple-100 pb-1.5">
          2. Pricing &amp; Included Credits
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Price (KES) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.price_kes}
              onChange={(e) => setFormData({ ...formData, price_kes: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#581c87]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Price (USD)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.price_usd || ""}
              onChange={(e) => setFormData({ ...formData, price_usd: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#581c87]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              SMS Rate (KES)
            </label>
            <input
              type="number"
              step="0.0001"
              required
              value={formData.sms_rate_kes}
              onChange={(e) => setFormData({ ...formData, sms_rate_kes: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#581c87]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Email Rate (KES)
            </label>
            <input
              type="number"
              step="0.0001"
              value={formData.email_rate_kes}
              onChange={(e) => setFormData({ ...formData, email_rate_kes: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#581c87]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Included SMS Credits
            </label>
            <input
              type="number"
              value={formData.included_sms_credits}
              onChange={(e) => setFormData({ ...formData, included_sms_credits: Number(e.target.value) })}
              className="w-full px-3.5 py-2 rounded-lg border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#581c87]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Included Email Credits
            </label>
            <input
              type="number"
              value={formData.included_email_credits}
              onChange={(e) => setFormData({ ...formData, included_email_credits: Number(e.target.value) })}
              className="w-full px-3.5 py-2 rounded-lg border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#581c87]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Max Contacts
            </label>
            <input
              type="number"
              value={formData.max_contacts}
              onChange={(e) => setFormData({ ...formData, max_contacts: Number(e.target.value) })}
              className="w-full px-3.5 py-2 rounded-lg border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#581c87]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Max Sender IDs
            </label>
            <input
              type="number"
              value={formData.max_sender_ids}
              onChange={(e) => setFormData({ ...formData, max_sender_ids: Number(e.target.value) })}
              className="w-full px-3.5 py-2 rounded-lg border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#581c87]"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Features & Support Tier */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#581c87] border-b border-purple-100 pb-1.5">
          3. Features &amp; Tier Capabilities
        </h3>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">
            Support Tier
          </label>
          <select
            value={formData.support_tier}
            onChange={(e) => setFormData({ ...formData, support_tier: e.target.value })}
            className="w-full sm:w-72 px-3 py-2 rounded-lg border border-zinc-300 text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#581c87] bg-white cursor-pointer"
          >
            <option value="EMAIL">Standard Email Support</option>
            <option value="PRIORITY_WHATSAPP">Priority WhatsApp &amp; Phone</option>
            <option value="DEDICATED_MANAGER">Dedicated Account Manager</option>
            <option value="COMMUNITY">Community / FAQ</option>
          </select>
        </div>

        {/* Feature List Manager */}
        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">
            Plan Feature Highlights
          </label>
          <div className="flex gap-2 mb-2">
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
              placeholder="Add a feature point"
              className="flex-1 px-3.5 py-2 rounded-lg border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#581c87]"
            />
            <button
              type="button"
              onClick={handleAddFeature}
              className="py-2 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              + Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {formData.features_list?.map((feature, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-purple-50 text-[#581c87] border border-purple-200"
              >
                <span>{feature}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(idx)}
                  className="text-purple-400 hover:text-red-600 font-bold ml-1 cursor-pointer"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <label className="flex items-center gap-2 text-xs text-zinc-700 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.has_api_access}
              onChange={(e) => setFormData({ ...formData, has_api_access: e.target.checked })}
              className="rounded text-[#581c87] focus:ring-[#581c87]"
            />
            <span>REST API Access</span>
          </label>

          <label className="flex items-center gap-2 text-xs text-zinc-700 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.has_autoresponders}
              onChange={(e) => setFormData({ ...formData, has_autoresponders: e.target.checked })}
              className="rounded text-[#581c87] focus:ring-[#581c87]"
            />
            <span>Autoresponders</span>
          </label>

          <label className="flex items-center gap-2 text-xs text-zinc-700 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="rounded text-[#581c87] focus:ring-[#581c87]"
            />
            <span className="font-semibold text-purple-900">Featured / Highlight</span>
          </label>

          <label className="flex items-center gap-2 text-xs text-zinc-700 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="rounded text-[#581c87] focus:ring-[#581c87]"
            />
            <span className="font-semibold text-emerald-800">Active (Public)</span>
          </label>
        </div>
      </div>

      {/* Buttons */}
      <div className="pt-4 border-t border-zinc-200 flex items-center justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="py-2.5 px-4 rounded-lg text-xs font-semibold text-zinc-600 hover:bg-zinc-100 border border-zinc-200 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="py-2.5 px-6 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
        >
          {updateMutation.isPending ? "Saving Changes..." : "Save Plan Changes"}
        </button>
      </div>
    </form>
  );
}

export default UpdatePlanForm;
