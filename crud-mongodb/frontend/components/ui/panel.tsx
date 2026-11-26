import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <section className={cn("flex flex-col gap-3.5 rounded-xl border border-slate-200 bg-white p-4.5 shadow-sm", className)}>
      {children}
    </section>
  );
}

export function PanelTitle({ children }: { children: ReactNode }) {
  return <h2 className="flex items-center gap-2 text-[15px] font-bold">{children}</h2>;
}

export function Hint({ children }: { children: ReactNode }) {
  return <p className="text-xs text-slate-500">{children}</p>;
}
