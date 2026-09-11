import React from "react";
import { motion } from "framer-motion";

export function AnimatedTabs({
  tabs = [],
  activeTab,
  onChange,
  className = "",
  layoutId = "active-pill",
}) {
  return (
    <div className={`flex items-center gap-1 p-1 bg-slate-900/90 border border-slate-800/80 rounded-xl backdrop-blur-md ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer select-none ${
              isActive
                ? "text-white"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId={layoutId}
                transition={{ type: "spring", stiffness: 450, damping: 35 }}
                className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 shadow-md shadow-indigo-600/30 border border-indigo-400/30"
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {Icon && <Icon className="w-3.5 h-3.5" />}
              {tab.label}
              {tab.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isActive
                      ? "bg-white/20 text-white font-bold"
                      : "bg-slate-800 text-slate-400"
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
