import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiUploadCloud } from "react-icons/fi";
import { listDatasets } from "../../api/client";
import useApiResource from "../../utils/useApiResource";
import PageHeader from "../../utils/PageHeader";
import Loader from "../../utils/Loader";
import ErrorState from "../../utils/ErrorState";
import EmptyState from "../../utils/EmptyState";
import DatasetCard from "./components/DatasetCard";

export default function Datasets() {
  const { data, loading, error, refetch } = useApiResource(() => listDatasets(), []);
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () => (data || []).filter((dataset) => dataset.fileName.toLowerCase().includes(query.trim().toLowerCase())),
    [data, query]
  );

  return (
    <>
      <PageHeader
        title="Datasets"
        description="Every CSV you have ingested, with its processing status and quality score."
        actions={
          <>
            <div className="relative">
              <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Filter by filename"
                aria-label="Filter datasets"
                className="rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <Link to="/upload" className="btn-primary"><FiUploadCloud size={16} /> Upload CSV</Link>
          </>
        }
      />

      {loading && <div className="card card-pad"><Loader rows={5} /></div>}
      {error && <ErrorState message={error} onRetry={refetch} />}

      {!loading && !error && (filtered.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((dataset) => <DatasetCard key={dataset.datasetId} dataset={dataset} />)}
        </div>
      ) : (
        <EmptyState
          title="No datasets found"
          description="Try a different search term, or upload a new CSV file to get started."
          action={<Link to="/upload" className="btn-primary mt-2"><FiUploadCloud size={16} /> Upload CSV</Link>}
        />
      ))}
    </>
  );
}
