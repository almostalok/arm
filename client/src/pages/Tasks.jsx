import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { isPast, isToday } from "date-fns";
import {
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  CalendarCheck,
  CheckCircle2,
  Circle,
  CircleDot,
  Clock,
  AlertTriangle,
  Building2,
} from "lucide-react";

import { PageHeader } from "../components/common/PageHeader";
import { EmptyState } from "../components/common/EmptyState";
import { ConfirmDialog } from "../components/common/ConfirmDialog";
import { StatCard } from "../components/common/StatCard";

import {
  Button,
  Card,
  Input,
  Textarea,
  Select,
  Field,
  Badge,
  Dialog,
  Dropdown,
  DropdownItem,
  Tabs,
} from "../components/ui";

import { tasksApi, leadsApi } from "../lib/services";
import { shortDate, dateInputValue } from "../lib/format";
import {
  TASK_STATUSES,
  TASK_PRIORITIES,
  TASK_STATUS_STYLES,
  PRIORITY_STYLES,
} from "../lib/constants";
import { cn } from "../lib/utils";

const PRIORITY_BAR = {
  High: "bg-rose-500",
  Medium: "bg-amber-500",
  Low: "bg-zinc-600",
};

const GROUPS = [
  { key: "overdue",   label: "Overdue Actions", labelClass: "text-rose-400",   countClass: "bg-rose-500/10 text-rose-400 border border-rose-500/20" },
  { key: "today",     label: "Due Today",       labelClass: "text-amber-400",  countClass: "bg-amber-500/10 text-amber-400 border border-amber-500/20" },
  { key: "upcoming",  label: "Upcoming",        labelClass: "text-zinc-200",   countClass: "bg-zinc-800 text-zinc-300 border border-zinc-700" },
  { key: "nodate",    label: "No Due Date",     labelClass: "text-zinc-400",   countClass: "bg-zinc-800 text-zinc-400 border border-zinc-700" },
  { key: "completed", label: "Completed",       labelClass: "text-emerald-400",countClass: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" },
];

const STATUS_TABS = [
  { value: "all",         label: "All Actions" },
  { value: "Pending",     label: "Pending" },
  { value: "In Progress", label: "In Progress" },
  { value: "Completed",   label: "Completed" },
];

function isOverdue(task) {
  if (!task.dueDate || task.status === "Completed") return false;
  const d = new Date(task.dueDate);
  return isPast(d) && !isToday(d);
}

function groupKey(task) {
  if (task.status === "Completed") return "completed";
  if (!task.dueDate) return "nodate";
  const d = new Date(task.dueDate);
  if (isToday(d)) return "today";
  if (isPast(d)) return "overdue";
  return "upcoming";
}

function TaskFormDialog({ open, onClose, task, leads, onSaved }) {
  const isEdit = Boolean(task);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (open) {
      reset(
        task
          ? {
              title:       task.title ?? "",
              description: task.description ?? "",
              dueDate:     dateInputValue(task.dueDate),
              status:      task.status ?? "Pending",
              priority:    task.priority ?? "Medium",
              relatedLead: task.relatedLead?._id ?? "",
            }
          : {
              title: "", description: "", dueDate: "",
              status: "Pending", priority: "Medium", relatedLead: "",
            }
      );
    }
  }, [open, task, reset]);

  const onSubmit = async (values) => {
    const payload = {
      title:       values.title.trim(),
      description: values.description?.trim() || undefined,
      dueDate:     values.dueDate || undefined,
      status:      values.status,
      priority:    values.priority,
      relatedLead: values.relatedLead || null,
    };
    try {
      if (isEdit) {
        await tasksApi.update(task._id, payload);
        toast.success("Task updated");
      } else {
        await tasksApi.create(payload);
        toast.success("Task created");
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err?.message ?? "Something went wrong");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Task" : "Create Task / Follow-up"}
      description={isEdit ? "Update action item details." : "Schedule a follow-up or operational task."}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5 pt-1">
        <Field label="Task Title" error={errors.title?.message}>
          <Input
            placeholder="e.g. Host security review call with VP Engineering"
            {...register("title", { required: "Title is required" })}
          />
        </Field>

        <Field label="Task Context & Notes">
          <Textarea rows={3} placeholder="Key objectives, agenda..." {...register("description")} />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Due Date">
            <Input type="date" {...register("dueDate")} />
          </Field>
          <Field label="Priority">
            <Select {...register("priority")}>
              {TASK_PRIORITIES.map((p) => (
                <option key={p} value={p} className="bg-zinc-900 text-zinc-100">
                  {p}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <Field label="Status">
          <Select {...register("status")}>
            {TASK_STATUSES.map((s) => (
              <option key={s} value={s} className="bg-zinc-900 text-zinc-100">
                {s}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Linked Deal / Opportunity">
          <Select {...register("relatedLead")}>
            <option value="" className="bg-zinc-900 text-zinc-100">No linked opportunity</option>
            {leads.map((l) => (
              <option key={l._id} value={l._id} className="bg-zinc-900 text-zinc-100">
                {l.name}{l.company ? ` — ${l.company}` : ""}
              </option>
            ))}
          </Select>
        </Field>

        <div className="flex gap-2 pt-3 border-t border-zinc-800">
          <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="flex-1" loading={isSubmitting}>
            {isEdit ? "Save Changes" : "Create Task"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

function TaskRow({ task, onToggle, onEdit, onDelete }) {
  const done    = task.status === "Completed";
  const inProg  = task.status === "In Progress";
  const overdue = isOverdue(task);
  const dueToday = task.dueDate ? isToday(new Date(task.dueDate)) : false;

  return (
    <div className="group relative flex items-start gap-3 px-4 py-3 transition-colors hover:bg-zinc-800/40">
      <span
        aria-hidden
        className={cn(
          "absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-full",
          PRIORITY_BAR[task.priority] ?? "bg-zinc-700"
        )}
      />

      <button
        onClick={() => onToggle(task)}
        aria-label={done ? "Mark as pending" : "Mark as completed"}
        className={cn(
          "mt-0.5 shrink-0 rounded-full p-0.5 transition-colors cursor-pointer",
          done
            ? "text-emerald-400 hover:text-emerald-300"
            : inProg
            ? "text-blue-400 hover:text-blue-300"
            : "text-zinc-500 hover:text-zinc-300"
        )}
      >
        {done ? (
          <CheckCircle2 className="h-4.5 w-4.5" />
        ) : inProg ? (
          <CircleDot className="h-4.5 w-4.5" />
        ) : (
          <Circle className="h-4.5 w-4.5" />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-xs font-medium leading-snug",
            done ? "line-through text-zinc-500" : "text-zinc-100"
          )}
        >
          {task.title}
        </p>

        {task.description && (
          <p className="mt-0.5 truncate text-[11px] text-zinc-400">{task.description}</p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {task.dueDate && (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-mono border",
                overdue
                  ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                  : dueToday
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  : "bg-zinc-950 text-zinc-400 border-zinc-800"
              )}
            >
              {overdue ? (
                <AlertTriangle className="h-3 w-3" />
              ) : (
                <Clock className="h-3 w-3" />
              )}
              {overdue ? `Overdue · ${shortDate(task.dueDate)}` : dueToday ? `Today · ${shortDate(task.dueDate)}` : shortDate(task.dueDate)}
            </span>
          )}

          <Badge className={cn("text-[10px] py-0 px-1.5", PRIORITY_STYLES[task.priority])}>
            {task.priority}
          </Badge>

          <Badge className={cn("text-[10px] py-0 px-1.5", TASK_STATUS_STYLES[task.status])}>
            {task.status}
          </Badge>

          {task.relatedLead && (
            <span className="inline-flex items-center gap-1 rounded-md bg-zinc-800 px-2 py-0.5 text-[10px] font-mono text-zinc-300 border border-zinc-700">
              <Building2 className="h-3 w-3" />
              {task.relatedLead.name}
            </span>
          )}
        </div>
      </div>

      <div className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100">
        <Dropdown
          trigger={
            <button className="rounded p-1 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 cursor-pointer">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          }
        >
          <DropdownItem onClick={() => onEdit(task)}>
            <Pencil className="h-3.5 w-3.5" /> Edit
          </DropdownItem>
          <DropdownItem danger onClick={() => onDelete(task)}>
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </DropdownItem>
        </Dropdown>
      </div>
    </div>
  );
}

function GroupHeader({ label, count, labelClass, countClass }) {
  return (
    <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-950 px-4 py-1.5">
      <span className={cn("text-[10px] font-semibold uppercase tracking-wider font-mono", labelClass)}>
        {label}
      </span>
      <span className={cn("rounded px-1.5 py-0.2 text-[10px] font-mono", countClass)}>
        {count}
      </span>
    </div>
  );
}

function ProgressCard({ completed, total }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  return (
    <Card className="px-4 py-3 bg-zinc-900 border-zinc-800">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-zinc-300">
          Action Velocity: {completed} of {total} items resolved
        </span>
        <span className="text-xs font-semibold font-mono text-emerald-400">{pct}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </Card>
  );
}

export default function Tasks() {
  const [tasks, setTasks] = useState(null);
  const [leads, setLeads] = useState([]);

  const [tab, setTab] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setTasks(null);
    tasksApi.list().then((res) => setTasks(res.tasks)).catch(() => setTasks([]));
  };

  useEffect(() => {
    load();
    leadsApi.list().then((res) => setLeads(res.leads)).catch(() => {});
  }, []);

  const stats = useMemo(() => {
    if (!tasks) return { total: 0, pending: 0, overdue: 0, completed: 0 };
    return {
      total:     tasks.length,
      pending:   tasks.filter((t) => t.status === "Pending").length,
      overdue:   tasks.filter(isOverdue).length,
      completed: tasks.filter((t) => t.status === "Completed").length,
    };
  }, [tasks]);

  const filtered = useMemo(() => {
    if (!tasks) return [];
    if (tab === "all") return tasks;
    return tasks.filter((t) => t.status === tab);
  }, [tasks, tab]);

  const groupedSections = useMemo(() => {
    const map = {};
    GROUPS.forEach((g) => (map[g.key] = []));
    filtered.forEach((t) => {
      const key = groupKey(t);
      map[key].push(t);
    });
    return GROUPS.filter((g) => map[g.key].length > 0).map((g) => ({
      ...g,
      tasks: map[g.key],
    }));
  }, [filtered]);

  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (task) => {
    setEditing(task);
    setFormOpen(true);
  };

  const handleToggle = async (task) => {
    const next = task.status === "Completed" ? "Pending" : "Completed";
    try {
      await tasksApi.update(task._id, { status: next });
      load();
    } catch (err) {
      toast.error(err?.message ?? "Could not update task");
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await tasksApi.remove(toDelete._id);
      toast.success("Task deleted");
      setToDelete(null);
      load();
    } catch (err) {
      toast.error(err?.message ?? "Could not delete task");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader title="Action Items & Follow-ups" subtitle="Stay ahead of deal milestones, customer commitments, and cadences.">
        <Button variant="primary" size="sm" onClick={openNew} className="gap-1.5">
          <Plus className="h-3.5 w-3.5" /> Add Task
        </Button>
      </PageHeader>

      {/* KPI stat cards */}
      <div className="grid grid-cols-2 gap-3.5 xl:grid-cols-4">
        <StatCard label="Total Tasks"     value={stats.total}     icon={CalendarCheck} />
        <StatCard label="Pending Action"  value={stats.pending}   icon={Circle} />
        <StatCard label="Overdue Items"   value={stats.overdue}   icon={AlertTriangle} />
        <StatCard label="Completed"       value={stats.completed} icon={CheckCircle2} accent />
      </div>

      {tasks !== null && (
        <ProgressCard completed={stats.completed} total={stats.total} />
      )}

      {/* Status filter tabs + grouped task list */}
      <Card className="overflow-hidden bg-zinc-900 border-zinc-800">
        <div className="border-b border-zinc-800 px-4 py-2.5 bg-zinc-950">
          <Tabs value={tab} onChange={setTab} tabs={STATUS_TABS} />
        </div>

        {tasks === null ? (
          <div className="flex items-center justify-center py-16 text-zinc-500 text-xs font-mono">
            Loading tasks...
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={CalendarCheck}
            title="No actions here"
            description={
              tab === "all"
                ? "Add your first follow-up to get started."
                : `No tasks with status "${tab}".`
            }
            action={
              tab === "all" ? (
                <Button variant="primary" size="sm" onClick={openNew}>
                  <Plus className="h-3.5 w-3.5" /> Add Task
                </Button>
              ) : null
            }
          />
        ) : (
          <div>
            {groupedSections.map((group) => (
              <div key={group.key}>
                <GroupHeader
                  label={group.label}
                  count={group.tasks.length}
                  labelClass={group.labelClass}
                  countClass={group.countClass}
                />
                <div className="divide-y divide-zinc-800/60">
                  {group.tasks.map((task) => (
                    <TaskRow
                      key={task._id}
                      task={task}
                      onToggle={handleToggle}
                      onEdit={openEdit}
                      onDelete={setToDelete}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <TaskFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        task={editing}
        leads={leads}
        onSaved={load}
      />

      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete this action item?"
        description={`"${toDelete?.title}" will be permanently removed.`}
        confirmLabel="Delete task"
      />
    </div>
  );
}
