import React, { useEffect, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import confetti from "canvas-confetti";
import {
  GripVertical,
  Building2,
  TrendingUp,
  Layers,
  Target,
  DollarSign,
  Mail,
  Plus,
  Zap,
} from "lucide-react";
import { PageHeader } from "../components/common/PageHeader";
import { Avatar, Badge, Card, Button, NumberTicker, SpotlightCard } from "../components/ui";
import { EmailComposerDialog } from "../components/outreach/EmailComposerDialog";
import { LeadFormDialog } from "../components/leads/LeadFormDialog";
import { leadsApi } from "../lib/services";
import { currency } from "../lib/format";
import { PIPELINE_STAGES, STAGE_STYLES, PRIORITY_STYLES } from "../lib/constants";
import { cn } from "../lib/utils";
import { toast } from "sonner";

const toBoard = (leads) => {
  const board = Object.fromEntries(PIPELINE_STAGES.map((s) => [s, []]));
  for (const l of leads) (board[l.status] || board.New).push(l);
  return board;
};

export default function Pipeline() {
  const [board, setBoard] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [emailLead, setEmailLead] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const loadLeads = () => {
    leadsApi
      .list()
      .then((res) => setBoard(toBoard(res.leads)))
      .catch(() => setBoard(toBoard([])));
  };

  useEffect(() => {
    loadLeads();
  }, []);

  if (!board) return <div className="p-8 text-center text-slate-500">Loading Pipeline...</div>;

  const findContainer = (id) => {
    if (id in board) return id;
    return PIPELINE_STAGES.find((s) => board[s].some((l) => l._id === id));
  };

  const activeLead = activeId
    ? Object.values(board).flat().find((l) => l._id === activeId)
    : null;

  const handleDragOver = ({ active, over }) => {
    if (!over) return;
    const from = findContainer(active.id);
    const to = findContainer(over.id);
    if (!from || !to || from === to) return;

    setBoard((prev) => {
      const fromItems = [...prev[from]];
      const toItems = [...prev[to]];
      const idx = fromItems.findIndex((l) => l._id === active.id);
      if (idx === -1) return prev;
      const [moved] = fromItems.splice(idx, 1);
      moved.status = to;
      const overIdx = toItems.findIndex((l) => l._id === over.id);
      toItems.splice(overIdx === -1 ? toItems.length : overIdx, 0, moved);
      return { ...prev, [from]: fromItems, [to]: toItems };
    });
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);
    if (!over) return;
    const container = findContainer(over.id);
    if (!container) return;

    // Trigger celebration confetti when moving a deal to "Won"
    if (container === "Won") {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#6366f1", "#10b981", "#38bdf8", "#f59e0b"],
      });
      toast.success("Deal Closed Won! 🚀", {
        description: "Revenue added to active closed volume.",
      });
    }

    setBoard((prev) => {
      const items = [...prev[container]];
      const oldIdx = items.findIndex((l) => l._id === active.id);
      const newIdx = items.findIndex((l) => l._id === over.id);
      const reordered =
        oldIdx !== -1 && newIdx !== -1 ? arrayMove(items, oldIdx, newIdx) : items;
      const next = { ...prev, [container]: reordered };

      const updates = [];
      PIPELINE_STAGES.forEach((stage) => {
        next[stage].forEach((l, order) =>
          updates.push({ id: l._id, status: stage, order })
        );
      });
      leadsApi.reorder(updates).catch(() => toast.error("Could not save pipeline order"));
      return next;
    });
  };

  const allLeads = Object.values(board).flat();
  const totalValue = allLeads.reduce((s, l) => s + (l.value || 0), 0);
  const openDeals = allLeads.filter((l) => l.status !== "Won" && l.status !== "Lost");
  const wonLeads = allLeads.filter((l) => l.status === "Won");
  const wonValue = wonLeads.reduce((s, l) => s + (l.value || 0), 0);
  const closedCount = wonLeads.length + (board.Lost?.length || 0);
  const winRate = closedCount > 0 ? Math.round((wonLeads.length / closedCount) * 100) : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Revenue Pipeline Board"
        subtitle={`${allLeads.length} active opportunities · ${currency(totalValue, { compact: true })} total volume in motion`}
      >
        <Button variant="primary" size="sm" onClick={() => setCreateOpen(true)} className="gap-1.5">
          <Plus className="h-4 w-4" /> Add Opportunity
        </Button>
      </PageHeader>

      {/* KPI summary strip */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile
          icon={DollarSign}
          tint="bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
          label="Total Pipeline Volume"
          value={currency(totalValue, { compact: true })}
        />
        <StatTile
          icon={Layers}
          tint="bg-sky-500/10 text-sky-400 border-sky-500/20"
          label="Active Opportunities"
          value={openDeals.length}
        />
        <StatTile
          icon={Target}
          tint="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
          label="Closed-Won Revenue"
          value={currency(wonValue, { compact: true })}
        />
        <StatTile
          icon={TrendingUp}
          tint="bg-violet-500/10 text-violet-400 border-violet-500/20"
          label="Conversion Win Rate"
          value={`${winRate}%`}
        />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={({ active }) => setActiveId(active.id)}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {PIPELINE_STAGES.map((stage) => (
            <Column
              key={stage}
              stage={stage}
              leads={board[stage]}
              onEmail={(lead) => setEmailLead(lead)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeLead ? <LeadCard lead={activeLead} overlay /> : null}
        </DragOverlay>
      </DndContext>

      {/* Outreach Email Composer */}
      <EmailComposerDialog
        open={Boolean(emailLead)}
        onClose={() => setEmailLead(null)}
        lead={emailLead}
      />

      {/* Create Deal Modal */}
      <LeadFormDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSaved={loadLeads}
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

function Column({ stage, leads, onEmail }) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });
  const style = STAGE_STYLES[stage] || STAGE_STYLES.New;
  const value = leads.reduce((s, l) => s + (l.value || 0), 0);

  return (
    <div className="flex w-72 sm:w-80 shrink-0 flex-col">
      {/* Column header */}
      <div className="mb-2.5 flex items-center justify-between px-2 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-2">
          <span className={cn("h-2 w-2 rounded-full", style.dot)} />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">{stage}</h3>
          <span className="rounded-md bg-slate-800 px-1.5 py-0.2 text-[10px] font-mono font-bold text-slate-400 border border-slate-700">
            {leads.length}
          </span>
        </div>
        <span className="text-xs font-mono font-semibold text-slate-300">
          {currency(value, { compact: true })}
        </span>
      </div>

      {/* Droppable column body */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex min-h-[65vh] flex-1 flex-col gap-2.5 rounded-2xl border border-dashed border-slate-800/80 bg-slate-950/40 p-2.5 transition-colors",
          isOver && "border-indigo-500/60 bg-indigo-950/20"
        )}
      >
        <SortableContext
          items={leads.map((l) => l._id)}
          strategy={verticalListSortingStrategy}
        >
          {leads.map((lead) => (
            <SortableCard key={lead._id} lead={lead} onEmail={onEmail} />
          ))}
        </SortableContext>
        {leads.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center text-xs text-slate-500">
            <span>Drop deals here</span>
          </div>
        )}
      </div>
    </div>
  );
}

