"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useFetchBusinesses } from "@/hooks/business/actions";

export default function BusinessDashboardPage() {
  const { data: session } = useSession();
  const { data: businessesData, isLoading: isBusinessesLoading } = useFetchBusinesses();

  const businesses = Array.isArray(businessesData)
    ? businessesData
    : businessesData?.results || [];

  const primaryBusiness = businesses[0];

  return (
    <div className="space-y-6">
      {/* Welcome & Quick Action Card */}
      <div className="bg-white border border-zinc-200 rounded-lg p-4 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xs">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-purple-50 border border-purple-200 text-[11px] font-semibold text-[#581c87] mb-2 max-w-full truncate">
            Workspace: {primaryBusiness ? primaryBusiness.name : "Active Account"}
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-zinc-900 tracking-tight">
            Bulk SMS &amp; Email Dashboard
          </h1>
          <p className="text-xs text-zinc-600 mt-1 break-words">
            Account: <span className="font-medium text-zinc-800">{session?.user?.email}</span> &bull; Member: <span className="font-mono text-zinc-700">{session?.user?.member_code || session?.user?.code || "MA26001"}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 lg:pt-0">
          <Link
            href="/business/sms/broadcast"
            className="py-2 px-3.5 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span>Launch Broadcast</span>
          </Link>
          <Link
            href="/business/billing"
            className="py-2 px-3.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-md transition-colors"
          >
            Buy Credits
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-zinc-200 rounded-lg p-4 sm:p-5 shadow-xs">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
            Available SMS Balance
          </div>
          <div className="text-2xl font-bold text-[#581c87]">
            50 <span className="text-xs font-normal text-zinc-500">Credits</span>
          </div>
          <div className="text-[11px] text-zinc-500 mt-2 flex items-center gap-1">
            <span className="text-emerald-600 font-semibold">&bull; Free trial</span> balance active
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-lg p-4 sm:p-5 shadow-xs">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
            Average Delivery Speed
          </div>
          <div className="text-2xl font-bold text-emerald-600">
            1.8s
          </div>
          <div className="text-[11px] text-zinc-500 mt-2 flex items-center gap-1">
            <span className="text-emerald-600 font-semibold">99.4%</span> Handset delivery rate
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-lg p-4 sm:p-5 shadow-xs">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
            Sender ID Status
          </div>
          <div className="text-2xl font-bold text-zinc-900 truncate">
            LJK_AGENCY
          </div>
          <div className="text-[11px] text-zinc-500 mt-2 flex items-center gap-1">
            <span className="text-purple-600 font-semibold">&bull; Shared route</span> available
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-lg p-4 sm:p-5 shadow-xs">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
            Developer API Gateway
          </div>
          <div className="text-2xl font-bold text-zinc-900">
            REST &bull; SMPP
          </div>
          <div className="text-[11px] text-zinc-500 mt-2 flex items-center gap-1">
            <span className="text-emerald-600 font-semibold">Ready</span> for live API integration
          </div>
        </div>
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white border border-zinc-200 rounded-lg p-4 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-zinc-900">
              Your Registered Businesses
            </h2>
            <Link
              href="/business/settings"
              className="text-xs font-medium text-[#581c87] hover:underline"
            >
              Workspace settings &rarr;
            </Link>
          </div>

          {isBusinessesLoading ? (
            <div className="py-12 text-center text-xs text-zinc-500">Loading business profile...</div>
          ) : businesses.length > 0 ? (
            <div className="divide-y divide-zinc-100">
              {businesses.map((biz) => (
                <div key={biz.id || biz.reference} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="min-w-0">
                    <div className="font-semibold text-zinc-900 text-sm truncate">{biz.name}</div>
                    <div className="text-zinc-500 mt-0.5 break-all">
                      Email: {biz.email || "—"} &bull; Ref: {biz.reference}
                    </div>
                  </div>
                  <span className={`self-start sm:self-center px-2.5 py-0.5 rounded text-[11px] font-semibold shrink-0 ${
                    biz.is_active ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-zinc-100 text-zinc-600"
                  }`}>
                    {biz.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-xs text-zinc-500">
              No registered business found.
            </div>
          )}
        </div>

        <div className="lg:col-span-4 bg-white border border-zinc-200 rounded-lg p-4 sm:p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-semibold text-zinc-900">
            Quick Start Guide
          </h2>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-zinc-50 rounded border border-zinc-200">
              <div className="font-semibold text-zinc-900 mb-1">1. Test Your 50 Credits</div>
              <div className="text-zinc-600 leading-relaxed">
                Send a live test SMS to your phone to check carrier latency and delivery speed.
              </div>
            </div>

            <div className="p-3 bg-zinc-50 rounded border border-zinc-200">
              <div className="font-semibold text-zinc-900 mb-1">2. Register Custom Sender ID</div>
              <div className="text-zinc-600 leading-relaxed">
                Brand your company name on Safaricom, Airtel, and Telkom handsets.
              </div>
            </div>

            <div className="p-3 bg-zinc-50 rounded border border-zinc-200">
              <div className="font-semibold text-zinc-900 mb-1">3. Integrate REST / SMPP API</div>
              <div className="text-zinc-600 leading-relaxed">
                Generate API keys to send transactional OTPs and automated CRM alerts.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
