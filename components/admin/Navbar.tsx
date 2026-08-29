"use client";

import React from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { LJKLogo } from "@/components/landing/LJKLogo";

interface AdminNavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export function AdminNavbar({ onToggleSidebar }: AdminNavbarProps) {
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
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <LJKLogo size="sm" showText={true} />
          <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
            Admin Console
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded bg-zinc-50 border border-zinc-200 text-xs text-zinc-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Carrier SMPP Gateway: <strong>1,200 msg/s</strong></span>
        </div>

        <div className="hidden sm:flex flex-col text-right leading-tight">
          <span className="text-xs font-semibold text-zinc-900">
            {session?.user?.name || session?.user?.email || "Administrator"}
          </span>
          <span className="text-[11px] text-zinc-500 font-mono">
            {session?.user?.member_code || session?.user?.reference || "SUPER_ADMIN"}
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

export default AdminNavbar;