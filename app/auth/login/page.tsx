"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import toast from "react-hot-toast";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!identifier.trim()) {
      setErrorMessage("Please enter your email address or agency member code.");
      return;
    }
    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        email: identifier.trim(),
        password,
        redirect: false,
      });

      if (res?.error) {
        const msg =
          res.error === "CredentialsSignin"
            ? "Invalid email/member code or password. Please verify and try again."
            : res.error;
        setErrorMessage(msg);
        toast.error(msg);
        setIsLoading(false);
        return;
      }

      toast.success("Welcome back! Redirecting to your workspace...");

      // Fetch fresh session to determine redirect destination
      const session = await getSession();

      if (callbackUrl && !callbackUrl.includes("/auth/")) {
        router.push(callbackUrl);
      } else if (
        session?.user?.role === "admin" ||
        session?.user?.is_admin ||
        session?.user?.is_staff
      ) {
        router.push("/admin/dashboard");
      } else {
        router.push("/business/dashboard");
      }
      router.refresh();
    } catch {
      setErrorMessage("An unexpected network error occurred. Please try again.");
      toast.error("Network error. Please check your connection.");
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-6 sm:p-8 shadow-xs">
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-purple-50 border border-purple-200 text-[11px] font-semibold text-[#581c87] mb-2">
          Secure Portal Access
        </div>
        <h1 className="text-xl font-semibold text-zinc-900 tracking-tight">
          Sign In to Your Account
        </h1>
        <p className="text-xs text-zinc-600 mt-1">
          Access your Bulk SMS campaigns, analytics, and business billing.
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
            Email or Member Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="client@example.com or MA26001"
            disabled={isLoading}
            required
            autoComplete="username"
            className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#581c87] focus:ring-1 focus:ring-[#581c87] transition-colors disabled:bg-zinc-100"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700">
              Password <span className="text-red-500">*</span>
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-xs text-[#581c87] hover:underline font-medium"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={isLoading}
              required
              autoComplete="current-password"
              className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#581c87] focus:ring-1 focus:ring-[#581c87] transition-colors pr-10 disabled:bg-zinc-100"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-800"
              tabIndex={-1}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 px-4 bg-[#581c87] hover:bg-[#4a1572] active:bg-[#3b0764] text-white font-semibold rounded text-sm transition-all duration-150 flex items-center justify-center gap-2 shadow-xs disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Authenticating...</span>
            </>
          ) : (
            <span>Sign In to Dashboard &rarr;</span>
          )}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-zinc-200 text-center">
        <p className="text-xs text-zinc-600">
          Don&apos;t have an account yet?{" "}
          <Link
            href="/auth/signup"
            className="text-[#581c87] font-semibold hover:underline"
          >
            Create a Business Account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-500">Loading sign in...</div>}>
      <LoginForm />
    </Suspense>
  );
}