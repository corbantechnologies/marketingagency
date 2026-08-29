/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { useCreateBusinessUser } from "@/hooks/accounts/actions";

export default function BusinessSignupPage() {
  const router = useRouter();
  const createBusinessMutation = useCreateBusinessUser();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    country: "Kenya",
    password: "",
    password_confirmation: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Client validation
    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      setErrorMessage("Please enter both your first and last name.");
      return;
    }
    if (!formData.email.trim()) {
      setErrorMessage("Please enter your business email address.");
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage("Please enter your phone number.");
      return;
    }
    if (formData.password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }
    if (formData.password !== formData.password_confirmation) {
      setErrorMessage("Passwords do not match. Please verify.");
      return;
    }

    createBusinessMutation.mutate(
      {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        country: formData.country,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      },
      {
        onSuccess: async (data) => {
          toast.success("Account created successfully! Logging you in...");

          // Automatic sign in
          try {
            const res = await signIn("credentials", {
              email: formData.email.trim(),
              password: formData.password,
              redirect: false,
            });

            if (res?.error) {
              toast.success("Registration complete. Please sign in.");
              router.push("/auth/login");
              return;
            }

            const redirectTarget = data.redirect_url || "/dashboard";
            router.push(redirectTarget);
            router.refresh();
          } catch {
            router.push("/auth/login");
          }
        },
        onError: (error: any) => {
          const resData = error?.response?.data;
          const msg =
            resData?.email?.[0] ||
            resData?.phone?.[0] ||
            resData?.password?.[0] ||
            resData?.detail ||
            resData?.message ||
            error?.message ||
            "Unable to complete registration. Please check your details.";
          setErrorMessage(msg);
          toast.error(msg);
        },
      }
    );
  };

  const isSubmitting = createBusinessMutation.isPending;

  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-6 sm:p-8 shadow-xs">
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-purple-50 border border-purple-200 text-[11px] font-semibold text-[#581c87] mb-2">
          Business Client Onboarding
        </div>
        <h1 className="text-xl font-semibold text-zinc-900 tracking-tight">
          Create Your Business Account
        </h1>
        <p className="text-xs text-zinc-600 mt-1">
          Launch high-deliverability SMS campaigns, sender IDs, and revenue automations.
        </p>
      </div>

      {/* Feature perks pill */}
      <div className="mb-5 p-3 rounded bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 flex items-center gap-2">
        <span className="w-5 h-5 rounded-full bg-[#581c87] text-white flex items-center justify-center text-xs font-bold shrink-0">
          ✓
        </span>
        <span>Includes <strong>50 complimentary SMS test credits</strong> &amp; default workspace.</span>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="Jane"
              disabled={isSubmitting}
              required
              className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#581c87] focus:ring-1 focus:ring-[#581c87] transition-colors disabled:bg-zinc-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Doe"
              disabled={isSubmitting}
              required
              className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#581c87] focus:ring-1 focus:ring-[#581c87] transition-colors disabled:bg-zinc-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
            Business Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="jane@company.com"
            disabled={isSubmitting}
            required
            autoComplete="email"
            className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#581c87] focus:ring-1 focus:ring-[#581c87] transition-colors disabled:bg-zinc-100"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+254 700 000000"
              disabled={isSubmitting}
              required
              className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#581c87] focus:ring-1 focus:ring-[#581c87] transition-colors disabled:bg-zinc-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
              Country
            </label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded text-sm text-zinc-900 focus:outline-none focus:border-[#581c87] focus:ring-1 focus:ring-[#581c87] transition-colors disabled:bg-zinc-100"
            >
              <option value="Kenya">Kenya</option>
              <option value="Uganda">Uganda</option>
              <option value="Tanzania">Tanzania</option>
              <option value="Rwanda">Rwanda</option>
              <option value="Nigeria">Nigeria</option>
              <option value="South Africa">South Africa</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min. 8 characters"
                disabled={isSubmitting}
                required
                className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#581c87] focus:ring-1 focus:ring-[#581c87] transition-colors pr-10 disabled:bg-zinc-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-1.5">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                placeholder="Repeat password"
                disabled={isSubmitting}
                required
                className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#581c87] focus:ring-1 focus:ring-[#581c87] transition-colors pr-10 disabled:bg-zinc-100"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-zinc-600">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="rounded border-zinc-300 text-[#581c87] focus:ring-[#581c87]"
            />
            <span>Show passwords</span>
          </label>
          <span className="text-zinc-500 text-[11px]">8+ chars, digits &amp; symbols</span>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 px-4 bg-[#581c87] hover:bg-[#4a1572] active:bg-[#3b0764] text-white font-semibold rounded text-sm transition-all duration-150 flex items-center justify-center gap-2 shadow-xs disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Creating Account...</span>
            </>
          ) : (
            <span>Create Business Account &rarr;</span>
          )}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-zinc-200 text-center">
        <p className="text-xs text-zinc-600">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-[#581c87] font-semibold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}