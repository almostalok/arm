import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { User, Mail, Lock, Building2 } from "lucide-react";
import { AuthShell } from "./AuthShell";
import { Button, Field, Input, Logo } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await registerUser(data);
      toast.success("Workspace created — welcome to ARM! 🎉");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell>
      <div className="lg:hidden mb-6 flex justify-center">
        <Logo size="lg" />
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-white font-display">Create Workspace</h1>
      <p className="mt-1 text-xs text-slate-400">
        Start managing accounts, deals, and pipeline velocity in seconds.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-3.5">
        <Field label="Full Name" error={errors.name?.message}>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              placeholder="Alex Carter"
              className="pl-9.5"
              {...register("name", { required: "Name is required" })}
            />
          </div>
        </Field>

        <Field label="Company / Organization" error={errors.company?.message}>
          <div className="relative">
            <Building2 className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              placeholder="Acme Growth Inc"
              className="pl-9.5"
              {...register("company")}
            />
          </div>
        </Field>

        <Field label="Work Email" error={errors.email?.message}>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              type="email"
              placeholder="alex@company.com"
              className="pl-9.5"
              {...register("email", { required: "Email is required" })}
            />
          </div>
        </Field>

        <Field label="Password" error={errors.password?.message}>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              type="password"
              placeholder="At least 6 characters"
              className="pl-9.5"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              })}
            />
          </div>
        </Field>

        <Button type="submit" variant="primary" className="w-full mt-2" size="lg" loading={submitting}>
          Create ARM Workspace
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-slate-400">
        Already have a workspace?{" "}
        <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
