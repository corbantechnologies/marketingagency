"use client";

import React from "react";
import Link from "next/link";

export default function AdminAuditPage() {
  const auditLogs = [
    {
      id: "log-101",
      action: "JWT_LOGIN_SUCCESS",
      user: "superadmin@ljk.co.ke",
      ip: "127.0.0.1",
      timestamp: "Just now",
      status: "SUCCESS",
    },
    {
      id: "log-102",
      action: "BUSINESS_WORKSPACE_PROVISIONED",
      user: "mbogoequities@gmail.com",
      ip: "102.215.34.12",
      timestamp: "2 hours ago",
      status: "SUCCESS",
    },
    {
      id: "log-103",
      action: "API_KEY_GENERATED",
      user: "mbogoequities@gmail.com",
      ip: "102.215.34.12",
      timestamp: "3 hours ago",
      status: "SUCCESS",
    },
  ];

  return (
    <div className="space-y-6 w-full max-w-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
            <Link href="/admin/dashboard" className="hover:text-zinc-900">Admin Console</Link>
            <span>/</span>
            <span className="text-zinc-900 font-medium">Security &amp; Audit</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            Security Audit Logs &amp; Access History
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 mt-0.5">
            Immutable log trail of authentication events, role escalations, and API token generations.
          </p>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="divide-y divide-zinc-100 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-zinc-400 font-bold uppercase tracking-wider border-b border-zinc-200 pb-2">
                <th className="py-3 px-2">Event Action</th>
                <th className="py-3 px-2">User / Actor</th>
                <th className="py-3 px-2">Origin IP</th>
                <th className="py-3 px-2">Timestamp</th>
                <th className="py-3 px-2 text-right">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-zinc-50/60 transition-colors">
                  <td className="py-3.5 px-2 font-mono font-bold text-zinc-900">{log.action}</td>
                  <td className="py-3.5 px-2 text-zinc-700">{log.user}</td>
                  <td className="py-3.5 px-2 font-mono text-zinc-500">{log.ip}</td>
                  <td className="py-3.5 px-2 text-zinc-500">{log.timestamp}</td>
                  <td className="py-3.5 px-2 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
