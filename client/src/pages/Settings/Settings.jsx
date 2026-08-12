import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCheck, FiCopy, FiKey, FiLogOut, FiServer, FiUser } from "react-icons/fi";
import { IS_MOCK } from "../../api/client";
import { useAuth } from "../../utils/AuthContext";
import PageHeader from "../../utils/PageHeader";
import Card from "../../utils/Card";

const ENDPOINTS = [
  { method: "POST", path: "/api/v1/auth/register", note: "Create an account (public)", access: "Public" },
  { method: "POST", path: "/api/v1/auth/login", note: "Sign in, returns the access token (public)", access: "Public" },
  { method: "POST", path: "/api/v1/datasets", note: "Upload a CSV (multipart/form-data)", access: "JWT" },
  { method: "GET", path: "/api/v1/datasets/jobs/:jobId", note: "Processing job status", access: "JWT" },
  { method: "GET", path: "/api/v1/analytics/datasets/:datasetId", note: "Full dataset analytics", access: "JWT" },
  { method: "GET", path: "/api/v1/analytics/datasets/:datasetId/summary", note: "Compact summary", access: "JWT" },
  { method: "GET", path: "/api/v1/analytics/datasets/:datasetId/columns/:columnName", note: "Single column profile", access: "JWT" },
  { method: "GET", path: "/api/v1/analytics/datasets/jobs", note: "Get all jobs", access: "JWT" },
];

export default function Settings() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  const copyToken = async () => {
    try {
      await navigator.clipboard.writeText(token || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <PageHeader title="Settings" description="Session and API connection details used by this dashboard." />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="API connection" subtitle="Configured through environment variables" className="hidden">
          <div className="space-y-4">
            <div>
              <p className="label">Base URL</p>
              <p className="mt-1 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 font-mono text-sm text-slate-700">
                <FiServer size={15} className="text-slate-400" /> {baseUrl}
              </p>
            </div>
            <div>
              <p className="label">Access token</p>
              <div className="mt-1 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5">
                <FiKey size={15} className="text-slate-400" />
                <span className="min-w-0 flex-1 truncate font-mono text-sm text-slate-700">{token || "—"}</span>
                <button type="button" onClick={copyToken} className="rounded-lg p-1.5 text-slate-500 hover:bg-white" aria-label="Copy token">
                  {copied ? <FiCheck size={15} className="text-emerald-600" /> : <FiCopy size={15} />}
                </button>
              </div>
              <p className="mt-1.5 text-xs text-slate-500">
                Issued at sign-in and sent as <code className="font-mono">Authorization: Bearer</code> on every
                request. {IS_MOCK ? "Mock mode is on — set " : "Set "}
                <code className="font-mono">VITE_USE_MOCK=false</code> in <code className="font-mono">.env</code> to hit the live API.
              </p>
            </div>
          </div>
        </Card>

        <Card title="Session" subtitle="The account currently signed in">
          <div className="flex items-center gap-3.5">
            <img src="/images/avatar.svg" alt="" className="h-12 w-12 rounded-xl" />
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-sm font-semibold text-ink-900">
                <FiUser size={14} className="text-slate-400" /> {user?.name || "Account"}
              </p>
              <p className="truncate text-xs text-slate-500">{user?.email}</p>
              <span className="chip mt-1.5 bg-brand-50 text-brand-700">{user?.role || "Member"}</span>
            </div>
          </div>
          <button type="button" onClick={handleLogout} className="btn-ghost mt-5 w-full text-rose-600 hover:bg-rose-50">
            <FiLogOut size={15} /> Sign out
          </button>
        </Card>
      </div>

      <Card title="Endpoints" subtitle="Authentication routes are public; everything else is JWT protected" className="mt-4">
        <ul className="grid gap-2.5 md:grid-cols-2">
          {ENDPOINTS.map((endpoint) => (
            <li key={endpoint.path} className="rounded-xl border border-slate-200 px-3 py-2.5">
              <div className="flex items-center gap-2">
                <span className={`chip ${endpoint.method === "POST" ? "bg-emerald-50 text-emerald-700" : "bg-brand-50 text-brand-700"}`}>
                  {endpoint.method}
                </span>
                <code className="truncate font-mono text-xs text-slate-700">{endpoint.path}</code>
                <span className={`chip ml-auto ${endpoint.access === "JWT" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"}`}>
                  {endpoint.access}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">{endpoint.note}</p>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
