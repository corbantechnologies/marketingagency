import React from "react";
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
              LJK Marketing Agency is a premier performance marketing and revenue growth unit. We
              engineer full-funnel paid media, search visibility, conversion funnels, and retention
              systems for high-growth brands worldwide.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-zinc-400">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-purple-300">
                <span className="w-1.5 h-1.5 rounded bg-emerald-400" />
                Accepting New Clients
              </span>
              <span>New York · Austin · London</span>
            </div>
          </div>

          {/* Col 1: Solutions */}
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-white">
              Capabilities
            </div>
            <ul className="space-y-2 text-xs font-normal text-zinc-400">
              <li>
                <a href="#services" className="hover:text-purple-300 transition-colors">
                  Performance Paid Ads
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-purple-300 transition-colors">
                  Technical SEO & Content
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-purple-300 transition-colors">
                  Conversion Rate Optimization
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-purple-300 transition-colors">
                  Lifecycle Email & SMS
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-purple-300 transition-colors">
                  Creative & UGC Production
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-purple-300 transition-colors">
                  Next.js Growth Landing Pages
                </a>
              </li>
            </ul>
          </div>

          {/* Col 2: Framework & Case Studies */}
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-white">
              Growth Engine
            </div>
            <ul className="space-y-2 text-xs font-normal text-zinc-400">
              <li>
                <a href="#framework" className="hover:text-purple-300 transition-colors">
                  The 4-Stage Architecture
                </a>
              </li>
              <li>
                <a href="#results" className="hover:text-purple-300 transition-colors">
                  Case Studies & ROI Data
                </a>
              </li>
              <li>
                <a href="#calculator" className="hover:text-purple-300 transition-colors">
                  Interactive Revenue Modeler
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-purple-300 transition-colors">
                  Agency FAQs & Terms
                </a>
              </li>
              <li>
                <a href="#audit" className="hover:text-purple-300 transition-colors">
                  14-Point Growth Audit
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Contact */}
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-white">
              Get in Touch
            </div>
            <div className="space-y-2 text-xs font-normal text-zinc-400">
              <div>
                <span className="text-zinc-500 block">General Inquiries:</span>
                <a
                  href="mailto:contact@ljkmarketingagency.com"
                  className="text-purple-300 hover:underline"
                >
                  contact@ljkmarketingagency.com
                </a>
              </div>
              <div>
                <span className="text-zinc-500 block">New Partnerships:</span>
                <a
                  href="mailto:growth@ljkmarketingagency.com"
                  className="text-purple-300 hover:underline"
                >
                  growth@ljkmarketingagency.com
                </a>
              </div>
              <div>
                <span className="text-zinc-500 block">Direct Line:</span>
                <span className="text-zinc-300">+1 (800) 555-0199</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-normal text-zinc-500">
          <div>
            © {currentYear} LJK Marketing Agency LLC. All rights reserved. Built for high-growth brands.
          </div>
          <div className="flex items-center gap-6">
            <a href="#audit" className="hover:text-zinc-300 transition-colors">
              Privacy Policy
            </a>
            <a href="#audit" className="hover:text-zinc-300 transition-colors">
              Terms of Service
            </a>
            <a href="#audit" className="hover:text-zinc-300 transition-colors">
              Client Portal
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
