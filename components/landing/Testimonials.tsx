import React from "react";

export function Testimonials() {
  const testimonials = [
    {
      quote:
        "LJK completely revamped our paid acquisition and SMS retention funnel. In 90 days, they lowered our blended CAC by 34% while scaling our monthly marketing spend from KES 180,000 to KES 950,000 profitably. Their direct route transparency is unlike any provider we've worked with.",
      name: "Marcus Vance",
      role: "VP of Growth",
      company: "Velox Athletics",
      stats: "Scaled from KES 15M to KES 62M ARR (~$480k)",
    },
    {
      quote:
        "Before LJK, we struggled to rank organically for high-intent search terms and our transactional OTP SMS was suffering from carrier delays. Their technical routing and dedicated IP warming drove a 310% increase in inbound enterprise pipeline.",
      name: "Elena Rostova",
      role: "Chief Marketing Officer",
      company: "CipherShield SaaS",
      stats: "310% Growth in Inbound Pipeline",
    },
    {
      quote:
        "The creative velocity and SMS broadcast speed LJK delivers is unbelievable. They test 40+ fresh messaging angles and video hooks every single month, delivering a consistent 5.4x blended return on marketing spend.",
      name: "David Chen",
      role: "Founder & CEO",
      company: "Solstice Botanicals",
      stats: "5.4x Blended ROAS on Campaigns",
    },
  ];

  return (
    <section className="bg-white py-16 md:py-24 border-b border-zinc-100" aria-label="Client Testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-purple-50 border border-purple-200 text-xs font-semibold text-[#581c87] mb-3">
            Client Endorsements
          </div>
          <h2 className="text-xl font-semibold text-zinc-900 tracking-tight">
            Trusted by Visionary Founders and Growth Leaders
          </h2>
          <p className="text-base font-normal text-zinc-600 mt-2">
            Here is what marketing executives and founders say about scaling with LJK Marketing Agency.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-zinc-50 border border-zinc-200 rounded p-6 flex flex-col justify-between"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-[#581c87] mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-sm font-normal text-zinc-700 leading-relaxed italic mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              {/* Author Details */}
              <div className="pt-4 border-t border-zinc-200/80">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-zinc-900">{t.name}</div>
                    <div className="text-xs font-normal text-zinc-500">
                      {t.role} · {t.company}
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-xs font-semibold text-[#581c87] bg-purple-50 px-2 py-0.5 rounded border border-purple-100 inline-block">
                  {t.stats}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
