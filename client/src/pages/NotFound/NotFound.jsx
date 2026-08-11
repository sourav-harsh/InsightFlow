import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-6xl font-extrabold text-brand-600">404</p>
      <h1 className="mt-3 text-xl font-bold text-ink-900">Page not found</h1>
      <p className="mt-1 text-sm text-slate-500">The page you are looking for does not exist or has moved.</p>
      <Link to="/dashboard" className="btn-primary mt-6"><FiArrowLeft size={16} /> Back to dashboard</Link>
    </div>
  );
}
