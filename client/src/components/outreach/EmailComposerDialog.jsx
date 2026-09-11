import React, { useState, useEffect } from "react";
import { Send, FileText, Check, Copy } from "lucide-react";
import { Dialog, Button, Input, Textarea, Label, StatusPill } from "../ui";
import { outreachTemplates } from "../../lib/mockData";
import { outreachApi } from "../../lib/services";
import { toast } from "sonner";

export function EmailComposerDialog({ open, onClose, lead, contact }) {
  const [templateId, setTemplateId] = useState("followup");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [recipient, setRecipient] = useState("");
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);

  // Merge tag replacement helper
  const replaceTags = (text) => {
    const firstName = contact?.name?.split(" ")[0] || lead?.name?.split(" ")[0] || "there";
    const company = lead?.company || contact?.company || "your team";
    const dealName = lead?.name || "Enterprise Engagement";
    const dealValue = lead?.value ? `$${lead.value.toLocaleString()}` : "$50,000";

    return text
      .replace(/{{firstName}}/g, firstName)
      .replace(/{{company}}/g, company)
      .replace(/{{dealName}}/g, dealName)
      .replace(/{{dealValue}}/g, dealValue);
  };

  useEffect(() => {
    if (!open) return;
    const activeTemplate = outreachTemplates.find((t) => t.id === templateId) || outreachTemplates[0];
    setSubject(replaceTags(activeTemplate.subject));
    setBody(replaceTags(activeTemplate.body));
    setRecipient(contact?.email || lead?.email || "stakeholder@company.com");
  }, [open, templateId, lead, contact]);

  const handleSend = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await outreachApi.sendEmail({ recipient, subject, body });
      toast.success("Outreach email sent successfully!", {
        description: `Delivered to ${recipient}`,
      });
      onClose();
    } catch {
      toast.error("Failed to send email");
    } finally {
      setSending(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
    setCopied(true);
    toast.info("Copied email text to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Outreach Email Composer"
      description="Select a structured sales playbook template or craft tailored messaging with dynamic merge tags."
      className="max-w-2xl"
    >
      <div className="space-y-4 pt-1">
        {/* Playbook Template Switcher */}
        <div>
          <Label>Playbook Template</Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1">
            {outreachTemplates.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTemplateId(t.id)}
                className={`flex flex-col items-start p-2.5 rounded-lg border text-left transition-colors cursor-pointer select-none ${
                  templateId === t.id
                    ? "bg-zinc-800 border-zinc-700 text-zinc-100 shadow-sm"
                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                }`}
              >
                <span className="text-xs font-medium leading-tight">{t.name}</span>
                <span className="text-[10px] text-zinc-500 font-mono mt-1">Playbook</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Context Pill */}
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400">Target Account:</span>
            <span className="text-xs font-medium text-zinc-200">
              {lead?.company || contact?.company || "Selected Account"}
            </span>
          </div>
          <StatusPill variant="emerald" size="sm">
            Variables Auto-Populated
          </StatusPill>
        </div>

        {/* Recipient */}
        <div>
          <Label>To (Recipient)</Label>
          <Input
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="recipient@company.com"
          />
        </div>

        {/* Subject */}
        <div>
          <Label>Subject Line</Label>
          <Input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject line..."
          />
        </div>

        {/* Body */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label className="mb-0">Message Body</Label>
            <span className="text-[10px] font-mono text-zinc-500">
              Tags: &#123;&#123;firstName&#125;&#125;, &#123;&#123;company&#125;&#125;, &#123;&#123;dealName&#125;&#125;, &#123;&#123;dealValue&#125;&#125;
            </span>
          </div>
          <Textarea
            rows={6}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write message..."
            className="font-sans leading-relaxed text-sm"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleCopy}
            className="gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied" : "Copy to Clipboard"}
          </Button>

          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="cobalt"
              size="sm"
              loading={sending}
              onClick={handleSend}
              className="gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              Send Outreach
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
