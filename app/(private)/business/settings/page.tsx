/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useFetchBusinesses, useUpdateBusiness } from "@/hooks/business/actions";
import { Business } from "@/services/business";
import toast from "react-hot-toast";

function BusinessSettingsForm({ primaryBusiness }: { primaryBusiness?: Business }) {
  const updateBusinessMutation = useUpdateBusiness();

  const [bizName, setBizName] = useState(primaryBusiness?.name || "");
  const [bizEmail, setBizEmail] = useState(primaryBusiness?.email || "");
  const [bizPhone, setBizPhone] = useState(primaryBusiness?.phone || "");
  const [bizAddress, setBizAddress] = useState(primaryBusiness?.address || "");

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bizName.trim()) {
      toast.error("Business name cannot be empty");
      return;
    }
    if (!primaryBusiness) {
      toast.error("No active business workspace found");
      return;
    }

    updateBusinessMutation.mutate(
      {
        reference: primaryBusiness.reference,
        data: {
          name: bizName.trim(),
          email: bizEmail.trim() || undefined,
          phone: bizPhone.trim() || undefined,
          address: bizAddress.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Workspace profile updated successfully!");
        },
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.name?.[0] ||
            err?.response?.data?.email?.[0] ||
            err?.response?.data?.detail ||
            "Failed to update workspace profile"
          );
        },
      }
    );
  };

  return (
    <form onSubmit={handleSaveSettings} className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
          Business / Company Name *
        </label>
        <input
          type="text"
          required
          value={bizName}
          onChange={(e) => setBizName(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#581c87]"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
            Contact Email
          </label>
          <input
            type="email"
            value={bizEmail}
            onChange={(e) => setBizEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#581c87]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
            Support / Contact Phone
          </label>
          <input
            type="tel"
            value={bizPhone}
            onChange={(e) => setBizPhone(e.target.value)}
            placeholder="+254712345678"
            className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#581c87]"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
          Physical / Office Address
        </label>
        <textarea
          rows={2}
          value={bizAddress}
          onChange={(e) => setBizAddress(e.target.value)}
          placeholder="e.g. Westlands Commercial Center, 4th Floor, Nairobi"
          className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#581c87]"
        />
      </div>

      <button
        type="submit"
        disabled={updateBusinessMutation.isPending}
        className="py-2.5 px-5 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
      >
        {updateBusinessMutation.isPending ? "Saving Changes..." : "Save Workspace Changes"}
      </button>
    </form>
  );
}

export default function BusinessSettingsPage() {
  const { data: session } = useSession();
  const { data: businessesData, isLoading } = useFetchBusinesses();

  const businesses: Business[] = Array.isArray(businessesData)
    ? businessesData
    : (businessesData as any)?.results || [];

  const primaryBusiness = businesses[0];

  return (
    <div className="space-y-6 w-full max-w-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
            <Link href="/business/dashboard" className="hover:text-zinc-900">Dashboard</Link>
            <span>/</span>
            <span className="text-zinc-900 font-medium">Settings</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            Workspace &amp; Account Settings
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 mt-0.5">
            Manage your company information, communication preferences, and security settings.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-xs text-zinc-500">Loading workspace settings...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 7 cols: Business Profile */}
          <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-xl p-5 sm:p-7 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-zinc-900">
              Workspace Profile
            </h2>

            <BusinessSettingsForm
              key={primaryBusiness?.reference || "new"}
              primaryBusiness={primaryBusiness}
            />
          </div>

          {/* Right 5 cols: Account Security Summary */}
          <div className="lg:col-span-5 bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4 h-fit">
            <h2 className="text-base font-bold text-zinc-900">
              Account Security &amp; Credentials
            </h2>

            <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200 space-y-1 text-xs">
              <div className="text-zinc-500">Agency Member Code</div>
              <div className="font-mono font-bold text-zinc-900 text-sm">
                {session?.user?.member_code || session?.user?.code || primaryBusiness?.code || "MA26001"}
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200 space-y-1 text-xs">
              <div className="text-zinc-500">Subscribed Tier</div>
              <div className="font-bold text-[#581c87]">
                {primaryBusiness?.plan_detail?.name || primaryBusiness?.active_plan || "Starter PAYG"}
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200 space-y-1 text-xs">
              <div className="text-zinc-500">Authentication Method</div>
              <div className="font-medium text-zinc-800">
                JWT Bearer &bull; NextAuth v4 Session Token
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/auth/forgot-password"
                className="inline-block text-xs font-semibold text-[#581c87] hover:underline"
              >
                Change Account Password &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
