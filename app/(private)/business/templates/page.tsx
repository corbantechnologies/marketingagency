/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

import {
  useFetchMessageTemplates,
  useCreateMessageTemplate,
  useUpdateMessageTemplate,
  useDeleteMessageTemplate,
} from "@/hooks/messagetemplates/actions";
import { useFetchWhatsAppTemplates } from "@/hooks/broadcastmessages/actions";
import { MessageTemplate, TemplateCategory } from "@/services/messagetemplates";
import { WhatsAppTemplateItem } from "@/services/broadcastmessages";

export default function MessageTemplatesPage() {
  // Top Channel Tab: SMS vs WHATSAPP
  const [activeTab, setActiveTab] = useState<"SMS" | "WHATSAPP">("SMS");

  // SMS Tab State
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);
  const [deletingTemplate, setDeletingTemplate] = useState<MessageTemplate | null>(null);

  // SMS Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState<TemplateCategory>("MARKETING");
  const [body, setBody] = useState("");

  // WhatsApp Tab State
  const [waSearchTerm, setWaSearchTerm] = useState("");
  const [waStatusFilter, setWaStatusFilter] = useState<string>("all");

  // Queries & Mutations
  const { data: templatesData, isLoading: isSmsLoading } = useFetchMessageTemplates({
    search: searchTerm || undefined,
    category: categoryFilter !== "ALL" ? (categoryFilter as any) : undefined,
  });

  const {
    data: waData,
    isLoading: isWaLoading,
    refetch: refetchWa,
    isFetching: isWaFetching,
  } = useFetchWhatsAppTemplates(waStatusFilter);

  const createMutation = useCreateMessageTemplate();
  const updateMutation = useUpdateMessageTemplate();
  const deleteMutation = useDeleteMessageTemplate();

  // Processed SMS templates
  const templates = useMemo(() => {
    if (!templatesData) return [];
    const list = Array.isArray(templatesData) ? templatesData : (templatesData as any)?.results || [];
    return list.filter((t: any) => t.is_active !== false);
  }, [templatesData]);

  // Processed WhatsApp templates
  const waTemplates = useMemo(() => {
    if (!waData) return [];
    const rawList: WhatsAppTemplateItem[] = Array.isArray(waData)
      ? waData
      : (waData as any)?.templates || (waData as any)?.results || [];

    if (!waSearchTerm.trim()) return rawList;
    const q = waSearchTerm.toLowerCase();
    return rawList.filter((t) => {
      const bodyComp = t.components?.find((c: any) => c.type === "BODY")?.text || "";
      const headerComp = t.components?.find((c: any) => c.type === "HEADER")?.text || "";
      return (
        t.name.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        bodyComp.toLowerCase().includes(q) ||
        headerComp.toLowerCase().includes(q)
      );
    });
  }, [waData, waSearchTerm]);

  const approvedWaCount = useMemo(() => {
    if (!waData) return 0;
    const rawList: WhatsAppTemplateItem[] = Array.isArray(waData)
      ? waData
      : (waData as any)?.templates || (waData as any)?.results || [];
    return rawList.filter((t) => t.status === "APPROVED").length;
  }, [waData]);

  // Segment calculation for SMS composer
  const charCount = body.length;
  const isUnicode = useMemo(() => /[^\u0000-\u007F]/.test(body), [body]);
  const estimatedSegments = useMemo(() => {
    if (charCount === 0) return 1;
    if (!isUnicode) {
      return charCount <= 160 ? 1 : Math.ceil(charCount / 153);
    } else {
      return charCount <= 70 ? 1 : Math.ceil(charCount / 67);
    }
  }, [charCount, isUnicode]);

  const handleOpenCreateModal = () => {
    setEditingTemplate(null);
    setName("");
    setCategory("MARKETING");
    setBody("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (t: MessageTemplate) => {
    setEditingTemplate(t);
    setName(t.name);
    setCategory(t.category);
    setBody(t.body);
    setIsModalOpen(true);
  };

  const handleInsertTag = (tag: string) => {
    setBody((prev) => prev + tag);
  };

  const handleCopyText = (text: string, label = "Template text") => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Template name is required");
      return;
    }
    if (!body.trim()) {
      toast.error("Template body cannot be empty");
      return;
    }

    if (editingTemplate) {
      updateMutation.mutate(
        {
          reference: editingTemplate.reference,
          payload: {
            name: name.trim(),
            category,
            body: body.trim(),
          },
        },
        {
          onSuccess: () => {
            toast.success("Template updated successfully");
            setIsModalOpen(false);
          },
          onError: (err: any) => {
            const msg = err?.response?.data?.name?.[0] || "Failed to update template";
            toast.error(msg);
          },
        }
      );
    } else {
      createMutation.mutate(
        {
          name: name.trim(),
          channel: "SMS",
          category,
          body: body.trim(),
        },
        {
          onSuccess: () => {
            toast.success("Template created successfully");
            setIsModalOpen(false);
          },
          onError: (err: any) => {
            const msg = err?.response?.data?.name?.[0] || "Failed to create template";
            toast.error(msg);
          },
        }
      );
    }
  };

  const handleDeleteConfirm = () => {
    if (!deletingTemplate) return;
    deleteMutation.mutate(deletingTemplate.reference, {
      onSuccess: () => {
        toast.success("Template removed");
        setDeletingTemplate(null);
      },
      onError: () => {
        toast.error("Failed to delete template");
      },
    });
  };

  return (
    <div className="space-y-6 w-full max-w-none">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
            <Link href="/business/dashboard" className="hover:text-zinc-900">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-zinc-900 font-medium">Message Templates</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            Message &amp; WhatsApp Templates Studio
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 mt-0.5">
            Manage reusable SMS templates and official Meta Cloud API WhatsApp templates synced with our Verified Tech Provider account.
          </p>
        </div>

        {activeTab === "SMS" ? (
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="py-2.5 px-4 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors shadow-xs cursor-pointer inline-flex items-center gap-2 shrink-0"
          >
            <span>+ Create SMS Template</span>
          </button>
        ) : (
          <Link
            href="/business/broadcast?channel=WHATSAPP"
            className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors shadow-xs cursor-pointer inline-flex items-center gap-2 shrink-0"
          >
            <svg className="w-4 h-4 text-emerald-200" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            <span>Launch WhatsApp Campaign</span>
          </Link>
        )}
      </div>

      {/* 2. Top-Level Channel Tab Switcher */}
      <div className="flex items-center gap-3 border-b border-zinc-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("SMS")}
          className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "SMS"
              ? "bg-[#581c87] text-white shadow-xs"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900"
          }`}
        >
          <span>SMS Templates</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
              activeTab === "SMS" ? "bg-white/20 text-white" : "bg-zinc-200 text-zinc-700"
            }`}
          >
            {templates.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("WHATSAPP")}
          className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "WHATSAPP"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Meta WhatsApp Templates</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
              activeTab === "WHATSAPP" ? "bg-white/20 text-white" : "bg-emerald-200/70 text-emerald-900"
            }`}
          >
            {approvedWaCount} Approved
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: SMS TEMPLATES */}
      {/* ========================================================================= */}
      {activeTab === "SMS" && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search SMS templates by name or text..."
              className="w-full sm:w-80 px-3.5 py-2 rounded-lg border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#581c87]"
            />

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 rounded-lg border border-zinc-300 text-xs text-zinc-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#581c87] cursor-pointer"
              >
                <option value="ALL">All Categories</option>
                <option value="MARKETING">Marketing / Promo</option>
                <option value="TRANSACTIONAL">Transactional / OTP</option>
                <option value="REMINDER">Payment Reminders</option>
                <option value="NOTIFICATION">Notifications</option>
              </select>
            </div>
          </div>

          {/* Templates Grid */}
          {isSmsLoading ? (
            <div className="py-16 text-center text-xs text-zinc-500">Loading saved templates...</div>
          ) : templates.length === 0 ? (
            <div className="bg-white border border-zinc-200 rounded-2xl p-12 text-center shadow-xs space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-purple-50 text-[#581c87] flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-zinc-900">No message templates yet</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Save reusable marketing copy or transactional notification templates with dynamic tags like {"{first_name}"}.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleOpenCreateModal}
                  className="py-2 px-4 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  + Create First Template
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {templates.map((tpl: MessageTemplate) => (
                <div
                  key={tpl.id || tpl.reference}
                  className="bg-white border border-zinc-200 hover:border-purple-300 rounded-2xl p-5 shadow-xs transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-[#581c87] border border-purple-200">
                        {tpl.category}
                      </span>
                      <span className="text-[11px] font-mono text-zinc-400">
                        {tpl.character_count || tpl.body.length} chars &bull; {tpl.estimated_segments || 1} SMS
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-zinc-900 leading-snug">{tpl.name}</h3>

                    <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 text-xs font-mono text-zinc-800 leading-relaxed break-words">
                      {tpl.body}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(tpl)}
                        className="text-zinc-500 hover:text-zinc-900 font-semibold cursor-pointer"
                      >
                        Edit
                      </button>
                      <span className="text-zinc-300">&bull;</span>
                      <button
                        type="button"
                        onClick={() => setDeletingTemplate(tpl)}
                        className="text-red-500 hover:text-red-700 font-semibold cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>

                    <Link
                      href={`/business/broadcast?channel=SMS&template=${tpl.reference}`}
                      className="text-xs font-bold text-[#581c87] hover:underline inline-flex items-center gap-1"
                    >
                      <span>Use in Broadcast</span>
                      <span>&rarr;</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: META WHATSAPP TEMPLATES (VERIFIED TECH PROVIDER) */}
      {/* ========================================================================= */}
      {activeTab === "WHATSAPP" && (
        <div className="space-y-6">
          {/* Official Meta Tech Provider Authority Banner */}
          <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-zinc-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-emerald-800/60 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Verified Meta Tech Provider (Corban Technologies LTD)
                </span>
                <span className="text-zinc-300 text-xs font-mono">
                  WABA: 2660518117713455 &bull; 2,000+ Tier-1 Limit
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Official Meta WhatsApp Cloud API Template Studio
              </h2>
              <p className="text-xs text-zinc-300 max-w-2xl leading-relaxed">
                All templates below are verified directly with Meta Cloud API v19.0. Approved templates guarantee instant message dispatch directly to WhatsApp chats with blue-tick read receipts and zero telecom carrier blocking.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => refetchWa()}
                disabled={isWaFetching}
                className="py-2 px-3.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <svg
                  className={`w-3.5 h-3.5 ${isWaFetching ? "animate-spin" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>{isWaFetching ? "Syncing..." : "Sync from Meta"}</span>
              </button>
            </div>
          </div>

          {/* Sub-Filter Bar */}
          <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <input
              type="text"
              value={waSearchTerm}
              onChange={(e) => setWaSearchTerm(e.target.value)}
              placeholder="Search WhatsApp templates by name or copy..."
              className="w-full sm:w-80 px-3.5 py-2 rounded-lg border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider hidden sm:inline">Status:</span>
              {(["all", "APPROVED", "PENDING", "REJECTED"] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setWaStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    waStatusFilter === st
                      ? "bg-zinc-900 text-white shadow-2xs"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  }`}
                >
                  {st === "all" ? "All" : st}
                </button>
              ))}
            </div>
          </div>

          {/* WhatsApp Template Cards Grid */}
          {isWaLoading ? (
            <div className="py-16 text-center text-xs text-zinc-500 flex flex-col items-center gap-3">
              <svg className="animate-spin w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Synchronizing templates directly with Meta Graph API...</span>
            </div>
          ) : waTemplates.length === 0 ? (
            <div className="bg-white border border-zinc-200 rounded-2xl p-12 text-center shadow-xs space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-zinc-900">No WhatsApp templates found</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                No templates matched the selected filter. Try changing your search query or status filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {waTemplates.map((tpl: WhatsAppTemplateItem) => {
                const bodyComp = tpl.components?.find((c: any) => c.type === "BODY");
                const headerComp = tpl.components?.find((c: any) => c.type === "HEADER");
                const footerComp = tpl.components?.find((c: any) => c.type === "FOOTER");
                const buttonsComp = tpl.components?.find((c: any) => c.type === "BUTTONS");

                const isApproved = tpl.status === "APPROVED";

                return (
                  <div
                    key={tpl.id || tpl.name}
                    className="bg-white border border-zinc-200 hover:border-emerald-300 rounded-2xl p-5 shadow-xs transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              tpl.category === "UTILITY"
                                ? "bg-sky-50 text-sky-700 border border-sky-200"
                                : tpl.category === "AUTHENTICATION"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-purple-50 text-purple-700 border border-purple-200"
                            }`}
                          >
                            {tpl.category}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-zinc-500 bg-zinc-100">
                            {tpl.language}
                          </span>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1.5 ${
                            isApproved
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : tpl.status === "PENDING"
                              ? "bg-amber-50 text-amber-800 border border-amber-200"
                              : "bg-red-50 text-red-800 border border-red-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isApproved
                                ? "bg-emerald-500 animate-pulse"
                                : tpl.status === "PENDING"
                                ? "bg-amber-500"
                                : "bg-red-500"
                            }`}
                          />
                          {tpl.status}
                        </span>
                      </div>

                      {/* Template Name */}
                      <div>
                        <h3 className="font-bold text-sm text-zinc-900 font-mono tracking-tight">{tpl.name}</h3>
                        {tpl.id && (
                          <div className="text-[10px] text-zinc-400 font-mono">Meta ID: {tpl.id}</div>
                        )}
                      </div>

                      {/* Message Preview Box with WhatsApp aesthetic */}
                      <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100/80 space-y-2 text-xs">
                        {headerComp?.text && (
                          <div className="font-bold text-emerald-950 text-xs border-b border-emerald-100 pb-1.5">
                            {headerComp.text}
                          </div>
                        )}

                        <div className="text-zinc-800 leading-relaxed font-sans whitespace-pre-wrap">
                          {bodyComp?.text || "No message body defined."}
                        </div>

                        {footerComp?.text && (
                          <div className="text-[10px] text-zinc-400 pt-1 border-t border-emerald-100">
                            {footerComp.text}
                          </div>
                        )}

                        {buttonsComp?.buttons && buttonsComp.buttons.length > 0 && (
                          <div className="pt-2 flex flex-wrap gap-1.5">
                            {buttonsComp.buttons.map((b: any, idx: number) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-white text-emerald-700 text-[10px] font-semibold rounded border border-emerald-200 shadow-2xs"
                              >
                                ↳ {b.text || b.type}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                      <button
                        type="button"
                        onClick={() => handleCopyText(bodyComp?.text || "", "WhatsApp template copy")}
                        className="text-zinc-500 hover:text-zinc-900 font-semibold cursor-pointer inline-flex items-center gap-1"
                      >
                        <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>Copy Text</span>
                      </button>

                      {isApproved ? (
                        <Link
                          href={`/business/broadcast?channel=WHATSAPP&template=${tpl.name}`}
                          className="text-xs font-bold text-emerald-700 hover:text-emerald-900 hover:underline inline-flex items-center gap-1"
                        >
                          <span>Use in Campaign</span>
                          <span>&rarr;</span>
                        </Link>
                      ) : (
                        <span className="text-[11px] text-zinc-400 italic">
                          Awaiting Meta approval
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal: Create / Edit Template */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h2 className="text-base font-bold text-zinc-900">
                {editingTemplate ? "Edit SMS Template" : "New SMS Template"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 text-lg cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Template Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Flash Sale 20% Off"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#581c87]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs sm:text-sm text-zinc-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#581c87] cursor-pointer"
                >
                  <option value="MARKETING">Marketing / Promotional</option>
                  <option value="TRANSACTIONAL">Transactional / OTP</option>
                  <option value="REMINDER">Payment / Invoice Reminder</option>
                  <option value="NOTIFICATION">General Notification</option>
                  <option value="ALERT">Urgent Alert</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                    Message Body
                  </label>
                  <span className="text-xs font-mono text-zinc-500">
                    {charCount} chars &bull; {estimatedSegments} {estimatedSegments === 1 ? "part" : "parts"}
                  </span>
                </div>

                {/* Tag inserter */}
                <div className="flex flex-wrap items-center gap-1.5 mb-2 bg-zinc-50 p-2 rounded-lg border border-zinc-200">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mr-1">
                    Insert Tag:
                  </span>
                  {["{first_name}", "{last_name}", "{phone_number}", "{email}"].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleInsertTag(tag)}
                      className="py-0.5 px-2 bg-white text-zinc-700 border border-zinc-200 rounded text-[11px] font-mono hover:bg-purple-50 cursor-pointer shadow-2xs"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>

                <textarea
                  rows={4}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Write your template text here. Use {first_name} for recipient personalization."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#581c87]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2 px-4 rounded-lg border border-zinc-200 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="py-2 px-5 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? "Saving..."
                    : editingTemplate
                    ? "Update Template"
                    : "Save Template"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Confirmation */}
      {deletingTemplate && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-zinc-900">Delete Message Template</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Are you sure you want to remove the template &quot;<strong>{deletingTemplate.name}</strong>&quot;?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingTemplate(null)}
                className="py-1.5 px-3 rounded-lg border border-zinc-200 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleteMutation.isPending}
                className="py-1.5 px-4 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
