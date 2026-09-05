/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Link from "next/link";

export function AuditForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    website: "",
    phone: "",
    volume: "10,000 - 50,000 SMS/mo",
    goals: ["Bulk Promotional SMS"],
    senderId: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const volumeOptions = [
    "Under 10,000 SMS / Emails /mo",
    "10,000 - 50,000 SMS / Emails /mo",
    "50,000 - 200,000 SMS / Emails /mo",
    "200,000 - 1,000,000+ SMS / Emails /mo",
    "Enterprise 1M+ Monthly Volume",
  ];

  const goalOptions = [
    "Bulk Promotional SMS Broadcast",
    "Transactional OTP & Alert Gateway",
    "Email Deliverability & IP Warming",
    "Ecommerce Lifecycle Automation",
    "REST API & SMPP 3.4 Integration",
    "Subscriber List Growth & Paid Ads",
  ];

  const handleGoalToggle = (goal: string) => {
    setFormData((prev) => {
      const exists = prev.goals.includes(goal);
      return {
        ...prev,
        goals: exists
          ? prev.goals.filter((g) => g !== goal)
          : [...prev.goals, goal],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          inquiryType: "Free 14-Point Growth & Deliverability Audit",
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit audit request");
      }

      setIsSuccess(true);
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="audit" className="bg-white py-16 md:py-24 border-b border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Context & What's Included (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-purple-50 border border-purple-200 text-xs font-semibold text-[#581c87] mb-3">
              Free Messaging & Deliverability Audit
            </div>
            <h2 className="text-xl font-semibold text-zinc-900 tracking-tight mb-4">
              Get Your SMS & Email Deliverability Audit
            </h2>
            <p className="text-sm font-normal text-zinc-600 leading-relaxed mb-8">
              Experience direct Tier-1 carrier routing. Our messaging engineers will audit your current
              sending domain, analyze carrier spam filters, test route latency, and provide custom
              routing recommendations.
            </p>

            {/* What's in the audit list */}
            <div className="space-y-4 mb-8">
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded">
                <div className="text-xs font-semibold text-zinc-900 mb-1 flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-[#581c87] text-white flex items-center justify-center text-[10px]">
                    ✓
                  </span>
                  Telecom Route & Carrier Delivery Speed Benchmark
                </div>
                <div className="text-xs font-normal text-zinc-500 pl-6">
                  Live latency test verifying sub-2.4s handset delivery across major network operators.
                </div>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded">
                <div className="text-xs font-semibold text-zinc-900 mb-1 flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-[#581c87] text-white flex items-center justify-center text-[10px]">
                    ✓
                  </span>
                  Email Domain Authentication & Spam Shield Inspection
                </div>
                <div className="text-xs font-normal text-zinc-500 pl-6">
                  Full SPF, DKIM, DMARC, and IP reputation check to guarantee primary inbox placement.
                </div>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded">
                <div className="text-xs font-semibold text-zinc-900 mb-1 flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-[#581c87] text-white flex items-center justify-center text-[10px]">
                    ✓
                  </span>
                  Custom Alphanumeric Sender ID Pre-Verification
                </div>
                <div className="text-xs font-normal text-zinc-500 pl-6">
                  Fast-track compliance check for your official brand name sender ID on carrier registries.
                </div>
              </div>
            </div>

            {/* Direct Contact Info */}
            <div className="p-4 bg-purple-50/70 border border-purple-200 rounded text-xs space-y-1.5">
              <div className="font-semibold text-purple-950">Messaging Support Desk:</div>
              <div className="text-zinc-600">Email: <a href="mailto:growth@ljkmarketingagency.co.ke" className="text-[#581c87] font-medium hover:underline">growth@ljkmarketingagency.co.ke</a></div>
              <div className="text-zinc-600">API Documentation: <span className="font-mono text-[#581c87]">https://api.ljkmarketingagency.co.ke/docs</span></div>
            </div>
          </div>

          {/* Right Column: Lead Form (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-zinc-200 rounded p-6 sm:p-8 shadow-xs">
              
              {isSuccess ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-12 h-12 rounded bg-purple-50 border border-purple-200 text-[#581c87] flex items-center justify-center mx-auto">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-900">
                    Audit Request Successfully Received!
                  </h3>
                  <p className="text-sm font-normal text-zinc-600 max-w-md mx-auto">
                    Thank you, <span className="font-semibold text-zinc-800">{formData.name}</span>. An LJK messaging engineer has received your request for <span className="font-semibold text-zinc-800">{formData.website || "your company"}</span>. Your route deliverability report and carrier benchmark analysis will be emailed within 12 business hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSuccess(false);
                      setFormData({
                        name: "",
                        email: "",
                        website: "",
                        phone: "",
                        volume: "10,000 - 50,000 SMS/mo",
                        goals: ["Bulk Promotional SMS"],
                        senderId: "",
                        notes: "",
                      });
                    }}
                    className="inline-flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold px-4 py-2 rounded transition-colors"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="border-b border-zinc-100 pb-4 mb-2">
                    <h3 className="text-base font-semibold text-zinc-900">
                      Request Messaging Deliverability Audit
                    </h3>
                    <p className="text-xs font-normal text-zinc-500 mt-0.5">
                      100% free consultation. Includes route latency review & spam shield analysis.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="David Mwangi"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-[#581c87] focus:border-[#581c87]"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
                        Work Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="david@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-[#581c87] focus:border-[#581c87]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Website / Company */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
                        Company Name or Website *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Apex Commerce / https://apex.com"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-[#581c87] focus:border-[#581c87]"
                      />
                    </div>

                    {/* Phone for SMS test */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
                        Mobile Number (For Live SMS Test) *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+254 712 345 678 or +1 (555) 019-2834"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-[#581c87] focus:border-[#581c87]"
                      />
                    </div>
                  </div>

                  {/* Monthly Messaging Volume */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
                      Estimated Monthly SMS / Email Volume
                    </label>
                    <select
                      value={formData.volume}
                      onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded text-sm text-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-[#581c87] focus:border-[#581c87]"
                    >
                      {volumeOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Primary Objectives */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-2">
                      Messaging Services Needed
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {goalOptions.map((goal) => {
                        const isChecked = formData.goals.includes(goal);
                        return (
                          <button
                            key={goal}
                            type="button"
                            onClick={() => handleGoalToggle(goal)}
                            className={`p-2.5 text-left rounded text-xs font-medium border transition-colors flex items-center justify-between ${
                              isChecked
                                ? "bg-purple-50 border-[#581c87] text-[#581c87]"
                                : "bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300"
                            }`}
                          >
                            <span>{goal}</span>
                            {isChecked && (
                              <span className="w-3.5 h-3.5 rounded bg-[#581c87] text-white flex items-center justify-center text-[9px] shrink-0">
                                ✓
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Desired Sender ID & Notes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
                        Desired Branded Sender ID (Optional)
                      </label>
                      <input
                        type="text"
                        maxLength={11}
                        placeholder="e.g. APEXBRAND (Max 11 chars)"
                        value={formData.senderId}
                        onChange={(e) => setFormData({ ...formData, senderId: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-[#581c87] focus:border-[#581c87]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
                        Specific Technical Requirements
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Need SMPP, WooCommerce plugin, etc."
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-[#581c87] focus:border-[#581c87]"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#581c87] hover:bg-[#4a1572] disabled:opacity-75 text-white py-3 px-6 rounded text-sm font-semibold transition-colors shadow-xs"
                  >
                    {isSubmitting ? (
                      <span>Submitting Audit Request...</span>
                    ) : (
                      <>
                        <span>Request Free Deliverability Audit</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-zinc-400">
                    By submitting, you agree to our{" "}
                    <Link href="/terms-of-service" className="text-zinc-300 hover:text-white underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy-policy" className="text-zinc-300 hover:text-white underline">
                      Privacy Policy
                    </Link>
                    . We never share subscriber records or campaign logs.
                  </p>
                </form>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
