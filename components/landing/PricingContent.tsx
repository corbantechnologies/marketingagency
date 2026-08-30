"use client";

import React, { useState } from "react";
import Link from "next/link";

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
  isPopular?: boolean;
  badge?: string;
  features: string[];
  ctaText: string;
  ctaHref: string;
}

export function PricingContent() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual" | "payg">("monthly");
  const [currency, setCurrency] = useState<"KES" | "USD">("KES");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const KES_TO_USD = 130;

  const plans: PlanItem[] = [
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
      badge: "No Expiry",
      features: [
        "Pay-as-you-go SMS at KSh 0.65/SMS",
        "Instant M-PESA top-ups (from KSh 100)",
        "1-click Excel/CSV contact import",
        "Shared Alphanumeric Sender ID",
        "Standard delivery reports (DLR)",
        "Email & Community support",
      ],
      ctaText: "Start Free / Top Up",
      ctaHref: "/auth/signup",
    },
    {
      id: "growth",
      name: "Business Growth",
      tagline: "Most popular for retail shops, salons & clinics",
      priceKesMonthly: 4999,
      priceKesAnnual: 4249, // 15% discount
      smsRateKes: 0.45,
      emailRateKes: 0.04,
      includedSms: 10000,
      includedEmail: 25000,
      maxContacts: "25,000",
      senderIds: 1,
      isPopular: true,
      badge: "Most Popular",
      features: [
        "10,000 Included SMS credits / month",
        "Discounted rate: KSh 0.45 per extra SMS",
        "1 Custom Alphanumeric Sender ID",
        "Smart Contact Groups & Tagging",
        "Dynamic SMS links & click tracking",
        "Scheduled birthday & holiday campaigns",
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
      badge: "High Velocity",
      features: [
        "45,000 Included SMS credits / month",
        "Volume rate: KSh 0.38 per extra SMS",
        "Up to 3 Custom Branded Sender IDs",
        "REST API keys & Webhook callbacks",
        "2-Way SMS keyword autoresponders",
        "Shopify & WooCommerce 1-click sync",
        "Dedicated account strategist",
      ],
      ctaText: "Scale Your Messaging",
      ctaHref: "/auth/signup?plan=scale",
    },
    {
      id: "enterprise",
      name: "Enterprise SLA",
      tagline: "Custom carrier infrastructure for banks & FinTechs",
      priceKesMonthly: 45000,
      priceKesAnnual: 38250,
      smsRateKes: 0.28,
      emailRateKes: 0.02,
      includedSms: 150000,
      includedEmail: 500000,
      maxContacts: "Unlimited",
      senderIds: 10,
      badge: "Carrier Grade",
      features: [
        "150,000+ Included SMS credits",
        "Tier-1 wholesale rate: From KSh 0.28/SMS",
        "Dedicated SMPP 3.4 server interconnect",
        "Sub-1.8s transactional OTP latency SLA",
        "Dedicated IP warming & DMARC alignment",
        "Custom billing terms & post-paid invoicing",
        "24/7 Priority Emergency NOC line",
      ],
      ctaText: "Contact Enterprise Desk",
      ctaHref: "#contact-enterprise",
    },
  ];

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
      q: "Do purchased SMS credits ever expire?",
      a: "No. Prepaid SMS and Email credits purchased on LJK never expire. You can top up anytime via M-PESA and use your balance whenever you need to send campaigns.",
    },
    {
      q: "How does the M-PESA top-up process work?",
      a: "You simply log into your business dashboard, enter the amount you want to top up (from KSh 100), and an M-PESA STK prompt appears on your phone. Once you enter your PIN, credits are instantly credited to your wallet in real time.",
    },
    {
      q: "What is a custom Alphanumeric Sender ID and how do I get one?",
      a: "A Sender ID displays your exact brand name (e.g. 'YOURBRAND', up to 11 characters) on your recipient's handset instead of a random number. We assist with carrier regulator approval within 24 to 48 hours.",
    },
    {
      q: "Can I switch between plans or downgrade anytime?",
      a: "Yes. You can upgrade, downgrade, or switch to Pay-As-You-Go at any time with zero penalties. Any unused credits in your account remain permanently available.",
    },
    {
      q: "Are there any hidden setup fees or maintenance charges?",
      a: "Zero hidden fees. You only pay for your active subscription tier or the exact SMS/Email units you purchase. Standard delivery reports, CSV contact uploads, and dashboard tools are fully included.",
    },
  ];

  return (
    <div className="bg-white py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title & Subtitle */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-purple-50 border border-purple-200 text-xs font-semibold text-[#581c87] mb-3">
            Transparent Pricing & Wholesale Telecom Rates
          </div>
          <h1 className="text-xl font-semibold text-zinc-900 tracking-tight mb-3">
            Simple, High-ROI Plans Built for Kenyan Businesses & Enterprises
          </h1>
          <p className="text-base font-normal text-zinc-600">
            From zero-fee pay-as-you-go top-ups for shops and clinics, to high-volume SMPP routes for
            enterprises. Tier-1 direct delivery with no expiring credits.
          </p>

          {/* Toggles: Billing Cycle + Currency */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            
            {/* Billing Cycle Selector */}
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

        {/* 4 Pricing Cards Grid */}
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

                  {/* Price Tag */}
                  <div className="my-5 pb-5 border-b border-zinc-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-semibold text-zinc-900">
                        {isPayg ? "KSh 0" : formatPrice(rawPrice)}
                      </span>
                      {!isPayg && (
                        <span className="text-xs font-normal text-zinc-500">
                          {billingCycle === "annual" ? "/mo (billed yearly)" : "/month"}
                        </span>
                      )}
                    </div>
                    {currency === "KES" && !isPayg && rawPrice > 0 && (
                      <span className="text-[11px] text-zinc-400 block mt-0.5">
                        (~ ${Math.round(rawPrice / KES_TO_USD)} USD)
                      </span>
                    )}
                  </div>

                  {/* Unit Rate Highlights */}
                  <div className="p-3 bg-purple-50/50 border border-purple-100 rounded mb-6 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-600 font-medium">SMS Unit Rate:</span>
                      <span className="font-semibold text-[#581c87]">
                        KSh {plan.smsRateKes.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-600 font-medium">Included SMS:</span>
                      <span className="font-semibold text-zinc-900">
                        {plan.includedSms > 0 ? plan.includedSms.toLocaleString() : "Pay As You Go"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-600 font-medium">Sender ID:</span>
                      <span className="font-semibold text-zinc-900">
                        {plan.senderIds > 0 ? `${plan.senderIds} Custom Name` : "Shared Alphanumeric"}
                      </span>
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-2.5 mb-6 text-xs text-zinc-600">
                    <div className="font-semibold text-zinc-800 text-[11px] uppercase tracking-wider mb-2">
                      Plan Inclusions:
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

        {/* Feature Comparison Matrix Table */}
        <div className="bg-zinc-50 border border-zinc-200 rounded p-6 sm:p-8 mb-16 shadow-xs">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-zinc-900">
              Detailed Plan & Feature Comparison
            </h2>
            <p className="text-xs font-normal text-zinc-500 mt-0.5">
              Compare technical limits, API capabilities, and carrier routing specifications across all tiers.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-200 text-zinc-500 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold">Feature / Metric</th>
                  <th className="pb-3 font-semibold">Starter / PAYG</th>
                  <th className="pb-3 font-semibold text-[#581c87]">Business Growth</th>
                  <th className="pb-3 font-semibold">Scale</th>
                  <th className="pb-3 font-semibold">Enterprise SLA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/70 text-zinc-700">
                <tr>
                  <td className="py-3 font-medium text-zinc-900">Base Unit Rate (KES)</td>
                  <td className="py-3">KSh 0.65 / SMS</td>
                  <td className="py-3 font-semibold text-[#581c87]">KSh 0.45 / SMS</td>
                  <td className="py-3 font-semibold">KSh 0.38 / SMS</td>
                  <td className="py-3 font-semibold text-emerald-700">KSh 0.28 – 0.35 / SMS</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-zinc-900">Monthly Included SMS</td>
                  <td className="py-3">—</td>
                  <td className="py-3 font-medium">10,000 SMS</td>
                  <td className="py-3 font-medium">45,000 SMS</td>
                  <td className="py-3 font-medium">150,000+ SMS</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-zinc-900">Max Contacts Storage</td>
                  <td className="py-3">5,000</td>
                  <td className="py-3">25,000</td>
                  <td className="py-3">100,000</td>
                  <td className="py-3 font-semibold text-[#581c87]">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-zinc-900">Custom Branded Sender ID</td>
                  <td className="py-3">Shared</td>
                  <td className="py-3">1 Included</td>
                  <td className="py-3">3 Included</td>
                  <td className="py-3">Custom / Dedicated</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-zinc-900">REST API & Webhooks</td>
                  <td className="py-3">—</td>
                  <td className="py-3">—</td>
                  <td className="py-3 font-semibold text-[#581c87]">Full API Access</td>
                  <td className="py-3 font-semibold text-[#581c87]">REST + SMPP 3.4</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-zinc-900">2-Way Autoresponders</td>
                  <td className="py-3">—</td>
                  <td className="py-3">Basic</td>
                  <td className="py-3 font-medium">Advanced Rules</td>
                  <td className="py-3 font-semibold text-[#581c87]">Custom AI Bots</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-zinc-900">Carrier Interconnects</td>
                  <td className="py-3">Safaricom & Airtel</td>
                  <td className="py-3">Safaricom & Airtel</td>
                  <td className="py-3">Multi-Carrier Failover</td>
                  <td className="py-3 font-semibold text-[#581c87]">Dedicated Direct Routes</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-zinc-900">M-PESA Instant Top-Up</td>
                  <td className="py-3">✓ Instant</td>
                  <td className="py-3">✓ Instant</td>
                  <td className="py-3">✓ Instant</td>
                  <td className="py-3">✓ Invoicing & Post-paid</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* M-PESA & Enterprise Banner */}
        <div className="bg-purple-950 text-white rounded p-6 sm:p-8 mb-16 flex flex-col md:flex-row items-center justify-between gap-6" style={{ backgroundColor: "#3b0764" }}>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-300 bg-white/10 px-2.5 py-0.5 rounded">
              Kenyan M-PESA & Banking Integrations
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
            <a
              href="mailto:growth@ljkmarketingagency.co.ke"
              className="inline-flex items-center justify-center border border-white/30 text-white hover:bg-white/10 px-5 py-2.5 rounded text-xs font-medium transition-colors"
            >
              Contact Sales NOC
            </a>
          </div>
        </div>

        {/* Pricing FAQs */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-base font-semibold text-zinc-900">
              Frequently Asked Questions About Billing & Credits
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
    </div>
  );
}
