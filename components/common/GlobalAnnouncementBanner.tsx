"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useFetchActivePublicAnnouncement } from "@/hooks/accounts/actions";

export function GlobalAnnouncementBanner() {
  const { data } = useFetchActivePublicAnnouncement();
  const announcement = data?.announcement;

  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (announcement?.id) {
      const dismissedKey = `dismissed_ann_${announcement.id}`;
      const wasDismissed = sessionStorage.getItem(dismissedKey);
      if (wasDismissed) {
        setIsDismissed(true);
      } else {
        setIsDismissed(false);
      }
    }
  }, [announcement?.id]);

  if (!announcement || isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    if (announcement.id) {
      sessionStorage.setItem(`dismissed_ann_${announcement.id}`, "true");
    }
  };

  const type = announcement.type || "INFO";

  return (
    <div
      className={`mb-6 rounded-xl border p-4 shadow-sm transition-all duration-300 ${
        type === "CRITICAL"
          ? "bg-red-600 text-white border-red-700"
          : type === "WARNING"
          ? "bg-amber-500 text-white border-amber-600"
          : type === "SUCCESS"
          ? "bg-emerald-600 text-white border-emerald-700"
          : "bg-[#581c87] text-white border-purple-900"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
            {type === "CRITICAL" ? (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            ) : type === "WARNING" ? (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : type === "SUCCESS" ? (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <div>
            <div className="font-bold text-sm leading-tight">
              {announcement.title}
            </div>
            <div className="text-xs text-white/90 mt-1 leading-relaxed">
              {announcement.message}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
          {announcement.link_url && (
            <Link
              href={announcement.link_url}
              className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-md text-xs font-semibold transition-colors"
            >
              {announcement.link_label || "Learn More ↗"}
            </Link>
          )}

          <button
            type="button"
            onClick={handleDismiss}
            className="p-1 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Dismiss announcement"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
export default GlobalAnnouncementBanner;
