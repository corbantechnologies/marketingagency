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
import { MessageTemplate, TemplateCategory } from "@/services/messagetemplates";

export default function MessageTemplatesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);
  const [deletingTemplate, setDeletingTemplate] = useState<MessageTemplate | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState<TemplateCategory>("MARKETING");
  const [body, setBody] = useState("");

  // Queries & Mutations
  const { data: templatesData, isLoading } = useFetchMessageTemplates({
    search: searchTerm || undefined,
    category: categoryFilter !== "ALL" ? (categoryFilter as any) : undefined,
  });

  const createMutation = useCreateMessageTemplate();
  const updateMutation = useUpdateMessageTemplate();
  const deleteMutation = useDeleteMessageTemplate();

  const templates = useMemo(() => {
    if (!templatesData) return [];
    const list = Array.isArray(templatesData) ? templatesData : (templatesData as any)?.results || [];
    return list.filter((t: any) => t.is_active !== false);
  }, [templatesData]);

  // Segment calculation
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
      {/* Header */}
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
            Reusable SMS &amp; Message Templates
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 mt-0.5">
            Create, manage, and reuse message templates with dynamic contact personalization tags.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="py-2.5 px-4 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors shadow-xs cursor-pointer inline-flex items-center gap-2"
        >
          <span>+ Create Template</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search templates by name or text..."
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
      {isLoading ? (
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
                  href={`/business/sms/broadcast?template=${tpl.reference}`}
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

      {/* Modal: Create / Edit Template */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h2 className="text-base font-bold text-zinc-900">
                {editingTemplate ? "Edit Message Template" : "New Message Template"}
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
