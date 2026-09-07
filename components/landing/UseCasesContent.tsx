"use client";

import React, { useState } from "react";
import Link from "next/link";

interface IndustryItem {
  id: string;
  category: string;
  name: string;
  icon: string;
  badge: string;
  headline: string;
  overview: string;
  keyUseCases: {
    title: string;
    description: string;
  }[];
  sampleChannel: "WHATSAPP" | "SMS";
  sampleMessage: {
    sender: string;
    header?: string;
    body: string;
    footer?: string;
    buttons?: string[];
  };
  metrics: {
    label: string;
    value: string;
  }[];
}

const INDUSTRIES: IndustryItem[] = [
  {
    id: "ecommerce",
    category: "Retail & Commerce",
    name: "Retail & E-Commerce",
    icon: "🛍️",
    badge: "98% Read Rate",
    headline: "Turn abandoned carts into completed checkouts and boost repeat sales.",
    overview:
      "Modern shoppers live on WhatsApp and SMS. Send rich product cards, real-time dispatch updates, and exclusive flash discounts that customers see and act on within minutes.",
    keyUseCases: [
      {
        title: "Abandoned Cart Recovery",
        description:
          "Send personalized WhatsApp notifications with product photos and 1-click checkout buttons within 30 minutes of cart abandonment.",
      },
      {
        title: "Order Dispatch & Delivery Tracking",
        description:
          "Instant automated alerts when an order is packaged, in transit with the courier, and out for delivery.",
      },
      {
        title: "VIP Flash Sales & Promotional Drips",
        description:
          "Target segmented customer groups based on purchase history with branded alphanumeric SMS and media-rich WhatsApp broadcasts.",
      },
      {
        title: "Automated Review & Reorder Prompts",
        description:
          "Trigger a customer satisfaction check 3 days post-delivery to capture valuable reviews and drive repeat orders.",
      },
    ],
    sampleChannel: "WHATSAPP",
    sampleMessage: {
      sender: "ShopKenya Store",
      header: "YOUR ORDER HAS BEEN DISPATCHED 📦",
      body: "Hi Brenda, exciting news! Your order #SK-8921 has been handed to our courier and will arrive in Nairobi by 3:00 PM today.\n\nTotal Paid: KES 4,500 via M-PESA.",
      footer: "Reply HELP for instant concierge support",
      buttons: ["Track Live Courier 📍", "View Order Details 📄"],
    },
    metrics: [
      { label: "Cart Recovery Lift", value: "+34%" },
      { label: "Repeat Purchase Rate", value: "+28%" },
      { label: "Delivery Inquiry Drop", value: "-60%" },
    ],
  },
  {
    id: "fintech",
    category: "Financial Services",
    name: "FinTech, Banking & Lending",
    icon: "💳",
    badge: "< 2s OTP Latency",
    headline: "Mission-critical 2FA verification codes and real-time transaction receipts.",
    overview:
      "Deliver bank-grade security and transparency. Trigger instant low-latency verification codes, deposit notifications, loan approvals, and automated payment reminders via direct Tier-1 carrier routes.",
    keyUseCases: [
      {
        title: "Instant 2FA & Login Verification OTPs",
        description:
          "Priority transactional SMS route guaranteeing delivery in under 2.4 seconds with zero telco spam filtering.",
      },
      {
        title: "Real-Time Payment & Deposit Confirmations",
        description:
          "Automated ledger-synced alerts notifying customers the exact second funds hit their account or digital wallet.",
      },
      {
        title: "Loan Approval & Disbursement Notifications",
        description:
          "Congratulate approved borrowers and deliver repayment terms directly to their verified WhatsApp inbox.",
      },
      {
        title: "Automated Due Date & Installment Reminders",
        description:
          "Pre-due date and grace-period alerts that decrease non-performing loans and eliminate costly manual collection calls.",
      },
    ],
    sampleChannel: "SMS",
    sampleMessage: {
      sender: "APEX_BANK",
      body: "Dear Customer, KES 25,000.00 has been credited to your Account ending in *4821 via M-PESA Ref: QX91048. Available Balance: KES 142,500.00. Help: 0700000000",
    },
    metrics: [
      { label: "OTP Delivery Speed", value: "< 2.4s" },
      { label: "On-Time Repayments", value: "+42%" },
      { label: "Customer Trust Score", value: "99.8%" },
    ],
  },
  {
    id: "healthcare",
    category: "Healthcare & Wellness",
    name: "Healthcare, Hospitals & Clinics",
    icon: "🏥",
    badge: "40% Fewer No-Shows",
    headline: "Automate patient appointments, lab results, and wellness follow-ups.",
    overview:
      "Reduce missed appointments and elevate patient care. Replace manual phone calls with automated WhatsApp reminders, prescription refill alerts, and secure diagnostic test notifications.",
    keyUseCases: [
      {
        title: "Automated Appointment Confirmations",
        description:
          "Send booking confirmations with calendar invite links and hospital location directions 24 hours in advance.",
      },
      {
        title: "Lab Test & Diagnostic Result Readiness",
        description:
          "Notify patients the minute their pathology or imaging reports are ready for secure portal download.",
      },
      {
        title: "Prescription Refill & Medication Prompts",
        description:
          "Scheduled recurring alerts reminding chronic care patients to refill medications before running out.",
      },
      {
        title: "Preventive Care & Health Camp Broadcasts",
        description:
          "Broadcast health education tips, immunization schedules, and dental wellness checkup announcements.",
      },
    ],
    sampleChannel: "WHATSAPP",
    sampleMessage: {
      sender: "Agape Health Clinic",
      header: "APPOINTMENT CONFIRMATION 🩺",
      body: "Hello Michael, this is a reminder for your dental checkup with Dr. Wanjiku tomorrow, Wednesday at 10:30 AM.\n\nClinic: Kilimani Suite 4B.\nPlease arrive 10 minutes prior.",
      footer: "Tap below to confirm or reschedule",
      buttons: ["Confirm Booking ✅", "Reschedule 📅"],
    },
    metrics: [
      { label: "No-Show Reduction", value: "-42%" },
      { label: "Staff Time Saved", value: "15 hrs/wk" },
      { label: "Patient Satisfaction", value: "96%" },
    ],
  },
  {
    id: "education",
    category: "Education & Academics",
    name: "Schools, Colleges & Universities",
    icon: "🎓",
    badge: "100% Parent Reach",
    headline: "Keep parents, students, and faculty aligned with instant verified updates.",
    overview:
      "Schools and higher learning institutions bridge the communication gap between administration and guardians through reliable fee balance notifications, student attendance alerts, and exam schedules.",
    keyUseCases: [
      {
        title: "Fee Balance Statements & Payment Receipts",
        description:
          "Automated termly balance updates with Paybill and account numbers, followed by instant digital payment receipts.",
      },
      {
        title: "Student Attendance & Emergency Alerts",
        description:
          "Immediate SMS alerts notifying parents of unauthorized student absences, school bus delays, or weather closures.",
      },
      {
        title: "Report Cards & Exam Result Broadcasts",
        description:
          "Secure individualized delivery of grades and term summaries directly to parents' phones.",
      },
      {
        title: "PTA Meetings & Academic Event Notices",
        description:
          "Personalized meeting invitations with RSVP tracking and agenda overviews sent via WhatsApp.",
      },
    ],
    sampleChannel: "SMS",
    sampleMessage: {
      sender: "ST_AUSTINS",
      body: "Dear Parent, fee payment of KES 35,000 for David (Grade 8) has been received. Term 2 balance is KES 0.00. Report collection is on 15th Aug. ST. AUSTIN'S ACADEMY",
    },
    metrics: [
      { label: "Fee Collection Pace", value: "+38%" },
      { label: "Parent Engagement", value: "99.2%" },
      { label: "Communication Cost", value: "-55%" },
    ],
  },
  {
    id: "logistics",
    category: "Logistics & Transport",
    name: "Logistics, Delivery & Fleet Operations",
    icon: "🚚",
    badge: "Real-Time Tracking",
    headline: "Streamline dispatch operations, driver coordination, and customer verification.",
    overview:
      "Ensure seamless last-mile fulfillment. Automate shipment status updates, dispatch verification OTPs to prevent package loss, and coordinate delivery drivers efficiently.",
    keyUseCases: [
      {
        title: "Last-Mile Delivery Verification OTPs",
        description:
          "Customer must share a dynamic 4-digit code with the courier upon arrival to confirm package handover.",
      },
      {
        title: "Driver Arrival & Live GPS Links",
        description:
          "Automated WhatsApp message when the driver is within 1 km, including courier contact details.",
      },
      {
        title: "Warehouse Inbound & Outbound Notifications",
        description:
          "Alert supply chain partners and B2B clients as cargo clears customs and departs consolidation hubs.",
      },
      {
        title: "Failed Delivery Rescheduling",
        description:
          "If customer is unavailable, immediately send an interactive WhatsApp card allowing them to select an alternative delivery window.",
      },
    ],
    sampleChannel: "WHATSAPP",
    sampleMessage: {
      sender: "SwiftCouriers Africa",
      header: "DRIVER ARRIVING SHORTLY 📍",
      body: "Hi Kevin, your rider James (+254 712 345 678) is 5 minutes away with your delivery.\n\nYour Delivery Code: 4920\nPlease present this code to the rider to collect.",
      footer: "SwiftCouriers Express Fulfillment",
      buttons: ["Call Driver 📞", "Change Instructions 📝"],
    },
    metrics: [
      { label: "Failed Deliveries", value: "-35%" },
      { label: "Proof of Delivery", value: "100%" },
      { label: "First-Attempt Rate", value: "92%" },
    ],
  },
  {
    id: "hospitality",
    category: "Hospitality & Tourism",
    name: "Hotels, Safari Lodges & Events",
    icon: "🏖️",
    badge: "5-Star Guest Concierge",
    headline: "Delight travelers from booking to checkout with digital concierge messaging.",
    overview:
      "Transform guest experiences with personalized WhatsApp check-ins, safari itinerary updates, dietary preference forms, and automated post-stay review requests.",
    keyUseCases: [
      {
        title: "Booking Confirmations & Digital Vouchers",
        description:
          "Instant WhatsApp confirmation with room reservation codes, check-in instructions, and PDF voucher attachments.",
      },
      {
        title: "Pre-Arrival Concierge & Airport Transfers",
        description:
          "Engage guests 48 hours prior to arrival to confirm flight arrival times and offer spa or dining reservations.",
      },
      {
        title: "Safari & Tour Itinerary Updates",
        description:
          "Daily morning alerts updating guests on game drive departure times, weather conditions, and guide details.",
      },
      {
        title: "TripAdvisor & Google Review Amplification",
        description:
          "Send polite feedback requests on checkout day with direct links to leave 5-star reviews online.",
      },
    ],
    sampleChannel: "WHATSAPP",
    sampleMessage: {
      sender: "Mara Serena Safari Lodge",
      header: "WELCOME TO MASAI MARA 🦁",
      body: "Jambo Sarah! Your Luxury Tent reservation (#MR-4029) is ready. Check-in begins at 12:00 PM.\n\nEvening Game Drive departs at 4:30 PM from the main reception.",
      footer: "Mara Serena Concierge Desk",
      buttons: ["View Daily Menu 🍽️", "Chat with Concierge 💬"],
    },
    metrics: [
      { label: "Ancillary Spend", value: "+26%" },
      { label: "Positive Reviews", value: "+54%" },
      { label: "Check-in Speed", value: "3x Faster" },
    ],
  },
  {
    id: "realestate",
    category: "Real Estate & Property",
    name: "Real Estate & Property Management",
    icon: "🏢",
    badge: "Automated Collections",
    headline: "Automate monthly rent invoices, maintenance updates, and viewing appointments.",
    overview:
      "Property managers and landlords eliminate endless phone tag. Automate rent notices with embedded payment channels, schedule tenant viewings, and send maintenance progress reports.",
    keyUseCases: [
      {
        title: "Automated Monthly Rent Invoices",
        description:
          "Send automated rent breakdown notices on the 25th with integrated M-PESA Paybill details.",
      },
      {
        title: "Instant Payment Receipts & Ledger Balances",
        description:
          "Tenants immediately receive an automated confirmation with their updated ledger balance.",
      },
      {
        title: "Property Viewing Invitations & Confirmations",
        description:
          "Prospective tenants receive location pins, viewing time confirmations, and property brochures via WhatsApp.",
      },
      {
        title: "Building Maintenance & Utility Alerts",
        description:
          "Notify all residents of scheduled water maintenance, power outages, or estate security updates in one broadcast.",
      },
    ],
    sampleChannel: "SMS",
    sampleMessage: {
      sender: "PRIME_HOMES",
      body: "Dear Tenant, rent invoice for House #B4 is KES 45,000 due on 5th Sept. Pay via Paybill 892100 Acc: B4. Thank you. PRIME HOMES MANAGEMENT",
    },
    metrics: [
      { label: "On-Time Rent Rate", value: "94%" },
      { label: "Dispute Reduction", value: "-70%" },
      { label: "Admin Workload", value: "-50%" },
    ],
  },
  {
    id: "saas",
    category: "Technology & SaaS",
    name: "Software Platforms & Digital Apps",
    icon: "💻",
    badge: "REST API & Webhooks",
    headline: "Power your application's notifications via robust developer APIs.",
    overview:
      "Integrate programmatic WhatsApp messages and carrier-grade SMS directly into your web applications, mobile backends, and cloud microservices in less than 15 minutes.",
    keyUseCases: [
      {
        title: "User Onboarding & Phone Verification",
        description:
          "Ensure real users with high-speed 2FA OTP codes during signup and account recovery.",
      },
      {
        title: "Critical System & Downtime Alerts",
        description:
          "Notify on-call engineers via SMS the moment server latency spikes or error rates exceed thresholds.",
      },
      {
        title: "Usage Limit & Subscription Expiry Notices",
        description:
          "Proactively warn subscribers when their cloud storage, API quotas, or monthly plans are nearing renewal.",
      },
      {
        title: "Event-Driven Webhook Integrations",
        description:
          "Trigger automated omnichannel dispatches directly from Stripe, M-PESA, or database events.",
      },
    ],
    sampleChannel: "WHATSAPP",
    sampleMessage: {
      sender: "CloudStack Monitoring",
      header: "SYSTEM ALERT: HIGH CPU LOAD ⚠️",
      body: "Service: [api-gateway-prod-02]\nStatus: CPU load exceeded 94% for 5 consecutive minutes.\nRegion: Nairobi (af-south-1).",
      footer: "CloudStack Infrastructure Telemetry",
      buttons: ["Acknowledge Alert 🚨", "View Metrics Dashboard 📊"],
    },
    metrics: [
      { label: "Integration Time", value: "< 15 mins" },
      { label: "API Uptime SLA", value: "99.95%" },
      { label: "Throughput", value: "1,000 msg/s" },
    ],
  },
];

