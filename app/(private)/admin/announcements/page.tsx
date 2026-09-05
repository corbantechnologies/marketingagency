"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  useFetchAdminAnnouncement,
  useSaveAdminAnnouncement,
  useClearAdminAnnouncement,
} from "@/hooks/accounts/actions";
import { AnnouncementType, AnnouncementPreset } from "@/services/accounts";

export default function AdminAnnouncementsPage() {
  const { data, isLoading, isFetching, refetch } = useFetchAdminAnnouncement();
  const saveMutation = useSaveAdminAnnouncement();
  const clearMutation = useClearAdminAnnouncement();

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<AnnouncementType>("INFO");
  const [isActive, setIsActive] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkLabel, setLinkLabel] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Sync state when data loads
  useEffect(() => {
    if (data) {
      setTitle(data.title || "");
      setMessage(data.message || "");
      setType(data.type || "INFO");
      setIsActive(Boolean(data.is_active));
      setLinkUrl(data.link_url || "");
      setLinkLabel(data.link_label || "");
    }
  }, [data]);

  const handleApplyPreset = (preset: AnnouncementPreset) => {
    setTitle(preset.title);
    setMessage(preset.message);
    setType(preset.type);
    setIsActive(true);
    setLinkUrl(preset.link_url || "");
    setLinkLabel(preset.link_label || "");
    toast.success(`Loaded preset: "${preset.title}"`);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter an announcement title.");
      return;
    }
    if (!message.trim()) {
      toast.error("Please enter an announcement message.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await saveMutation.mutateAsync({
        title: title.trim(),
        message: message.trim(),
        type,
        is_active: isActive,
        link_url: linkUrl.trim(),
        link_label: linkLabel.trim(),
      });
      if (res?.success) {
        toast.success(res.message || "Global announcement published!");
        refetch();
      } else {
        toast.error("Could not save announcement.");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || err?.message || "Failed to save announcement.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeactivate = async () => {
    if (!confirm("Deactivate this announcement banner across all client dashboards?")) {
      return;
    }
    try {
      const res = await clearMutation.mutateAsync();
      if (res?.success) {
        toast.success("Announcement banner deactivated.");
        setIsActive(false);
        refetch();
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to deactivate banner.");
    }
  };

  const presets = data?.presets || [];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">
              Live Broadcast Channel
            </span>
            <span className="text-xs text-zinc-500">Across All Client Workspaces</span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 mt-1">
            Global Client Announcement & System Banner
          </h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            Publish real-time notices, telco maintenance alerts, and system advisories directly to all business portals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <svg
              className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-purple-600" : "text-zinc-500"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Live Preview Card */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
              👀 Live Client Dashboard Banner Preview
            </span>
            <span className="text-xs text-zinc-400 font-normal">
              (How this appears at the top of client portals)
            </span>
          </div>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              isActive
                ? "bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse"
                : "bg-zinc-100 text-zinc-600 border border-zinc-200"
            }`}
          >
            {isActive ? "● Broadcasting Live to Clients" : "○ Inactive / Draft"}
          </span>
        </div>

        {/* Banner Render */}
        <div
          className={`p-4 rounded-xl border transition-all duration-300 ${
            type === "CRITICAL"
              ? "bg-red-600 text-white border-red-700 shadow-md"
              : type === "WARNING"
              ? "bg-amber-500 text-white border-amber-600 shadow-md"
              : type === "SUCCESS"
              ? "bg-emerald-600 text-white border-emerald-700 shadow-md"
              : "bg-[#581c87] text-white border-purple-900 shadow-md"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
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
                  {title || "Announcement Title"}
                </div>
                <div className="text-xs text-white/90 mt-1 leading-relaxed">
                  {message || "This is a preview of the announcement description displayed to all business users."}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              {linkUrl && (
                <span className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-md text-xs font-semibold">
                  {linkLabel || "Learn More ↗"}
                </span>
              )}
              <span className="text-white/60 text-xs px-2 cursor-default" title="Clients can dismiss this banner">
                ✕
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Presets Grid */}
      <div>
        <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
          ⚡ 1-Click Operational Presets
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {presets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="p-3 bg-white rounded-xl border border-zinc-200 hover:border-purple-400 hover:bg-purple-50/40 text-left transition-all shadow-2xs cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                    preset.type === "WARNING"
                      ? "bg-amber-100 text-amber-800"
                      : preset.type === "SUCCESS"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {preset.type}
                </span>
                <span className="text-[11px] text-purple-600 font-semibold group-hover:underline">
                  Load &rarr;
                </span>
              </div>
              <div className="font-bold text-xs text-zinc-900 line-clamp-1">
                {preset.title}
              </div>
              <div className="text-[11px] text-zinc-500 line-clamp-2 mt-1">
                {preset.message}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Composer Form */}
      <form onSubmit={handleSave} className="bg-white rounded-xl border border-zinc-200 shadow-2xs p-5 space-y-4">
        <h2 className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-3">
          Announcement Composer & Audience Dispatch
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Title */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Banner Headline / Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Scheduled Safaricom Network Maintenance"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-600 text-zinc-800"
            />
          </div>

          {/* Severity Type */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Severity Color Theme *
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as AnnouncementType)}
              className="w-full text-xs px-3 py-2 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-600 text-zinc-800"
            >
              <option value="INFO">Info (Agency Purple/Blue)</option>
              <option value="WARNING">Warning (Amber Alert)</option>
              <option value="CRITICAL">Critical (Red Emergency)</option>
              <option value="SUCCESS">Success (Emerald Green)</option>
            </select>
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">
            Announcement Message Body *
          </label>
          <textarea
            rows={3}
            required
            placeholder="Detailed description or instructions for business owners..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full text-xs px-3 py-2 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-600 text-zinc-800"
          />
        </div>

        {/* Optional Link URL and Label */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Action Link URL (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. https://status.safaricom.co.ke or /business/wallet"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-600 text-zinc-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Action Link Button Label (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Check Telco Status ↗"
              value={linkLabel}
              onChange={(e) => setLinkLabel(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-600 text-zinc-800"
            />
          </div>
        </div>

        {/* Active Toggle Switch */}
        <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-zinc-900">
              Broadcast Status
            </div>
            <div className="text-[11px] text-zinc-500">
              When toggled ON, this banner will render immediately on all client business pages.
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-zinc-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-700" />
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
          <div>
            {data?.is_active && (
              <button
                type="button"
                onClick={handleDeactivate}
                className="px-3.5 py-2 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg cursor-pointer"
              >
                Deactivate Live Banner
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2 text-xs font-bold text-white bg-[#581c87] hover:bg-[#43146b] rounded-lg shadow-xs cursor-pointer disabled:opacity-50"
          >
            {isSaving ? "Publishing..." : isActive ? "Update & Broadcast Banner" : "Save Draft"}
          </button>
        </div>
      </form>
    </div>
  );
}
