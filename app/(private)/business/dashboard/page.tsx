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
    <div className="space-y-6 w-full max-w-none">
      {/* Welcome & Quick Action Card */}
      <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xs">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-purple-50 border border-purple-200 text-[11px] font-semibold text-[#581c87] mb-2 max-w-full truncate">
            Workspace: {primaryBusiness ? primaryBusiness.name : "Default Workspace"}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            SMS &amp; Customer Messaging Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 mt-1 break-words">
            Logged in as <span className="font-medium text-zinc-900">{session?.user?.email}</span> &bull; Account Code: <span className="font-mono text-zinc-800">{session?.user?.member_code || session?.user?.code || "MA26001"}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 lg:pt-0">
          <Link
            href="/business/sms/broadcast"
            className="py-2.5 px-4 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span>Launch Bulk SMS</span>
          </Link>
          <Link
            href="/business/billing"
            className="py-2.5 px-3.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Buy Credits
          </Link>
        </div>
      </div>

      {/* 4 Core Business Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4">
        {/* Metric 1: SMS Balance */}
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-purple-200 transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Available SMS Balance
              </span>
              <Link href="/business/billing" className="text-xs text-[#581c87] hover:underline font-semibold">
                + Top up
              </Link>
            </div>
            <div className="text-3xl font-bold text-[#581c87] mt-2">
              0 <span className="text-sm font-normal text-zinc-500">Credits</span>
            </div>
          </div>
          <div className="text-[11px] text-zinc-500 mt-3 pt-3 border-t border-zinc-100 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
            <span>Top up via M-PESA to activate balance</span>
          </div>
        </div>

        {/* Metric 2: Total SMS Sent */}
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-purple-200 transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Total SMS Sent
              </span>
              <Link href="/business/reports" className="text-xs text-[#581c87] hover:underline font-semibold">
                Reports &rarr;
              </Link>
            </div>
            <div className="text-3xl font-bold text-zinc-900 mt-2">
              0 <span className="text-sm font-normal text-zinc-500">Messages</span>
            </div>
          </div>
          <div className="text-[11px] text-zinc-500 mt-3 pt-3 border-t border-zinc-100 flex items-center gap-1.5">
            <span className="text-purple-600 font-semibold">&bull; 0</span> sent this billing cycle
          </div>
        </div>

        {/* Metric 3: Delivery Rate */}
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-purple-200 transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Handset Delivery Rate
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                Tier-1 Direct
              </span>
            </div>
            <div className="text-3xl font-bold text-emerald-600 mt-2">
              99.4%
            </div>
          </div>
          <div className="text-[11px] text-zinc-500 mt-3 pt-3 border-t border-zinc-100 flex items-center gap-1.5">
            <span className="text-emerald-600 font-semibold">~1.8s</span> average handset delivery speed
          </div>
        </div>

        {/* Metric 4: Total Contacts */}
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-purple-200 transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Saved Contacts
              </span>
              <Link href="/business/sms/broadcast" className="text-xs text-[#581c87] hover:underline font-semibold">
                Import CSV
              </Link>
            </div>
            <div className="text-3xl font-bold text-zinc-900 mt-2">
              0 <span className="text-sm font-normal text-zinc-500">Recipients</span>
            </div>
          </div>
          <div className="text-[11px] text-zinc-500 mt-3 pt-3 border-t border-zinc-100 flex items-center gap-1.5">
            <span className="text-zinc-600 font-medium">Ready for broadcast targeting</span>
          </div>
        </div>
      </div>

      {/* Main Two Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: Broadcast Activity & Workspaces */}
        <div className="xl:col-span-8 space-y-6">
          {/* Recent Broadcasts Card */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-zinc-900">
                  Recent SMS Campaigns
                </h2>
                <p className="text-xs text-zinc-500">Live delivery reports for your recent broadcasts</p>
              </div>
              <Link
                href="/business/sms/broadcast"
                className="text-xs font-semibold text-[#581c87] hover:underline"
              >
                + New Campaign
              </Link>
            </div>

            {/* Empty State */}
            <div className="border-2 border-dashed border-zinc-200 rounded-lg p-8 text-center my-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-purple-50 text-[#581c87] flex items-center justify-center mb-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-zinc-900">No SMS campaigns sent yet</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1 mb-4">
                Top up your wallet via M-PESA from KSh 100 to launch your first high-deliverability SMS broadcast.
              </p>
              <Link
                href="/business/billing"
                className="inline-flex items-center gap-1.5 py-2 px-3.5 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs font-semibold rounded-md transition-colors shadow-xs"
              >
                <span>Top Up &amp; Send First Message</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>

          {/* Registered Workspaces Card */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-zinc-900">
                Your Registered Workspaces
              </h2>
              <span className="text-xs text-zinc-500">
                {businesses.length} {businesses.length === 1 ? "workspace" : "workspaces"}
              </span>
            </div>

            {isBusinessesLoading ? (
              <div className="py-8 text-center text-xs text-zinc-500">Loading workspace data...</div>
            ) : businesses.length > 0 ? (
              <div className="divide-y divide-zinc-100">
                {businesses.map((biz) => (
                  <div key={biz.id || biz.reference} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="min-w-0">
                      <div className="font-semibold text-zinc-900 text-sm truncate">{biz.name}</div>
                      <div className="text-zinc-500 mt-0.5 break-all">
                        Email: {biz.email || "—"} &bull; Ref: <span className="font-mono text-zinc-700">{biz.reference}</span>
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
              <div className="py-6 text-center text-xs text-zinc-500">
                No registered business found.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Quick Actions & Explainer Card */}
        <div className="xl:col-span-4 space-y-6">
          {/* Quick Actions Card */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs">
            <h2 className="text-sm font-bold text-zinc-900 mb-3">
              Quick Actions
            </h2>
            <div className="space-y-2 text-xs">
              <Link
                href="/business/sms/broadcast"
                className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 hover:border-purple-300 hover:bg-purple-50/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-purple-50 text-[#581c87] group-hover:bg-[#581c87] group-hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-zinc-900">Send Bulk SMS</div>
                    <div className="text-[11px] text-zinc-500">Broadcast to phone lists or CSV</div>
                  </div>
                </div>
                <span className="text-zinc-400 group-hover:text-[#581c87]">&rarr;</span>
              </Link>

              <Link
                href="/business/billing"
                className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 hover:border-purple-300 hover:bg-purple-50/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-purple-50 text-[#581c87] group-hover:bg-[#581c87] group-hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-zinc-900">Buy SMS Credits</div>
                    <div className="text-[11px] text-zinc-500">M-Pesa instant top up</div>
                  </div>
                </div>
                <span className="text-zinc-400 group-hover:text-[#581c87]">&rarr;</span>
              </Link>

              <Link
                href="/business/sender-ids"
                className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 hover:border-purple-300 hover:bg-purple-50/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-purple-50 text-[#581c87] group-hover:bg-[#581c87] group-hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-zinc-900">Custom Sender ID</div>
                    <div className="text-[11px] text-zinc-500">Brand your company SMS name</div>
                  </div>
                </div>
                <span className="text-zinc-400 group-hover:text-[#581c87]">&rarr;</span>
              </Link>
            </div>
          </div>

          {/* Explainer: What is a Sender ID? */}
          <div className="bg-purple-50/70 border border-purple-200/80 rounded-xl p-5 shadow-xs space-y-2.5">
            <div className="flex items-center gap-2 text-[#581c87] font-bold text-xs uppercase tracking-wider">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>What is a Sender ID?</span>
            </div>
            <p className="text-xs text-zinc-700 leading-relaxed">
              When customers receive your SMS, a <strong>Sender ID</strong> is the 11-character company name (e.g. <em>SAFARICOM</em> or <em>YOURBRAND</em>) that appears at the top of their screen instead of a random number.
            </p>
            <p className="text-xs text-zinc-600 leading-relaxed">
              By default, your account sends messages instantly using our shared route <code className="px-1.5 py-0.5 rounded bg-purple-100 text-[#581c87] font-mono text-[11px]">LJK_AGENCY</code>. You can also register your own dedicated company name anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
