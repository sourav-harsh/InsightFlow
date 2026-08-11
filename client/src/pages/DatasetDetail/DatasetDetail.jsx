import { Link, useParams } from "react-router-dom";
import { FiAlertOctagon, FiArrowLeft, FiColumns, FiDatabase, FiLayers } from "react-icons/fi";
import { getDatasetAnalytics, getDatasetSummary } from "../../api/client";
import useApiResource from "../../utils/useApiResource";
import PageHeader from "../../utils/PageHeader";
import Card from "../../utils/Card";
import StatCard from "../../utils/StatCard";
import Loader from "../../utils/Loader";
import ErrorState from "../../utils/ErrorState";
import { formatDateTime, formatNumber } from "../../utils/format";
import QualityGauge from "../Dashboard/components/QualityGauge";
import ColumnTable from "../Dashboard/components/ColumnTable";
import MissingInvalidChart from "../Dashboard/components/MissingInvalidChart";
import TypeDistributionChart from "../Dashboard/components/TypeDistributionChart";
import SummaryPanel from "./components/SummaryPanel";
import IssueRadar from "./components/IssueRadar";

export default function DatasetDetail() {
  const { datasetId } = useParams();
  const analytics = useApiResource(() => getDatasetAnalytics(datasetId), [datasetId]);
  const summary = useApiResource(() => getDatasetSummary(datasetId), [datasetId]);

  const loading = analytics.loading || summary.loading;
  const error = analytics.error || summary.error;
  const stats = analytics.data?.statistics || {};

  return (
    <>
      <PageHeader
        breadcrumb={
          <Link to="/datasets" className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600">
            <FiArrowLeft size={13} /> Back to datasets
          </Link>
        }
        title="Dataset analytics"
        description={`Dataset ${datasetId} · profiled ${formatDateTime(analytics.data?.createdAt)}`}
      />

      {error && <ErrorState message={error} onRetry={() => { analytics.refetch(); summary.refetch(); }} />}

      {!error && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={FiDatabase} label="Rows" value={formatNumber(analytics.data?.rowCount)} />
            <StatCard icon={FiColumns} label="Columns" value={formatNumber(analytics.data?.columnCount)} tone="violet" />
            <StatCard icon={FiLayers} label="Missing values" value={formatNumber(analytics.data?.missingValueCount)} tone="amber" />
            <StatCard icon={FiAlertOctagon} label="Invalid values" value={formatNumber(analytics.data?.invalidValueCount)} tone="rose" />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card title="Quality score">
              {loading ? <Loader rows={4} /> : <QualityGauge score={analytics.data?.qualityScore ?? 0} />}
            </Card>
            <Card title="Summary" subtitle="GET /analytics/datasets/:id/summary">
              {loading ? <Loader rows={6} /> : <SummaryPanel summary={summary.data} analytics={analytics.data} />}
            </Card>
            <Card title="Column health radar">
              {loading ? <Loader rows={6} /> : <IssueRadar statistics={stats} />}
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card title="Type distribution">
              {loading ? <Loader rows={5} /> : <TypeDistributionChart distribution={summary.data?.columnTypeDistribution || {}} />}
            </Card>
            <Card className="lg:col-span-2" title="Missing vs invalid values">
              {loading ? <Loader rows={6} /> : <MissingInvalidChart statistics={stats} />}
            </Card>
          </div>

          <Card title="Columns" subtitle="Open a column for its full profile" bodyClassName="pt-0">
            {loading ? <div className="pt-5"><Loader rows={6} /></div> : <ColumnTable datasetId={datasetId} statistics={stats} />}
          </Card>
        </div>
      )}
    </>
  );
}
