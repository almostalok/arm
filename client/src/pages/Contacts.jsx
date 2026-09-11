import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Mail,
  Phone,
  Building2,
  Star,
  Contact2,
  Tag,
  X,
  LayoutGrid,
  Table2,
  Users,
  Send,
} from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "../components/common/PageHeader";
import { EmptyState } from "../components/common/EmptyState";
import { ConfirmDialog } from "../components/common/ConfirmDialog";
import { EmailComposerDialog } from "../components/outreach/EmailComposerDialog";
import {
  Button,
  Card,
  Input,
  Textarea,
  Field,
  Badge,
  Avatar,
  Dialog,
  Drawer,
  Dropdown,
  DropdownItem,
  NumberTicker,
  SpotlightCard,
} from "../components/ui";
import { contactsApi } from "../lib/services";
import { relative, shortDate } from "../lib/format";
import { cn } from "../lib/utils";

function useFlip(dep) {
  const containerRef = useRef(null);
  const prevRects = useRef(new Map());

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const nodes = Array.from(el.querySelectorAll("[data-flip-id]"));

    const nextRects = new Map();
    nodes.forEach((n) => nextRects.set(n.dataset.flipId, n.getBoundingClientRect()));

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (!reduce) {
      nodes.forEach((n) => {
        const oldRect = prevRects.current.get(n.dataset.flipId);
        const newRect = nextRects.get(n.dataset.flipId);
        if (!oldRect) return;
        const dx = oldRect.left - newRect.left;
        const dy = oldRect.top - newRect.top;
        if (dx || dy) {
          n.animate(
            [
              { transform: `translate(${dx}px, ${dy}px)` },
              { transform: "translate(0px, 0px)" },
            ],
            { duration: 300, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
          );
        }
      });
    }

    prevRects.current = nextRects;
  }, [dep]);

  return containerRef;
}

