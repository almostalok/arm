import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  LayoutDashboard,
  Users,
  Target,
  Kanban,
  CheckSquare,
  FileText,
  Settings,
  Plus,
  Mail,
  ArrowRight,
  Command,
} from "lucide-react";

export function CommandPalette({ isOpen, onClose, onOpenNewLead, onOpenComposer }) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const navigationItems = [
    { id: "nav-dash", label: "Go to Dashboard", icon: LayoutDashboard, action: () => navigate("/"), category: "Navigation" },
    { id: "nav-leads", label: "View All Leads", icon: Target, action: () => navigate("/leads"), category: "Navigation" },
    { id: "nav-pipeline", label: "Open Deal Pipeline", icon: Kanban, action: () => navigate("/pipeline"), category: "Navigation" },
    { id: "nav-contacts", label: "Contacts Directory", icon: Users, action: () => navigate("/contacts"), category: "Navigation" },
    { id: "nav-tasks", label: "Task Board", icon: CheckSquare, action: () => navigate("/tasks"), category: "Navigation" },
    { id: "nav-notes", label: "Deal Notes & Logs", icon: FileText, action: () => navigate("/notes"), category: "Navigation" },
    { id: "nav-settings", label: "Workspace Settings", icon: Settings, action: () => navigate("/settings"), category: "Navigation" },
  ];

  const actionItems = [
    {
      id: "act-lead",
      label: "Create New Lead / Deal",
      icon: Plus,
      action: () => {
        onClose();
        if (onOpenNewLead) onOpenNewLead();
      },
      category: "Quick Actions",
    },
    {
      id: "act-email",
      label: "Compose Outreach Email",
      icon: Mail,
      action: () => {
        onClose();
        if (onOpenComposer) onOpenComposer();
      },
      category: "Quick Actions",
    },
  ];

  const allItems = [...actionItems, ...navigationItems];

  const filtered = query.trim() === ""
    ? allItems
    : allItems.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
      } else if (e.key === "Enter" && filtered[selectedIndex]) {
        e.preventDefault();
        filtered[selectedIndex].action();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -8 }}
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
            className="relative z-10 w-full max-w-lg rounded-xl bg-zinc-900 border border-zinc-750 shadow-2xl shadow-zinc-950/80 overflow-hidden"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3 border-b border-zinc-800 bg-zinc-900 gap-3">
              <Search className="w-4 h-4 text-zinc-400 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command, search leads, or jump to page..."
                className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
                autoFocus
              />
              <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-400">
                ESC
              </kbd>
            </div>

            {/* Results list */}
            <div className="max-h-80 overflow-y-auto p-1.5 space-y-0.5">
              {filtered.length === 0 ? (
                <div className="p-6 text-center text-zinc-500 text-xs">
                  No matching commands found for "{query}"
                </div>
              ) : (
                filtered.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        item.action();
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-sm transition-colors cursor-pointer select-none ${
                        isSelected
                          ? "bg-zinc-800 text-zinc-100"
                          : "text-zinc-300 hover:bg-zinc-800/60"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`p-1 rounded-md ${
                            isSelected
                              ? "bg-zinc-700 text-zinc-100"
                              : "bg-zinc-800/80 text-zinc-400"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-medium text-xs text-zinc-200">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">
                          {item.category}
                        </span>
                        {isSelected && <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-zinc-950/60 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 font-mono text-[9px]">
                    ↑
                  </kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 font-mono text-[9px]">
                    ↓
                  </kbd>
                  navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 font-mono text-[9px]">
                    ↵
                  </kbd>
                  select
                </span>
              </div>
              <div className="flex items-center gap-1 text-zinc-500 font-mono text-[10px]">
                <Command className="w-2.5 h-2.5" /> + K
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
