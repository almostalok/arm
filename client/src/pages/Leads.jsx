import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Users,
  TrendingUp,
  Trophy,
  Coins,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  X,
  LayoutGrid,
  Table2,
  Download,
  Building2,
  Mail,
  Zap,
} from "lucide-react";
import { PageHeader } from "../components/common/PageHeader";
import { EmptyState } from "../components/common/EmptyState";
import { ConfirmDialog } from "../components/common/ConfirmDialog";
import { LeadFormDialog } from "../components/leads/LeadFormDialog";
import { LeadDrawer } from "../components/leads/LeadDrawer";
import { EmailComposerDialog } from "../components/outreach/EmailComposerDialog";
import {
  Card,
  Button,
  Badge,
  Avatar,
  Select,
  Dropdown,
  DropdownItem,
  NumberTicker,
  SpotlightCard,
} from "../components/ui";
import { leadsApi } from "../lib/services";
import { currency, relative } from "../lib/format";
import {
  LEAD_STAGES,
  LEAD_PRIORITIES,
  LEAD_SOURCES,
  STAGE_STYLES,
  PRIORITY_STYLES,
} from "../lib/constants";
import { cn } from "../lib/utils";
import { toast } from "sonner";

export default function Leads() {
  const [leads, setLeads] = useState(null);
  const [filters, setFilters] = useState({ status: "", priority: "", source: "", search: "" });
  const [sort, setSort] = useState({ key: "updatedAt", dir: "desc" });
  const [selected, setSelected] = useState(() => new Set());
  const [view, setView] = useState("table");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [drawerLead, setDrawerLead] = useState(null);
  const [emailLead, setEmailLead] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLeads(null);
    setSelected(new Set());
    leadsApi.list().then((res) => setLeads(res.leads)).catch(() => setLeads([]));
  };
  useEffect(load, []);

  const stageCounts = useMemo(() => {
    const c = { All: leads?.length || 0 };
    LEAD_STAGES.forEach((s) => (c[s] = 0));
    (leads || []).forEach((l) => (c[l.status] = (c[l.status] || 0) + 1));
    return c;
  }, [leads]);

  const kpis = useMemo(() => {
    const list = leads || [];
    const open = list.filter((l) => l.status !== "Won" && l.status !== "Lost");
    const openValue = open.reduce((s, l) => s + (l.value || 0), 0);
    const wonValue = list
      .filter((l) => l.status === "Won")
      .reduce((s, l) => s + (l.value || 0), 0);
    const total = list.reduce((s, l) => s + (l.value || 0), 0);
    return {
      count: list.length,
      openValue,
      wonValue,
      avg: list.length ? Math.round(total / list.length) : 0,
    };
  }, [leads]);

  const filtered = useMemo(() => {
    if (!leads) return [];
    return leads.filter((l) => {
      if (filters.status && l.status !== filters.status) return false;
      if (filters.priority && l.priority !== filters.priority) return false;
      if (filters.source && l.source !== filters.source) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        return (
          l.name?.toLowerCase().includes(q) ||
          l.company?.toLowerCase().includes(q) ||
          l.email?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [leads, filters]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    const { key, dir } = sort;
    arr.sort((a, b) => {
      let av, bv;
      if (key === "name") {
        av = a.name?.toLowerCase() || "";
        bv = b.name?.toLowerCase() || "";
      } else if (key === "value") {
        av = a.value || 0;
        bv = b.value || 0;
      } else {
        av = new Date(a.updatedAt).getTime();
        bv = new Date(b.updatedAt).getTime();
      }
      if (av < bv) return dir === "asc" ? -1 : 1;
      if (av > bv) return dir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filtered, sort]);

  const filtersActive =
    filters.status || filters.priority || filters.source || filters.search;

  const toggleSort = (key) =>
    setSort((s) =>
      s.key === key
        ? { key, dir: s.dir === "asc" ? "desc" : "asc" }
        : { key, dir: key === "name" ? "asc" : "desc" }
    );

  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (lead) => {
    setDrawerLead(null);
    setEditing(lead);
    setFormOpen(true);
  };

  const toggleRow = (id) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const allVisibleSelected =
    sorted.length > 0 && sorted.every((l) => selected.has(l._id));
  const toggleAll = () =>
    setSelected(allVisibleSelected ? new Set() : new Set(sorted.map((l) => l._id)));

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await leadsApi.remove(toDelete._id);
      toast.success("Lead removed");
      setToDelete(null);
      setDrawerLead(null);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const confirmBulkDelete = async () => {
    setDeleting(true);
    try {
      await Promise.all([...selected].map((id) => leadsApi.remove(id)));
      toast.success(`${selected.size} leads deleted`);
      setBulkOpen(false);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const exportCSV = () => {
    const rows = selected.size > 0 ? sorted.filter((l) => selected.has(l._id)) : sorted;
    if (!rows.length) {
      toast.error("Nothing to export");
      return;
    }
    const headers = [
      "Name", "Company", "Email", "Phone", "Stage",
      "Priority", "Source", "Value", "Created", "Updated",
    ];
    const esc = (v) => {
      const s = String(v ?? "");
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const day = (d) => (d ? new Date(d).toISOString().slice(0, 10) : "");
    const lines = [headers.join(",")];
    rows.forEach((l) =>
      lines.push(
        [
          l.name, l.company, l.email, l.phone, l.status,
          l.priority, l.source, l.value, day(l.createdAt), day(l.updatedAt),
        ]
          .map(esc)
          .join(",")
      )
    );
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${rows.length} ${rows.length === 1 ? "lead" : "leads"}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Opportunities & Accounts" subtitle="Track qualification, deal values, and sales velocity across all leads.">
        <Button variant="glass" size="sm" onClick={exportCSV} className="gap-1.5">
          <Download className="h-4 w-4" /> Export CSV
        </Button>
        <Button variant="primary" size="sm" onClick={openNew} className="gap-1.5">
          <Plus className="h-4 w-4" /> Add Opportunity
        </Button>
      </PageHeader>

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile icon={Users} tint="bg-indigo-500/10 text-indigo-400 border-indigo-500/20" label="Total Accounts" value={kpis.count} />
        <StatTile
          icon={TrendingUp}
          tint="bg-sky-500/10 text-sky-400 border-sky-500/20"
          label="Open Pipeline"
          value={currency(kpis.openValue, { compact: true })}
        />
        <StatTile
          icon={Trophy}
          tint="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
          label="Won Revenue"
          value={currency(kpis.wonValue, { compact: true })}
        />
        <StatTile
          icon={Coins}
          tint="bg-violet-500/10 text-violet-400 border-violet-500/20"
          label="Avg Deal Size"
          value={currency(kpis.avg, { compact: true })}
        />
      </div>

      {/* Filter & Search Bar */}
      <Card className="space-y-3 p-4 bg-slate-900/80 border-slate-800">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Search by opportunity, company, or email..."
              className="h-9.5 w-full rounded-xl border border-slate-800 bg-slate-950/80 pl-10 pr-4 text-xs text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 lg:flex">
            <Filter
              value={filters.priority}
              onChange={(v) => setFilters({ ...filters, priority: v })}
              all="All Priorities"
              options={LEAD_PRIORITIES}
            />
            <Filter
              value={filters.source}
              onChange={(v) => setFilters({ ...filters, source: v })}
              all="All Channels"
              options={LEAD_SOURCES}
            />
          </div>
        </div>

        {/* Stage quick-filter chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <StageChip
            label="All"
            count={stageCounts.All}
            active={!filters.status}
            onClick={() => setFilters({ ...filters, status: "" })}
          />
          {LEAD_STAGES.map((s) => (
            <StageChip
              key={s}
              label={s}
              count={stageCounts[s]}
              dot={STAGE_STYLES[s]?.dot}
              active={filters.status === s}
              onClick={() => setFilters({ ...filters, status: s })}
            />
          ))}

          <div className="ml-auto flex items-center gap-3">
            {filtersActive && (
              <button
                onClick={() => setFilters({ status: "", priority: "", source: "", search: "" })}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="h-3.5 w-3.5" /> Clear Filters
              </button>
            )}
            <span className="text-xs text-slate-400 font-mono">
              <span className="font-bold text-white">{sorted.length}</span> / {leads?.length ?? 0}
            </span>
            <ViewToggle view={view} onChange={setView} />
          </div>
        </div>
      </Card>

      {/* Results */}
      {leads === null ? (
        <div className="p-12 text-center text-slate-500 text-sm">Loading opportunities...</div>
      ) : sorted.length === 0 ? (
        <Card className="p-8">
          <EmptyState
            icon={Users}
            title="No matching opportunities"
            description={
              filtersActive
                ? "Try adjusting your filters or search terms."
                : "Add your first lead opportunity to get started."
            }
            action={
              <Button variant="primary" size="sm" onClick={openNew}>
                <Plus className="h-4 w-4" /> Add Opportunity
              </Button>
            }
          />
        </Card>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {sorted.map((l) => (
            <LeadGridCard
              key={l._id}
              lead={l}
              selected={selected.has(l._id)}
              onToggle={() => toggleRow(l._id)}
              onOpen={() => setDrawerLead(l)}
              onEmail={() => setEmailLead(l)}
              onEdit={openEdit}
              onDelete={setToDelete}
            />
          ))}
        </div>
      ) : (
        <Card className="overflow-hidden bg-slate-900/90 border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="border-b border-slate-800 bg-slate-950/60">
                <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400">
                  <th className="w-12 pl-4">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleAll}
                      className="h-3.5 w-3.5 rounded border-slate-700 accent-indigo-600 cursor-pointer"
                      aria-label="Select all"
                    />
                  </th>
                  <SortTh label="Opportunity" k="name" sort={sort} onSort={toggleSort} />
                  <th className="px-4 py-3 font-semibold">Stage</th>
                  <th className="px-4 py-3 font-semibold">Priority</th>
                  <th className="px-4 py-3 font-semibold">Channel</th>
                  <SortTh label="Value" k="value" sort={sort} onSort={toggleSort} align="right" />
                  <SortTh label="Updated" k="updatedAt" sort={sort} onSort={toggleSort} />
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {sorted.map((l) => {
                  const stage = STAGE_STYLES[l.status] || STAGE_STYLES.New;
                  const isSel = selected.has(l._id);
                  return (
                    <tr
                      key={l._id}
                      onClick={() => setDrawerLead(l)}
                      className={cn(
                        "group cursor-pointer transition-colors",
                        isSel ? "bg-indigo-950/30" : "hover:bg-slate-800/50"
                      )}
                    >
                      <td className="pl-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSel}
                          onChange={() => toggleRow(l._id)}
                          className="h-3.5 w-3.5 rounded border-slate-700 accent-indigo-600 cursor-pointer"
                          aria-label={`Select ${l.name}`}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={l.company || l.name} size="sm" />
                          <div>
                            <p className="font-semibold text-white">{l.name}</p>
                            <p className="text-[10px] text-slate-400">
                              {l.company || l.email || "—"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={stage.badge} dot={stage.dot}>
                          {l.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={PRIORITY_STYLES[l.priority]}>{l.priority}</Badge>
                      </td>
                      <td className="px-4 py-3 text-slate-400 font-medium">
                        {l.source}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-white font-mono">
                        {currency(l.value)}
                      </td>
                      <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">{relative(l.updatedAt)}</td>
                      <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEmailLead(l)}
                            title="Outreach email"
                            className="p-1 rounded-md text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors cursor-pointer"
                          >
                            <Mail className="h-3.5 w-3.5" />
                          </button>
                          <Dropdown
                            trigger={
                              <button className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer">
                                <MoreHorizontal className="h-3.5 w-3.5" />
                              </button>
                            }
                          >
                            <DropdownItem onClick={() => openEdit(l)}>
                              <Pencil className="h-3.5 w-3.5" /> Edit
                            </DropdownItem>
                            <DropdownItem danger onClick={() => setToDelete(l)}>
                              <Trash2 className="h-3.5 w-3.5" /> Delete
                            </DropdownItem>
                          </Dropdown>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Floating bulk action bar */}
      {selected.size > 0 && (
        <div className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900/95 px-4 py-2.5 shadow-2xl shadow-slate-950/80 backdrop-blur-xl">
          <span className="text-xs font-semibold text-white font-mono">
            {selected.size} selected
          </span>
          <button
            onClick={() => setSelected(new Set())}
            className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Clear
          </button>
          <Button size="xs" variant="danger" onClick={() => setBulkOpen(true)}>
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </Button>
        </div>
      )}

      {/* Dialogs / drawer */}
      <LeadFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        lead={editing}
        onSaved={load}
      />
      <LeadDrawer
        open={Boolean(drawerLead)}
        onClose={() => setDrawerLead(null)}
        lead={drawerLead}
        onEdit={openEdit}
        onDelete={setToDelete}
      />
      <EmailComposerDialog
        open={Boolean(emailLead)}
        onClose={() => setEmailLead(null)}
        lead={emailLead}
      />
      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete this opportunity?"
        description={`"${toDelete?.name}" will be removed from your active pipeline.`}
      />
      <ConfirmDialog
        open={bulkOpen}
        onClose={() => setBulkOpen(false)}
        onConfirm={confirmBulkDelete}
        loading={deleting}
        title={`Delete ${selected.size} opportunities?`}
        description="These leads will be permanently deleted from your CRM workspace."
      />
    </div>
  );
}

function ViewToggle({ view, onChange }) {
  const options = [
    { value: "table", icon: Table2, label: "Table view" },
    { value: "grid", icon: LayoutGrid, label: "Card view" },
  ];
  return (
    <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-950 p-1">
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          title={label}
          aria-label={label}
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-lg transition-colors cursor-pointer",
            view === value ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
          )}
        >
          <Icon className="h-3.5 w-3.5" />
        </button>
      ))}
    </div>
  );
}

function LeadGridCard({ lead, selected, onToggle, onOpen, onEmail, onEdit, onDelete }) {
  const stage = STAGE_STYLES[lead.status] || STAGE_STYLES.New;
  return (
    <div
      onClick={onOpen}
      className={cn(
        "group relative cursor-pointer rounded-2xl border bg-slate-900/80 p-4 transition-all duration-200 hover:border-slate-700 hover:shadow-xl",
        selected ? "border-indigo-500 ring-1 ring-indigo-500" : "border-slate-800"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <Avatar name={lead.company || lead.name} size="md" />
          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-white font-display">{lead.name}</p>
            <p className="flex items-center gap-1 truncate text-[10px] text-slate-400">
              <Building2 className="h-2.5 w-2.5 shrink-0" /> {lead.company || "Direct Account"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onEmail?.()}
            className="p-1 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800"
            title="Outreach"
          >
            <Mail className="h-3.5 w-3.5" />
          </button>
          <Dropdown
            trigger={
              <button className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-slate-800">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>
            }
          >
            <DropdownItem onClick={() => onEdit(lead)}>
              <Pencil className="h-3.5 w-3.5" /> Edit
            </DropdownItem>
            <DropdownItem danger onClick={() => onDelete(lead)}>
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <Badge className={stage.badge} dot={stage.dot}>
          {lead.status}
        </Badge>
        <Badge className={PRIORITY_STYLES[lead.priority]}>{lead.priority}</Badge>
        <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
          {lead.source}
        </span>
      </div>

      <div className="mt-3 flex items-end justify-between border-t border-slate-800/80 pt-3">
        <div>
          <p className="text-[10px] uppercase font-semibold text-slate-400">Valuation</p>
          <p className="font-display text-base font-bold text-white font-mono">{currency(lead.value)}</p>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">{relative(lead.updatedAt)}</span>
      </div>
    </div>
  );
}

function StatTile({ icon: Icon, label, value, tint }) {
  return (
    <Card className="p-4 bg-slate-900/60 border-slate-800">
      <div className="flex items-center gap-3">
        <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border", tint)}>
          <Icon className="h-4.5 w-4.5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs text-slate-400">{label}</p>
          <p className="font-display text-lg font-bold text-white font-mono">{value}</p>
        </div>
      </div>
    </Card>
  );
}

function StageChip({ label, count, dot, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-semibold transition-all cursor-pointer select-none",
        active
          ? "border-indigo-500/50 bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
          : "border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:border-slate-700"
      )}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", active ? "bg-white" : dot)} />}
      <span>{label}</span>
      <span
        className={cn(
          "rounded-md px-1.5 py-0.2 text-[10px] font-mono",
          active ? "bg-white/20 text-white font-bold" : "bg-slate-800 text-slate-400"
        )}
      >
        {count}
      </span>
    </button>
  );
}

function SortTh({ label, k, sort, onSort, align = "left" }) {
  const active = sort.key === k;
  return (
    <th className={cn("px-4 py-3 font-semibold", align === "right" && "text-right")}>
      <button
        onClick={() => onSort(k)}
        className={cn(
          "inline-flex items-center gap-1 transition-colors hover:text-white cursor-pointer",
          active && "text-white"
        )}
      >
        {label}
        <span className="text-slate-500">
          {active ? (
            sort.dir === "asc" ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )
          ) : (
            <ChevronDown className="h-3 w-3 opacity-30" />
          )}
        </span>
      </button>
    </th>
  );
}

function Filter({ value, onChange, all, options }) {
  return (
    <Select value={value} onChange={(e) => onChange(e.target.value)} className="lg:w-36 text-xs h-9.5">
      <option value="">{all}</option>
      {options.map((o) => (
        <option key={o} value={o} className="bg-slate-900 text-white">
          {o}
        </option>
      ))}
    </Select>
  );
}
