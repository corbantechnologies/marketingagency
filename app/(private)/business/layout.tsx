"use client";

import React, { useState } from "react";
import { BusinessNavbar } from "@/components/business/Navbar";
import { BusinessSidebar } from "@/components/business/Sidebar";

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-zinc-50 selection:bg-[#581c87] selection:text-white overflow-hidden">
      <BusinessNavbar
        onToggleMobileSidebar={() => setIsMobileOpen(!isMobileOpen)}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isCollapsed={isCollapsed}
      />

      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        <BusinessSidebar
          isMobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full min-w-0 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}