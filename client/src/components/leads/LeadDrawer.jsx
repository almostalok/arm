import React, { useState } from "react";
import {
  Mail,
  Phone,
  Building2,
  Pencil,
  Trash2,
  Send,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import { Drawer, Button, Badge, Avatar, StatusPill, NumberTicker } from "../ui";
import { EmailComposerDialog } from "../outreach/EmailComposerDialog";
import { LeadScoringCard } from "../outreach/LeadScoringCard";
import { currency, shortDate } from "../../lib/format";
import { STAGE_STYLES, PRIORITY_STYLES } from "../../lib/constants";
import { cn } from "../../lib/utils";

export function LeadDrawer({ open, onClose, lead, onEdit, onDelete }) {
  const [emailOpen, setEmailOpen] = useState(false);

  if (!lead) return null;
  const stage = STAGE_STYLES[lead.status] || STAGE_STYLES.New;

  return (
    <>
      <Drawer open={open} onClose={onClose} title="Opportunity & Account Profile">
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Avatar name={lead.company || lead.name} size="lg" />
            <div className="min-w-0">
              <h2 className="truncate text-lg font-bold text-white font-display">{lead.name}</h2>
              <p className="truncate text-xs text-slate-400 font-medium">{lead.company || "Direct Account"}</p>
            </div>
          </div>

          {/* Status Pills */}
          <div className="flex flex-wrap gap-2">
            <Badge className={stage.badge} dot={stage.dot}>
              {lead.status}
            </Badge>
            <Badge className={PRIORITY_STYLES[lead.priority]}>{lead.priority} priority</Badge>
            <Badge tone="indigo">{lead.source}</Badge>
          </div>

          {/* Value & Stage Metric Card */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <div>
              <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">Deal Value</p>
              <p className="mt-1 text-xl font-bold text-white font-display">{currency(lead.value)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">Lead Health</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-bold text-indigo-400 font-display">{lead.leadScore || 85}</span>
                <span className="text-[10px] text-slate-500 font-mono">/100</span>
              </div>
            </div>
          </div>

          {/* Contact info */}
          <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <InfoRow icon={Mail} value={lead.email} href={`mailto:${lead.email}`} />
            <InfoRow icon={Phone} value={lead.phone} href={`tel:${lead.phone}`} />
            <InfoRow icon={Building2} value={lead.company} />
          </div>

          {/* Notes */}
          {lead.notes && (
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Deal Notes & Context
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-200">{lead.notes}</p>
            </div>
          )}

          {/* Quantitative Lead Scoring & Signals */}
          <LeadScoringCard
            score={lead.leadScore || 85}
            buyingStage={lead.buyingStage || (lead.status === "Won" ? "Customer" : "Evaluation")}
            onActionClick={() => setEmailOpen(true)}
          />

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button
              variant="primary"
              onClick={() => setEmailOpen(true)}
              className="col-span-2 gap-1.5"
            >
              <Send className="h-4 w-4" /> Launch Outreach Playbook
            </Button>
            <Button variant="secondary" onClick={() => onEdit(lead)} className="gap-1.5">
              <Pencil className="h-4 w-4" /> Edit Details
            </Button>
            <Button variant="danger" onClick={() => onDelete(lead)} className="gap-1.5">
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          </div>

          <p className="text-center text-[11px] text-slate-500 font-mono">
            Created on {shortDate(lead.createdAt)}
          </p>
        </div>
      </Drawer>

      <EmailComposerDialog
        open={emailOpen}
        onClose={() => setEmailOpen(false)}
        lead={lead}
      />
    </>
  );
}

function InfoRow({ icon: Icon, value, href }) {
  if (!value) return null;
  const content = (
    <div className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-xs text-slate-300 transition-colors hover:text-white hover:bg-slate-800/60">
      <Icon className="h-4 w-4 text-slate-400 shrink-0" />
      <span className="truncate font-medium">{value}</span>
    </div>
  );
  return href ? (
    <a href={href} className="block">
      {content}
    </a>
  ) : (
    content
  );
}
