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
  X,
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
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="relative z-10 w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl shadow-indigo-950/50 overflow-hidden"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-900/90 gap-3">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command, search leads, or jump to page..."
                className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
                autoFocus
              />
              <button
                onClick={onClose}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
                  ESC
                </kbd>
              </button>
            </div>

            {/* Results list */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              {filtered.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">
                  No matching commands or pages found for "{query}"
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
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-sm transition-colors cursor-pointer select-none ${
                        isSelected
                          ? "bg-indigo-600/20 text-white border border-indigo-500/30"
                          : "text-slate-300 hover:bg-slate-800/60 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-1.5 rounded-lg ${
                            isSelected
                              ? "bg-indigo-600 text-white"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-500 font-medium">
                          {item.category}
                        </span>
                        {isSelected && <ArrowRight className="w-4 h-4 text-indigo-400" />}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px]">
                    ↑
                  </kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px]">
                    ↓
                  </kbd>
                  to navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px]">
                    ↵
                  </kbd>
                  to select
                </span>
              </div>
              <div className="flex items-center gap-1 text-slate-500 font-mono">
                <Command className="w-3 h-3" /> + K to toggle
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
