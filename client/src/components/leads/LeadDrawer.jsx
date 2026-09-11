import React, { useState } from "react";
import {
  Mail,
  Phone,
  Building2,
  Pencil,
  Trash2,
  Send,
} from "lucide-react";
import { Drawer, Button, Badge, Avatar } from "../ui";
import { EmailComposerDialog } from "../outreach/EmailComposerDialog";
import { LeadScoringCard } from "../outreach/LeadScoringCard";
import { currency, shortDate } from "../../lib/format";
import { STAGE_STYLES, PRIORITY_STYLES } from "../../lib/constants";

export function LeadDrawer({ open, onClose, lead, onEdit, onDelete }) {
  const [emailOpen, setEmailOpen] = useState(false);

  if (!lead) return null;
  const stage = STAGE_STYLES[lead.status] || STAGE_STYLES.New;

  return (
    <>
      <Drawer open={open} onClose={onClose} title="Opportunity & Account Profile">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Avatar name={lead.company || lead.name} size="lg" />
            <div className="min-w-0">
              <h2 className="truncate text-base font-semibold text-zinc-100">{lead.name}</h2>
              <p className="truncate text-xs text-zinc-400">{lead.company || "Direct Account"}</p>
            </div>
          </div>

          {/* Status Pills */}
          <div className="flex flex-wrap gap-1.5">
            <Badge className={stage.badge} dot={stage.dot}>
              {lead.status}
            </Badge>
            <Badge className={PRIORITY_STYLES[lead.priority]}>{lead.priority} priority</Badge>
            <Badge tone="blue">{lead.source}</Badge>
          </div>

          {/* Value & Stage Metric Card */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-lg bg-zinc-900 border border-zinc-800">
            <div>
              <p className="text-[10px] uppercase font-semibold tracking-wider text-zinc-400 font-mono">Deal Value</p>
              <p className="mt-0.5 text-lg font-semibold text-zinc-100 font-mono">{currency(lead.value)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-semibold tracking-wider text-zinc-400 font-mono">Lead Health</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-lg font-semibold text-zinc-100 font-mono">{lead.leadScore || 85}</span>
                <span className="text-[10px] text-zinc-500 font-mono">/100</span>
              </div>
            </div>
          </div>

          {/* Contact info */}
          <div className="space-y-1 p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
            <InfoRow icon={Mail} value={lead.email} href={`mailto:${lead.email}`} />
            <InfoRow icon={Phone} value={lead.phone} href={`tel:${lead.phone}`} />
            <InfoRow icon={Building2} value={lead.company} />
          </div>

          {/* Notes */}
          {lead.notes && (
            <div className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 font-mono">
                Deal Notes & Context
              </p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-200">{lead.notes}</p>
            </div>
          )}

          {/* Quantitative Lead Scoring & Signals */}
          <LeadScoringCard
            score={lead.leadScore || 85}
            buyingStage={lead.buyingStage || (lead.status === "Won" ? "Customer" : "Evaluation")}
            onActionClick={() => setEmailOpen(true)}
          />

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <Button
              variant="cobalt"
              onClick={() => setEmailOpen(true)}
              className="col-span-2 gap-1.5"
            >
              <Send className="h-3.5 w-3.5" /> Launch Outreach Playbook
            </Button>
            <Button variant="secondary" onClick={() => onEdit(lead)} className="gap-1.5">
              <Pencil className="h-3.5 w-3.5" /> Edit Details
            </Button>
            <Button variant="danger" onClick={() => onDelete(lead)} className="gap-1.5">
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </Button>
          </div>

          <p className="text-center text-[10px] text-zinc-500 font-mono">
            Created {shortDate(lead.createdAt)}
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
    <div className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-zinc-300 transition-colors hover:text-zinc-100 hover:bg-zinc-800">
      <Icon className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
      <span className="truncate font-normal">{value}</span>
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
