import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiAlertCircle, FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi";
import { IS_MOCK } from "../../../api/client";
import { useAuth } from "../../../utils/AuthContext";
import Spinner from "../../../utils/Spinner";

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const fillDemo = () => setForm({ email: "demo@insightflow.io", password: "demo1234" });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setSubmitting(true);
    try {
      await login(form.email.trim(), form.password);
      const target = location.state?.from;
      navigate(target && target !== "/login" ? target : "/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to sign in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {error && (
        <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-700" role="alert">
          <FiAlertCircle size={16} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      <div>
        <label htmlFor="login-email" className="label">Email</label>
        <div className="relative mt-1.5">
          <FiMail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={form.email}
            onChange={update("email")}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        </div>
      </div>

      <div>
        <label htmlFor="login-password" className="label">Password</label>
        <div className="relative mt-1.5">
          <FiLock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            value={form.password}
            onChange={update("password")}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-11 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
          </button>
        </div>
      </div>

      <button type="submit" disabled={submitting} className="btn-primary w-full">
        {submitting && <Spinner className="h-4 w-4" />}
        {submitting ? "Signing in…" : "Sign in"}
      </button>

      {IS_MOCK && (
        <div className="rounded-xl border border-brand-100 bg-brand-50 px-3.5 py-3 text-xs text-brand-800">
          <p className="font-semibold">Demo mode is on</p>
          <p className="mt-0.5 text-brand-700/80">
            Any email and a 6+ character password will work — or{" "}
            <button type="button" onClick={fillDemo} className="font-semibold underline underline-offset-2 hover:text-brand-900">
              fill demo credentials
            </button>
            .
          </p>
        </div>
      )}
    </form>
  );
}
