"use client";

import React, { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function DeveloperAPIPage() {
  const [apiKey] = useState("ljk_live_9a87f2e14d3b6c509823e");
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    toast.success("API Key copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-6 w-full max-w-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
            <Link href="/business/dashboard" className="hover:text-zinc-900">Dashboard</Link>
            <span>/</span>
            <span className="text-zinc-900 font-medium">Developer &amp; API</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            REST &amp; SMPP API Integration
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 mt-0.5">
            Integrate instant SMS, 2FA OTP codes, and automated alerts into your web or mobile applications.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: API Keys & Endpoints */}
        <div className="lg:col-span-7 space-y-6">
          {/* API Key Card */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-zinc-900">
                Production API Credentials
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Active
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                Live Secret API Key
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={apiKey}
                  className="flex-1 px-3.5 py-2 rounded-lg border border-zinc-300 font-mono text-xs text-zinc-800 bg-zinc-50"
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(apiKey)}
                  className="py-2 px-3 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  {isCopied ? "Copied!" : "Copy Key"}
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
              <span>Base API Endpoint: <code className="font-mono text-zinc-700">https://api.ljkmarketingagency.co.ke/v1</code></span>
            </div>
          </div>

          {/* SMPP Gateway parameters */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-3">
            <h2 className="text-base font-bold text-zinc-900">
              SMPP 3.4 Direct Gateway
            </h2>
            <p className="text-xs text-zinc-600">
              High-throughput bind credentials for telecom routing engines and enterprise ERPs.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200">
                <span className="text-zinc-500">Host:</span> <strong className="font-mono text-zinc-900 ml-1">smpp.ljkmarketingagency.co.ke</strong>
              </div>
              <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200">
                <span className="text-zinc-500">Port:</span> <strong className="font-mono text-zinc-900 ml-1">2775 (Transceiver)</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 cols: Code snippet */}
        <div className="lg:col-span-5 bg-zinc-900 text-white rounded-xl p-5 sm:p-6 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-purple-300 font-bold">cURL Request Example</span>
            <span className="text-[10px] text-zinc-400">POST /sms/send</span>
          </div>

          <pre className="p-3.5 rounded-lg bg-zinc-950 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
{`curl -X POST https://api.ljk.co.ke/v1/sms \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "+254712345678",
    "message": "Your OTP verification code is 482910",
    "sender_id": "LJK_AGENCY"
  }'`}
          </pre>

          <p className="text-xs text-zinc-400 leading-relaxed pt-2">
            Returns instant JSON payload with message UUID, carrier routing status, and webhook callback URL.
          </p>
        </div>
      </div>
    </div>
  );
}
