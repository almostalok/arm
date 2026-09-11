import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Pin,
  PinOff,
  StickyNote,
  Link2,
  X,
  FileText,
  Building2,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../components/common/PageHeader";
import { EmptyState } from "../components/common/EmptyState";
import { ConfirmDialog } from "../components/common/ConfirmDialog";
import {
  Button,
  Card,
  Textarea,
  Select,
  Field,
  Dialog,
  Dropdown,
  DropdownItem,
} from "../components/ui";
import { notesApi, leadsApi } from "../lib/services";
import { relative } from "../lib/format";
import { cn } from "../lib/utils";

function StatTile({ icon: Icon, label, value, tint }) {
  return (
    <Card className="p-3.5 bg-zinc-900/70 border-zinc-800">
      <div className="flex items-center gap-2.5">
        <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border", tint)}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs text-zinc-400">{label}</p>
          <p className="text-base font-semibold text-zinc-100 font-mono">{value}</p>
        </div>
      </div>
    </Card>
  );
}

function FilterChip({ label, count, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer select-none",
        active
          ? "border-zinc-700 bg-zinc-800 text-zinc-100 shadow-sm"
          : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
      )}
    >
      <span>{label}</span>
      <span
        className={cn(
          "rounded px-1.5 py-0.2 text-[10px] font-mono",
          active ? "bg-zinc-700 text-zinc-200 font-semibold" : "bg-zinc-800 text-zinc-400"
        )}
      >
        {count}
      </span>
    </button>
  );
}

function NoteCard({ note, onEdit, onDelete, onTogglePin }) {
  const entity = note.lead ?? note.contact ?? null;

  return (
    <div
      className={cn(
        "break-inside-avoid relative flex flex-col gap-2.5 overflow-hidden rounded-lg bg-zinc-900 p-3.5 mb-3.5",
        "border border-zinc-800 transition-colors duration-150 hover:border-zinc-700",
        note.pinned && "border-blue-500/40 ring-1 ring-blue-500/20 bg-zinc-900"
      )}
    >
      {note.pinned && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-blue-600" />
      )}

      {note.pinned && (
        <span className="absolute right-3 top-3 flex h-4.5 w-4.5 items-center justify-center rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <Pin className="h-2.5 w-2.5" aria-label="Pinned" />
        </span>
      )}

      <p className="whitespace-pre-wrap text-xs leading-relaxed text-zinc-200 pr-5 font-normal">
        {note.content}
      </p>

      <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-800">
        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
          {entity && (
            <span className="inline-flex items-center gap-1 bg-zinc-800 text-zinc-300 border border-zinc-700 text-[10px] font-mono px-1.5 py-0.5 rounded max-w-[160px] truncate">
              <Building2 className="h-2.5 w-2.5 shrink-0" />
              <span className="truncate">{entity.name}</span>
            </span>
          )}
          <span className="text-[10px] text-zinc-500 font-mono">{relative(note.createdAt)}</span>
        </div>

        <div onClick={(e) => e.stopPropagation()} className="shrink-0">
          <Dropdown
            trigger={
              <button
                className="rounded p-1 text-zinc-500 transition hover:bg-zinc-800 hover:text-zinc-100 cursor-pointer"
                aria-label="Note options"
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>
            }
          >
            <DropdownItem onClick={() => onTogglePin(note)}>
              {note.pinned ? (
                <>
                  <PinOff className="h-3.5 w-3.5" /> Unpin Note
                </>
              ) : (
                <>
                  <Pin className="h-3.5 w-3.5" /> Pin to Top
                </>
              )}
            </DropdownItem>
            <DropdownItem onClick={() => onEdit(note)}>
              <Pencil className="h-3.5 w-3.5" /> Edit Note
            </DropdownItem>
            <DropdownItem danger onClick={() => onDelete(note)}>
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </DropdownItem>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}

