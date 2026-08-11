import { useRef, useState } from "react";
import { FiFile, FiUploadCloud, FiX } from "react-icons/fi";
import cn from "../../../utils/cn";
import { formatBytes } from "../../../utils/format";

export default function Dropzone({ file, onFileSelect, disabled }) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const handleFiles = (files) => {
    const selected = files?.[0];
    if (!selected) return;
    if (!selected.name.toLowerCase().endsWith(".csv")) {
      setError("Only .csv files are supported.");
      return;
    }
    setError("");
    onFileSelect(selected);
  };

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(event) => {
          if (!disabled && (event.key === "Enter" || event.key === " ")) inputRef.current?.click();
        }}
        onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (!disabled) handleFiles(event.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition",
          dragging ? "border-brand-400 bg-brand-50" : "border-slate-300 bg-slate-50/60 hover:border-brand-300 hover:bg-brand-50/40",
          disabled && "pointer-events-none opacity-60"
        )}
      >
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-600 text-white">
          <FiUploadCloud size={24} />
        </span>
        <p className="mt-4 text-sm font-semibold text-ink-900">Drag & drop your CSV file here</p>
        <p className="mt-1 text-xs text-slate-500">or click to browse — CSV only, up to 200 MB</p>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(event) => handleFiles(event.target.files)}
        />
      </div>

      {error && <p className="mt-2 text-xs font-medium text-rose-600">{error}</p>}

      {file && (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
            <FiFile size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink-900">{file.name}</p>
            <p className="text-xs text-slate-500">{formatBytes(file.size)}</p>
          </div>
          <button type="button" onClick={() => onFileSelect(null)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600" aria-label="Remove file">
            <FiX size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
