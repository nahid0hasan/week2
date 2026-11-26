"use client";

import { useState, type FormEvent } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { toDateInput } from "@/lib/utils";
import {
  PRIORITY_LABEL,
  STATUS_LABEL,
  TASK_PRIORITIES,
  TASK_STATUSES,
  taskInputSchema,
  type Task,
  type TaskInput,
} from "../schema";

type FormValues = Omit<TaskInput, "dueDate"> & { dueDate: string };
type FieldErrors = Partial<Record<keyof TaskInput, string>>;

const EMPTY: FormValues = { title: "", description: "", status: "todo", priority: "medium", dueDate: "" };

function fromTask(task?: Task): FormValues {
  if (!task) return EMPTY;
  return {
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: toDateInput(task.dueDate),
  };
}

type TaskFormProps = {
  /** Pass a task to pre-fill the form (edit mode) */
  task?: Task;
  submitLabel: string;
  isPending?: boolean;
  /** Resolve = success (form resets in create mode). Reject = keep values. */
  onSubmit: (input: TaskInput) => Promise<unknown>;
  onCancel?: () => void;
};

/** One form used for BOTH create and edit. */
export function TaskForm({ task, submitLabel, isPending, onSubmit, onCancel }: TaskFormProps) {
  const [values, setValues] = useState<FormValues>(() => fromTask(task));
  const [errors, setErrors] = useState<FieldErrors>({});

  const set = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Client-side validation (the backend must validate too!)
    const result = taskInputSchema.safeParse({ ...values, dueDate: values.dueDate || null });
    if (!result.success) {
      const fieldErrors = z.flattenError(result.error).fieldErrors;
      setErrors(Object.fromEntries(Object.entries(fieldErrors).map(([k, v]) => [k, v?.[0]])));
      return;
    }

    try {
      await onSubmit(result.data);
      if (!task) setValues(EMPTY); // reset only in create mode
    } catch {
      // error toast is shown by the mutation hook; keep what the user typed
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3" autoComplete="off" noValidate>
      <Field label="Title *" error={errors.title}>
        <Input
          value={values.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="e.g. Learn Mongoose schemas"
          aria-invalid={!!errors.title}
        />
      </Field>

      <Field label="Description" error={errors.description}>
        <Textarea
          rows={3}
          value={values.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Optional details…"
        />
      </Field>

      <div className="grid grid-cols-2 gap-2.5">
        <Field label="Priority">
          <Select value={values.priority} onChange={(e) => set("priority", e.target.value as FormValues["priority"])}>
            {TASK_PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {PRIORITY_LABEL[p]}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Status">
          <Select value={values.status} onChange={(e) => set("status", e.target.value as FormValues["status"])}>
            {TASK_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="Due date">
        <Input type="date" value={values.dueDate} onChange={(e) => set("dueDate", e.target.value)} />
      </Field>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isPending} className={onCancel ? "" : "w-full"}>
          {isPending ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