function NoteFormDialog({ open, onClose, note, leads, onSaved }) {
  const isEditing = Boolean(note);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (open) {
      reset({
        content: note?.content ?? "",
        lead: note?.lead?._id ?? "",
        pinned: note?.pinned ?? false,
      });
    }
  }, [open, note, reset]);

  const onSubmit = async (values) => {
    const payload = {
      content: values.content,
      pinned: values.pinned,
      lead: values.lead || undefined,
    };

    try {
      if (isEditing) {
        await notesApi.update(note._id, payload);
        toast.success("Note updated");
      } else {
        await notesApi.create(payload);
        toast.success("Note logged");
      }
      onSaved();
    } catch (err) {
      toast.error(err.message ?? "Could not save note");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={isEditing ? "Edit Note" : "Capture Note / Log"}
      description={
        isEditing ? "Update your meeting context or note." : "Record call logs, meeting recaps, or key deal requirements."
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5 mt-1">
        <Field label="Note Content" error={errors.content?.message}>
          <Textarea
            rows={5}
            placeholder="Record meeting recap, technical notes, or action items..."
            {...register("content", { required: "Note content is required." })}
          />
        </Field>

        <Field label="Link to Deal / Opportunity">
          <Select {...register("lead")}>
            <option value="" className="bg-zinc-900 text-zinc-100">No linked opportunity</option>
            {leads.map((l) => (
              <option key={l._id} value={l._id} className="bg-zinc-900 text-zinc-100">
                {l.name}{l.company ? ` — ${l.company}` : ""}
              </option>
            ))}
          </Select>
        </Field>

        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 transition hover:bg-zinc-900 select-none">
          <input type="checkbox" className="h-3.5 w-3.5 rounded border-zinc-700 accent-blue-600 cursor-pointer" {...register("pinned")} />
          <div>
            <p className="text-xs font-medium text-zinc-200">Pin this note</p>
            <p className="text-[10px] text-zinc-400">Pinned notes remain highlighted at the top of your workspace.</p>
          </div>
        </label>

        <div className="flex gap-2 pt-2 border-t border-zinc-800">
          <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="flex-1" loading={isSubmitting}>
            {isEditing ? "Save Changes" : "Save Note"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

export default function Notes() {
  const [notes, setNotes] = useState(null);
  const [leads, setLeads] = useState([]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setNotes(null);
    notesApi.list().then((res) => setNotes(res.notes)).catch(() => setNotes([]));
  };

  useEffect(() => {
    load();
    leadsApi.list().then((res) => setLeads(res.leads ?? [])).catch(() => {});
  }, []);

  const kpis = useMemo(() => {
    const list = notes || [];
    return {
      total: list.length,
      pinned: list.filter((n) => n.pinned).length,
      linked: list.filter((n) => n.lead || n.contact).length,
      unlinked: list.filter((n) => !n.lead && !n.contact).length,
    };
  }, [notes]);

  const chipCounts = useMemo(() => ({
    all: kpis.total,
    pinned: kpis.pinned,
    linked: kpis.linked,
    unlinked: kpis.unlinked,
  }), [kpis]);

  const filtered = useMemo(() => {
    if (!notes) return [];
    let list = notes;

    if (filter === "pinned") list = list.filter((n) => n.pinned);
    else if (filter === "linked") list = list.filter((n) => n.lead || n.contact);
    else if (filter === "unlinked") list = list.filter((n) => !n.lead && !n.contact);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((n) => n.content?.toLowerCase().includes(q));
    }

    return list;
  }, [notes, filter, search]);

  const isActive = search.trim() || filter !== "all";

  const openNew = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (note) => { setEditing(note); setFormOpen(true); };
  const handleSaved = () => { setFormOpen(false); load(); };

  const handleTogglePin = async (note) => {
    try {
      await notesApi.update(note._id, { pinned: !note.pinned });
      toast.success(note.pinned ? "Note unpinned" : "Note pinned to top");
      load();
    } catch (err) {
      toast.error(err.message ?? "Could not update note");
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await notesApi.remove(toDelete._id);
      toast.success("Note removed");
      setToDelete(null);
      load();
    } catch (err) {
      toast.error(err.message ?? "Could not delete note");
    } finally {
      setDeleting(false);
    }
  };

  const clearAll = () => { setSearch(""); setFilter("all"); };

  return (
    <div className="space-y-5">
      <PageHeader title="Opportunity Notes & Meeting Logs" subtitle="Capture crucial requirements, decision timelines, and client feedback.">
        <Button variant="primary" size="sm" onClick={openNew} className="gap-1.5">
          <Plus className="h-3.5 w-3.5" /> Add Note
        </Button>
      </PageHeader>

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        <StatTile
          icon={StickyNote}
          tint="bg-zinc-800 text-zinc-300 border-zinc-700/60"
          label="Total Notes"
          value={kpis.total}
        />
        <StatTile
          icon={Pin}
          tint="bg-amber-500/10 text-amber-400 border-amber-500/20"
          label="Pinned Notes"
          value={kpis.pinned}
        />
        <StatTile
          icon={Link2}
          tint="bg-blue-500/10 text-blue-400 border-blue-500/20"
          label="Linked Deals"
          value={kpis.linked}
        />
        <StatTile
          icon={FileText}
          tint="bg-zinc-800 text-zinc-400 border-zinc-700/60"
          label="General Logs"
          value={kpis.unlinked}
        />
      </div>

      {/* Toolbar */}
      <Card className="space-y-3 p-3.5 bg-zinc-900 border-zinc-800">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search note contents..."
            className="h-9 w-full rounded-lg border border-zinc-750 bg-zinc-950 pl-9 pr-3 text-xs text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <FilterChip
            label="All"
            count={chipCounts.all}
            active={filter === "all"}
            onClick={() => setFilter("all")}
          />
          <FilterChip
            label="Pinned"
            count={chipCounts.pinned}
            active={filter === "pinned"}
            onClick={() => setFilter("pinned")}
          />
          <FilterChip
            label="Linked"
            count={chipCounts.linked}
            active={filter === "linked"}
            onClick={() => setFilter("linked")}
          />
          <FilterChip
            label="General"
            count={chipCounts.unlinked}
            active={filter === "unlinked"}
            onClick={() => setFilter("unlinked")}
          />

          <div className="ml-auto flex items-center gap-3">
            {isActive && (
              <button
                onClick={clearAll}
                className="inline-flex items-center gap-1 text-xs font-medium text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                <X className="h-3 w-3" /> Clear
              </button>
            )}
            <span className="text-xs text-zinc-400 font-mono">
              <span className="font-semibold text-zinc-100">{filtered.length}</span> /{" "}
              {notes?.length ?? 0}
            </span>
          </div>
        </div>
      </Card>

      {/* Masonry grid */}
      {notes === null ? (
        <div className="flex justify-center py-16 text-zinc-500 text-xs font-mono">
          Loading notes...
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-8">
          <EmptyState
            icon={StickyNote}
            title={isActive ? "No notes match" : "No notes logged yet"}
            description={
              isActive
                ? "Try adjusting your search or filters."
                : "Start capturing requirements, meeting notes, and context for your pipeline."
            }
            action={
              !isActive ? (
                <Button variant="primary" size="sm" onClick={openNew}>
                  <Plus className="h-3.5 w-3.5" /> Add Note
                </Button>
              ) : undefined
            }
          />
        </Card>
      ) : (
        <div className="columns-1 sm:columns-2 xl:columns-3 gap-3.5">
          {filtered.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onEdit={openEdit}
              onDelete={setToDelete}
              onTogglePin={handleTogglePin}
            />
          ))}
        </div>
      )}

      <NoteFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        note={editing}
        leads={leads}
        onSaved={handleSaved}
      />

      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete this note?"
        description="This note will be permanently removed from your workspace."
        confirmLabel="Delete note"
      />
    </div>
  );
}