export default function Contacts() {
  const [contacts, setContacts] = useState(null);
  const [filters, setFilters] = useState({ search: "", tag: "" });
  const [view, setView] = useState("grid");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selected, setSelected] = useState(null);
  const [emailContact, setEmailContact] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [favLoading, setFavLoading] = useState({});

  const load = () => {
    setContacts(null);
    contactsApi
      .list()
      .then((res) => setContacts(res.contacts))
      .catch(() => setContacts([]));
  };
  useEffect(load, []);

  const allTags = useMemo(() => {
    if (!contacts) return [];
    const set = new Set();
    contacts.forEach((c) => (c.tags || []).forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [contacts]);

  const tagCounts = useMemo(() => {
    const c = { All: contacts?.length || 0 };
    allTags.forEach((t) => {
      c[t] = (contacts || []).filter((contact) =>
        (contact.tags || []).includes(t)
      ).length;
    });
    return c;
  }, [contacts, allTags]);

  const kpis = useMemo(() => {
    const list = contacts || [];
    const favorites = list.filter((c) => c.favorite).length;
    const uniqueCompanies = new Set(list.map((c) => c.company).filter(Boolean)).size;
    const tagged = list.filter((c) => (c.tags || []).length > 0).length;
    return { total: list.length, favorites, companies: uniqueCompanies, tagged };
  }, [contacts]);

  const filtered = useMemo(() => {
    if (!contacts) return [];
    return contacts.filter((c) => {
      if (filters.tag && !(c.tags || []).includes(filters.tag)) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        return (
          c.name?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q) ||
          c.company?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [contacts, filters]);

  const ordered = useMemo(
    () => [...filtered].sort((a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0)),
    [filtered]
  );

  const filtersActive = filters.search || filters.tag;

  const gridRef = useFlip(ordered);
  const tableRef = useFlip(ordered);

  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (contact) => {
    setSelected(null);
    setEditing(contact);
    setFormOpen(true);
  };

  const handleSaved = () => load();

  const toggleFavorite = async (e, contact) => {
    e.stopPropagation();
    if (favLoading[contact._id]) return;
    const next = !contact.favorite;
    setFavLoading((prev) => ({ ...prev, [contact._id]: true }));
    setContacts((prev) =>
      (prev || []).map((c) => (c._id === contact._id ? { ...c, favorite: next } : c))
    );
    try {
      await contactsApi.update(contact._id, { favorite: next });
    } catch (err) {
      setContacts((prev) =>
        (prev || []).map((c) =>
          c._id === contact._id ? { ...c, favorite: !next } : c
        )
      );
      toast.error(err?.message || "Could not update favorite");
    } finally {
      setFavLoading((prev) => ({ ...prev, [contact._id]: false }));
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await contactsApi.remove(toDelete._id);
      toast.success("Contact removed");
      setToDelete(null);
      setSelected(null);
      load();
    } catch (err) {
      toast.error(err?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Key Stakeholders & Contacts"
        subtitle="Manage champions, decision makers, and executive relationships."
      >
        <Button variant="primary" size="sm" onClick={openNew} className="gap-1.5">
          <Plus className="h-4 w-4" /> Add Stakeholder
        </Button>
      </PageHeader>

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile
          icon={Users}
          tint="bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
          label="Total Contacts"
          value={kpis.total}
        />
        <StatTile
          icon={Star}
          tint="bg-amber-500/10 text-amber-400 border-amber-500/20"
          label="Priority Champions"
          value={kpis.favorites}
        />
        <StatTile
          icon={Building2}
          tint="bg-sky-500/10 text-sky-400 border-sky-500/20"
          label="Active Accounts"
          value={kpis.companies}
        />
        <StatTile
          icon={Tag}
          tint="bg-violet-500/10 text-violet-400 border-violet-500/20"
          label="Segmented Profiles"
          value={kpis.tagged}
        />
      </div>

      {/* Toolbar Card */}
      <Card className="space-y-3 p-4 bg-slate-900/80 border-slate-800">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Search by contact name, email, role, or company..."
            className="h-9.5 w-full rounded-xl border border-slate-800 bg-slate-950/80 pl-10 pr-4 text-xs text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Tag chips + meta row */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <TagChip
            label="All"
            count={tagCounts.All}
            active={!filters.tag}
            onClick={() => setFilters({ ...filters, tag: "" })}
          />
          {allTags.map((t) => (
            <TagChip
              key={t}
              label={t}
              count={tagCounts[t] || 0}
              active={filters.tag === t}
              onClick={() =>
                setFilters({ ...filters, tag: filters.tag === t ? "" : t })
              }
            />
          ))}

          <div className="ml-auto flex items-center gap-3">
            {filtersActive && (
              <button
                onClick={() => setFilters({ search: "", tag: "" })}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="h-3.5 w-3.5" /> Clear
              </button>
            )}
            <span className="text-xs text-slate-400 font-mono">
              <span className="font-bold text-white">{filtered.length}</span> /{" "}
              {contacts?.length ?? 0}
            </span>
            <ViewToggle view={view} onChange={setView} />
          </div>
        </div>
      </Card>

      {/* Results */}
      {contacts === null ? (
        <div className="p-12 text-center text-slate-500 text-sm">Loading contacts...</div>
      ) : filtered.length === 0 ? (
        <Card className="p-8">
          <EmptyState
            icon={Contact2}
            title={filtersActive ? "No matching stakeholders" : "No contacts yet"}
            description={
              filtersActive
                ? "Try different search terms or clear the tag filter."
                : "Add your first contact to start building your relationship network."
            }
            action={
              !filtersActive ? (
                <Button variant="primary" size="sm" onClick={openNew}>
                  <Plus className="h-4 w-4" /> Add Stakeholder
                </Button>
              ) : null
            }
          />
        </Card>
      ) : view === "grid" ? (
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {ordered.map((contact) => (
            <ContactCard
              key={contact._id}
              contact={contact}
              flipId={contact._id}
              favLoading={!!favLoading[contact._id]}
              onToggleFavorite={toggleFavorite}
              onOpen={() => setSelected(contact)}
              onEmail={() => setEmailContact(contact)}
              onEdit={() => openEdit(contact)}
              onDelete={() => setToDelete(contact)}
            />
          ))}
        </div>
      ) : (
        <Card className="overflow-hidden bg-slate-900/90 border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="border-b border-slate-800 bg-slate-950/60">
                <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400">
                  <th className="px-4 py-3 font-semibold">Stakeholder</th>
                  <th className="px-4 py-3 font-semibold">Title / Role</th>
                  <th className="px-4 py-3 font-semibold">Tags</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Phone</th>
                  <th className="px-4 py-3 w-24 text-right" />
                </tr>
              </thead>
              <tbody ref={tableRef} className="divide-y divide-slate-800/60">
                {ordered.map((contact) => (
                  <ContactTableRow
                    key={contact._id}
                    contact={contact}
                    flipId={contact._id}
                    favLoading={!!favLoading[contact._id]}
                    onToggleFavorite={toggleFavorite}
                    onOpen={() => setSelected(contact)}
                    onEmail={() => setEmailContact(contact)}
                    onEdit={() => openEdit(contact)}
                    onDelete={() => setToDelete(contact)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Detail Drawer */}
      <ContactDrawer
        open={Boolean(selected)}
        contact={selected}
        onClose={() => setSelected(null)}
        onEmail={() => setEmailContact(selected)}
        onEdit={() => openEdit(selected)}
        onDelete={() => setToDelete(selected)}
      />

      {/* Email Composer Modal */}
      <EmailComposerDialog
        open={Boolean(emailContact)}
        onClose={() => setEmailContact(null)}
        contact={emailContact}
      />

      {/* Add / Edit Dialog */}
      <ContactFormDialog
        open={formOpen}
        contact={editing}
        onClose={() => setFormOpen(false)}
        onSaved={handleSaved}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Remove this stakeholder?"
        description={`"${toDelete?.name}" will be permanently removed.`}
        confirmLabel="Remove contact"
      />
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

function TagChip({ label, count, active, onClick }) {
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

function ViewToggle({ view, onChange }) {
  const options = [
    { value: "grid", icon: LayoutGrid, label: "Card view" },
    { value: "table", icon: Table2, label: "Table view" },
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

function ContactCard({
  contact,
  flipId,
  favLoading,
  onToggleFavorite,
  onOpen,
  onEmail,
  onEdit,
  onDelete,
}) {
  return (
    <div
      data-flip-id={flipId}
      onClick={onOpen}
      className="relative cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/80 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-700 hover:shadow-xl group"
    >
      <button
        onClick={(e) => onToggleFavorite(e, contact)}
        disabled={favLoading}
        aria-label={contact.favorite ? "Unmark favorite" : "Mark as favorite"}
        className="absolute right-3.5 top-3.5 rounded-lg p-1 text-slate-500 transition hover:text-amber-400 cursor-pointer"
      >
        <Star
          className={cn(
            "h-4 w-4 transition-colors",
            contact.favorite ? "fill-amber-400 text-amber-400" : ""
          )}
        />
      </button>

      <div
        className="absolute right-3 top-9"
        onClick={(e) => e.stopPropagation()}
      >
        <Dropdown
          trigger={
            <button className="rounded-lg p-1 text-slate-500 transition hover:bg-slate-800 hover:text-white cursor-pointer">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          }
        >
          <DropdownItem onClick={onEmail}>
            <Mail className="h-3.5 w-3.5" /> Send Outreach
          </DropdownItem>
          <DropdownItem onClick={onEdit}>
            <Pencil className="h-3.5 w-3.5" /> Edit
          </DropdownItem>
          <DropdownItem danger onClick={onDelete}>
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </DropdownItem>
        </Dropdown>
      </div>

      <div className="flex items-start gap-3 pr-8">
        <Avatar name={contact.name} size="md" />
        <div className="min-w-0">
          <p className="font-semibold text-white leading-tight truncate text-xs">
            {contact.name}
          </p>
          {(contact.title || contact.company) && (
            <p className="mt-0.5 text-[11px] text-slate-400 truncate">
              {[contact.title, contact.company].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
      </div>

      {contact.tags?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {contact.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 space-y-1.5 pt-2 border-t border-slate-800/60">
        {contact.email && (
          <div className="flex items-center gap-2 text-xs text-slate-300 min-w-0">
            <Mail className="h-3 w-3 text-slate-500 shrink-0" />
            <span className="truncate">{contact.email}</span>
          </div>
        )}
        {contact.phone && (
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Phone className="h-3 w-3 text-slate-500 shrink-0" />
            <span>{contact.phone}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function ContactTableRow({
  contact,
  flipId,
  favLoading,
  onToggleFavorite,
  onOpen,
  onEmail,
  onEdit,
  onDelete,
}) {
  return (
    <tr
      data-flip-id={flipId}
      onClick={onOpen}
      className="group cursor-pointer transition-colors hover:bg-slate-800/50"
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <Avatar name={contact.name} size="sm" />
          <div>
            <p className="font-semibold text-white">{contact.name}</p>
            <p className="text-[10px] text-slate-400">
              {contact.company || contact.email || "—"}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-3 text-slate-300">
        {contact.title || "—"}
      </td>

      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {(contact.tags || []).slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
            >
              {tag}
            </span>
          ))}
        </div>
      </td>

      <td className="px-4 py-3 text-slate-300">
        {contact.email ? (
          <a
            href={`mailto:${contact.email}`}
            onClick={(e) => e.stopPropagation()}
            className="hover:text-indigo-400 transition-colors"
          >
            {contact.email}
          </a>
        ) : (
          "—"
        )}
      </td>

      <td className="px-4 py-3 text-slate-400 font-mono">
        {contact.phone || "—"}
      </td>

      <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => onEmail(contact)}
            title="Outreach email"
            className="p-1 rounded-md text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Mail className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => onToggleFavorite(e, contact)}
            disabled={favLoading}
            aria-label={contact.favorite ? "Unmark favorite" : "Mark as favorite"}
            className="p-1 rounded-md text-slate-500 hover:text-amber-400 cursor-pointer"
          >
            <Star
              className={cn(
                "h-3.5 w-3.5 transition-colors",
                contact.favorite ? "fill-amber-400 text-amber-400" : ""
              )}
            />
          </button>
          <Dropdown
            trigger={
              <button className="p-1 rounded-md text-slate-500 hover:bg-slate-800 hover:text-white cursor-pointer">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>
            }
          >
            <DropdownItem onClick={onEdit}>
              <Pencil className="h-3.5 w-3.5" /> Edit
            </DropdownItem>
            <DropdownItem danger onClick={onDelete}>
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </DropdownItem>
          </Dropdown>
        </div>
      </td>
    </tr>
  );
}

function ContactDrawer({ open, contact, onClose, onEmail, onEdit, onDelete }) {
  if (!contact) return null;

  return (
    <Drawer open={open} onClose={onClose} title="Stakeholder Profile">
      <div className="space-y-5">
        <div className="flex items-center gap-4">
          <Avatar name={contact.name} size="lg" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white font-display">{contact.name}</h2>
              {contact.favorite && (
                <Star className="h-4 w-4 fill-amber-400 text-amber-400 shrink-0" />
              )}
            </div>
            {(contact.title || contact.company) && (
              <p className="text-xs text-slate-400 mt-0.5">
                {[contact.title, contact.company].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 divide-y divide-slate-800/80 bg-slate-950/60 p-1">
          {contact.email && (
            <DrawerRow icon={<Mail className="h-4 w-4" />} label="Email">
              <a
                href={`mailto:${contact.email}`}
                className="text-indigo-400 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {contact.email}
              </a>
            </DrawerRow>
          )}
          {contact.phone && (
            <DrawerRow icon={<Phone className="h-4 w-4" />} label="Phone">
              <span className="text-slate-200 font-mono">{contact.phone}</span>
            </DrawerRow>
          )}
          {contact.company && (
            <DrawerRow icon={<Building2 className="h-4 w-4" />} label="Company">
              <span className="text-white font-medium">{contact.company}</span>
            </DrawerRow>
          )}
        </div>

        {contact.tags?.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Relationship Tags
            </p>
            <div className="flex flex-wrap gap-1.5">
              {contact.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-mono px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {contact.notes && (
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Background & Notes
            </p>
            <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line rounded-xl bg-slate-900 border border-slate-800 p-3.5">
              {contact.notes}
            </p>
          </div>
        )}

        <div className="flex gap-2 pt-3 border-t border-slate-800">
          <Button variant="primary" className="flex-1 gap-1.5" onClick={onEmail}>
            <Send className="h-4 w-4" /> Send Outreach
          </Button>
          <Button variant="secondary" size="sm" onClick={onEdit}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="danger" size="sm" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Drawer>
  );
}

function DrawerRow({ icon, label, children }) {
  return (
    <div className="flex items-center gap-3 px-3.5 py-2.5">
      <span className="text-slate-400 shrink-0">{icon}</span>
      <span className="text-xs text-slate-400 w-16 shrink-0 font-medium">{label}</span>
      <span className="text-xs min-w-0 font-medium">{children}</span>
    </div>
  );
}

function ContactFormDialog({ open, contact, onClose, onSaved }) {
  const isEdit = Boolean(contact);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (open) {
      reset(
        contact
          ? {
              name: contact.name || "",
              title: contact.title || "",
              company: contact.company || "",
              email: contact.email || "",
              phone: contact.phone || "",
              tags: (contact.tags || []).join(", "),
              notes: contact.notes || "",
              favorite: contact.favorite || false,
            }
          : {
              name: "",
              title: "",
              company: "",
              email: "",
              phone: "",
              tags: "",
              notes: "",
              favorite: false,
            }
      );
    }
  }, [open, contact, reset]);

  const onSubmit = async (values) => {
    const tags = values.tags
      ? values.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    const payload = { ...values, tags };

    try {
      if (isEdit) {
        await contactsApi.update(contact._id, payload);
        toast.success("Contact updated");
      } else {
        await contactsApi.create(payload);
        toast.success("Contact created");
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Stakeholder" : "Add Stakeholder"}
      description={
        isEdit
          ? "Update stakeholder contact details."
          : "Add key account contacts and champions."
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
        <Field label="Full name" error={errors.name?.message}>
          <Input
            {...register("name", { required: "Name is required" })}
            placeholder="Jane Doe"
            autoFocus
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Title / Role">
            <Input {...register("title")} placeholder="VP of Engineering" />
          </Field>
          <Field label="Company">
            <Input {...register("company")} placeholder="Acme Global Inc" />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Email">
            <Input
              {...register("email")}
              type="email"
              placeholder="jane@acme.com"
            />
          </Field>
          <Field label="Phone">
            <Input
              {...register("phone")}
              type="tel"
              placeholder="+1 555 019 2834"
            />
          </Field>
        </div>

        <Field label="Relationship Tags (comma-separated)">
          <Input
            {...register("tags")}
            placeholder="e.g. champion, decision-maker, executive"
          />
        </Field>

        <Field label="Notes & Context">
          <Textarea
            {...register("notes")}
            placeholder="Key talking points, preferred contact times..."
            rows={3}
          />
        </Field>

        <div className="flex gap-2.5 pt-3 border-t border-slate-800">
          <Button
            type="button"
            variant="ghost"
            className="flex-1"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="flex-1" loading={isSubmitting}>
            {isEdit ? "Save Changes" : "Create Stakeholder"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
