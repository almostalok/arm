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
import { currency, shortDate } from "../lib/format";
import { STAGE_STYLES } from "../lib/constants";
import { useAuth } from "../context/AuthContext";
import { cn } from "../lib/utils";

const SOURCE_COLORS = ["#2563eb", "#10b981", "#f59e0b", "#06b6d4", "#64748b", "#3b82f6"];

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
    <div className="space-y-5">
      {/* Title Bar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <StatusPill variant="blue" size="sm">
              Live Workspace
            </StatusPill>
            <span className="text-xs text-zinc-400 font-mono">Q3 Performance Desk</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-100 mt-1 font-sans">
            Welcome back, <span className="text-zinc-100">{user?.name || "Alex"}</span>
          </h1>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="hidden sm:flex items-center gap-2 rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-300 shadow-sm">
            <CalendarRange className="h-3.5 w-3.5 text-zinc-400" />
            <span>{rangeLabel}</span>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => outletCtx?.openComposer?.()}
            className="gap-1.5"
          >
            <Mail className="h-3.5 w-3.5 text-zinc-400" />
            <span>Outreach Playbook</span>
          </Button>

          <Link to="/leads">
            <Button variant="primary" size="sm" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" /> New Opportunity
            </Button>
          </Link>
        </div>
      </div>

      {/* Top 4 Metric Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <SpotlightCard className="p-4 bg-zinc-900/70 border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Total Pipeline Value</span>
            <div className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700/60">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <NumberTicker
              value={stats.pipelineValue || 854000}
              prefix="$"
              className="text-xl font-semibold text-zinc-100 font-sans"
            />
            <div className="flex items-center gap-1 mt-1 text-xs text-emerald-400">
              <TrendingUp className="w-3 h-3" />
              <span>+18.4% this quarter</span>
            </div>
          </div>
        </SpotlightCard>

        <SpotlightCard className="p-4 bg-zinc-900/70 border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Closed-Won Revenue</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <NumberTicker
              value={stats.revenueWon || 307500}
              prefix="$"
              className="text-xl font-semibold text-zinc-100 font-sans"
            />
            <div className="flex items-center gap-1 mt-1 text-xs text-emerald-400">
              <TrendingUp className="w-3 h-3" />
              <span>+24.1% YoY</span>
            </div>
          </div>
        </SpotlightCard>

        <SpotlightCard className="p-4 bg-zinc-900/70 border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Win Rate & Velocity</span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <NumberTicker
              value={stats.conversionRate || 64}
              suffix="%"
              className="text-xl font-semibold text-zinc-100 font-sans"
            />
            <div className="flex items-center gap-1 mt-1 text-xs text-zinc-400">
              <span>Avg cycle: 22 days</span>
            </div>
          </div>
        </SpotlightCard>

        <SpotlightCard className="p-4 bg-zinc-900/70 border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Active Opportunities</span>
            <div className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700/60">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <NumberTicker
              value={stats.totalLeads || 16}
              className="text-xl font-semibold text-zinc-100 font-sans"
            />
            <div className="flex items-center gap-1 mt-1 text-xs text-zinc-400">
              <span>{stats.openTasks || 7} pending tasks</span>
            </div>
          </div>
        </SpotlightCard>
      </div>

      {/* 3-Column Bento Grid */}
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-12">
        {/* ── Left column ───────────────────────────────── */}
        <div className="space-y-4 lg:col-span-4">
          <HeroCard value={stats.pipelineValue} />

          <UpcomingTasks tasks={tasks} />
          <TopContactsCard contacts={contacts} />
        </div>

        {/* ── Center column ─────────────────────────────── */}
        <div className="space-y-4 lg:col-span-5">
          <Card className="p-4">
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
            <div className="mt-3">
              <EngagementChart trend={data?.trend || []} />
            </div>
          </Card>

          <Card className="p-4">
            <SectionHeading
              title="Recent Lead Activity"
              subtitle="Live chronological deal state movements"
              to="/leads"
            />
            <div className="mt-2.5">
              <ActivityTable leads={data?.recentLeads || []} />
            </div>
          </Card>

          <PipelineByStage pipeline={data?.pipeline || []} />
        </div>

        {/* ── Right column ──────────────────────────────── */}
        <div className="space-y-4 lg:col-span-3">
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
    <Card className={cn("p-4", className)}>
      <SectionHeading
        icon={Layers}
        title="Pipeline Funnel & Stages"
        subtitle="Distribution of volume across pipeline"
        to="/pipeline"
      />
      <div className="mt-3.5 space-y-3">
        {pipeline.map((s) => {
          const style = STAGE_STYLES[s.stage] || STAGE_STYLES.New;
          const pct = totalValue ? Math.round((s.value / totalValue) * 100) : 0;
          return (
            <div key={s.stage}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-zinc-200">
                  <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} />
                  {s.stage}
                  <span className="text-zinc-500">· {s.count}</span>
                </span>
                <span className="font-semibold text-zinc-100 font-mono">
                  {currency(s.value, { compact: true })}
                  <span className="ml-1 text-[10px] font-normal text-zinc-400">({pct}%)</span>
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-500"
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
    <Card className="p-4">
      <SectionHeading icon={PieIcon} title="Acquisition Channels" subtitle="Lead attribution breakdown" />
      {dataset.length === 0 ? (
        <p className="py-6 text-center text-xs text-zinc-500">No channel data available.</p>
      ) : (
        <div className="mt-3 flex items-center gap-3">
          <div className="relative h-28 w-28 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataset}
                  dataKey="value"
                  innerRadius={32}
                  outerRadius={50}
                  paddingAngle={2}
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
              <span className="text-base font-semibold text-zinc-100 font-sans">{leads.length}</span>
              <span className="text-[10px] text-zinc-400">Total</span>
            </div>
          </div>
          <ul className="flex-1 space-y-1">
            {dataset.slice(0, 4).map((d, i) => (
              <li key={d.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: SOURCE_COLORS[i % SOURCE_COLORS.length] }}
                  />
                  {d.name}
                </span>
                <span className="font-medium text-zinc-200 font-mono">{d.value}</span>
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
    <Card className="flex flex-col p-4">
      <SectionHeading
        icon={CalendarClock}
        title="Action Required"
        subtitle="High-priority deal follow-ups"
        to="/tasks"
      />
      {upcoming.length === 0 ? (
        <p className="py-5 text-center text-xs text-zinc-500">All tasks completed</p>
      ) : (
        <ul className="mt-2.5 space-y-2">
          {upcoming.map((t) => {
            const overdue = t.dueDate && isPast(new Date(t.dueDate));
            return (
              <li
                key={t._id}
                className="flex items-start gap-2.5 p-2 rounded-lg bg-zinc-900 border border-zinc-800"
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border",
                    overdue
                      ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      : "bg-zinc-800 text-zinc-400 border-zinc-700/60"
                  )}
                >
                  {overdue ? (
                    <AlertTriangle className="h-3 w-3" />
                  ) : (
                    <Clock className="h-3 w-3" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-zinc-200">{t.title}</p>
                  <p className={cn("text-[10px]", overdue ? "text-rose-400 font-medium" : "text-zinc-400")}>
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
    <Card className="flex flex-col p-4">
      <SectionHeading icon={Trophy} title="Top Active Deals" subtitle="Highest-value targets" to="/leads" />
      {deals.length === 0 ? (
        <p className="py-5 text-center text-xs text-zinc-500">No active opportunities.</p>
      ) : (
        <ul className="mt-2.5 space-y-1.5">
          {deals.map((l, i) => {
            const style = STAGE_STYLES[l.status] || STAGE_STYLES.New;
            return (
              <li
                key={l._id}
                className="flex items-center gap-2.5 p-2 rounded-lg bg-zinc-900 border border-zinc-800"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-zinc-800 text-[10px] font-mono font-medium text-zinc-400">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-zinc-200">{l.name}</p>
                  <p className="truncate text-[10px] text-zinc-400">{l.company || "Direct"}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-zinc-100 font-mono">
                    {currency(l.value, { compact: true })}
                  </p>
                  <span className={cn("text-[10px] font-normal", style.badge, "bg-transparent border-0 px-0")}>
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
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={trend} barCategoryGap="28%" margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#71717a", fontSize: 11 }}
          dy={6}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#71717a", fontSize: 11 }}
          width={30}
          tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)}
        />
        <Tooltip cursor={{ fill: "rgba(255,255,255,0.03)" }} content={<ChartTooltip unit=" deals" />} />
        <Bar dataKey="leads" radius={[4, 4, 0, 0]} maxBarSize={32} fill="#2563eb" />
      </BarChart>
    </ResponsiveContainer>
  );
}

function ChartTooltip({ active, payload, label, prefix = "", unit = "" }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-zinc-750 bg-zinc-900 px-3 py-1.5 shadow-xl">
      <p className="text-[10px] font-mono text-zinc-400">{label}</p>
      <p className="text-xs font-semibold text-zinc-100 font-mono mt-0.5">
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
    return <p className="py-5 text-center text-xs text-zinc-500">No recent deal movement.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-left text-[10px] uppercase tracking-wider text-zinc-400 font-mono border-b border-zinc-800">
            <th className="pb-2 font-medium">Account / Deal</th>
            <th className="pb-2 font-medium">Updated</th>
            <th className="pb-2 font-medium">Stage</th>
            <th className="pb-2 text-right font-medium">Valuation</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/60">
          {leads.map((l) => {
            const style = STAGE_STYLES[l.status] || STAGE_STYLES.New;
            return (
              <tr key={l.id} className="transition-colors hover:bg-zinc-800/40">
                <td className="py-2">
                  <div className="flex items-center gap-2">
                    <Avatar name={l.company || l.name} size="sm" />
                    <div>
                      <p className="font-medium text-zinc-200">{l.name}</p>
                      <p className="text-[10px] text-zinc-400">{l.company || "—"}</p>
                    </div>
                  </div>
                </td>
                <td className="py-2 text-zinc-400 font-mono text-[10px]">
                  {shortDate(l.updatedAt)}
                </td>
                <td className="py-2">
                  <Badge className={style.badge} dot={style.dot}>
                    {l.status}
                  </Badge>
                </td>
                <td className="py-2 text-right font-semibold text-zinc-100 font-mono">
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
    <Card className="p-4">
      <SectionHeading title="Key Stakeholders" subtitle="Primary account champions" to="/contacts" />
      {contacts.length === 0 ? (
        <p className="mt-2 text-xs text-zinc-500">No contacts saved.</p>
      ) : (
        <div className="mt-3 flex items-center justify-between">
          <div className="flex -space-x-1.5">
            {top.map((c) => (
              <Avatar
                key={c._id}
                name={c.name}
                size="md"
                className="ring-2 ring-zinc-900"
              />
            ))}
            {overflow > 0 && (
              <div className="flex h-8.5 w-8.5 items-center justify-center rounded-lg bg-zinc-800 text-xs font-semibold text-zinc-300 ring-2 ring-zinc-900 border border-zinc-700">
                +{overflow}
              </div>
            )}
          </div>
          <Link
            to="/contacts"
            className="text-xs font-medium text-blue-400 hover:text-blue-300"
          >
            View All →
          </Link>
        </div>
      )}
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-9 w-64" />
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-4">
          <Skeleton className="h-56" />
          <Skeleton className="h-40" />
        </div>
        <div className="space-y-4 lg:col-span-5">
          <Skeleton className="h-72" />
          <Skeleton className="h-56" />
        </div>
        <div className="space-y-4 lg:col-span-3">
          <Skeleton className="h-56" />
          <Skeleton className="h-40" />
        </div>
      </div>
    </div>
  );
}
