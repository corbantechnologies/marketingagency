"use client";

import React, { useState } from "react";
import Link from "next/link";

interface GuideSection {
  id: string;
  category: "getting-started" | "messaging" | "billing" | "compliance" | "developer";
  stepNumber: string;
  title: string;
  badge: string;
  summary: string;
  keyActionLink?: { label: string; href: string };
  highlights: string[];
  tips: string;
}

export function GuideContent() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [expandedSection, setExpandedSection] = useState<string>("sec-1");

  const guideSections: GuideSection[] = [
    {
      id: "sec-1",
      category: "getting-started",
      stepNumber: "01",
      title: "Creating Your Business Workspace & Profile",
      badge: "Account Setup",
      summary:
        "Every client gets an isolated multi-tenant business workspace. This keeps your contact directories, custom sender IDs, credit wallets, and campaign analytics completely private and secure.",
      keyActionLink: { label: "Create Free Workspace", href: "/auth/signup" },
      highlights: [
        "Sign up with your corporate email and verify your workspace.",
        "Your unique Business Reference and Member Code are automatically generated.",
        "Update your official brand details under Business Settings for invoices and billing.",
      ],
      tips: "You can manage workspace profile details anytime under Settings in the portal sidebar.",
    },
    {
      id: "sec-2",
      category: "compliance",
      stepNumber: "02",
      title: "Registering an Alphanumeric Brand Sender ID",
      badge: "CA Kenya Compliance",
      summary:
        "Replace random phone numbers with your registered brand name (e.g. YOURBRAND) on recipient handsets. We handle simultaneous submission to Safaricom, Airtel, and Telkom Kenya.",
      keyActionLink: { label: "Go to Sender IDs Portal", href: "/business/sender-ids" },
      highlights: [
        "Header must be 1 to 11 characters (alphanumeric, no symbols).",
        "Provide your Business Certificate of Incorporation and KRA Tax PIN numbers.",
        "Review typically completes within 12 to 24 business hours.",
        "Use the shared instant route (LJK_AGENCY) while awaiting custom header approval.",
      ],
      tips: "Communications Authority of Kenya requires all sender ID applicants to have a registered business or legal trade name.",
    },
    {
      id: "sec-3",
      category: "messaging",
      stepNumber: "03",
      title: "Uploading & Segmenting Your Contacts",
      badge: "Audience Management",
      summary:
        "Import thousands of customers in seconds using our 1-Click CSV/Excel upload wizard. Segment your audience into targeted buckets like VIP, Nairobi Branch, or Suppliers.",
      keyActionLink: { label: "Manage Contacts & Groups", href: "/business/contacts" },
      highlights: [
        "Spreadsheet Importer automatically sanitizes Kenyan phone numbers to international format (+2547XX / +2541XX).",
        "Auto-column mapping detects First Name, Last Name, Phone Number, and Email.",
        "Create unlimited Contact Groups for targeted promotional blasts.",
        "Add custom attributes (e.g. {balance}, {due_date}) for hyper-personalized messaging.",
      ],
      tips: "Click 'Send SMS to Group' on any contact group to deep-link directly into the campaign composer with that group pre-selected.",
    },
    {
      id: "sec-4",
      category: "billing",
      stepNumber: "04",
      title: "Funding Your Wallet via Safaricom M-PESA",
      badge: "Instant Top-Up",
      summary:
        "Fund your dual-channel SMS and Email credit wallets anytime in KES using Safaricom Daraja M-PESA STK push. Credits activate immediately and never expire.",
      keyActionLink: { label: "Open Billing Portal", href: "/business/billing" },
      highlights: [
        "Enter your Safaricom phone number and amount in KES.",
        "An instant STK PIN prompt appears on your handset; enter your M-PESA PIN to complete.",
        "Credits are credited atomically within ~3 seconds.",
        "Download automated PDF receipts and view your immutable transaction ledger.",
      ],
      tips: "Wholesale tier discounts apply automatically for higher volume packages (down to KES 0.28 / SMS).",
    },
    {
      id: "sec-5",
      category: "messaging",
      stepNumber: "05",
      title: "Composing & Launching WhatsApp & Bulk SMS Campaigns",
      badge: "Omnichannel Engine",
      summary:
        "Switch seamlessly between Meta WhatsApp Business (for rich image flyers, CTA buttons, and 98% open rates) and Tier-1 Bulk SMS (for universal mobile coverage). The unified wallet automatically deducts 2 Credits for WhatsApp and 1 Credit for SMS.",
      keyActionLink: { label: "Open Campaign Composer", href: "/business/sms/broadcast" },
      highlights: [
        "Select your channel: Meta WhatsApp Business API or Tier-1 Bulk SMS.",
        "WhatsApp campaigns support rich image banners, up to 1,024 characters, and interactive CTA buttons ([Shop Now], [Chat on WhatsApp]).",
        "SMS campaigns feature live GSM 03.38 character segment calculators (160 chars/SMS).",
        "Dynamic token interpolation (+ {first_name}) personalizes every individual broadcast.",
        "Interactive Handset Mockup displays live WhatsApp chat bubbles with Blue Ticks or 4G LTE SMS screens.",
      ],
      tips: "WhatsApp marketing messages deliver directly into customer chat with notification chimes and bypass telco DND blacklists.",
    },
    {
      id: "sec-6",
      category: "messaging",
      stepNumber: "06",
      title: "Monitoring Real-Time Delivery & Blue Ticks Telemetry",
      badge: "Analytics & Telemetry",
      summary:
        "Track message delivery performance in real-time. For WhatsApp campaigns, see exact Read timestamps with Blue Ticks (READ ✓✓). For SMS, view telco handset delivery receipts (DLR).",
      keyActionLink: { label: "View Delivery Reports", href: "/business/reports" },
      highlights: [
        "Real-time WhatsApp status updates: QUEUED → SENT → DELIVERED → READ (Blue Ticks ✓✓).",
        "Inspect telecom statuses: DELIVERED, SENT, FAILED, or UserInBlacklist (DND).",
        "Carrier detection automatically categorizes Safaricom, Airtel, and WhatsApp Business.",
        "Filter and trace individual messages by phone number, campaign reference, or status.",
        "Unified delivery rate percentages calculated across both channels.",
      ],
      tips: "Blue Ticks (READ ✓✓) update automatically via our bidirectional Meta webhook callbacks within seconds of the recipient opening the message.",
    },
    {
      id: "sec-7",
      category: "developer",
      stepNumber: "07",
      title: "Integrating via Developer REST API & Webhooks",
      badge: "REST & Webhooks",
      summary:
        "Connect bulk messaging directly into your custom website, mobile app, CRM, or accounting ERP using our clean JSON REST API and JWT authentication.",
      keyActionLink: { label: "Developer API Docs", href: "/business/developer" },
      highlights: [
        "Generate secure API keys from your business portal.",
        "REST endpoints for sending single transactional OTPs or large broadcast campaigns.",
        "Real-time webhook callbacks for instant delivery status updates (DLR).",
        "Direct SMPP v3.4 interconnect available for enterprise banking and SACCOs.",
      ],
      tips: "Sample code snippets in Python, Node.js, PHP, and cURL are available in the Developer API tab.",
    },
  ];

  const categories = [
    { id: "all", label: "All Guides" },
    { id: "getting-started", label: "Getting Started" },
    { id: "messaging", label: "Messaging & Campaigns" },
    { id: "billing", label: "Billing & M-PESA" },
    { id: "compliance", label: "Telco Compliance" },
    { id: "developer", label: "Developer API" },
  ];

  const filteredSections =
    activeCategory === "all"
      ? guideSections
      : guideSections.filter((s) => s.category === activeCategory);

  return (
    <div className="space-y-16 py-12 sm:py-16">
      {/* 1. Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-purple-50 text-[#581c87] border border-purple-200">
          <span className="w-2 h-2 rounded-full bg-[#581c87] animate-pulse" />
          <span>Platform User Guide &amp; Knowledge Base</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 tracking-tight max-w-3xl mx-auto leading-tight">
          How to Navigate &amp; Get the Most Out of LJK Marketing
        </h1>

        <p className="text-sm sm:text-base text-zinc-600 max-w-2xl mx-auto leading-relaxed">
          A complete walkthrough of the LJK Marketing platform. Learn how to configure your workspace, register official Sender IDs, upload contacts, top up credits via M-PESA, and launch high-converting campaigns.
        </p>

        {/* Quick Stepper Bar */}
        <div className="max-w-4xl mx-auto bg-zinc-50 border border-zinc-200 rounded-2xl p-4 sm:p-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-left shadow-2xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[#581c87] uppercase tracking-wider">Step 1</span>
            <div className="text-xs font-bold text-zinc-900">Create Workspace</div>
            <div className="text-[11px] text-zinc-500">Sign up in 30 seconds</div>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[#581c87] uppercase tracking-wider">Step 2</span>
            <div className="text-xs font-bold text-zinc-900">Brand Sender ID</div>
            <div className="text-[11px] text-zinc-500">12-24hr fast-track verification</div>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[#581c87] uppercase tracking-wider">Step 3</span>
            <div className="text-xs font-bold text-zinc-900">Upload Contacts</div>
            <div className="text-[11px] text-zinc-500">1-Click CSV/Excel importer</div>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[#581c87] uppercase tracking-wider">Step 4</span>
            <div className="text-xs font-bold text-zinc-900">Top-Up &amp; Launch</div>
            <div className="text-[11px] text-zinc-500">M-PESA STK push &amp; broadcast</div>
          </div>
        </div>
      </section>

      {/* 2. Category Filter Pills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-[#581c87] text-white shadow-xs scale-105"
                  : "bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* 3. Detailed Guide Chapters List */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        {filteredSections.map((sec) => {
          const isExpanded = expandedSection === sec.id;
          return (
            <div
              key={sec.id}
              className={`bg-white rounded-2xl border transition-all ${
                isExpanded
                  ? "border-purple-400 shadow-md ring-1 ring-purple-100"
                  : "border-zinc-200 hover:border-zinc-300 shadow-xs"
              }`}
            >
              {/* Header Toggle */}
              <button
                type="button"
                onClick={() => setExpandedSection(isExpanded ? "" : sec.id)}
                className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#581c87] flex items-center justify-center font-extrabold text-sm shrink-0 border border-purple-200">
                    {sec.stepNumber}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-700 border border-zinc-200">
                        {sec.badge}
                      </span>
                    </div>
                    <h2 className="text-base sm:text-lg font-bold text-zinc-900 leading-snug">
                      {sec.title}
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                      {sec.summary}
                    </p>
                  </div>
                </div>

                <div className="text-zinc-400 p-1 shrink-0">
                  <svg
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isExpanded ? "rotate-180 text-[#581c87]" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Expanded Details Body */}
              {isExpanded && (
                <div className="px-5 pb-6 sm:px-6 sm:pb-6 pt-2 border-t border-zinc-100 space-y-4 text-xs">
                  <div>
                    <h3 className="font-bold text-zinc-800 uppercase tracking-wider text-[11px] mb-2">
                      Key Highlights &amp; Steps:
                    </h3>
                    <ul className="space-y-2 text-zinc-600">
                      {sec.highlights.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="text-emerald-600 font-bold text-xs mt-0.5">✓</span>
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pro Tip Box */}
                  <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl text-purple-950 flex items-start gap-2">
                    <span className="text-sm">💡</span>
                    <div className="leading-relaxed">
                      <strong>Pro Tip:</strong> {sec.tips}
                    </div>
                  </div>

                  {/* Action Link Button */}
                  {sec.keyActionLink && (
                    <div className="pt-2">
                      <Link
                        href={sec.keyActionLink.href}
                        className="inline-flex items-center gap-1.5 py-2 px-4 bg-[#581c87] hover:bg-[#4a1572] text-white font-semibold rounded-lg text-xs transition-colors shadow-2xs"
                      >
                        <span>{sec.keyActionLink.label}</span>
                        <span>&rarr;</span>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* 4. Common Questions & Telco Rules Callout */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-zinc-900 text-white rounded-3xl p-6 sm:p-8 space-y-5 border border-zinc-800 shadow-xl">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
              Regulatory Guidelines
            </span>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Kenyan Telecom &amp; Communications Authority (CA) Rules
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              To safeguard your sender ID whitelisting and maintain 99%+ carrier delivery rates, always follow these national rules:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-zinc-800/80 rounded-xl border border-zinc-700/60 space-y-1.5">
              <div className="font-bold text-amber-300">Permitted Promotional Hours</div>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                Promotional marketing blasts can only be delivered between <strong>8:00 AM &ndash; 7:00 PM</strong>. Transactional OTPs and password resets operate 24/7.
              </p>
            </div>

            <div className="p-4 bg-zinc-800/80 rounded-xl border border-zinc-700/60 space-y-1.5">
              <div className="font-bold text-purple-300">Mandatory Opt-Out Support</div>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                Promotional SMS should mention your brand and give recipients a clear opt-out path (e.g. <em>&quot;To stop SMS, reply STOP&quot;</em>).
              </p>
            </div>

            <div className="p-4 bg-zinc-800/80 rounded-xl border border-zinc-700/60 space-y-1.5">
              <div className="font-bold text-emerald-300">GSM 03.38 vs. Unicode Pricing</div>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                Standard English text allows 160 characters per SMS credit. Emojis and special characters trigger Unicode mode (70 characters per SMS).
              </p>
            </div>

            <div className="p-4 bg-zinc-800/80 rounded-xl border border-zinc-700/60 space-y-1.5">
              <div className="font-bold text-blue-300">Credit Expiry Guarantee</div>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                SMS and Email credits purchased on LJK Marketing Agency <strong>never expire</strong>. Your balance remains safe in your business wallet until used.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Bottom Conversion CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-[#1e1b4b] via-[#3b0764] to-[#581c87] p-8 sm:p-10 text-white text-center space-y-5 shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ready to Start Reaching Your Customers?
          </h2>
          <p className="text-xs sm:text-sm text-purple-200 max-w-xl mx-auto leading-relaxed">
            Create your account now. No credit card required. Test our carrier routes, upload your contacts, and get your brand Sender ID whitelisted.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/auth/signup"
              className="py-3 px-6 bg-white hover:bg-zinc-100 text-[#581c87] text-xs sm:text-sm font-extrabold rounded-xl shadow-lg transition-transform hover:scale-105"
            >
              Create Free Workspace &rarr;
            </Link>
            <Link
              href="/contact"
              className="py-3 px-5 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold rounded-xl border border-white/20 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
