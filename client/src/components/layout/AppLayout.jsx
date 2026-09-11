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
    <div className="flex h-screen overflow-hidden bg-zinc-950 text-zinc-100 selection:bg-blue-600/30 selection:text-blue-100 font-sans">
      {/* Desktop icon rail */}
      <div className="hidden shrink-0 pl-3 relative z-10 lg:flex">
        <IconRail />
      </div>

      {/* Mobile sidebar drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full animate-[slidein_.2s_ease]">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Column */}
      <div className="flex flex-1 flex-col overflow-hidden relative z-10">
        <div className="px-4 pt-3 md:px-6 md:pt-3">
          <TopNav
            onMenuClick={() => setMobileOpen(true)}
            onOpenCommandPalette={() => setPaletteOpen(true)}
            onOpenComposer={() => setComposerOpen(true)}
          />
        </div>
        <main className="flex-1 overflow-y-auto px-4 py-4 md:px-6 no-scrollbar">
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
