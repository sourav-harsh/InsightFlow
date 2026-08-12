import cn from "./cn";

export default function Card({ title, subtitle, action, children, className, bodyClassName }) {
  return (
    <section className={cn("card", className)}>
      {(title || action) && (
        <header className="flex items-start justify-between gap-4 border-b border-slate-200/70 px-5 py-4 sm:px-6">
          <div>
            {title && <h2 className="text-sm font-semibold text-ink-900">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      <div className={cn("card-pad", bodyClassName)}>{children}</div>
    </section>
  );
}
