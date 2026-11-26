import { apiRequest, parseResponse } from "@/lib/api-client";
import { taskListSchema, taskSchema, type TaskFilters, type TaskInput } from "../schema";

// Endpoint layer: knows URLs + response shapes. Nothing about React.

const BASE = "/api/tasks";

/** Builds e.g. /api/tasks?status=done&search=mongo */
export function buildTasksPath(filters: TaskFilters) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value) params.set(key, value);
  }
  const qs = params.toString();
  return qs ? `${BASE}?${qs}` : BASE;
}

export const tasksApi = {
  list: async (filters: TaskFilters) => parseResponse(taskListSchema, await apiRequest("GET", buildTasksPath(filters))),

  get: async (id: string) => parseResponse(taskSchema, await apiRequest("GET", `${BASE}/${id}`)),

  create: async (input: TaskInput) => parseResponse(taskSchema, await apiRequest("POST", BASE, input)),

  update: async (id: string, changes: Partial<TaskInput>) =>
    parseResponse(taskSchema, await apiRequest("PATCH", `${BASE}/${id}`, changes)),

  remove: async (id: string) => {
    await apiRequest("DELETE", `${BASE}/${id}`);
  },
};
