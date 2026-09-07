/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

import {
  useFetchApiKeys,
  useCreateApiKey,
  useRevokeApiKey,
} from "@/hooks/integrations/actions";
import { ApiKeyItem } from "@/services/integrations";

type CodeLanguage = "curl" | "javascript" | "python";
type EndpointTab = "whatsapp" | "sms" | "transactional" | "balance";

export default function DeveloperAPIPage() {
  // Queries & Mutations
  const { data: apiKeys, isLoading } = useFetchApiKeys();
  const createMutation = useCreateApiKey();
  const revokeMutation = useRevokeApiKey();

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [keyName, setKeyName] = useState("");
  const [allowSms, setAllowSms] = useState(true);
  const [allowWhatsApp, setAllowWhatsApp] = useState(true);
  const [isTestKey, setIsTestKey] = useState(false);

  // Reveal Modal
  const [revealedKey, setRevealedKey] = useState<string | null>(null);

  // Revoke Modal
  const [revokingKey, setRevokingKey] = useState<ApiKeyItem | null>(null);

  // Playground / Docs state
  const [activeLang, setActiveLang] = useState<CodeLanguage>("curl");
  const [activeTab, setActiveTab] = useState<EndpointTab>("whatsapp");

  // Active key for documentation snippet
  const sampleKey = useMemo(() => {
    if (!apiKeys || apiKeys.length === 0) return "ljk_live_YOUR_SECRET_KEY";
    const activeOne = apiKeys.find((k) => k.is_active);
    return activeOne ? `${activeOne.key_prefix.replace("...", "")}abcdef123456` : "ljk_live_YOUR_SECRET_KEY";
  }, [apiKeys]);

  const copyToClipboard = (text: string, label = "Code") => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
    }
  };

  const handleOpenCreateModal = () => {
    setKeyName("");
    setAllowSms(true);
    setAllowWhatsApp(true);
    setIsTestKey(false);
    setIsCreateModalOpen(true);
  };

  const handleCreateKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName.trim()) {
      toast.error("Please provide a name for this API key.");
      return;
    }

    const channels: string[] = [];
    if (allowSms) channels.push("SMS");
    if (allowWhatsApp) channels.push("WHATSAPP");

    if (channels.length === 0) {
      toast.error("Select at least one allowed channel (SMS or WhatsApp).");
      return;
    }

    createMutation.mutate(
      {
        name: keyName.trim(),
        allowed_channels: channels,
        is_test: isTestKey,
      },
      {
        onSuccess: (res) => {
          setIsCreateModalOpen(false);
          setRevealedKey(res.raw_secret_key);
          toast.success("API Key generated successfully!");
        },
        onError: (err: any) => {
          const msg = err?.response?.data?.name?.[0] || err?.response?.data?.error || "Failed to create API key";
          toast.error(msg);
        },
      }
    );
  };

  const handleRevokeConfirm = () => {
    if (!revokingKey) return;
    revokeMutation.mutate(revokingKey.reference, {
      onSuccess: () => {
        toast.success(`API Key '${revokingKey.name}' has been revoked.`);
        setRevokingKey(null);
      },
      onError: () => {
        toast.error("Failed to revoke API key.");
      },
    });
  };

  // Code Snippet Generator
  const getCodeSnippet = (tab: EndpointTab, lang: CodeLanguage): string => {
    const baseUrl = "https://api.ljkmarketingagency.co.ke";

    if (tab === "whatsapp") {
      if (lang === "curl") {
        return `curl -X POST ${baseUrl}/api/v1/integrations/dispatch/single/ \\
  -H "X-API-Key: ${sampleKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "channel": "WHATSAPP",
    "recipient": "+254710584581",
    "template_name": "customer_order_dispatch",
    "language_code": "en_US",
    "template_variables": ["John Doe", "KES 15,000", "Nairobi CBD"],
    "reference_id": "ORD-TXN-9842"
  }'`;
      }
      if (lang === "javascript") {
        return `// Using Fetch (Node.js / Browser)
const response = await fetch("${baseUrl}/api/v1/integrations/dispatch/single/", {
  method: "POST",
  headers: {
    "X-API-Key": "${sampleKey}",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    channel: "WHATSAPP",
    recipient: "+254710584581",
    template_name: "customer_order_dispatch",
    language_code: "en_US",
    template_variables: ["John Doe", "KES 15,000", "Nairobi CBD"],
    reference_id: "ORD-TXN-9842"
  })
});

const result = await response.json();
console.log("WhatsApp Dispatch:", result);`;
      }
      if (lang === "python") {
        return `import requests

url = "${baseUrl}/api/v1/integrations/dispatch/single/"
headers = {
    "X-API-Key": "${sampleKey}",
    "Content-Type": "application/json"
}
payload = {
    "channel": "WHATSAPP",
    "recipient": "+254710584581",
    "template_name": "customer_order_dispatch",
    "language_code": "en_US",
    "template_variables": ["John Doe", "KES 15,000", "Nairobi CBD"],
    "reference_id": "ORD-TXN-9842"
}

response = requests.post(url, json=payload, headers=headers, timeout=10)
print(response.json())`;
      }
    }

    if (tab === "sms") {
      if (lang === "curl") {
        return `curl -X POST ${baseUrl}/api/v1/integrations/dispatch/single/ \\
  -H "X-API-Key: ${sampleKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "channel": "SMS",
    "recipient": "+254712345678",
    "message": "Your one-time verification code is 492018. Valid for 10 minutes.",
    "sender_id": "LJK_AGENCY",
    "reference_id": "OTP-7819"
  }'`;
      }
      if (lang === "javascript") {
        return `const response = await fetch("${baseUrl}/api/v1/integrations/dispatch/single/", {
  method: "POST",
  headers: {
    "X-API-Key": "${sampleKey}",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    channel: "SMS",
    recipient: "+254712345678",
    message: "Your one-time verification code is 492018. Valid for 10 minutes.",
    sender_id: "LJK_AGENCY",
    reference_id: "OTP-7819"
  })
});

const data = await response.json();
console.log("SMS Delivery ID:", data.message_id);`;
      }
      if (lang === "python") {
        return `import requests

resp = requests.post(
    "${baseUrl}/api/v1/integrations/dispatch/single/",
    headers={"X-API-Key": "${sampleKey}"},
    json={
        "channel": "SMS",
        "recipient": "+254712345678",
        "message": "Your one-time verification code is 492018. Valid for 10 minutes.",
        "sender_id": "LJK_AGENCY",
        "reference_id": "OTP-7819"
    }
)
print(resp.json())`;
      }
    }

    if (tab === "transactional") {
      if (lang === "curl") {
        return `# Automated Transaction & Order Alert
curl -X POST ${baseUrl}/api/v1/integrations/dispatch/single/ \\
  -H "X-API-Key: ${sampleKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "channel": "WHATSAPP",
    "recipient": "+254712345678",
    "message": "Dear Customer, your payment of KES 10,000 for Order #ORD-9842 has been confirmed. Your receipt has been generated. Ref: QX98124",
    "reference_id": "TXN-ORD-9842"
  }'`;
      }
      if (lang === "javascript") {
        return `// Automated Transaction & Order Webhook Dispatcher
async function sendTransactionalAlert(phone, amount, orderId, receipt) {
  const res = await fetch("${baseUrl}/api/v1/integrations/dispatch/single/", {
    method: "POST",
    headers: {
      "X-API-Key": "${sampleKey}",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      channel: "WHATSAPP", // Or "SMS"
      recipient: phone,
      message: \`Dear Customer, your payment of KES \${amount} for Order #\${orderId} has been confirmed. Ref: \${receipt}\`,
      reference_id: \`TXN-\${orderId}\`
    })
  });
  return await res.json();
}`;
      }
      if (lang === "python") {
        return `def send_transactional_alert(phone: str, amount: str, order_id: str, receipt: str):
    """Dispatches instant transaction notification via LJK Gateway."""
    resp = requests.post(
        "${baseUrl}/api/v1/integrations/dispatch/single/",
        headers={"X-API-Key": "${sampleKey}"},
        json={
            "channel": "WHATSAPP",
            "recipient": phone,
            "message": f"Dear Customer, your payment of KES {amount} for Order #{order_id} has been confirmed. Ref: {receipt}",
            "reference_id": f"TXN-{order_id}"
        }
    )
    return resp.json()`;
      }
    }

    // Balance check
    if (lang === "curl") {
      return `curl -X GET ${baseUrl}/api/v1/integrations/balance/ \\
  -H "X-API-Key: ${sampleKey}"`;
    }
    if (lang === "javascript") {
      return `const balanceRes = await fetch("${baseUrl}/api/v1/integrations/balance/", {
  headers: { "X-API-Key": "${sampleKey}" }
});
const wallet = await balanceRes.json();
console.log("Available Credits:", wallet.sms_credit_balance);`;
    }
    return `import requests

resp = requests.get(
    "${baseUrl}/api/v1/integrations/balance/",
    headers={"X-API-Key": "${sampleKey}"}
)
print("Balance:", resp.json()["sms_credit_balance"])`;
  };

  return (
    <div className="space-y-6 w-full max-w-none">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
            <Link href="/business/dashboard" className="hover:text-zinc-900">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-zinc-900 font-medium">Developer &amp; API</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            Developer REST API &amp; Integrations Engine
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 mt-0.5">
            Connect enterprise backends, ERPs, CRMs, e-commerce stores, and custom applications directly to LJK&apos;s verified WhatsApp and SMS gateway.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="py-2.5 px-4 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors shadow-xs cursor-pointer inline-flex items-center gap-2 shrink-0"
        >
          <span>+ Generate New API Key</span>
        </button>
      </div>

      {/* 2. Official Meta Tech Provider Authority Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-zinc-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-emerald-800/60 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Verified Meta Tech Provider (Corban Technologies LTD)
            </span>
            <span className="text-zinc-300 text-xs font-mono">
              Cloud API v19.0 &bull; Live WABA 2660518117713455
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
            High-Throughput Omnichannel API Gateway
          </h2>
          <p className="text-xs text-zinc-300 max-w-2xl leading-relaxed">
            All dispatches via this API route through official Meta WhatsApp Cloud API endpoints with blue-tick read telemetry, and Tier-1 telco carrier aggregates across Safaricom &amp; Airtel with automatic failover.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-xs font-mono text-zinc-200">
            Base Endpoint: <strong className="text-white">https://api.ljkmarketingagency.co.ke</strong>
          </div>
        </div>
      </div>

      {/* 3. API Keys Section */}
      <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-zinc-900">
              Production &amp; Sandbox API Credentials
            </h2>
            <p className="text-xs text-zinc-500">
              API Keys authenticate your backend services. Keep them secret and never expose them in client-side code.
            </p>
          </div>
          <span className="text-xs font-mono text-zinc-500">
            {apiKeys?.filter((k) => k.is_active).length || 0} active key(s)
          </span>
        </div>

        {isLoading ? (
          <div className="py-8 text-center text-xs text-zinc-400">Loading API keys...</div>
        ) : !apiKeys || apiKeys.length === 0 ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-10 h-10 mx-auto rounded-full bg-purple-50 text-[#581c87] flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <p className="text-xs text-zinc-600 font-medium">No API keys created yet.</p>
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="py-1.5 px-3 bg-[#581c87] text-white text-xs font-semibold rounded-lg hover:bg-[#4a1572] cursor-pointer"
            >
              Generate First API Key
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-zinc-400 font-bold uppercase tracking-wider border-b border-zinc-100 pb-2">
                  <th className="py-2.5 px-3">Name / Label</th>
                  <th className="py-2.5 px-3">Key Prefix</th>
                  <th className="py-2.5 px-3">Channels</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Last Used</th>
                  <th className="py-2.5 px-3">Created</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {apiKeys.map((key) => (
                  <tr key={key.id || key.reference} className="hover:bg-zinc-50/60 transition-colors">
                    <td className="py-3 px-3 font-semibold text-zinc-900">
                      {key.name}
                    </td>
                    <td className="py-3 px-3 font-mono text-zinc-700">
                      <span className="px-2 py-1 rounded bg-zinc-100 border border-zinc-200 text-[11px]">
                        {key.key_prefix}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1">
                        {key.allowed_channels?.map((ch) => (
                          <span
                            key={ch}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              ch === "WHATSAPP"
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : "bg-purple-50 text-purple-800 border border-purple-200"
                            }`}
                          >
                            {ch}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                          key.is_active
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-zinc-100 text-zinc-600 border border-zinc-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            key.is_active ? "bg-emerald-500" : "bg-zinc-400"
                          }`}
                        />
                        {key.is_active ? "Active" : "Revoked"}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-zinc-500">
                      {key.last_used_at
                        ? new Date(key.last_used_at).toLocaleDateString("en-KE", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Never"}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-zinc-500">
                      {new Date(key.created_at).toLocaleDateString("en-KE", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {key.is_active ? (
                        <button
                          type="button"
                          onClick={() => setRevokingKey(key)}
                          className="text-red-600 hover:text-red-800 font-semibold cursor-pointer text-xs"
                        >
                          Revoke
                        </button>
                      ) : (
                        <span className="text-zinc-400 italic">Revoked</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Interactive API Playground & Documentation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Code Snippet & Use Cases */}
        <div className="lg:col-span-8 bg-zinc-950 text-white rounded-2xl p-5 sm:p-6 shadow-xl space-y-4 border border-zinc-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
            {/* Endpoint Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveTab("whatsapp")}
                className={`py-1 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "whatsapp"
                    ? "bg-emerald-500 text-zinc-950 font-bold"
                    : "bg-zinc-800/80 text-zinc-300 hover:bg-zinc-800"
                }`}
              >
                WhatsApp Cloud API
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("sms")}
                className={`py-1 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "sms"
                    ? "bg-[#581c87] text-white font-bold"
                    : "bg-zinc-800/80 text-zinc-300 hover:bg-zinc-800"
                }`}
              >
                Bulk SMS API
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("transactional")}
                className={`py-1 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "transactional"
                    ? "bg-amber-500 text-zinc-950 font-bold"
                    : "bg-zinc-800/80 text-zinc-300 hover:bg-zinc-800"
                }`}
              >
                Transactional &amp; Order Alerts
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("balance")}
                className={`py-1 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "balance"
                    ? "bg-sky-500 text-zinc-950 font-bold"
                    : "bg-zinc-800/80 text-zinc-300 hover:bg-zinc-800"
                }`}
              >
                Wallet Balance Check
              </button>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
              {(["curl", "javascript", "python"] as CodeLanguage[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveLang(lang)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold transition-all cursor-pointer ${
                    activeLang === lang
                      ? "bg-white/20 text-white"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Code Viewer */}
          <div className="relative">
            <pre className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed max-h-96">
              {getCodeSnippet(activeTab, activeLang)}
            </pre>
            <button
              type="button"
              onClick={() => copyToClipboard(getCodeSnippet(activeTab, activeLang), "Snippet")}
              className="absolute top-3 right-3 py-1 px-2.5 rounded bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold border border-white/20 transition-all cursor-pointer"
            >
              Copy Code
            </button>
          </div>

          <div className="text-xs text-zinc-400 flex items-center justify-between pt-1">
            <span>
              Authentication: Provide your key via <code className="font-mono text-zinc-200">X-API-Key</code> or <code className="font-mono text-zinc-200">Authorization: Bearer &lt;key&gt;</code>
            </span>
          </div>
        </div>

        {/* Right: API Specs & Error Handling */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
              HTTP Response Schema (201 Created)
            </h3>
            <pre className="p-3 bg-zinc-50 rounded-lg border border-zinc-200 text-[11px] font-mono text-zinc-800 overflow-x-auto leading-relaxed">
{`{
  "success": true,
  "message_id": "MSG_8F9210",
  "external_reference": "ORD-9842",
  "channel": "WHATSAPP",
  "recipient": "+254710584581",
  "status": "SENT",
  "carrier_message_id": "wamid.HBg...",
  "credits_deducted": 2,
  "remaining_balance": 984
}`}
            </pre>
          </div>

          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs space-y-2.5 text-xs text-zinc-600">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
              Status Codes &amp; Errors
            </h3>
            <ul className="space-y-2 leading-relaxed">
              <li>
                <strong className="text-emerald-700 font-mono">201 Created</strong>: Message queued &amp; dispatched to telecom carrier or Meta Graph API.
              </li>
              <li>
                <strong className="text-amber-700 font-mono">402 Payment Required</strong>: Insufficient wallet credit balance. Top up under Billing.
              </li>
              <li>
                <strong className="text-red-700 font-mono">401 Unauthorized</strong>: Missing or deactivated API key.
              </li>
              <li>
                <strong className="text-purple-700 font-mono">403 Forbidden</strong>: API key unauthorized for requested channel.
              </li>
              <li>
                <strong className="text-zinc-800 font-mono">502 Bad Gateway</strong>: Carrier hard error (automatically refunds credits).
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* MODAL: Generate API Key */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h2 className="text-base font-bold text-zinc-900">
                Generate New API Key
              </h2>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 text-lg cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateKeySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Key Name / Description
                </label>
                <input
                  type="text"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  placeholder="e.g. Production Backend, E-Commerce Store, Mobile App"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#581c87]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                  Allowed Channels
                </label>
                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allowWhatsApp}
                      onChange={(e) => setAllowWhatsApp(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                    />
                    <span className="font-semibold text-zinc-900">Meta WhatsApp Cloud API (Verified Provider)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allowSms}
                      onChange={(e) => setAllowSms(e.target.checked)}
                      className="rounded text-[#581c87] focus:ring-purple-500 w-4 h-4"
                    />
                    <span className="font-semibold text-zinc-900">Bulk SMS &amp; Transactional OTP (Tier-1 Carriers)</span>
                  </label>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-100">
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={isTestKey}
                    onChange={(e) => setIsTestKey(e.target.checked)}
                    className="rounded text-zinc-600 focus:ring-zinc-500 w-4 h-4"
                  />
                  <span className="text-zinc-600">Sandbox Test Key (<code className="font-mono">ljk_test_...</code>)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="py-2 px-4 rounded-lg border border-zinc-200 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="py-2 px-5 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {createMutation.isPending ? "Generating..." : "Generate Key"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Reveal Secret Key (ONE-TIME ONLY) */}
      {revealedKey && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 inline-flex items-center gap-1">
                <span>⚠️</span> One-Time Secret Key Reveal
              </span>
              <h2 className="text-base font-bold text-zinc-900">
                Your API Key Has Been Created
              </h2>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Please copy this key now and store it in a secure environment. For your security, <strong>you will not be able to view it again</strong> after dismissing this dialog.
              </p>
            </div>

            <div className="p-3.5 bg-zinc-900 rounded-xl border border-zinc-800 text-xs font-mono text-emerald-400 break-all leading-relaxed select-all">
              {revealedKey}
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => copyToClipboard(revealedKey, "Secret API Key")}
                className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Copy API Key</span>
              </button>

              <button
                type="button"
                onClick={() => setRevealedKey(null)}
                className="py-2 px-5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                I Have Saved My Key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Revoke Key Confirmation */}
      {revokingKey && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-zinc-900">Revoke API Key</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Are you sure you want to revoke <strong>{revokingKey.name}</strong> ({revokingKey.key_prefix})? External services using this key will immediately be rejected.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRevokingKey(null)}
                className="py-1.5 px-3 rounded-lg border border-zinc-200 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRevokeConfirm}
                disabled={revokeMutation.isPending}
                className="py-1.5 px-4 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                {revokeMutation.isPending ? "Revoking..." : "Revoke Key"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
