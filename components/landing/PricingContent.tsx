/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useFetchPlans } from "@/hooks/plans/actions";
import { Plan } from "@/services/plans";

interface PlanItem {
  id: string;
  name: string;
  tagline: string;
  priceKesMonthly: number;
  priceKesAnnual: number;
  smsRateKes: number;
  emailRateKes: number;
  includedSms: number;
  includedEmail: number;
  maxContacts: string;
  senderIds: number;
  hasApi: boolean;
  hasSmpp: boolean;
  hasAutoresponders: boolean;
  hasDedicatedIp: boolean;
  supportTier: string;
  isPopular?: boolean;
  badge?: string;
  features: string[];
  ctaText: string;
  ctaHref: string;
}

const fallbackPlans: PlanItem[] = [
  {
    id: "starter",
    name: "Starter / PAYG",
    tagline: "Pay as you send with zero monthly commitment",
    priceKesMonthly: 0,
    priceKesAnnual: 0,
    smsRateKes: 0.65,
    emailRateKes: 0.06,
    includedSms: 0,
    includedEmail: 0,
    maxContacts: "5,000",
    senderIds: 0,
    hasApi: false,
    hasSmpp: false,
    hasAutoresponders: false,
    hasDedicatedIp: false,
    supportTier: "Standard Email Support",
    badge: "Unified Wallet",
    features: [
      "Unified wallet: 1 Credit = 1 SMS | 2 Credits = 1 WhatsApp",
      "Pay-as-you-go SMS at KSh 0.65 · WhatsApp at KSh 1.30",
      "Meta WhatsApp Business & Bulk SMS Composer",
      "Instant M-PESA top-ups (from KSh 100)",
      "Real-time delivery reports & Blue Ticks tracking",
      "Shared Alphanumeric Sender ID",
    ],
    ctaText: "Start Free / Top Up",
    ctaHref: "/auth/signup",
  },
  {
    id: "growth",
    name: "Business Growth",
    tagline: "Most popular for retail brands, clinics & modern SMEs",
    priceKesMonthly: 4999,
    priceKesAnnual: 4249, // 15% discount
    smsRateKes: 0.45,
    emailRateKes: 0.04,
    includedSms: 10000,
    includedEmail: 25000,
    maxContacts: "25,000",
    senderIds: 1,
    hasApi: false,
    hasSmpp: false,
    hasAutoresponders: true,
    hasDedicatedIp: false,
    supportTier: "Priority WhatsApp & Phone",
    isPopular: true,
    badge: "Most Popular",
    features: [
      "10,000 Unified Credits / mo (10,000 SMS or 5,000 WhatsApp)",
      "Discounted overage: KSh 0.45/SMS · KSh 0.90/WhatsApp",
      "Meta Cloud API broadcasts with rich flyers & CTA buttons",
      "1 Custom Alphanumeric Sender ID (Safaricom & Airtel)",
      "Real-time Blue Ticks (READ ✓✓) & DLR receipts",
      "Smart Contact Groups & dynamic tag interpolation",
      "Priority WhatsApp & phone support",
    ],
    ctaText: "Get Business Growth",
    ctaHref: "/auth/signup?plan=growth",
  },
  {
    id: "scale",
    name: "Scale & High-Volume",
    tagline: "For e-commerce, schools & multi-branch brands",
    priceKesMonthly: 18500,
    priceKesAnnual: 15725, // 15% discount
    smsRateKes: 0.38,
    emailRateKes: 0.03,
    includedSms: 45000,
    includedEmail: 100000,
    maxContacts: "100,000",
    senderIds: 3,
    hasApi: true,
    hasSmpp: false,
    hasAutoresponders: true,
    hasDedicatedIp: false,
    supportTier: "Priority WhatsApp & Phone",
    badge: "High Velocity",
    features: [
      "45,000 Unified Credits / mo (45,000 SMS or 22,500 WhatsApp)",
      "Volume rate: KSh 0.38/SMS · KSh 0.76/WhatsApp",
      "Up to 3 Custom Branded Sender IDs",
      "Meta WhatsApp Cloud API & REST API webhooks",
      "Automated WhatsApp & SMS keyword autoresponders",
      "Shopify & WooCommerce 1-click customer sync",
      "Dedicated account strategist",
    ],
    ctaText: "Scale Your Messaging",
    ctaHref: "/auth/signup?plan=scale",
  },
  {
    id: "enterprise",
    name: "Enterprise SLA",
    tagline: "Custom carrier & Meta infrastructure for enterprises",
    priceKesMonthly: 45000,
    priceKesAnnual: 38250,
    smsRateKes: 0.28,
    emailRateKes: 0.02,
    includedSms: 150000,
    includedEmail: 500000,
    maxContacts: "Unlimited",
    senderIds: 10,
    hasApi: true,
    hasSmpp: true,
    hasAutoresponders: true,
    hasDedicatedIp: true,
    supportTier: "Dedicated Account Strategist",
    badge: "Carrier Grade",
    features: [
      "150,000+ Unified Omnichannel Credits",
      "Tier-1 wholesale rate: From KSh 0.28/credit",
      "Direct Meta Cloud API & SMPP 3.4 server interconnect",
      "Dedicated IP & direct telecom carrier gateway",
      "Unlimited Contacts & Group Segments",
      "Custom SLA & 24/7 Phone NOC Escalation",
    ],
    ctaText: "Contact Enterprise Desk",
    ctaHref: "/contact",
  },
];

