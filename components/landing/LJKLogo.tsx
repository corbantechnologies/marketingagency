"use client";

import React, { useId } from "react";

interface LJKLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  variant?: "dark" | "light" | "white";
}

export function LJKLogo({
  className = "",
  size = "md",
  showText = true,
  variant = "dark",
}: LJKLogoProps) {
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9_-]/g, "_");
  const brandGradId = `ljk_grad_${uid}`;
  const purpleGlowId = `ljk_glow_${uid}`;

  const iconDimensions = {
    sm: { w: 30, h: 30 },
    md: { w: 38, h: 38 },
    lg: { w: 46, h: 46 },
  }[size];

  const textColor = variant === "white" ? "text-white" : "text-zinc-900";
  const subtextColor = variant === "white" ? "text-purple-200" : "text-zinc-500";

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Monogram Icon */}
      <svg
        width={iconDimensions.w}
        height={iconDimensions.h}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200 hover:scale-[1.03]"
        aria-label="LJK Marketing Agency Logo"
      >
        <defs>
          <linearGradient id={brandGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#581c87" />
            <stop offset="100%" stopColor="#3b0764" />
          </linearGradient>
          <linearGradient id={purpleGlowId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e9d5ff" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
        </defs>

        {/* Outer badge background with solid color fallback */}
        <rect
          width="100"
          height="100"
          rx="12"
          fill="#581c87"
          style={{ fill: `url(#${brandGradId})` }}
        />
        <rect
          x="2"
          y="2"
          width="96"
          height="96"
          rx="10"
          fill="none"
          stroke="#a855f7"
          strokeWidth="2"
          strokeOpacity="0.4"
        />

        {/* Stylized L */}
        <path
          d="M 20 22 L 31 22 L 31 68 L 50 68 L 50 78 L 20 78 Z"
          fill="#ffffff"
        />
        <path
          d="M 20 22 L 31 22 L 31 40 L 20 40 Z"
          fill="#d8b4fe"
          style={{ fill: `url(#${purpleGlowId})` }}
        />

        {/* Stylized J */}
        <path
          d="M 45 22 L 56 22 L 56 64 C 56 71 51 78 43 78 C 36 78 32 73 32 68 L 40 68 C 40 70 41.5 71 43.5 71 C 45.5 71 47 69.5 47 66 L 47 22 Z"
          fill="#d8b4fe"
          style={{ fill: `url(#${purpleGlowId})` }}
        />

        {/* Stylized K */}
        <path
          d="M 60 22 L 70 22 L 70 78 L 60 78 Z"
          fill="#ffffff"
        />
        <path
          d="M 83 22 L 67 48 L 84 78 L 72 78 L 59 55 L 68 41 L 70 22 Z"
          fill="#ffffff"
        />
        <path
          d="M 70 22 L 83 22 L 72 40 L 66 31 Z"
          fill="#d8b4fe"
          style={{ fill: `url(#${purpleGlowId})` }}
        />

        {/* Precision Growth Dot */}
        <circle
          cx="80"
          cy="74"
          r="4.5"
          fill="#d8b4fe"
          style={{ fill: `url(#${purpleGlowId})` }}
        />
      </svg>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1">
            <span className={`text-sm sm:text-base font-semibold tracking-tight ${textColor}`}>
              LJK
            </span>
            <span className="text-sm sm:text-base font-medium text-[#581c87]">
              Marketing
            </span>
          </div>
          <span className={`text-[10px] sm:text-xs font-normal tracking-wider uppercase ${subtextColor}`}>
            Growth Agency
          </span>
        </div>
      )}
    </div>
  );
}

export default LJKLogo;
