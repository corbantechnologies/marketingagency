"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  useFetchAdminSenderIdQueue,
  useReviewAdminSenderId,
} from "@/hooks/business/actions";
import { SenderIdQueueItem } from "@/services/business";

export default function AdminSenderIdsPage() {
  const [activeTab, setActiveTab] = useState<"PENDING" | "APPROVED" | "REJECTED" | "ALL">("PENDING");
  const { data, isLoading, isFetching, refetch } = useFetchAdminSenderIdQueue(activeTab);
  const reviewMutation = useReviewAdminSenderId();

  const [selectedItemForReject, setSelectedItemForReject] = useState<SenderIdQueueItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Document preview modal state
  const [previewDocUrl, setPreviewDocUrl] = useState<string | null>(null);

  const vitals = data?.vitals;
  const items = data?.results || [];

  const handleApprove = async (item: SenderIdQueueItem) => {
    if (!confirm(`Are you sure you want to APPROVE Sender ID "${item.sender_id}" for ${item.name}? An activation confirmation email will be dispatched immediately.`)) {
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await reviewMutation.mutateAsync({
        business_reference: item.reference,
        action: "APPROVE",
      });
      if (res?.success) {
        toast.success(res.message || `Sender ID ${item.sender_id} approved!`);
        refetch();
      } else {
        toast.error("Could not approve Sender ID.");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || err?.message || "Failed to approve Sender ID.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemForReject) return;
    if (!rejectionReason.trim()) {
      toast.error("Please enter a regulatory rejection reason for the client.");
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await reviewMutation.mutateAsync({
        business_reference: selectedItemForReject.reference,
        action: "REJECT",
        rejection_reason: rejectionReason.trim(),
      });
      if (res?.success) {
        toast.success(res.message || "Sender ID rejected and client notified via email.");
        setSelectedItemForReject(null);
        setRejectionReason("");
        refetch();
      } else {
        toast.error("Could not reject Sender ID.");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || err?.message || "Failed to reject Sender ID.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
              Telco Vetting Queue
            </span>
            <span className="text-xs text-zinc-500">Safaricom &bull; Airtel &bull; Telkom Clearance</span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 mt-1">
            Sender ID Approval & Telco Vetting
          </h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            Audit alphanumeric headers, inspect KYC registration documents, and approve telecom routes.
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
            Refresh Queue
          </button>
        </div>
      </div>

      {/* Telco Vetting SOP Quick Reference Banner */}
      <div className="p-4 bg-purple-50/70 rounded-xl border border-purple-200 text-xs text-purple-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <div className="font-bold text-purple-900 text-sm">
              Safaricom & CAK Alphanumeric Vetting Guidelines
            </div>
            <p className="text-purple-800/90 mt-0.5 leading-relaxed">
              1. Maximum 11 characters &bull; 2. No special symbols (underscores permitted) &bull; 3. Header must clearly correlate with business name &bull; 4. Registration Certificate & KRA PIN must be valid and legible.
            </p>
          </div>
        </div>
        <div className="text-[11px] font-semibold text-purple-700 bg-white/80 px-3 py-1.5 rounded-lg border border-purple-200 shrink-0 self-start md:self-auto">
          Automated Client Emails Active
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200 pb-2">
        <button
          onClick={() => setActiveTab("PENDING")}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === "PENDING"
              ? "bg-amber-100 text-amber-900 border border-amber-300"
              : "text-zinc-600 hover:bg-zinc-100"
          }`}
        >
          <span>Pending Vetting</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900">
            {vitals?.total_pending ?? 0}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("APPROVED")}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === "APPROVED"
              ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
              : "text-zinc-600 hover:bg-zinc-100"
          }`}
        >
          <span>Approved & Live</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-200 text-emerald-900">
            {vitals?.total_approved ?? 0}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("REJECTED")}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === "REJECTED"
              ? "bg-red-100 text-red-900 border border-red-300"
              : "text-zinc-600 hover:bg-zinc-100"
          }`}
        >
          <span>Rejected / Needs Revision</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-red-200 text-red-900">
            {vitals?.total_rejected ?? 0}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("ALL")}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === "ALL"
              ? "bg-purple-100 text-purple-900 border border-purple-300"
              : "text-zinc-600 hover:bg-zinc-100"
          }`}
        >
          <span>All Records ({vitals?.total_count ?? 0})</span>
        </button>
      </div>

      {/* Sender IDs Queue Table */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden">
        {items.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-zinc-100 text-zinc-400 mx-auto flex items-center justify-center mb-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-zinc-900">No Sender IDs in this queue</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
              There are currently no submissions matching the &quot;{activeTab}&quot; filter status.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {items.map((item) => (
              <div key={item.reference} className="p-5 hover:bg-zinc-50/50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Column: Alphanumeric Tag & Business Details */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="px-3 py-1 bg-zinc-900 text-emerald-400 font-mono font-black text-sm tracking-wider rounded-md shadow-xs border border-zinc-800">
                        {item.sender_id}
                      </span>

                      {/* Status Tag */}
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          item.sender_id_status === "APPROVED"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                            : item.sender_id_status === "PENDING"
                            ? "bg-amber-50 text-amber-800 border-amber-300 animate-pulse"
                            : "bg-red-50 text-red-800 border-red-300"
                        }`}
                      >
                        {item.sender_id_status === "APPROVED"
                          ? "✓ Live & Approved"
                          : item.sender_id_status === "PENDING"
                          ? "⏳ Pending Telco Vetting"
                          : "✕ Rejected"}
                      </span>

                      <span className="text-xs text-zinc-400 font-mono">
                        Ref: {item.reference}
                      </span>
                    </div>

                    <div className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                      <span>{item.name}</span>
                      <span className="text-xs font-normal text-zinc-500">
                        &bull; Owner: {item.owner_name} ({item.owner_email})
                      </span>
                    </div>

                    {/* KYC Credentials */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-600 pt-1">
                      <div>
                        <span className="text-zinc-400">KRA PIN:</span>{" "}
                        <span className="font-mono font-medium">{item.tax_pin || "Not provided"}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400">Reg No:</span>{" "}
                        <span className="font-mono font-medium">{item.registration_number || "Not provided"}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400">Reg Date:</span>{" "}
                        <span>{item.registration_date || "—"}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400">Wallet Balance:</span>{" "}
                        <span className="font-semibold text-purple-700">{item.wallet_balance} SMS</span>
                      </div>
                    </div>

                    {/* Rejection reason note if rejected */}
                    {item.sender_id_status === "REJECTED" && item.sender_id_rejection_reason && (
                      <div className="p-2.5 bg-red-50 rounded-lg border border-red-200 text-xs text-red-900 mt-2">
                        <span className="font-bold">Rejection Note:</span> {item.sender_id_rejection_reason}
                      </div>
                    )}
                  </div>

                  {/* Right Column: KYC Certificate & Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
                    {/* Document View Button */}
                    {item.registration_document_url ? (
                      <button
                        type="button"
                        onClick={() => setPreviewDocUrl(item.registration_document_url)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Certificate
                      </button>
                    ) : (
                      <span className="text-xs text-zinc-400 italic px-2">
                        No doc uploaded
                      </span>
                    )}

                    {/* Action Buttons */}
                    {item.sender_id_status !== "APPROVED" && (
                      <button
                        type="button"
                        onClick={() => handleApprove(item)}
                        disabled={isSubmittingReview}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Approve & Activate
                      </button>
                    )}

                    {item.sender_id_status !== "REJECTED" && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedItemForReject(item);
                          setRejectionReason(item.sender_id_rejection_reason || "");
                        }}
                        disabled={isSubmittingReview}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rejection Feedback Modal */}
      {selectedItemForReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-zinc-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
              <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <span>⚠️ Reject Sender ID: {selectedItemForReject.sender_id}</span>
              </h3>
              <button
                type="button"
                onClick={() => setSelectedItemForReject(null)}
                className="text-zinc-400 hover:text-zinc-600 p-1 rounded-md"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleRejectSubmit} className="p-5 space-y-4">
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 leading-relaxed">
                <strong>Regulatory Notice:</strong> The reason you enter below will be formatted into an official email and sent directly to <strong>{selectedItemForReject.owner_email}</strong> with instructions on how to resubmit.
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Rejection Reason & Required Corrections *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="e.g. The KRA PIN provided does not match the registered business entity name. Please re-upload your Certificate of Incorporation."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 text-zinc-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setSelectedItemForReject(null)}
                  disabled={isSubmittingReview}
                  className="px-3.5 py-2 text-xs font-semibold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingReview ? "Dispatching Feedback..." : "Confirm Rejection & Notify Owner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {previewDocUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-5 py-3 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
              <h3 className="text-sm font-bold text-zinc-900">
                Business Registration Document Preview
              </h3>
              <div className="flex items-center gap-2">
                <a
                  href={previewDocUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-md border border-purple-200"
                >
                  Open in New Tab ↗
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewDocUrl(null)}
                  className="text-zinc-400 hover:text-zinc-600 p-1 rounded-md"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-4 flex-1 overflow-auto flex items-center justify-center bg-zinc-100">
              {previewDocUrl.endsWith(".pdf") ? (
                <iframe
                  src={previewDocUrl}
                  title="Document Preview"
                  className="w-full h-[600px] border border-zinc-300 rounded"
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={previewDocUrl}
                  alt="Business Registration Document"
                  className="max-h-[70vh] object-contain rounded border border-zinc-300 shadow-sm"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
