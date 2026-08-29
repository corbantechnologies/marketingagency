import React from "react";
import Link from "next/link";
import { LJKLogo } from "@/components/landing/LJKLogo";
import { Toaster } from "react-hot-toast";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-between selection:bg-[#581c87] selection:text-white">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#18181b",
            color: "#ffffff",
            fontSize: "13px",
            borderRadius: "6px",
            padding: "10px 16px",
          },
          success: {
            iconTheme: {
              primary: "#a855f7",
              secondary: "#ffffff",
            },
          },
        }}
      />

      {/* Top Header */}
      <header className="w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" title="Return to Homepage">
            <LJKLogo size="sm" showText={true} />
          </Link>
          <div className="flex items-center gap-4 text-xs">
            <Link
              href="/"
              className="text-zinc-600 hover:text-zinc-900 transition-colors hidden sm:inline-block"
            >
              &larr; Back to agency site
            </Link>
            <div className="h-4 w-px bg-zinc-200 hidden sm:block" />
            <span className="text-zinc-500 font-medium">Portal Security v2.6</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md my-auto">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white py-4 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} LJK Marketing Agency. All rights reserved.</span>
          <div className="flex items-center gap-4 text-zinc-500">
            <Link href="/" className="hover:text-zinc-900 transition-colors">Privacy Policy</Link>
            <span>&bull;</span>
            <Link href="/" className="hover:text-zinc-900 transition-colors">Terms of Service</Link>
            <span>&bull;</span>
            <Link href="/" className="hover:text-zinc-900 transition-colors">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
