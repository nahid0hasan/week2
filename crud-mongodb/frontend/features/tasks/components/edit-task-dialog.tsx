"use client";

import { MethodTag } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { PanelTitle } from "@/components/ui/panel";
import { useTask } from "../hooks/use-tasks";
import { useUpdateTask } from "../hooks/use-task-mutations";
import { TaskForm } from "./task-form";

/** Fetches the single task (GET /:id) then saves with PATCH. */
export function EditTaskDialog({ taskId, onClose }: { taskId: string | null; onClose: () => void }) {
  const { data: task, isPending, error } = useTask(taskId);
  const update = useUpdateTask();

  return (
    <Dialog open={!!taskId} onClose={onClose}>
      <div className="flex flex-col gap-3">
        <PanelTitle>
          Edit task <MethodTag method="PATCH" />
        </PanelTitle>

        {isPending && <div className="h-64 animate-pulse rounded-lg bg-slate-100" />}
        {error && <p className="text-sm text-red-600">{error.message}</p>}

        {task && (
          <TaskForm
            key={task._id}
            task={task}
            submitLabel="Save changes"
            isPending={update.isPending}
            onCancel={onClose}
            onSubmit={async (changes) => {
              await update.mutateAsync({ id: task._id, changes });
              onClose();
            }}
          />
        )}
      </div>
    </Dialog>
  );
}
