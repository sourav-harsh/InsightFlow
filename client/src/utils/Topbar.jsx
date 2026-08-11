import { Link } from "react-router-dom";
import { FiBell, FiMenu, FiSearch, FiUploadCloud } from "react-icons/fi";

export default function Topbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/85 px-4 backdrop-blur sm:px-6">
      <button type="button" className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" onClick={onMenuClick} aria-label="Open navigation">
        <FiMenu size={18} />
      </button>

      <div className="relative hidden max-w-sm flex-1 sm:block">
        <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input
          type="search"
          placeholder="Search datasets or columns…"
          aria-label="Search"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100"
        />
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <Link to="/upload" className="btn-primary hidden sm:inline-flex">
          <FiUploadCloud size={16} /> Upload CSV
        </Link>
        <button type="button" className="relative rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50" aria-label="Notifications">
          <FiBell size={16} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500" />
        </button>
        <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 py-1.5 pl-1.5 pr-3">
          <img src="/images/avatar.svg" alt="" className="h-7 w-7 rounded-lg" />
          <div className="hidden leading-tight sm:block">
            <p className="text-xs font-semibold text-ink-900">Aarav Mehta</p>
            <p className="text-[11px] text-slate-500">Data Analyst</p>
          </div>
        </div>
      </div>
    </header>
  );
}
