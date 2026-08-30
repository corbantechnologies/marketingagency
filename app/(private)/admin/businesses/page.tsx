"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useFetchBusinesses, useDeactivateBusiness, useReactivateBusiness } from "@/hooks/business/actions";
import toast from "react-hot-toast";

export default function AdminBusinessesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: businessesData, isLoading } = useFetchBusinesses();
  const deactivateMutation = useDeactivateBusiness();
  const reactivateMutation = useReactivateBusiness();

  const businesses = Array.isArray(businessesData)
    ? businessesData
    : businessesData?.results || [];

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

  return (
    <div className="space-y-6 w-full max-w-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
            Oversee tenant accounts, customer workspaces, soft deletion status, and member associations.
          </p>
        </div>
      </div>

      {/* Directory Card */}
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
            Showing {filteredBusinesses.length} of {businesses.length} businesses
          </div>
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-xs text-zinc-500">Loading business directory...</div>
        ) : filteredBusinesses.length > 0 ? (
          <div className="divide-y divide-zinc-100 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-zinc-400 font-bold uppercase tracking-wider border-b border-zinc-200 pb-2">
                  <th className="py-3 px-2">Business Name</th>
                  <th className="py-3 px-2">Reference Code</th>
                  <th className="py-3 px-2">Contact Email</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredBusinesses.map((biz) => (
                  <tr key={biz.id || biz.reference} className="hover:bg-zinc-50/60 transition-colors">
                    <td className="py-3.5 px-2 font-semibold text-zinc-900">{biz.name}</td>
                    <td className="py-3.5 px-2 font-mono text-zinc-600">{biz.reference || biz.code}</td>
                    <td className="py-3.5 px-2 text-zinc-600">{biz.email || "—"}</td>
                    <td className="py-3.5 px-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        biz.is_active ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-zinc-100 text-zinc-600"
                      }`}>
                        {biz.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-right">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-zinc-500">
            No businesses found matching &ldquo;{searchTerm}&rdquo;.
          </div>
        )}
      </div>
    </div>
  );
}
