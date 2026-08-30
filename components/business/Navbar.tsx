"use client";

import React from "react";
import Link from "next/link";
import { LJKLogo } from "@/components/landing/LJKLogo";

interface BusinessNavbarProps {
  onToggleMobileSidebar?: () => void;
  onToggleCollapse?: () => void;
  isCollapsed?: boolean;
}

export function BusinessNavbar({
  onToggleMobileSidebar,
  onToggleCollapse,
  isCollapsed = false,
}: BusinessNavbarProps) {
  return (
    <header className="h-16 bg-white border-b border-zinc-200 sticky top-0 z-30 flex items-center justify-between px-3 sm:px-6">
      {/* Left side: Navigation toggles & Branding */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        {/* Mobile menu drawer trigger */}
        {onToggleMobileSidebar && (
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            className="p-2 -ml-1 rounded-md md:hidden text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
            aria-label="Open navigation menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        {/* Desktop Sidebar Collapse Toggle */}
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden md:flex items-center justify-center p-2 rounded-md text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
            title={isCollapsed ? "Expand sidebar (show labels)" : "Collapse sidebar (icons only)"}
            aria-label="Toggle sidebar collapse"
          >
            <svg
              className={`w-5 h-5 transition-transform duration-200 ${isCollapsed ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Logo & Portal Badge */}
        <Link href="/business/dashboard" className="flex items-center gap-2 shrink-0">
          <LJKLogo size="sm" showText={true} />
          <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-[#581c87] border border-purple-200">
            Business Portal
          </span>
        </Link>
      </div>

      {/* Right side: Quick Action / SMS Balance */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <Link
          href="/business/billing"
          className="inline-flex items-center gap-1.5 py-1.5 px-2.5 sm:px-3 rounded-md bg-purple-50 hover:bg-purple-100 text-[#581c87] text-xs font-semibold border border-purple-200 transition-colors"
          title="View SMS Balance & Pricing"
        >
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="hidden xs:inline">Balance:</span>
          <span className="font-bold">50 SMS</span>
        </Link>

        <Link
          href="/business/sms/broadcast"
          className="inline-flex items-center gap-1.5 py-1.5 px-2.5 sm:px-3 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs font-semibold rounded-md transition-colors shadow-xs"
        >
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          <span className="hidden sm:inline">Send SMS</span>
        </Link>
      </div>
    </header>
  );
}

export default BusinessNavbar;