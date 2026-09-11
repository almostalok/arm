import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  User,
  Lock,
  CheckCircle2,
  AlertCircle,
  Shield,
  Mail,
  KeyRound,
  Sliders,
  DollarSign,
  Radio,
  Zap,
} from "lucide-react";

import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Field,
  Badge,
  Avatar,
  StatusPill,
} from "../components/ui";
import { PageHeader } from "../components/common/PageHeader";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../lib/services";
import { shortDate } from "../lib/format";
import { cn } from "../lib/utils";

function SectionIcon({ icon: Icon, className }) {
  return (
    <div
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
        className
      )}
    >
      <Icon className="h-4 w-4" />
    </div>
  );
}

/* ── 1. Profile form ────────────────────────────────────────────── */
function ProfileCard({ user, updateUser }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (!user) return;
    reset({
      name: user.name || "",
      company: user.company || "",
      avatar: user.avatar || "",
    });
  }, [user, reset]);

  const onSubmit = async (form) => {
    try {
      const res = await authApi.updateProfile(form);
      updateUser(res.user);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.message || "Could not update profile");
    }
  };

  return (
    <Card className="bg-slate-900/80 border-slate-800">
      <CardHeader>
        <div className="flex items-center gap-3">
          <SectionIcon icon={User} />
          <div>
            <CardTitle>Director Profile</CardTitle>
            <CardDescription>Update your personal and organizational credentials.</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        {/* Avatar preview row */}
        <div className="mb-5 flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3">
          <Avatar name={user?.name || "Alex Carter"} src={user?.avatar} size="lg" />
          <div>
            <p className="text-sm font-bold text-white font-display">{user?.name || "Alex Carter"}</p>
            <p className="text-xs text-slate-400 font-mono">{user?.email || "alex@armcrm.io"}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field
              label="Full Name"
              error={errors.name?.message}
              className="sm:col-span-2"
            >
              <Input
                placeholder="Alex Carter"
                {...register("name", { required: "Name is required" })}
              />
            </Field>

            <Field label="Company / Workspace">
              <Input placeholder="ARM Technologies" {...register("company")} />
            </Field>

            <Field label="Email Address">
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <Input
                  value={user?.email || "alex@armcrm.io"}
                  disabled
                  className="pl-9 opacity-60 cursor-not-allowed"
                  readOnly
                />
              </div>
            </Field>

            <Field
              label="Avatar Image URL"
              error={errors.avatar?.message}
              className="sm:col-span-2"
            >
              <Input
                placeholder="https://example.com/photo.jpg"
                {...register("avatar")}
              />
            </Field>
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-800">
            <Button type="submit" variant="primary" size="sm" loading={isSubmitting}>
              Save Profile
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

/* ── 2. Security / change-password form ────────────────────────── */
function SecurityCard() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const newPassword = watch("password");

  const onSubmit = async ({ password }) => {
    try {
      await authApi.updateProfile({ password });
      toast.success("Password updated");
      reset();
    } catch (err) {
      toast.error(err.message || "Could not update password");
    }
  };

  return (
    <Card className="bg-slate-900/80 border-slate-800">
      <CardHeader>
        <div className="flex items-center gap-3">
          <SectionIcon icon={Lock} />
          <div>
            <CardTitle>Authentication & Security</CardTitle>
            <CardDescription>Manage security keys and account access passwords.</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="New Password" error={errors.password?.message}>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <Input
                  type="password"
                  placeholder="Min. 6 characters"
                  className="pl-9"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Must be at least 6 characters",
                    },
                  })}
                />
              </div>
            </Field>

            <Field
              label="Confirm New Password"
              error={errors.confirmPassword?.message}
            >
              <Input
                type="password"
                placeholder="Re-enter password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (v) =>
                    v === newPassword || "Passwords do not match",
                })}
              />
            </Field>
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-800">
            <Button type="submit" variant="secondary" size="sm" loading={isSubmitting}>
              Update Password
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

/* ── 3. Pipeline & Playbook Preferences ───────────────────────── */
function PipelinePreferencesCard() {
  return (
    <Card className="bg-slate-900/80 border-slate-800">
      <CardHeader>
        <div className="flex items-center gap-3">
          <SectionIcon icon={Sliders} />
          <div>
            <CardTitle>Sales Operations & Playbook Settings</CardTitle>
            <CardDescription>Configure quota goals, outreach signatures, and stage SLAs.</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-300">Quarterly Target</span>
              <StatusPill variant="emerald" size="sm">Active</StatusPill>
            </div>
            <p className="text-lg font-bold text-white font-mono">$1,000,000</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Annual goal: $4.2M target volume</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-300">Proposal SLA</span>
              <StatusPill variant="indigo" size="sm">14 Days</StatusPill>
            </div>
            <p className="text-sm font-semibold text-indigo-300 mt-1">Automated Follow-up Alert</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Flags stalled deals past 14 days in review</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Outreach Email Gateway</p>
              <p className="text-[11px] text-slate-400">SMTP / Direct Mail Relay connected</p>
            </div>
          </div>
          <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
            Connected
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

/* ── 4. Account info + logout ───────────────────────────────────── */
function AccountCard({ user, logout }) {
  return (
    <Card className="bg-slate-900/80 border-slate-800">
      <CardHeader>
        <div className="flex items-center gap-3">
          <SectionIcon icon={Shield} />
          <div>
            <CardTitle>Workspace Session</CardTitle>
            <CardDescription>Role authorization and active session controls.</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Authorization Role
            </p>
            <Badge tone="indigo">
              {user?.role || "Sales Director"}
            </Badge>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Account Active Since
            </p>
            <p className="text-xs font-mono font-semibold text-white">
              {shortDate(user?.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <Button variant="danger" size="sm" onClick={logout}>
            Log Out of Workspace
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Settings() {
  const { user, updateUser, logout } = useAuth();

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Workspace Settings"
        subtitle="Manage director profile, sales operations, and security credentials."
      />

      <ProfileCard user={user} updateUser={updateUser} />
      <PipelinePreferencesCard />
      <SecurityCard />
      <AccountCard user={user} logout={logout} />
    </div>
  );
}
