import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Mail, Lock } from "lucide-react";
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
      toast.success(`Welcome back, ${user.name.split(" ")[0]}`);
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

      <h1 className="text-xl font-semibold tracking-tight text-zinc-100 font-sans">Sign in to ARM</h1>
      <p className="mt-1 text-xs text-zinc-400">
        Enter your credentials to access your relationship workspace.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-3.5">
        <Field label="Work Email" error={errors.email?.message}>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
            <Input
              type="email"
              placeholder="alex@armcrm.io"
              className="pl-8"
              {...register("email", { required: "Email is required" })}
            />
          </div>
        </Field>

        <Field label="Password" error={errors.password?.message}>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
            <Input
              type="password"
              placeholder="••••••••"
              className="pl-8"
              {...register("password", { required: "Password is required" })}
            />
          </div>
        </Field>

        <Button type="submit" variant="primary" className="w-full mt-2" size="md" loading={submitting}>
          Sign in to Workspace
        </Button>
      </form>

      <button
        type="button"
        onClick={useDemo}
        className="mt-3 w-full rounded-lg border border-dashed border-zinc-700 bg-zinc-900 py-2 text-xs font-medium text-zinc-300 transition hover:bg-zinc-850 cursor-pointer"
      >
        Autofill Demo Account (alex@armcrm.io)
      </button>

      <p className="mt-5 text-center text-xs text-zinc-400">
        New team or workspace?{" "}
        <Link to="/register" className="font-medium text-blue-400 hover:text-blue-300">
          Create account
        </Link>
      </p>
    </AuthShell>
  );
}
