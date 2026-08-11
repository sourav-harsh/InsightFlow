import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";

export default function ErrorState({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-rose-200 bg-rose-50/60 px-6 py-8 text-center">
      <FiAlertTriangle className="text-rose-500" size={26} />
      <p className="text-sm font-medium text-rose-700">{message}</p>
      {onRetry && (
        <button type="button" className="btn-ghost" onClick={onRetry}>
          <FiRefreshCw size={15} /> Try again
        </button>
      )}
    </div>
  );
}
