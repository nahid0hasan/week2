import { z } from "zod";
import { env } from "@/config/env";
import { logRequest } from "./request-log";

/**
 * The ONE place that talks to the backend.
 * Features call apiRequest(); components never call fetch() directly.
 */

export class ApiError extends Error {
  constructor(
    message: string,
    /** HTTP status, or 0 when the server could not be reached */
    public status: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type Method = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export async function apiRequest(method: Method, path: string, body?: unknown): Promise<unknown> {
  const started = performance.now();
  let res: Response;

  try {
    res = await fetch(env.apiUrl + path, {
      method,
      headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    // fetch() itself failed: server is down, wrong URL, or CORS blocked it
    logRequest({ method, path, status: 0, ms: performance.now() - started, requestBody: body, responseBody: String(err) });
    throw new ApiError(`Can't reach ${env.apiUrl}. Is the server running? Is CORS enabled?`, 0);
  }

  const text = await res.text();
  let payload: unknown = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = text; // backend sent plain text / HTML instead of JSON
  }

  logRequest({ method, path, status: res.status, ms: performance.now() - started, requestBody: body, responseBody: payload });

  const envelope = (payload && typeof payload === "object" ? payload : {}) as {
    success?: boolean;
    data?: unknown;
    error?: string;
    message?: string;
  };

  if (!res.ok || envelope.success === false) {
    throw new ApiError(envelope.error || envelope.message || `Request failed with status ${res.status}`, res.status);
  }

  // Unwrap { success, data } if present, otherwise return the raw payload
  return "data" in envelope ? envelope.data : payload;
}

/** Validate a response with zod so a wrong backend shape shows a clear error. */
export function parseResponse<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error("Unexpected API response:", data, result.error);
    throw new ApiError(`Unexpected response shape from server:\n${z.prettifyError(result.error)}`, 200);
  }
  return result.data;
}
