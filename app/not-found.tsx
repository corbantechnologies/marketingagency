import React from "react";
import Link from "next/link";
import { LJKLogo } from "@/components/landing/LJKLogo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-between selection:bg-[#581c87] selection:text-white">
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-zinc-200 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <LJKLogo size="sm" showText={true} />
        </Link>
        <Link
          href="/"
          className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition-colors"
        >
          &larr; Return to Home
        </Link>
      </header>

      {/* 404 Main Body */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-lg text-center bg-white border border-zinc-200 rounded-2xl p-8 sm:p-12 shadow-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-50 text-[#581c87] font-extrabold text-2xl mb-4 border border-purple-100">
            404
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight mb-2">
            Page Not Found
          </h1>

          <p className="text-sm text-zinc-600 max-w-md mx-auto mb-8 leading-relaxed">
            The page or resource you are looking for doesn&apos;t exist, has been moved, or is under scheduled maintenance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/business/dashboard"
              className="w-full sm:w-auto py-2.5 px-5 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors shadow-xs"
            >
              Go to Dashboard
            </Link>

            <Link
              href="/"
              className="w-full sm:w-auto py-2.5 px-5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs sm:text-sm font-semibold rounded-lg transition-colors"
            >
              Back to Homepage
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-100 text-xs text-zinc-400">
            Need assistance? Reach out to our 24/7 telecom support team at{" "}
            <Link href="/contact" className="text-[#581c87] hover:underline font-medium">
              Support Center
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white py-4 text-center text-xs text-zinc-500">
        &copy; {new Date().getFullYear()} LJK Marketing Agency. All rights reserved.
      </footer>
    </div>
  );
}
