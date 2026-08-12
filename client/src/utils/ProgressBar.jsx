import cn from "./cn";
import { TONE_CLASSES, qualityTone } from "./format";

export default function ProgressBar({ value = 0, tone, showLabel = true, size = "md", label }) {
  const safe = Math.max(0, Math.min(100, Number(value) || 0));
  const t = TONE_CLASSES[tone || qualityTone(safe)];
  const height = size === "sm" ? "h-1.5" : size === "lg" ? "h-3" : "h-2";

  return (
    <div>
      {(label || showLabel) && (
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="font-medium text-slate-600">{label}</span>
          {showLabel && <span className={cn("font-semibold", t.text)}>{safe.toFixed(2)}%</span>}
        </div>
      )}
      <div className={cn("w-full overflow-hidden rounded-full bg-slate-100", height)}>
        <div className={cn("h-full rounded-full transition-all duration-700", t.bg)} style={{ width: `${safe}%` }} />
      </div>
    </div>
  );
}
