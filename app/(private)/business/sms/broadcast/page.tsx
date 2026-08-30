"use client";

import React, { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function BulkSMSBroadcastPage() {
  const [recipients, setRecipients] = useState("");
  const [message, setMessage] = useState("");
  const [senderId, setSenderId] = useState("LJK_AGENCY");
  const [isSending, setIsSending] = useState(false);

  // Character calculation
  const charCount = message.length;
  const isUnicode = /[^\u0000-\u007F]/.test(message);
  const maxCharsPerSMS = isUnicode ? 70 : 160;
  const smsUnits = charCount === 0 ? 1 : Math.ceil(charCount / maxCharsPerSMS);

  // Recipient list count calculation
  const recipientList = recipients
    .split(/[\n,]+/)
    .map((num) => num.trim())
    .filter((num) => num.length > 0);
  const totalRecipients = recipientList.length;
  const totalCostCredits = totalRecipients * smsUnits;

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();

    if (totalRecipients === 0) {
      toast.error("Please enter at least one recipient phone number");
      return;
    }
    if (!message.trim()) {
      toast.error("Please compose a message to send");
      return;
    }
    if (totalCostCredits > 50) {
      toast.error(`Insufficient SMS credits (${totalCostCredits} needed, 50 available). Please top up.`);
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      toast.success(`Broadcast successfully queued for ${totalRecipients} recipients!`);
      setRecipients("");
      setMessage("");
    }, 1200);
  };

  return (
    <div className="space-y-6 w-full max-w-none">
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
            <Link href="/business/dashboard" className="hover:text-zinc-900">Dashboard</Link>
            <span>/</span>
            <span className="text-zinc-900 font-medium">Bulk SMS Broadcast</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            Compose &amp; Launch Bulk SMS
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 mt-0.5">
            Instant Tier-1 carrier dispatch across Safaricom, Airtel, and Telkom networks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/business/billing"
            className="py-2 px-3 bg-purple-50 hover:bg-purple-100 text-[#581c87] text-xs font-semibold rounded-lg border border-purple-200 transition-colors"
          >
            Balance: <strong>50 Credits</strong>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 cols: Broadcast Form */}
        <div className="lg:col-span-8 bg-white border border-zinc-200 rounded-xl p-5 sm:p-7 shadow-xs">
          <form onSubmit={handleSendBroadcast} className="space-y-5">
            {/* Sender ID Selector */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                Sender ID / Route
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={senderId}
                  onChange={(e) => setSenderId(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#581c87] bg-white cursor-pointer"
                >
                  <option value="LJK_AGENCY">LJK_AGENCY (Shared Instant Route &bull; Default)</option>
                  <option value="PROMOTIONAL">PROMOTIONAL (Standard Broadcast Route)</option>
                </select>
                <Link
                  href="/business/sender-ids"
                  className="py-2.5 px-3 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 text-xs font-semibold rounded-lg border border-zinc-200 transition-colors flex items-center justify-center shrink-0"
                >
                  + Request Custom Sender ID
                </Link>
              </div>
            </div>

            {/* Recipients Textarea / File Upload */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                  Recipients Phone Numbers
                </label>
                <span className="text-xs text-zinc-500 font-medium">
                  {totalRecipients} {totalRecipients === 1 ? "recipient" : "recipients"} identified
                </span>
              </div>
              <textarea
                rows={4}
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
                placeholder="Enter numbers separated by comma or new line (e.g. 0712345678, +254722000000, 254733000000)"
                className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs sm:text-sm font-mono text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#581c87] placeholder:text-zinc-400 placeholder:font-sans"
              />
              <p className="text-[11px] text-zinc-500 mt-1">
                Format: International or local Kenyan format (07XX / 01XX / +2547XX).
              </p>
            </div>

            {/* Message Body */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                  SMS Message Body
                </label>
                <span className="text-xs text-zinc-500 font-mono">
                  {charCount} chars &bull; {smsUnits} {smsUnits === 1 ? "SMS page" : "SMS pages"} {isUnicode && "(Unicode)"}
                </span>
              </div>
              <textarea
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your promotional campaign or alert message here..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#581c87] placeholder:text-zinc-400 leading-relaxed"
              />
              <div className="flex items-center justify-between text-[11px] text-zinc-500 mt-1">
                <span>Standard GSM 7-bit: 160 chars per SMS</span>
                <span>Opt-out text recommended for promotional broadcasts</span>
              </div>
            </div>

            {/* Cost Summary & Dispatch Button */}
            <div className="pt-4 border-t border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-zinc-600">
                Total Estimated Cost:{" "}
                <span className="font-bold text-[#581c87] text-sm">
                  {totalCostCredits} Credits
                </span>{" "}
                <span className="text-zinc-400">({totalRecipients} &times; {smsUnits} page)</span>
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="py-2.5 px-6 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isSending ? (
                  <>
                    <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Dispatching Broadcast...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span>Send Broadcast Now</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right 4 cols: Live Preview & Best Practices */}
        <div className="lg:col-span-4 space-y-6">
          {/* Mobile Handset Preview */}
          <div className="bg-zinc-900 text-white rounded-2xl p-5 shadow-md">
            <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center justify-between">
              <span>Handset Preview</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>

            {/* Mock Phone Notification bubble */}
            <div className="bg-zinc-800/90 rounded-xl p-3.5 border border-zinc-700/60 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-zinc-400 font-medium">
                <span className="text-purple-300 font-bold font-mono">{senderId}</span>
                <span>Now</span>
              </div>
              <p className="text-xs text-zinc-100 leading-relaxed break-words">
                {message || "Your SMS preview message will appear here in real-time as you type..."}
              </p>
            </div>
          </div>

          {/* Broadcast Guidelines */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs space-y-3 text-xs">
            <h3 className="font-bold text-zinc-900">Compliance &amp; Best Practices</h3>
            <ul className="space-y-2 text-zinc-600 list-disc list-inside leading-relaxed">
              <li>Kenyan promotional SMS hours: <strong>8:00 AM &ndash; 7:00 PM</strong>.</li>
              <li>Include your business contact info or unsubscribe opt-out.</li>
              <li>Handset delivery reports (DLR) will appear in the Reports tab within ~1.8s.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
