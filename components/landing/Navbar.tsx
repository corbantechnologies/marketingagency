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
    { label: "Services", href: "#services" },
    { label: "Growth Framework", href: "#framework" },
    { label: "Case Studies", href: "#results" },
    { label: "ROI Calculator", href: "#calculator" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-sm border-b border-zinc-200 shadow-xs"
          : "bg-white border-b border-zinc-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 focus:outline-hidden focus:ring-1 focus:ring-[#581c87] rounded"
            aria-label="LJK Marketing Agency Home"
          >
            <LJKLogo size="md" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-zinc-600 hover:text-[#581c87] transition-colors py-1 focus:outline-hidden focus:ring-1 focus:ring-[#581c87] rounded"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="#audit"
              className="inline-flex items-center justify-center bg-[#581c87] text-white hover:bg-[#4a1572] px-4 py-2 rounded text-sm font-medium transition-colors shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#581c87] focus:ring-offset-2"
            >
              Get Free Audit
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href="#audit"
              className="inline-flex items-center justify-center bg-[#581c87] text-white px-3 py-1.5 rounded text-xs font-medium"
            >
              Audit
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded text-zinc-600 hover:text-[#581c87] hover:bg-zinc-100 focus:outline-hidden"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <svg
                className="w-6 h-6"
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

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-zinc-200 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-zinc-700 hover:text-[#581c87] hover:bg-purple-50 rounded"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 border-t border-zinc-100 flex flex-col gap-2">
            <a
              href="#audit"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-[#581c87] text-white py-2.5 rounded text-sm font-medium hover:bg-[#4a1572]"
            >
              Request Free Growth Audit
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
