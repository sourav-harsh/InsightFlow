export default function Loader({ label = "Loading data…", rows = 3 }) {
  return (
    <div className="space-y-3" aria-busy="true" aria-label={label}>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="h-4 w-full animate-pulse rounded-full bg-slate-100" style={{ width: `${100 - index * 12}%` }} />
      ))}
    </div>
  );
}
