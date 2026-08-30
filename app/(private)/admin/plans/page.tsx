/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  useFetchPlans,
  useDeactivatePlan,
  useReactivatePlan,
  useDeletePlan,
} from "@/hooks/plans/actions";
import { Plan } from "@/services/plans";
import { CreatePlanForm } from "@/forms/plans/CreatePlanForm";
import { UpdatePlanForm } from "@/forms/plans/UpdatePlanForm";
import toast from "react-hot-toast";

export default function AdminPlansPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [deletingPlan, setDeletingPlan] = useState<Plan | null>(null);

  const { data: plansData, isLoading } = useFetchPlans();
  const deactivateMutation = useDeactivatePlan();
  const reactivateMutation = useReactivatePlan();
  const deleteMutation = useDeletePlan();

  const plans: Plan[] = Array.isArray(plansData)
    ? plansData
    : (plansData && typeof plansData === "object" && "results" in plansData ? (plansData as any).results : []);

  // Filter plans by search term and category
  const filteredPlans = plans.filter((p) => {
    const matchesSearch =
      (p.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.tagline || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.reference || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.badge_text || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "ALL" || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleToggleStatus = (plan: Plan) => {
    if (plan.is_active) {
      deactivateMutation.mutate(plan.reference, {
        onSuccess: () => toast.success(`Plan "${plan.name}" marked inactive`),
        onError: () => toast.error("Failed to deactivate plan"),
      });
    } else {
      reactivateMutation.mutate(plan.reference, {
        onSuccess: () => toast.success(`Plan "${plan.name}" reactivated successfully`),
        onError: () => toast.error("Failed to reactivate plan"),
      });
    }
  };

  const handleConfirmDelete = () => {
    if (!deletingPlan) return;
    deleteMutation.mutate(deletingPlan.reference, {
      onSuccess: () => {
        toast.success(`Plan "${deletingPlan.name}" deleted permanently`);
        setDeletingPlan(null);
      },
      onError: () => {
        toast.error("Failed to delete plan");
      },
    });
  };

  return (
    <div className="space-y-6 w-full max-w-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
            <Link href="/admin/dashboard" className="hover:text-zinc-900">Admin Console</Link>
            <span>/</span>
            <span className="text-zinc-900 font-medium">Pricing &amp; Plans</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            Tier &amp; Subscription Plans Manager
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 mt-0.5">
            Configure public pricing cards, SMS rates, included credits, feature capabilities, and custom enterprise retainers.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="py-2.5 px-4 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Create New Plan</span>
        </button>
      </div>

      {/* KPI Cards Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Total Plans</div>
          <div className="text-2xl font-bold text-zinc-900 mt-1">{plans.length}</div>
          <div className="text-[11px] text-zinc-400 mt-1">Configured tiers</div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Active Public</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {plans.filter((p) => p.is_active).length}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">Visible on pricing page</div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Featured Highlights</div>
          <div className="text-2xl font-bold text-[#581c87] mt-1">
            {plans.filter((p) => p.is_featured).length}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">Highlighted cards</div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Categories</div>
          <div className="text-2xl font-bold text-zinc-900 mt-1">4</div>
          <div className="text-[11px] text-zinc-400 mt-1">PAYG, Sub, Bundle, SLA</div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
        {/* Controls: Search and Category Pills */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-zinc-100 p-1 rounded-lg">
            {[
              { id: "ALL", label: "All Plans" },
              { id: "SUBSCRIPTION", label: "Subscriptions" },
              { id: "PAYG", label: "Pay As You Go" },
              { id: "BUNDLE", label: "Bundles" },
              { id: "ENTERPRISE", label: "Enterprise SLA" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-white text-[#581c87] shadow-2xs"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search plans by name, tagline, or reference..."
            className="w-full lg:w-72 px-3.5 py-2 rounded-lg border border-zinc-300 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#581c87]"
          />
        </div>

        {/* Plans Table */}
        {isLoading ? (
          <div className="py-20 text-center text-xs text-zinc-500">Loading plan catalogue...</div>
        ) : filteredPlans.length > 0 ? (
          <div className="divide-y divide-zinc-100 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-zinc-400 font-bold uppercase tracking-wider border-b border-zinc-200 pb-2">
                  <th className="py-3 px-2">Plan Details</th>
                  <th className="py-3 px-2">Category</th>
                  <th className="py-3 px-2">Price</th>
                  <th className="py-3 px-2">SMS Rate</th>
                  <th className="py-3 px-2">Included Credits</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredPlans.map((plan) => (
                  <tr key={plan.id || plan.reference} className="hover:bg-zinc-50/60 transition-colors">
                    {/* Plan Name & Tagline */}
                    <td className="py-3.5 px-2 max-w-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-900 text-sm">{plan.name}</span>
                        {plan.is_featured && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-purple-100 text-[#581c87]">
                            Featured
                          </span>
                        )}
                        {plan.badge_text && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-amber-100 text-amber-900">
                            {plan.badge_text}
                          </span>
                        )}
                      </div>
                      <div className="text-zinc-500 mt-0.5 truncate">{plan.tagline}</div>
                      <div className="text-[10px] text-zinc-400 font-mono mt-0.5">Ref: {plan.reference}</div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-100 text-zinc-700">
                        {plan.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-2">
                      <div className="font-bold text-zinc-900">KES {Number(plan.price_kes).toLocaleString()}</div>
                      <div className="text-[10px] text-zinc-500 font-medium capitalize">{plan.billing_cycle.toLowerCase()}</div>
                    </td>

                    {/* SMS Rate */}
                    <td className="py-3.5 px-2 font-mono font-semibold text-zinc-800">
                      KES {plan.sms_rate_kes}
                    </td>

                    {/* Credits */}
                    <td className="py-3.5 px-2">
                      <div className="font-semibold text-purple-900">{plan.included_sms_credits.toLocaleString()} SMS</div>
                      {plan.included_email_credits > 0 && (
                        <div className="text-[10px] text-zinc-500">{plan.included_email_credits.toLocaleString()} Emails</div>
                      )}
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3.5 px-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        plan.is_active
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-zinc-100 text-zinc-600"
                      }`}>
                        {plan.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-2 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingPlan(plan)}
                          className="py-1 px-2.5 rounded text-[11px] font-semibold text-zinc-700 hover:bg-zinc-100 border border-zinc-200 transition-colors cursor-pointer"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleStatus(plan)}
                          className={`py-1 px-2.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                            plan.is_active
                              ? "text-amber-700 hover:bg-amber-50 border border-amber-200"
                              : "text-emerald-700 hover:bg-emerald-50 border border-emerald-200"
                          }`}
                        >
                          {plan.is_active ? "Deactivate" : "Activate"}
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeletingPlan(plan)}
                          className="p-1 rounded text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Plan"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-xs text-zinc-500">
            No plans found matching &ldquo;{searchTerm}&rdquo; in {selectedCategory}.
          </div>
        )}
      </div>

      {/* Modal: Create Plan */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl max-w-3xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto my-8">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-zinc-900">Create New Pricing Plan</h2>
                <p className="text-xs text-zinc-500">Add a new tier to the agency catalogue</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-800 p-1 text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <CreatePlanForm
              onSuccess={() => setIsCreateModalOpen(false)}
              onCancel={() => setIsCreateModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Modal: Update Plan */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl max-w-3xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto my-8">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-zinc-900">Modify Plan: {editingPlan.name}</h2>
                <p className="text-xs text-zinc-500">Update rates, limits, features and pricing</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingPlan(null)}
                className="text-zinc-400 hover:text-zinc-800 p-1 text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <UpdatePlanForm
              plan={editingPlan}
              onSuccess={() => setEditingPlan(null)}
              onCancel={() => setEditingPlan(null)}
            />
          </div>
        </div>
      )}

      {/* Confirmation Modal: Delete Plan */}
      {deletingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-zinc-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-zinc-900">
              Delete Plan &ldquo;{deletingPlan.name}&rdquo;?
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Are you sure you want to permanently delete this plan? If existing clients are on this plan, we recommend clicking <strong>Deactivate</strong> instead to keep historical billing records intact.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingPlan(null)}
                className="py-2 px-3.5 rounded-lg text-xs font-semibold text-zinc-600 hover:bg-zinc-100 border border-zinc-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="py-2 px-4 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-xs cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
