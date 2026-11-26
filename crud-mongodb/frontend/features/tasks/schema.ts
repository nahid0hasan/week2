import { z } from "zod";

// Single source of truth: TypeScript types are inferred from these schemas.

export const TASK_STATUSES = ["todo", "in-progress", "done"] as const;
export const TASK_PRIORITIES = ["low", "medium", "high"] as const;

export const taskStatusSchema = z.enum(TASK_STATUSES);
export const taskPrioritySchema = z.enum(TASK_PRIORITIES);

/** Shape of a task document coming FROM the backend (MongoDB). */
export const taskSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string().nullish().transform((v) => v ?? ""),
  status: taskStatusSchema.default("todo"),
  priority: taskPrioritySchema.default("medium"),
  dueDate: z.string().nullish(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const taskListSchema = z.array(taskSchema);

/** Shape we SEND to the backend when creating / updating. */
export const taskInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120, "Max 120 characters"),
  description: z.string().trim().max(1000, "Max 1000 characters"),
  status: taskStatusSchema,
  priority: taskPrioritySchema,
  dueDate: z.string().nullable(),
});

export type Task = z.infer<typeof taskSchema>;
export type TaskInput = z.infer<typeof taskInputSchema>;
export type TaskStatus = z.infer<typeof taskStatusSchema>;
export type TaskPriority = z.infer<typeof taskPrioritySchema>;

export type TaskSort = "" | "dueDate" | "priority";

export type TaskFilters = {
  status: TaskStatus | "";
  priority: TaskPriority | "";
  search: string;
  sort: TaskSort;
};

export const STATUS_LABEL: Record<TaskStatus, string> = {
  todo: "To do",
  "in-progress": "In progress",
  done: "Done",
};

export const PRIORITY_LABEL: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};
