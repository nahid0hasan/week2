"use client";

import { env } from "@/config/env";
import { requestLogStore } from "@/lib/request-log";
import { cn } from "@/lib/utils";

/** Green/red dot based on the most recent request. */
export function ConnectionStatus() {
  const [latest] = requestLogStore.useStore();
  const state = !latest ? "unknown" : latest.status === 0 ? "down" : "ok";

  const dot = {
    unknown: "bg-slate-400",
    ok: "bg-green-600 ring-3 ring-green-600/20",
    down: "bg-red-600 ring-3 ring-red-600/20",
  }[state];

  const label = { unknown: "Connecting…", ok: "Backend reachable", down: "Backend unreachable" }[state];

  return (
    <div className="flex items-center gap-2 text-sm" title={label}>
      <span className={cn("size-2.5 rounded-full", dot)} />
      <span className="font-semibold text-slate-500">API</span>
      <code className="rounded-md border border-slate-200 px-2 py-1 font-mono text-xs">{env.apiUrl}</code>
    </div>
  );
}
