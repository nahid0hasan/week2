"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { tasksApi } from "../api/tasks.api";
import { taskKeys } from "../api/task-keys";
import type { TaskFilters } from "../schema";

/** GET /api/tasks?... */
export function useTasks(filters: TaskFilters) {
  return useQuery({
    queryKey: taskKeys.list(filters),
    queryFn: () => tasksApi.list(filters),
    // keep showing the old list while the new filter loads (no flicker)
    placeholderData: keepPreviousData,
  });
}

/** GET /api/tasks/:id (only runs when id is set) */
export function useTask(id: string | null) {
  return useQuery({
    queryKey: taskKeys.detail(id ?? ""),
    queryFn: () => tasksApi.get(id!),
    enabled: !!id,
    staleTime: 0, // always fetch fresh data before editing
  });
}
