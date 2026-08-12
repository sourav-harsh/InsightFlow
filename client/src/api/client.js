import {
  mockAnalytics,
  mockAuth,
  mockColumn,
  mockDatasets,
  mockJob,
  mockSummary,
  mockUpload,
} from "./mockData";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const USE_MOCK = String(import.meta.env.VITE_USE_MOCK ?? "true") === "true";

/** True when the app serves bundled mock responses instead of the live API. */
export const IS_MOCK = USE_MOCK;

const AUTH_STORAGE_KEY = "insightflow.auth";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* ------------------------------------------------------------------ */
/* Auth session storage                                                */
/* ------------------------------------------------------------------ */

/** Read the persisted session ({ token, user }) from localStorage. */
export function getStoredAuth() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveAuth(session) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function clearAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

/** Access token attached to every protected API call. */
export function getToken() {
  return getStoredAuth()?.token || null;
}

/* ------------------------------------------------------------------ */
/* HTTP helper                                                         */
/* ------------------------------------------------------------------ */

async function request(path, { method = "GET", body, headers = {}, auth = true } = {}) {
  const token = getToken();
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body,
  });

  if (response.status === 401 && auth) {
    // Token expired or invalid — drop the session and bounce to login.
    clearAuth();
    window.location.assign("/login");
    throw new Error("Session expired. Please sign in again.");
  }

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.error?.message || payload?.error || `Request failed (${response.status})`);
  }
  if (payload?.error) throw new Error(String(payload.error));
  return payload?.data;
}

/** Normalize login/register payloads: accepts accessToken | token | access_token. */
function normalizeAuthPayload(data, fallbackEmail) {
  const token = data?.accessToken || data?.token || data?.access_token;
  if (!token) throw new Error("Authentication failed: no access token in response.");
  const user = data?.user || {
    name: fallbackEmail.split("@")[0],
    email: fallbackEmail,
    role: "Data Analyst",
  };
  return { token, user };
}

/* ------------------------------------------------------------------ */
/* Auth endpoints (public)                                             */
/* ------------------------------------------------------------------ */

/** POST /api/v1/auth/login — returns { token, user }. */
export async function loginUser({ email, password }) {
  if (USE_MOCK) {
    await delay(800);
    if (password.length < 6) throw new Error("Invalid email or password.");
    return normalizeAuthPayload(mockAuth.login(email).data, email);
  }
  const data = await request("/api/v1/auth/login", {
    method: "POST",
    auth: false,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return normalizeAuthPayload(data, email);
}

/** POST /api/v1/auth/register — returns { token, user } (auto sign-in). */
export async function registerUser({ name, email, password }) {
  if (USE_MOCK) {
    await delay(900);
    return normalizeAuthPayload(mockAuth.register(name, email).data, email);
  }
  const data = await request("/api/v1/auth/register", {
    method: "POST",
    auth: false,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return normalizeAuthPayload(data, email);
}

/* ------------------------------------------------------------------ */
/* Dataset & analytics endpoints (JWT protected)                       */
/* ------------------------------------------------------------------ */

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