function SortableCard({ lead, onEmail }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: lead._id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(isDragging && "opacity-40")}
    >
      <LeadCard lead={lead} dragHandle={{ attributes, listeners }} onEmail={onEmail} />
    </div>
  );
}

function LeadCard({ lead, dragHandle, overlay, onEmail }) {
  return (
    <div
      className={cn(
        "group rounded-xl bg-slate-900/90 p-3.5 border border-slate-800 transition-all duration-150 relative",
        overlay
          ? "shadow-2xl shadow-indigo-950/80 border-indigo-500/50 rotate-1 scale-102"
          : "hover:border-slate-700 hover:shadow-lg hover:shadow-slate-950/50"
      )}
    >
      {/* Name / company row + drag handle */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <Avatar name={lead.company || lead.name} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-white">{lead.name}</p>
            <p className="flex items-center gap-1 truncate text-[10px] text-slate-400">
              <Building2 className="h-2.5 w-2.5 shrink-0" />
              {lead.company || "Direct"}
            </p>
          </div>
        </div>
        {dragHandle && (
          <button
            {...dragHandle.attributes}
            {...dragHandle.listeners}
            className="cursor-grab text-slate-500 transition hover:text-slate-200 active:cursor-grabbing p-1"
            aria-label="Drag deal"
          >
            <GripVertical className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Value + priority + health score */}
      <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/80">
        <span className="text-xs font-bold text-white font-mono">{currency(lead.value)}</span>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.2 rounded border border-indigo-500/20">
            {lead.leadScore || 80} pts
          </span>
          <Badge className={cn("text-[10px] py-0 px-1.5", PRIORITY_STYLES[lead.priority])}>
            {lead.priority}
          </Badge>
        </div>
      </div>

      {/* Quick Outreach Button on Hover */}
      {!overlay && (
        <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEmail?.(lead)}
            className="flex items-center gap-1 text-[11px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
          >
            <Mail className="w-3 h-3" />
            <span>Send Outreach</span>
          </button>
          <span className="text-[10px] text-slate-500 font-mono">{lead.source}</span>
        </div>
      )}
    </div>
  );
}
