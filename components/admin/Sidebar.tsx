"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

interface AdminSidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  isCollapsed: boolean;
  onToggleCollapse?: () => void;
}

export function AdminSidebar({
  isMobileOpen,
  onCloseMobile,
  isCollapsed,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navLinks = [
    {
      label: "Overview",
      href: "/admin/dashboard",
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      label: "Agency Broadcast",
      href: "/admin/broadcast",
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      ),
    },
    {
      label: "Businesses",
      href: "/admin/businesses",
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      label: "Pricing & Plans",
      href: "/admin/plans",
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Users & Staff",
      href: "/admin/users",
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      label: "SMS Routes & DLR",
      href: "/admin/routing",
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      label: "Security & Audit",
      href: "/admin/audit",
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
  ];

  const userInitials =
    session?.user?.initials ||
    ((session?.user?.first_name || "")[0] || (session?.user?.name || "A")[0] || "A").toUpperCase();

  const userName =
    session?.user?.full_name ||
    session?.user?.name ||
    session?.user?.email?.split("@")[0] ||
    "Agency Admin";

  const userEmailOrCode =
    session?.user?.member_code ||
    session?.user?.code ||
    session?.user?.email ||
    "SUPER_ADMIN";

  return (
    <>
      <aside
        className={`
          fixed md:relative z-20 h-full bg-white border-r border-zinc-200 flex flex-col justify-between transition-all duration-200 ease-in-out shrink-0
          ${isMobileOpen ? "translate-x-0 w-64 shadow-2xl inset-y-0 left-0" : "-translate-x-full md:translate-x-0"}
          ${isCollapsed ? "md:w-18" : "md:w-64"}
        `}
      >
        {/* Navigation Links */}
        <div className="p-3 space-y-1 overflow-y-auto">
          {!isCollapsed && (
            <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 px-3 py-2 hidden md:block">
              Agency Console
            </div>
          )}

          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onCloseMobile}
                title={isCollapsed ? link.label : undefined}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-colors
                  ${isCollapsed ? "justify-center px-2" : ""}
                  ${
                    isActive
                      ? "bg-purple-50 text-[#581c87] font-semibold border-r-2 border-[#581c87]"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                  }
                `}
              >
                <span className={isActive ? "text-[#581c87]" : "text-zinc-500"}>
                  {link.icon}
                </span>
                {!isCollapsed && <span className="truncate">{link.label}</span>}
              </Link>
            );
          })}
        </div>

        {/* Bottom Section: Admin User Card & Sign Out */}
        <div className="border-t border-zinc-200 bg-zinc-50/70 p-3">
          {!isCollapsed ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#581c87] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                  {userInitials}
                </div>
                <div className="flex-1 min-w-0 leading-tight">
                  <div className="text-xs font-semibold text-zinc-900 truncate">
                    {userName}
                  </div>
                  <div className="text-[11px] text-zinc-500 font-mono truncate">
                    {userEmailOrCode}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/auth/login" })}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-semibold text-zinc-700 bg-white hover:text-red-700 hover:bg-red-50 border border-zinc-200 transition-colors shadow-2xs cursor-pointer"
              >
                <svg className="w-4 h-4 text-zinc-500 group-hover:text-red-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-9 h-9 rounded-full bg-[#581c87] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs"
                title={`${userName} (${userEmailOrCode})`}
              >
                {userInitials}
              </div>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/auth/login" })}
                className="p-2 rounded-md text-zinc-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Backdrop overlay for mobile drawer */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-10 md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}
    </>
  );
}

export default AdminSidebar;
