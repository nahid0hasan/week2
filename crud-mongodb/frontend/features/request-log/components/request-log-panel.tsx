"use client";

import { MethodTag } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Hint, Panel, PanelTitle } from "@/components/ui/panel";
import { clearRequestLog, requestLogStore, type RequestLogEntry } from "@/lib/request-log";
import { cn } from "@/lib/utils";

function pretty(value: unknown) {
  return typeof value === "string" ? value : JSON.stringify(value, null, 2);
}

function LogItem({ entry }: { entry: RequestLogEntry }) {
  const ok = entry.status >= 200 && entry.status < 300;

  return (
    <li>
      <details className="rounded-md border border-slate-200 font-mono text-[11px]">
        <summary className="grid cursor-pointer list-none grid-cols-[52px_1fr_auto] items-center gap-1.5 px-2 py-1.5 [&::-webkit-details-marker]:hidden">
          <MethodTag method={entry.method} />
          <span className="truncate" title={entry.path}>
            {entry.path}
          </span>
          <span className={cn("font-bold", ok ? "text-green-600" : "text-red-600")}>
            {entry.status || "ERR"} · {Math.round(entry.ms)}ms
          </span>
        </summary>
        <pre className="max-h-56 overflow-auto border-t border-slate-200 bg-slate-50 p-2 break-all whitespace-pre-wrap">
          {entry.requestBody !== undefined && (
            <>
              <b className="text-slate-500">Request body</b>
              {"\n" + pretty(entry.requestBody) + "\n\n"}
            </>
          )}
          <b className="text-slate-500">Response</b>
          {"\n" + pretty(entry.responseBody)}
        </pre>
      </details>
    </li>
  );
}

/** Dev tool: every request the frontend sends to your API. */
export function RequestLogPanel() {
  const entries = requestLogStore.useStore();

  return (
    <Panel>
      <div className="flex items-center justify-between">
        <PanelTitle>Request log</PanelTitle>
        <Button variant="ghost" onClick={clearRequestLog}>
          Clear
        </Button>
      </div>
      <Hint>Every request the frontend sends to your API. Click one to see the body.</Hint>
      <ul className="flex max-h-[70vh] flex-col gap-1.5 overflow-y-auto">
        {entries.map((entry) => (
          <LogItem key={entry.id} entry={entry} />
        ))}
      </ul>
    </Panel>
  );
}
