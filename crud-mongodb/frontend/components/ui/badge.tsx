import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Rounded pill for metadata (status, priority, dates). */
export function Pill({ className, children, title }: { className?: string; children: ReactNode; title?: string }) {
  return (
    <span title={title} className={cn("rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500", className)}>
      {children}
    </span>
  );
}

const methodColors: Record<string, string> = {
  GET: "bg-blue-100 text-blue-700",
  POST: "bg-green-100 text-green-700",
  PATCH: "bg-amber-100 text-amber-700",
  PUT: "bg-amber-100 text-amber-700",
  DELETE: "bg-red-100 text-red-700",
};

/** Small monospace HTTP method tag: GET / POST / PATCH / DELETE */
export function MethodTag({ method }: { method: string }) {
  return (
    <span
      className={cn(
        "rounded px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-wide",
        methodColors[method] ?? "bg-slate-100 text-slate-600"
      )}
    >
      {method}
    </span>
  );
}
