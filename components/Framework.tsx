import React from "react";

export function Framework() {
  const steps = [
    {
      number: "01",
      title: "Deep Growth Audit & Market Intelligence",
      description:
        "We dissect your existing unit economics, past campaign performance, competitor ad creative, tracking infrastructure, and conversion funnels to pinpoint immediate high-leverage revenue opportunities.",
      highlights: ["Data & Pixel Audit", "Competitor Ad Teardown", "Unit Economics Assessment"],
    },
    {
      number: "02",
      title: "Bespoke Strategy & Creative Architecture",
      description:
        "Our strategists engineer a 90-day roadmap tailored to your margins. We build message-to-market fit, develop direct-response creative angles, and configure custom landing page experiences.",
      highlights: ["90-Day Roadmap", "Offer Structuring", "Creative Angle Production"],
    },
    {
      number: "03",
      title: "Omni-Channel Execution & Rapid Testing",
      description:
        "We launch high-velocity testing across paid search, social, and programmatic channels. Our proprietary multivariate framework isolates winning hooks, audiences, and landing page variants in real time.",
      highlights: ["Algorithmic Media Buying", "Creative Velocity Engine", "First-Party Attribution"],
    },
    {
      number: "04",
      title: "Data-Backed Scaling & Retention Compound",
      description:
        "Once efficiency thresholds are unlocked, we scale ad budgets aggressively while deploying lifecycle automation and CRO experiments to continuously expand customer lifetime value.",
      highlights: ["Budget Scaling Protocols", "LTV Expansion Systems", "Weekly Executive Briefings"],
    },
  ];

  return (
    <section id="framework" className="bg-white py-16 md:py-24 border-b border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-purple-50 border border-purple-200 text-xs font-semibold text-[#581c87] mb-3">
            The LJK Growth Architecture
          </div>
          <h2 className="text-xl font-semibold text-zinc-900 tracking-tight">
            Our 4-Stage Method for Predictable, Compounding Scale
          </h2>
          <p className="text-base font-normal text-zinc-600 mt-2">
            No guesswork. We rely on a battle-tested, data-engineered framework that systematically
            eliminates revenue leaks and accelerates profitable acquisition.
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
