"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { tasksApi } from "../api/tasks.api";
import { taskKeys } from "../api/task-keys";
import type { Task, TaskInput, TaskStatus } from "../schema";

// After every write we invalidate taskKeys.all, so React Query
// refetches the list automatically. No manual "reload" needed.

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: TaskInput) => tasksApi.create(input),
    onSuccess: () => toast.success("Task created"),
    onError: (err) => toast.error(err.message),
    onSettled: () => qc.invalidateQueries({ queryKey: taskKeys.all }),
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, changes }: { id: string; changes: Partial<TaskInput> }) => tasksApi.update(id, changes),
    onSuccess: () => toast.success("Task updated"),
    onError: (err) => toast.error(err.message),
    onSettled: () => qc.invalidateQueries({ queryKey: taskKeys.all }),
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tasksApi.remove(id),
    onSuccess: () => toast.success("Task deleted"),
    onError: (err) => toast.error(err.message),
    onSettled: () => qc.invalidateQueries({ queryKey: taskKeys.all }),
  });
}

/**
 * Checkbox toggle with an OPTIMISTIC update: the UI changes instantly,
 * and rolls back if the server says no.
 */
export function useToggleTaskStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) => tasksApi.update(id, { status }),

    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: taskKeys.lists() });
      const previous = qc.getQueriesData<Task[]>({ queryKey: taskKeys.lists() });
      qc.setQueriesData<Task[]>({ queryKey: taskKeys.lists() }, (old) =>
        old?.map((t) => (t._id === id ? { ...t, status } : t))
      );
      return { previous };
    },

    onError: (err, _vars, ctx) => {
      ctx?.previous.forEach(([key, data]) => qc.setQueryData(key, data));
      toast.error(err.message);
    },

    onSettled: () => qc.invalidateQueries({ queryKey: taskKeys.all }),
  });
}
