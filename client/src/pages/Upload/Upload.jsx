import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiRefreshCw, FiUploadCloud } from "react-icons/fi";
import { getJobStatus, uploadDataset } from "../../api/client";
import PageHeader from "../../utils/PageHeader";
import Card from "../../utils/Card";
import Badge, { STATUS_VARIANT } from "../../utils/Badge";
import Spinner from "../../utils/Spinner";
import ProgressBar from "../../utils/ProgressBar";
import ErrorState from "../../utils/ErrorState";
import EmptyState from "../../utils/EmptyState";
import { formatNumber } from "../../utils/format";
import Dropzone from "./components/Dropzone";
import JobTimeline from "./components/JobTimeline";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");
  const [polling, setPolling] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const pollJob = useCallback(async (jobId) => {
    setPolling(true);
    try {
      const status = await getJobStatus(jobId);
      setJob(status);
      if (status.status !== "COMPLETED" && status.status !== "FAILED") {
        timerRef.current = setTimeout(() => pollJob(jobId), 3000);
      } else {
        setPolling(false);
      }
    } catch (err) {
      setError(err.message || "Unable to fetch job status");
      setPolling(false);
    }
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError("");
    setJob(null);
    setProgress(8);

    const tick = setInterval(() => setProgress((value) => Math.min(value + 11, 92)), 140);
    try {
      const data = await uploadDataset(file);
      setResult(data);
      setProgress(100);
      pollJob(data.jobId);
    } catch (err) {
      setError(err.message || "Upload failed");
      setProgress(0);
    } finally {
      clearInterval(tick);
      setUploading(false);
    }
  };

  const reset = () => {
    clearTimeout(timerRef.current);
    setFile(null);
    setResult(null);
    setJob(null);
    setProgress(0);
    setError("");
    setPolling(false);
  };

  return (
    <>
      <PageHeader
        title="Upload dataset"
        description="Upload a CSV file — InsightFlow profiles every column and scores data quality."
        actions={result && <button type="button" className="btn-ghost" onClick={reset}><FiRefreshCw size={15} /> New upload</button>}
      />

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3" title="CSV file" subtitle="POST /api/v1/datasets — multipart form-data, Bearer authenticated">
          <Dropzone file={file} onFileSelect={setFile} disabled={uploading} />

          {(uploading || progress > 0) && (
            <div className="mt-5">
              <ProgressBar value={progress} label="Upload progress" />
            </div>
          )}

          {error && <div className="mt-5"><ErrorState message={error} onRetry={handleUpload} /></div>}

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button type="button" className="btn-primary" onClick={handleUpload} disabled={!file || uploading}>
              {uploading ? <Spinner /> : <FiUploadCloud size={16} />}
              {uploading ? "Uploading…" : "Upload & analyse"}
            </button>
            <p className="text-xs text-slate-500">Your file is streamed securely and never shared.</p>
          </div>
        </Card>

        <Card className="lg:col-span-2" title="Processing status" subtitle="GET /api/v1/datasets/jobs/:jobId">
          {!result ? (
            <EmptyState title="No upload yet" description="Pick a CSV file and start the analysis to see live job progress here." />
          ) : (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 px-3 py-2.5">
                  <p className="label">Rows</p>
                  <p className="text-lg font-bold text-ink-900">{formatNumber(result.totalRows)}</p>
                </div>
                <div className="rounded-xl bg-slate-50 px-3 py-2.5">
                  <p className="label">Columns</p>
                  <p className="text-lg font-bold text-ink-900">{formatNumber(result.totalColumns)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5">
                <div className="min-w-0">
                  <p className="label">File</p>
                  <p className="truncate text-sm font-semibold text-ink-900">{result.filename}</p>
                </div>
                <Badge variant={STATUS_VARIANT[job?.status || result.status] || "neutral"}>
                  {polling && <Spinner className="h-3 w-3" />} {job?.status || result.status}
                </Badge>
              </div>

              <JobTimeline status={job?.status || result.status} job={job} />

              <dl className="space-y-1.5 rounded-xl bg-slate-50 px-3 py-3 text-xs">
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">Dataset ID</dt>
                  <dd className="truncate font-mono text-[11px] text-slate-700">{result.datasetId}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">Job ID</dt>
                  <dd className="truncate font-mono text-[11px] text-slate-700">{result.jobId}</dd>
                </div>
                {job?.retryCount != null && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-500">Retries</dt>
                    <dd className="font-semibold text-slate-700">{job.retryCount}</dd>
                  </div>
                )}
              </dl>

              {job?.status === "COMPLETED" && (
                <Link to={`/datasets/${result.datasetId}`} className="btn-primary w-full">
                  View analytics <FiArrowRight size={16} />
                </Link>
              )}
              {job?.status === "FAILED" && <ErrorState message={job.errorMessage || "Processing failed."} />}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
