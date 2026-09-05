"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LJKLogo } from "./LJKLogo";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "User Guide", href: "/guide" },
    { label: "Services", href: "/#services" },
    { label: "Case Studies", href: "/#results" },
    { label: "ROI Calculator", href: "/#calculator" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${isScrolled
          ? "bg-white/95 backdrop-blur-sm border-b border-zinc-200 shadow-xs"
          : "bg-white border-b border-zinc-100"
        }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">

          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0 focus:outline-hidden focus:ring-1 focus:ring-[#581c87] rounded"
            aria-label="LJK Marketing Agency Home"
          >
            <LJKLogo size="md" />
          </Link>

          {/* Desktop Navigation Links (Visible on Large Screens 1024px+ to prevent iPad overlap) */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-7" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs xl:text-sm font-medium text-zinc-600 hover:text-[#581c87] transition-colors py-1 focus:outline-hidden focus:ring-1 focus:ring-[#581c87] rounded whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Action CTAs: Desktop (lg+) */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <Link
              href="/pricing"
              className="text-xs xl:text-sm font-semibold text-zinc-700 hover:text-[#581c87] px-3 py-2 rounded transition-colors whitespace-nowrap"
            >
              View Rates
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center bg-[#581c87] text-white hover:bg-[#4a1572] px-4 py-2 rounded text-xs xl:text-sm font-medium transition-colors shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#581c87] focus:ring-offset-2 whitespace-nowrap"
            >
              Get Started
            </Link>
          </div>

          {/* Tablet & Mobile Right Side (Below 1024px / iPad and Mobile) */}
          <div className="flex lg:hidden items-center gap-2 shrink-0">
            <Link
              href="/pricing"
              className="hidden sm:inline-flex items-center justify-center border border-zinc-200 hover:bg-zinc-50 text-zinc-800 px-3 py-1.5 rounded text-xs font-semibold transition-colors"
            >
              Rates
            </Link>
            <Link
              href="/#audit"
              className="inline-flex items-center justify-center bg-[#581c87] text-white hover:bg-[#4a1572] px-3 py-1.5 rounded text-xs font-semibold transition-colors shadow-2xs"
            >
              Free Audit
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-zinc-700 hover:text-[#581c87] hover:bg-zinc-100 focus:outline-hidden cursor-pointer"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile & iPad Menu Drawer (lg:hidden) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-zinc-200 px-4 sm:px-6 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pb-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-zinc-700 hover:text-[#581c87] hover:bg-purple-50 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-zinc-100 flex flex-col sm:flex-row gap-2">
            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-lg text-xs font-semibold text-zinc-800 border border-zinc-200 hover:bg-zinc-50 transition-colors"
            >
              Explore Pricing &amp; Rates
            </Link>
            <Link
              href="/#audit"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-[#581c87] text-white py-2.5 rounded-lg text-xs font-semibold hover:bg-[#4a1572] transition-colors shadow-xs"
            >
              Request Free Growth Audit
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
