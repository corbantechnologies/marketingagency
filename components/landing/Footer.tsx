import React from "react";
import Link from "next/link";
import { LJKLogo } from "./LJKLogo";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-950 text-zinc-300 pt-16 pb-12 border-t border-zinc-900" aria-label="LJK Agency Footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-zinc-800">
          
          {/* Brand Col (2 cols on LG) */}
          <div className="lg:col-span-2 space-y-4">
            <LJKLogo size="md" variant="white" />
            <p className="text-xs font-normal text-zinc-400 max-w-sm leading-relaxed">
              LJK Marketing Agency provides high-throughput Bulk SMS gateways, dedicated email marketing
              infrastructure, and omnichannel retention automations engineered for high-growth businesses.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-zinc-400">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-purple-300">
                <span className="w-1.5 h-1.5 rounded bg-emerald-400 animate-pulse" />
                Gateway Status: 100% Operational
              </span>
              <span>Direct Tier-1 Interconnects</span>
            </div>
          </div>

          {/* Col 1: Solutions */}
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-white">
              Messaging Services
            </div>
            <ul className="space-y-2 text-xs font-normal text-zinc-400">
              <li>
                <a href="#services" className="hover:text-purple-300 transition-colors">
                  Enterprise Bulk SMS
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-purple-300 transition-colors">
                  Transactional OTP & Alerts
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-purple-300 transition-colors">
                  High-Inbox Email Marketing
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-purple-300 transition-colors">
                  Dedicated IP Warming
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-purple-300 transition-colors">
                  Lifecycle Klaviyo Automations
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-purple-300 transition-colors">
                  REST API & SMPP 3.4
                </a>
              </li>
            </ul>
          </div>

          {/* Col 2: Infrastructure & Tools */}
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-white">
              Platform & Tools
            </div>
            <ul className="space-y-2 text-xs font-normal text-zinc-400">
              <li>
                <a href="#framework" className="hover:text-purple-300 transition-colors">
                  Deliverability Protocol
                </a>
              </li>
              <li>
                <a href="#results" className="hover:text-purple-300 transition-colors">
                  Delivery Case Studies
                </a>
              </li>
              <li>
                <a href="#calculator" className="hover:text-purple-300 transition-colors">
                  Messaging ROI Calculator
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-purple-300 transition-colors">
                  Gateway FAQs & SLA
                </a>
              </li>
              <li>
                <a href="#audit" className="hover:text-purple-300 transition-colors">
                  Claim 50 Test Credits
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Contact */}
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-white">
              Telecom Support
            </div>
            <div className="space-y-2 text-xs font-normal text-zinc-400">
              <div>
                <span className="text-zinc-500 block">Technical Support:</span>
                <a
                  href="mailto:support@ljkmarketingagency.co.ke"
                  className="text-purple-300 hover:underline"
                >
                  support@ljkmarketingagency.co.ke
                </a>
              </div>
              <div>
                <span className="text-zinc-500 block">Sales & Enterprise Routes:</span>
                <a
                  href="mailto:growth@ljkmarketingagency.co.ke"
                  className="text-purple-300 hover:underline"
                >
                  growth@ljkmarketingagency.co.ke
                </a>
              </div>
              <div>
                <span className="text-zinc-500 block">Emergency Gateway NOC:</span>
                <span className="text-zinc-300">+254 700 000 000</span>
              </div>
              <div className="pt-2">
                <a
                  href="/contact"
                  className="inline-flex items-center gap-1.5 text-[#d8b4fe] hover:text-white font-medium transition-colors"
                >
                  <span>Open Support Desk Form</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-normal text-zinc-500">
          <div>
            © {currentYear} LJK Marketing Agency LLC. All rights reserved. Direct Carrier Routing.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/contact" className="hover:text-zinc-300 transition-colors">
              Contact Desk
            </Link>
            <Link href="/pricing" className="hover:text-zinc-300 transition-colors">
              Pricing Plans
            </Link>
            <Link href="/#audit" className="hover:text-zinc-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/#audit" className="hover:text-zinc-300 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
