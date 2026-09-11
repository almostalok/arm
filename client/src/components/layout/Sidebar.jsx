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
    <aside className="flex h-full w-64 flex-col bg-slate-900 border-r border-slate-800 shadow-2xl">
      {/* Brand */}
      <div className="flex items-center px-6 py-6 border-b border-slate-800">
        <Logo size="md" />
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-1.5 p-4">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-150",
                isActive
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer actions */}
      <div className="space-y-1 border-t border-slate-800 p-4">
        <NavLink
          to="/settings"
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-colors",
              isActive
                ? "bg-indigo-600/20 text-white border border-indigo-500/30"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            )
          }
        >
          <Settings className="h-4 w-4" />
          Workspace Settings
        </NavLink>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-400 transition-colors hover:bg-rose-500/10 hover:text-rose-400 cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </aside>
  );
}
