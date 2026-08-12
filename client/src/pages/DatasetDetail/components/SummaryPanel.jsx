import ProgressBar from "../../../utils/ProgressBar";
import { formatNumber, formatPercent } from "../../../utils/format";

export default function SummaryPanel({ summary, analytics }) {
  if (!summary || !analytics) return null;
  const totalCells = analytics.rowCount * analytics.columnCount;
  const completeness = ((totalCells - analytics.missingValueCount) / totalCells) * 100;
  const validity = ((totalCells - analytics.invalidValueCount) / totalCells) * 100;

  return (
    <div className="space-y-5">
      <ProgressBar value={analytics.qualityScore} label="Overall quality" size="lg" />
      <ProgressBar value={completeness} label="Completeness" tone="emerald" />
      <ProgressBar value={validity} label="Validity" tone="amber" />

      <dl className="grid grid-cols-2 gap-3 pt-1 text-sm">
        <div className="rounded-xl bg-slate-50 px-3 py-2.5">
          <dt className="label">Rows</dt>
          <dd className="font-bold text-ink-900">{formatNumber(summary.rowCount)}</dd>
        </div>
        <div className="rounded-xl bg-slate-50 px-3 py-2.5">
          <dt className="label">Columns</dt>
          <dd className="font-bold text-ink-900">{formatNumber(summary.columnCount)}</dd>
        </div>
        <div className="rounded-xl bg-emerald-50 px-3 py-2.5">
          <dt className="label text-emerald-700">Healthy columns</dt>
          <dd className="font-bold text-emerald-700">{summary.healthyColumns}</dd>
        </div>
        <div className="rounded-xl bg-rose-50 px-3 py-2.5">
          <dt className="label text-rose-700">Problematic</dt>
          <dd className="font-bold text-rose-700">{summary.problematicColumns}</dd>
        </div>
      </dl>

      <p className="text-xs text-slate-500">
        Quality score {formatPercent(summary.qualityScore)} · {formatNumber(summary.missingValueCount)} missing values detected.
      </p>
    </div>
  );
}
