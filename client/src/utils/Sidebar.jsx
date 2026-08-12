import { NavLink } from "react-router-dom";
import { FiBarChart2, FiDatabase, FiGrid, FiSettings, FiUploadCloud, FiX } from "react-icons/fi";
import cn from "./cn";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: FiGrid },
  { to: "/upload", label: "Upload CSV", icon: FiUploadCloud },
  { to: "/datasets", label: "Datasets", icon: FiDatabase },
  { to: "/settings", label: "Settings", icon: FiSettings },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-30 bg-ink-900/40 backdrop-blur-sm transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <div className="flex items-center gap-2.5">
            <img src="/images/logo.svg" alt="InsightFlow logo" className="h-8 w-8" />
            <span className="text-base font-extrabold tracking-tight text-ink-900">
              Insight<span className="text-brand-600">Flow</span>
            </span>
          </div>
          <button type="button" className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden" onClick={onClose} aria-label="Close navigation">
            <FiX size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  isActive ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-50 hover:text-ink-900"
                )
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="m-3 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-4 text-white">
          <FiBarChart2 size={20} />
          <p className="mt-2 text-sm font-semibold">Data quality, at a glance</p>
          <p className="mt-1 text-xs text-white/75">Upload a CSV and get column-level insights in seconds.</p>
        </div>
      </aside>
    </>
  );
}
