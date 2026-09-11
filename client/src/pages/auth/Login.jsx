import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { AuthShell } from "./AuthShell";
import { Button, Field, Input, Logo } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues: { email: "", password: "" } });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const user = await login(data);
      toast.success(`Welcome back, ${user.name.split(" ")[0]} 👋`);
      navigate(location.state?.from?.pathname || "/", { replace: true });
    } catch (err) {
      toast.error(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  const useDemo = () => {
    setValue("email", "alex@armcrm.io");
    setValue("password", "Test@1234");
  };

  return (
    <AuthShell>
      <div className="lg:hidden mb-6 flex justify-center">
        <Logo size="lg" />
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-white font-display">Sign In to ARM</h1>
      <p className="mt-1 text-xs text-slate-400">
        Enter your credentials to access your relationship workspace.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <Field label="Work Email" error={errors.email?.message}>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              type="email"
              placeholder="alex@armcrm.io"
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
              placeholder="••••••••"
              className="pl-9.5"
              {...register("password", { required: "Password is required" })}
            />
          </div>
        </Field>

        <Button type="submit" variant="primary" className="w-full mt-2" size="lg" loading={submitting}>
          Sign In to Workspace
        </Button>
      </form>

      <button
        type="button"
        onClick={useDemo}
        className="mt-3 w-full rounded-xl border border-dashed border-indigo-500/40 bg-indigo-500/5 py-2.5 text-xs font-semibold text-indigo-300 transition hover:bg-indigo-500/10 cursor-pointer"
      >
        Autofill Demo Director Account (alex@armcrm.io)
      </button>

      <p className="mt-6 text-center text-xs text-slate-400">
        New team or workspace?{" "}
        <Link to="/register" className="font-semibold text-indigo-400 hover:text-indigo-300">
          Create account
        </Link>
      </p>
    </AuthShell>
  );
}
