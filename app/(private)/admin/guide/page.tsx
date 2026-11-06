"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function AdminGuidancePage() {
  const [activeTab, setActiveTab] = useState<
    | "carriers"
    | "finance"
    | "tenants"
    | "security"
    | "sender_ids"
    | "compliance"
    | "inspector"
    | "rates"
    | "announcements"
    | "broadcast"
  >("carriers");


  return (
    <div className="space-y-6 w-full max-w-none">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#2e0854] via-[#581c87] to-[#7e22ce] text-white rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-purple-200 mb-3 backdrop-blur-xs">
            <span>🛡️ LJK Agency Operations Playbook</span>
            <span>&bull;</span>
            <span>Enterprise Standard Operating Procedures</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Agency Administrator Guidance &amp; SOP
          </h1>
          <p className="text-sm sm:text-base text-purple-100/90 mt-2 leading-relaxed">
            Comprehensive operational playbooks for carrier liquidity management, M-Pesa Daraja audits, tenant governance, Lifetime VIP partner entitlements, anti-bot defenses, CAK compliance, and broadcast governance.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2.5 text-xs font-medium">
            <Link
              href="/admin/dashboard"
              className="px-3.5 py-1.5 bg-white text-[#581c87] font-bold rounded-lg hover:bg-purple-50 transition-colors shadow-xs"
            >
              &larr; Admin Dashboard
            </Link>
            <Link
              href="/admin/businesses"
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/20"
            >
              🏢 Tenant Workspaces
            </Link>
            <Link
              href="/admin/finance"
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/20"
            >
              💰 Finance &amp; Ledger
            </Link>
            <Link
              href="/admin/rates"
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/20"
            >
              📊 Rate Cards &amp; Margins
            </Link>
            <Link
              href="/admin/inspector"
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/20"
            >
              🔍 Message Inspector
            </Link>
            <Link
              href="/admin/sender-ids"
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/20"
            >
              🏷️ Sender ID Queue
            </Link>
            <Link
              href="/admin/compliance"
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/20"
            >
              🛡️ Compliance Shield
            </Link>
            <Link
              href="/admin/announcements"
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/20"
            >
              📢 Announcements
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex border-b border-zinc-200 overflow-x-auto no-scrollbar gap-1 text-xs sm:text-sm font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab("carriers")}
          className={`pb-3 px-3.5 whitespace-nowrap border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === "carriers"
              ? "border-[#581c87] text-[#581c87]"
              : "border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300"
          }`}
        >
          <span>📡 Carrier Float &amp; Alerts</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-50 text-[#581c87] border border-purple-200 font-bold">
            Core
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("finance")}
          className={`pb-3 px-3.5 whitespace-nowrap border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === "finance"
              ? "border-[#581c87] text-[#581c87]"
              : "border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300"
          }`}
        >
          <span>💰 Finance &amp; M-Pesa Ledger</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("tenants")}
          className={`pb-3 px-3.5 whitespace-nowrap border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === "tenants"
              ? "border-[#581c87] text-[#581c87]"
              : "border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300"
          }`}
        >
          <span>🏢 Tenant Governance &amp; Lifetime VIP</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold">
            👑 VIP
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("security")}
          className={`pb-3 px-3.5 whitespace-nowrap border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === "security"
              ? "border-[#581c87] text-[#581c87]"
              : "border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300"
          }`}
        >
          <span>🛡️ Anti-Bot &amp; Abuse Defense</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
            Live
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("rates")}
          className={`pb-3 px-3.5 whitespace-nowrap border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === "rates"
              ? "border-[#581c87] text-[#581c87]"
              : "border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300"
          }`}
        >
          <span>📊 Rate Cards &amp; Margins</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("inspector")}
          className={`pb-3 px-3.5 whitespace-nowrap border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === "inspector"
              ? "border-[#581c87] text-[#581c87]"
              : "border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300"
          }`}
        >
          <span>🔍 Message Inspector &amp; DLR</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("sender_ids")}
          className={`pb-3 px-3.5 whitespace-nowrap border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === "sender_ids"
              ? "border-[#581c87] text-[#581c87]"
              : "border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300"
          }`}
        >
          <span>🏷️ Sender ID Vetting</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("compliance")}
          className={`pb-3 px-3.5 whitespace-nowrap border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === "compliance"
              ? "border-[#581c87] text-[#581c87]"
              : "border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300"
          }`}
        >
          <span>🛡️ Compliance Shield &amp; CAK</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("announcements")}
          className={`pb-3 px-3.5 whitespace-nowrap border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === "announcements"
              ? "border-[#581c87] text-[#581c87]"
              : "border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300"
          }`}
        >
          <span>📢 Announcements</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("broadcast")}
          className={`pb-3 px-3.5 whitespace-nowrap border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === "broadcast"
              ? "border-[#581c87] text-[#581c87]"
              : "border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300"
          }`}
        >
          <span>📣 Agency Broadcast Hub</span>
        </button>
      </div>

      {/* 3. Tab Contents */}

      {/* TAB 1: CARRIER LIQUIDITY & FLOAT */}
      {activeTab === "carriers" && (
        <div className="space-y-6">
          {/* Architecture Overview */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h2 className="text-base sm:text-lg font-bold text-zinc-900">
                Dual-Provider Telecom Architecture &amp; Liquidity Guard
              </h2>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Least-Cost Routing (LCR) Active
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              LJK Marketing operates as a wholesale telecom middleman. To maximize gross margins while guaranteeing 99.99% carrier uptime, the platform utilizes a dual-carrier least-cost routing engine:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-blue-950">Advanta Africa (Primary Wholesale)</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    65% – 75% Margin
                  </span>
                </div>
                <p className="text-xs text-blue-900/80 leading-relaxed">
                  Wholesale unit cost: <strong>~KES 0.25 – 0.35 per SMS</strong>. When clients purchase retail packages at KES 0.90 – 1.20, LJK retains over 70% in gross profit. All regular client broadcasts attempt Advanta first.
                </p>
                <div className="text-xs font-mono text-blue-800 pt-1">
                  &bull; Endpoint: QuickSMS REST JSON API (/sendsms/)
                </div>
              </div>

              <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-purple-950">Africa&apos;s Talking (Failover Backup)</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                    High Availability
                  </span>
                </div>
                <p className="text-xs text-purple-900/80 leading-relaxed">
                  Backup unit cost: <strong>~KES 0.80 per SMS</strong>. Provides instant automatic failover if Advanta experiences route latency, carrier maintenance, or network congestion. Prevents client campaign failures.
                </p>
                <div className="text-xs font-mono text-purple-800 pt-1">
                  &bull; Active account: <strong>ljk09</strong> (Live Gateway)
                </div>
              </div>
            </div>
          </div>

          {/* Replenishment SOP */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-zinc-900 border-b border-zinc-100 pb-3">
              Step-by-Step Carrier Float Replenishment (M-Pesa)
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600">
              When carrier balances drop below the operational threshold (&lt; KES 500), admins must replenish the carrier floats via Safaricom M-Pesa:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-zinc-50 border-y border-zinc-200 text-zinc-600 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Carrier</th>
                    <th className="py-2.5 px-3">Paybill Number</th>
                    <th className="py-2.5 px-3">Account Number</th>
                    <th className="py-2.5 px-3">Crediting Speed</th>
                    <th className="py-2.5 px-3">Online Portal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  <tr>
                    <td className="py-3 px-3 font-bold text-zinc-900">Africa&apos;s Talking</td>
                    <td className="py-3 px-3 font-mono font-bold text-purple-700">220220</td>
                    <td className="py-3 px-3 font-mono font-bold text-zinc-800">ljk09</td>
                    <td className="py-3 px-3 text-emerald-700 font-medium">Instant (~60s)</td>
                    <td className="py-3 px-3">
                      <a href="https://account.africastalking.com" target="_blank" rel="noreferrer" className="text-[#581c87] hover:underline font-medium">
                        account.africastalking.com &rarr;
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-zinc-900">Advanta Africa</td>
                    <td className="py-3 px-3 font-mono font-bold text-blue-700">Advanta Paybill</td>
                    <td className="py-3 px-3 font-mono font-bold text-zinc-800">Your Partner ID</td>
                    <td className="py-3 px-3 text-emerald-700 font-medium">Instant (~2 mins)</td>
                    <td className="py-3 px-3">
                      <a href="https://quicksms.advantasms.com" target="_blank" rel="noreferrer" className="text-[#581c87] hover:underline font-medium">
                        quicksms.advantasms.com &rarr;
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Zero SMS Burn Email Alerting */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🛡️</span>
              <h2 className="text-base sm:text-lg font-bold text-zinc-900">
                Zero SMS Burn Policy &amp; Automated Email Notifications
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              To prevent wasting billable client SMS credits on internal monitoring, <strong>100% of operational and financial alerts are delivered via HTML Email (Resend)</strong> to all platform administrators.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-lg border border-amber-200 bg-amber-50/50 space-y-1">
                <div className="text-xs font-bold text-amber-900">⚠️ Low Balance Alert</div>
                <div className="text-[11px] text-amber-800">
                  Fires when active float drops &lt; KES 500 (~1,500 SMS). Throttled to 1 email every 4 hours.
                </div>
              </div>

              <div className="p-3.5 rounded-lg border border-red-200 bg-red-50/50 space-y-1">
                <div className="text-xs font-bold text-red-900">🚨 Critical Depletion</div>
                <div className="text-[11px] text-red-800">
                  Fires immediately when active float drops &lt; KES 150 (~450 SMS) to prevent campaign drops.
                </div>
              </div>

              <div className="p-3.5 rounded-lg border border-purple-200 bg-purple-50/50 space-y-1">
                <div className="text-xs font-bold text-purple-900">☀️ 08:00 AM Standup</div>
                <div className="text-[11px] text-purple-800">
                  Morning briefing detailing current carrier float, 7-day average burn rate, and runway in days.
                </div>
              </div>

              <div className="p-3.5 rounded-lg border border-emerald-200 bg-emerald-50/50 space-y-1">
                <div className="text-xs font-bold text-emerald-900">🌙 08:00 PM Reconciliation</div>
                <div className="text-[11px] text-emerald-800">
                  Evening report: total SMS sent across tenants, M-Pesa top-up revenue, carrier costs &amp; gross profit.
                </div>
              </div>
            </div>

            {/* Adding More Reminder Emails */}
            <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 space-y-3 pt-4 text-xs sm:text-sm">
              <div className="font-bold text-zinc-900 flex items-center gap-2">
                <span>📧 How to Add More Reminder Recipient Emails</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#581c87] text-white">3 Methods Available</span>
              </div>
              <p className="text-zinc-600 leading-relaxed text-xs">
                You can route carrier liquidity alerts, 8 AM morning standups, and 8 PM evening profit reconciliations to multiple team members (finance, operations, directors) using any of the following methods:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
                <div className="bg-white p-3 rounded-lg border border-zinc-200 space-y-1">
                  <div className="font-bold text-zinc-900">1. In-App Dashboard Manager</div>
                  <p className="text-zinc-500">
                    Open <Link href="/admin/dashboard" className="text-[#581c87] underline font-semibold">Admin Dashboard</Link> and click <strong>&quot;🔔 Alert Recipients&quot;</strong>. Add or remove any email directly from the browser with instant testing.
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-zinc-200 space-y-1">
                  <div className="font-bold text-zinc-900">2. Staff / Admin User Accounts</div>
                  <p className="text-zinc-500">
                    Any teammate invited to <Link href="/admin/users" className="text-[#581c87] underline font-semibold">Users &amp; Staff</Link> with <code>Admin</code> or <code>Staff</code> privileges dynamically inherits alert deliveries.
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-zinc-200 space-y-1">
                  <div className="font-bold text-zinc-900">3. Environment Config (.env)</div>
                  <p className="text-zinc-500">
                    Add comma-separated emails to <code>CARRIER_ALERT_EMAILS</code> in <code>.env</code> (e.g. <code>finance@ljkmarketing.com, ceo@ljkmarketing.com</code>).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FINANCE & M-PESA TOP-UP LEDGER */}
      {activeTab === "finance" && (
        <div className="space-y-6">
          <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-zinc-900">
                  Financial Intelligence &amp; M-Pesa Daraja Audit SOP
                </h2>
                <p className="text-xs text-zinc-500">
                  Managing client wallet top-ups, tracking wholesale margins, and manual re-credits.
                </p>
              </div>
              <Link
                href="/admin/finance"
                className="py-1.5 px-3 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
              >
                Open Finance Hub &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-2">
                <div className="font-bold text-sm text-zinc-900">1. Real-Time M-Pesa Daraja Audit</div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Every automated wallet top-up logs the official Safaricom 10-character alphanumeric receipt token (e.g. <code>SH78XYZ123</code>). Admins can search and cross-reference against corporate bank statements in seconds.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-2">
                <div className="font-bold text-sm text-zinc-900">2. 👑 VIP Client Spend Ranking</div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Identifies top 5 revenue-generating clients by cumulative top-up volume. Shows current wallet balance, transaction frequency, and proportion of total platform revenue to inform enterprise account management.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-2">
                <div className="font-bold text-sm text-zinc-900">3. Support Manual Re-Credit SOP</div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  When network callback drops occur between Safaricom Daraja and our server, admins can open the <strong>&quot;Manual M-Pesa Re-Credit&quot;</strong> modal to credit the client. Automatically blocks duplicate receipt entries.
                </p>
              </div>
            </div>

            {/* Manual Recredit Checklist */}
            <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 space-y-2 text-xs text-amber-900">
              <div className="font-bold text-sm text-amber-950 flex items-center gap-2">
                <span>⚠️ Support Procedure for Missing M-Pesa Top-Ups</span>
              </div>
              <ol className="list-decimal pl-5 space-y-1.5 pt-1 text-amber-900/90">
                <li>Verify the client&apos;s M-Pesa confirmation SMS on the Safaricom Daraja web portal or corporate till statement.</li>
                <li>Confirm the receipt token is not already credited in the <Link href="/admin/finance" className="underline font-bold">Audit Ledger</Link>.</li>
                <li>Navigate to <Link href="/admin/finance" className="underline font-bold">/admin/finance</Link>, click <strong>&quot;Manual M-Pesa Re-Credit&quot;</strong>, select the client business, enter the amount and the official receipt code.</li>
                <li>The system immediately credits <code>BusinessWallet.sms_credit_balance</code> and logs an admin audit trace with zero database schema migrations.</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RATE CARDS & MARGINS */}
      {activeTab === "rates" && (
        <div className="space-y-6">
          <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-zinc-900">
                  Telecom Rate Cards &amp; Auto-Markup Playbook
                </h2>
                <p className="text-xs text-zinc-500">
                  Wholesale carrier benchmarks, plan margin heatmaps, and live campaign profitability modeling.
                </p>
              </div>
              <Link
                href="/admin/rates"
                className="py-1.5 px-3 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
              >
                Open Rate Cards &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
                <div className="font-bold text-sm text-emerald-950">1. Wholesale Benchmark Matrix</div>
                <p className="text-xs text-emerald-900/80 leading-relaxed">
                  Admins configure the direct wholesale cost contracted with Advanta or Africa&apos;s Talking: Safaricom (KES 0.2800), Airtel (KES 0.2500), and Telkom (KES 0.2200). The engine calculates a live weighted blended cost (~KES 0.2695).
                </p>
              </div>

              <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 space-y-2">
                <div className="font-bold text-sm text-purple-950">2. Commercial Margin Heatmap</div>
                <p className="text-xs text-purple-900/80 leading-relaxed">
                  Every active commercial package is audited against wholesale carrier rates. Margins are tagged: <strong>Emerald (≥55%)</strong>, <strong>Amber (35%–54%)</strong>, and <strong>Red (&lt;35%)</strong>, showing projected gross profit per 10,000 SMS broadcast.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-2">
                <div className="font-bold text-sm text-blue-950">3. Campaign Profit Simulator</div>
                <p className="text-xs text-blue-900/80 leading-relaxed">
                  Interactive sandbox for quoting high-volume corporate deals (e.g. 50,000 to 500,000 SMS). Sliders calculate total invoiced revenue, wholesale carrier costs, and net agency margin before closing enterprise agreements.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-700 space-y-2">
              <div className="font-bold text-zinc-900">💡 Pricing Strategy Recommendation for Account Managers</div>
              <p className="leading-relaxed">
                Aim for a blended gross margin of at least <strong>60%</strong> on prepaid packages. For custom enterprise contracts exceeding 250,000 SMS/month, a negotiated floor of KES 0.50 – 0.60 retail guarantees a healthy 45%–55% margin while beating standard market rates.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MESSAGE INSPECTOR & DLR SEARCH */}
      {activeTab === "inspector" && (
        <div className="space-y-6">
          <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-zinc-900">
                  Global Message Inspector &amp; Carrier DLR Forensics
                </h2>
                <p className="text-xs text-zinc-500">
                  Troubleshooting delivery complaints, verifying carrier IDs, and forensic CSV audit logs.
                </p>
              </div>
              <Link
                href="/admin/inspector"
                className="py-1.5 px-3 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
              >
                Open Message Inspector &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-2">
                <div className="font-bold text-sm text-zinc-900">1. Instant Phone &amp; Carrier Lookup</div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Search across recipient numbers in either local (<code>0712345678</code>) or international (<code>+254712345678</code>) format, upstream carrier IDs (<code>ATXid_...</code>), or client business names with instant results.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-2">
                <div className="font-bold text-sm text-zinc-900">2. 3-Step Delivery Timeline Drawer</div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Clicking any message opens a right-hand inspection drawer showing all 3 stages: <strong>Platform Ingestion</strong> &rarr; <strong>Carrier Dispatch</strong> &rarr; <strong>Handset Delivery</strong>, including raw carrier error codes for bounces.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-2">
                <div className="font-bold text-sm text-zinc-900">3. 1-Click Forensic CSV Export</div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Download complete delivery spreadsheets filtered by date, operator, or status for dispute resolution or sharing verified delivery proof with enterprise clients.
                </p>
              </div>
            </div>

            {/* Operator Prefix Reference */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 space-y-3 text-xs">
              <div className="font-bold text-zinc-900">🇰🇪 Kenyan Telecom Operator Prefix Quick-Reference</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-white rounded-lg border border-emerald-200 space-y-1">
                  <span className="font-bold text-emerald-800">Safaricom (~70% Market)</span>
                  <p className="text-[11px] text-zinc-500 font-mono">070x, 071x, 072x, 079x, 0740-48, 0757-59, 0768-69, 0110-15</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-red-200 space-y-1">
                  <span className="font-bold text-red-800">Airtel Kenya (~25% Market)</span>
                  <p className="text-[11px] text-zinc-500 font-mono">073x, 0750-56, 078x, 0100-09</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-blue-200 space-y-1">
                  <span className="font-bold text-blue-800">Telkom Kenya (~5% Market)</span>
                  <p className="text-[11px] text-zinc-500 font-mono">077x</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SENDER ID APPROVAL SOP */}
      {activeTab === "sender_ids" && (
        <div className="space-y-6">
          <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-zinc-900">
                  Alphanumeric Sender ID Vetting &amp; Telco Registration SOP
                </h2>
                <p className="text-xs text-zinc-500">
                  Communications Authority of Kenya (CAK) regulations and automated email feedback.
                </p>
              </div>
              <Link
                href="/admin/sender-ids"
                className="py-1.5 px-3 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
              >
                Open Sender ID Queue &rarr;
              </Link>
            </div>

            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              In Kenya, custom 11-character Alphanumeric Sender IDs (e.g. <code>SAFARICOM</code>, <code>NAIVAS</code>, <code>LJK_AGENCY</code>) are regulated by CAK and must be vetted before whitelisting on Safaricom and Airtel networks.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3 p-4 bg-zinc-50 border border-zinc-200 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-[#581c87] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div className="space-y-1 text-xs sm:text-sm">
                  <div className="font-bold text-zinc-900">Queue Review &amp; KYC Inspection</div>
                  <p className="text-zinc-600">
                    Open <Link href="/admin/sender-ids" className="underline font-semibold text-[#581c87]">/admin/sender-ids</Link>. Click <strong>&quot;Inspect KYC Document&quot;</strong> to review the business&apos;s uploaded Certificate of Incorporation or Business Name Registration in the in-app modal.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-zinc-50 border border-zinc-200 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-[#581c87] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div className="space-y-1 text-xs sm:text-sm">
                  <div className="font-bold text-zinc-900">Name Match &amp; Brand Authorization Check</div>
                  <p className="text-zinc-600">
                    Verify the requested 11-character alphanumeric header matches the legal company name. Brand names of third-party trademarks (e.g. banks, telcos, government agencies) must be rejected unless an explicit Letter of Authorization (LOA) is attached.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-zinc-50 border border-zinc-200 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-[#581c87] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  3
                </div>
                <div className="space-y-1 text-xs sm:text-sm">
                  <div className="font-bold text-zinc-900">Upstream Telco Submission</div>
                  <p className="text-zinc-600">
                    Submit the LOA and company credentials to Advanta or Africa&apos;s Talking telco desk for Safaricom NOC and Airtel whitelisting. Telco turnaround is typically <strong>24 – 72 business hours</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-zinc-50 border border-zinc-200 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-[#581c87] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  4
                </div>
                <div className="space-y-1 text-xs sm:text-sm">
                  <div className="font-bold text-zinc-900">1-Click Approval / Rejection Feedback</div>
                  <p className="text-zinc-600">
                    Click <strong>&quot;Approve Live&quot;</strong> to activate the header. The system dispatches an automated HTML email via Resend guiding the tenant to start sending. If rejected, supply the specific revision reason which is emailed to the business owner immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: COMPLIANCE SHIELD & CAK */}
      {activeTab === "compliance" && (
        <div className="space-y-6">
          <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-zinc-900">
                  Anti-Fraud, Phishing &amp; CAK Marketing Hours Shield
                </h2>
                <p className="text-xs text-zinc-500">
                  Automated threat heuristics, regulatory windows, and content moderation workflows.
                </p>
              </div>
              <Link
                href="/admin/compliance"
                className="py-1.5 px-3 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
              >
                Open Compliance Shield &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-red-200 bg-red-50/40 space-y-2">
                <div className="font-bold text-sm text-red-950">1. Heuristic Phishing Scans</div>
                <p className="text-xs text-red-900/80 leading-relaxed">
                  Campaigns are automatically scanned for banking impersonation (&quot;send to this number&quot;, &quot;mpesa reversal&quot;, &quot;pin&quot;, &quot;fuliza loan&quot;), lottery scams, and suspicious URL shorteners (<code>bit.ly</code>, <code>tinyurl.com</code>).
                </p>
              </div>

              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2">
                <div className="font-bold text-sm text-amber-950">2. CAK Marketing Hours Window</div>
                <p className="text-xs text-amber-900/80 leading-relaxed">
                  Under CAK rules, promotional marketing SMS in Kenya may only be dispatched between <strong>07:00 AM and 07:00 PM EAT (UTC+3)</strong>. The Compliance Shield monitors this window in real-time with automated timezone conversion.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 space-y-2">
                <div className="font-bold text-sm text-purple-950">3. Quarantine vs Admin Override</div>
                <p className="text-xs text-purple-900/80 leading-relaxed">
                  Flagged campaigns appear in the Compliance Quarantined list with risk scores. Admins can 1-click <strong>&quot;🚨 Quarantine &amp; Halt&quot;</strong> to protect telco routes, or <strong>&quot;✓ Admin Override&quot;</strong> if verified legitimate.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-700 space-y-2">
              <div className="font-bold text-zinc-900">📖 Tag Cloud Keyword Manager</div>
              <p className="leading-relaxed">
                Admins can add custom phishing terms, deceptive phrases, or brand names directly in the Compliance Dashboard tag cloud. Changes take effect across all campaigns immediately without code deploys.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: SYSTEM ANNOUNCEMENTS */}
      {activeTab === "announcements" && (
        <div className="space-y-6">
          <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-zinc-900">
                  Global Client Announcement &amp; Incident Banner Engine
                </h2>
                <p className="text-xs text-zinc-500">
                  Broadcasting scheduled maintenance, upstream route delays, and emergency notices.
                </p>
              </div>
              <Link
                href="/admin/announcements"
                className="py-1.5 px-3 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
              >
                Open Announcements &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-2">
                <div className="font-bold text-sm text-zinc-900">Severity Themes &amp; Appearance</div>
                <ul className="list-disc pl-5 text-xs text-zinc-600 space-y-1">
                  <li><strong>INFO (Purple/Blue):</strong> General updates, new feature rollouts, direct route additions.</li>
                  <li><strong>WARNING (Amber):</strong> Scheduled carrier maintenance, temporary Safaricom callback delays.</li>
                  <li><strong>CRITICAL (Red):</strong> Telco gateway downtime, emergency SMPP maintenance.</li>
                  <li><strong>SUCCESS (Emerald):</strong> Restored services, successful carrier failover completion.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-2">
                <div className="font-bold text-sm text-zinc-900">⚡ 1-Click Operational Presets</div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  The engine includes pre-authored incident templates:
                </p>
                <ul className="list-disc pl-5 text-xs text-zinc-600 space-y-1">
                  <li><em>Scheduled Telco Gateway Maintenance</em></li>
                  <li><em>Safaricom M-Pesa Top-Up Callback Delays</em></li>
                  <li><em>High-Speed Direct Telco Route Live</em></li>
                  <li><em>Holiday Support &amp; Network Hours Notice</em></li>
                </ul>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-700 space-y-2">
              <div className="font-bold text-zinc-900">Client Visibility &amp; Session Dismissal</div>
              <p className="leading-relaxed">
                Active banners appear pinned at the very top of all business client dashboard pages (<code>/business/*</code>). Clients can close the banner for their current browsing session with the &times; button without affecting other users.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TENANT GOVERNANCE & LIFETIME VIP PARTNERS */}
      {activeTab === "tenants" && (
        <div className="space-y-6">
          <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-zinc-900">
                    Tenant Governance, Commercial Plans &amp; Lifetime VIP Partners
                  </h2>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    👑 Enterprise VIP
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-1">
                  Standard operating procedures for tenant provisioning, lifetime partner access, complimentary credit grants, and zero-cost credit bypasses.
                </p>
              </div>
              <Link
                href="/admin/businesses"
                className="py-1.5 px-3 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs shrink-0 self-start sm:self-auto"
              >
                Open Businesses Directory &rarr;
              </Link>
            </div>

            {/* Architecture Principle Card */}
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚖️</span>
                <span className="font-bold text-sm text-amber-950">
                  Core Architecture Principle: SaaS License Waiver vs. Carrier Messaging Float
                </span>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                When onboarding sister companies (e.g. <strong>Corban Technologies LTD</strong>), enterprise partners, or board entities, LJK Marketing can permanently grant <strong>Lifetime Access</strong>. However, administrators must distinguish between <strong>Software Licensing</strong> and <strong>Downstream Telecom Liquidity</strong>:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
                <div className="p-3 rounded-lg bg-white border border-amber-200 space-y-1">
                  <div className="font-bold text-amber-950 flex items-center gap-1.5">
                    <span>✅ 1. Software Subscription License</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">KES 0</span>
                  </div>
                  <p className="text-zinc-600 leading-relaxed">
                    Lifetime VIP partners pay <strong>KES 0 in SaaS recurring fees</strong>. They enjoy perpetual access to the platform, unlimited team member seats, unlimited contact groups, dedicated API keys, and priority SLA.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-white border border-amber-200 space-y-1">
                  <div className="font-bold text-amber-950 flex items-center gap-1.5">
                    <span>📡 2. Carrier Telecom Float</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 font-bold">Wholesale Cost</span>
                  </div>
                  <p className="text-zinc-600 leading-relaxed">
                    Safaricom, Airtel, Telkom, and Meta Cloud API bill LJK wholesale cash for every message dispatched. To accommodate Lifetime Partners, administrators have two distinct mechanisms: <strong>Admin Credit Grants</strong> or <strong>Credit Bypass</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Two VIP Operational Mechanisms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Mechanism A */}
              <div className="p-5 rounded-xl border border-zinc-200 bg-zinc-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-zinc-900">
                    Option A: Manual Credit Grants (<code>💰 + Credits</code>)
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                    Recommended for Partners
                  </span>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Best for external strategic partners or VIP clients receiving complimentary trial or marketing allowances.
                </p>
                <div className="space-y-2 text-xs text-zinc-700 bg-white p-3 rounded-lg border border-zinc-200">
                  <div className="font-semibold text-zinc-900">How to Allocate Credits:</div>
                  <ol className="list-decimal pl-4 space-y-1 text-zinc-600">
                    <li>Navigate to <code>/admin/businesses</code>.</li>
                    <li>Locate the business and click the <strong>💰 + Credits</strong> button.</li>
                    <li>Select a quick preset (<strong>+100</strong>, <strong>+500</strong>, <strong>+1,000</strong>, or <strong>+5,000</strong> credits) or type a custom amount.</li>
                    <li>Provide a mandatory audit reason (e.g. <em>&quot;Q3 Strategic Partner Promotion Float&quot;</em>).</li>
                    <li>Confirm the grant. Credits reflect immediately in the client&apos;s wallet, logged with an immutable audit memo.</li>
                  </ol>
                </div>
              </div>

              {/* Mechanism B */}
              <div className="p-5 rounded-xl border border-zinc-200 bg-zinc-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-zinc-900">
                    Option B: Lifetime VIP Credit Bypass (<code>credit_bypass</code>)
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                    Internal Sister Companies
                  </span>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Engineered specifically for in-house companies like <strong>Corban Technologies LTD</strong> or agency management entities.
                </p>
                <div className="space-y-2 text-xs text-zinc-700 bg-white p-3 rounded-lg border border-zinc-200">
                  <div className="font-semibold text-zinc-900">How to Enable Credit Bypass:</div>
                  <ol className="list-decimal pl-4 space-y-1 text-zinc-600">
                    <li>Navigate to <code>/admin/businesses</code>.</li>
                    <li>Click the <strong>⚙️ Entitlements</strong> button on the business row.</li>
                    <li>Check the <strong>👑 Lifetime VIP Credit Bypass</strong> checkbox under Feature Flags.</li>
                    <li>Click <strong>Save Entitlements</strong>.</li>
                  </ol>
                  <div className="p-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] leading-relaxed mt-2">
                    <strong>Result:</strong> Campaigns dispatched by this business bypass credit verification completely, deduct <strong>0.00 credits</strong>, and broadcast with zero paywall prompts.
                  </div>
                </div>
              </div>
            </div>

            {/* Portal Branding & Lookups */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-2">
                <div className="font-bold text-sm text-zinc-900">
                  👑 VIP Portal Branding &amp; Banner Replacement
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  When a business is granted Lifetime Access, their business portal transforms automatically:
                </p>
                <ul className="list-disc pl-5 text-xs text-zinc-600 space-y-1">
                  <li><strong>Header Ribbon:</strong> Displays a permanent <code>👑 Lifetime Partner VIP</code> badge next to their workspace name.</li>
                  <li><strong>Banner Replacement:</strong> The alarming <em>&quot;100% Prepaid Account · Top-Up Required&quot;</em> banner is removed and replaced with an affirmative <em>&quot;👑 Lifetime VIP Privilege: Subscription fees permanently waived&quot;</em> status card.</li>
                  <li><strong>Billing Page:</strong> Shows perpetual license status with active fee waiver confirmation.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-2">
                <div className="font-bold text-sm text-zinc-900">
                  🔍 Resilient Plan &amp; Business Lookups
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  The backend API incorporates resilient lookup matching across all business endpoints:
                </p>
                <ul className="list-disc pl-5 text-xs text-zinc-600 space-y-1">
                  <li><strong>Plans:</strong> Matches by UUID, human reference code (<code>REF-PLN-...</code>), plan code (<code>pro</code>, <code>starter</code>, <code>enterprise</code>), name, or slug.</li>
                  <li><strong>Businesses:</strong> Matches by UUID or tenant reference code (<code>REF-BIZ-...</code>).</li>
                  <li>Prevents 404 or 400 Bad Request errors when admin modals submit human-readable codes instead of raw UUID strings.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ANTI-BOT & ABUSE DEFENSE SYSTEM */}
      {activeTab === "security" && (
        <div className="space-y-6">
          <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-zinc-900">
                    Tri-Layer Anti-Bot, Honeypot &amp; Abuse Defense Architecture
                  </h2>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Active on Public Signup
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-1">
                  How LJK Marketing automatically detects and thwarts automated spambots, credential stuffers, and disposable email registrations without friction for real customers.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Shields Active (100% Automated)
                </span>
              </div>
            </div>

            {/* Defense Layers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Layer 1 */}
              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-zinc-900">Layer 1: Decoy Honeypot</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">
                    0ms Interception
                  </span>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  A hidden input field named <code>website_url</code> is rendered in the public registration form with CSS styles that render it invisible to human eyes (<code>opacity: 0; position: absolute; pointer-events: none</code>).
                </p>
                <div className="p-2.5 rounded-lg bg-white border border-zinc-200 text-[11px] text-zinc-700 space-y-1">
                  <div className="font-semibold text-purple-900">Bot Behavior:</div>
                  <p>Automated scrapers fill all available inputs. If <code>website_url</code> has any content, the API immediately intercepts the request, logs a honeypot alert, and responds with a simulated <strong>201 Created</strong> without creating any database records.</p>
                </div>
              </div>

              {/* Layer 2 */}
              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-zinc-900">Layer 2: IP Rate Throttling</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                    5 / Hour / IP
                  </span>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Django REST Framework enforces a strict IP-based throttle policy on the registration endpoint (<code>/api/v1/auth/register/</code>) scoped to <strong>5 signups per hour per IP</strong>.
                </p>
                <div className="p-2.5 rounded-lg bg-white border border-zinc-200 text-[11px] text-zinc-700 space-y-1">
                  <div className="font-semibold text-blue-900">Brute Force Prevention:</div>
                  <p>Rapid bot swarms attempting to create dozens of fake tenant accounts or test stolen credit card details are throttled with standard <strong>HTTP 429 Too Many Requests</strong> responses.</p>
                </div>
              </div>

              {/* Layer 3 */}
              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-zinc-900">Layer 3: Disposable Email Filter</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">
                    100+ Domains Blocked
                  </span>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  The registration serializer inspects the user&apos;s email domain against an active dictionary of 100+ known disposable, throwaway, and burner mailbox providers.
                </p>
                <div className="p-2.5 rounded-lg bg-white border border-zinc-200 text-[11px] text-zinc-700 space-y-1">
                  <div className="font-semibold text-rose-900">Blocked Examples:</div>
                  <p className="font-mono text-[10px] text-zinc-600">mailinator.com, guerrillamail.com, tempmail.com, 10minutemail.com, yopmail.com, throwawaymail.com, dispostable.com</p>
                </div>
              </div>
            </div>

            {/* Admin Audit & Maintenance SOP */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-xs text-zinc-700 space-y-2">
              <div className="font-bold text-sm text-zinc-900">
                🔍 Administrator Verification &amp; Account Cleanup Playbook
              </div>
              <p className="leading-relaxed">
                If suspicious accounts are identified, administrators can quickly review and suspend them:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-zinc-600">
                <li>Check <code>/admin/businesses</code> for businesses with random string names, unverified phone formats, or suspicious registration dates.</li>
                <li>To suspend a fraudulent account, toggle their status to <strong>Deactivated</strong> (disables user login and blocks any outbound API requests).</li>
                <li>Alternatively, open the Django Admin console at <code>/admin/businesses/business/</code> to permanently purge spam records.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: AGENCY BROADCAST HUB */}
      {activeTab === "broadcast" && (
        <div className="space-y-6">
          <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h2 className="text-base sm:text-lg font-bold text-zinc-900">
                LJK Agency Broadcast Console &amp; Master Sender ID
              </h2>
              <Link
                href="/admin/broadcast"
                className="py-1.5 px-3 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
              >
                Open Broadcast Hub &rarr;
              </Link>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              The Agency Broadcast Hub allows LJK Marketing admins to dispatch official platform-wide announcements, billing reminders, and product promotions directly from the Admin Console.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-2">
                <div className="font-bold text-sm text-zinc-900">1. All Business Owners</div>
                <p className="text-xs text-zinc-600">
                  1-click blast to primary contact numbers of all active registered tenant businesses. Perfect for scheduled maintenance or holiday greetings.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-2">
                <div className="font-bold text-sm text-zinc-900">2. All Portal Users</div>
                <p className="text-xs text-zinc-600">
                  Reaches all registered user accounts with verified phone numbers across the entire platform.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-2">
                <div className="font-bold text-sm text-zinc-900">3. Manual Lead List (CSV)</div>
                <p className="text-xs text-zinc-600">
                  Paste raw external phone numbers (e.g. prospective clients, marketing leads) separated by commas or line breaks.
                </p>
              </div>
            </div>

            {/* Custom Freeform Copy Mode vs Pre-Approved Meta Templates */}
            <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/60 space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-bold text-sm text-purple-950 flex items-center gap-2">
                  <span>✍️ Custom Freeform Copy Mode vs. Pre-Approved Templates</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-200 text-purple-900">
                    Bypass Meta Delay
                  </span>
                </div>
              </div>
              <p className="text-xs text-purple-900 leading-relaxed">
                Administrators can toggle between <strong>Custom Freeform Copy</strong> and <strong>Pre-Approved Meta Templates</strong> in the Agency Broadcast Hub:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-white border border-purple-200 space-y-1">
                  <div className="font-bold text-purple-950">Freeform Custom Copy Mode:</div>
                  <p className="text-zinc-600 leading-relaxed">
                    Allows composing arbitrary custom announcements without waiting for Meta WhatsApp template approval. For SMS broadcasts, dispatches directly via Advanta Africa / Africa&apos;s Talking with 0 delay. For WhatsApp broadcasts, dispatches through LJK&apos;s verified business route.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-white border border-purple-200 space-y-1">
                  <div className="font-bold text-purple-950">Pre-Approved Meta Template Mode:</div>
                  <p className="text-zinc-600 leading-relaxed">
                    Utilizes verified WhatsApp Cloud API templates (e.g. <code>marketing_agency_promo_v1</code>) with rich flyer images, interactive CTA buttons ([Shop Now], [Chat on WhatsApp]), and blue-tick telemetry.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-xs text-zinc-700 space-y-2">
              <div className="font-bold text-sm text-zinc-900">
                ✨ Dynamic Multi-Admin &amp; Resilient Fallback
              </div>
              <p>
                <strong>Zero Hardcoding:</strong> Any current or future team member granted <code>is_admin</code> or <code>is_staff</code> dynamically inherits full broadcast privileges.
              </p>
              <p>
                <strong>Sender ID Fallback:</strong> Dispatches default to <code>LJK_AGENCY</code>. If the alphanumeric sender ID is pending carrier approval, the backend automatically falls back to Africa&apos;s Talking standard route to guarantee immediate delivery.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
