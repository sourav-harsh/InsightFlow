import cn from "./cn";

const VARIANTS = {
  neutral: "bg-slate-100 text-slate-700",
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-rose-50 text-rose-700",
  info: "bg-brand-50 text-brand-700",
  violet: "bg-violet-50 text-violet-700",
};

export const STATUS_VARIANT = {
  UPLOADED: "info",
  PENDING: "neutral",
  PROCESSING: "warning",
  COMPLETED: "success",
  FAILED: "danger",
};

export default function Badge({ children, variant = "neutral", className }) {
  return <span className={cn("chip", VARIANTS[variant] || VARIANTS.neutral, className)}>{children}</span>;
}
