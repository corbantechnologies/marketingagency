/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useFetchBusinesses } from "@/hooks/business/actions";
import { useFetchBusinessWallets } from "@/hooks/businesswallets/actions";
import {
  useFetchWalletTransactions,
  useInitiateMpesaStkPush,
  usePollMpesaStatus,
  useSimulateMpesaCallback,
} from "@/hooks/transactions/actions";

export default function BillingPage() {
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [customAmount, setCustomAmount] = useState<number | string>(1000);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // M-Pesa STK Push session states
  const [activeCheckoutId, setActiveCheckoutId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [lastSubmittedPhone, setLastSubmittedPhone] = useState("");
  const [lastSubmittedAmount, setLastSubmittedAmount] = useState(0);

  // Queries & Mutations
  const { data: businessesData, isLoading: isLoadingBusiness } = useFetchBusinesses();
  const { data: walletsData, isLoading: isLoadingWallet, refetch: refetchWallet } = useFetchBusinessWallets();
  const { data: transactionsData, isLoading: isLoadingTx, refetch: refetchTx } = useFetchWalletTransactions({
    ordering: "-created_at",
  });

  const initiateStkPushMutation = useInitiateMpesaStkPush();
  const simulateCallbackMutation = useSimulateMpesaCallback();

  // Live polling for STK PIN prompt completion
  const { data: pollData } = usePollMpesaStatus(
    activeCheckoutId,
    Boolean(activeCheckoutId && isModalOpen)
  );

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
    : 0.65;

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

  // Countdown timer for pending PIN entry
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isModalOpen && (!pollData?.status || pollData?.status === "PENDING") && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isModalOpen, pollData?.status, countdown]);

  // When payment succeeds, refresh wallet and transaction queries
  useEffect(() => {
    if (pollData?.status === "SUCCESS") {
      refetchWallet();
      refetchTx();
    }
  }, [pollData?.status, refetchWallet, refetchTx]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    toast.success(`${label} copied to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleMpesaPay = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(customAmount);

    if (!mpesaPhone.trim()) {
      toast.error("Please enter your M-Pesa phone number");
      return;
    }
    if (!amountNum || amountNum < 100) {
      toast.error("Minimum top-up amount is KES 100");
      return;
    }

    setLastSubmittedPhone(mpesaPhone.trim());
    setLastSubmittedAmount(amountNum);

    try {
      const res = await initiateStkPushMutation.mutateAsync({
        phone_number: mpesaPhone.trim(),
        amount_kes: amountNum,
        business_reference: activeBusiness?.reference,
      });

      if (res?.checkout_request_id) {
        setActiveCheckoutId(res.checkout_request_id);
        setCountdown(60);
        setIsModalOpen(true);
        toast.success(res.customer_message || "STK PIN prompt sent to your handset!");
      } else {
        toast.error("Could not initiate STK push. Please check your phone number.");
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        "Failed to initiate M-Pesa STK Push.";
      toast.error(msg);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setActiveCheckoutId(null);
    if (pollData?.status === "SUCCESS") {
      setMpesaPhone("");
    }
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
              <span
                className={`w-2 h-2 rounded-full ${
                  (wallet?.sms_credit_balance || 0) > 0
                    ? "bg-emerald-500 animate-pulse"
                    : "bg-amber-500"
                }`}
                title="Float Status"
              />
            </div>
            <div className="text-3xl font-extrabold text-[#581c87] mt-3 font-mono">
              {isLoadingWallet ? "..." : (wallet?.sms_credit_balance ?? 0).toLocaleString()}
            </div>
            <div className="text-xs text-zinc-500 mt-1">Available SMS Units</div>
          </div>
          <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500 mt-3">
            <span>Route: <strong>Tier-1 Direct</strong></span>
            <span className={(wallet?.sms_credit_balance || 0) > 0 ? "text-emerald-700 font-semibold" : "text-amber-700 font-medium"}>
              {(wallet?.sms_credit_balance || 0) > 0 ? "Active Float" : "Prepaid (0 Units)"}
            </span>
          </div>
        </div>

        {/* Email Credit Balance */}
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-purple-300 transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Email Balance</span>
              <span className="w-2 h-2 rounded-full bg-purple-500" title="Resend Engine" />
            </div>
            <div className="text-3xl font-extrabold text-zinc-900 mt-3 font-mono">
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
            <span>Prepaid: 0 Free Credits</span>
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
                  min="100"
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
              disabled={initiateStkPushMutation.isPending}
              className="w-full py-2.5 px-4 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
            >
              {initiateStkPushMutation.isPending ? (
                <>
                  <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Dispatching STK Prompt...</span>
                </>
              ) : (
                <>
                  <span>Pay with M-PESA Daraja (KES {Number(customAmount || 0).toLocaleString()})</span>
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
            <div className="py-12 text-center text-xs text-zinc-400">Loading audit history...</div>
          ) : transactions.length === 0 ? (
            <div className="py-12 text-center text-xs text-zinc-500">
              <div className="w-10 h-10 mx-auto rounded-full bg-purple-50 text-[#581c87] flex items-center justify-center mb-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="font-semibold text-zinc-800">No transactions recorded yet</p>
              <p className="text-zinc-500 mt-1 max-w-xs mx-auto">
                Once you top up credits or launch an SMS campaign, real-time audit ledger entries with running balances will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-100 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-zinc-400 font-bold uppercase tracking-wider border-b border-zinc-200 pb-2">
                    <th className="py-2.5 px-2">Type</th>
                    <th className="py-2.5 px-2">Units</th>
                    <th className="py-2.5 px-2">Running Balance</th>
                    <th className="py-2.5 px-2">Receipt / Description</th>
                    <th className="py-2.5 px-2 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {transactions.map((tx: any) => {
                    const isCredit = tx.amount_units > 0;
                    return (
                      <tr key={tx.id || tx.reference} className="hover:bg-zinc-50/60 transition-colors">
                        <td className="py-3 px-2 font-mono font-semibold text-zinc-800">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              tx.transaction_type === "MPESA_TOPUP"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : tx.transaction_type === "CAMPAIGN_DISPATCH"
                                ? "bg-zinc-100 text-zinc-700"
                                : "bg-purple-50 text-purple-700 border border-purple-200"
                            }`}
                          >
                            {tx.transaction_type}
                          </span>
                        </td>
                        <td className="py-3 px-2 font-mono font-bold">
                          <span className={isCredit ? "text-emerald-600" : "text-zinc-700"}>
                            {isCredit ? `+${tx.amount_units}` : tx.amount_units}
                          </span>
                          <span className="text-zinc-400 text-[10px] ml-1">{tx.channel}</span>
                        </td>
                        <td className="py-3 px-2 font-mono text-zinc-600">
                          {tx.running_balance?.toLocaleString()}
                        </td>
                        <td className="py-3 px-2 text-zinc-600 max-w-xs truncate">
                          {tx.mpesa_receipt_number ? (
                            <span className="font-mono text-[11px] font-bold text-zinc-900 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200 mr-1.5">
                              {tx.mpesa_receipt_number}
                            </span>
                          ) : null}
                          <span className="text-zinc-500">{tx.description}</span>
                        </td>
                        <td className="py-3 px-2 text-right text-zinc-500 whitespace-nowrap">
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

      {/* 4. Pre-Packaged Bundles */}
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

      {/* 5. Interactive Safaricom M-Pesa Daraja STK Handset Verification Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-zinc-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm border border-emerald-200">
                  M
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 text-sm">
                    Safaricom M-PESA Express
                  </h3>
                  <p className="text-[11px] text-zinc-500">Live Daraja Handset Authorization</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="text-zinc-400 hover:text-zinc-700 text-sm cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            {/* Modal Body Based on Polling State */}
            {pollData?.status === "SUCCESS" ? (
              /* SUCCESS STATE */
              <div className="space-y-4 py-2 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl shadow-inner border border-emerald-200 animate-bounce">
                  ✓
                </div>
                <div>
                  <h4 className="text-lg font-bold text-zinc-900">Payment Confirmed!</h4>
                  <p className="text-xs text-zinc-500 mt-1">
                    Your M-PESA transaction was verified by Safaricom.
                  </p>
                </div>

                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2 text-xs text-left font-mono">
                  <div className="flex justify-between">
                    <span className="text-zinc-500 font-sans">M-Pesa Receipt:</span>
                    <span className="font-bold text-emerald-900">{pollData.receipt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500 font-sans">Amount Paid:</span>
                    <span className="font-bold text-zinc-900">KES {pollData.amount_kes?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500 font-sans">SMS Credits Added:</span>
                    <span className="font-bold text-[#581c87]">+{pollData.units_added?.toLocaleString()} Units</span>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-emerald-200/80">
                    <span className="text-zinc-700 font-sans font-semibold">New Wallet Balance:</span>
                    <span className="font-extrabold text-emerald-800">{pollData.new_balance?.toLocaleString()} Credits</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="w-full py-2.5 px-4 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  Done &bull; Continue Messaging
                </button>
              </div>
            ) : pollData?.status === "FAILED" ? (
              /* FAILED STATE */
              <div className="space-y-4 py-2 text-center">
                <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto text-xl border border-red-200">
                  ✕
                </div>
                <div>
                  <h4 className="text-base font-bold text-zinc-900">Transaction Not Completed</h4>
                  <p className="text-xs text-red-700 mt-1 px-4 leading-relaxed">
                    {pollData.message || "The M-PESA payment request was cancelled or timed out."}
                  </p>
                </div>

                <div className="pt-2 flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                    }}
                    className="flex-1 py-2 px-3 border border-zinc-200 hover:bg-zinc-50 rounded-lg text-xs font-semibold text-zinc-700 cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      setIsModalOpen(false);
                      handleMpesaPay(e as any);
                    }}
                    className="flex-1 py-2 px-3 bg-[#581c87] hover:bg-[#4a1572] text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : (
              /* PENDING PIN ENTRY STATE */
              <div className="space-y-4 py-1 text-center">
                <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                  <span className="absolute inset-0 rounded-full bg-purple-100 animate-ping opacity-75" />
                  <div className="relative w-14 h-14 rounded-full bg-purple-50 border border-purple-200 text-[#581c87] flex items-center justify-center text-xl">
                    📱
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-base font-bold text-zinc-900">
                    Check Your Phone Prompt
                  </h4>
                  <p className="text-xs text-zinc-600 max-w-xs mx-auto leading-relaxed">
                    Enter your M-PESA PIN on phone{" "}
                    <span className="font-mono font-bold text-zinc-900">{lastSubmittedPhone}</span> to authorize{" "}
                    <strong className="text-[#581c87]">KES {lastSubmittedAmount.toLocaleString()}</strong>.
                  </p>
                </div>

                {/* Animated Waiting Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 text-zinc-700 text-xs font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Awaiting PIN Entry ({countdown}s)</span>
                </div>

                <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-[11px] text-zinc-500 text-left space-y-1">
                  <p className="flex items-center gap-1.5">
                    <span>💡</span>
                    <span>Keep your mobile screen unlocked.</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span>🛡️</span>
                    <span>The Safaricom SIM toolkit prompt appears automatically.</span>
                  </p>
                </div>

                {/* Developer simulation bypass & Cancel */}
                <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      if (activeCheckoutId) {
                        simulateCallbackMutation.mutate(activeCheckoutId);
                        toast.success("Triggered test confirmation simulation!");
                      }
                    }}
                    className="text-[11px] text-zinc-400 hover:text-[#581c87] underline cursor-pointer"
                    title="Simulate instant callback confirmation for local testing"
                  >
                    Simulate PIN (Dev)
                  </button>

                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="text-xs font-semibold text-zinc-500 hover:text-zinc-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
