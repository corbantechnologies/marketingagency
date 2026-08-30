"use client";

import React from "react";
import Link from "next/link";
import { LJKLogo } from "@/components/landing/LJKLogo";

interface AdminNavbarProps {
  onToggleMobileSidebar?: () => void;
  onToggleCollapse?: () => void;
  isCollapsed?: boolean;
}

export function AdminNavbar({
  onToggleMobileSidebar,
  onToggleCollapse,
  isCollapsed = false,
}: AdminNavbarProps) {
  return (
    <header className="h-16 bg-white border-b border-zinc-200 sticky top-0 z-30 flex items-center justify-between px-3 sm:px-6">
      {/* Left side: Toggles & Branding */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        {/* Mobile menu drawer trigger */}
        {onToggleMobileSidebar && (
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            className="p-2 -ml-1 rounded-md md:hidden text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
            aria-label="Open admin navigation menu"
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
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar (icons only)"}
            aria-label="Toggle admin sidebar collapse"
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

        <Link href="/admin/dashboard" className="flex items-center gap-2 shrink-0">
          <LJKLogo size="sm" showText={true} />
          <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
            Admin Console
          </span>
        </Link>
      </div>

      {/* Right side: Live Gateway Status indicator */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-zinc-50 border border-zinc-200 text-xs text-zinc-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="hidden sm:inline">Telecom Gateway: <strong>1,200 msg/s</strong></span>
          <span className="sm:hidden font-semibold text-emerald-600">Active</span>
        </div>
      </div>
    </header>
  );
}

export default AdminNavbar;