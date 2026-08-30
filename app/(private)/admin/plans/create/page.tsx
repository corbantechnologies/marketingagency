"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreatePlanForm } from "@/forms/plans/CreatePlanForm";

export default function CreatePlanPage() {
  const router = useRouter();

  return (
    <div className="space-y-6 w-full max-w-none">
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
            <Link href="/admin/dashboard" className="hover:text-zinc-900">Admin Console</Link>
            <span>/</span>
            <Link href="/admin/plans" className="hover:text-zinc-900">Pricing &amp; Plans</Link>
            <span>/</span>
            <span className="text-zinc-900 font-medium">Create Plan</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            Create New Pricing Plan
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 mt-0.5">
            Define a unified tier that handles Monthly, Annual (with discount %), and Pay-As-You-Go rates in a single entry.
          </p>
        </div>

        <Link
          href="/admin/plans"
          className="shrink-0 whitespace-nowrap py-2.5 px-4 rounded-lg text-xs font-semibold text-zinc-700 bg-white hover:bg-zinc-50 border border-zinc-200 transition-colors shadow-2xs inline-flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Plans</span>
        </Link>
      </div>

      {/* Main Form Container */}
      <div className="bg-white border border-zinc-200 rounded-xl p-6 sm:p-8 shadow-xs">
        <CreatePlanForm
          onSuccess={() => router.push("/admin/plans")}
          onCancel={() => router.push("/admin/plans")}
        />
      </div>
    </div>
  );
}
