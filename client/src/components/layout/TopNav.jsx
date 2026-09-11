import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  Menu,
  ChevronDown,
  User,
  LogOut,
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
    <header className="flex items-center gap-3 px-1">
      {/* Brand Logo */}
      <div className="flex items-center gap-2 pr-1">
        <Logo size="md" />
      </div>

      {/* Mobile Menu Toggle */}
      <button
        onClick={onMenuClick}
        className="rounded-lg p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 lg:hidden cursor-pointer"
        aria-label="Open menu"
      >
        <Menu className="h-4.5 w-4.5" />
      </button>

      {/* Centered Modern Nav Pill */}
      <nav className="mx-auto hidden items-center gap-0.5 rounded-lg bg-zinc-900 border border-zinc-800 p-1 shadow-sm lg:flex">
        {LINKS.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "rounded-md px-3 py-1 text-xs font-medium transition-colors select-none",
                isActive
                  ? "bg-zinc-800 text-zinc-100 border border-zinc-700/80 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
              )
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Right Action Cluster */}
      <div className="ml-auto flex items-center gap-2">
        {/* Global Search / Command Bar Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors cursor-pointer"
        >
          <Search className="h-3.5 w-3.5 text-zinc-500" />
          <span>Quick find...</span>
          <kbd className="flex items-center gap-0.5 text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-400">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </button>

        {/* Quick Outreach Mail */}
        <Button
          variant="secondary"
          size="sm"
          onClick={onOpenComposer}
          className="hidden md:inline-flex gap-1.5 text-xs"
        >
          <Mail className="h-3.5 w-3.5 text-zinc-400" />
          <span>Outreach</span>
        </Button>

        {/* Notifications */}
        <IconButton
          variant="outline"
          size="sm"
          aria-label="Notifications"
          className="relative"
        >
          <Bell className="h-3.5 w-3.5" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 ring-2 ring-zinc-950" />
        </IconButton>

        {/* User Workspace Profile */}
        <Dropdown
          trigger={
            <button className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 p-1 pr-2 transition-colors hover:border-zinc-700 hover:bg-zinc-800 cursor-pointer">
              <Avatar name={user?.name || "Alex Carter"} size="sm" status="online" />
              <div className="hidden text-left xl:block">
                <p className="text-xs font-medium text-zinc-100 leading-none">
                  {user?.name || "Alex Carter"}
                </p>
                <p className="text-[10px] text-zinc-400 font-normal leading-none mt-1">
                  Revenue Ops
                </p>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-zinc-400 ml-0.5" />
            </button>
          }
        >
          <DropdownLabel>{user?.email || "alex@armcrm.io"}</DropdownLabel>
          <DropdownSeparator />
          <DropdownItem onClick={() => navigate("/settings")}>
            <User className="h-3.5 w-3.5 text-zinc-400" /> Workspace Settings
          </DropdownItem>
          <DropdownItem danger onClick={logout}>
            <LogOut className="h-3.5 w-3.5" /> Log out
          </DropdownItem>
        </Dropdown>
      </div>
    </header>
  );
}
