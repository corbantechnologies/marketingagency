"use client";

import React, { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFetchPlan } from "@/hooks/plans/actions";
import { UpdatePlanForm } from "@/forms/plans/UpdatePlanForm";

interface EditPlanPageProps {
  params: Promise<{ reference: string }>;
}

export default function EditPlanPage({ params }: EditPlanPageProps) {
  const router = useRouter();
  const { reference } = use(params);
  const { data: plan, isLoading, error } = useFetchPlan(reference);

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
            <span className="text-zinc-900 font-medium">Edit: {reference}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            Modify Plan: {plan?.name || reference}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 mt-0.5">
            Update pricing rates, annual discounts, limits, and highlighted features.
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

      {/* Main Container */}
      <div className="bg-white border border-zinc-200 rounded-xl p-6 sm:p-8 shadow-xs">
        {isLoading ? (
          <div className="py-20 text-center text-xs text-zinc-500">
            Loading plan details for {reference}...
          </div>
        ) : error || !plan ? (
          <div className="py-16 text-center space-y-3">
            <div className="text-sm font-semibold text-red-600">Plan not found</div>
            <p className="text-xs text-zinc-500">
              Could not retrieve the plan with reference &ldquo;{reference}&rdquo;.
            </p>
            <Link
              href="/admin/plans"
              className="inline-block py-2 px-4 bg-[#581c87] text-white text-xs font-semibold rounded-lg"
            >
              Return to Plans
            </Link>
          </div>
        ) : (
          <UpdatePlanForm
            plan={plan}
            onSuccess={() => router.push("/admin/plans")}
            onCancel={() => router.push("/admin/plans")}
          />
        )}
      </div>
    </div>
  );
}
