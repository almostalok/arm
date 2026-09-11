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

function RailLink({ to, label, icon: Icon, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      title={label}
      className={({ isActive }) =>
        cn(
          "group relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-150 select-none",
          isActive
            ? "bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/20"
            : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
        )
      }
    >
      <Icon className="h-4.5 w-4.5" />
      {/* Tooltip on hover */}
      <span className="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded-lg bg-slate-900 border border-slate-700 px-2.5 py-1 text-xs font-semibold text-white shadow-xl opacity-0 transition-opacity group-hover:opacity-100 z-50 lg:block">
        {label}
      </span>
    </NavLink>
  );
}

export function IconRail() {
  const { logout } = useAuth();

  return (
    <aside className="flex h-full flex-col items-center justify-center gap-2 py-4">
      {/* Primary nav rail */}
      <nav className="flex flex-col items-center gap-2 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-xl shadow-slate-950/40">
        {NAV.map((item) => (
          <RailLink key={item.to} {...item} />
        ))}
      </nav>

      {/* Settings & Logout */}
      <div className="flex flex-col items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-xl shadow-slate-950/40">
        <RailLink to="/settings" label="Settings" icon={Settings} />
        <button
          onClick={logout}
          title="Log out"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-rose-500/10 hover:text-rose-400 cursor-pointer"
        >
          <LogOut className="h-4.5 w-4.5" />
        </button>
      </div>
    </aside>
  );
}
