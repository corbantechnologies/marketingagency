/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useFetchAdminObservability } from "@/hooks/business/actions";

export default function AdminGuidancePage() {
  const [activeTab, setActiveTab] = useState<
    "carriers" | "sender_ids" | "broadcast" | "tenants" | "dlr_routing"
  >("carriers");

  const { data: obsData } = useFetchAdminObservability();
  const carrierBalances = obsData?.carrier_balances;

  return (
    <div className="space-y-6 w-full max-w-none">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#2e0854] via-[#581c87] to-[#7e22ce] text-white rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-purple-200 mb-3 backdrop-blur-xs">
            <span>🛡️ LJK Agency Operations Playbook</span>
            <span>&bull;</span>
            <span>Standard Operating Procedures</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Agency Administrator Guidance &amp; SOP
          </h1>
          <p className="text-sm sm:text-base text-purple-100/90 mt-2 leading-relaxed">
            Essential operational playbooks for managing upstream telecom liquidity, Safaricom Sender ID vetting, multi-tenant moderation, and failover routing.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-medium">
            <Link
              href="/admin/dashboard"
              className="px-4 py-2 bg-white text-[#581c87] font-bold rounded-lg hover:bg-purple-50 transition-colors shadow-xs"
            >
              &larr; Admin Dashboard
            </Link>
            <Link
              href="/admin/broadcast"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/20"
            >
              Agency Broadcast Hub
            </Link>
            <Link
              href="/admin/routing"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/20"
            >
              Carrier Routing &amp; DLR
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex border-b border-zinc-200 overflow-x-auto no-scrollbar gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("carriers")}
          className={`pb-3 px-4 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === "carriers"
              ? "border-[#581c87] text-[#581c87]"
              : "border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300"
          }`}
        >
          <span>📡 Carrier Liquidity &amp; Float</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-[#581c87] border border-purple-200">
            Core
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("sender_ids")}
          className={`pb-3 px-4 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === "sender_ids"
              ? "border-[#581c87] text-[#581c87]"
              : "border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300"
          }`}
        >
          <span>🏷️ Sender ID Vetting SOP</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700">
            Compliance
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("broadcast")}
          className={`pb-3 px-4 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === "broadcast"
              ? "border-[#581c87] text-[#581c87]"
              : "border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300"
          }`}
        >
          <span>📢 Agency Broadcast Hub</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700">
            Master LJK_AGENCY
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("tenants")}
          className={`pb-3 px-4 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === "tenants"
              ? "border-[#581c87] text-[#581c87]"
              : "border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300"
          }`}
        >
          <span>🏢 Tenant Moderation &amp; Quotas</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("dlr_routing")}
          className={`pb-3 px-4 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === "dlr_routing"
              ? "border-[#581c87] text-[#581c87]"
              : "border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300"
          }`}
        >
          <span>⚡ Telecom Routing &amp; DLR Receipts</span>
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
                Dual-Provider Telecom Architecture &amp; Profit Margins
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

      {/* TAB 2: SENDER ID APPROVAL SOP */}
      {activeTab === "sender_ids" && (
        <div className="space-y-6">
          <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-zinc-900 border-b border-zinc-100 pb-3">
              Alphanumeric Sender ID Vetting &amp; Telco Registration SOP
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              In Kenya, custom 11-character Alphanumeric Sender IDs (e.g. <code>SAFARICOM</code>, <code>NAIVAS</code>, <code>LJK_AGENCY</code>) are regulated by the <strong>Communications Authority of Kenya (CAK)</strong> and must be vetted before whitelisting on Safaricom and Airtel networks.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3 p-4 bg-zinc-50 border border-zinc-200 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-[#581c87] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div className="space-y-1 text-xs sm:text-sm">
                  <div className="font-bold text-zinc-900">Client Application Submission</div>
                  <p className="text-zinc-600">
                    The tenant requests their desired Sender ID (up to 11 alphanumeric characters) via <code>/business/sender-ids</code>. Status enters <code>PENDING</code>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-zinc-50 border border-zinc-200 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-[#581c87] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div className="space-y-1 text-xs sm:text-sm">
                  <div className="font-bold text-zinc-900">KYC Verification &amp; Document Review</div>
                  <p className="text-zinc-600">
                    Admins inspect tenant documents:
                  </p>
                  <ul className="list-disc pl-5 text-zinc-600 space-y-1 text-xs pt-1">
                    <li>Certificate of Incorporation / Business Name Registration (BNR).</li>
                    <li>KRA PIN Certificate of the company.</li>
                    <li>Official Letter of Authorization (LOA) printed on client company letterhead authorizing LJK Marketing Agency to provision the Sender ID.</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-zinc-50 border border-zinc-200 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-[#581c87] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  3
                </div>
                <div className="space-y-1 text-xs sm:text-sm">
                  <div className="font-bold text-zinc-900">Telecom Submission (Advanta / Africa&apos;s Talking)</div>
                  <p className="text-zinc-600">
                    LJK admin submits the LOA and company credentials to Advanta or Africa&apos;s Talking telco desk for onward submission to Safaricom NOC and Airtel Kenya. Telco turnaround is typically <strong>24 – 72 business hours</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-zinc-50 border border-zinc-200 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-[#581c87] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  4
                </div>
                <div className="space-y-1 text-xs sm:text-sm">
                  <div className="font-bold text-zinc-900">Platform Activation</div>
                  <p className="text-zinc-600">
                    Once Safaricom confirms whitelisting, the admin navigates to <Link href="/admin/businesses" className="text-[#581c87] underline font-semibold">Admin Businesses</Link>, clicks on the business, and updates Sender ID status to <code>APPROVED</code>. The tenant can immediately dispatch under their brand name!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AGENCY BROADCAST HUB */}
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

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-xs text-purple-900 space-y-2">
              <div className="font-bold text-sm text-purple-950">
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

      {/* TAB 4: TENANT MODERATION */}
      {activeTab === "tenants" && (
        <div className="space-y-6">
          <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-zinc-900 border-b border-zinc-100 pb-3">
              Tenant Workspace Moderation &amp; Quota Safeguards
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              As an aggregator, LJK Marketing is legally accountable to telecom operators and regulatory bodies for traffic originating through its platform.
            </p>

            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-2 text-xs sm:text-sm">
                <div className="font-bold text-zinc-900">Deactivating Non-Compliant Businesses</div>
                <p className="text-zinc-600">
                  If a business is flagged for sending unsolicited spam, deceptive betting links, or phishing SMS, navigate to <Link href="/admin/businesses" className="text-[#581c87] underline font-semibold">Admin Businesses</Link>, select the tenant, and click <strong>Deactivate Business</strong>. This immediately freezes outbound broadcasts and halts API token requests.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-2 text-xs sm:text-sm">
                <div className="font-bold text-zinc-900">Prepaid Wallet Validation (Zero Credit Risk)</div>
                <p className="text-zinc-600">
                  Every campaign dispatch enforces atomic credit checks against <code>BusinessWallet.sms_credit_balance</code> before messages hit telecom SMPP pipes. Businesses cannot send more messages than their prepaid credit balance.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-2 text-xs sm:text-sm">
                <div className="font-bold text-zinc-900">Safaricom Promotional Hours Restriction</div>
                <p className="text-zinc-600">
                  Under CAK guidelines, promotional marketing SMS in Kenya may only be dispatched between <strong>08:00 AM and 07:00 PM EAT</strong>. Transactional OTPs and order updates are exempt and deliver 24/7.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: TELECOM ROUTING & DLR */}
      {activeTab === "dlr_routing" && (
        <div className="space-y-6">
          <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h2 className="text-base sm:text-lg font-bold text-zinc-900">
                Inbound Carrier DLR Webhooks &amp; Telemetry
              </h2>
              <Link
                href="/admin/routing"
                className="text-xs font-semibold text-[#581c87] hover:underline"
              >
                View Live Transceivers &rarr;
              </Link>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              When messages are sent through telecom towers, carriers report delivery statuses back asynchronously via webhooks.
            </p>

            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 space-y-3 text-xs">
              <div className="font-mono text-zinc-700">
                <strong>Webhook URL:</strong> <code>POST /api/v1/broadcast-messages/dlr/callback/</code>
              </div>
              <p className="text-zinc-600 leading-relaxed">
                Accepts asynchronous delivery receipt payloads from both Africa&apos;s Talking and Advanta Africa, matching carrier message IDs to update <code>BroadcastMessage.status</code>:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3 bg-white rounded-lg border border-emerald-200">
                  <span className="font-bold text-emerald-800">DELIVERED</span>
                  <p className="text-[11px] text-zinc-500 mt-0.5">Handset confirmed receipt (Safaricom / Airtel acknowledged).</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-blue-200">
                  <span className="font-bold text-blue-800">SENT</span>
                  <p className="text-[11px] text-zinc-500 mt-0.5">Dispatched into carrier queues, awaiting handset acknowledgement.</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-red-200">
                  <span className="font-bold text-red-800">FAILED</span>
                  <p className="text-[11px] text-zinc-500 mt-0.5">Absent subscriber, number disconnected, or DND (Do Not Disturb) active.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
