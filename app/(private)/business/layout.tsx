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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col selection:bg-[#581c87] selection:text-white">
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />

      <BusinessNavbar
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex-1 flex">
        <BusinessSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl">
          {children}
        </main>
      </div>
    </div>
  );
}