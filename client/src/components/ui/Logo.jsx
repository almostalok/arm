import React from "react";

export function Logo({ size = "md", showText = true, className = "" }) {
  const sizeMap = {
    sm: { icon: "h-7 w-7", text: "text-base", sub: "text-[10px]" },
    md: { icon: "h-9 w-9", text: "text-lg", sub: "text-[11px]" },
    lg: { icon: "h-11 w-11", text: "text-xl", sub: "text-xs" },
    xl: { icon: "h-14 w-14", text: "text-2xl", sub: "text-sm" },
  };

  const { icon, text, sub } = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* High-tech metallic glow icon container */}
      <div className={`relative ${icon} rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 p-[1px] shadow-lg shadow-indigo-950/40 border border-slate-700/60 flex items-center justify-center overflow-hidden group`}>
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 via-violet-500/10 to-sky-400/20 opacity-80 group-hover:opacity-100 transition-opacity" />
        <svg
          viewBox="0 0 64 64"
          className="w-full h-full p-1.5 relative z-10 drop-shadow-[0_2px_8px_rgba(99,102,241,0.5)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16 46L24 18H28L36 46H30.8L28.8 38.5H23.2L21.2 46H16ZM24.4 34.2H27.6L26 25.4L24.4 34.2Z"
            fill="url(#logo_grad)"
          />
          <path
            d="M34 18H44C47.3 18 49.5 20 49.5 23.2C49.5 25.6 48.2 27.4 46 28.1L50.5 46H45.5L41.5 29.5H38.5V46H34V18ZM38.5 25.5H43.5C44.8 25.5 45.5 24.8 45.5 23.7C45.5 22.6 44.8 21.9 43.5 21.9H38.5V25.5Z"
            fill="url(#logo_grad)"
          />
          <defs>
            <linearGradient id="logo_grad" x1="16" y1="18" x2="50" y2="46" gradientUnits="userSpaceOnUse">
              <stop stopColor="#818cf8" />
              <stop offset="0.5" stopColor="#c084fc" />
              <stop offset="1" stopColor="#38bdf8" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span className={`font-display font-extrabold tracking-tight text-white ${text}`}>
              ARM
            </span>
            <span className="text-[10px] uppercase font-mono tracking-wider font-semibold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              PRO
            </span>
          </div>
          <span className={`text-slate-400 font-medium tracking-wide mt-0.5 ${sub}`}>
            Relationship Workspace
          </span>
        </div>
      )}
    </div>
  );
}
