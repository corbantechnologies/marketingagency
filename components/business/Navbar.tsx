"use client";

import React from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { LJKLogo } from "@/components/landing/LJKLogo";

interface BusinessNavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export function BusinessNavbar({ onToggleSidebar }: BusinessNavbarProps) {
  const { data: session } = useSession();

  return (
    <header className="h-16 bg-white border-b border-zinc-200 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-4">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-2 rounded md:hidden text-zinc-600 hover:bg-zinc-100 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        <Link href="/business/dashboard" className="flex items-center gap-2">
          <LJKLogo size="sm" showText={true} />
          <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-[#581c87] border border-purple-200">
            Business Portal
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/business/billing"
          className="hidden sm:inline-flex items-center gap-1.5 py-1.5 px-3 rounded bg-purple-50 hover:bg-purple-100 text-[#581c87] text-xs font-semibold border border-purple-200 transition-colors"
        >
          <span>SMS Balance:</span>
          <span className="font-bold">50 Credits</span>
        </Link>

        <div className="hidden sm:flex flex-col text-right leading-tight">
          <span className="text-xs font-semibold text-zinc-900">
            {session?.user?.name || session?.user?.email || "Business Client"}
          </span>
          <span className="text-[11px] text-zinc-500 font-mono">
            {session?.user?.member_code || session?.user?.code || session?.user?.reference || "CLIENT"}
          </span>
        </div>

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/auth/login" })}
          className="py-1.5 px-3 rounded text-xs font-medium text-zinc-700 hover:text-red-700 hover:bg-red-50 border border-zinc-200 transition-colors cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}

export default BusinessNavbar;