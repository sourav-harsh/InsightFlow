import { FiCheck, FiClock, FiLoader, FiXCircle } from "react-icons/fi";
import cn from "../../../utils/cn";
import { formatDateTime } from "../../../utils/format";

const STEPS = [
  { key: "UPLOADED", label: "File uploaded", hint: "CSV received and stored" },
  { key: "PROCESSING", label: "Processing", hint: "Parsing rows and profiling columns" },
  { key: "COMPLETED", label: "Analytics ready", hint: "Quality report generated" },
];

const ORDER = { UPLOADED: 0, PENDING: 0, PROCESSING: 1, COMPLETED: 2, FAILED: 1 };

export default function JobTimeline({ status = "UPLOADED", job }) {
  const activeIndex = ORDER[status] ?? 0;
  const failed = status === "FAILED";

  return (
    <ol className="space-y-4">
      {STEPS.map((step, index) => {
        const done = index < activeIndex || status === "COMPLETED";
        const current = index === activeIndex && status !== "COMPLETED";
        const Icon = failed && current ? FiXCircle : done ? FiCheck : current ? FiLoader : FiClock;

        return (
          <li key={step.key} className="flex gap-3">
            <span
              className={cn(
                "mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full",
                failed && current ? "bg-rose-100 text-rose-600"
                  : done ? "bg-emerald-100 text-emerald-600"
                  : current ? "bg-brand-100 text-brand-600"
                  : "bg-slate-100 text-slate-400"
              )}
            >
              <Icon size={15} className={current && !failed ? "animate-spin" : undefined} />
            </span>
            <div>
              <p className={cn("text-sm font-semibold", done || current ? "text-ink-900" : "text-slate-400")}>{step.label}</p>
              <p className="text-xs text-slate-500">{step.hint}</p>
              {step.key === "COMPLETED" && job?.completedAt && (
                <p className="mt-0.5 text-[11px] text-slate-400">{formatDateTime(job.completedAt)}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
