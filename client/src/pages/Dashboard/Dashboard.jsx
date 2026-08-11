import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiActivity, FiAlertOctagon, FiCheckCircle, FiColumns, FiDatabase, FiLayers, FiUploadCloud,
} from "react-icons/fi";
import { getDatasetAnalytics, getDatasetSummary, listDatasets } from "../../api/client";
import useApiResource from "../../utils/useApiResource";
import Card from "../../utils/Card";
import StatCard from "../../utils/StatCard";
import PageHeader from "../../utils/PageHeader";
import Loader from "../../utils/Loader";
import ErrorState from "../../utils/ErrorState";
import ProgressBar from "../../utils/ProgressBar";
import Badge from "../../utils/Badge";
import { formatDateTime, formatNumber, formatPercent } from "../../utils/format";
import QualityGauge from "./components/QualityGauge";
import ColumnQualityChart from "./components/ColumnQualityChart";
import TypeDistributionChart from "./components/TypeDistributionChart";
import MissingInvalidChart from "./components/MissingInvalidChart";
import ColumnTable from "./components/ColumnTable";

export default function Dashboard() {
  const [datasetId, setDatasetId] = useState("");
  const datasets = useApiResource(() => listDatasets(), []);

  useEffect(() => {
    if (!datasetId && datasets.data?.length) setDatasetId(datasets.data[0].datasetId);
  }, [datasets.data, datasetId]);

  const analytics = useApiResource(() => getDatasetAnalytics(datasetId), [datasetId], { enabled: Boolean(datasetId) });
  const summary = useApiResource(() => getDatasetSummary(datasetId), [datasetId], { enabled: Boolean(datasetId) });

  const stats = analytics.data?.statistics || {};
  const totalCells = useMemo(
    () => (analytics.data ? analytics.data.rowCount * analytics.data.columnCount : 0),
    [analytics.data]
  );

  const loading = analytics.loading || summary.loading || datasets.loading;
  const error = analytics.error || summary.error || datasets.error;

  return (
    <>
      <PageHeader
        title="Data quality dashboard"
        description="Overview of ingested datasets, column health and detected issues."
        actions={
          <>
            <select
              value={datasetId}
              onChange={(event) => setDatasetId(event.target.value)}
              aria-label="Select dataset"
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            >
              {(datasets.data || []).map((dataset) => (
                <option key={dataset.datasetId} value={dataset.datasetId}>
                  {dataset.filename}
                </option>
              ))}
            </select>
            <Link to="/upload" className="btn-primary">
              <FiUploadCloud size={16} /> Upload CSV
            </Link>
          </>
        }
      />

      {error && <ErrorState message={error} onRetry={() => { analytics.refetch(); summary.refetch(); }} />}

      {!error && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={FiDatabase} label="Total rows" value={formatNumber(analytics.data?.rowCount)} hint={`${formatNumber(totalCells)} cells analysed`} />
            <StatCard icon={FiColumns} label="Columns" value={formatNumber(analytics.data?.columnCount)} tone="violet" hint={`${summary.data?.healthyColumns ?? "—"} healthy · ${summary.data?.problematicColumns ?? "—"} problematic`} />
            <StatCard icon={FiLayers} label="Missing values" value={formatNumber(analytics.data?.missingValueCount)} tone="amber" hint={totalCells ? `${((analytics.data.missingValueCount / totalCells) * 100).toFixed(2)}% of all cells` : undefined} />
            <StatCard icon={FiAlertOctagon} label="Invalid values" value={formatNumber(analytics.data?.invalidValueCount)} tone="rose" hint={totalCells ? `${((analytics.data.invalidValueCount / totalCells) * 100).toFixed(2)}% of all cells` : undefined} />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card title="Overall quality score" subtitle={`Computed ${formatDateTime(analytics.data?.createdAt)}`}>
              {loading ? <Loader rows={4} /> : (
                <>
                  <QualityGauge score={analytics.data?.qualityScore ?? 0} />
                  <div className="mt-2 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-emerald-50 px-3 py-2.5">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">Healthy</p>
                      <p className="text-lg font-bold text-emerald-700">{summary.data?.healthyColumns ?? "—"}</p>
                    </div>
                    <div className="rounded-xl bg-rose-50 px-3 py-2.5">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-rose-700">Problematic</p>
                      <p className="text-lg font-bold text-rose-700">{summary.data?.problematicColumns ?? "—"}</p>
                    </div>
                  </div>
                </>
              )}
            </Card>

            <Card className="lg:col-span-2" title="Quality score by column" subtitle="Higher is better — anything under 60% needs attention.">
              {loading ? <Loader rows={6} /> : <ColumnQualityChart statistics={stats} />}
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card title="Column type distribution" subtitle="Inferred types across the dataset">
              {loading ? <Loader rows={5} /> : <TypeDistributionChart distribution={summary.data?.columnTypeDistribution || {}} />}
            </Card>

            <Card className="lg:col-span-2" title="Missing vs invalid values" subtitle="Absolute issue counts per column">
              {loading ? <Loader rows={6} /> : <MissingInvalidChart statistics={stats} />}
            </Card>
          </div>

          <Card title="Column breakdown" subtitle="Click a column to open its detailed profile" bodyClassName="pt-0">
            {loading ? <div className="pt-5"><Loader rows={6} /></div> : <ColumnTable datasetId={datasetId} statistics={stats} />}
          </Card>

          <Card title="Completeness by column" subtitle="Share of non-missing values">
            {loading ? <Loader rows={6} /> : (
              <div className="grid gap-4 sm:grid-cols-2">
                {Object.entries(stats).map(([name, stat]) => {
                  const completeness = analytics.data ? ((analytics.data.rowCount - stat.missingCount) / analytics.data.rowCount) * 100 : 0;
                  return (
                    <div key={name} className="rounded-xl border border-slate-200 p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-semibold text-ink-900">{name}</span>
                        <Badge variant={stat.qualityScore >= 60 ? "success" : "danger"}>
                          {stat.qualityScore >= 60 ? <FiCheckCircle size={12} /> : <FiActivity size={12} />}
                          {formatPercent(stat.qualityScore)}
                        </Badge>
                      </div>
                      <ProgressBar value={completeness} label="Completeness" />
                      <p className="mt-2 text-xs text-slate-500">
                        {formatNumber(stat.missingCount)} missing · {formatNumber(stat.invalidCount)} invalid
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      )}
    </>
  );
}
