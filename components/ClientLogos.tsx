import React from "react";

export function ClientLogos() {
  const partners = [
    { name: "Google Marketing Platform", label: "Premier Partner", type: "Ad Network" },
    { name: "Meta Business Partner", label: "Elite Tier", type: "Paid Social" },
    { name: "Shopify Plus", label: "Commerce Expert", type: "E-Commerce" },
    { name: "Klaviyo", label: "Master Agency", type: "Lifecycle" },
    { name: "TikTok For Business", label: "Certified Agency", type: "Paid Media" },
    { name: "HubSpot", label: "Platinum Partner", type: "Inbound & CRM" },
  ];

  return (
    <section className="bg-white py-10 border-b border-zinc-100" aria-label="Trusted Partners & Accreditations">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-6">
          Certified Marketing Partnerships & Enterprise Integrations
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="flex flex-col items-center justify-center p-3.5 bg-zinc-50 hover:bg-purple-50/50 border border-zinc-200 hover:border-[#581c87]/30 rounded transition-colors text-center group"
            >
              <span className="text-xs font-semibold text-zinc-800 group-hover:text-[#581c87] transition-colors">
                {partner.name}
              </span>
              <span className="text-[11px] font-normal text-zinc-500 mt-0.5">
                {partner.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
