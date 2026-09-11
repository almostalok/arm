import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Dialog, Button, Field, Input, Select, Textarea } from "../ui";
import { leadsApi } from "../../lib/services";
import { LEAD_STAGES, LEAD_PRIORITIES, LEAD_SOURCES } from "../../lib/constants";

export function LeadFormDialog({ open, onClose, lead, onSaved }) {
  const editing = Boolean(lead?._id);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (!open) return;
    reset({
      name: lead?.name || "",
      email: lead?.email || "",
      phone: lead?.phone || "",
      company: lead?.company || "",
      status: lead?.status || "New",
      priority: lead?.priority || "Medium",
      source: lead?.source || "Website",
      value: lead?.value || 0,
      notes: lead?.notes || "",
    });
  }, [open, lead, reset]);

  const onSubmit = async (form) => {
    const payload = { ...form, value: Number(form.value) || 0 };
    try {
      const res = editing
        ? await leadsApi.update(lead._id, payload)
        : await leadsApi.create(payload);
      toast.success(editing ? "Lead updated successfully" : "Opportunity created in pipeline");
      onSaved?.(res.lead);
      onClose();
    } catch (err) {
      toast.error(err.message || "Could not save lead");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={editing ? "Update Opportunity" : "Create New Deal"}
      description={editing ? "Modify deal attributes, valuation, and sales stage." : "Track a new revenue opportunity and assign stage & priority."}
      className="max-w-xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5 pt-1">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Deal / Account Name" error={errors.name?.message} className="col-span-2">
            <Input
              placeholder="e.g. Enterprise Platform Rollout"
              {...register("name", { required: "Name is required" })}
            />
          </Field>
          <Field label="Company / Organization">
            <Input placeholder="Acme Global Inc" {...register("company")} />
          </Field>
          <Field label="Primary Email">
            <Input type="email" placeholder="contact@company.com" {...register("email")} />
          </Field>
          <Field label="Direct Phone">
            <Input placeholder="+1 (555) 019-2834" {...register("phone")} />
          </Field>
          <Field label="Estimated Deal Value ($ USD)">
            <Input type="number" min="0" placeholder="50000" {...register("value")} />
          </Field>
          <Field label="Pipeline Stage">
            <Select {...register("status")}>
              {LEAD_STAGES.map((s) => (
                <option key={s} value={s} className="bg-zinc-900 text-zinc-100">
                  {s}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Deal Priority">
            <Select {...register("priority")}>
              {LEAD_PRIORITIES.map((p) => (
                <option key={p} value={p} className="bg-zinc-900 text-zinc-100">
                  {p}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Lead Source" className="col-span-2">
            <Select {...register("source")}>
              {LEAD_SOURCES.map((s) => (
                <option key={s} value={s} className="bg-zinc-900 text-zinc-100">
                  {s}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Deal Notes & Scope" className="col-span-2">
            <Textarea placeholder="Key requirements, budget timeline, champions..." {...register("notes")} />
          </Field>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" loading={isSubmitting}>
            {editing ? "Save Changes" : "Create Deal"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
