import cn from "./cn";

export default function Spinner({ className }) {
  return (
    <span
      className={cn("inline-block animate-spin rounded-full border-2 border-current border-r-transparent", className || "h-4 w-4")}
      role="status"
      aria-label="Loading"
    />
  );
}
