import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { IconRail } from "./IconRail";
import { TopNav } from "./TopNav";
import { Sidebar } from "./Sidebar";
import { CommandPalette } from "../ui/CommandPalette";
import { EmailComposerDialog } from "../outreach/EmailComposerDialog";

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);

  // Global ⌘K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background glowing ambiance */}
      <div className="fixed inset-0 pointer-events-none noise-overlay z-0" />
      <div className="fixed top-0 left-1/3 w-[600px] h-[300px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[250px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Desktop icon rail */}
      <div className="hidden shrink-0 pl-3.5 relative z-10 lg:flex">
        <IconRail />
      </div>

      {/* Mobile sidebar drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full animate-[slidein_.25s_ease]">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Column */}
      <div className="flex flex-1 flex-col overflow-hidden relative z-10">
        <div className="px-4 pt-4 md:px-6 md:pt-4">
          <TopNav
            onMenuClick={() => setMobileOpen(true)}
            onOpenCommandPalette={() => setPaletteOpen(true)}
            onOpenComposer={() => setComposerOpen(true)}
          />
        </div>
        <main className="flex-1 overflow-y-auto px-4 py-5 md:px-6 no-scrollbar">
          <div className="mx-auto max-w-7xl">
            <Outlet context={{ openComposer: () => setComposerOpen(true) }} />
          </div>
        </main>
      </div>

      {/* Universal Command Palette (⌘K) */}
      <CommandPalette
        isOpen={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onOpenComposer={() => setComposerOpen(true)}
      />

      {/* Global Outreach Email Composer */}
      <EmailComposerDialog
        open={composerOpen}
        onClose={() => setComposerOpen(false)}
      />
    </div>
  );
}
