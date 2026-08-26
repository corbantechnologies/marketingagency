import React from "react";

export function Framework() {
  const steps = [
    {
      number: "01",
      title: "Deliverability & Gateway Architecture Audit",
      description:
        "We inspect your historical database hygiene, carrier spam filters, domain authentication (SPF/DKIM/DMARC), IP health, and opt-in compliance to eliminate bounce rates and delivery drops.",
      highlights: ["Database Scrubbing & Verification", "Sender ID / Domain Verification", "Opt-In Compliance Audit"],
    },
    {
      number: "02",
      title: "Telecom Route & Dedicated IP Provisioning",
      description:
        "We establish Tier-1 direct carrier routes, register custom alphanumeric sender IDs, provision dedicated email sending IPs, and execute gradual warming schedules for primary inbox delivery.",
      highlights: ["Tier-1 Carrier Direct Interconnect", "Dedicated IP Warming Protocol", "Branded Sender ID Registry"],
    },
    {
      number: "03",
      title: "Automated Triggers & High-Converting Copy",
      description:
        "We configure real-time transactional hooks (OTPs, order tracking, payment alerts) alongside automated multi-channel marketing flows (cart abandonment, flash sales, customer VIP drips).",
      highlights: ["High-Impact SMS Copy & Hooks", "Dynamic Email HTML Templates", "Webhook & Triggered API Flows"],
    },
    {
      number: "04",
      title: "High-Throughput Dispatch & Real-Time Analytics",
      description:
        "We broadcast campaigns with sub-second latency across hundreds of thousands of contacts while continuously tracking delivery receipts (DLR), open rates, click conversions, and opt-out rates.",
      highlights: ["50k SMS/min Gateway Velocity", "Live DLR Status Callbacks", "Continuous A/B Message Testing"],
    },
  ];

  return (
    <section id="framework" className="bg-white py-16 md:py-24 border-b border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-purple-50 border border-purple-200 text-xs font-semibold text-[#581c87] mb-3">
            The LJK Messaging Pipeline
          </div>
          <h2 className="text-xl font-semibold text-zinc-900 tracking-tight">
            Our 4-Stage Protocol for 99.4% Message Deliverability & High ROI
          </h2>
          <p className="text-base font-normal text-zinc-600 mt-2">
            Engineered to ensure your messages hit the primary inbox and handset SMS notifications
            in seconds, without carrier blocks or spam filters.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-zinc-50 hover:bg-purple-50/40 border border-zinc-200 hover:border-[#581c87]/40 rounded p-6 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Step Number Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-white bg-[#581c87] px-2.5 py-1 rounded">
                    Phase {step.number}
                  </span>
                  <div className="w-2 h-2 rounded bg-[#581c87]/30" />
                </div>

                <h3 className="text-base font-semibold text-zinc-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm font-normal text-zinc-600 leading-relaxed mb-6">
                  {step.description}
                </p>
              </div>

              {/* Highlights */}
              <div className="pt-4 border-t border-zinc-200/70 space-y-1.5">
                {step.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-medium text-purple-950">
                    <span className="w-1.5 h-1.5 rounded bg-[#581c87]" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
