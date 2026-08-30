/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useFetchBusinesses } from "@/hooks/business/actions";
import { useFetchContacts } from "@/hooks/contacts/actions";
import { useFetchBusinessWallets } from "@/hooks/businesswallets/actions";
import { Business } from "@/services/business";

export default function BusinessOnboardingGuidePage() {
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

  // Template Copy Helper
  const [copiedTemplateIdx, setCopiedTemplateIdx] = useState<number | null>(null);

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

  return (
    <div className="space-y-8 w-full max-w-none">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#2e0854] via-[#581c87] to-[#7e22ce] p-6 sm:p-8 text-white shadow-md">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-white/15 backdrop-blur-md border border-white/20 text-purple-100">
            <span>🚀 Quickstart &amp; Onboarding Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Welcome to LJK Marketing Agency
          </h1>
          <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed">
            Follow this step-by-step guide to configure your workspace, register your official brand Sender ID, upload your customer directory, and launch high-impact bulk messaging campaigns across Kenya.
          </p>
        </div>

        {/* Progress Tracker Pill */}
        <div className="mt-6 pt-6 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-black text-white">{progressPercentage}%</div>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">Setup Progress</div>
              <div className="text-[11px] text-purple-200">{completedStepsCount} of 4 essential steps completed</div>
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

      {/* 4 Steps Interactive Checklist */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-zinc-900">
            Essential Onboarding Checklist
          </h2>
          <span className="text-xs text-zinc-500">Click any step to complete</span>
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
                Whitelist your 11-character brand header (e.g. <strong>{primaryBusiness?.name?.slice(0, 11).toUpperCase() || "YOURBRAND"}</strong>) with Safaricom and Airtel Kenya.
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
                    ✓ {contactsList.length} Contacts Saved
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    0 Contacts
                  </span>
                )}
              </div>
              <h3 className="font-bold text-sm text-zinc-900">Import Contacts &amp; Audience Groups</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Use our 1-Click CSV/Excel upload wizard to import your customer numbers with automatic E.164 phone formatting.
              </p>
            </div>
            <div className="pt-4 mt-2 text-xs font-semibold text-[#581c87] group-hover:underline inline-flex items-center gap-1">
              <span>Open Contacts Directory &rarr;</span>
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
                    ✓ {activeWallet?.sms_credit_balance || 0} Credits Ready
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    Top Up Needed
                  </span>
                )}
              </div>
              <h3 className="font-bold text-sm text-zinc-900">Top Up SMS Units via M-PESA</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Fund your dual-channel wallet instantly via Safaricom M-PESA STK push to unlock message broadcasting.
              </p>
            </div>
            <div className="pt-4 mt-2 text-xs font-semibold text-[#581c87] group-hover:underline inline-flex items-center gap-1">
              <span>Top Up Balance &rarr;</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Ready to Broadcast CTA */}
      <div className="p-6 rounded-xl bg-purple-50/60 border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-[#581c87]">
            Ready to broadcast your first campaign?
          </h3>
          <p className="text-xs text-zinc-600 max-w-xl">
            Compose your message, inject dynamic tags like <code>&#123;first_name&#125;</code> or <code>&#123;balance&#125;</code>, preview on a smartphone mockup, and dispatch.
          </p>
        </div>
        <Link
          href="/business/sms/broadcast"
          className="py-2.5 px-5 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors shrink-0 text-center"
        >
          Launch SMS Broadcast &rarr;
        </Link>
      </div>

      {/* High-Converting SMS Templates Library */}
      <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-zinc-900">
            High-Converting Kenyan SMS Template Library
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Click &ldquo;Copy Template&rdquo; to paste directly into your campaign composer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sampleTemplates.map((tpl, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="font-bold text-xs text-zinc-900">{tpl.title}</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-[#581c87] border border-purple-200">
                    {tpl.category}
                  </span>
                </div>
                <p className="text-xs text-zinc-700 bg-white p-3 rounded-lg border border-zinc-200 font-mono leading-relaxed">
                  {tpl.text}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px] text-zinc-400">
                <span>~{tpl.chars} characters (1 SMS Unit)</span>
                <button
                  type="button"
                  onClick={() => handleCopyTemplate(tpl.text, idx)}
                  className="py-1 px-2.5 rounded text-[11px] font-semibold text-zinc-700 bg-white hover:bg-zinc-100 border border-zinc-200 transition-colors cursor-pointer"
                >
                  {copiedTemplateIdx === idx ? "✓ Copied!" : "Copy Template"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Regulatory Rules & Best Practices */}
      <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-zinc-900">
          Kenya Telecom Regulations &amp; Anti-Spam Compliance
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/40 space-y-1.5">
            <div className="font-bold text-zinc-900">⏰ Sending Window</div>
            <p className="text-zinc-600 leading-relaxed">
              Communications Authority (CA) regulations prohibit promotional SMS messages before <strong>7:00 AM</strong> and after <strong>8:00 PM</strong>. Transactional OTPs are exempt.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/40 space-y-1.5">
            <div className="font-bold text-zinc-900">🛑 Opt-Out Compliance</div>
            <p className="text-zinc-600 leading-relaxed">
              Recipients must have an active opt-out method. Our system automatically manages opt-in suppression lists when customers dial carrier opt-out codes.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/40 space-y-1.5">
            <div className="font-bold text-zinc-900">⚡ 160-Char Limit</div>
            <p className="text-zinc-600 leading-relaxed">
              A standard single SMS contains up to <strong>160 characters</strong>. Messages exceeding 160 characters concatenate into multi-part SMS (153 chars/segment).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
