/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useFetchBusinesses } from "@/hooks/business/actions";
import { useFetchContacts } from "@/hooks/contacts/actions";
import { useFetchBusinessWallets } from "@/hooks/businesswallets/actions";
import { Business } from "@/services/business";

export default function BusinessOnboardingGuidePage() {
  const [activeTab, setActiveTab] = useState<"tour" | "checklist" | "templates" | "compliance">("tour");
  const [copiedTemplateIdx, setCopiedTemplateIdx] = useState<number | null>(null);

  const { data: businessesData } = useFetchBusinesses();
  const { data: contactsData } = useFetchContacts();
  const { data: walletsData } = useFetchBusinessWallets();

  const businesses: Business[] = Array.isArray(businessesData)
    ? businessesData
    : (businessesData as any)?.results || [];
  const primaryBusiness = businesses[0];

  const contactsList = Array.isArray(contactsData)
    ? contactsData
    : (contactsData as any)?.results || [];

  const walletsList = Array.isArray(walletsData)
    ? walletsData
    : (walletsData as any)?.results || [];
  const activeWallet = walletsList[0] || primaryBusiness?.wallet;

  // Real-time Checklist Completion Checks
  const isProfileComplete = Boolean(primaryBusiness?.name && primaryBusiness?.email);
  const isSenderIdRequested = Boolean(primaryBusiness?.sender_id);
  const isSenderIdApproved = primaryBusiness?.sender_id_status === "APPROVED";
  const hasContacts = contactsList.length > 0;
  const hasCredits = (activeWallet?.sms_credit_balance || 0) > 0;

  const completedStepsCount = [
    isProfileComplete,
    isSenderIdRequested,
    hasContacts,
    hasCredits,
  ].filter(Boolean).length;

  const progressPercentage = Math.round((completedStepsCount / 4) * 100);

  const sampleTemplates = [
    {
      title: "Flash Sale & Promotional Discount",
      category: "Marketing",
      text: "Hello {first_name}, enjoy 20% OFF all items at {business_name} this weekend only! Use code FLASH20 at checkout. Shop now: https://shop.co.ke",
      chars: 142,
    },
    {
      title: "Order Dispatch & Delivery Update",
      category: "Transactional",
      text: "Hi {first_name}, your order #{order_id} has been dispatched! Our driver will deliver to {address} today. Track live: https://trk.co.ke/5432",
      chars: 139,
    },
    {
      title: "Payment / Invoice Reminder",
      category: "Finance",
      text: "Dear {first_name}, a friendly reminder that your balance of KES {balance} for account {account_no} is due on {due_date}. Pay via Paybill 123456.",
      chars: 148,
    },
    {
      title: "Event / Webinar Invitation",
      category: "Engagement",
      text: "Hi {first_name}, you're invited to the {business_name} Masterclass this Thursday at 7 PM. Reserve your seat here: https://meet.co.ke/event",
      chars: 135,
    },
  ];

  const handleCopyTemplate = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedTemplateIdx(idx);
    setTimeout(() => setCopiedTemplateIdx(null), 2000);
  };

  const portalNavigationGuides = [
    {
      id: "nav-sms",
      title: "Send Bulk SMS Broadcasts",
      href: "/business/sms/broadcast",
      badge: "Core Campaign Tool",
      description:
        "Compose high-speed SMS blasts to contact groups, your entire customer directory, or pasted phone numbers.",
      keyFeatures: [
        "Dynamic Tag Pills: Click `+ {first_name}` to personalize each recipient's SMS.",
        "GSM 03.38 Segment Meter: Live counter shows single (160) vs concatenated (153/part) usage.",
        "Variable-Length Inflation Safeguard: Warns when text is close to 160 characters with dynamic tags.",
        "Handset Preview: Live smartphone mockup renders sample text in real time.",
        "Asynchronous Dispatch: Enqueues blasts in <100ms via Celery background workers.",
      ],
      actionText: "Open SMS Composer",
    },
    {
      id: "nav-contacts",
      title: "Contacts & Audience Segmentation",
      href: "/business/contacts",
      badge: "Audience Directory",
      description:
        "Organize your customers into target groups, import spreadsheets, and manage opt-out preferences.",
      keyFeatures: [
        "1-Click CSV/Excel Importer: Auto-maps First Name, Last Name, Phone, and Custom Attributes.",
        "Kenyan E.164 Normalizer: Cleans 07XX, 01XX, and 254 numbers into standard international format.",
        "Target Groups: Segment contacts into groups (e.g. VIP, Suppliers, Retail Customers).",
        "1-Click Blast: Click 'Send SMS to Group' to jump straight into the composer with group pre-selected.",
      ],
      actionText: "Manage Contacts & Groups",
    },
    {
      id: "nav-billing",
      title: "Top Up Credits & Billing",
      href: "/business/billing",
      badge: "Wallets & Payments",
      description:
        "Manage your SMS and Email credit wallets, purchase packages, and top up instantly via M-PESA.",
      keyFeatures: [
        "Real-Time Balances: Live display of remaining SMS and Email credit balances.",
        "M-PESA STK Express: Enter your phone number and KES amount for an instant phone PIN prompt.",
        "No Expiry: Units purchased never expire and remain secure in your business wallet.",
        "Immutable Audit Ledger: Complete history with M-Pesa receipts, units added/deducted, and running balances.",
      ],
      actionText: "Open Billing Portal",
    },
    {
      id: "nav-sender-ids",
      title: "Sender IDs & Whitelisting",
      href: "/business/sender-ids",
      badge: "Brand Identity",
      description:
        "Register your official 11-character alphanumeric company name to appear on recipient phones.",
      keyFeatures: [
        "Brand Visibility: Replace random phone numbers with your company name (e.g. YOURBRAND).",
        "Fast-Track Review: Submit KRA PIN and Certificate of Incorporation for 12-24hr approval.",
        "Shared Route: Use the verified default route (LJK_AGENCY) while your custom header is reviewed.",
        "Carrier Whitelisting: Approved across Safaricom, Airtel, and Telkom networks simultaneously.",
      ],
      actionText: "Register Sender ID",
    },
    {
      id: "nav-reports",
      title: "Delivery Reports (DLR) & Telemetry",
      href: "/business/reports",
      badge: "Analytics",
      description:
        "Inspect real-time handset delivery receipts, delivery timestamps, and network routing.",
      keyFeatures: [
        "Carrier DLR Tracking: Statuses update to DELIVERED, SENT, or FAILED as carriers report back.",
        "Network Breakdown: Automatically groups recipients by Safaricom, Airtel, and Telkom.",
        "Investigate Messages: Search by recipient phone number or carrier message ID.",
        "Audit Trail: Verify exact text dispatched and credit units consumed per handset.",
      ],
      actionText: "View Delivery Reports",
    },
    {
      id: "nav-dashboard",
      title: "Overview Dashboard",
      href: "/business/dashboard",
      badge: "Command Center",
      description:
        "High-level telemetry on campaigns, credit burn rates, delivery percentages, and quick actions.",
      keyFeatures: [
        "Summary KPIs: Total SMS sent, live delivery rate %, and active wallet balance.",
        "Recent Campaigns: Live status tracker of in-flight and completed broadcasts.",
        "Quick Launcher: 1-click links to launch blasts, top up, or import contacts.",
      ],
      actionText: "Go to Dashboard",
    },
    {
      id: "nav-developer",
      title: "Developer REST API & Webhooks",
      href: "/business/developer",
      badge: "Integration",
      description:
        "Automate transactional OTPs, order alerts, and CRM messaging directly from your software.",
      keyFeatures: [
        "API Key Management: Generate and revoke secret API keys for Bearer token authorization.",
        "REST Endpoints: Clean JSON endpoints for single SMS, batch blasts, and balance inquiries.",
        "Webhook Callbacks: Receive instant HTTP POST notifications when carrier DLRs arrive.",
        "Code Samples: Ready-to-use snippets in Python, Node.js, PHP, and cURL.",
      ],
      actionText: "Developer Documentation",
    },
    {
      id: "nav-settings",
      title: "Workspace Settings",
      href: "/business/settings",
      badge: "Configuration",
      description:
        "Update your legal business name, billing email, support hotline, and workspace preferences.",
      keyFeatures: [
        "Company Details: Update legal trade name and corporate contacts for official receipts.",
        "Business Reference: Copy your unique workspace reference code for support and API calls.",
        "Security & Passwords: Keep your login credentials and authentication tokens protected.",
      ],
      actionText: "Workspace Settings",
    },
  ];

  return (
    <div className="space-y-8 w-full max-w-none">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#2e0854] via-[#581c87] to-[#7e22ce] p-6 sm:p-8 text-white shadow-md">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-white/15 backdrop-blur-md border border-white/20 text-purple-100">
            <span>🚀 Platform Guides &amp; Site Tour</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            How to Navigate &amp; Use LJK Marketing
          </h1>
          <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed">
            Everything you need to know about navigating your workspace: launching bulk campaigns, managing audience groups, M-PESA top-ups, brand Sender IDs, and carrier analytics.
          </p>
        </div>

        {/* Progress Tracker Pill */}
        <div className="mt-6 pt-6 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-black text-white">{progressPercentage}%</div>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">Setup Checklist</div>
              <div className="text-[11px] text-purple-200">{completedStepsCount} of 4 essential milestones completed</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full sm:w-64 bg-black/25 rounded-full h-2.5 overflow-hidden border border-white/10">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("tour")}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === "tour"
              ? "bg-[#581c87] text-white shadow-xs"
              : "bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50"
          }`}
        >
          📍 Platform Tour &amp; Navigation ({portalNavigationGuides.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("checklist")}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === "checklist"
              ? "bg-[#581c87] text-white shadow-xs"
              : "bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50"
          }`}
        >
          ✓ Onboarding Checklist ({completedStepsCount}/4)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("templates")}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === "templates"
              ? "bg-[#581c87] text-white shadow-xs"
              : "bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50"
          }`}
        >
          💬 Ready SMS Templates ({sampleTemplates.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("compliance")}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === "compliance"
              ? "bg-[#581c87] text-white shadow-xs"
              : "bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50"
          }`}
        >
          ⚖️ CA Telecom Regulations
        </button>
      </div>

      {/* TAB 1: Platform Tour & Navigation */}
      {activeTab === "tour" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-900">
                Portal Features &amp; Navigation Directory
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Detailed breakdown of each tool in your workspace sidebar with shortcuts and tips.
              </p>
            </div>
            <Link
              href="/guide"
              target="_blank"
              className="text-xs font-bold text-[#581c87] hover:underline inline-flex items-center gap-1"
            >
              <span>View Public Web Guide</span>
              <span>&rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {portalNavigationGuides.map((guide) => (
              <div
                key={guide.id}
                className="bg-white border border-zinc-200 hover:border-purple-300 rounded-2xl p-5 sm:p-6 transition-all hover:shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-[#581c87] border border-purple-200">
                      {guide.badge}
                    </span>
                    <Link
                      href={guide.href}
                      className="text-[11px] font-bold text-[#581c87] hover:underline inline-flex items-center gap-1"
                    >
                      <span>{guide.actionText}</span>
                      <span>&rarr;</span>
                    </Link>
                  </div>

                  <h3 className="text-base font-bold text-zinc-900">{guide.title}</h3>
                  <p className="text-xs text-zinc-600 leading-relaxed">{guide.description}</p>

                  <div className="pt-2 border-t border-zinc-100">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
                      Key Capabilities:
                    </div>
                    <ul className="space-y-1.5 text-xs text-zinc-600">
                      {guide.keyFeatures.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-purple-600 font-bold text-xs mt-0.5">&bull;</span>
                          <span className="leading-relaxed text-[11px]">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-zinc-100">
                  <Link
                    href={guide.href}
                    className="w-full py-2 px-3.5 bg-zinc-50 hover:bg-purple-50 text-zinc-800 hover:text-[#581c87] border border-zinc-200 hover:border-purple-200 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between"
                  >
                    <span>Launch {guide.title}</span>
                    <span>&rarr;</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Onboarding Setup Checklist */}
      {activeTab === "checklist" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-zinc-900">
              Essential Onboarding Milestones
            </h2>
            <span className="text-xs text-zinc-500">{completedStepsCount} of 4 completed</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Step 1 */}
            <Link
              href="/business/settings"
              className={`p-5 rounded-xl border transition-all flex flex-col justify-between group ${
                isProfileComplete
                  ? "bg-emerald-50/40 border-emerald-200 hover:border-emerald-300"
                  : "bg-white border-zinc-200 hover:border-purple-300 hover:shadow-xs"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-400 group-hover:text-[#581c87] transition-colors uppercase tracking-wider">
                    Step 1
                  </span>
                  {isProfileComplete ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      ✓ Completed
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      Action Required
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-sm text-zinc-900">Complete Workspace &amp; Business Profile</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Add your official business name, support email, phone number, and physical office address.
                </p>
              </div>
              <div className="pt-4 mt-2 text-xs font-semibold text-[#581c87] group-hover:underline inline-flex items-center gap-1">
                <span>Go to Settings &rarr;</span>
              </div>
            </Link>

            {/* Step 2 */}
            <Link
              href="/business/sender-ids"
              className={`p-5 rounded-xl border transition-all flex flex-col justify-between group ${
                isSenderIdApproved
                  ? "bg-emerald-50/40 border-emerald-200 hover:border-emerald-300"
                  : isSenderIdRequested
                  ? "bg-amber-50/40 border-amber-200 hover:border-amber-300"
                  : "bg-white border-zinc-200 hover:border-purple-300 hover:shadow-xs"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-400 group-hover:text-[#581c87] transition-colors uppercase tracking-wider">
                    Step 2
                  </span>
                  {isSenderIdApproved ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      ✓ Approved &amp; Live
                    </span>
                  ) : isSenderIdRequested ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      Telco Review Pending
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-700">
                      Not Requested
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-sm text-zinc-900">Request Alphanumeric Sender ID</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Whitelist your 11-character brand header with Safaricom and Airtel Kenya.
                </p>
              </div>
              <div className="pt-4 mt-2 text-xs font-semibold text-[#581c87] group-hover:underline inline-flex items-center gap-1">
                <span>Manage Sender IDs &rarr;</span>
              </div>
            </Link>

            {/* Step 3 */}
            <Link
              href="/business/contacts"
              className={`p-5 rounded-xl border transition-all flex flex-col justify-between group ${
                hasContacts
                  ? "bg-emerald-50/40 border-emerald-200 hover:border-emerald-300"
                  : "bg-white border-zinc-200 hover:border-purple-300 hover:shadow-xs"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-400 group-hover:text-[#581c87] transition-colors uppercase tracking-wider">
                    Step 3
                  </span>
                  {hasContacts ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      ✓ {contactsList.length} Contacts Added
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      0 Contacts
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-sm text-zinc-900">Upload Your Customer Directory</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Import contacts using our 1-Click CSV/Excel wizard or create audience segments.
                </p>
              </div>
              <div className="pt-4 mt-2 text-xs font-semibold text-[#581c87] group-hover:underline inline-flex items-center gap-1">
                <span>Upload Contacts &rarr;</span>
              </div>
            </Link>

            {/* Step 4 */}
            <Link
              href="/business/billing"
              className={`p-5 rounded-xl border transition-all flex flex-col justify-between group ${
                hasCredits
                  ? "bg-emerald-50/40 border-emerald-200 hover:border-emerald-300"
                  : "bg-white border-zinc-200 hover:border-purple-300 hover:shadow-xs"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-400 group-hover:text-[#581c87] transition-colors uppercase tracking-wider">
                    Step 4
                  </span>
                  {hasCredits ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      ✓ {activeWallet?.sms_credit_balance?.toLocaleString()} Credits Active
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">
                      0 Credits
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-sm text-zinc-900">Top Up SMS Credit Wallet</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Accounts start with 0 credits (no complimentary test credits). Purchase wholesale SMS units via instant Safaricom M-PESA Daraja STK push from KSh 100.
                </p>
              </div>
              <div className="pt-4 mt-2 text-xs font-semibold text-[#581c87] group-hover:underline inline-flex items-center gap-1">
                <span>Top Up in Billing &rarr;</span>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* TAB 3: Ready SMS Templates */}
      {activeTab === "templates" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-zinc-900">
              High-Converting SMS Templates
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Optimized for single-SMS 160-character boundaries. Click &apos;Copy Template&apos; to paste into the composer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sampleTemplates.map((tpl, idx) => (
              <div key={idx} className="p-5 rounded-xl border border-zinc-200 bg-white shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-[#581c87]">
                    {tpl.category}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-400">
                    {tpl.chars} chars &bull; 1 SMS
                  </span>
                </div>
                <h3 className="font-bold text-sm text-zinc-900">{tpl.title}</h3>
                <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200 text-xs font-mono text-zinc-800 leading-relaxed break-words">
                  {tpl.text}
                </div>
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => handleCopyTemplate(tpl.text, idx)}
                    className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-purple-50 text-[#581c87] hover:bg-purple-100 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span>{copiedTemplateIdx === idx ? "✓ Copied!" : "Copy Template"}</span>
                  </button>
                  <Link
                    href="/business/sms/broadcast"
                    className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 hover:underline"
                  >
                    Use in Composer &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CA Telecom Regulations */}
      {activeTab === "compliance" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-zinc-900">
              Kenyan Telecom &amp; Regulatory Compliance
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Communications Authority of Kenya (CA) rules to ensure high deliverability and avoid carrier filtering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-5 bg-white rounded-xl border border-zinc-200 space-y-2">
              <div className="text-amber-600 font-bold text-sm flex items-center gap-2">
                <span>⏰</span>
                <span>Permitted Promotional Hours</span>
              </div>
              <p className="text-zinc-600 leading-relaxed text-xs">
                Under Kenyan law, promotional marketing messages must only be sent between <strong>8:00 AM &ndash; 7:00 PM</strong>. Transactional messages (OTPs, order confirmations) are permitted 24/7.
              </p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-zinc-200 space-y-2">
              <div className="text-purple-600 font-bold text-sm flex items-center gap-2">
                <span>🚫</span>
                <span>Mandatory Opt-Out Mechanism</span>
              </div>
              <p className="text-zinc-600 leading-relaxed text-xs">
                Every marketing campaign must allow recipients to opt out (e.g. <em>&quot;To opt out reply STOP to 22123&quot;</em>). Maintaining opt-outs protects your Sender ID reputation.
              </p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-zinc-200 space-y-2">
              <div className="text-emerald-600 font-bold text-sm flex items-center gap-2">
                <span>📏</span>
                <span>GSM 03.38 vs. Unicode Thresholds</span>
              </div>
              <p className="text-zinc-600 leading-relaxed text-xs">
                Standard English text allows <strong>160 characters</strong> for 1 SMS part, and <strong>153 characters/part</strong> when concatenated. Using emojis triggers Unicode mode (70 characters).
              </p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-zinc-200 space-y-2">
              <div className="text-blue-600 font-bold text-sm flex items-center gap-2">
                <span>🔒</span>
                <span>Data Protection Act (ODPC)</span>
              </div>
              <p className="text-zinc-600 leading-relaxed text-xs">
                Ensure all phone numbers in your customer directory were obtained with user consent. Do not purchase third-party lead lists as carriers block unverified broadcasts.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
