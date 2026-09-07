"use client";

import React, { useState } from "react";
import Link from "next/link";

interface CodeSnippet {
  language: string;
  label: string;
  code: string;
}

export function DeveloperDocsContent() {
  const [selectedLang, setSelectedLang] = useState<"curl" | "python" | "javascript" | "php">("curl");
  const [activeTab, setActiveTab] = useState<"single" | "batch" | "status" | "balance" | "sandbox" | "billing">("single");
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // Code snippets for Single Dispatch (WhatsApp & SMS)
  const singleSnippets: Record<string, string> = {
    curl: `curl -X POST "https://api.ljkmarketingagency.co.ke/api/v1/integrations/dispatch/single/" \\
  -H "X-API-Key: ljk_live_your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "channel": "WHATSAPP",
    "recipient": "+254710584581",
    "template_name": "customer_order_dispatch",
    "language_code": "en_US",
    "template_variables": ["Jane Doe", "KES 12,500", "Westlands"],
    "reference_id": "ORD-9842"
  }'`,
    python: `import requests

url = "https://api.ljkmarketingagency.co.ke/api/v1/integrations/dispatch/single/"
headers = {
    "X-API-Key": "ljk_live_your_api_key_here",
    "Content-Type": "application/json"
}
payload = {
    "channel": "WHATSAPP",
    "recipient": "+254710584581",
    "template_name": "customer_order_dispatch",
    "language_code": "en_US",
    "template_variables": ["Jane Doe", "KES 12,500", "Westlands"],
    "reference_id": "ORD-9842"
}

response = requests.post(url, json=payload, headers=headers)
data = response.json()
print("Dispatched:", data["message_id"], "Status:", data["status"])`,
    javascript: `const response = await fetch("https://api.ljkmarketingagency.co.ke/api/v1/integrations/dispatch/single/", {
  method: "POST",
  headers: {
    "X-API-Key": "ljk_live_your_api_key_here",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    channel: "WHATSAPP",
    recipient: "+254710584581",
    template_name: "customer_order_dispatch",
    language_code: "en_US",
    template_variables: ["Jane Doe", "KES 12,500", "Westlands"],
    reference_id: "ORD-9842"
  })
});

const result = await response.json();
console.log("Dispatched Message ID:", result.message_id);`,
    php: `<?php
$ch = curl_init("https://api.ljkmarketingagency.co.ke/api/v1/integrations/dispatch/single/");
$payload = json_encode([
    "channel" => "SMS",
    "recipient" => "+254712345678",
    "message" => "Your verification OTP code is 492018. Valid for 10 minutes.",
    "sender_id" => "YOUR_BRAND",
    "reference_id" => "OTP-89214"
]);

curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "X-API-Key: ljk_live_your_api_key_here",
    "Content-Type: application/json"
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);
print_r($data);
?>`
  };

  // Code snippets for Batch Dispatch
  const batchSnippets: Record<string, string> = {
    curl: `curl -X POST "https://api.ljkmarketingagency.co.ke/api/v1/integrations/dispatch/batch/" \\
  -H "X-API-Key: ljk_live_your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "channel": "WHATSAPP",
    "template_name": "customer_order_dispatch",
    "batch_reference": "BATCH-SEPT-01",
    "recipients": [
      {
        "phone": "+254710584581",
        "name": "Alice M.",
        "variables": ["Alice M.", "KES 5,000", "Nairobi"],
        "reference_id": "TXN-001"
      },
      {
        "phone": "+254722000000",
        "name": "Bob K.",
        "variables": ["Bob K.", "KES 8,500", "Mombasa"],
        "reference_id": "TXN-002"
      }
    ]
  }'`,
    python: `import requests

url = "https://api.ljkmarketingagency.co.ke/api/v1/integrations/dispatch/batch/"
headers = {
    "X-API-Key": "ljk_live_your_api_key_here",
    "Content-Type": "application/json"
}
payload = {
    "channel": "SMS",
    "batch_reference": "BULK-ALERT-04",
    "sender_id": "YOUR_BRAND",
    "recipients": [
        {"phone": "+254712000001", "message": "Notice: System maintenance tonight at 11 PM."},
        {"phone": "+254712000002", "message": "Notice: System maintenance tonight at 11 PM."}
    ]
}

res = requests.post(url, json=payload, headers=headers)
print("Batch Success:", res.json()["dispatched_successfully"])`,
    javascript: `const res = await fetch("https://api.ljkmarketingagency.co.ke/api/v1/integrations/dispatch/batch/", {
  method: "POST",
  headers: {
    "X-API-Key": "ljk_live_your_api_key_here",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    channel: "WHATSAPP",
    template_name: "customer_order_dispatch",
    batch_reference: "BATCH-SEPT-01",
    recipients: [
      { phone: "+254710584581", variables: ["Alice M.", "KES 5,000", "Nairobi"] }
    ]
  })
});
const result = await res.json();
console.log("Dispatched:", result.dispatched_successfully);`,
    php: `<?php
$ch = curl_init("https://api.ljkmarketingagency.co.ke/api/v1/integrations/dispatch/batch/");
// Set cURL headers and batch JSON payload here...
?>`
  };

  // Status Check Snippets
  const statusSnippets: Record<string, string> = {
    curl: `curl -X GET "https://api.ljkmarketingagency.co.ke/api/v1/integrations/dispatch/status/ORD-9842/" \\
  -H "X-API-Key: ljk_live_your_api_key_here"`,
    python: `import requests

res = requests.get(
    "https://api.ljkmarketingagency.co.ke/api/v1/integrations/dispatch/status/ORD-9842/",
    headers={"X-API-Key": "ljk_live_your_api_key_here"}
)
telemetry = res.json()
print("Status:", telemetry["status"], "Read Time:", telemetry["read_timestamp"])`,
    javascript: `const res = await fetch("https://api.ljkmarketingagency.co.ke/api/v1/integrations/dispatch/status/ORD-9842/", {
  headers: { "X-API-Key": "ljk_live_your_api_key_here" }
});
const status = await res.json();
console.log("Blue Ticks Read?", status.is_read);`,
    php: `<?php
$ch = curl_init("https://api.ljkmarketingagency.co.ke/api/v1/integrations/dispatch/status/ORD-9842/");
curl_setopt($ch, CURLOPT_HTTPHEADER, ["X-API-Key: ljk_live_your_api_key_here"]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$res = curl_exec($ch);
curl_close($ch);
?>`
  };

  // Balance Check Snippets
  const balanceSnippets: Record<string, string> = {
    curl: `curl -X GET "https://api.ljkmarketingagency.co.ke/api/v1/integrations/balance/" \\
  -H "X-API-Key: ljk_live_your_api_key_here"`,
    python: `import requests

res = requests.get(
    "https://api.ljkmarketingagency.co.ke/api/v1/integrations/balance/",
    headers={"X-API-Key": "ljk_live_your_api_key_here"}
)
print("Available Credits:", res.json()["sms_credit_balance"])`,
    javascript: `const res = await fetch("https://api.ljkmarketingagency.co.ke/api/v1/integrations/balance/", {
  headers: { "X-API-Key": "ljk_live_your_api_key_here" }
});
const balance = await res.json();
console.log("Credit Balance:", balance.sms_credit_balance);`,
    php: `<?php
$ch = curl_init("https://api.ljkmarketingagency.co.ke/api/v1/integrations/balance/");
curl_setopt($ch, CURLOPT_HTTPHEADER, ["X-API-Key: ljk_live_your_api_key_here"]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$data = json_decode(curl_exec($ch), true);
?>`
  };

  const getActiveCode = () => {
    switch (activeTab) {
      case "single":
        return singleSnippets[selectedLang] || singleSnippets.curl;
      case "batch":
        return batchSnippets[selectedLang] || batchSnippets.curl;
      case "status":
        return statusSnippets[selectedLang] || statusSnippets.curl;
      case "balance":
        return balanceSnippets[selectedLang] || balanceSnippets.curl;
      default:
        return singleSnippets[selectedLang] || singleSnippets.curl;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      {/* Top Breadcrumb & Badge Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/60 backdrop-blur-md sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs">
            <Link href="/" className="text-zinc-400 hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-zinc-600">/</span>
            <Link href="/guide" className="text-zinc-400 hover:text-white transition-colors">
              Guides
            </Link>
            <span className="text-zinc-600">/</span>
            <span className="text-purple-400 font-semibold">Developer Documentation Hub</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              API Gateway v1.0 • Meta Tech Provider Verified
            </span>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
            >
              <span>Sign In for API Keys</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8 border-b border-zinc-800/80">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-purple-950/60 text-purple-300 border border-purple-800">
            <span>REST API Reference &amp; Integration Guides</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Developer Documentation
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Integrate high-speed Bulk SMS and official Meta WhatsApp Business Cloud messaging directly into your web applications, e-commerce stores, core banking systems, CRMs, or ERPs with a unified credit ledger and real-time Blue Ticks delivery telemetry.
          </p>
        </div>
      </div>

      {/* Main Documentation Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar Nav */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 space-y-1 sticky top-36">
            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-3 py-1.5">
              API Endpoints
            </div>
            <button
              type="button"
              onClick={() => setActiveTab("single")}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${activeTab === "single"
                ? "bg-purple-900/50 text-purple-300 border border-purple-700/50"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                }`}
            >
              <span>Single Dispatch</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">POST</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("batch")}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${activeTab === "batch"
                ? "bg-purple-900/50 text-purple-300 border border-purple-700/50"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                }`}
            >
              <span>Batch Dispatch</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">POST</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("status")}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${activeTab === "status"
                ? "bg-purple-900/50 text-purple-300 border border-purple-700/50"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                }`}
            >
              <span>Delivery &amp; Blue Ticks</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800">GET</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("balance")}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${activeTab === "balance"
                ? "bg-purple-900/50 text-purple-300 border border-purple-700/50"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                }`}
            >
              <span>Wallet Balance</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800">GET</span>
            </button>

            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-3 pt-4 pb-1.5">
              Infrastructure &amp; Billing
            </div>
            <button
              type="button"
              onClick={() => setActiveTab("billing")}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${activeTab === "billing"
                ? "bg-purple-900/50 text-purple-300 border border-purple-700/50"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                }`}
            >
              <span>Billing &amp; Auto-Refunds</span>
              <span className="text-[10px] font-mono text-amber-400">Ledger</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("sandbox")}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${activeTab === "sandbox"
                ? "bg-purple-900/50 text-purple-300 border border-purple-700/50"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                }`}
            >
              <span>Developer Sandbox</span>
              <span className="text-[10px] font-mono text-purple-400">Mock API</span>
            </button>

            <div className="pt-4 px-3">
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] space-y-2">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span>🔒</span>
                  <span>Authentication</span>
                </div>
                <p className="text-zinc-400 text-[10px] leading-relaxed">
                  Pass your key in every request via the header:
                </p>
                <code className="block p-1.5 bg-zinc-900 rounded text-purple-300 font-mono text-[10px] border border-zinc-800 break-all">
                  X-API-Key: ljk_live_...
                </code>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="lg:col-span-9 space-y-8">
          {/* Section: Endpoint Details & Interactive Code Box */}
          {activeTab !== "billing" && activeTab !== "sandbox" && (
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${activeTab === "single" || activeTab === "batch"
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                        : "bg-blue-950 text-blue-400 border border-blue-800"
                        }`}
                    >
                      {activeTab === "single" || activeTab === "batch" ? "POST" : "GET"}
                    </span>
                    <span className="text-xs font-mono text-zinc-400">
                      {activeTab === "single" && "/api/v1/integrations/dispatch/single/"}
                      {activeTab === "batch" && "/api/v1/integrations/dispatch/batch/"}
                      {activeTab === "status" && "/api/v1/integrations/dispatch/status/{reference}/"}
                      {activeTab === "balance" && "/api/v1/integrations/balance/"}
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-white">
                    {activeTab === "single" && "Single Direct Message Dispatch"}
                    {activeTab === "batch" && "Bulk Batch Message Dispatch"}
                    {activeTab === "status" && "Delivery Status & Blue Ticks Telemetry Query"}
                    {activeTab === "balance" && "Wallet Balance Pre-Check"}
                  </h2>
                </div>

                {/* Language Switcher */}
                <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
                  {(["curl", "python", "javascript", "php"] as const).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setSelectedLang(lang)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${selectedLang === lang
                        ? "bg-purple-900/60 text-purple-200 border border-purple-700/50"
                        : "text-zinc-400 hover:text-white"
                        }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Code Snippet Box with Copy Button */}
              <div className="relative rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/90 border-b border-zinc-800 text-xs text-zinc-400 font-mono">
                  <span>{selectedLang.toUpperCase()} Request</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(getActiveCode(), "code-box")}
                    className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>{copied === "code-box" ? "✓ Copied" : "Copy Code"}</span>
                  </button>
                </div>
                <pre className="p-4 text-xs font-mono text-purple-200 overflow-x-auto leading-relaxed">
                  <code>{getActiveCode()}</code>
                </pre>
              </div>

              {/* Response Preview */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Sample JSON Response (HTTP 200 / 201)
                </div>
                <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-4 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
                  {activeTab === "single" && (
                    <pre>{`{
  "success": true,
  "message_id": "DV23AZGF0KFG",
  "external_reference": "ORD-9842",
  "channel": "WHATSAPP",
  "recipient": "+254710584581",
  "status": "SENT",
  "carrier_message_id": "wamid.HBgMNDY...",
  "credits_deducted": 2,
  "remaining_balance": 1498,
  "created_at": "2026-09-07T12:40:28.378Z"
}`}</pre>
                  )}
                  {activeTab === "batch" && (
                    <pre>{`{
  "success": true,
  "batch_reference": "BATCH-SEPT-01",
  "total_recipients": 2,
  "dispatched_successfully": 2,
  "failed": 0,
  "remaining_balance": 1494,
  "results": [
    { "phone": "+254710584581", "status": "SENT", "message_id": "MSG_8F921" },
    { "phone": "+254722000000", "status": "SENT", "message_id": "MSG_8F922" }
  ]
}`}</pre>
                  )}
                  {activeTab === "status" && (
                    <pre>{`{
  "message_id": "DV23AZGF0KFG",
  "external_reference": "ORD-9842",
  "phone_number": "+254710584581",
  "status": "DELIVERED",
  "network_operator": "WHATSAPP",
  "carrier_message_id": "wamid.HBgM...",
  "delivery_timestamp": "2026-09-07T12:40:31.000Z",
  "read_timestamp": "2026-09-07T12:40:45.000Z",
  "is_read": true,
  "failure_reason": null,
  "cost_credits": 2,
  "created_at": "2026-09-07T12:40:28.000Z"
}`}</pre>
                  )}
                  {activeTab === "balance" && (
                    <pre>{`{
  "business_name": "Apex Enterprise",
  "sms_credit_balance": 1498,
  "currency": "KES",
  "can_send_sms": true,
  "can_send_whatsapp": true,
  "verified_meta_tech_provider": true
}`}</pre>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Section: Billing Architecture Deep Dive */}
          {activeTab === "billing" && (
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="space-y-2 pb-4 border-b border-zinc-800">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Financial Ledger Architecture
                </span>
                <h2 className="text-2xl font-extrabold text-white">
                  How API Integrations Are Billed
                </h2>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  LJK operates a multi-tenant double-entry credit ledger. Every API call is verified, locked atomically, and reconciled in real-time.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Tier-1 Bulk SMS</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800">
                      1 Credit / 160 GSM
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Standard English characters consume 1 credit per 160 characters. Concatenated messages consume credits proportional to segment count. Special characters or emojis use Unicode mode (70 chars).
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Meta WhatsApp Cloud API</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                      2 Credits Flat / Recipient
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Includes official Meta Cloud conversation charges, rich image/document headers, interactive CTA buttons, and real-time bidirectional Blue Ticks (READ ✓✓) telemetry.
                  </p>
                </div>
              </div>

              {/* Atomic Pre-Auth & Auto-Refund Highlight */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-zinc-950 border border-emerald-800/60 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <span>🛡️</span>
                  <span>Guaranteed Zero-Cost Carrier Rejections (Auto-Refund)</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  If an API message fails at the downstream carrier level (e.g. invalid MSISDN format, dead subscriber, or telco network outage), our gateway catches the carrier failure response, marks the failure reason, and <strong>immediately and atomically refunds the debited credits back to your wallet</strong>. You never pay for unreached numbers.
                </p>
              </div>

              {/* Funding Channels */}
              <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Wallet Funding &amp; M-PESA Automation
                </h3>
                <ul className="text-xs text-zinc-400 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span><strong>M-PESA STK Push:</strong> Top up anytime in KES from the Billing Portal with instant balance release.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span><strong>No Expiration:</strong> Purchased credits remain safely in your ledger indefinitely until consumed.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span><strong>Pre-Send Quota Check:</strong> Call <code>GET /api/v1/integrations/balance/</code> to guarantee your system has sufficient balance before large automated dispatches.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Section: Sandbox Environment Blueprint */}
          {activeTab === "sandbox" && (
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="space-y-2 pb-4 border-b border-zinc-800">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                  Developer Sandbox &amp; Simulation Engine
                </span>
                <h2 className="text-2xl font-extrabold text-white">
                  Zero-Cost Testing Environment (Phase 2 Blueprint)
                </h2>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Develop, simulate edge cases, and test your webhooks and automated scripts without expending real M-PESA funds or live telco units.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <div className="text-xs font-bold text-purple-300">1. Test Key Differentiation</div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Generate sandbox keys prefixed with <code className="text-purple-300">ljk_test_...</code>. The API gateway automatically routes test requests to our high-fidelity simulation engine.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <div className="text-xs font-bold text-purple-300">2. Dedicated Virtual Wallet</div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Test keys receive a virtual allowance of 1,000 free sandbox credits. Reset your virtual balance anytime with one click in the Developer Portal.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <div className="text-xs font-bold text-purple-300">3. High-Fidelity Status Simulator</div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Simulate realistic delivery life-cycles. Special test numbers trigger deterministic outcomes (e.g. <code className="text-zinc-300">+254700000000</code> triggers simulated carrier reject to test your auto-refund handling).
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <div className="text-xs font-bold text-purple-300">4. WhatsApp Blue Ticks Emulation</div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Simulates Meta webhook events: 5 seconds after an API dispatch, the message automatically transitions to <code className="text-blue-400">READ ✓✓</code> with populated read timestamps.
                  </p>
                </div>
              </div>

              {/* Live Virtual Handset Preview Notice */}
              <div className="p-5 rounded-2xl bg-purple-950/40 border border-purple-800/60 flex items-start gap-3">
                <span className="text-xl">📱</span>
                <div className="space-y-1">
                  <div className="text-xs font-bold text-white">Interactive In-Portal Handset Tester</div>
                  <p className="text-xs text-purple-200 leading-relaxed">
                    In the developer dashboard, test calls will render dynamically on a visual iPhone simulator screen in real time, allowing frontend and backend teams to verify visual layouts before going live to real customer phones.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Conversion Box */}
          <div className="bg-gradient-to-r from-purple-950 via-zinc-900 to-zinc-950 border border-purple-800/60 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-lg font-bold text-white">
                Ready to Integrate LJK Into Your Application?
              </h3>
              <p className="text-xs text-zinc-400">
                Create an API key in 30 seconds and start sending in your staging or production environment.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/auth/login?callbackUrl=/business/developer"
                className="px-5 py-2.5 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs font-bold rounded-xl transition-all shadow-md"
              >
                Sign In to Developer Portal &rarr;
              </Link>
              <Link
                href="/contact"
                className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-xl border border-zinc-700 transition-colors"
              >
                Talk to an Engineer
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