export function PricingContent() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual" | "payg">("monthly");
  const [currency, setCurrency] = useState<"KES" | "USD">("KES");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const KES_TO_USD = 130;

  const { data: dynamicPlansData } = useFetchPlans();

  const apiPlans: Plan[] = Array.isArray(dynamicPlansData)
    ? dynamicPlansData
    : dynamicPlansData && typeof dynamicPlansData === "object" && "results" in dynamicPlansData
    ? (dynamicPlansData as any).results
    : [];

  const plans: PlanItem[] =
    apiPlans.length > 0
      ? apiPlans.map((p) => {
          const discount = p.annual_discount_percent ?? 15;
          const monthlyPrice = Number(p.price_kes);
          const annualMonthlyPrice = Math.round(monthlyPrice * (1 - discount / 100));

          const supportTierLabel =
            p.support_tier === "PRIORITY_WHATSAPP"
              ? "Priority WhatsApp & Phone"
              : p.support_tier === "DEDICATED_MANAGER"
              ? "Dedicated Account Strategist"
              : p.support_tier === "COMMUNITY"
              ? "Community & FAQ"
              : "Standard Email Support";

          return {
            id: p.reference || p.code || p.id,
            name: p.name,
            tagline: p.tagline,
            priceKesMonthly: monthlyPrice,
            priceKesAnnual: annualMonthlyPrice,
            smsRateKes: Number(p.sms_rate_kes),
            emailRateKes: Number(p.email_rate_kes),
            includedSms: p.included_sms_credits,
            includedEmail: p.included_email_credits,
            maxContacts: p.max_contacts > 0 ? p.max_contacts.toLocaleString() : "Unlimited",
            senderIds: p.max_sender_ids,
            hasApi: Boolean(p.has_api_access),
            hasSmpp: Boolean(p.has_smpp_access),
            hasAutoresponders: Boolean(p.has_autoresponders),
            hasDedicatedIp: Boolean(p.has_dedicated_ip),
            supportTier: supportTierLabel,
            isPopular: p.is_featured,
            badge: p.badge_text || (p.is_featured ? "Most Popular" : undefined),
            features:
              p.features_list && p.features_list.length > 0
                ? p.features_list
                : [
                    `${p.sms_rate_kes} KES per SMS rate`,
                    `${p.included_sms_credits.toLocaleString()} Included SMS credits`,
                    p.has_api_access ? "REST API & Webhooks access" : "Standard dashboard access",
                    `${supportTierLabel} SLA`,
                  ],
            ctaText:
              p.category === "ENTERPRISE"
                ? "Contact Enterprise Desk"
                : monthlyPrice === 0
                ? "Start Free / Top Up"
                : `Get ${p.name}`,
            ctaHref:
              p.category === "ENTERPRISE"
                ? "/contact"
                : `/auth/signup?plan=${p.slug || p.code || p.reference}`,
          };
        })
      : fallbackPlans;

  const formatPrice = (kesAmount: number) => {
    if (kesAmount === 0) return "Free";
    if (currency === "KES") {
      return `KES ${kesAmount.toLocaleString()}`;
    }
    const usd = Math.round(kesAmount / KES_TO_USD);
    return `$${usd.toLocaleString()}`;
  };

  const pricingFaqs = [
    {
      q: "How does the unified credit wallet work for SMS and WhatsApp?",
      a: "One single wallet balance powers both Bulk SMS and Meta WhatsApp Business. 1 Credit sends 1 standard Bulk SMS (160 plain characters), and 2 Credits send 1 interactive WhatsApp marketing message (rich flyer image, catalog, and CTA buttons). When composing campaigns, the platform automatically calculates credit deduction so you never have to juggle multiple wallets.",
    },
    {
      q: "How does branding work on WhatsApp vs SMS Sender IDs? Do I need my own number?",
      a: "On Bulk SMS, you register an 11-character Alphanumeric Sender ID. On WhatsApp, we offer two flexible branding tiers: (1) Shared Agency Gateway (Starter & Business Growth): You can start broadcasting immediately without buying extra SIM cards or doing Meta paperwork. Inside the message, your brand name is prominently featured in the header, body copy, and interactive buttons linking to your website and your direct sales WhatsApp. (2) Dedicated Custom Sender Profile (Scale & Enterprise): We provision a dedicated WhatsApp number with your official company logo, bio, and business profile under our verified Meta WhatsApp Business Account.",
    },
    {
      q: "Do purchased credits ever expire?",
      a: "No. Prepaid SMS and WhatsApp credits purchased on LJK never expire as long as your account is active. You can top up anytime via M-PESA and use your balance whenever you need to send campaigns.",
    },
    {
      q: "How does the M-PESA top-up process work?",
      a: "You simply log into your business dashboard, enter the amount you want to top up (from KSh 100), and an M-PESA STK prompt appears on your phone. Once you enter your PIN, credits are instantly credited to your wallet in real time.",
    },
    {
      q: "What is a custom Alphanumeric Sender ID and how does vetting work?",
      a: "A Sender ID displays your exact verified brand name (up to 11 characters) on recipient handsets. LJK acts as your technical facilitator submitting documentation to the Communications Authority of Kenya (CAK) and carrier operators (24–72 hours). Final approval decisions reside with regulators with zero agency liability for carrier rejections.",
    },
    {
      q: "Who is responsible for opt-in consent and anti-spam compliance?",
      a: "Clients act as sole Data Controllers under the Kenya Data Protection Act 2019 and are required to hold explicit opt-in consent. LJK operates as a technical software gateway and holds zero liability for blocked messages resulting from client anti-spam violations.",
    },
    {
      q: "Can I switch between plans or downgrade anytime?",
      a: "Yes. You can upgrade, downgrade, or switch to Pay-As-You-Go at any time with zero penalties. Any unused credits in your account remain permanently available.",
    },
    {
      q: "Are there any hidden setup fees or maintenance charges?",
      a: "Zero hidden fees. You only pay for your active subscription tier or the exact units you purchase. Standard delivery reports, real-time Blue Ticks, CSV contact uploads, and dashboard tools are fully included.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Unified WhatsApp &amp; Bulk SMS Credit Wallet
          </span>
          <h1 className="text-xl font-semibold text-zinc-900 mt-4 mb-3 tracking-tight">
            Transparent Pricing for Meta WhatsApp Business &amp; Tier-1 Bulk SMS
          </h1>
          <p className="text-sm sm:text-base font-normal text-zinc-600 leading-relaxed">
            1 Credit = 1 Bulk SMS · 2 Credits = 1 WhatsApp Flyer. No surprise overages, no separate balances, and instant M-PESA top-ups that never expire.
          </p>

          {/* Billing Cycle & Currency Switcher Controls */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {/* Billing Toggle (Monthly / Annual / PAYG) */}
            <div className="inline-flex p-1 bg-zinc-100 border border-zinc-200 rounded">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-3.5 py-1.5 rounded text-xs font-semibold transition-colors ${
                  billingCycle === "monthly"
                    ? "bg-white text-[#581c87] shadow-xs"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                Monthly Bundles
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("annual")}
                className={`px-3.5 py-1.5 rounded text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  billingCycle === "annual"
                    ? "bg-white text-[#581c87] shadow-xs"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                <span>Annual</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">
                  Save 15%
                </span>
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("payg")}
                className={`px-3.5 py-1.5 rounded text-xs font-semibold transition-colors ${
                  billingCycle === "payg"
                    ? "bg-white text-[#581c87] shadow-xs"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                Pay-As-You-Go
              </button>
            </div>

            {/* Currency Toggle */}
            <div className="inline-flex p-1 bg-zinc-100 border border-zinc-200 rounded">
              <button
                type="button"
                onClick={() => setCurrency("KES")}
                className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                  currency === "KES"
                    ? "bg-white text-[#581c87] shadow-xs"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                KES (KSh)
              </button>
              <button
                type="button"
                onClick={() => setCurrency("USD")}
                className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                  currency === "USD"
                    ? "bg-white text-[#581c87] shadow-xs"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                USD ($)
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {plans.map((plan) => {
            const rawPrice =
              billingCycle === "annual"
                ? plan.priceKesAnnual
                : plan.priceKesMonthly;
            const isPayg = plan.id === "starter" || billingCycle === "payg";

            return (
              <div
                key={plan.id}
                className={`bg-white border rounded p-6 flex flex-col justify-between transition-all duration-200 shadow-xs relative ${
                  plan.isPopular
                    ? "border-[#581c87] ring-1 ring-[#581c87]"
                    : "border-zinc-200 hover:border-zinc-300"
                }`}
              >
                {/* Popular / Feature Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded shadow-xs ${
                        plan.isPopular
                          ? "bg-[#581c87] text-white"
                          : "bg-zinc-800 text-zinc-100"
                      }`}
                    >
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div>
                  {/* Card Header */}
                  <div className="mb-4">
                    <h2 className="text-base font-semibold text-zinc-900 mb-1">
                      {plan.name}
                    </h2>
                    <p className="text-xs font-normal text-zinc-500 min-h-[32px] leading-relaxed">
                      {plan.tagline}
                    </p>
                  </div>

                  {/* Price Display */}
                  <div className="mb-6 pb-6 border-b border-zinc-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-semibold text-zinc-900 tracking-tight">
                        {isPayg ? "PAYG" : formatPrice(rawPrice)}
                      </span>
                      {!isPayg && (
                        <span className="text-xs font-normal text-zinc-500">
                          / month
                        </span>
                      )}
                    </div>
                    {!isPayg && billingCycle === "annual" && (
                      <p className="text-[11px] text-emerald-700 font-medium mt-1">
                        Billed annually (Save 15%)
                      </p>
                    )}
                    {isPayg && (
                      <p className="text-[11px] text-zinc-500 mt-1">
                        Top up from KSh 100 via M-PESA
                      </p>
                    )}
                  </div>

                  {/* Telecom Unit Rates Matrix Snippet */}
                  <div className="bg-zinc-50 rounded p-3 mb-6 space-y-2 text-xs border border-zinc-100">
                    <div className="flex justify-between items-center text-zinc-600">
                      <span>SMS Unit Rate</span>
                      <span className="font-semibold text-zinc-900">
                        KSh {plan.smsRateKes.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-zinc-600">
                      <span>Email Unit Rate</span>
                      <span className="font-semibold text-zinc-900">
                        KSh {plan.emailRateKes.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-zinc-600 pt-1 border-t border-zinc-200/60">
                      <span>Monthly Included SMS</span>
                      <span className="font-semibold text-[#581c87]">
                        {plan.includedSms > 0
                          ? `${plan.includedSms.toLocaleString()} SMS`
                          : "0 (PAYG)"}
                      </span>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2.5 mb-6 text-xs text-zinc-600">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                      Included Capabilities
                    </div>
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2">
                        <svg
                          className="w-3.5 h-3.5 text-[#581c87] shrink-0 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card CTA Button */}
                <div className="pt-4 border-t border-zinc-100">
                  <Link
                    href={plan.ctaHref}
                    className={`w-full inline-flex items-center justify-center py-2.5 px-4 rounded text-xs font-semibold transition-colors text-center ${
                      plan.isPopular
                        ? "bg-[#581c87] hover:bg-[#4a1572] text-white shadow-xs"
                        : "bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-200"
                    }`}
                  >
                    {plan.ctaText}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Feature Comparison Matrix Table */}
        <div className="bg-zinc-50 border border-zinc-200 rounded p-6 sm:p-8 mb-16 shadow-xs">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-zinc-900">
              Detailed Plan &amp; Feature Comparison
            </h2>
            <p className="text-xs font-normal text-zinc-500 mt-0.5">
              Compare technical limits, API capabilities, and carrier routing specifications across all tiers.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[640px]">
              <thead>
                <tr className="border-b border-zinc-200 text-zinc-500 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold w-1/4">Feature / Metric</th>
                  {plans.map((p) => (
                    <th
                      key={p.id}
                      className={`pb-3 font-semibold ${
                        p.isPopular ? "text-[#581c87] font-bold" : "text-zinc-700"
                      }`}
                    >
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/70 text-zinc-700">
                <tr>
                  <td className="py-3 font-medium text-zinc-900">Base SMS Rate (KES)</td>
                  {plans.map((p) => (
                    <td
                      key={p.id}
                      className={`py-3 ${p.isPopular ? "font-semibold text-[#581c87]" : ""}`}
                    >
                      {p.smsRateKes > 0 ? `KSh ${p.smsRateKes.toFixed(2)} / SMS` : "Free"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 font-medium text-zinc-900">Monthly Included SMS</td>
                  {plans.map((p) => (
                    <td
                      key={p.id}
                      className={`py-3 ${p.isPopular ? "font-semibold text-[#581c87]" : ""}`}
                    >
                      {p.includedSms > 0 ? `${p.includedSms.toLocaleString()} SMS` : "—"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 font-medium text-zinc-900">Monthly Included Emails</td>
                  {plans.map((p) => (
                    <td key={p.id} className="py-3">
                      {p.includedEmail > 0 ? `${p.includedEmail.toLocaleString()} Emails` : "—"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 font-medium text-zinc-900">Max Contacts Storage</td>
                  {plans.map((p) => (
                    <td
                      key={p.id}
                      className={`py-3 ${p.maxContacts === "Unlimited" ? "font-semibold text-[#581c87]" : ""}`}
                    >
                      {p.maxContacts}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 font-medium text-zinc-900">Custom Branded Sender ID</td>
                  {plans.map((p) => (
                    <td key={p.id} className="py-3">
                      {p.senderIds > 0 ? `${p.senderIds} Included` : "Shared"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 font-medium text-zinc-900">REST API &amp; Webhooks</td>
                  {plans.map((p) => (
                    <td
                      key={p.id}
                      className={`py-3 ${p.hasApi ? "font-semibold text-[#581c87]" : ""}`}
                    >
                      {p.hasApi ? (p.hasSmpp ? "REST + SMPP 3.4" : "Full API Access") : "—"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 font-medium text-zinc-900">2-Way Autoresponders</td>
                  {plans.map((p) => (
                    <td key={p.id} className="py-3">
                      {p.hasAutoresponders ? "✓ Included" : "—"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 font-medium text-zinc-900">Carrier Interconnects</td>
                  {plans.map((p) => (
                    <td key={p.id} className="py-3">
                      {p.hasDedicatedIp ? "Dedicated Direct IP" : "Safaricom & Airtel"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 font-medium text-zinc-900">Support Tier SLA</td>
                  {plans.map((p) => (
                    <td key={p.id} className="py-3">
                      {p.supportTier || "Standard Support"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 font-medium text-zinc-900">M-PESA Instant Top-Up</td>
                  {plans.map((p) => (
                    <td key={p.id} className="py-3">
                      ✓ Instant
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* M-PESA & Enterprise Banner */}
        <div className="bg-purple-950 text-white rounded p-6 sm:p-8 mb-16 flex flex-col md:flex-row items-center justify-between gap-6" style={{ backgroundColor: "#3b0764" }}>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-300 bg-white/10 px-2.5 py-0.5 rounded">
              Kenyan M-PESA &amp; Banking Integrations
            </span>
            <h2 className="text-lg font-semibold text-white mt-2 mb-1">
              Need custom high-volume pricing or post-paid enterprise billing?
            </h2>
            <p className="text-xs font-normal text-purple-200 max-w-xl leading-relaxed">
              We provide tailored telecom rates for SACCOs, hospitals, schools, and FinTechs sending
              over 200,000 messages monthly with dedicated account SLA.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center bg-white text-[#581c87] hover:bg-purple-50 px-5 py-2.5 rounded text-xs font-semibold transition-colors"
            >
              Create Free Account
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center border border-white/30 text-white hover:bg-white/10 px-5 py-2.5 rounded text-xs font-medium transition-colors"
            >
              Contact Sales NOC
            </Link>
          </div>
        </div>

        {/* Pricing FAQs */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-base font-semibold text-zinc-900">
              Frequently Asked Questions About Billing &amp; Credits
            </h2>
            <p className="text-xs font-normal text-zinc-500 mt-0.5">
              Clear answers on rates, M-PESA top-ups, and sender ID registration.
            </p>
          </div>

          <div className="space-y-3">
            {pricingFaqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-zinc-200 rounded overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-5 py-3.5 text-left flex items-center justify-between gap-4 focus:outline-hidden hover:bg-zinc-50/70"
                    aria-expanded={isOpen}
                  >
                    <span className="text-xs font-semibold text-zinc-900">
                      {faq.q}
                    </span>
                    <span
                      className={`shrink-0 w-5 h-5 rounded bg-purple-50 border border-purple-200 text-[#581c87] flex items-center justify-center text-[10px] font-semibold transition-transform duration-200 ${
                        isOpen ? "rotate-180 bg-[#581c87] text-white border-[#581c87]" : ""
                      }`}
                    >
                      ↓
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-4 pt-1 text-xs font-normal text-zinc-600 leading-relaxed border-t border-zinc-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default PricingContent;
