import type { TaskFilters } from "../schema";

/**
 * Query key factory. Every cache key for tasks comes from here,
 * so invalidating `taskKeys.all` refreshes every task query at once.
 */
export const taskKeys = {
  all: ["tasks"] as const,
  lists: () => [...taskKeys.all, "list"] as const,
  list: (filters: TaskFilters) => [...taskKeys.lists(), filters] as const,
  details: () => [...taskKeys.all, "detail"] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
};
