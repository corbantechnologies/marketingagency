"use client";

import React, { useState } from "react";
import { BusinessNavbar } from "@/components/business/Navbar";
import { BusinessSidebar } from "@/components/business/Sidebar";
import { Toaster } from "react-hot-toast";

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col selection:bg-[#581c87] selection:text-white">
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />

      <BusinessNavbar
        onToggleMobileSidebar={() => setIsMobileOpen(!isMobileOpen)}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isCollapsed={isCollapsed}
      />

      <div className="flex-1 flex overflow-hidden">
        <BusinessSidebar
          isMobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />

        <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl w-full min-w-0 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}