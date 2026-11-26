"use client";

import { toastStore } from "@/lib/toast";
import { cn } from "@/lib/utils";

const styles = {
  info: "bg-slate-900",
  success: "bg-green-600",
  error: "bg-red-600",
};

/** Render once in the root layout. Call toast.success/error() anywhere. */
export function Toaster() {
  const toasts = toastStore.useStore();

  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={cn("max-w-[90vw] whitespace-pre-line rounded-lg px-4 py-2.5 text-sm text-white shadow-lg", styles[t.type])}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
