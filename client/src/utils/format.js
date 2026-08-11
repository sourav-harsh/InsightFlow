export const formatNumber = (value) =>
  typeof value === "number" && Number.isFinite(value)
    ? new Intl.NumberFormat("en-US").format(value)
    : "—";

export const formatDecimal = (value, digits = 2) =>
  typeof value === "number" && Number.isFinite(value)
    ? new Intl.NumberFormat("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value)
    : "—";

export const formatPercent = (value, digits = 2) =>
  typeof value === "number" && Number.isFinite(value) ? `${value.toFixed(digits)}%` : "—";

export const formatDateTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-US", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
};

export const formatBytes = (bytes) => {
  if (!bytes && bytes !== 0) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unit = 0;
  while (size >= 1024 && unit < units.length - 1) { size /= 1024; unit += 1; }
  return `${size.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`;
};

export const qualityTone = (score) => {
  if (typeof score !== "number") return "slate";
  if (score >= 85) return "emerald";
  if (score >= 60) return "amber";
  return "rose";
};

export const TONE_CLASSES = {
  emerald: { text: "text-emerald-600", bg: "bg-emerald-500", soft: "bg-emerald-50 text-emerald-700", hex: "#059669" },
  amber: { text: "text-amber-600", bg: "bg-amber-500", soft: "bg-amber-50 text-amber-700", hex: "#d97706" },
  rose: { text: "text-rose-600", bg: "bg-rose-500", soft: "bg-rose-50 text-rose-700", hex: "#e11d48" },
  slate: { text: "text-slate-600", bg: "bg-slate-400", soft: "bg-slate-100 text-slate-700", hex: "#64748b" },
};

export const TYPE_COLORS = {
  STRING: "#2f83fb",
  EMAIL: "#8b5cf6",
  DATE: "#06b6d4",
  DECIMAL: "#10b981",
  PHONE: "#f59e0b",
  INTEGER: "#ec4899",
};
