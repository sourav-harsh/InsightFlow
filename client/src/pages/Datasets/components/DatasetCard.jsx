import { Link } from "react-router-dom";
import { FiArrowUpRight, FiClock, FiColumns, FiDatabase } from "react-icons/fi";
import Badge, { STATUS_VARIANT } from "../../../utils/Badge";
import ProgressBar from "../../../utils/ProgressBar";
import { formatDateTime, formatNumber } from "../../../utils/format";

export default function DatasetCard({ dataset }) {
  return (
    <article className="card card-pad transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
            <FiDatabase size={18} />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-ink-900">{dataset.filename}</h3>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
              <FiClock size={12} /> {formatDateTime(dataset.createdAt)}
            </p>
          </div>
        </div>
        <Badge variant={STATUS_VARIANT[dataset.status] || "neutral"}>{dataset.status}</Badge>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-slate-50 px-3 py-2">
          <p className="label">Rows</p>
          <p className="font-bold text-ink-900">{formatNumber(dataset.totalRows)}</p>
        </div>
        <div className="rounded-xl bg-slate-50 px-3 py-2">
          <p className="label flex items-center gap-1"><FiColumns size={11} /> Columns</p>
          <p className="font-bold text-ink-900">{formatNumber(dataset.totalColumns)}</p>
        </div>
      </div>

      <div className="mt-4">
        <ProgressBar value={dataset.qualityScore ?? 0} label="Quality score" showLabel={dataset.qualityScore != null} />
      </div>

      <Link
        to={`/datasets/${dataset.datasetId}`}
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700"
      >
        Open analytics <FiArrowUpRight size={15} />
      </Link>
    </article>
  );
}
