import { useState } from "react";
import { FiCheck, FiCopy, FiKey, FiServer } from "react-icons/fi";
import { AUTH_TOKEN } from "../../api/client";
import PageHeader from "../../utils/PageHeader";
import Card from "../../utils/Card";

const ENDPOINTS = [
  { method: "POST", path: "/api/v1/datasets", note: "Upload a CSV (multipart/form-data)" },
  { method: "GET", path: "/api/v1/datasets/jobs/:jobId", note: "Processing job status" },
  { method: "GET", path: "/api/v1/analytics/datasets/:datasetId", note: "Full dataset analytics" },
  { method: "GET", path: "/api/v1/analytics/datasets/:datasetId/summary", note: "Compact summary" },
  { method: "GET", path: "/api/v1/analytics/datasets/:datasetId/columns/:columnName", note: "Single column profile" },
];

export default function Settings() {
  const [copied, setCopied] = useState(false);
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  const copyToken = async () => {
    try {
      await navigator.clipboard.writeText(AUTH_TOKEN);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <PageHeader title="Settings" description="API connection details used by this dashboard." />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="API connection" subtitle="Configured through environment variables">
          <div className="space-y-4">
            <div>
              <p className="label">Base URL</p>
              <p className="mt-1 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 font-mono text-sm text-slate-700">
                <FiServer size={15} className="text-slate-400" /> {baseUrl}
              </p>
            </div>
            <div>
              <p className="label">Bearer token</p>
              <div className="mt-1 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5">
                <FiKey size={15} className="text-slate-400" />
                <span className="min-w-0 flex-1 truncate font-mono text-sm text-slate-700">{AUTH_TOKEN}</span>
                <button type="button" onClick={copyToken} className="rounded-lg p-1.5 text-slate-500 hover:bg-white" aria-label="Copy token">
                  {copied ? <FiCheck size={15} className="text-emerald-600" /> : <FiCopy size={15} />}
                </button>
              </div>
              <p className="mt-1.5 text-xs text-slate-500">
                Hard-coded for development. Set <code className="font-mono">VITE_API_TOKEN</code> and <code className="font-mono">VITE_USE_MOCK=false</code> in <code className="font-mono">.env</code> to hit the live API.
              </p>
            </div>
          </div>
        </Card>

        <Card title="Endpoints" subtitle="All routes are JWT protected">
          <ul className="space-y-2.5">
            {ENDPOINTS.map((endpoint) => (
              <li key={endpoint.path} className="rounded-xl border border-slate-200 px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <span className={`chip ${endpoint.method === "POST" ? "bg-emerald-50 text-emerald-700" : "bg-brand-50 text-brand-700"}`}>
                    {endpoint.method}
                  </span>
                  <code className="truncate font-mono text-xs text-slate-700">{endpoint.path}</code>
                </div>
                <p className="mt-1 text-xs text-slate-500">{endpoint.note}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
