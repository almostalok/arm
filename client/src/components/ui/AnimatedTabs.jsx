import React from "react";
import { motion } from "framer-motion";

export function AnimatedTabs({
  tabs = [],
  activeTab,
  onChange,
  className = "",
  layoutId = "active-pill",
  variant = "zinc", // 'zinc' | 'blue'
}) {
  return (
    <div className={`flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-lg ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer select-none ${
              isActive
                ? "text-zinc-100"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId={layoutId}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                className={`absolute inset-0 rounded-md shadow-sm ${
                  variant === "blue"
                    ? "bg-blue-600 text-white border border-blue-500/40"
                    : "bg-zinc-800 border border-zinc-700/80"
                }`}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {Icon && <Icon className="w-3.5 h-3.5" />}
              {tab.label}
              {tab.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                    isActive
                      ? "bg-zinc-700 text-zinc-200"
                      : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
