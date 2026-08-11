import { FiInbox } from "react-icons/fi";

export default function EmptyState({ title = "Nothing here yet", description, action }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-10 text-center">
      <FiInbox className="text-slate-400" size={26} />
      <p className="text-sm font-semibold text-ink-900">{title}</p>
      {description && <p className="max-w-sm text-xs text-slate-500">{description}</p>}
      {action}
    </div>
  );
}
