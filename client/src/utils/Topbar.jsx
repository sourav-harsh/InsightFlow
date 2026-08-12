import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiBell, FiChevronDown, FiLogOut, FiMenu, FiSearch, FiUploadCloud } from "react-icons/fi";
import { useAuth } from "./AuthContext";

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate("/login", { replace: true });
  };

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

        {/* Account menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2.5 rounded-xl border border-slate-200 py-1.5 pl-1.5 pr-3 transition hover:bg-slate-50"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          >
            <img src="/images/avatar.svg" alt="" className="h-7 w-7 rounded-lg" />
            <span className="hidden leading-tight text-left sm:block">
              <span className="block text-xs font-semibold text-ink-900">{user?.name || "Account"}</span>
              <span className="block text-[11px] text-slate-500">{user?.role || "Signed in"}</span>
            </span>
            <FiChevronDown size={14} className={`text-slate-400 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10 cursor-default" onClick={() => setMenuOpen(false)} aria-hidden="true" />
              <div className="absolute right-0 z-20 mt-2 w-60 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card" role="menu">
                <div className="border-b border-slate-100 px-4 py-3">
                  <p className="truncate text-sm font-semibold text-ink-900">{user?.name || "Account"}</p>
                  <p className="truncate text-xs text-slate-500">{user?.email}</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                  role="menuitem"
                >
                  <FiLogOut size={15} /> Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
