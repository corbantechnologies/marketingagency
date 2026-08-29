"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useFetchBusinesses } from "@/hooks/business/actions";
import { useFetchUsersList } from "@/hooks/accounts/actions";

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const { data: businessesData, isLoading: isBusinessesLoading } = useFetchBusinesses();
  const { data: usersData, isLoading: isUsersLoading } = useFetchUsersList();

  const totalBusinesses = Array.isArray(businessesData)
    ? businessesData.length
    : businessesData?.count || 0;

  const totalUsers = Array.isArray(usersData)
    ? usersData.length
    : usersData && typeof usersData === "object" && "count" in usersData
    ? (usersData as { count: number }).count
    : 0;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white border border-zinc-200 rounded-lg p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-purple-50 border border-purple-200 text-[11px] font-semibold text-[#581c87] mb-2">
            System Status: Operational
          </div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
            Agency Administrator Console
          </h1>
          <p className="text-xs text-zinc-600 mt-1">
            Welcome back, {session?.user?.name || "Admin"}. Review telecom gateway performance, customer businesses, and user accounts.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/admin/businesses"
            className="py-2 px-3.5 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs font-semibold rounded transition-colors"
          >
            Manage Businesses
          </Link>
          <Link
            href="/admin/users"
            className="py-2 px-3.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded transition-colors"
          >
            Manage Users
          </Link>
        </div>
      </div>

      {/* Metrics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-zinc-200 rounded-lg p-5 shadow-xs">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
            Active Businesses
          </div>
          <div className="text-2xl font-bold text-zinc-900">
            {isBusinessesLoading ? "..." : totalBusinesses}
          </div>
          <div className="text-[11px] text-zinc-500 mt-2 flex items-center gap-1">
            <span className="text-emerald-600 font-semibold">&uarr; Multi-tenant</span> registered workspaces
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-lg p-5 shadow-xs">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
            Total Portal Users
          </div>
          <div className="text-2xl font-bold text-zinc-900">
            {isUsersLoading ? "..." : totalUsers}
          </div>
          <div className="text-[11px] text-zinc-500 mt-2 flex items-center gap-1">
            <span className="text-purple-600 font-semibold">&bull; Active</span> accounts &amp; staff
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-lg p-5 shadow-xs">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
            SMS Carrier Route Latency
          </div>
          <div className="text-2xl font-bold text-emerald-600">
            1.8s
          </div>
          <div className="text-[11px] text-zinc-500 mt-2 flex items-center gap-1">
            <span className="text-emerald-600 font-semibold">99.4%</span> delivery SLA
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-lg p-5 shadow-xs">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
            Gateway Throughput
          </div>
          <div className="text-2xl font-bold text-zinc-900">
            1,200 <span className="text-sm font-normal text-zinc-500">msg/sec</span>
          </div>
          <div className="text-[11px] text-zinc-500 mt-2 flex items-center gap-1">
            <span className="text-emerald-600 font-semibold">Direct SMPP 3.4</span> connectivity
          </div>
        </div>
      </div>

      {/* Quick Action & Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white border border-zinc-200 rounded-lg p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-zinc-900">
              Recent Registered Businesses
            </h2>
            <Link
              href="/admin/businesses"
              className="text-xs font-medium text-[#581c87] hover:underline"
            >
              View all &rarr;
            </Link>
          </div>

          {isBusinessesLoading ? (
            <div className="py-12 text-center text-xs text-zinc-500">Loading businesses list...</div>
          ) : Array.isArray(businessesData) && businessesData.length > 0 ? (
            <div className="divide-y divide-zinc-100">
              {businessesData.slice(0, 5).map((biz) => (
                <div key={biz.id || biz.reference} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-zinc-900">{biz.name}</div>
                    <div className="text-zinc-500">{biz.email || "No email"} &bull; Code: {biz.code}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    biz.is_active ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-zinc-100 text-zinc-600"
                  }`}>
                    {biz.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-zinc-500">
              No registered businesses found.
            </div>
          )}
        </div>

        <div className="lg:col-span-4 bg-white border border-zinc-200 rounded-lg p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-semibold text-zinc-900">
            Telecom Route Health
          </h2>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-zinc-50 rounded border border-zinc-200">
              <div className="flex items-center justify-between font-medium text-zinc-800 mb-1">
                <span>Safaricom Tier-1 Direct</span>
                <span className="text-emerald-600 font-semibold">100% Up</span>
              </div>
              <div className="text-[11px] text-zinc-500">Avg DLR: 1.4s &bull; Alphanumeric Sender ID Ready</div>
            </div>

            <div className="p-3 bg-zinc-50 rounded border border-zinc-200">
              <div className="flex items-center justify-between font-medium text-zinc-800 mb-1">
                <span>Airtel Direct Route</span>
                <span className="text-emerald-600 font-semibold">100% Up</span>
              </div>
              <div className="text-[11px] text-zinc-500">Avg DLR: 1.9s &bull; High volume promotional enabled</div>
            </div>

            <div className="p-3 bg-zinc-50 rounded border border-zinc-200">
              <div className="flex items-center justify-between font-medium text-zinc-800 mb-1">
                <span>Transactional OTP Gateway</span>
                <span className="text-emerald-600 font-semibold">Priority 0</span>
              </div>
              <div className="text-[11px] text-zinc-500">Instant carrier handoff with backup route failover</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
