"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

interface BusinessSidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  isCollapsed: boolean;
  onToggleCollapse?: () => void;
}

export function BusinessSidebar({
  isMobileOpen,
  onCloseMobile,
  isCollapsed,
}: BusinessSidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navLinks = [
    {
      label: "Overview",
      href: "/business/dashboard",
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      label: "Guides & Site Tour",
      href: "/business/guide",
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      label: "Send Bulk SMS",
      href: "/business/sms/broadcast",
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      ),
    },
    {
      label: "Templates",
      href: "/business/templates",
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
    },
    {
      label: "Contacts & Groups",
      href: "/business/contacts",
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      label: "Sender IDs",
      href: "/business/sender-ids",
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
    },
    {
      label: "Delivery Reports",
      href: "/business/reports",
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      label: "Top Up Credits",
      href: "/business/billing",
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
    },
    {
      label: "Developer API",
      href: "/business/developer",
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    },
    {
      label: "Settings",
      href: "/business/settings",
      icon: (
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  const userInitials =
    session?.user?.initials ||
    ((session?.user?.first_name || "")[0] || (session?.user?.name || "B")[0] || "B").toUpperCase();

  const userName =
    session?.user?.full_name ||
    session?.user?.name ||
    session?.user?.email?.split("@")[0] ||
    "Business Client";

  const userEmailOrCode =
    session?.user?.member_code ||
    session?.user?.code ||
    session?.user?.email ||
    "Client Account";

  return (
    <>
      <aside
        className={`
          fixed md:sticky top-16 z-20 h-[calc(100vh-4rem)] bg-white border-r border-zinc-200 flex flex-col justify-between transition-all duration-200 ease-in-out
          ${isMobileOpen ? "translate-x-0 w-64 shadow-xl" : "-translate-x-full md:translate-x-0"}
          ${isCollapsed ? "md:w-18" : "md:w-64"}
        `}
      >
        {/* Navigation Section */}
        <div className="p-3 space-y-1 overflow-y-auto">
          {!isCollapsed && (
            <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 px-3 py-2 hidden md:block">
              Messaging Tools
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
                      ? "bg-purple-50 text-[#581c87] font-semibold"
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

        {/* Bottom Section: User Card & Sign Out */}
        <div className="border-t border-zinc-200 bg-zinc-50/70 p-3">
          {/* Expanded View on Desktop / Mobile */}
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
            /* Collapsed Icon-Only View */
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

export default BusinessSidebar;
