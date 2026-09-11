import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  Menu,
  ChevronDown,
  User,
  LogOut,
  Plus,
  Mail,
  Command,
} from "lucide-react";
import {
  Avatar,
  IconButton,
  Button,
  Dropdown,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
  Logo,
} from "../ui";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../lib/utils";

const LINKS = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/leads", label: "Leads" },
  { to: "/pipeline", label: "Pipeline" },
  { to: "/contacts", label: "Contacts" },
  { to: "/tasks", label: "Tasks" },
  { to: "/notes", label: "Notes" },
];

export function TopNav({ onMenuClick, onOpenCommandPalette, onOpenComposer }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="flex items-center gap-4 px-2">
      {/* Brand Logo */}
      <div className="flex items-center gap-2 pr-2">
        <Logo size="md" />
      </div>

      {/* Mobile Menu Toggle */}
      <button
        onClick={onMenuClick}
        className="rounded-xl p-2 text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden cursor-pointer"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Centered Modern Nav Pill */}
      <nav className="mx-auto hidden items-center gap-1 rounded-2xl bg-slate-900/80 border border-slate-800/80 p-1.5 shadow-xl shadow-slate-950/40 backdrop-blur-xl lg:flex">
        {LINKS.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "rounded-xl px-4 py-1.5 text-xs font-semibold transition-all duration-150 select-none",
                isActive
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              )
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Right Action Cluster */}
      <div className="ml-auto flex items-center gap-2.5">
        {/* Global Search / Command Bar Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-colors shadow-sm cursor-pointer"
        >
          <Search className="h-3.5 w-3.5 text-slate-500" />
          <span>Quick find...</span>
          <kbd className="flex items-center gap-0.5 text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </button>

        {/* Quick Outreach Mail */}
        <Button
          variant="glass"
          size="sm"
          onClick={onOpenComposer}
          className="hidden md:inline-flex gap-1.5 text-xs"
        >
          <Mail className="h-3.5 w-3.5 text-indigo-400" />
          <span>Outreach</span>
        </Button>

        {/* Notifications */}
        <IconButton
          variant="outline"
          size="sm"
          aria-label="Notifications"
          className="relative"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-slate-900" />
        </IconButton>

        {/* User Workspace Profile */}
        <Dropdown
          trigger={
            <button className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 p-1 pr-2.5 transition-all hover:border-slate-700 hover:bg-slate-800/80 cursor-pointer">
              <Avatar name={user?.name || "Alex Carter"} size="sm" status="online" />
              <div className="hidden text-left xl:block">
                <p className="text-xs font-semibold text-white leading-none">
                  {user?.name || "Alex Carter"}
                </p>
                <p className="text-[10px] text-slate-400 font-medium leading-none mt-1">
                  ARM Director
                </p>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 ml-0.5" />
            </button>
          }
        >
          <DropdownLabel>{user?.email || "alex@armcrm.io"}</DropdownLabel>
          <DropdownSeparator />
          <DropdownItem onClick={() => navigate("/settings")}>
            <User className="h-3.5 w-3.5 text-indigo-400" /> Workspace Settings
          </DropdownItem>
          <DropdownItem danger onClick={logout}>
            <LogOut className="h-3.5 w-3.5" /> Log out
          </DropdownItem>
        </Dropdown>
      </div>
    </header>
  );
}
