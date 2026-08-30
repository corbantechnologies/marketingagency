"use client";

import React, { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function BillingPage() {
  const [selectedPlan, setSelectedPlan] = useState("growth");
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const packages = [
    {
      id: "starter",
      name: "Starter Package",
      credits: "2,000 SMS",
      rate: "KES 0.60 / SMS",
      totalPrice: "KES 1,200",
      description: "Best for small business promotions and alerts",
    },
    {
      id: "growth",
      name: "Growth Package",
      credits: "10,000 SMS",
      rate: "KES 0.45 / SMS",
      totalPrice: "KES 4,500",
      description: "Most popular for growing brands & high volume campaigns",
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise Bulk",
      credits: "50,000 SMS",
      rate: "KES 0.35 / SMS",
      totalPrice: "KES 17,500",
      description: "Tier-1 enterprise volume with priority DLR routing",
    },
  ];

  const handleMpesaPay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mpesaPhone.trim()) {
      toast.error("Please enter your M-Pesa phone number");
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast.success(`M-Pesa STK Push sent to ${mpesaPhone}! Please enter your PIN on your phone to complete payment.`);
      setMpesaPhone("");
    }, 1500);
  };

  return (
    <div className="space-y-6 w-full max-w-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
            <Link href="/business/dashboard" className="hover:text-zinc-900">Dashboard</Link>
            <span>/</span>
            <span className="text-zinc-900 font-medium">Billing &amp; Top Up</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            SMS Credits &amp; M-Pesa Top Up
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 mt-0.5">
            Instant top up via Safaricom Daraja M-Pesa STK Push with transparent per-SMS tier pricing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="py-2 px-3 bg-purple-50 text-[#581c87] text-xs font-semibold rounded-lg border border-purple-200">
            Current Balance: <strong>50 Credits</strong>
          </span>
        </div>
      </div>

      {/* Package Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            onClick={() => setSelectedPlan(pkg.id)}
            className={`bg-white border rounded-xl p-5 shadow-xs cursor-pointer relative transition-all ${
              selectedPlan === pkg.id
                ? "border-[#581c87] ring-2 ring-[#581c87]/20 shadow-md"
                : "border-zinc-200 hover:border-purple-300"
            }`}
          >
            {pkg.popular && (
              <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#581c87] text-white">
                Best Value
              </span>
            )}
            <div className="text-sm font-bold text-zinc-900">{pkg.name}</div>
            <div className="text-2xl font-bold text-[#581c87] mt-2">{pkg.credits}</div>
            <div className="text-xs font-medium text-zinc-500 mt-0.5">{pkg.rate}</div>
            <div className="text-sm font-extrabold text-zinc-900 mt-3 pt-3 border-t border-zinc-100">
              Total: {pkg.totalPrice}
            </div>
            <p className="text-xs text-zinc-500 mt-1">{pkg.description}</p>
          </div>
        ))}
      </div>

      {/* M-Pesa Payment Card */}
      <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-7 shadow-xs max-w-xl">
        <h2 className="text-base font-bold text-zinc-900 mb-1">
          Instant M-Pesa STK Express
        </h2>
        <p className="text-xs text-zinc-500 mb-5">
          Enter your Safaricom M-Pesa number to receive an instant payment prompt on your handset.
        </p>

        <form onSubmit={handleMpesaPay} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
              M-Pesa Phone Number
            </label>
            <input
              type="tel"
              value={mpesaPhone}
              onChange={(e) => setMpesaPhone(e.target.value)}
              placeholder="e.g. 0712345678 or 254712345678"
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-sm font-mono text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#581c87]"
            />
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-2.5 px-4 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? "Sending STK Prompt..." : "Pay via M-Pesa Express"}
          </button>
        </form>
      </div>
    </div>
  );
}
