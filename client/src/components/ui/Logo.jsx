import React from "react";

/**
 * Enterprise geometric monogram logo for ARM (Account & Relationship Manager).
 * Clean, architectural, non-AI styling inspired by Linear / Stripe / Ramp.
 */
export function Logo({ size = "md", showText = true, className = "" }) {
  const sizeMap = {
    sm: { icon: "h-7 w-7", text: "text-sm", sub: "text-[10px]" },
    md: { icon: "h-8 w-8", text: "text-base", sub: "text-[11px]" },
    lg: { icon: "h-10 w-10", text: "text-lg", sub: "text-xs" },
    xl: { icon: "h-12 w-12", text: "text-xl", sub: "text-sm" },
  };

  const { icon, text, sub } = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Precision Geometric Monogram Icon */}
      <div
        className={`relative ${icon} rounded-lg bg-zinc-900 border border-zinc-700/70 flex items-center justify-center overflow-hidden shrink-0 shadow-sm`}
      >
        <svg
          viewBox="0 0 32 32"
          className="w-full h-full p-1"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Architectural ARM Interlocking Structure */}
          <path
            d="M6 24L12 8H15L21 24H17.8L16.4 20H10.6L9.2 24H6ZM11.5 17.2H15.5L13.5 11.5L11.5 17.2Z"
            fill="#3B82F6"
          />
          <path
            d="M18 8H23.5C25.4 8 26.8 9.2 26.8 11.1C26.8 12.6 26 13.7 24.6 14.2L27 24H23.8L21.6 14.8H19.5V24H16.8V8H18ZM19.5 12.6H23.2C23.9 12.6 24.3 12.1 24.3 11.4C24.3 10.7 23.9 10.2 23.2 10.2H19.5V12.6Z"
            fill="#FAFAFA"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5">
            <span className={`font-semibold tracking-tight text-zinc-100 ${text}`}>
              ARM
            </span>
            <span className="text-[9px] uppercase font-mono tracking-wider font-semibold px-1 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
              OPERATIONS
            </span>
          </div>
          <span className={`text-zinc-400 font-normal tracking-normal ${sub}`}>
            Account & Relationship
          </span>
        </div>
      )}
    </div>
  );
}
