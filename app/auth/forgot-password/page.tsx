/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  useRequestForgotPassword,
  useConfirmResetPassword,
} from "@/hooks/accounts/actions";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const requestOtpMutation = useRequestForgotPassword();
  const confirmResetMutation = useConfirmResetPassword();

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim()) {
      setErrorMessage("Please enter your registered email address.");
      return;
    }

    requestOtpMutation.mutate(
      { email: email.trim() },
      {
        onSuccess: (data) => {
          toast.success(
            data?.message || "A 6-digit verification code was sent to your email."
          );
          setStep(2);
        },
        onError: (error: any) => {
          const msg =
            error?.response?.data?.email?.[0] ||
            error?.response?.data?.detail ||
            error?.response?.data?.message ||
            error?.message ||
            "No account found with this email address.";
          setErrorMessage(msg);
          toast.error(msg);
        },
      }
    );
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (code.trim().length !== 6) {
      setErrorMessage("Please enter the 6-digit verification code.");
      return;
    }
    if (newPassword.length < 8) {
      setErrorMessage("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please verify.");
      return;
    }

    confirmResetMutation.mutate(
      {
        email: email.trim(),
        code: code.trim(),
        new_password: newPassword,
        confirm_password: confirmPassword,
      },
      {
        onSuccess: () => {
          toast.success("Password reset successfully! Redirecting to sign in...");
          setTimeout(() => {
            router.push("/auth/login");
          }, 1500);
        },
        onError: (error: any) => {
          const msg =
            error?.response?.data?.code?.[0] ||
            error?.response?.data?.new_password?.[0] ||
            error?.response?.data?.detail ||
            error?.response?.data?.message ||
            error?.message ||
            "Invalid or expired verification code.";
          setErrorMessage(msg);
          toast.error(msg);
        },
      }
    );
  };

  const isSubmitting = requestOtpMutation.isPending || confirmResetMutation.isPending;

  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-6 sm:p-8 shadow-xs">
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-purple-50 border border-purple-200 text-[11px] font-semibold text-[#581c87] mb-2">
          Password Recovery
        </div>
        <h1 className="text-xl font-semibold text-zinc-900 tracking-tight">
          {step === 1 ? "Reset Your Password" : "Set New Password"}
        </h1>
        <p className="text-xs text-zinc-600 mt-1">
          {step === 1
            ? "Enter your email address and we'll send a 6-digit verification OTP code."
            : `Enter the 6-digit verification code sent to ${email}.`}
        </p>
      </div>

      {errorMessage && (
        <div className="mb-5 p-3 rounded bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
          <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1 leading-relaxed">{errorMessage}</div>
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleRequestOtp} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
              Registered Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              disabled={isSubmitting}
              required
              autoComplete="email"
              className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#581c87] focus:ring-1 focus:ring-[#581c87] transition-colors disabled:bg-zinc-100"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 bg-[#581c87] hover:bg-[#4a1572] active:bg-[#3b0764] text-white font-semibold rounded text-sm transition-all duration-150 flex items-center justify-center gap-2 shadow-xs disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Sending Code...</span>
              </>
            ) : (
              <span>Send 6-Digit OTP Code &rarr;</span>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleConfirmReset} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
              6-Digit Verification Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              disabled={isSubmitting}
              required
              className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded text-base text-zinc-900 text-center tracking-widest font-mono placeholder:text-zinc-400 focus:outline-none focus:border-[#581c87] focus:ring-1 focus:ring-[#581c87] transition-colors disabled:bg-zinc-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
              New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 8 characters"
                disabled={isSubmitting}
                required
                className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#581c87] focus:ring-1 focus:ring-[#581c87] transition-colors pr-10 disabled:bg-zinc-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
              Confirm New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                disabled={isSubmitting}
                required
                className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#581c87] focus:ring-1 focus:ring-[#581c87] transition-colors pr-10 disabled:bg-zinc-100"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-zinc-600 hover:text-zinc-900 underline"
            >
              Change email
            </button>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-[#581c87] font-medium hover:underline"
            >
              {showPassword ? "Hide passwords" : "Show passwords"}
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 bg-[#581c87] hover:bg-[#4a1572] active:bg-[#3b0764] text-white font-semibold rounded text-sm transition-all duration-150 flex items-center justify-center gap-2 shadow-xs disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Updating Password...</span>
              </>
            ) : (
              <span>Confirm &amp; Reset Password &rarr;</span>
            )}
          </button>
        </form>
      )}

      <div className="mt-6 pt-5 border-t border-zinc-200 text-center">
        <p className="text-xs text-zinc-600">
          Remember your credentials?{" "}
          <Link
            href="/auth/login"
            className="text-[#581c87] font-semibold hover:underline"
          >
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}