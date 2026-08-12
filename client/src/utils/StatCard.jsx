import cn from "./cn";

export default function StatCard({ icon: Icon, label, value, hint, tone = "brand" }) {
  const tones = {
    brand: "bg-brand-50 text-brand-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
    violet: "bg-violet-50 text-violet-600",
  };

  return (
    <div className="card card-pad">
      <div className="flex items-center justify-between">
        <p className="label">{label}</p>
        {Icon && (
          <span className={cn("grid h-9 w-9 place-items-center rounded-xl", tones[tone] || tones.brand)}>
            <Icon className="h-4.5 w-4.5" size={18} />
          </span>
        )}
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight text-ink-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
