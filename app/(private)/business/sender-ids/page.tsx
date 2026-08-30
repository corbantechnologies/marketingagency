"use client";

import React, { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function SenderIdsPage() {
  const [requestedName, setRequestedName] = useState("");
  const [useCase, setUseCase] = useState("Promotional Alerts & Marketing");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRequestSenderId = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestedName.trim()) {
      toast.error("Please enter the requested Sender ID name");
      return;
    }
    if (requestedName.length > 11) {
      toast.error("Sender IDs can be at most 11 characters long");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(`Sender ID "${requestedName.toUpperCase()}" requested! Our team will review and approve with Safaricom & Airtel within 24 hours.`);
      setRequestedName("");
    }, 1000);
  };

  return (
    <div className="space-y-6 w-full max-w-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
            <Link href="/business/dashboard" className="hover:text-zinc-900">Dashboard</Link>
            <span>/</span>
            <span className="text-zinc-900 font-medium">Sender IDs</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            Alphanumeric Sender IDs
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 mt-0.5">
            Register your official business name so recipients recognize your brand on their mobile handsets.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Active Sender IDs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs">
            <h2 className="text-base font-bold text-zinc-900 mb-4">
              Your Registered Sender IDs
            </h2>

            <div className="space-y-3">
              {/* Default Active Sender ID */}
              <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-[#581c87]">LJK_AGENCY</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Default &bull; Active
                    </span>
                  </div>
                  <div className="text-xs text-zinc-600 mt-1">
                    Carrier route: Safaricom &bull; Airtel &bull; Telkom (Shared Instant Gateway)
                  </div>
                </div>
              </div>

              {/* Promotional route */}
              <div className="p-4 rounded-xl border border-zinc-200 bg-white flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-zinc-800">PROMOTIONAL</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-100 text-zinc-700">
                      Standard Route
                    </span>
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">
                    High throughput bulk marketing broadcasts
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Telecom Regulation Guidelines */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs text-xs space-y-3">
            <h3 className="font-bold text-zinc-900">Communication Authority (CA) &amp; Carrier Rules</h3>
            <ul className="space-y-2 text-zinc-600 list-disc list-inside leading-relaxed">
              <li>Max length: <strong>11 alphanumeric characters</strong> (no spaces or special punctuation).</li>
              <li>Must match your registered company name, trade name, or brand trademark.</li>
              <li>Approval takes <strong>12 to 24 business hours</strong> across all Kenyan mobile network operators.</li>
            </ul>
          </div>
        </div>

        {/* Right 5 cols: Request New Sender ID */}
        <div className="lg:col-span-5 bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs">
          <h2 className="text-base font-bold text-zinc-900 mb-1">
            Request Dedicated Sender ID
          </h2>
          <p className="text-xs text-zinc-500 mb-5">
            Submit your company name for carrier whitelisting.
          </p>

          <form onSubmit={handleRequestSenderId} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                Requested Brand Name (Max 11 chars)
              </label>
              <input
                type="text"
                maxLength={11}
                value={requestedName}
                onChange={(e) => setRequestedName(e.target.value.toUpperCase())}
                placeholder="e.g. YOURBRAND"
                className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 font-mono font-bold text-zinc-900 uppercase focus:outline-none focus:ring-2 focus:ring-[#581c87] placeholder:normal-case placeholder:font-sans placeholder:font-normal"
              />
              <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-1">
                <span>Alphanumeric letters only</span>
                <span>{requestedName.length}/11 chars</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                Primary Messaging Use Case
              </label>
              <select
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#581c87] bg-white cursor-pointer"
              >
                <option value="Promotional Alerts & Marketing">Promotional Alerts &amp; Marketing</option>
                <option value="Transactional & OTP Verification">Transactional &amp; OTP Verification</option>
                <option value="Customer Support & Notifications">Customer Support &amp; Notifications</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50 mt-2"
            >
              {isSubmitting ? "Submitting Request..." : "Submit for Carrier Approval"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
