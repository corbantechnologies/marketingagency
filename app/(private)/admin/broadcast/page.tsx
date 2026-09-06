/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  useFetchAgencyBroadcastMetadata,
  useCreateAgencyBroadcast,
  useFetchCampaigns,
} from "@/hooks/campaigns/actions";
import {
  useFetchWhatsAppTemplates,
  useCreateWhatsAppTemplate,
} from "@/hooks/broadcastmessages/actions";
import { WhatsAppTemplateItem } from "@/services/broadcastmessages";
import { BaseSMSGateway } from "@/tools/sms";

export default function AdminBroadcastPage() {
  const { data: metaData, isLoading: isMetaLoading } = useFetchAgencyBroadcastMetadata();
  const { data: campaignsData, isLoading: isCampaignsLoading } = useFetchCampaigns({
    ordering: "-created_at",
  });
  const broadcastMutation = useCreateAgencyBroadcast();

  // Navigation Tab State
  const [activeTab, setActiveTab] = useState<"DISPATCHER" | "TEMPLATES">("DISPATCHER");

  // --- Dispatcher Channel & Form State ---
  const [channel, setChannel] = useState<"SMS" | "WHATSAPP">("SMS");
  const [campaignName, setCampaignName] = useState("LJK Platform Announcement");
  const [senderId, setSenderId] = useState("LJK_AGENCY");
  const [targetAudience, setTargetAudience] = useState<"ALL_BUSINESSES" | "ALL_USERS" | "MANUAL">("ALL_BUSINESSES");
  const [manualNumbers, setManualNumbers] = useState("");
  const [messageBody, setMessageBody] = useState(
    "Hello {first_name}, this is an official announcement from LJK Marketing Agency."
  );

  // Template Selection in Dispatcher
  const [selectedTemplateName, setSelectedTemplateName] = useState<string>("");
  const [templateHeader, setTemplateHeader] = useState<string>("");
  const [templateFooter, setTemplateFooter] = useState<string>("");

  // Live GSM 03.38 character and segment calculations (for SMS)
  const { charCount, segments, isUnicode } = useMemo(() => {
    return BaseSMSGateway.calculate_segments(messageBody);
  }, [messageBody]);

  // Audience Count Preview
  const recipientCountPreview = useMemo(() => {
    if (targetAudience === "ALL_BUSINESSES") {
      return metaData?.all_businesses_count ?? 0;
    }
    if (targetAudience === "ALL_USERS") {
      return metaData?.all_users_count ?? 0;
    }
    const nums = manualNumbers
      .split(/[,\n\r\t]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    return nums.length;
  }, [targetAudience, manualNumbers, metaData]);

  const handleInsertToken = (token: string) => {
    setMessageBody((prev) => `${prev} ${token}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!campaignName.trim()) {
      toast.error("Please enter a campaign title.");
      return;
    }
    if (!messageBody.trim()) {
      toast.error("Message body cannot be empty.");
      return;
    }
    if (targetAudience === "MANUAL" && recipientCountPreview === 0) {
      toast.error("Please enter at least one valid phone number.");
      return;
    }

    broadcastMutation.mutate(
      {
        name: campaignName.trim(),
        channel,
        sender_id: channel === "WHATSAPP" ? "WHATSAPP" : (senderId.trim() || "LJK_AGENCY"),
        message_template: messageBody.trim(),
        target_audience: targetAudience,
        manual_numbers: targetAudience === "MANUAL" ? manualNumbers : undefined,
      },
      {
        onSuccess: (res) => {
          toast.success(res.message || `Agency ${channel === "WHATSAPP" ? "WhatsApp" : "SMS"} broadcast queued successfully!`);
          if (targetAudience === "MANUAL") {
            setManualNumbers("");
          }
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.detail || "Failed to dispatch agency broadcast.");
        },
      }
    );
  };

  const agencyCampaigns = useMemo(() => {
    if (!campaignsData) return [];
    return campaignsData.filter(
      (c) => c.business_name === "LJK Marketing Agency" || c.sender_id === "LJK_AGENCY" || c.sender_id === "WHATSAPP"
    );
  }, [campaignsData]);

  const formatDate = (isoString?: string) => {
    if (!isoString) return "—";
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("en-KE", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  // --- WhatsApp Template Studio State ---
  const [templateStatusFilter, setTemplateStatusFilter] = useState<string>("all");
  const {
    data: templatesData,
    isLoading: isTemplatesLoading,
    refetch: refetchTemplates,
    isFetching: isTemplatesFetching,
  } = useFetchWhatsAppTemplates(templateStatusFilter);

  const createTemplateMutation = useCreateWhatsAppTemplate();

  // Template Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [tplName, setTplName] = useState("");
  const [tplCategory, setTplCategory] = useState<"UTILITY" | "MARKETING">("UTILITY");
  const [tplLanguage, setTplLanguage] = useState("en_US");
  const [tplHeader, setTplHeader] = useState("");
  const [tplBody, setTplBody] = useState("");
  const [tplFooter, setTplFooter] = useState("Reply STOP to unsubscribe");
  const [tplVariables, setTplVariables] = useState<Record<string, string>>({});

  // Filter approved and pending templates for Dispatcher selector
  const approvedTemplates = useMemo(() => {
    return templatesData?.templates?.filter((t) => t.status === "APPROVED") || [];
  }, [templatesData]);

  const pendingTemplates = useMemo(() => {
    return templatesData?.templates?.filter((t) => t.status === "PENDING") || [];
  }, [templatesData]);

  const selectedTemplate = useMemo(() => {
    if (!selectedTemplateName) return null;
    return templatesData?.templates?.find((t) => t.name === selectedTemplateName) || null;
  }, [templatesData, selectedTemplateName]);

  const handleSelectTemplate = (name: string) => {
    setSelectedTemplateName(name);
    if (!name) {
      setTemplateHeader("");
      setTemplateFooter("");
      return;
    }
    const tpl = templatesData?.templates?.find((t) => t.name === name);
    if (!tpl) return;

    setCampaignName(`WhatsApp - ${tpl.name}`);
    let bodyText = "";
    let headerText = "";
    let footerText = "";

    if (tpl.components && Array.isArray(tpl.components)) {
      const bComp = tpl.components.find((c: any) => c.type === "BODY");
      const hComp = tpl.components.find((c: any) => c.type === "HEADER");
      const fComp = tpl.components.find((c: any) => c.type === "FOOTER");
      if (bComp?.text) bodyText = bComp.text;
      if (hComp?.text) headerText = hComp.text;
      if (fComp?.text) footerText = fComp.text;
    }

    if (bodyText) {
      setMessageBody(bodyText);
    } else {
      setMessageBody(`Announcement via approved template [${tpl.name}].`);
    }
    setTemplateHeader(headerText);
    setTemplateFooter(footerText);
    toast.success(`Selected approved Meta template '${tpl.name}'!`);
  };

  const handleClearTemplate = () => {
    setSelectedTemplateName("");
    setTemplateHeader("");
    setTemplateFooter("");
    setMessageBody("Hello {first_name}, this is an official announcement from LJK Marketing Agency.");
  };

  // Detect {{1}}, {{2}} in template body
  const detectedVariables = useMemo(() => {
    const matches = tplBody.match(/\{\{(\d+)\}\}/g);
    if (!matches) return [];
    const unique = Array.from(new Set(matches));
    return unique.map((m) => m.replace(/[{}]/g, ""));
  }, [tplBody]);

  // Keep variable samples synchronized
  useEffect(() => {
    setTplVariables((prev) => {
      const updated = { ...prev };
      detectedVariables.forEach((num) => {
        if (!updated[num]) {
          updated[num] = num === "1" ? "John" : num === "2" ? "ORD-8921" : `Sample ${num}`;
        }
      });
      return updated;
    });
  }, [detectedVariables]);

  const handleInsertTplVariable = () => {
    const nextNum = detectedVariables.length + 1;
    setTplBody((prev) => `${prev} {{${nextNum}}}`);
  };

  // WhatsApp Handset Preview for Template Modal
  const previewBodyWithVariables = useMemo(() => {
    if (!tplBody) return "Enter your template message body to preview...";
    let text = tplBody;
    detectedVariables.forEach((num) => {
      const val = tplVariables[num] || `{{${num}}}`;
      text = text.replace(new RegExp(`\\{\\{${num}\\}\\}`, "g"), val);
    });
    return text;
  }, [tplBody, detectedVariables, tplVariables]);

  const handleCreateTemplateSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanName = tplName.trim().toLowerCase().replace(/\s+/g, "_");
    if (!cleanName || !/^[a-z0-9_]+$/.test(cleanName)) {
      toast.error("Template name must contain only lowercase letters, numbers, and underscores.");
      return;
    }
    if (!tplBody.trim()) {
      toast.error("Template body text is required.");
      return;
    }

    const orderedExamples: string[] = [];
    detectedVariables.forEach((num) => {
      orderedExamples.push(tplVariables[num] || `Value ${num}`);
    });

    createTemplateMutation.mutate(
      {
        name: cleanName,
        category: tplCategory,
        language: tplLanguage,
        header_text: tplHeader.trim() || undefined,
        body_text: tplBody.trim(),
        footer_text: tplFooter.trim() || undefined,
        example_variables: orderedExamples.length > 0 ? orderedExamples : undefined,
      },
      {
        onSuccess: (res) => {
          toast.success(`Template '${res.name}' submitted to Meta Cloud API! Status: ${res.status}`);
          setIsCreateModalOpen(false);
          setTplName("");
          setTplHeader("");
          setTplBody("");
          setTplFooter("Reply STOP to unsubscribe");
          refetchTemplates();
        },
        onError: (err: any) => {
          const detail =
            err?.response?.data?.detail ||
            err?.response?.data?.error ||
            "Failed to submit template to Meta Cloud API.";
          toast.error(typeof detail === "string" ? detail : JSON.stringify(detail));
        },
      }
    );
  };

  const handleUseTemplateInDispatcher = (tpl: WhatsAppTemplateItem) => {
    setChannel("WHATSAPP");
    setActiveTab("DISPATCHER");
    handleSelectTemplate(tpl.name);
  };

  return (
    <div className="space-y-6 w-full max-w-none">
      {/* 1. Top Header Ribbon */}
      <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
            <Link href="/admin/dashboard" className="hover:text-zinc-900">Admin Console</Link>
            <span>/</span>
            <span className="text-zinc-900 font-medium">Agency Broadcast</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <div className={`inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
              channel === "WHATSAPP"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-purple-50 border-purple-200 text-[#581c87]"
            }`}>
              <span className={`w-2 h-2 rounded-full animate-pulse ${
                channel === "WHATSAPP" ? "bg-emerald-600" : "bg-[#581c87]"
              }`} />
              <span>
                {channel === "WHATSAPP"
                  ? "Meta Verified WhatsApp Cloud API"
                  : `Master Sender ID: ${senderId || "LJK_AGENCY"}`}
              </span>
              <span className="text-zinc-400">&bull;</span>
              <span className="capitalize">
                {channel === "WHATSAPP"
                  ? (metaData?.whatsapp_phone_number_id ? "Meta Live Cloud API" : "Meta Simulator Mode")
                  : (metaData?.gateway_provider === "africastalking" ? "Africa's Talking Live" : metaData?.gateway_provider || "Simulator")}
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 text-[10px] font-bold uppercase tracking-wider">
              Admin Master Bypass Active
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            LJK Omnichannel Agency Broadcast Console
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            Dispatch administrative broadcasts, manage official Meta WhatsApp templates, and inspect omnichannel telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/admin/dashboard"
            className="py-2 px-3.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold rounded-lg transition-colors"
          >
            Telemetry Overview
          </Link>
          <Link
            href="/admin/inspector"
            className="py-2 px-3.5 bg-zinc-800 hover:bg-zinc-900 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
          >
            Message Inspector
          </Link>
        </div>
      </div>

      {/* 2. Top-Level Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-zinc-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("DISPATCHER")}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "DISPATCHER"
              ? "bg-zinc-900 text-white shadow-xs"
              : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          <span>Broadcast Dispatcher</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("TEMPLATES")}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "TEMPLATES"
              ? "bg-emerald-700 text-white shadow-xs"
              : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
          }`}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.301-.15-1.781-.879-2.057-.98-.276-.1-.477-.15-.678.15-.2.301-.777.98-.953 1.18-.176.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.896-.799-1.501-1.787-1.677-2.088-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.176.2-.301.301-.502.1-.201.05-.377-.025-.527-.075-.15-.678-1.634-.929-2.237-.244-.588-.493-.509-.678-.518-.176-.009-.377-.009-.578-.009s-.527.075-.803.377c-.276.301-1.054 1.03-1.054 2.512s1.079 2.914 1.23 3.115c.15.201 2.122 3.24 5.141 4.544.718.31 1.279.496 1.716.635.722.23 1.379.197 1.898.12.578-.087 1.781-.728 2.032-1.431.251-.703.251-1.305.176-1.431-.075-.126-.276-.201-.577-.351z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.119.553 4.11 1.523 5.836L.055 23.518l5.882-1.446A11.936 11.936 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.854 0-3.593-.505-5.092-1.385l-.365-.215-3.784.931.947-3.69-.236-.376C2.518 15.736 2 13.929 2 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10z" />
          </svg>
          <span>WhatsApp Template Studio</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-mono font-bold">
            Meta Review
          </span>
        </button>
      </div>

      {/* --- TAB 1: BROADCAST DISPATCHER --- */}
      {activeTab === "DISPATCHER" && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column (7 cols): Broadcast Composer */}
            <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-xl p-5 sm:p-7 shadow-xs space-y-5">
              {/* Channel Switcher Tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
                <div>
                  <h2 className="text-base font-bold text-zinc-900">Compose Agency Broadcast</h2>
                  <p className="text-xs text-zinc-500 mt-0.5 max-w-md">
                    Choose delivery channel and target registered businesses, portal users, or external numbers.
                  </p>
                </div>
                <div className="inline-flex items-center p-1 bg-zinc-100 rounded-xl border border-zinc-200 shrink-0 self-start sm:self-center shadow-2xs">
                  <button
                    type="button"
                    onClick={() => {
                      setChannel("SMS");
                      setSelectedTemplateName("");
                      setTemplateHeader("");
                      setTemplateFooter("");
                    }}
                    title="Bulk SMS Gateway (1 Credit / SMS)"
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                      channel === "SMS"
                        ? "bg-white text-purple-950 shadow-xs border border-purple-200/70"
                        : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50"
                    }`}
                  >
                    <svg className="w-4 h-4 text-purple-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <span>Bulk SMS</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setChannel("WHATSAPP")}
                    title="Meta WhatsApp Cloud API (2 Credits / Message)"
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                      channel === "WHATSAPP"
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50"
                    }`}
                  >
                    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.301-.15-1.781-.879-2.057-.98-.276-.1-.477-.15-.678.15-.2.301-.777.98-.953 1.18-.176.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.896-.799-1.501-1.787-1.677-2.088-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.176.2-.301.301-.502.1-.201.05-.377-.025-.527-.075-.15-.678-1.634-.929-2.237-.244-.588-.493-.509-.678-.518-.176-.009-.377-.009-.578-.009s-.527.075-.803.377c-.276.301-1.054 1.03-1.054 2.512s1.079 2.914 1.23 3.115c.15.201 2.122 3.24 5.141 4.544.718.31 1.279.496 1.716.635.722.23 1.379.197 1.898.12.578-.087 1.781-.728 2.032-1.431.251-.703.251-1.305.176-1.431-.075-.126-.276-.201-.577-.351z" />
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.119.553 4.11 1.523 5.836L.055 23.518l5.882-1.446A11.936 11.936 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.854 0-3.593-.505-5.092-1.385l-.365-.215-3.784.931.947-3.69-.236-.376C2.518 15.736 2 13.929 2 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10z" />
                    </svg>
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Campaign Name */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                    Broadcast Title / Internal Campaign Label
                  </label>
                  <input
                    type="text"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    placeholder="e.g. Scheduled System Upgrade Notice"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#581c87]"
                    required
                  />
                </div>

                {/* Sender ID / Channel & Target Audience Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                      {channel === "WHATSAPP" ? "Dispatch Channel" : "Sender ID Header"}
                    </label>
                    {channel === "WHATSAPP" ? (
                      <div className="px-3.5 py-2.5 rounded-lg border border-emerald-300 bg-emerald-50/50 text-xs sm:text-sm font-semibold text-emerald-900 flex items-center justify-between">
                        <span className="font-mono">WhatsApp Meta API</span>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-emerald-200/80 rounded text-emerald-900">
                          Verified
                        </span>
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={senderId}
                        onChange={(e) => setSenderId(e.target.value.toUpperCase())}
                        placeholder="LJK_AGENCY"
                        maxLength={11}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs sm:text-sm font-mono text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#581c87]"
                      />
                    )}
                    <p className="text-[11px] text-zinc-400 mt-1">
                      {channel === "WHATSAPP"
                        ? "Dispatched from official LJK Marketing Agency WhatsApp number."
                        : "Master alphanumeric telecom header (max 11 chars)"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                      Target Audience
                    </label>
                    <select
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs sm:text-sm text-zinc-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#581c87]"
                    >
                      <option value="ALL_BUSINESSES">
                        All Active Business Contacts ({isMetaLoading ? "..." : metaData?.all_businesses_count ?? 0})
                      </option>
                      <option value="ALL_USERS">
                        All Portal User Accounts ({isMetaLoading ? "..." : metaData?.all_users_count ?? 0})
                      </option>
                      <option value="MANUAL">Manual Phone Numbers / CSV Paste</option>
                    </select>
                    <p className="text-[11px] text-zinc-400 mt-1">
                      Target count: <strong className="text-zinc-800 font-semibold">{recipientCountPreview}</strong>
                    </p>
                  </div>
                </div>

                {/* Manual Numbers textarea if selected */}
                {targetAudience === "MANUAL" && (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                      Recipient Mobile Numbers (Comma or newline separated)
                    </label>
                    <textarea
                      rows={3}
                      value={manualNumbers}
                      onChange={(e) => setManualNumbers(e.target.value)}
                      placeholder="0712345678, 0798765432, 254711223344"
                      className="w-full p-3 rounded-lg border border-zinc-300 font-mono text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#581c87]"
                    />
                    <p className="text-[11px] text-zinc-400">
                      Accepts Kenyan formats: 07XX, 01XX, or 2547XX. Automatically formatted for {channel === "WHATSAPP" ? "WhatsApp Cloud API" : "Tier-1 SMS"}.
                    </p>
                  </div>
                )}

                {/* --- APPROVED META TEMPLATE PICKER (WHATSAPP ONLY) --- */}
                {channel === "WHATSAPP" && (
                  <div className="bg-emerald-50/70 border border-emerald-200/90 rounded-xl p-4 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <label className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                          Select Pre-Approved Meta Template
                        </label>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200/80 text-emerald-900 font-mono">
                          {approvedTemplates.length} Approved
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab("TEMPLATES")}
                        className="text-[11px] text-emerald-800 hover:text-emerald-950 font-semibold underline underline-offset-2 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
                      >
                        <span>Manage in Template Studio</span>
                        <span>&rarr;</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                      <div className="sm:col-span-8">
                        <select
                          value={selectedTemplateName}
                          onChange={(e) => handleSelectTemplate(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-lg border border-emerald-300 bg-white text-xs font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 shadow-2xs"
                        >
                          <option value="">— Custom Freeform Copy (Or Select Approved Template) —</option>
                          {approvedTemplates.length > 0 && (
                            <optgroup label="Approved Meta Templates (Live Ready)">
                              {approvedTemplates.map((tpl) => (
                                <option key={tpl.id || tpl.name} value={tpl.name}>
                                  {tpl.name} • [{tpl.category}] ({tpl.language})
                                </option>
                              ))}
                            </optgroup>
                          )}
                          {pendingTemplates.length > 0 && (
                            <optgroup label="Pending Review by Meta (In Progress)">
                              {pendingTemplates.map((tpl) => (
                                <option key={tpl.id || tpl.name} value={tpl.name} disabled>
                                  {tpl.name} • [PENDING APPROVAL] ({tpl.language})
                                </option>
                              ))}
                            </optgroup>
                          )}
                        </select>
                      </div>

                      <div className="sm:col-span-4 flex items-center gap-2">
                        {selectedTemplate ? (
                          <button
                            type="button"
                            onClick={handleClearTemplate}
                            className="w-full py-2.5 px-3 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-700 text-xs font-semibold transition-colors cursor-pointer text-center"
                          >
                            Clear / Custom
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setIsCreateModalOpen(true)}
                            className="w-full py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>New Template</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Active Selected Template Metadata Pill */}
                    {selectedTemplate && (
                      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-emerald-200/60 text-[11px] text-emerald-950">
                        <span className="font-semibold text-emerald-800">Active Template:</span>
                        <code className="bg-emerald-100/80 px-2 py-0.5 rounded font-mono font-bold text-emerald-900">
                          {selectedTemplate.name}
                        </code>
                        <span>&bull;</span>
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                          selectedTemplate.category === "UTILITY"
                            ? "bg-sky-100 text-sky-800"
                            : "bg-purple-100 text-purple-800"
                        }`}>
                          {selectedTemplate.category}
                        </span>
                        <span>&bull;</span>
                        <span className="font-mono text-zinc-600">{selectedTemplate.language}</span>
                        {selectedTemplate.id && (
                          <>
                            <span>&bull;</span>
                            <span className="text-zinc-500 font-mono text-[10px]">Meta ID: {selectedTemplate.id}</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Message Body & Dynamic Tags */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                      {channel === "WHATSAPP" ? "WhatsApp Message Body / Copy" : "SMS Message Body"}
                    </label>
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-zinc-400">Insert tag:</span>
                      <button
                        type="button"
                        onClick={() => handleInsertToken("{first_name}")}
                        className="px-1.5 py-0.5 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-mono text-[10px] transition-colors cursor-pointer"
                      >
                        {"{first_name}"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInsertToken("{name}")}
                        className="px-1.5 py-0.5 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-mono text-[10px] transition-colors cursor-pointer"
                      >
                        {"{name}"}
                      </button>
                      {channel === "WHATSAPP" && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleInsertToken("{{1}}")}
                            className="px-1.5 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-mono text-[10px] transition-colors cursor-pointer font-bold border border-emerald-200/60"
                          >
                            {"{{1}}"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleInsertToken("{{2}}")}
                            className="px-1.5 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-mono text-[10px] transition-colors cursor-pointer font-bold border border-emerald-200/60"
                          >
                            {"{{2}}"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <textarea
                    rows={5}
                    value={messageBody}
                    onChange={(e) => setMessageBody(e.target.value)}
                    placeholder={channel === "WHATSAPP" ? "Type your official WhatsApp announcement..." : "Type your official SMS announcement..."}
                    maxLength={channel === "WHATSAPP" ? 1024 : undefined}
                    className="w-full p-3.5 rounded-lg border border-zinc-300 text-xs sm:text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#581c87] leading-relaxed font-normal"
                    required
                  />

                  {/* Counter Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                    {channel === "WHATSAPP" ? (
                      <div className="flex items-center gap-3 text-zinc-500">
                        <span>
                          Characters: <strong className="text-zinc-900 font-bold">{messageBody.length}</strong> / 1024
                        </span>
                        <span>&bull;</span>
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          Meta Cloud API Rich Format
                        </span>
                        <span>&bull;</span>
                        <span className="text-sky-600 font-mono text-[11px]">Real-time Blue Ticks Included</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 text-zinc-500">
                        <span>
                          Characters: <strong className="text-zinc-900 font-bold">{charCount}</strong>
                        </span>
                        <span>&bull;</span>
                        <span>
                          Segments:{" "}
                          <strong className={`font-bold ${segments > 1 ? "text-amber-600" : "text-zinc-900"}`}>
                            {segments} SMS
                          </strong>
                        </span>
                        <span>&bull;</span>
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${isUnicode ? "bg-amber-100 text-amber-900" : "bg-zinc-100 text-zinc-600"}`}>
                          {isUnicode ? "Unicode (UCS-2)" : "GSM 03.38"}
                        </span>
                      </div>
                    )}

                    <span className="text-purple-700 font-semibold text-[11px]">
                      Admin Cost: 0.00 Credits (Bypass Enabled)
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-3 border-t border-zinc-100">
                  <button
                    type="submit"
                    disabled={broadcastMutation.isPending || recipientCountPreview === 0}
                    className={`w-full py-3 px-4 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50 ${
                      channel === "WHATSAPP"
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : "bg-[#581c87] hover:bg-[#4a1572]"
                    }`}
                  >
                    {broadcastMutation.isPending ? (
                      <>
                        <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        <span>Dispatching {channel === "WHATSAPP" ? "WhatsApp" : "SMS"} Agency Broadcast...</span>
                      </>
                    ) : (
                      <>
                        <span>
                          Dispatch {channel === "WHATSAPP" ? "WhatsApp" : "SMS"} Broadcast ({recipientCountPreview} Recipients)
                        </span>
                        <span>&rarr;</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column (5 cols): Dynamic Handset Mockup & Guidance */}
            <div className="lg:col-span-5 space-y-6">
              {/* Dynamic Handset Preview Card */}
              <div className="bg-zinc-900 text-white rounded-2xl p-5 shadow-lg border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-zinc-800 pb-3">
                  <span className="font-semibold uppercase tracking-wider text-[10px]">
                    {channel === "WHATSAPP" ? "Live WhatsApp Chat Preview" : "Live SMS Handset Preview"}
                  </span>
                  <span className="font-mono text-emerald-400">
                    {channel === "WHATSAPP" ? "WhatsApp Business" : "4G LTE"}
                  </span>
                </div>

                {/* Handset Mockup Screen */}
                {channel === "WHATSAPP" ? (
                  <div className="bg-[#0b141a] rounded-xl overflow-hidden border border-zinc-800 shadow-md">
                    {/* WhatsApp Chat Header */}
                    <div className="bg-[#1f2c34] px-4 py-3 flex items-center justify-between border-b border-[#2a3942]">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-xs shrink-0">
                          LJK
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-zinc-100 truncate">LJK Marketing Agency</span>
                            <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-[10px] text-zinc-400">Official Business Account</span>
                        </div>
                      </div>
                      {selectedTemplateName && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                          HSM Active
                        </span>
                      )}
                    </div>

                    {/* WhatsApp Message Body */}
                    <div className="p-4 space-y-3 bg-[radial-gradient(#1f2c34_1px,transparent_1px)] [background-size:16px_16px] min-h-48 flex flex-col justify-between">
                      <div className="bg-[#005c4b] text-zinc-100 rounded-xl rounded-tr-xs p-3.5 text-xs leading-relaxed shadow-sm border border-[#02735e] max-w-[90%] self-end space-y-1.5">
                        {templateHeader && (
                          <div className="font-bold text-zinc-100 text-xs border-b border-[#02735e]/60 pb-1">
                            {templateHeader}
                          </div>
                        )}
                        <div className="whitespace-pre-wrap">
                          {messageBody
                            .replace(/{first_name}/g, "Client")
                            .replace(/{name}/g, "Valued Client")
                            .replace(/\{\{1\}\}/g, "Client")
                            .replace(/\{\{2\}\}/g, "Exclusive Offer")
                            .replace(/\{\{3\}\}/g, "Special Discount")
                            .replace(/\{\{4\}\}/g, "Today") || (
                            <span className="text-zinc-300 italic">Type your WhatsApp announcement to preview...</span>
                          )}
                        </div>
                        {templateFooter && (
                          <div className="text-[10px] text-zinc-300/80 border-t border-[#02735e]/60 pt-1">
                            {templateFooter}
                          </div>
                        )}
                        <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-zinc-300">
                          <span>Just now</span>
                          <span className="text-sky-400 font-bold">✓✓</span>
                        </div>
                      </div>

                      <div className="text-[10px] text-zinc-400 text-center font-mono pt-2">
                        {selectedTemplateName ? `Meta HSM Template: ${selectedTemplateName}` : "Dispatched via Meta WhatsApp Cloud API"}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-800 space-y-3 min-h-48 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-400 mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="font-mono font-bold text-white">{senderId || "LJK_AGENCY"}</span>
                        <span>&bull;</span>
                        <span>Now</span>
                      </div>

                      <div className="bg-zinc-800/90 text-zinc-100 rounded-2xl rounded-tl-xs p-3.5 text-xs leading-relaxed border border-zinc-700/50 shadow-inner">
                        {messageBody.replace("{first_name}", "Client").replace("{name}", "Valued Client") || (
                          <span className="text-zinc-500 italic">Type your message to see a live handset preview...</span>
                        )}
                      </div>
                    </div>

                    <div className="text-[10px] text-zinc-500 text-center font-mono">
                      Delivered via Africa&apos;s Talking Tier-1 SMSC
                    </div>
                  </div>
                )}
              </div>

              {/* Administrative Notice Card */}
              <div className="bg-purple-50/60 border border-purple-200/80 rounded-xl p-5 text-xs space-y-2">
                <div className="flex items-center gap-2 text-[#581c87] font-bold">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Omnichannel Master Privileges</span>
                </div>
                <p className="text-zinc-600 leading-relaxed">
                  Agency broadcasts are automatically anchored under the <strong>LJK Marketing Agency</strong> master tenant. You can freely switch between high-converting Meta WhatsApp Business messages and universal Tier-1 Bulk SMS without quota limitations.
                </p>
              </div>
            </div>
          </div>

          {/* 3. Recent Agency Broadcasts Table */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-zinc-900">Recent Agency Broadcasts</h2>
                <p className="text-xs text-zinc-500">History of outbound agency notifications and omnichannel dispatches.</p>
              </div>
              <span className="text-xs font-mono font-semibold text-zinc-500">
                {agencyCampaigns.length} Dispatches
              </span>
            </div>

            {isCampaignsLoading ? (
              <div className="py-12 text-center text-xs text-zinc-400">Loading agency campaigns...</div>
            ) : agencyCampaigns.length > 0 ? (
              <div className="divide-y divide-zinc-100 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-zinc-400 font-bold uppercase tracking-wider border-b border-zinc-200 pb-2">
                      <th className="py-2.5 px-2">Campaign Title</th>
                      <th className="py-2.5 px-2">Channel</th>
                      <th className="py-2.5 px-2">Sender ID / Origin</th>
                      <th className="py-2.5 px-2">Recipients</th>
                      <th className="py-2.5 px-2">Status</th>
                      <th className="py-2.5 px-2 text-right">Dispatched At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {agencyCampaigns.map((camp) => (
                      <tr key={camp.id || camp.reference} className="hover:bg-zinc-50/60 transition-colors">
                        <td className="py-3 px-2 font-semibold text-zinc-900">
                          <div>{camp.name}</div>
                          <div className="text-[11px] text-zinc-400 font-mono">Ref: {camp.reference || camp.code}</div>
                        </td>
                        <td className="py-3 px-2">
                          {camp.channel === "WHATSAPP" ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              WHATSAPP
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 inline-flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                              SMS
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-2 font-mono font-bold text-zinc-800">
                          {camp.channel === "WHATSAPP" ? "Meta Verified API" : (camp.sender_id || "LJK_AGENCY")}
                        </td>
                        <td className="py-3 px-2 text-zinc-700 font-medium">
                          {camp.recipient_count} recipients
                        </td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            camp.status === "COMPLETED"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : camp.status === "PROCESSING"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}>
                            {camp.status}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right text-zinc-500 whitespace-nowrap">
                          {formatDate(camp.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-10 text-center text-xs text-zinc-400">
                No agency broadcasts dispatched yet. Use the composer above to send your first message.
              </div>
            )}
          </div>
        </>
      )}

      {/* --- TAB 2: WHATSAPP TEMPLATE STUDIO --- */}
      {activeTab === "TEMPLATES" && (
        <div className="space-y-6">
          {/* Meta WABA Status Card */}
          <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-zinc-900 text-white rounded-2xl p-6 shadow-md border border-emerald-800/60 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Meta Verified Business Account
                </span>
                <span className="text-zinc-400 text-xs font-mono">
                  WABA ID: 1762074318248495
                </span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                WhatsApp Business Template Studio
              </h2>
              <p className="text-xs text-zinc-300 max-w-2xl leading-relaxed">
                Manage and author HSM (Highly Structured Message) templates directly synced with Meta Cloud API v19.0. Create Utility notifications or Marketing campaigns with real-time approval tracking for Meta App Review.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => refetchTemplates()}
                disabled={isTemplatesFetching}
                className="py-2.5 px-4 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <svg
                  className={`w-3.5 h-3.5 ${isTemplatesFetching ? "animate-spin" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>{isTemplatesFetching ? "Syncing..." : "Sync from Meta"}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="py-2.5 px-4 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                <span>Create New Template</span>
              </button>
            </div>
          </div>

          {/* Templates Filter & Table Card */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Status:</span>
                {(["all", "APPROVED", "PENDING", "REJECTED"] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setTemplateStatusFilter(st)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      templateStatusFilter === st
                        ? "bg-zinc-900 text-white shadow-2xs"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                    }`}
                  >
                    {st === "all" ? "All Templates" : st}
                  </button>
                ))}
              </div>

              <div className="text-xs text-zinc-500 font-mono">
                Total: <strong className="text-zinc-900">{templatesData?.count ?? 0}</strong> templates registered
              </div>
            </div>

            {isTemplatesLoading ? (
              <div className="py-16 text-center text-xs text-zinc-400 flex flex-col items-center gap-3">
                <svg className="animate-spin w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Fetching live templates from Meta Graph API...</span>
              </div>
            ) : templatesData?.templates && templatesData.templates.length > 0 ? (
              <div className="divide-y divide-zinc-100 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-zinc-400 font-bold uppercase tracking-wider border-b border-zinc-200 pb-2">
                      <th className="py-2.5 px-3">Template Name</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Language</th>
                      <th className="py-2.5 px-3">Meta Status</th>
                      <th className="py-2.5 px-3">Components / Message Preview</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {templatesData.templates.map((tpl) => {
                      const bodyComp = tpl.components?.find((c: any) => c.type === "BODY");
                      const headerComp = tpl.components?.find((c: any) => c.type === "HEADER");
                      return (
                        <tr key={tpl.id || tpl.name} className="hover:bg-zinc-50/60 transition-colors">
                          <td className="py-3.5 px-3 font-semibold text-zinc-900">
                            <div className="font-mono text-xs text-zinc-900">{tpl.name}</div>
                            {tpl.id && (
                              <div className="text-[10px] text-zinc-400 font-mono">Meta ID: {tpl.id}</div>
                            )}
                          </td>
                          <td className="py-3.5 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              tpl.category === "UTILITY"
                                ? "bg-sky-50 text-sky-700 border border-sky-200"
                                : tpl.category === "AUTHENTICATION"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-purple-50 text-purple-700 border border-purple-200"
                            }`}>
                              {tpl.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 font-mono text-zinc-600 text-[11px]">
                            {tpl.language}
                          </td>
                          <td className="py-3.5 px-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1.5 ${
                              tpl.status === "APPROVED"
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : tpl.status === "PENDING"
                                ? "bg-amber-50 text-amber-800 border border-amber-200"
                                : "bg-red-50 text-red-800 border border-red-200"
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                tpl.status === "APPROVED"
                                  ? "bg-emerald-500"
                                  : tpl.status === "PENDING"
                                  ? "bg-amber-500 animate-pulse"
                                  : "bg-red-500"
                              }`} />
                              {tpl.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 max-w-xs sm:max-w-md">
                            {headerComp?.text && (
                              <div className="text-[11px] font-bold text-zinc-700 truncate">
                                [{headerComp.text}]
                              </div>
                            )}
                            <div className="text-zinc-600 text-[11px] truncate">
                              {bodyComp?.text || "—"}
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            {tpl.status === "APPROVED" ? (
                              <button
                                type="button"
                                onClick={() => handleUseTemplateInDispatcher(tpl)}
                                className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors cursor-pointer"
                              >
                                Use in Broadcast &rarr;
                              </button>
                            ) : (
                              <span className="text-[11px] text-zinc-400 italic">
                                {tpl.status === "PENDING" ? "Awaiting Meta" : "Not Usable"}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-14 text-center text-xs text-zinc-400 space-y-3">
                <p>No WhatsApp templates found under filter &apos;{templateStatusFilter}&apos;.</p>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors cursor-pointer"
                >
                  Create Your First Template
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- CREATE TEMPLATE MODAL (For Meta App Review & Production) --- */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full border border-zinc-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-400/20 text-emerald-200 border border-emerald-400/30">
                    Meta Graph API v19.0
                  </span>
                  <span className="text-xs text-emerald-200/80 font-mono">whatsapp_business_management</span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">
                  Create WhatsApp Business Message Template
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-zinc-300 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body: 2-Column Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-zinc-200">
              {/* Left Column (7 cols): Template Authoring Form */}
              <form onSubmit={handleCreateTemplateSubmit} className="lg:col-span-7 p-6 space-y-4">
                {/* Template Name */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                      Template Name (Identifier)
                    </label>
                    <span className="text-[10px] text-zinc-400 font-mono">Lowercase &amp; underscores only</span>
                  </div>
                  <input
                    type="text"
                    value={tplName}
                    onChange={(e) => setTplName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "_"))}
                    placeholder="e.g. order_status_notification"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs sm:text-sm font-mono text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    required
                  />
                  <p className="text-[11px] text-zinc-400 mt-1">
                    Meta will register this template under WABA: <strong className="font-mono text-zinc-700">1762074318248495</strong>
                  </p>
                </div>

                {/* Category & Language Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Category
                    </label>
                    <select
                      value={tplCategory}
                      onChange={(e) => setTplCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 text-xs text-zinc-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    >
                      <option value="UTILITY">UTILITY (~60s Meta Approval)</option>
                      <option value="MARKETING">MARKETING (~15-30m Review)</option>
                    </select>
                    <p className="text-[10px] text-emerald-700 mt-1 font-medium">
                      {tplCategory === "UTILITY"
                        ? "Ideal for order updates, account alerts, receipts."
                        : "Ideal for promotional campaigns, discounts, announcements."}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Language
                    </label>
                    <select
                      value={tplLanguage}
                      onChange={(e) => setTplLanguage(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 text-xs text-zinc-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    >
                      <option value="en_US">English (US) - en_US</option>
                      <option value="en_GB">English (UK) - en_GB</option>
                      <option value="sw">Swahili - sw</option>
                    </select>
                  </div>
                </div>

                {/* Header (Optional) */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Header Text (Optional)
                  </label>
                  <input
                    type="text"
                    value={tplHeader}
                    onChange={(e) => setTplHeader(e.target.value)}
                    placeholder="e.g. LJK Marketing Agency Announcement"
                    maxLength={60}
                    className="w-full px-3.5 py-2 rounded-lg border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                {/* Body Text & Variable Insert */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider">
                      Body Copy (Mandatory)
                    </label>
                    <button
                      type="button"
                      onClick={handleInsertTplVariable}
                      className="px-2 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span>+ Add Variable</span>
                      <span className="font-mono">{`{{${detectedVariables.length + 1}}}`}</span>
                    </button>
                  </div>

                  <textarea
                    rows={4}
                    value={tplBody}
                    onChange={(e) => setTplBody(e.target.value)}
                    placeholder="Hello {{1}}, your order {{2}} has been confirmed and is out for delivery. Thank you for choosing LJK!"
                    maxLength={1024}
                    className="w-full p-3 rounded-lg border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 leading-relaxed"
                    required
                  />

                  {/* Variable Examples inputs (Mandatory for Meta Approval) */}
                  {detectedVariables.length > 0 && (
                    <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-zinc-700 uppercase tracking-wider">
                          Sample Values for Reviewer (Meta Requirement)
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {detectedVariables.length} variable(s) detected
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {detectedVariables.map((num) => (
                          <div key={num} className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-emerald-700 shrink-0">
                              {`{{${num}}}`}:
                            </span>
                            <input
                              type="text"
                              value={tplVariables[num] || ""}
                              onChange={(e) =>
                                setTplVariables((prev) => ({
                                  ...prev,
                                  [num]: e.target.value,
                                }))
                              }
                              placeholder={`Sample for {{${num}}}`}
                              className="w-full px-2.5 py-1.5 rounded border border-zinc-300 text-xs bg-white text-zinc-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                              required
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer (Optional) */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Footer Text (Optional)
                  </label>
                  <input
                    type="text"
                    value={tplFooter}
                    onChange={(e) => setTplFooter(e.target.value)}
                    placeholder="Reply STOP to unsubscribe"
                    maxLength={60}
                    className="w-full px-3.5 py-2 rounded-lg border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                {/* Submit / Action Bar */}
                <div className="pt-3 border-t border-zinc-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createTemplateMutation.isPending}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {createTemplateMutation.isPending ? (
                      <>
                        <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Submitting to Meta API...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit to Meta Cloud API</span>
                        <span>&rarr;</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Right Column (5 cols): Live Handset Mockup for Template */}
              <div className="lg:col-span-5 p-6 bg-zinc-950 text-white flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-zinc-800 pb-2 mb-4">
                    <span className="font-semibold uppercase tracking-wider text-[10px]">
                      Live Meta Handset Preview
                    </span>
                    <span className="font-mono text-emerald-400 text-[11px]">
                      {tplCategory} &bull; {tplLanguage}
                    </span>
                  </div>

                  {/* Phone Chat Container */}
                  <div className="bg-[#0b141a] rounded-xl overflow-hidden border border-zinc-800 shadow-md">
                    {/* Header bar */}
                    <div className="bg-[#1f2c34] px-4 py-3 flex items-center gap-2.5 border-b border-[#2a3942]">
                      <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-[11px]">
                        LJK
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-xs text-zinc-100 truncate">LJK Marketing Agency</div>
                        <div className="text-[10px] text-zinc-400">Official Business Account</div>
                      </div>
                    </div>

                    {/* Chat bubble */}
                    <div className="p-4 bg-[radial-gradient(#1f2c34_1px,transparent_1px)] [background-size:16px_16px] min-h-56 flex flex-col justify-between">
                      <div className="bg-[#005c4b] text-zinc-100 rounded-xl rounded-tr-xs p-3.5 text-xs leading-relaxed shadow-sm border border-[#02735e] max-w-[95%] self-end space-y-2">
                        {tplHeader && (
                          <div className="font-bold text-zinc-100 text-xs border-b border-[#02735e]/60 pb-1">
                            {tplHeader}
                          </div>
                        )}

                        <div className="text-zinc-100 whitespace-pre-wrap">
                          {previewBodyWithVariables}
                        </div>

                        {tplFooter && (
                          <div className="text-[10px] text-zinc-300/80 border-t border-[#02735e]/60 pt-1">
                            {tplFooter}
                          </div>
                        )}

                        <div className="flex items-center justify-end gap-1 text-[10px] text-zinc-300">
                          <span>12:00 PM</span>
                          <span className="text-sky-400 font-bold">✓✓</span>
                        </div>
                      </div>

                      <div className="text-[10px] text-zinc-400 text-center font-mono pt-3">
                        Meta Graph API Template Specification
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-[11px] text-zinc-400 space-y-1">
                  <div className="font-bold text-zinc-200 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Meta App Review Video Proof</span>
                  </div>
                  <p>
                    Submitting this form makes an authenticated POST call to Meta&apos;s Graph API endpoint. Meta immediately assigns a unique template ID and sets the status to <strong>PENDING</strong> (or <strong>APPROVED</strong>).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
