import React, { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import {
  CalendarRange,
  Plus,
  ArrowUpRight,
  Target,
  Layers,
  PieChart as PieIcon,
  CalendarClock,
  Trophy,
  Clock,
  AlertTriangle,
  Building2,
  Mail,
  Zap,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  DollarSign,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { format, isPast } from "date-fns";
import { HeroCard } from "../components/dashboard/HeroCard";
import { LeadScoringCard } from "../components/outreach/LeadScoringCard";
import {
  Card,
  SectionHeading,
  Badge,
  Tabs,
  Skeleton,
  Avatar,
  SpotlightCard,
  Button,
  NumberTicker,
  StatusPill,
} from "../components/ui";
import { analyticsApi, contactsApi, leadsApi, tasksApi } from "../lib/services";
import { currency, shortDate, timeOf } from "../lib/format";
import { STAGE_STYLES, PRIORITY_STYLES } from "../lib/constants";
import { useAuth } from "../context/AuthContext";
import { cn } from "../lib/utils";

const SOURCE_COLORS = ["#6366f1", "#8b5cf6", "#38bdf8", "#10b981", "#f59e0b", "#ec4899"];

export default function Dashboard() {
  const { user } = useAuth();
  const outletCtx = useOutletContext();
  const [data, setData] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [leads, setLeads] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [range, setRange] = useState("monthly");

  useEffect(() => {
    analyticsApi.overview().then(setData).catch(() => setData(false));
    contactsApi.list().then((res) => setContacts(res.contacts || [])).catch(() => {});
    leadsApi.list().then((res) => setLeads(res.leads || [])).catch(() => {});
    tasksApi.list().then((res) => setTasks(res.tasks || [])).catch(() => {});
  }, []);

  if (data === null) return <DashboardSkeleton />;
  const stats = data?.stats || {};

  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth() - 5, 1);
  const rangeLabel = `${format(start, "dd MMM")} – ${format(today, "dd MMM, yyyy")}`;

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <StatusPill variant="indigo" size="sm">
              Live Workspace
            </StatusPill>
            <span className="text-xs text-slate-400 font-mono">Q3 Performance Desk</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
            Welcome back, <span className="brand-gradient-text">{user?.name || "Alex"}</span>
          </h1>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="hidden sm:flex items-center gap-2 rounded-xl bg-slate-900/80 border border-slate-800 px-3.5 py-2 text-xs font-medium text-slate-300 shadow-sm">
            <CalendarRange className="h-3.5 w-3.5 text-slate-400" />
            <span>{rangeLabel}</span>
          </div>

          <Button
            variant="glass"
            size="sm"
            onClick={() => outletCtx?.openComposer?.()}
            className="gap-1.5"
          >
            <Mail className="h-3.5 w-3.5 text-indigo-400" />
            <span>Outreach Playbook</span>
          </Button>

          <Link to="/leads">
            <Button variant="primary" size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" /> New Opportunity
            </Button>
          </Link>
        </div>
      </div>

      {/* Top 4 Metric Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SpotlightCard className="p-4 bg-slate-900/60 border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Pipeline Value</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <NumberTicker
              value={stats.pipelineValue || 854000}
              prefix="$"
              className="text-2xl font-bold text-white font-display"
            />
            <div className="flex items-center gap-1 mt-1 text-xs text-emerald-400">
              <TrendingUp className="w-3 h-3" />
              <span>+18.4% this quarter</span>
            </div>
          </div>
        </SpotlightCard>

        <SpotlightCard className="p-4 bg-slate-900/60 border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Closed-Won Revenue</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <NumberTicker
              value={stats.revenueWon || 307500}
              prefix="$"
              className="text-2xl font-bold text-white font-display"
            />
            <div className="flex items-center gap-1 mt-1 text-xs text-emerald-400">
              <TrendingUp className="w-3 h-3" />
              <span>+24.1% YoY</span>
            </div>
          </div>
        </SpotlightCard>

        <SpotlightCard className="p-4 bg-slate-900/60 border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Win Rate & Velocity</span>
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <NumberTicker
              value={stats.conversionRate || 64}
              suffix="%"
              className="text-2xl font-bold text-white font-display"
            />
            <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
              <span>Avg cycle: 22 days</span>
            </div>
          </div>
        </SpotlightCard>

        <SpotlightCard className="p-4 bg-slate-900/60 border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Opportunities</span>
            <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <NumberTicker
              value={stats.totalLeads || 16}
              className="text-2xl font-bold text-white font-display"
            />
            <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
              <span>{stats.openTasks || 7} pending tasks</span>
            </div>
          </div>
        </SpotlightCard>
      </div>

      {/* 3-Column Bento Grid */}
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
        {/* ── Left column ───────────────────────────────── */}
        <div className="space-y-5 lg:col-span-4">
          <HeroCard value={stats.pipelineValue} />

          <UpcomingTasks tasks={tasks} />
          <TopContactsCard contacts={contacts} />
        </div>

        {/* ── Center column ─────────────────────────────── */}
        <div className="space-y-5 lg:col-span-5">
          <Card className="p-5">
            <SectionHeading
              icon={BarChart3}
              title="Pipeline Trajectory"
              subtitle="Monthly deal volume & new inbound accounts"
              action={
                <Tabs
                  value={range}
                  onChange={setRange}
                  tabs={[
                    { value: "monthly", label: "Monthly" },
                    { value: "annually", label: "Annually" },
                  ]}
                />
              }
            />
            <div className="mt-4">
              <EngagementChart trend={data?.trend || []} />
            </div>
          </Card>

          <Card className="p-5">
            <SectionHeading
              title="Recent Lead Activity"
              subtitle="Live chronological deal state movements"
              to="/leads"
            />
            <div className="mt-3">
              <ActivityTable leads={data?.recentLeads || []} />
            </div>
          </Card>

          <PipelineByStage pipeline={data?.pipeline || []} />
        </div>

        {/* ── Right column ──────────────────────────────── */}
        <div className="space-y-5 lg:col-span-3">
          <LeadScoringCard
            score={88}
            buyingStage="Decision Phase"
            onActionClick={() => outletCtx?.openComposer?.()}
          />

          <LeadsBySource leads={leads} />
          <TopDeals leads={leads} />
        </div>
      </div>
    </div>
  );
}

