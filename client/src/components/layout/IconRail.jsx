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
          "group relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors select-none",
          isActive
            ? "bg-zinc-800 text-zinc-100 border border-zinc-750 shadow-sm"
            : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
        )
      }
    >
      <Icon className="h-4 w-4" />
      {/* Tooltip on hover */}
      <span className="pointer-events-none absolute left-full ml-2.5 hidden whitespace-nowrap rounded-md bg-zinc-900 border border-zinc-750 px-2 py-1 text-[11px] font-medium text-zinc-200 shadow-lg opacity-0 transition-opacity group-hover:opacity-100 z-50 lg:block">
        {label}
      </span>
    </NavLink>
  );
}

export function IconRail() {
  const { logout } = useAuth();

  return (
    <aside className="flex h-full flex-col items-center justify-center gap-2 py-3">
      {/* Primary nav rail */}
      <nav className="flex flex-col items-center gap-1.5 p-1 rounded-xl bg-zinc-900 border border-zinc-800 shadow-sm">
        {NAV.map((item) => (
          <RailLink key={item.to} {...item} />
        ))}
      </nav>

      {/* Settings & Logout */}
      <div className="flex flex-col items-center gap-1 p-1 rounded-xl bg-zinc-900 border border-zinc-800 shadow-sm">
        <RailLink to="/settings" label="Settings" icon={Settings} />
        <button
          onClick={logout}
          title="Log out"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-rose-500/10 hover:text-rose-400 cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}
