/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useFetchUsersList } from "@/hooks/accounts/actions";

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: usersData, isLoading } = useFetchUsersList();

  const users = Array.isArray(usersData)
    ? usersData
    : (usersData && typeof usersData === "object" && "results" in usersData ? (usersData as { results: any[] }).results : []);

  const filteredUsers = users.filter((u: any) =>
    (u.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.first_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.last_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.member_code || u.code || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 w-full max-w-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
            <Link href="/admin/dashboard" className="hover:text-zinc-900">Admin Console</Link>
            <span>/</span>
            <span className="text-zinc-900 font-medium">Users &amp; Staff</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            Portal Users &amp; Staff Directory
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 mt-0.5">
            Manage authenticated users, staff roles, super-administrators, and account credentials.
          </p>
        </div>

        <Link
          href="/auth/alpha/signup"
          className="py-2 px-3.5 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs self-start sm:self-auto"
        >
          + Add Admin / Staff
        </Link>
      </div>

      {/* Directory Table */}
      <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or member code..."
            className="w-full sm:w-80 px-3.5 py-2 rounded-lg border border-zinc-300 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#581c87]"
          />
          <div className="text-xs text-zinc-500 self-end sm:self-center">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-xs text-zinc-500">Loading users directory...</div>
        ) : filteredUsers.length > 0 ? (
          <div className="divide-y divide-zinc-100 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-zinc-400 font-bold uppercase tracking-wider border-b border-zinc-200 pb-2">
                  <th className="py-3 px-2">User Name</th>
                  <th className="py-3 px-2">Member Code</th>
                  <th className="py-3 px-2">Email Address</th>
                  <th className="py-3 px-2">Role</th>
                  <th className="py-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredUsers.map((user: any) => (
                  <tr key={user.id || user.reference || user.code} className="hover:bg-zinc-50/60 transition-colors">
                    <td className="py-3.5 px-2 font-semibold text-zinc-900">
                      {user.first_name || user.last_name
                        ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
                        : "Portal User"}
                    </td>
                    <td className="py-3.5 px-2 font-mono text-zinc-600">
                      {user.member_code || user.code || user.reference}
                    </td>
                    <td className="py-3.5 px-2 text-zinc-600">{user.email}</td>
                    <td className="py-3.5 px-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        user.is_admin || user.is_staff || user.is_superuser
                          ? "bg-amber-100 text-amber-900 border border-amber-300"
                          : "bg-purple-100 text-purple-900 border border-purple-200"
                      }`}>
                        {user.is_admin || user.is_staff || user.is_superuser ? "Administrator" : "Business Client"}
                      </span>
                    </td>
                    <td className="py-3.5 px-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        user.is_active ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-zinc-100 text-zinc-600"
                      }`}>
                        {user.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-zinc-500">
            No user accounts found matching &ldquo;{searchTerm}&rdquo;.
          </div>
        )}
      </div>
    </div>
  );
}
