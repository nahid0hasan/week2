import { createStore } from "./create-store";

export type RequestLogEntry = {
  id: number;
  method: string;
  path: string;
  /** HTTP status, or 0 when the request never reached the server */
  status: number;
  ms: number;
  requestBody?: unknown;
  responseBody?: unknown;
  at: number;
};

const MAX_ENTRIES = 50;
let nextId = 1;

export const requestLogStore = createStore<RequestLogEntry[]>([]);

export function logRequest(entry: Omit<RequestLogEntry, "id" | "at">) {
  requestLogStore.setState((prev) =>
    [{ ...entry, id: nextId++, at: Date.now() }, ...prev].slice(0, MAX_ENTRIES)
  );
}

export function clearRequestLog() {
  requestLogStore.setState(() => []);
}
