import { FiBarChart2, FiCheckCircle, FiShield, FiTrendingUp } from "react-icons/fi";

const HIGHLIGHTS = [
  { icon: FiBarChart2, text: "Column-level quality profiling for every CSV" },
  { icon: FiShield, text: "JWT-secured ingestion and analytics APIs" },
  { icon: FiTrendingUp, text: "Track quality scores across every upload" },
];

/**
 * Shared split-screen shell for the Login and Register pages:
 * brand panel on the left, form content on the right.
 */
export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Brand panel */}
      <aside className="relative hidden w-[44%] flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-700 via-brand-800 to-ink-900 p-10 text-white lg:flex xl:p-14">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-brand-500/10 blur-3xl" />

        <div className="relative flex items-center gap-2.5">
          <img src="/images/logo.svg" alt="InsightFlow logo" className="h-9 w-9" />
          <span className="text-lg font-extrabold tracking-tight">
            Insight<span className="text-brand-300">Flow</span>
          </span>
        </div>

        <div className="relative">
          <h2 className="max-w-md text-3xl font-extrabold leading-tight tracking-tight xl:text-4xl">
            Know the health of your data before you ship it.
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70">
            Upload a CSV and InsightFlow profiles every column — missing values, invalid
            entries, type distribution and an overall quality score.
          </p>

          <ul className="mt-8 space-y-3.5">
            {HIGHLIGHTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-white/85">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                  <Icon size={16} />
                </span>
                {text}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/20 text-emerald-300">
              <FiCheckCircle size={20} />
            </span>
            <div>
              <p className="text-sm font-semibold">employees.csv scored 76.4 / 100</p>
              <p className="text-xs text-white/60">10,000 rows profiled in 0.14 seconds</p>
            </div>
          </div>
        </div>

        <p className="relative text-xs text-white/50">
          © {new Date().getFullYear()} InsightFlow — data quality analytics.
        </p>
      </aside>

      {/* Form panel */}
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <img src="/images/logo.svg" alt="InsightFlow logo" className="h-9 w-9" />
            <span className="text-lg font-extrabold tracking-tight text-ink-900">
              Insight<span className="text-brand-600">Flow</span>
            </span>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">{title}</h1>
          <p className="mt-1.5 text-sm text-slate-500">{subtitle}</p>

          <div className="mt-8">{children}</div>

          {footer && <div className="mt-6 text-center text-sm text-slate-500">{footer}</div>}
        </div>
      </main>
    </div>
  );
}
