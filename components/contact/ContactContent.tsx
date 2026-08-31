/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

export function ContactContent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    inquiryType: "Bulk SMS & Pricing",
    volume: "10,000 - 50,000 SMS / mo",
    senderId: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const inquiryTypes = [
    "Bulk SMS & Pricing",
    "Custom Sender ID",
    "Email Marketing & Inboxing",
    "Developer REST API / SMPP",
    "Agency Services & Growth",
    "Billing & Account Support",
  ];

  const volumeOptions = [
    "Under 10,000 messages / mo",
    "10,000 - 50,000 messages / mo",
    "50,000 - 200,000 messages / mo",
    "200,000 - 1,000,000+ messages / mo",
    "Enterprise 1M+ Monthly Volume",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit message");
      }

      toast.success("Inquiry sent! A confirmation email is on its way.");
      setIsSubmitted(true);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-purple-50 border border-purple-200 text-xs font-semibold text-[#581c87] mb-3">
            Direct Messaging & Telecom Support Desk
          </div>
          <h1 className="text-xl font-semibold text-zinc-900 tracking-tight mb-3">
            Connect With Our Nairobi Growth & Messaging Engineers
          </h1>
          <p className="text-base font-normal text-zinc-600">
            Have questions about custom Sender ID registration, wholesale carrier routes, SMPP
            connectivity, or email deliverability? We respond in under 15 minutes during business hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Left Column: Direct Channels & SLA Info (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">

            {/* Live Response SLA Badge */}
            <div className="bg-purple-50 border border-purple-200 rounded p-5">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#581c87] mb-1">
                <span className="w-2 h-2 rounded bg-emerald-500 animate-pulse" />
                Live Desk Available · 8:00 AM – 6:00 PM EAT
              </div>
              <p className="text-xs font-normal text-zinc-600 leading-relaxed">
                Our support team and telecom NOC operators are based in Nairobi, providing real-time
                route monitoring and fast-track regulator approvals.
              </p>
            </div>

            {/* Direct Contact Cards */}
            <div className="bg-zinc-50 border border-zinc-200 rounded p-6 space-y-5">
              <h2 className="text-sm font-semibold text-zinc-900">
                Direct Contact Channels
              </h2>

              {/* Email Support */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-white border border-zinc-200 flex items-center justify-center text-[#581c87] shrink-0 mt-0.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-xs">
                  <div className="font-semibold text-zinc-900">Sales & Enterprise Inquiries</div>
                  <a
                    href="mailto:growth@ljkmarketingagency.co.ke"
                    className="text-[#581c87] hover:underline font-medium block mt-0.5"
                  >
                    growth@ljkmarketingagency.co.ke
                  </a>
                  <a
                    href="mailto:support@ljkmarketingagency.co.ke"
                    className="text-zinc-500 hover:text-zinc-800 block"
                  >
                    support@ljkmarketingagency.co.ke
                  </a>
                </div>
              </div>

              {/* Telephone / WhatsApp */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-white border border-zinc-200 flex items-center justify-center text-[#581c87] shrink-0 mt-0.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="text-xs">
                  <div className="font-semibold text-zinc-900">Direct Telephone & WhatsApp</div>
                  <div className="text-zinc-700 mt-0.5">+254 768 978 865</div>
                  <span className="text-zinc-400">Emergency NOC Available 24/7 for Enterprise SLA</span>
                </div>
              </div>

              {/* Office Location */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-white border border-zinc-200 flex items-center justify-center text-[#581c87] shrink-0 mt-0.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="text-xs">
                  <div className="font-semibold text-zinc-900">Headquarters</div>
                  <div className="text-zinc-600 mt-0.5">Nairobi, Kenya</div>
                  <div className="text-zinc-400">Serving Kenya & East Africa Regional Hubs</div>
                </div>
              </div>

              {/* Quick WhatsApp Action */}
              <div className="pt-2">
                <a
                  href="https://wa.me/254768978865?text=Hello%20LJK%20Marketing%20Agency,%20I%20have%20an%20inquiry%20regarding%20Bulk%20SMS%20and%20messaging."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-4 rounded text-xs font-semibold transition-colors shadow-xs"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                  </svg>
                  <span>Chat on WhatsApp Directly</span>
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Form with Resend Integration (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-zinc-200 rounded p-6 sm:p-8 shadow-xs">

              {isSubmitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-12 h-12 rounded bg-purple-50 border border-purple-200 text-[#581c87] flex items-center justify-center mx-auto">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-900">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-sm font-normal text-zinc-600 max-w-md mx-auto">
                    Thank you, <span className="font-semibold text-zinc-800">{formData.name}</span>. We have emailed a receipt confirmation to <span className="font-semibold text-zinc-800">{formData.email}</span>. A senior messaging specialist will review your request and get in touch shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        name: "",
                        email: "",
                        phone: "",
                        website: "",
                        inquiryType: "Bulk SMS & Pricing",
                        volume: "10,000 - 50,000 SMS / mo",
                        senderId: "",
                        message: "",
                      });
                    }}
                    className="inline-flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold px-4 py-2 rounded transition-colors"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="border-b border-zinc-100 pb-4 mb-2">
                    <h2 className="text-base font-semibold text-zinc-900">
                      Send an Inquiry or Request Custom Rates
                    </h2>
                    <p className="text-xs font-normal text-zinc-500 mt-0.5">
                      Fill in the details below. Our team receives your submission immediately via Resend.
                    </p>
                  </div>

                  {/* Inquiry Topic Selector */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-2">
                      Inquiry Topic / Service Needed
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {inquiryTypes.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({ ...formData, inquiryType: type })}
                          className={`p-2.5 text-left rounded text-xs font-medium border transition-colors ${formData.inquiryType === type
                            ? "bg-purple-50 border-[#581c87] text-[#581c87]"
                            : "bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300"
                            }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
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
                        placeholder="e.g. Grace Wanjiku"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-[#581c87] focus:border-[#581c87]"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
                        Work / Business Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="grace@company.co.ke"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-[#581c87] focus:border-[#581c87]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
                        Phone / WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+254 712 345 678"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-[#581c87] focus:border-[#581c87]"
                      />
                    </div>

                    {/* Website / Business Name */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
                        Company or Brand Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Apex Health Ltd"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-[#581c87] focus:border-[#581c87]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Monthly Volume */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
                        Estimated Monthly Messaging Volume
                      </label>
                      <select
                        value={formData.volume}
                        onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded text-sm text-zinc-900 focus:outline-hidden focus:ring-1 focus:ring-[#581c87] focus:border-[#581c87]"
                      >
                        {volumeOptions.map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Desired Sender ID */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
                        Desired Alphanumeric Sender ID
                      </label>
                      <input
                        type="text"
                        maxLength={11}
                        placeholder="e.g. APEXCLINIC (Max 11 chars)"
                        value={formData.senderId}
                        onChange={(e) => setFormData({ ...formData, senderId: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-[#581c87] focus:border-[#581c87]"
                      />
                    </div>
                  </div>

                  {/* Message / Requirements */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
                      Tell us about your requirements or current bottlenecks
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Describe what you want to achieve, your current SMS provider issues, or technical integration requirements..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
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
                      <span>Sending Your Message...</span>
                    ) : (
                      <>
                        <span>Submit Inquiry & Receive Confirmation</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-zinc-400">
                    By submitting, you agree to our{" "}
                    <Link href="/terms-of-service" className="text-zinc-600 hover:text-zinc-900 underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy-policy" className="text-zinc-600 hover:text-zinc-900 underline">
                      Privacy Policy
                    </Link>
                    . Auto-confirmation dispatched to your inbox via Resend.
                  </p>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
