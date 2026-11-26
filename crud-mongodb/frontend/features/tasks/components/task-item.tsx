"use client";

import { Pill } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatDate } from "@/lib/utils";
import { PRIORITY_LABEL, STATUS_LABEL, type Task } from "../schema";

const priorityBorder = {
  high: "border-l-red-600",
  medium: "border-l-amber-600",
  low: "border-l-green-600",
};

const statusPill = {
  todo: "bg-slate-200 text-slate-700",
  "in-progress": "bg-blue-100 text-blue-700",
  done: "bg-green-100 text-green-700",
};

function isOverdue(task: Task) {
  if (!task.dueDate || task.status === "done") return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(task.dueDate) < today;
}

type Props = {
  task: Task;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
};

export function TaskItem({ task, onToggle, onEdit, onDelete }: Props) {
  const done = task.status === "done";
  const overdue = isOverdue(task);

  return (
    <li
      className={cn(
        "grid grid-cols-[auto_1fr_auto] items-start gap-3 rounded-lg border border-l-4 border-slate-200 px-3.5 py-3 transition-colors hover:bg-slate-50",
        priorityBorder[task.priority]
      )}
    >
      <input
        type="checkbox"
        checked={done}
        onChange={() => onToggle(task)}
        title="Mark done (PATCH)"
        className="mt-0.5 size-4.5 cursor-pointer accent-indigo-600"
      />

      <div className="min-w-0">
        <p className={cn("mb-0.5 font-semibold break-words", done && "text-slate-400 line-through")}>{task.title}</p>
        {task.description && <p className="mb-2 whitespace-pre-wrap break-words text-slate-500">{task.description}</p>}

        <div className="flex flex-wrap gap-1.5">
          <Pill className={statusPill[task.status]}>{STATUS_LABEL[task.status]}</Pill>
          <Pill>{PRIORITY_LABEL[task.priority]} priority</Pill>
          {task.dueDate && (
            <Pill className={overdue ? "bg-red-100 text-red-700" : ""}>
              {overdue ? "Overdue · " : "Due "}
              {formatDate(task.dueDate)}
            </Pill>
          )}
          {task.createdAt && <Pill>Created {formatDate(task.createdAt)}</Pill>}
          <Pill className="font-mono font-normal" title="MongoDB _id">
            {task._id}
          </Pill>
        </div>
      </div>

      <div className="flex gap-0.5">
        <Button variant="icon" onClick={() => onEdit(task)} title="Edit (GET by id + PATCH)" aria-label="Edit task">
          ✎
        </Button>
        <Button variant="icon-danger" onClick={() => onDelete(task)} title="Delete (DELETE)" aria-label="Delete task">
          🗑
        </Button>
      </div>
    </li>
  );
}