export function UseCasesContent() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [activeIndustryId, setActiveIndustryId] = useState<string>("ecommerce");

  const categories = ["ALL", "Retail & Commerce", "Financial Services", "Healthcare & Wellness", "Education & Academics", "Logistics & Transport", "Hospitality & Tourism", "Real Estate & Property", "Technology & SaaS"];

  const filteredIndustries = INDUSTRIES.filter((ind) =>
    selectedCategory === "ALL" ? true : ind.category === selectedCategory
  );

  const currentIndustry = INDUSTRIES.find((i) => i.id === activeIndustryId) || INDUSTRIES[0];

  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-[#581c87] selection:text-white">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-zinc-100 bg-gradient-to-b from-purple-50/40 via-white to-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 text-center space-y-6">
          {/* Top Trust Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Verified Meta Tech Provider &bull; Official WhatsApp Cloud API &amp; Tier-1 SMS</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-zinc-950 tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Engineered for Every Industry. Built for Growth.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-zinc-600 max-w-2xl mx-auto leading-relaxed">
            From high-converting e-commerce carts and secure financial OTPs to hospital appointment reminders and school fee notices &mdash; discover how enterprises scale customer engagement on LJK.
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
            <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-xs">
              <div className="text-2xl font-black text-[#581c87]">98%+</div>
              <div className="text-xs text-zinc-500 font-medium mt-0.5">WhatsApp Open Rate</div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-xs">
              <div className="text-2xl font-black text-emerald-600">&lt; 2.4s</div>
              <div className="text-xs text-zinc-500 font-medium mt-0.5">SMS Delivery Latency</div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-xs">
              <div className="text-2xl font-black text-[#581c87]">2,000+</div>
              <div className="text-xs text-zinc-500 font-medium mt-0.5">Daily Conversations Tier</div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-xs">
              <div className="text-2xl font-black text-emerald-600">Zero</div>
              <div className="text-xs text-zinc-500 font-medium mt-0.5">Carrier Spam Filtering</div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link
              href="/auth/login"
              className="py-3 px-6 bg-[#581c87] hover:bg-[#4a1572] text-white text-sm font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              Start Free Trial &rarr;
            </Link>
            <Link
              href="/pricing"
              className="py-3 px-6 bg-white hover:bg-zinc-50 text-zinc-800 text-sm font-semibold rounded-xl border border-zinc-200 transition-all shadow-2xs"
            >
              View Transparent Rates
            </Link>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE SIMULATOR & HIGHLIGHT SECTION */}
      <section className="py-16 sm:py-20 border-b border-zinc-100 bg-zinc-50/60">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#581c87]">
              Interactive Live Preview
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
              See How Your Industry Messages Look on Customer Devices
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-xl mx-auto">
              Select any industry below to inspect real-world messages delivered via verified WhatsApp or branded SMS.
            </p>
          </div>

          {/* Industry Quick Selector Pills */}
          <div className="flex items-center justify-center flex-wrap gap-2">
            {INDUSTRIES.map((ind) => (
              <button
                key={ind.id}
                type="button"
                onClick={() => setActiveIndustryId(ind.id)}
                className={`py-2 px-3.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                  activeIndustryId === ind.id
                    ? "bg-[#581c87] text-white shadow-md scale-105"
                    : "bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-100"
                }`}
              >
                <span>{ind.icon}</span>
                <span>{ind.name}</span>
              </button>
            ))}
          </div>

          {/* Interactive Showcase Card Grid: Left Details / Right Phone Mockup */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto bg-white border border-zinc-200 rounded-3xl p-6 sm:p-10 shadow-lg">
            {/* Left: Deep-Dive Description */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{currentIndustry.icon}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-[#581c87] border border-purple-200">
                    {currentIndustry.badge}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-zinc-950">
                  {currentIndustry.headline}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                  {currentIndustry.overview}
                </p>
              </div>

              {/* Key Use Cases */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Primary Use Cases:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentIndustry.keyUseCases.map((uc, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-zinc-50 border border-zinc-100 text-xs space-y-1">
                      <div className="font-bold text-zinc-900 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{uc.title}</span>
                      </div>
                      <p className="text-[11px] text-zinc-500 leading-relaxed">{uc.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Metrics */}
              <div className="pt-2 border-t border-zinc-100 flex items-center gap-6">
                {currentIndustry.metrics.map((m, idx) => (
                  <div key={idx}>
                    <div className="text-lg font-black text-zinc-900">{m.value}</div>
                    <div className="text-[10px] text-zinc-500 font-medium">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Simulated Smartphone Handset */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-[290px] rounded-[38px] border-4 border-zinc-800 bg-zinc-950 p-2.5 shadow-2xl space-y-2 text-zinc-900">
                {/* Speaker Notch */}
                <div className="w-20 h-4 bg-zinc-800 rounded-full mx-auto" />

                {/* Simulated Screen Content */}
                <div className="rounded-[28px] bg-[#f0f2f5] p-3 min-h-[380px] flex flex-col justify-between overflow-hidden text-xs">
                  {/* Phone Header */}
                  <div className="bg-white p-2.5 rounded-xl shadow-2xs flex items-center justify-between border border-zinc-200/60">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[11px]">
                        {currentIndustry.sampleMessage.sender.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="leading-tight">
                        <div className="font-bold text-[11px] text-zinc-900 flex items-center gap-1 truncate max-w-[120px]">
                          <span>{currentIndustry.sampleMessage.sender}</span>
                          <svg className="w-3 h-3 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                          </svg>
                        </div>
                        <div className="text-[9px] text-emerald-700 font-semibold">Verified Account</div>
                      </div>
                    </div>
                    <span className="text-[9px] text-zinc-400 font-mono">10:42 AM</span>
                  </div>

                  {/* Message Bubble */}
                  <div className="my-auto py-2 space-y-2">
                    <div className="bg-white rounded-2xl p-3 shadow-xs border border-zinc-200/80 space-y-2 text-left">
                      {currentIndustry.sampleMessage.header && (
                        <div className="font-bold text-[11px] text-zinc-950 border-b border-zinc-100 pb-1">
                          {currentIndustry.sampleMessage.header}
                        </div>
                      )}
                      <div className="text-[11px] text-zinc-800 whitespace-pre-line leading-relaxed">
                        {currentIndustry.sampleMessage.body}
                      </div>
                      {currentIndustry.sampleMessage.footer && (
                        <div className="text-[9px] text-zinc-400 pt-1 border-t border-zinc-100">
                          {currentIndustry.sampleMessage.footer}
                        </div>
                      )}

                      {/* Interactive Buttons Preview */}
                      {currentIndustry.sampleMessage.buttons && (
                        <div className="space-y-1 pt-1">
                          {currentIndustry.sampleMessage.buttons.map((b, bIdx) => (
                            <div
                              key={bIdx}
                              className="py-1.5 px-2 bg-emerald-50 text-emerald-800 text-[10px] font-semibold text-center rounded-lg border border-emerald-200"
                            >
                              {b}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Read receipts */}
                      <div className="flex items-center justify-end gap-1 text-[9px] text-zinc-400 pt-0.5 font-mono">
                        <span>10:42 AM</span>
                        <span className="text-sky-500 font-bold">✓✓</span>
                      </div>
                    </div>
                  </div>

                  {/* Phone Bottom Input Bar */}
                  <div className="bg-white p-2 rounded-xl border border-zinc-200 flex items-center justify-between text-zinc-400 text-[10px]">
                    <span>Type a message...</span>
                    <span className="text-emerald-600 font-bold">&rarr;</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ALL INDUSTRIES GRID SECTION */}
      <section className="py-16 sm:py-24 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#581c87]">
            Complete Industry Portfolio
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
            Tailored Capabilities for Every Business Model
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 max-w-xl mx-auto">
            Whether you operate in retail, healthcare, logistics, financial services, or software, LJK adapts to your specific regulatory and communication needs.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`py-1.5 px-3.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-zinc-900 text-white shadow-xs"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Industry Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIndustries.map((ind) => (
            <div
              key={ind.id}
              className="bg-white border border-zinc-200 hover:border-purple-300 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-xl">
                    {ind.icon}
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {ind.sampleChannel}
                  </span>
                </div>

                <h3 className="text-base font-bold text-zinc-900">{ind.name}</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">{ind.headline}</p>

                <div className="space-y-1.5 pt-2 border-t border-zinc-100">
                  {ind.keyUseCases.slice(0, 3).map((uc, uIdx) => (
                    <div key={uIdx} className="text-xs text-zinc-700 flex items-start gap-2">
                      <span className="text-[#581c87] font-bold mt-0.5">&bull;</span>
                      <span className="leading-snug">
                        <strong>{uc.title}</strong>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-medium text-[11px]">{ind.badge}</span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveIndustryId(ind.id);
                    window.scrollTo({ top: 400, behavior: "smooth" });
                  }}
                  className="font-bold text-[#581c87] hover:underline cursor-pointer"
                >
                  Inspect Live Preview &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CHANNELS COMPARISON MATRIX */}
      <section className="py-16 bg-zinc-950 text-white border-t border-zinc-800">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Omnichannel Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Which Messaging Medium Fits Your Customer Journey?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
              LJK unifies all three mission-critical communication channels on a single wallet ledger.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* WhatsApp */}
            <div className="p-6 rounded-2xl bg-zinc-900 border border-emerald-500/40 space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  High Conversion
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                  Meta Verified
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">Meta WhatsApp Cloud API</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                98% read rates with rich interactive media: image flyers, PDF brochures, quick reply buttons, and live blue-tick telemetry.
              </p>
              <ul className="space-y-2 text-xs text-zinc-400 pt-2 border-t border-zinc-800">
                <li className="flex items-center gap-2 text-white">
                  <span className="text-emerald-400">✓</span> 98% Read Rates within 5 mins
                </li>
                <li className="flex items-center gap-2 text-white">
                  <span className="text-emerald-400">✓</span> Blue Ticks (Read Receipts)
                </li>
                <li className="flex items-center gap-2 text-white">
                  <span className="text-emerald-400">✓</span> Rich Action Buttons ([Buy], [Call])
                </li>
                <li className="flex items-center gap-2 text-white">
                  <span className="text-emerald-400">✓</span> 24-hr Free Customer Support Window
                </li>
              </ul>
              <div className="pt-2 text-xs font-bold text-emerald-400">
                Best For: Marketing, Cart Recovery, Concierge
              </div>
            </div>

            {/* Bulk SMS */}
            <div className="p-6 rounded-2xl bg-zinc-900 border border-purple-500/40 space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                  Universal Reach
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300">
                  Tier-1 Telco
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">Telco-Grade Bulk SMS</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Reaches 100% of mobile handsets across Kenya &amp; East Africa, including basic feature phones without mobile data.
              </p>
              <ul className="space-y-2 text-xs text-zinc-400 pt-2 border-t border-zinc-800">
                <li className="flex items-center gap-2 text-white">
                  <span className="text-purple-400">✓</span> Guaranteed Delivery in &lt; 2.4s
                </li>
                <li className="flex items-center gap-2 text-white">
                  <span className="text-purple-400">✓</span> Branded 11-Char Alphanumeric Sender ID
                </li>
                <li className="flex items-center gap-2 text-white">
                  <span className="text-purple-400">✓</span> Real-Time Telco Carrier DLR Logs
                </li>
                <li className="flex items-center gap-2 text-white">
                  <span className="text-purple-400">✓</span> Automated Opt-Out Suppression
                </li>
              </ul>
              <div className="pt-2 text-xs font-bold text-purple-300">
                Best For: 2FA OTPs, Banking Receipts, Urgent Alerts
              </div>
            </div>

            {/* Developer API */}
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-700 space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Automation
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-white">
                  REST &amp; Webhooks
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">Developer REST API</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Connect your backend database, CRM, or e-commerce platform via API keys for synchronous, high-speed notifications.
              </p>
              <ul className="space-y-2 text-xs text-zinc-400 pt-2 border-t border-zinc-800">
                <li className="flex items-center gap-2 text-white">
                  <span className="text-zinc-300">✓</span> Low-Latency Single &amp; Batch Endpoints
                </li>
                <li className="flex items-center gap-2 text-white">
                  <span className="text-zinc-300">✓</span> Auto-Refund on Carrier Failure
                </li>
                <li className="flex items-center gap-2 text-white">
                  <span className="text-zinc-300">✓</span> cURL, Python &amp; JavaScript SDKs
                </li>
                <li className="flex items-center gap-2 text-white">
                  <span className="text-zinc-300">✓</span> Real-Time Webhook Callback Events
                </li>
              </ul>
              <div className="pt-2 text-xs font-bold text-zinc-300">
                Best For: ERP Triggers, Webhook Automations, Mobile Apps
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION BANNER */}
      <section className="py-20 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 text-center space-y-6">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight max-w-2xl mx-auto">
          Ready to Elevate Customer Messaging in Your Industry?
        </h2>
        <p className="text-xs sm:text-sm text-zinc-600 max-w-xl mx-auto">
          Join leading brands and modern enterprises powering high-throughput SMS and Meta-verified WhatsApp communications with LJK.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/auth/login"
            className="py-3 px-6 bg-[#581c87] hover:bg-[#4a1572] text-white text-sm font-semibold rounded-xl transition-all shadow-md"
          >
            Create Your Account &rarr;
          </Link>
          <Link
            href="/contact"
            className="py-3 px-6 bg-white hover:bg-zinc-50 text-zinc-800 text-sm font-semibold rounded-xl border border-zinc-200 transition-all shadow-2xs"
          >
            Contact an Integration Specialist
          </Link>
        </div>
      </section>
    </div>
  );
}