/* ── Pipeline by stage ─────────────────────────────────────────────── */
function PipelineByStage({ pipeline, className }) {
  const maxValue = Math.max(...pipeline.map((s) => s.value), 1);
  const totalValue = pipeline.reduce((sum, s) => sum + s.value, 0);

  return (
    <Card className={cn("p-5", className)}>
      <SectionHeading
        icon={Layers}
        title="Pipeline Funnel & Stages"
        subtitle="Distribution of volume across pipeline"
        to="/pipeline"
      />
      <div className="mt-4 space-y-3.5">
        {pipeline.map((s) => {
          const style = STAGE_STYLES[s.stage] || STAGE_STYLES.New;
          const pct = totalValue ? Math.round((s.value / totalValue) * 100) : 0;
          return (
            <div key={s.stage}>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-medium text-slate-200">
                  <span className={cn("h-2 w-2 rounded-full", style.dot)} />
                  {s.stage}
                  <span className="text-slate-500">· {s.count} deals</span>
                </span>
                <span className="font-semibold text-white font-mono">
                  {currency(s.value, { compact: true })}
                  <span className="ml-1.5 text-[10px] font-normal text-slate-400">({pct}%)</span>
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-950/80 border border-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-400 transition-all duration-700"
                  style={{ width: `${Math.max((s.value / maxValue) * 100, 3)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

/* ── Leads by source ───────────────────────────────────────────────── */
function LeadsBySource({ leads }) {
  const grouped = leads.reduce((acc, l) => {
    const key = l.source || "Other";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const dataset = Object.entries(grouped).map(([name, value]) => ({ name, value }));

  return (
    <Card className="p-5">
      <SectionHeading icon={PieIcon} title="Acquisition Channels" subtitle="Lead attribution breakdown" />
      {dataset.length === 0 ? (
        <p className="py-8 text-center text-xs text-slate-500">No channel data available.</p>
      ) : (
        <div className="mt-3 flex items-center gap-4">
          <div className="relative h-32 w-32 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataset}
                  dataKey="value"
                  innerRadius={38}
                  outerRadius={58}
                  paddingAngle={3}
                  stroke="none"
                >
                  {dataset.map((_, i) => (
                    <Cell key={i} fill={SOURCE_COLORS[i % SOURCE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip unit=" deals" />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-lg font-bold text-white">{leads.length}</span>
              <span className="text-[10px] text-slate-400">Total</span>
            </div>
          </div>
          <ul className="flex-1 space-y-1.5">
            {dataset.slice(0, 4).map((d, i) => (
              <li key={d.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-400">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: SOURCE_COLORS[i % SOURCE_COLORS.length] }}
                  />
                  {d.name}
                </span>
                <span className="font-medium text-white font-mono">{d.value}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}

/* ── Upcoming follow-ups ───────────────────────────────────────────── */
function UpcomingTasks({ tasks }) {
  const upcoming = tasks
    .filter((t) => t.status !== "Completed")
    .sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    })
    .slice(0, 4);

  return (
    <Card className="flex flex-col p-5">
      <SectionHeading
        icon={CalendarClock}
        title="Action Required"
        subtitle="High-priority deal follow-ups"
        to="/tasks"
      />
      {upcoming.length === 0 ? (
        <p className="py-6 text-center text-xs text-slate-500">All tasks completed</p>
      ) : (
        <ul className="mt-3 space-y-2.5">
          {upcoming.map((t) => {
            const overdue = t.dueDate && isPast(new Date(t.dueDate));
            return (
              <li
                key={t._id}
                className="flex items-start gap-3 p-2 rounded-xl bg-slate-950/40 border border-slate-800/80 transition-colors hover:border-slate-700"
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border",
                    overdue
                      ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                  )}
                >
                  {overdue ? (
                    <AlertTriangle className="h-3 w-3" />
                  ) : (
                    <Clock className="h-3 w-3" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-200">{t.title}</p>
                  <p className={cn("text-[11px]", overdue ? "text-rose-400 font-medium" : "text-slate-400")}>
                    {t.dueDate ? shortDate(t.dueDate) : "No date"}
                    {t.relatedLead?.name ? ` · ${t.relatedLead.name}` : ""}
                  </p>
                </div>
                <Badge tone={t.priority === "High" ? "rose" : "default"} className="text-[10px] px-1.5 py-0">
                  {t.priority}
                </Badge>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

/* ── Top open deals ────────────────────────────────────────────────── */
function TopDeals({ leads }) {
  const deals = [...leads]
    .filter((l) => l.status !== "Won" && l.status !== "Lost")
    .sort((a, b) => (b.value || 0) - (a.value || 0))
    .slice(0, 5);

  return (
    <Card className="flex flex-col p-5">
      <SectionHeading icon={Trophy} title="Top Active Opportunities" subtitle="Highest-value deal targets" to="/leads" />
      {deals.length === 0 ? (
        <p className="py-6 text-center text-xs text-slate-500">No active opportunities.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {deals.map((l, i) => {
            const style = STAGE_STYLES[l.status] || STAGE_STYLES.New;
            return (
              <li
                key={l._id}
                className="flex items-center gap-3 p-2 rounded-xl bg-slate-950/40 border border-slate-800/80"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-slate-800 text-[10px] font-mono font-bold text-slate-400">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-200">{l.name}</p>
                  <p className="truncate text-[10px] text-slate-400">{l.company || "Direct"}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-white font-mono">
                    {currency(l.value, { compact: true })}
                  </p>
                  <span className={cn("text-[10px] font-medium", style.badge, "bg-transparent px-0")}>
                    {l.status}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

/* ── Chart ─────────────────────────────────────────────────────────── */
function EngagementChart({ trend }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={trend} barCategoryGap="28%" margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#4338ca" />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#64748b", fontSize: 11 }}
          dy={6}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#64748b", fontSize: 11 }}
          width={30}
          tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)}
        />
        <Tooltip cursor={{ fill: "rgba(255,255,255,0.03)" }} content={<ChartTooltip unit=" deals" />} />
        <Bar dataKey="leads" radius={[8, 8, 0, 0]} maxBarSize={36} fill="url(#barGrad)" />
      </BarChart>
    </ResponsiveContainer>
  );
}

function ChartTooltip({ active, payload, label, prefix = "", unit = "" }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-700/80 bg-slate-900 px-3 py-2 shadow-2xl shadow-slate-950/80">
      <p className="text-[11px] font-medium text-slate-400">{label}</p>
      <p className="text-xs font-bold text-white font-mono mt-0.5">
        {prefix}
        {Number(payload[0].value).toLocaleString()}
        {unit}
      </p>
    </div>
  );
}

/* ── Activity table ────────────────────────────────────────────────── */
function ActivityTable({ leads }) {
  if (!leads.length)
    return <p className="py-6 text-center text-xs text-slate-500">No recent deal movement.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
            <th className="pb-2.5 font-semibold">Account / Opportunity</th>
            <th className="pb-2.5 font-semibold">Updated</th>
            <th className="pb-2.5 font-semibold">Stage</th>
            <th className="pb-2.5 text-right font-semibold">Valuation</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {leads.map((l) => {
            const style = STAGE_STYLES[l.status] || STAGE_STYLES.New;
            return (
              <tr key={l.id} className="transition-colors hover:bg-slate-800/40">
                <td className="py-2.5">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={l.company || l.name} size="sm" />
                    <div>
                      <p className="font-semibold text-white">{l.name}</p>
                      <p className="text-[10px] text-slate-400">{l.company || "—"}</p>
                    </div>
                  </div>
                </td>
                <td className="py-2.5 text-slate-400 font-mono text-[11px]">
                  {shortDate(l.updatedAt)}
                </td>
                <td className="py-2.5">
                  <Badge className={style.badge} dot={style.dot}>
                    {l.status}
                  </Badge>
                </td>
                <td className="py-2.5 text-right font-bold text-white font-mono">
                  {currency(l.value)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ── Top contacts ──────────────────────────────────────────────────── */
function TopContactsCard({ contacts }) {
  const top = contacts.slice(0, 4);
  const overflow = Math.max(contacts.length - top.length, 0);

  return (
    <Card className="p-5">
      <SectionHeading title="Key Stakeholders" subtitle="Primary account champions" to="/contacts" />
      {contacts.length === 0 ? (
        <p className="mt-3 text-xs text-slate-500">No contacts saved.</p>
      ) : (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex -space-x-2">
            {top.map((c) => (
              <Avatar
                key={c._id}
                name={c.name}
                size="md"
                className="ring-2 ring-slate-900"
              />
            ))}
            {overflow > 0 && (
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-xs font-bold text-white ring-2 ring-slate-900">
                +{overflow}
              </div>
            )}
          </div>
          <Link
            to="/contacts"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
          >
            View All Contacts →
          </Link>
        </div>
      )}
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-64" />
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-4">
          <Skeleton className="h-64" />
          <Skeleton className="h-44" />
        </div>
        <div className="space-y-5 lg:col-span-5">
          <Skeleton className="h-80" />
          <Skeleton className="h-64" />
        </div>
        <div className="space-y-5 lg:col-span-3">
          <Skeleton className="h-64" />
          <Skeleton className="h-44" />
        </div>
      </div>
    </div>
  );
}
