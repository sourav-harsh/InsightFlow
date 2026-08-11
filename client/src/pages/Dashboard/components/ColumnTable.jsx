import { Link } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import Badge from "../../../utils/Badge";
import ProgressBar from "../../../utils/ProgressBar";
import { formatNumber } from "../../../utils/format";

const TYPE_VARIANT = {
  STRING: "info", EMAIL: "violet", DATE: "info", DECIMAL: "success", PHONE: "warning",
};

export default function ColumnTable({ datasetId, statistics = {} }) {
  const rows = Object.entries(statistics);

  return (
    <div className="-mx-5 overflow-x-auto sm:-mx-6">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left">
            <th className="px-5 pb-3 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">Column</th>
            <th className="px-4 pb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Type</th>
            <th className="px-4 pb-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Missing</th>
            <th className="px-4 pb-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Invalid</th>
            <th className="w-56 px-4 pb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Quality</th>
            <th className="px-5 pb-3 sm:px-6" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map(([name, stat]) => (
            <tr key={name} className="transition hover:bg-slate-50/70">
              <td className="px-5 py-3.5 font-semibold text-ink-900 sm:px-6">{name}</td>
              <td className="px-4 py-3.5">
                <Badge variant={TYPE_VARIANT[stat.type] || "neutral"}>{stat.type}</Badge>
              </td>
              <td className="px-4 py-3.5 text-right tabular-nums text-slate-600">{formatNumber(stat.missingCount)}</td>
              <td className="px-4 py-3.5 text-right tabular-nums text-slate-600">{formatNumber(stat.invalidCount)}</td>
              <td className="px-4 py-3.5">
                <ProgressBar value={stat.qualityScore} size="sm" />
              </td>
              <td className="px-5 py-3.5 text-right sm:px-6">
                <Link
                  to={`/datasets/${datasetId}/columns/${encodeURIComponent(name)}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
                >
                  Details <FiChevronRight size={14} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
