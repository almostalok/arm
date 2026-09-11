import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  Users,
  Contact2,
  KanbanSquare,
  StickyNote,
  CalendarCheck,
  Settings,
  LogOut,
} from "lucide-react";
import { Logo } from "../ui";
import { cn } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutGrid, end: true },
  { to: "/leads", label: "Leads", icon: Users },
  { to: "/contacts", label: "Contacts", icon: Contact2 },
  { to: "/pipeline", label: "Pipeline", icon: KanbanSquare },
  { to: "/notes", label: "Notes", icon: StickyNote },
  { to: "/tasks", label: "Tasks", icon: CalendarCheck },
];

export function Sidebar({ onNavigate }) {
  const { logout } = useAuth();

  return (
    <aside className="flex h-full w-64 flex-col bg-zinc-900 border-r border-zinc-800 shadow-2xl">
      {/* Brand */}
      <div className="flex items-center px-5 py-5 border-b border-zinc-800">
        <Logo size="md" />
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-1 p-3">
        <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 font-mono">
          Revenue Navigation
        </div>
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                isActive
                  ? "bg-zinc-800 text-zinc-100 border border-zinc-750 shadow-sm"
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer actions */}
      <div className="space-y-1 border-t border-zinc-800 p-3">
        <NavLink
          to="/settings"
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
              isActive
                ? "bg-zinc-800 text-zinc-100 border border-zinc-750 shadow-sm"
                : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
            )
          }
        >
          <Settings className="h-4 w-4" />
          Settings
        </NavLink>
        <button
          onClick={logout}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-zinc-400 transition-colors hover:bg-rose-500/10 hover:text-rose-400 cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </aside>
  );
}
