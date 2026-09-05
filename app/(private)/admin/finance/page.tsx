"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  useFetchAdminFinancialAnalytics,
  useManualMpesaRecredit,
} from "@/hooks/transactions/actions";
import { useFetchBusinesses } from "@/hooks/business/actions";

export default function AdminFinancePage() {
  const { data, isLoading, isFetching, refetch } = useFetchAdminFinancialAnalytics();
  const { data: businessesData } = useFetchBusinesses();
  const businesses = useMemo(() => {
    if (Array.isArray(businessesData)) return businessesData;
    if (businessesData && "results" in businessesData) return businessesData.results;
    return [];
  }, [businessesData]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isRecreditModalOpen, setIsRecreditModalOpen] = useState(false);
  const [selectedBusinessRef, setSelectedBusinessRef] = useState("");
  const [mpesaReceipt, setMpesaReceipt] = useState("");
  const [recreditAmount, setRecreditAmount] = useState<number | "">("");
  const [recreditNotes, setRecreditNotes] = useState("");
  const [isSubmittingRecredit, setIsSubmittingRecredit] = useState(false);

  const manualRecreditMutation = useManualMpesaRecredit();

  const vitals = data?.vitals;
  const vipList = data?.vip_leaderboard || [];
  const transactions = data?.recent_transactions || [];

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    if (!searchQuery.trim()) return transactions;
    const q = searchQuery.toLowerCase().trim();
    return transactions.filter(
      (tx) =>
        tx.mpesa_receipt_number.toLowerCase().includes(q) ||
        tx.business_name.toLowerCase().includes(q) ||
        tx.code.toLowerCase().includes(q) ||
        tx.description.toLowerCase().includes(q)
    );
  }, [transactions, searchQuery]);

  const handleManualRecreditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBusinessRef) {
      toast.error("Please select a client business.");
      return;
    }
    if (!mpesaReceipt.trim()) {
      toast.error("Please enter a valid M-Pesa receipt number.");
      return;
    }
    if (!recreditAmount || Number(recreditAmount) <= 0) {
      toast.error("Please enter a valid top-up amount in KES.");
      return;
    }

    setIsSubmittingRecredit(true);
    try {
      const res = await manualRecreditMutation.mutateAsync({
        business_reference: selectedBusinessRef,
        mpesa_receipt_number: mpesaReceipt.trim().toUpperCase(),
        amount_kes: Number(recreditAmount),
        notes: recreditNotes.trim() || "Manual Customer Care Re-Credit",
      });

      if (res?.success) {
        toast.success(res.message || "Business credited successfully!");
        setIsRecreditModalOpen(false);
        setSelectedBusinessRef("");
        setMpesaReceipt("");
        setRecreditAmount("");
        setRecreditNotes("");
        refetch();
      } else {
        toast.error("Could not credit wallet.");
      }
    } catch (err: any) {
      const msg = err?.response?.data?.detail || err?.message || "Failed to process manual credit.";
      toast.error(msg);
    } finally {
      setIsSubmittingRecredit(false);
    }
  };

  const highestSpend = vipList.length > 0 ? vipList[0].total_spent_kes : 1;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Live Treasury
            </span>
            <span className="text-xs text-zinc-500">Wholesale Benchmark: KES 0.30 / SMS</span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 mt-1">
            Financial Intelligence & M-Pesa Ledger
          </h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            Real-time top-up inflows, wholesale telecom margins, VIP client rankings, and support ledger.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <svg
              className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-purple-600" : "text-zinc-500"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>

          <button
            onClick={() => setIsRecreditModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#581c87] hover:bg-[#43146b] rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4 text-purple-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Manual M-Pesa Re-Credit
          </button>
        </div>
      </div>

      {/* KPI Vitals Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Inflow */}
        <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
            <span>Total Top-Up Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-zinc-900 tracking-tight">
            {isLoading ? (
              <span className="text-zinc-400 text-lg font-normal">Loading...</span>
            ) : (
              `KES ${vitals?.total_revenue_kes ? vitals.total_revenue_kes.toLocaleString("en-US", { minimumFractionDigits: 2 }) : "0.00"}`
            )}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500 pt-2 border-t border-zinc-100">
            <span>24h: KES {isLoading ? "..." : (vitals?.revenue_24h_kes?.toLocaleString() || "0")}</span>
            <span>30d: KES {isLoading ? "..." : (vitals?.revenue_30d_kes?.toLocaleString() || "0")}</span>
          </div>
        </div>

        {/* Carrier Wholesale Cost */}
        <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
            <span>Wholesale Carrier Cost</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-zinc-900 tracking-tight">
            {isLoading ? (
              <span className="text-zinc-400 text-lg font-normal">Loading...</span>
            ) : (
              `KES ${vitals?.total_carrier_cost_kes ? vitals.total_carrier_cost_kes.toLocaleString("en-US", { minimumFractionDigits: 2 }) : "0.00"}`
            )}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500 pt-2 border-t border-zinc-100">
            <span>24h Cost: KES {isLoading ? "..." : (vitals?.carrier_cost_24h_kes?.toFixed(2) || "0.00")}</span>
            <span>Rate: ~0.30 KES/SMS</span>
          </div>
        </div>

        {/* Net Profit */}
        <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
            <span>Net Gross Margin</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-emerald-600 tracking-tight">
            {isLoading ? (
              <span className="text-zinc-400 text-lg font-normal">Loading...</span>
            ) : (
              `KES ${vitals?.gross_profit_kes ? vitals.gross_profit_kes.toLocaleString("en-US", { minimumFractionDigits: 2 }) : "0.00"}`
            )}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500 pt-2 border-t border-zinc-100">
            <span>Profit Margin:</span>
            <span className="font-semibold text-emerald-600">{isLoading ? "..." : `${vitals?.profit_margin_pct?.toFixed(1) || "0.0"}%`}</span>
          </div>
        </div>

        {/* Total Dispatched & Transactions */}
        <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
            <span>Dispatched SMS Volume</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-zinc-900 tracking-tight">
            {isLoading ? (
              <span className="text-zinc-400 text-lg font-normal">Loading...</span>
            ) : (
              vitals?.total_dispatched_sms ? vitals.total_dispatched_sms.toLocaleString() : "0"
            )}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500 pt-2 border-t border-zinc-100">
            <span>Total M-Pesa Top-Ups:</span>
            <span className="font-semibold text-zinc-700">{isLoading ? "..." : (vitals?.total_tx_count || 0)}</span>
          </div>
        </div>
      </div>

      {/* VIP Client Leaderboard */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div>
            <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <span>👑 VIP Client Spend Leaderboard</span>
              <span className="text-[11px] font-normal text-zinc-500">
                (Top revenue generating client businesses)
              </span>
            </h2>
          </div>
          <span className="text-xs text-zinc-500 font-medium">
            {vipList.length} Businesses Active
          </span>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-sm text-zinc-400 flex items-center justify-center gap-2">
            <svg className="w-4 h-4 animate-spin text-[#581c87]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Loading VIP client spend rankings from database...</span>
          </div>
        ) : vipList.length === 0 ? (
          <div className="p-8 text-center text-sm text-zinc-500">
            No top-up transactions recorded yet. Once clients purchase SMS credits, rankings will populate here.
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {vipList.map((client, idx) => {
              const pctOfTop = highestSpend > 0 ? (client.total_spent_kes / highestSpend) * 100 : 0;
              return (
                <div key={client.business_reference || idx} className="p-4 hover:bg-zinc-50/70 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        idx === 0 ? "bg-amber-100 text-amber-800 border border-amber-300" :
                        idx === 1 ? "bg-slate-200 text-slate-700" :
                        idx === 2 ? "bg-amber-50 text-amber-700" : "bg-zinc-100 text-zinc-600"
                      }`}>
                        #{idx + 1}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                          <Link
                            href={`/admin/businesses?search=${encodeURIComponent(client.business_reference)}`}
                            className="hover:text-purple-700 hover:underline"
                          >
                            {client.business_name}
                          </Link>
                          <span className="text-[11px] font-mono text-zinc-400">
                            ({client.business_reference})
                          </span>
                        </div>
                        <div className="text-xs text-zinc-500">
                          Owner: {client.owner_name || "Workspace Admin"} &bull; {client.owner_email || "—"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 self-end sm:self-center">
                      <div className="text-right">
                        <div className="text-xs text-zinc-400">Top-Up Count</div>
                        <div className="text-xs font-semibold text-zinc-700">
                          {client.topup_count ?? (client as any).transaction_count ?? 0} purchases
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-zinc-400">Current Balance</div>
                        <div className="text-xs font-semibold text-purple-700 font-mono">
                          {(client.current_wallet_balance ?? 0).toLocaleString()} Credits
                        </div>
                      </div>
                      <div className="text-right min-w-[110px]">
                        <div className="text-xs text-zinc-400">Total Spend</div>
                        <div className="text-sm font-bold text-emerald-600 font-mono">
                          KES {(client.total_spent_kes || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Relative Spend Bar */}
                  <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(pctOfTop, 4)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* M-Pesa Daraja Transaction Ledger */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-50/50">
          <div>
            <h2 className="text-sm font-bold text-zinc-900">
              Live M-Pesa Daraja Audit Ledger
            </h2>
            <p className="text-xs text-zinc-500">
              Verifiable Safaricom receipt tokens and balance increments
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search Receipt, Business..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-8 pr-3 py-1.5 text-xs bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600 text-zinc-800"
              />
              <svg className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                <th className="py-3 px-4">M-Pesa Receipt</th>
                <th className="py-3 px-4">Client Business</th>
                <th className="py-3 px-4">Amount (KES)</th>
                <th className="py-3 px-4">Credits Added</th>
                <th className="py-3 px-4">Running Balance</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-zinc-400">
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin text-[#581c87]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Querying live M-Pesa audit ledger...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-zinc-400">
                    No transactions matching &quot;{searchQuery}&quot; found.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.reference} className="hover:bg-zinc-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-zinc-900">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {tx.mpesa_receipt_number || "DIRECT_CREDIT"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-zinc-900">{tx.business_name}</div>
                      <div className="text-[11px] font-mono text-zinc-400">{tx.business_reference}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-emerald-600 font-mono">
                      KES {tx.amount_kes ? tx.amount_kes.toLocaleString("en-US", { minimumFractionDigits: 2 }) : "0.00"}
                    </td>
                    <td className="py-3 px-4 font-semibold text-purple-700 font-mono">
                      +{tx.amount_units?.toLocaleString() || 0}
                    </td>
                    <td className="py-3 px-4 font-mono text-zinc-600">
                      {tx.running_balance?.toLocaleString() || 0}
                    </td>
                    <td className="py-3 px-4 text-zinc-500 max-w-xs truncate" title={tx.description}>
                      {tx.description}
                    </td>
                    <td className="py-3 px-4 text-zinc-400 text-[11px] whitespace-nowrap">
                      {tx.created_at ? new Date(tx.created_at).toLocaleString() : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual M-Pesa Re-Credit Modal */}
      {isRecreditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-zinc-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
              <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <span>⚡ Manual M-Pesa Re-Credit</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsRecreditModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 p-1 rounded-md"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleManualRecreditSubmit} className="p-5 space-y-4">
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 leading-relaxed">
                <strong>Customer Support Note:</strong> Use this tool when a client made an M-Pesa payment but Safaricom Daraja callback dropped due to network timeout. Duplicate receipts are automatically blocked by the system.
              </div>

              {/* Business Selector */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Client Business *
                </label>
                <select
                  value={selectedBusinessRef}
                  onChange={(e) => setSelectedBusinessRef(e.target.value)}
                  required
                  className="w-full text-xs px-3 py-2 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-600 text-zinc-800"
                >
                  <option value="">-- Select Client Business --</option>
                  {businesses.map((biz) => (
                    <option key={biz.reference} value={biz.reference}>
                      {biz.name} ({biz.reference})
                    </option>
                  ))}
                </select>
              </div>

              {/* M-Pesa Receipt Number */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  M-Pesa Receipt Number *
                </label>
                <input
                  type="text"
                  placeholder="e.g. SKJ8910LM4"
                  value={mpesaReceipt}
                  onChange={(e) => setMpesaReceipt(e.target.value.toUpperCase())}
                  required
                  className="w-full text-xs font-mono px-3 py-2 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-600 text-zinc-800 uppercase"
                />
              </div>

              {/* Amount KES */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Amount Received (KES) *
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="e.g. 1000"
                  value={recreditAmount}
                  onChange={(e) => setRecreditAmount(e.target.value === "" ? "" : Number(e.target.value))}
                  required
                  className="w-full text-xs px-3 py-2 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-600 text-zinc-800"
                />
                <p className="text-[11px] text-zinc-500 mt-1">
                  1 KES = 1 SMS Credit unit added to business balance.
                </p>
              </div>

              {/* Audit Notes */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Support Ticket / Reason Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Client confirmed WhatsApp transaction screenshot"
                  value={recreditNotes}
                  onChange={(e) => setRecreditNotes(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-600 text-zinc-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsRecreditModalOpen(false)}
                  disabled={isSubmittingRecredit}
                  className="px-3.5 py-2 text-xs font-semibold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingRecredit}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#581c87] hover:bg-[#43146b] rounded-lg shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingRecredit ? "Crediting..." : "Confirm & Credit Wallet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
