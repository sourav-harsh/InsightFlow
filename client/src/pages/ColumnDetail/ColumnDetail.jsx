import { Link, useParams } from "react-router-dom";
import { FiAlertOctagon, FiArrowLeft, FiHash, FiLayers, FiTrendingUp } from "react-icons/fi";
import { getColumnAnalytics, getDatasetAnalytics } from "../../api/client";
import useApiResource from "../../utils/useApiResource";
import PageHeader from "../../utils/PageHeader";
import Card from "../../utils/Card";
import StatCard from "../../utils/StatCard";
import Badge from "../../utils/Badge";
import Loader from "../../utils/Loader";
import ErrorState from "../../utils/ErrorState";
import ProgressBar from "../../utils/ProgressBar";
import QualityGauge from "../Dashboard/components/QualityGauge";
import { formatDecimal, formatNumber } from "../../utils/format";
import ValueBreakdownChart from "./components/ValueBreakdownChart";
import RangeChart from "./components/RangeChart";

export default function ColumnDetail() {
  const { datasetId, columnName } = useParams();
  const decodedName = decodeURIComponent(columnName || "");

  const column = useApiResource(() => getColumnAnalytics(datasetId, decodedName), [datasetId, decodedName]);
  const dataset = useApiResource(() => getDatasetAnalytics(datasetId), [datasetId]);

  const loading = column.loading || dataset.loading;
  const error = column.error || dataset.error;
  const rowCount = dataset.data?.rowCount || 0;
  const data = column.data;
  const validCount = data ? rowCount - data.missingCount - data.invalidCount : 0;
  const isNumeric = data && typeof data.average === "number";

  return (
    <>
      <PageHeader
        breadcrumb={
          <Link to={`/datasets/${datasetId}`} className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600">
            <FiArrowLeft size={13} /> Back to dataset
          </Link>
        }
        title={decodedName}
        description="Column-level profile, issue breakdown and value range."
        actions={data && <Badge variant="info">{data.type}</Badge>}
      />

      {error && <ErrorState message={error} onRetry={() => { column.refetch(); dataset.refetch(); }} />}

      {!error && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={FiHash} label="Total rows" value={formatNumber(rowCount)} />
            <StatCard icon={FiLayers} label="Missing" value={formatNumber(data?.missingCount)} tone="amber" hint={rowCount ? `${(((data?.missingCount || 0) / rowCount) * 100).toFixed(2)}% of rows` : undefined} />
            <StatCard icon={FiAlertOctagon} label="Invalid" value={formatNumber(data?.invalidCount)} tone="rose" hint={rowCount ? `${(((data?.invalidCount || 0) / rowCount) * 100).toFixed(2)}% of rows` : undefined} />
            <StatCard icon={FiTrendingUp} label="Valid values" value={formatNumber(validCount)} tone="emerald" />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card title="Column quality score">
              {loading ? <Loader rows={4} /> : <QualityGauge score={data?.qualityScore ?? 0} />}
            </Card>

            <Card title="Value breakdown" subtitle="Valid vs missing vs invalid">
              {loading ? <Loader rows={5} /> : (
                <ValueBreakdownChart valid={validCount} missing={data?.missingCount ?? 0} invalid={data?.invalidCount ?? 0} />
              )}
            </Card>

            <Card title="Health indicators">
              {loading ? <Loader rows={5} /> : (
                <div className="space-y-5">
                  <ProgressBar value={rowCount ? ((rowCount - (data?.missingCount || 0)) / rowCount) * 100 : 0} label="Completeness" tone="emerald" />
                  <ProgressBar value={rowCount ? ((rowCount - (data?.invalidCount || 0)) / rowCount) * 100 : 0} label="Validity" tone="amber" />
                  <ProgressBar value={data?.qualityScore ?? 0} label="Quality score" />
                  <div className="rounded-xl bg-slate-50 px-3 py-3 text-xs text-slate-600">
                    {data && data.qualityScore < 60
                      ? "This column is problematic — review formatting rules and source validation before using it downstream."
                      : "This column is healthy and safe to use in downstream reporting."}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {isNumeric && (
            <div className="grid gap-4 lg:grid-cols-3">
              <Card className="lg:col-span-2" title="Value range" subtitle="Minimum, average and maximum">
                <RangeChart min={data.min} max={data.max} average={data.average} />
              </Card>
              <Card title="Numeric statistics">
                <dl className="space-y-3 text-sm">
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5">
                    <dt className="label">Minimum</dt>
                    <dd className="font-bold text-ink-900">{formatDecimal(data.min)}</dd>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5">
                    <dt className="label">Average</dt>
                    <dd className="font-bold text-ink-900">{formatDecimal(data.average)}</dd>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5">
                    <dt className="label">Maximum</dt>
                    <dd className="font-bold text-ink-900">{formatDecimal(data.max)}</dd>
                  </div>
                </dl>
              </Card>
            </div>
          )}
        </div>
      )}
    </>
  );
}
