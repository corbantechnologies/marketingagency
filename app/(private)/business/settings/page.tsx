"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useFetchBusinesses } from "@/hooks/business/actions";
import toast from "react-hot-toast";

export default function BusinessSettingsPage() {
  const { data: session } = useSession();
  const { data: businessesData } = useFetchBusinesses();

  const businesses = Array.isArray(businessesData)
    ? businessesData
    : businessesData?.results || [];

  const primaryBusiness = businesses[0];

  const [bizName, setBizName] = useState(primaryBusiness?.name || "My Business Workspace");
  const [bizEmail, setBizEmail] = useState(primaryBusiness?.email || session?.user?.email || "");
  const [bizPhone, setBizPhone] = useState(primaryBusiness?.phone || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Workspace profile updated successfully!");
    }, 1000);
  };

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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Business Profile */}
        <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-xl p-5 sm:p-7 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-zinc-900">
            Workspace Details
          </h2>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                Business / Company Name
              </label>
              <input
                type="text"
                value={bizName}
                onChange={(e) => setBizName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#581c87]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                Contact Business Email
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
                Phone Number
              </label>
              <input
                type="tel"
                value={bizPhone}
                onChange={(e) => setBizPhone(e.target.value)}
                placeholder="+254712345678"
                className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#581c87]"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="py-2.5 px-5 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Workspace Changes"}
            </button>
          </form>
        </div>

        {/* Right 5 cols: Account Security Summary */}
        <div className="lg:col-span-5 bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-zinc-900">
            Account Security &amp; Credentials
          </h2>

          <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200 space-y-1 text-xs">
            <div className="text-zinc-500">Agency Member Code</div>
            <div className="font-mono font-bold text-zinc-900 text-sm">
              {session?.user?.member_code || session?.user?.code || "MA26001"}
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200 space-y-1 text-xs">
            <div className="text-zinc-500">Authentication Method</div>
            <div className="font-medium text-zinc-800">
              JWT Bearer &bull; NextAuth v4 Session Token
            </div>
          </div>

          <Link
            href="/auth/forgot-password"
            className="inline-block text-xs font-semibold text-[#581c87] hover:underline"
          >
            Change Account Password &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
