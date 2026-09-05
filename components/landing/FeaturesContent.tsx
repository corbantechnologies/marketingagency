"use client";

import React, { useState } from "react";
import Link from "next/link";

export function FeaturesContent() {
  const [activeIndustry, setActiveIndustry] = useState<number>(0);

  const coreFeatures = [
    {
      icon: (
        <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.301-.15-1.781-.879-2.057-.98-.276-.1-.477-.15-.678.15-.2.301-.777.98-.953 1.18-.176.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.896-.799-1.501-1.787-1.677-2.088-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.176.2-.301.301-.502.1-.201.05-.377-.025-.527-.075-.15-.678-1.634-.929-2.237-.244-.588-.493-.509-.678-.518-.176-.009-.377-.009-.578-.009s-.527.075-.803.377c-.276.301-1.054 1.03-1.054 2.512s1.079 2.914 1.23 3.115c.15.201 2.122 3.24 5.141 4.544.718.31 1.279.496 1.716.635.722.23 1.379.197 1.898.12.578-.087 1.781-.728 2.032-1.431.251-.703.251-1.305.176-1.431-.075-.126-.276-.201-.577-.351z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.119.553 4.11 1.523 5.836L.055 23.518l5.882-1.446A11.936 11.936 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.854 0-3.593-.505-5.092-1.385l-.365-.215-3.784.931.947-3.69-.236-.376C2.518 15.736 2 13.929 2 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10z" />
        </svg>
      ),
      title: "Meta WhatsApp Cloud API Engine",
      badge: "98% Open Rate",
      description:
        "Official Meta Cloud API integration for Kenya and East Africa. Broadcast high-resolution promotional image flyers, PDF catalogs, and interactive CTA buttons directly to your customer's WhatsApp inbox.",
      highlights: [
        "Interactive buttons ([Buy Now], [Chat on WhatsApp])",
        "Real-time Blue Ticks delivery & read reports (READ ✓✓)",
        "Zero telecom alphanumeric registration delay",
      ],
    },
    {
      icon: (
        <svg className="w-6 h-6 text-[#581c87]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      ),
      title: "Telco-Grade Bulk SMS Engine",
      badge: "1,000+ SMS / sec",
      description:
        "Direct Tier-1 carrier interconnects with Safaricom and Airtel Kenya. Guaranteed sub-3-second handset delivery latency with real-time Delivery Reports (DLR) and automatic fallback.",
      highlights: [
        "GSM 03.38 160-char & concatenated messaging",
        "Automated DND / opt-out suppression filtering",
        "Instant delivery receipt callbacks & timestamps",
      ],
    },
    {
      icon: (
        <svg className="w-6 h-6 text-[#581c87]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      title: "Alphanumeric Brand Sender IDs",
      badge: "CA Verified",
      description:
        "Establish immediate trust by displaying your official registered business name (e.g. YOURBRAND) instead of generic digits on recipient mobile handsets.",
      highlights: [
        "Fast-track whitelisting with Safaricom & Airtel",
        "Simultaneous submission to all Kenyan carriers",
        "Compliant with Communications Authority (CA) rules",
      ],
    },
    {
      icon: (
        <svg className="w-6 h-6 text-[#581c87]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Smart Segmentation & Dynamic Tags",
      badge: "1-Click CSV Import",
      description:
        "Segment your audience into targeted buckets and dynamically personalize messages with tags like {first_name}, {balance}, or {due_date}.",
      highlights: [
        "Automated E.164 phone sanitization (+254)",
        "Spreadsheet column auto-mapping wizard",
        "Unlimited custom key-value metadata tags",
      ],
    },
    {
      icon: (
        <svg className="w-6 h-6 text-[#581c87]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      title: "Unified M-PESA Wallet (SMS + WhatsApp)",
      badge: "Zero Delay",
      description:
        "Fund your unified credit wallet anytime in KES via Safaricom Daraja M-PESA STK push. 1 Credit = 1 SMS, 2 Credits = 1 WhatsApp flyer. Credits never expire.",
      highlights: [
        "Instant credit allocation upon PIN entry",
        "Automated PDF tax invoices & receipts",
        "One unified wallet for both SMS & WhatsApp campaigns",
      ],
    },
    {
      icon: (
        <svg className="w-6 h-6 text-[#581c87]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: "High-Inbox Email Infrastructure",
      badge: "Resend Powered",
      description:
        "Send transactional notifications and marketing newsletters with 99.8% inbox placement, DKIM/SPF domain verification, and rich analytics.",
      highlights: [
        "White-label custom sending domain (SPF/DKIM/DMARC)",
        "Batch email sending API (up to 100/req)",
        "Live open, click, bounce, and complaint telemetry",
      ],
    },
    {
      icon: (
        <svg className="w-6 h-6 text-[#581c87]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      title: "Developer REST API & Webhooks",
      badge: "SMPP & REST",
      description:
        "Integrate bulk messaging into your web app, ERP, or CRM in minutes using our clean JSON REST APIs and real-time webhook callbacks.",
      highlights: [
        "REST API with JWT & Bearer API key authentication",
        "SMPP v3.4 direct gateway interconnect",
        "Webhooks for instant delivery report events",
      ],
    },
  ];

  const industryUseCases = [
    {
      name: "E-Commerce & Retail",
      icon: "🛍️",
      headline: "Drive flash sales and keep buyers informed at every milestone.",
      points: [
        "Order dispatch notifications and live tracking links.",
        "Flash sale & holiday discount promo campaigns.",
        "Abandoned checkout SMS recovery with 45%+ open rates.",
      ],
      sampleSMS: "Hi Sarah, your order #8921 from ShopKenya has been dispatched! Track delivery here: https://trk.co.ke/8921",
    },
    {
      name: "Fintech, SACCOs & Microfinance",
      icon: "💳",
      headline: "Secure, low-latency OTPs and automated loan repayment alerts.",
      points: [
        "Sub-2s 2FA OTP verification passwords for login security.",
        "Automated loan balance & monthly installment reminders.",
        "Instant transaction receipts following M-PESA deposits.",
      ],
      sampleSMS: "Dear David, your account balance of KES 4,500 for loan #LN-901 is due on 31st Aug. Pay via Paybill 889900.",
    },
    {
      name: "Schools & Educational Institutions",
      icon: "🎓",
      headline: "Instant communication with parents, staff, and students.",
      points: [
        "Term opening/closing circulars and meeting alerts.",
        "Automated school fee balance reminders with dynamic tags.",
        "Urgent emergency alerts and bus departure notifications.",
      ],
      sampleSMS: "Dear Parent, school reopens on Tuesday 8 AM. Outstanding fee balance for Kevin is KES 12,000. School Admin.",
    },
    {
      name: "Healthcare & Diagnostics",
      icon: "🏥",
      headline: "Reduce clinic no-shows and deliver timely health updates.",
      points: [
        "Doctor appointment booking confirmations and reminders.",
        "Lab test results readiness notifications.",
        "Prescription refill alerts and wellness health tips.",
      ],
      sampleSMS: "Hello Mary, your doctor consultation at Premier Clinic is confirmed for tomorrow at 2:30 PM. See you soon!",
    },
  ];

  return (
    <div className="space-y-20 py-12 sm:py-16">
      {/* 1. Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-purple-50 text-[#581c87] border border-purple-200">
          <span className="w-2 h-2 rounded-full bg-[#581c87] animate-pulse" />
          <span>Complete Enterprise Messaging Capabilities</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-zinc-900 tracking-tight max-w-4xl mx-auto leading-[1.15]">
          Engineered for High-Throughput Business Messaging &amp; Growth
        </h1>

        <p className="text-sm sm:text-lg text-zinc-600 max-w-2xl mx-auto leading-relaxed">
          Everything your business needs to deliver instantaneous OTPs, broadcast promotional campaigns with custom Sender IDs, and automate customer engagement across Kenya.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/auth/signup"
            className="py-3 px-6 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all hover:scale-[1.02]"
          >
            Create Free Business Workspace &rarr;
          </Link>
          <Link
            href="/pricing"
            className="py-3 px-6 bg-white hover:bg-zinc-50 text-zinc-800 text-xs sm:text-sm font-bold rounded-xl border border-zinc-300 shadow-2xs transition-colors"
          >
            View Pricing &amp; Rates
          </Link>
        </div>
      </section>

      {/* 2. Key Metrics Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-zinc-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center border border-zinc-800">
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400">99.98%</div>
            <div className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mt-1">Gateway Uptime</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">Direct telco redundancy</div>
          </div>

          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-purple-400">&lt; 2.5s</div>
            <div className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mt-1">Delivery Latency</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">Average handset arrival</div>
          </div>

          <div>
            <div className="text-xl font-semibold text-white">Direct Carriers</div>
            <div className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mt-1">Telco Coverage</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Safaricom &amp; Airtel Networks</div>
          </div>

          <div>
            <div className="text-xl font-semibold text-amber-400">CA Verified</div>
            <div className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mt-1">Compliance</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Regulatory approved</div>
          </div>
        </div>
      </section>

      {/* 3. Core Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
            Six Pillars of Enterprise Messaging
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 max-w-xl mx-auto">
            Built from the ground up for high reliability, strict telco compliance, and effortless campaign management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreFeatures.map((feat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs flex flex-col justify-between hover:border-purple-300 hover:shadow-md transition-all group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center group-hover:bg-[#581c87] group-hover:text-white transition-colors">
                    {feat.icon}
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-700 border border-zinc-200">
                    {feat.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-zinc-900 group-hover:text-[#581c87] transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-zinc-600 mt-1.5 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-100 space-y-1.5">
                  {feat.highlights.map((item, hIdx) => (
                    <div key={hIdx} className="flex items-center gap-2 text-[11px] text-zinc-600">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3.5 WhatsApp Sender Branding Architecture Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
            <span>Official Meta Cloud API Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
            How WhatsApp Branding Works for Your Business
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 max-w-2xl mx-auto">
            Unlike SMS where you register an 11-character alphanumeric header, WhatsApp delivers rich, verified profiles with dynamic interactive action buttons.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Tier 1 Card */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-[#581c87] border border-purple-200">
                  Starter &amp; Business Growth Plans
                </span>
                <span className="text-xs font-semibold text-emerald-600">Instant Setup (0 Days)</span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-zinc-900">
                  Tier 1: Shared Verified Agency Gateway
                </h3>
                <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                  Best for solo entrepreneurs and SMEs who want to start broadcasting immediately without buying extra SIM cards or going through 14-day telecom and Meta paperwork.
                </p>
              </div>

              <div className="space-y-2 pt-2 text-xs text-zinc-700">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Dispatched via:</strong> Corban Technologies / LJK Agency Verified Route</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>100% Tenant Branded:</strong> Dynamic header, flyer image, and custom copy</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Direct Action Buttons:</strong> Instant links to your store &amp; your sales WhatsApp</span>
                </div>
              </div>

              {/* Realistic Mockup for Tier 1 */}
              <div className="mt-4 p-4 rounded-xl bg-[#0b141a] text-white shadow-inner border border-zinc-800">
                <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-800 text-xs">
                  <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-xs">
                    CT
                  </div>
                  <div>
                    <div className="font-bold text-emerald-400 flex items-center gap-1">
                      <span>Corban Technologies</span>
                      <span className="text-[10px] text-emerald-300 bg-emerald-950 px-1 rounded">Verified</span>
                    </div>
                    <div className="text-[10px] text-zinc-400">via LJK Marketing Gateway</div>
                  </div>
                </div>

                <div className="pt-3">
                  <div className="bg-[#005c4b] p-3 rounded-xl rounded-tl-none text-xs text-zinc-100 space-y-2">
                    <div className="font-bold text-amber-300 text-[11px]">
                      🛍️ Nairobi Fresh Grocers Exclusive Offer
                    </div>
                    <p className="text-[11px] leading-relaxed text-zinc-200">
                      Hi Sarah! Nairobi Fresh Grocers is offering 20% off all organic dairy &amp; fresh produce this weekend. Show this voucher at checkout: <strong>FRESH20</strong>.
                    </p>
                    <div className="text-[9px] text-zinc-300 text-right flex items-center justify-end gap-1">
                      <span>12:45 PM</span>
                      <span className="text-sky-400 font-bold">✓✓</span>
                    </div>
                  </div>

                  <div className="mt-2 space-y-1.5">
                    <div className="w-full py-1.5 bg-[#1f2c34] hover:bg-[#2a3942] text-sky-400 text-center text-xs font-semibold rounded-lg border border-zinc-700 flex items-center justify-center gap-1.5">
                      <span>🌐 Visit FreshGrocers.co.ke</span>
                    </div>
                    <div className="w-full py-1.5 bg-[#1f2c34] hover:bg-[#2a3942] text-emerald-400 text-center text-xs font-semibold rounded-lg border border-zinc-700 flex items-center justify-center gap-1.5">
                      <span>💬 Chat with Sales (+254 7XX...)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100 mt-4">
              <span className="text-[11px] text-zinc-500 font-medium">Included automatically in Starter &amp; Business Growth plans</span>
            </div>
          </div>

          {/* Tier 2 Card */}
          <div className="bg-white rounded-2xl border-2 border-purple-200 p-6 sm:p-8 shadow-md flex flex-col justify-between hover:border-[#581c87] transition-all relative">
            <div className="absolute -top-3 right-6">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-[#581c87] text-white uppercase tracking-wider shadow-sm">
                Scale &amp; Enterprise Retainers
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Dedicated Brand Identity
                </span>
                <span className="text-xs font-semibold text-purple-600">Enterprise SLA</span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-zinc-900">
                  Tier 2: Dedicated Custom WhatsApp Sender
                </h3>
                <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                  Engineered for corporate enterprises, multi-branch retailers, and schools who require their own official WhatsApp Business profile, company logo, and bio.
                </p>
              </div>

              <div className="space-y-2 pt-2 text-xs text-zinc-700">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Own Sender Profile:</strong> Your brand logo, bio, catalog &amp; opening hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Multi-Number WABA:</strong> Dedicated SIM or virtual line assigned to your workspace</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>Official Green Tick:</strong> Fast-track Meta Official Business Account (OBA) review</span>
                </div>
              </div>

              {/* Realistic Mockup for Tier 2 */}
              <div className="mt-4 p-4 rounded-xl bg-[#0b141a] text-white shadow-inner border border-purple-900/40">
                <div className="flex items-center gap-2.5 pb-3 border-b border-zinc-800 text-xs">
                  <div className="w-8 h-8 rounded-full bg-[#581c87] flex items-center justify-center font-bold text-xs text-white">
                    NF
                  </div>
                  <div>
                    <div className="font-bold text-white flex items-center gap-1">
                      <span>Nairobi Fresh Supermarkets</span>
                      <span className="text-emerald-400 text-xs">✓</span>
                    </div>
                    <div className="text-[10px] text-zinc-400">Official WhatsApp Business Account</div>
                  </div>
                </div>

                <div className="pt-3">
                  <div className="bg-[#005c4b] p-3 rounded-xl rounded-tl-none text-xs text-zinc-100 space-y-2">
                    <div className="font-bold text-emerald-200 text-[11px]">
                      Weekly Branch Newsletter &bull; Westlands &amp; Kilimani
                    </div>
                    <p className="text-[11px] leading-relaxed text-zinc-200">
                      Dear Valued Customer, your monthly loyalty statement is ready. You have earned 450 bonus points redeemable at any checkout till.
                    </p>
                    <div className="text-[9px] text-zinc-300 text-right flex items-center justify-end gap-1">
                      <span>09:15 AM</span>
                      <span className="text-sky-400 font-bold">✓✓</span>
                    </div>
                  </div>

                  <div className="mt-2 space-y-1.5">
                    <div className="w-full py-1.5 bg-[#1f2c34] hover:bg-[#2a3942] text-sky-400 text-center text-xs font-semibold rounded-lg border border-zinc-700 flex items-center justify-center gap-1.5">
                      <span>📄 View PDF Statement</span>
                    </div>
                    <div className="w-full py-1.5 bg-[#1f2c34] hover:bg-[#2a3942] text-emerald-400 text-center text-xs font-semibold rounded-lg border border-zinc-700 flex items-center justify-center gap-1.5">
                      <span>🛍️ Open WhatsApp Catalog</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100 mt-4">
              <span className="text-[11px] text-[#581c87] font-semibold">Included with Scale (KSh 18,500/mo) &amp; Enterprise Retainers</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Industry Use-Cases Interactive Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
            Tailored for Every Kenyan Industry
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 max-w-xl mx-auto">
            See how leading brands across Kenya utilize LJK Marketing for customer retention and revenue growth.
          </p>
        </div>

        {/* Industry Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {industryUseCases.map((ind, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndustry(idx)}
              className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-2 ${
                activeIndustry === idx
                  ? "bg-[#581c87] text-white shadow-xs scale-105"
                  : "bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50"
              }`}
            >
              <span>{ind.icon}</span>
              <span>{ind.name}</span>
            </button>
          ))}
        </div>

        {/* Active Industry Showcase Card */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-10 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-[#581c87]">
              {industryUseCases[activeIndustry].name} Solutions
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 leading-snug">
              {industryUseCases[activeIndustry].headline}
            </h3>

            <div className="space-y-2.5 pt-2">
              {industryUseCases[activeIndustry].points.map((pt, pIdx) => (
                <div key={pIdx} className="flex items-start gap-2.5 text-xs text-zinc-700 leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span>{pt}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link
                href="/auth/signup"
                className="py-2.5 px-5 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors inline-block"
              >
                Launch for {industryUseCases[activeIndustry].name} &rarr;
              </Link>
            </div>
          </div>

          {/* Smartphone Handset Mockup */}
          <div className="lg:col-span-5">
            <div className="max-w-[280px] mx-auto bg-zinc-900 rounded-3xl p-3 shadow-xl border-4 border-zinc-800">
              <div className="bg-zinc-100 rounded-2xl p-3.5 space-y-3 min-h-[220px] flex flex-col justify-between">
                <div className="text-center border-b border-zinc-200 pb-1.5">
                  <div className="font-mono font-bold text-xs text-zinc-900 tracking-wider">
                    YOURBRAND
                  </div>
                  <div className="text-[9px] text-zinc-400">Direct Carrier Gateway</div>
                </div>

                <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-xs border border-zinc-200 text-[11px] text-zinc-800 leading-relaxed">
                  <p>{industryUseCases[activeIndustry].sampleSMS}</p>
                  <div className="text-[9px] text-zinc-400 text-right mt-1">Just now &bull; Delivered</div>
                </div>

                <div className="bg-zinc-200/80 rounded-full px-3 py-1 text-[9px] text-zinc-500 text-center">
                  Text message (SMS)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Bottom Conversion Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-[#1e1b4b] via-[#3b0764] to-[#581c87] p-8 sm:p-14 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Accelerate Your Customer Outreach?
            </h2>
            <p className="text-xs sm:text-base text-purple-200 leading-relaxed">
              Create your account in 30 seconds. No credit card required to get started. Instant M-PESA top-ups and dedicated onboarding support.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <Link
                href="/auth/signup"
                className="py-3 px-8 bg-white hover:bg-zinc-100 text-[#581c87] text-xs sm:text-sm font-extrabold rounded-xl shadow-lg transition-transform hover:scale-105"
              >
                Get Started Now &rarr;
              </Link>
              <Link
                href="/contact"
                className="py-3 px-6 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold rounded-xl border border-white/20 transition-colors"
              >
                Talk to Sales Team
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
