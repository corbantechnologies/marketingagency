/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useFetchBusinesses, useUpdateBusiness } from "@/hooks/business/actions";
import { Business } from "@/services/business";

function SenderIdRegistrationForm({ activeBusiness }: { activeBusiness?: Business }) {
  const updateBusinessMutation = useUpdateBusiness();

  const [requestedName, setRequestedName] = useState(activeBusiness?.sender_id || "");
  const [taxPin, setTaxPin] = useState(activeBusiness?.tax_pin || "");
  const [regNumber, setRegNumber] = useState(activeBusiness?.registration_number || "");
  const [useCase, setUseCase] = useState("Promotional Alerts & Marketing");

  const handleRequestSenderId = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestedName.trim()) {
      toast.error("Please enter the requested Sender ID name");
      return;
    }
    if (requestedName.length > 11) {
      toast.error("Sender IDs cannot exceed 11 characters");
      return;
    }
    if (!/^[A-Za-z0-9_]{1,11}$/.test(requestedName.trim())) {
      toast.error("Sender ID must be alphanumeric (letters, numbers, underscores only)");
      return;
    }

    if (!activeBusiness) {
      toast.error("No active business workspace found.");
      return;
    }

    updateBusinessMutation.mutate(
      {
        reference: activeBusiness.reference,
        data: {
          sender_id: requestedName.trim().toUpperCase(),
          sender_id_status: "PENDING",
          tax_pin: taxPin.trim() || undefined,
          registration_number: regNumber.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success(`Sender ID "${requestedName.toUpperCase()}" submitted for carrier verification!`);
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.sender_id?.[0] || "Failed to submit Sender ID request");
        },
      }
    );
  };

  return (
    <form onSubmit={handleRequestSenderId} className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
          Requested Brand Name (Max 11 chars) *
        </label>
        <input
          type="text"
          maxLength={11}
          required
          value={requestedName}
          onChange={(e) => setRequestedName(e.target.value.toUpperCase().replace(/[^A-Za-z0-9_]/g, ""))}
          placeholder="e.g. YOURBRAND"
          className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 font-mono font-bold text-sm text-zinc-900 uppercase focus:outline-none focus:ring-2 focus:ring-[#581c87] placeholder:normal-case placeholder:font-sans placeholder:font-normal"
        />
        <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-1">
          <span>Letters, numbers, underscores only</span>
          <span>{requestedName.length}/11 chars</span>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
          KRA Tax PIN (For Telco Verification)
        </label>
        <input
          type="text"
          value={taxPin}
          onChange={(e) => setTaxPin(e.target.value.toUpperCase())}
          placeholder="e.g. P051234567Z"
          className="w-full px-3.5 py-2 text-xs rounded-lg border border-zinc-300 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#581c87]"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
          Business Registration / Certificate No.
        </label>
        <input
          type="text"
          value={regNumber}
          onChange={(e) => setRegNumber(e.target.value.toUpperCase())}
          placeholder="e.g. CPR/2024/123456"
          className="w-full px-3.5 py-2 text-xs rounded-lg border border-zinc-300 font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#581c87]"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
          Primary Messaging Use Case
        </label>
        <select
          value={useCase}
          onChange={(e) => setUseCase(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#581c87] bg-white cursor-pointer"
        >
          <option value="Promotional Alerts & Marketing">Promotional Alerts &amp; Marketing</option>
          <option value="Transactional & OTP Verification">Transactional &amp; OTP Verification</option>
          <option value="Customer Support & Notifications">Customer Support &amp; Notifications</option>
        </select>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={updateBusinessMutation.isPending}
          className="w-full py-2.5 px-4 bg-[#581c87] hover:bg-[#4a1572] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
        >
          {updateBusinessMutation.isPending ? "Submitting for Review..." : "Submit for Telco Approval"}
        </button>
      </div>
    </form>
  );
}

export default function SenderIdsPage() {
  const { data: businessesData, isLoading } = useFetchBusinesses();

  const businesses: Business[] = Array.isArray(businessesData)
    ? businessesData
    : (businessesData as any)?.results || [];

  const activeBusiness = businesses[0]; // Active workspace business

  const [previewText, setPreviewText] = useState(
    "Hello John, your order #5432 has been confirmed and dispatched! Thank you for shopping with us."
  );

  const senderIdStatus = activeBusiness?.sender_id_status || "PENDING";
  const currentSenderId = activeBusiness?.sender_id || "";

  return (
    <div className="space-y-6 w-full max-w-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
            <Link href="/business/dashboard" className="hover:text-zinc-900">Dashboard</Link>
            <span>/</span>
            <span className="text-zinc-900 font-medium">Sender IDs</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            Alphanumeric Sender ID &amp; Brand Whitelisting
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 mt-0.5">
            Register your official brand header to display your company name on recipient mobile handsets across Safaricom and Airtel.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-xs text-zinc-500">Loading Sender ID configuration...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 7 cols: Status & Live Preview */}
          <div className="lg:col-span-7 space-y-6">
            {/* Active Status Card */}
            <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-zinc-900">
                Workspace Sender ID Status
              </h2>

              {currentSenderId ? (
                <div className={`p-5 rounded-xl border ${
                  senderIdStatus === "APPROVED"
                    ? "bg-emerald-50/50 border-emerald-200"
                    : senderIdStatus === "REJECTED"
                    ? "bg-red-50/50 border-red-200"
                    : "bg-amber-50/50 border-amber-200"
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Requested Header</div>
                      <div className="font-mono font-bold text-xl text-zinc-900 tracking-wider mt-0.5">
                        {currentSenderId}
                      </div>
                    </div>

                    <div>
                      {senderIdStatus === "APPROVED" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                          Approved &bull; Live on Telco Routes
                        </span>
                      )}
                      {senderIdStatus === "PENDING" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          Pending Telco Compliance Review
                        </span>
                      )}
                      {senderIdStatus === "REJECTED" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
                          Rejected by Regulator
                        </span>
                      )}
                    </div>
                  </div>

                  {senderIdStatus === "PENDING" && (
                    <p className="text-xs text-amber-800 mt-3 pt-3 border-t border-amber-200/60 leading-relaxed">
                      Your requested Sender ID is currently being processed with Safaricom &amp; Airtel. Typical turnaround time is <strong>12 to 24 hours</strong>. While pending, your SMS dispatches will use our shared high-throughput gateway.
                    </p>
                  )}

                  {senderIdStatus === "REJECTED" && (
                    <div className="text-xs text-red-700 mt-3 pt-3 border-t border-red-200/60 leading-relaxed">
                      <strong>Rejection Reason:</strong> {activeBusiness?.sender_id_rejection_reason || "Brand name does not match submitted business registration records."}
                    </div>
                  )}

                  {senderIdStatus === "APPROVED" && (
                    <p className="text-xs text-emerald-800 mt-3 pt-3 border-t border-emerald-200/60 leading-relaxed">
                      ✓ Fully whitelisted. All outgoing SMS campaigns from <strong>{activeBusiness?.name}</strong> will originate from <strong>{currentSenderId}</strong>.
                    </p>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-dashed border-zinc-300 text-center py-8">
                  <div className="text-xs text-zinc-500">
                    No custom Alphanumeric Sender ID registered yet. You are currently sending from our default shared routes (<strong>LJK_AGENCY</strong>).
                  </div>
                </div>
              )}
            </div>

            {/* Handset Live Mockup Preview */}
            <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs">
              <h3 className="text-sm font-bold text-zinc-900 mb-3">
                Recipient Handset Preview
              </h3>

              {/* Smartphone mockup */}
              <div className="max-w-xs mx-auto bg-zinc-900 rounded-3xl p-3 shadow-xl border-4 border-zinc-800">
                {/* Screen */}
                <div className="bg-zinc-100 rounded-2xl p-3.5 space-y-3 min-h-[260px] flex flex-col justify-between">
                  {/* SMS Header */}
                  <div className="text-center border-b border-zinc-200 pb-2">
                    <div className="w-8 h-8 rounded-full bg-[#581c87] text-white flex items-center justify-center text-xs font-bold mx-auto mb-1 shadow-2xs">
                      {(currentSenderId || "LJK")[0]}
                    </div>
                    <div className="font-mono font-bold text-xs text-zinc-900 tracking-wider">
                      {currentSenderId || "LJK_AGENCY"}
                    </div>
                    <div className="text-[9px] text-zinc-400">Direct Carrier Interconnect</div>
                  </div>

                  {/* SMS Bubble */}
                  <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-xs border border-zinc-200 text-[11px] text-zinc-800 leading-relaxed space-y-1">
                    <p>{previewText}</p>
                    <div className="text-[9px] text-zinc-400 text-right">Just now &bull; Delivered</div>
                  </div>

                  {/* Reply Input Mockup */}
                  <div className="bg-zinc-200/80 rounded-full px-3 py-1.5 text-[10px] text-zinc-500 text-center">
                    Text message (SMS)
                  </div>
                </div>
              </div>

              {/* Sample text editor */}
              <div className="mt-4">
                <label className="block text-[11px] font-semibold text-zinc-600 mb-1">
                  Test SMS Sample Content
                </label>
                <input
                  type="text"
                  value={previewText}
                  onChange={(e) => setPreviewText(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#581c87]"
                />
              </div>
            </div>

            {/* Regulation Guidelines */}
            <div className="bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs text-xs space-y-3">
              <h3 className="font-bold text-zinc-900">Communication Authority (CA) &amp; Carrier Guidelines</h3>
              <ul className="space-y-2 text-zinc-600 list-disc list-inside leading-relaxed">
                <li>Maximum length: <strong>11 alphanumeric characters</strong> (A–Z, 0–9, underscores).</li>
                <li>Generic names like &ldquo;INFO&rdquo;, &ldquo;OFFER&rdquo;, or &ldquo;BANK&rdquo; are prohibited by telco regulators.</li>
                <li>Sender ID must be associated with your registered business name or valid trademark.</li>
                <li>Whitelisting is submitted to Safaricom, Airtel Kenya, and Telkom simultaneously.</li>
              </ul>
            </div>
          </div>

          {/* Right 5 cols: Registration Form */}
          <div className="lg:col-span-5 bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 shadow-xs h-fit space-y-4">
            <div>
              <h2 className="text-base font-bold text-zinc-900">
                {currentSenderId ? "Update / Re-request Sender ID" : "Register Brand Sender ID"}
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Submit your official brand name for carrier whitelisting.
              </p>
            </div>

            <SenderIdRegistrationForm
              key={activeBusiness?.reference || "new"}
              activeBusiness={activeBusiness}
            />
          </div>
        </div>
      )}
    </div>
  );
}
