/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useFetchBusinesses } from "@/hooks/business/actions";
import { useFetchBusinessWallets } from "@/hooks/businesswallets/actions";
import { useFetchWalletTransactions } from "@/hooks/transactions/actions";

export default function BillingPage() {
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [customAmount, setCustomAmount] = useState<number | string>(1000);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Queries
  const { data: businessesData, isLoading: isLoadingBusiness } = useFetchBusinesses();
  const { data: walletsData, isLoading: isLoadingWallet } = useFetchBusinessWallets();
  const { data: transactionsData, isLoading: isLoadingTx } = useFetchWalletTransactions({
    ordering: "-created_at",
  });

  const activeBusiness = useMemo(() => {
    if (!businessesData) return null;
    const list = Array.isArray(businessesData) ? businessesData : (businessesData as any).results || [];
    return list[0] || null;
  }, [businessesData]);

  const wallet = useMemo(() => {
    if (!walletsData) return null;
    const list = Array.isArray(walletsData) ? walletsData : (walletsData as any).results || [];
    return list[0] || null;
  }, [walletsData]);

  const transactions = useMemo(() => {
    if (!transactionsData) return [];
    return Array.isArray(transactionsData) ? transactionsData : (transactionsData as any).results || [];
  }, [transactionsData]);

  // Rate estimation from active plan
  const smsUnitRate = activeBusiness?.plan_detail?.sms_unit_rate_kes
    ? Number(activeBusiness.plan_detail.sms_unit_rate_kes)
    : 0.45;

  const estimatedUnits = useMemo(() => {
    const amt = Number(customAmount) || 0;
    if (amt <= 0) return 0;
    return Math.floor(amt / smsUnitRate);
  }, [customAmount, smsUnitRate]);

  const packages = [
    {
      id: "starter",
      name: "Starter Bundle",
      credits: 2000,
      rate: `KES ${smsUnitRate.toFixed(2)} / SMS`,
      cost: Math.round(2000 * smsUnitRate),
      description: "Quick top-up for scheduled transactional notifications & OTPs.",
    },
    {
      id: "growth",
      name: "Growth Bundle",
      credits: 10000,
      rate: `KES ${(smsUnitRate * 0.95).toFixed(2)} / SMS`,
      cost: Math.round(10000 * smsUnitRate * 0.95),
      description: "Best for weekly flash promotions and customer retention updates.",
      recommended: true,
    },
    {
      id: "enterprise",
      name: "Scale Volume",
      credits: 50000,
      rate: `KES ${(smsUnitRate * 0.85).toFixed(2)} / SMS`,
      cost: Math.round(50000 * smsUnitRate * 0.85),
      description: "High-volume Tier-1 direct delivery with priority gateway throughput.",
    },
  ];

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    toast.success(`${label} copied to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleMpesaPay = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(customAmount);

    if (!mpesaPhone.trim()) {
      toast.error("Please enter your M-Pesa phone number");
      return;
    }
    if (!amountNum || amountNum < 50) {
      toast.error("Minimum top-up amount is KES 50");
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast.success(
        `STK Push sent to ${mpesaPhone} for KES ${amountNum.toLocaleString()}! Enter your M-Pesa PIN on your phone.`
      );
      setMpesaPhone("");
    }, 1200);
  };

  return (
    <div className="space-y-8 w-full max-w-none">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
            <Link href="/business/dashboard" className="hover:text-zinc-900">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-zinc-900 font-medium">Billing &amp; Wallets</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            Billing &amp; Messaging Credit Wallets
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 mt-0.5">
            Real-time balance monitoring, M-Pesa STK Express top-ups, and immutable transaction audit logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/business/sms/broadcast"
            className="inline-flex items-center gap-2 py-2 px-3.5 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span>Launch SMS Broadcast</span>
          </Link>
        </div>
      </div>

      {/* 2. Top Section: Prominent Real-time Wallet & Account Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* SMS Credit Balance */}
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-purple-300 transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">SMS Balance</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Active & Ready" />
            </div>
            <div className="text-3xl font-extrabold text-zinc-900 mt-3 font-mono">
              {isLoadingWallet ? "..." : (wallet?.sms_credit_balance ?? 0).toLocaleString()}
            </div>
            <div className="text-xs text-zinc-500 mt-1">Available SMS Units</div>
          </div>
          <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500 mt-3">
            <span>Route: <strong>Tier-1 Direct</strong></span>
            <span className="text-emerald-700 font-semibold">Active</span>
          </div>
        </div>

        {/* Email Credit Balance */}
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-purple-300 transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Email Balance</span>
              <span className="w-2 h-2 rounded-full bg-purple-500" title="Resend Engine" />
            </div>
            <div className="text-3xl font-extrabold text-[#581c87] mt-3 font-mono">
              {isLoadingWallet ? "..." : (wallet?.email_credit_balance ?? 0).toLocaleString()}
            </div>
            <div className="text-xs text-zinc-500 mt-1">Available Email Units</div>
          </div>
          <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500 mt-3">
            <span>High-Inbox Placement</span>
            <span className="text-purple-700 font-semibold">99.8%</span>
          </div>
        </div>

        {/* Commercial Active Plan */}
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-purple-300 transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Active Plan</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-[#581c87] border border-purple-200">
                {activeBusiness?.plan_detail?.category || "PAYG"}
              </span>
            </div>
            <div className="text-lg font-bold text-zinc-900 mt-2 truncate">
              {isLoadingBusiness ? "Loading..." : activeBusiness?.plan_detail?.name || "PAYG Starter Plan"}
            </div>
            <div className="text-xs text-zinc-500 mt-0.5">
              Base: <strong>KES {smsUnitRate.toFixed(2)}</strong> / SMS
            </div>
          </div>
          <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500 mt-3">
            <span>Overdraft: Disabled</span>
            <Link href="/pricing" className="text-[#581c87] hover:underline font-semibold">
              Compare &rarr;
            </Link>
          </div>
        </div>

        {/* Workspace Account Identifiers */}
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-purple-300 transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Workspace</span>
              <button
                type="button"
                onClick={() =>
                  handleCopy(activeBusiness?.reference || "", "Business Ref")
                }
                className="text-[11px] text-[#581c87] hover:underline font-semibold cursor-pointer"
              >
                {copiedField === "Business Ref" ? "Copied!" : "Copy Ref"}
              </button>
            </div>
            <div className="text-sm font-bold text-zinc-900 mt-2 truncate">
              {activeBusiness?.name || "My Business Workspace"}
            </div>
            <div className="text-xs font-mono text-zinc-500 mt-1 truncate">
              Code: {activeBusiness?.code || "MA..."}
            </div>
          </div>
          <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500 mt-3">
            <span>Sender ID:</span>
            <span className="font-mono font-bold text-zinc-800">
              {activeBusiness?.sender_id || "LJK_AGENCY"}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Middle Section: M-Pesa Top-Up (Left 5 Cols) + Real-time Ledger (Right 7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* M-Pesa STK Express Form (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-zinc-200 rounded-xl p-5 sm:p-7 shadow-xs space-y-5">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              Safaricom Daraja Express
            </div>
            <h2 className="text-base font-bold text-zinc-900">
              Instant M-Pesa Credit Top-Up
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
              Enter the amount in KES and your M-Pesa phone number to receive an immediate STK PIN prompt.
            </p>
          </div>

          <form onSubmit={handleMpesaPay} className="space-y-4">
            {/* Quick Amount Buttons */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                Select Amount (KES)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[500, 1000, 2500, 5000, 10000, 25000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setCustomAmount(amt)}
                    className={`py-2 px-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                      Number(customAmount) === amt
                        ? "bg-[#581c87] text-white border-[#581c87]"
                        : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100"
                    }`}
                  >
                    KES {amt.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount Input */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                Or Enter Custom Amount (KES)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-xs font-bold text-zinc-400">
                  KES
                </span>
                <input
                  type="number"
                  min="50"
                  step="50"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="e.g. 2000"
                  className="w-full pl-12 pr-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs sm:text-sm font-mono text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#581c87]"
                />
              </div>
              <div className="text-[11px] text-zinc-500 mt-1 flex items-center justify-between">
                <span>Yields approximately:</span>
                <span className="font-bold text-[#581c87]">
                  ~{estimatedUnits.toLocaleString()} SMS Credits
                </span>
              </div>
            </div>

            {/* M-Pesa Phone Number */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                M-Pesa Phone Number
              </label>
              <input
                type="tel"
                value={mpesaPhone}
                onChange={(e) => setMpesaPhone(e.target.value)}
                placeholder="e.g. 0712345678 or 254712345678"
                className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs sm:text-sm font-mono text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#581c87]"
              />
              <p className="text-[11px] text-zinc-400 mt-1">
                Any Kenyan registered Safaricom M-Pesa subscriber line.
              </p>
            </div>

            {/* Pay Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-2.5 px-4 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Awaiting M-Pesa PIN...</span>
                </>
              ) : (
                <>
                  <span>Send STK Push (KES {Number(customAmount || 0).toLocaleString()})</span>
                  <span>&rarr;</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Real-time Transactions Audit Ledger (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-xl p-5 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-zinc-900">Wallet Transaction Ledger</h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Immutable audit trail of credit allocations, dispatches &amp; top-ups.
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-zinc-500">
              {transactions.length} Records
            </span>
          </div>

          {isLoadingTx ? (
            <div className="text-center py-10 text-xs text-zinc-400">
              Loading wallet transaction history...
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <div className="w-10 h-10 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-xs font-semibold text-zinc-700">No Transactions Recorded Yet</p>
              <p className="text-[11px] text-zinc-400 max-w-sm mx-auto">
                Once you top up credits or launch an SMS campaign, real-time audit ledger entries with running balances will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 text-[11px] font-bold text-zinc-500 uppercase">
                    <th className="py-2 px-2">Type</th>
                    <th className="py-2 px-2">Channel</th>
                    <th className="py-2 px-2 text-right">Units</th>
                    <th className="py-2 px-2 text-right">Balance</th>
                    <th className="py-2 px-2">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {transactions.slice(0, 8).map((tx: any) => {
                    const isPositive = tx.amount_units > 0;
                    return (
                      <tr key={tx.id || tx.reference} className="hover:bg-zinc-50/80">
                        <td className="py-2.5 px-2">
                          <span className="font-semibold text-zinc-900 block truncate max-w-[130px]">
                            {tx.description || tx.transaction_type}
                          </span>
                          {tx.mpesa_receipt_number && (
                            <span className="text-[10px] font-mono text-zinc-400">
                              Receipt: {tx.mpesa_receipt_number}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-2">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-zinc-100 text-zinc-600">
                            {tx.channel}
                          </span>
                        </td>
                        <td
                          className={`py-2.5 px-2 text-right font-mono font-bold ${
                            isPositive ? "text-emerald-600" : "text-zinc-900"
                          }`}
                        >
                          {isPositive ? `+${tx.amount_units.toLocaleString()}` : tx.amount_units.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono text-zinc-600">
                          {tx.running_balance?.toLocaleString() ?? "-"}
                        </td>
                        <td className="py-2.5 px-2 text-zinc-400 text-[11px] whitespace-nowrap">
                          {new Date(tx.created_at).toLocaleDateString("en-KE", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* 4. Bottom Section: Compact Wholesale Package Reference Cards (De-emphasized) */}
      <div className="space-y-3 pt-4 border-t border-zinc-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-zinc-900">Pre-Packaged Bulk SMS Bundles</h3>
            <p className="text-[11px] text-zinc-500">
              Click any bundle below to automatically load the amount into the M-Pesa Express top-up form above.
            </p>
          </div>
          <Link href="/pricing" className="text-xs font-semibold text-[#581c87] hover:underline">
            View All Plans &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => {
                setCustomAmount(pkg.cost);
                toast.success(`Selected ${pkg.name} (KES ${pkg.cost.toLocaleString()})`);
              }}
              className="bg-zinc-50/70 hover:bg-white border border-zinc-200 hover:border-purple-300 rounded-lg p-3.5 shadow-2xs cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-bold text-zinc-900 group-hover:text-[#581c87] transition-colors">
                    {pkg.name}
                  </div>
                  <div className="text-base font-extrabold text-zinc-900 font-mono mt-1">
                    {pkg.credits.toLocaleString()} SMS
                  </div>
                </div>
                <span className="text-xs font-extrabold text-[#581c87]">
                  KES {pkg.cost.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-2 mt-2 border-t border-zinc-200/60">
                <span>{pkg.rate}</span>
                <span className="text-[#581c87] group-hover:underline font-medium">Select &uarr;</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
