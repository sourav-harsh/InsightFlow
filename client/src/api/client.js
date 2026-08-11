import {
  mockAnalytics,
  mockColumn,
  mockDatasets,
  mockJob,
  mockSummary,
  mockUpload,
} from "./mockData";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
// Hard-coded bearer token for now (replace with a real auth flow later).
export const AUTH_TOKEN =
  import.meta.env.VITE_API_TOKEN ||
  "eyJhbGciOiJIUzI1NiJ9.hardcoded-dev-token";

const USE_MOCK = String(import.meta.env.VITE_USE_MOCK ?? "true") === "true";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function request(path, { method = "GET", body, headers = {} } = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { Authorization: `Bearer ${AUTH_TOKEN}`, ...headers },
    body,
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.error?.message || payload?.error || `Request failed (${response.status})`);
  }
  if (payload?.error) throw new Error(String(payload.error));
  return payload?.data;
}

/** POST /api/v1/datasets — multipart CSV upload. */
export async function uploadDataset(file) {
  if (USE_MOCK) {
    await delay(900);
    return { ...mockUpload.data, filename: file?.name || mockUpload.data.filename };
  }
  const formData = new FormData();
  formData.append("file", file);
  return request("/api/v1/datasets", { method: "POST", body: formData });
}

/** GET /api/v1/datasets/jobs/:jobId */
export async function getJobStatus(jobId) {
  if (USE_MOCK) {
    await delay(700);
    return { ...mockJob.data, jobId };
  }
  return request(`/api/v1/datasets/jobs/${jobId}`);
}

/** GET /api/v1/analytics/datasets/:datasetId */
export async function getDatasetAnalytics(datasetId) {
  if (USE_MOCK) {
    await delay(500);
    return { ...mockAnalytics.data, datasetId };
  }
  return request(`/api/v1/analytics/datasets/${datasetId}`);
}

/** GET /api/v1/analytics/datasets/:datasetId/summary */
export async function getDatasetSummary(datasetId) {
  if (USE_MOCK) {
    await delay(400);
    return { ...mockSummary.data, datasetId };
  }
  return request(`/api/v1/analytics/datasets/${datasetId}/summary`);
}

/** GET /api/v1/analytics/datasets/:datasetId/columns/:columnName */
export async function getColumnAnalytics(datasetId, columnName) {
  if (USE_MOCK) {
    await delay(400);
    return mockColumn(columnName).data;
  }
  return request(`/api/v1/analytics/datasets/${datasetId}/columns/${encodeURIComponent(columnName)}`);
}

/** Local dataset registry (no list endpoint available yet). */
export async function listDatasets() {
  await delay(250);
  return mockDatasets;
}
