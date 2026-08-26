import React from "react";

export function ClientLogos() {
  const partners = [
    { name: "Direct Telecom Routes", label: "Tier-1 Carrier Gateway", type: "SMS Infrastructure" },
    { name: "SMPP 3.4 & REST API", label: "High Throughput", type: "Developer Gateway" },
    { name: "Klaviyo & Mailchimp", label: "Certified Partner", type: "Lifecycle Email" },
    { name: "AWS SES & SendGrid", label: "Enterprise Inboxing", type: "Email Infrastructure" },
    { name: "Shopify & WooCommerce", label: "Automated Triggers", type: "E-Commerce Sync" },
    { name: "Meta & Google Ads", label: "Opt-In Growth Engine", type: "Subscriber Acquisition" },
  ];

  return (
    <section className="bg-white py-10 border-b border-zinc-100" aria-label="Carrier & Infrastructure Integrations">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-6">
          Direct Telecom Routing & Enterprise Messaging Integrations
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
