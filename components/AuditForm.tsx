"use client";

import React, { useState } from "react";

export function AuditForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    website: "",
    phone: "",
    spend: "$15,000 - $50,000/mo",
    goals: ["Paid Ads Scaling"],
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const budgetOptions = [
    "Under $10,000/mo",
    "$10,000 - $25,000/mo",
    "$25,000 - $75,000/mo",
    "$75,000 - $200,000/mo",
    "$200,000+/mo",
  ];

  const goalOptions = [
    "Paid Ads Scaling (Meta/Google)",
    "Technical SEO & Content Hub",
    "Landing Page & CRO Lift",
    "Email/SMS Lifecycle Retention",
    "Complete Full-Funnel Growth",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate backend submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1000);
  };

  return (
    <section id="audit" className="bg-white py-16 md:py-24 border-b border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Context & What's Included (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-purple-50 border border-purple-200 text-xs font-semibold text-[#581c87] mb-3">
              Complimentary Growth Audit
            </div>
            <h2 className="text-xl font-semibold text-zinc-900 tracking-tight mb-4">
              Get Your 14-Point Growth Audit & 90-Day Strategy Roadmap
            </h2>
            <p className="text-sm font-normal text-zinc-600 leading-relaxed mb-8">
              We do not do generic sales calls. Our senior strategists review your actual store or
              pipeline, inspect tracking pixels, and identify exact conversion bottlenecks before our
              very first conversation.
            </p>

            {/* What's in the audit list */}
            <div className="space-y-4 mb-8">
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded">
                <div className="text-xs font-semibold text-zinc-900 mb-1 flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-[#581c87] text-white flex items-center justify-center text-[10px]">
                    ✓
                  </span>
                  Paid Ad Account Architecture & Wasted Spend Teardown
                </div>
                <div className="text-xs font-normal text-zinc-500 pl-6">
                  Detailed analysis of audience overlaps, algorithmic bidding leaks, and ad fatigue.
                </div>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded">
                <div className="text-xs font-semibold text-zinc-900 mb-1 flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-[#581c87] text-white flex items-center justify-center text-[10px]">
                    ✓
                  </span>
                  Landing Page UX & Conversion Rate (CRO) Friction Analysis
                </div>
                <div className="text-xs font-normal text-zinc-500 pl-6">
                  Identification of mobile friction points, slow scripts, and cart drop-offs.
                </div>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded">
                <div className="text-xs font-semibold text-zinc-900 mb-1 flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-[#581c87] text-white flex items-center justify-center text-[10px]">
                    ✓
                  </span>
                  Competitor Intelligence & Ad Creative Gap Matrix
                </div>
                <div className="text-xs font-normal text-zinc-500 pl-6">
                  A snapshot of your top 3 competitors’ best-performing creative hooks and angles.
                </div>
              </div>
            </div>

            {/* Direct Contact Info */}
            <div className="p-4 bg-purple-50/70 border border-purple-200 rounded text-xs space-y-1.5">
              <div className="font-semibold text-purple-950">Direct Agency Contact:</div>
              <div className="text-zinc-600">Email: <a href="mailto:growth@ljkmarketingagency.com" className="text-[#581c87] font-medium hover:underline">growth@ljkmarketingagency.com</a></div>
              <div className="text-zinc-600">Offices: New York · Austin · London</div>
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
                    Audit Request Received!
                  </h3>
                  <p className="text-sm font-normal text-zinc-600 max-w-md mx-auto">
                    Thank you, <span className="font-semibold text-zinc-800">{formData.name}</span>. A senior growth strategist at LJK has been assigned to <span className="font-semibold text-zinc-800">{formData.website || "your brand"}</span>. You will receive your custom 14-point audit roadmap within 24 business hours.
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
                        spend: "$15,000 - $50,000/mo",
                        goals: ["Paid Ads Scaling"],
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
                      Request Your Free Growth Audit
                    </h3>
                    <p className="text-xs font-normal text-zinc-500 mt-0.5">
                      Confidential audit. No obligations. 100% actionable data.
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
                        placeholder="Sarah Jenkins"
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
                        placeholder="sarah@yourbrand.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-[#581c87] focus:border-[#581c87]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Website */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
                        Website / Domain *
                      </label>
                      <input
                        type="url"
                        required
                        placeholder="https://yourbrand.com"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-[#581c87] focus:border-[#581c87]"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
                        Phone (Optional)
                      </label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 019-2834"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-[#581c87] focus:border-[#581c87]"
                      />
                    </div>
                  </div>

                  {/* Monthly Ad Budget */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
                      Current Monthly Marketing Budget
                    </label>
                    <select
                      value={formData.spend}
                      onChange={(e) => setFormData({ ...formData, spend: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded text-sm text-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-[#581c87] focus:border-[#581c87]"
                    >
                      {budgetOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Primary Goals */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-2">
                      Primary Growth Objectives
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

                  {/* Notes */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
                      Tell us about your target goals or current bottlenecks
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Currently spending $30k/mo on Meta, want to expand into Google Search and improve our conversion rate..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-[#581c87] focus:border-[#581c87]"
                    />
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
                        <span>Claim Your 14-Point Growth Audit</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-zinc-400">
                    Strict privacy guaranteed. We never sell your data or share proprietary brand metrics.
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
