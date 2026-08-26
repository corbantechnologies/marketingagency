import React from "react";

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
  const iconDimensions = {
    sm: { w: 28, h: 28 },
    md: { w: 36, h: 36 },
    lg: { w: 44, h: 44 },
  }[size];

  const textColor =
    variant === "white"
      ? "text-white"
      : "text-zinc-900";

  const subtextColor =
    variant === "white"
      ? "text-purple-200"
      : "text-zinc-500";

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Monogram Icon */}
      <svg
        width={iconDimensions.w}
        height={iconDimensions.h}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200 hover:scale-[1.03]"
        aria-label="LJK Marketing Agency Logo"
      >
        <defs>
          <linearGradient id="ljk-brand-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#581c87" />
            <stop offset="100%" stopColor="#3b0764" />
          </linearGradient>
          <linearGradient id="ljk-purple-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d8b4fe" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>

        {/* Outer subtle rounded badge */}
        <rect width="100" height="100" rx="10" fill="url(#ljk-brand-grad)" />
        <rect
          x="3"
          y="3"
          width="94"
          height="94"
          rx="8"
          stroke="#9333ea"
          strokeWidth="1.5"
          strokeOpacity="0.4"
        />

        {/* Stylized L */}
        <path
          d="M 20 22 L 31 22 L 31 68 L 50 68 L 50 78 L 20 78 Z"
          fill="#ffffff"
        />
        <path
          d="M 20 22 L 31 22 L 31 40 L 20 40 Z"
          fill="url(#ljk-purple-glow)"
        />

        {/* Stylized J */}
        <path
          d="M 45 22 L 56 22 L 56 64 C 56 71 51 78 43 78 C 36 78 32 73 32 68 L 40 68 C 40 70 41.5 71 43.5 71 C 45.5 71 47 69.5 47 66 L 47 22 Z"
          fill="url(#ljk-purple-glow)"
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
          fill="url(#ljk-purple-glow)"
        />

        {/* Precision Growth Diamond / Dot */}
        <rect x="76" y="70" width="8" height="8" rx="1" fill="url(#ljk-purple-glow)" />
      </svg>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1">
            <span className={`text-base font-semibold tracking-tight ${textColor}`}>
              LJK
            </span>
            <span className="text-base font-medium text-[#581c87]">
              Marketing
            </span>
          </div>
          <span className={`text-xs font-normal tracking-wider uppercase ${subtextColor}`}>
            Growth Agency
          </span>
        </div>
      )}
    </div>
  );
}
