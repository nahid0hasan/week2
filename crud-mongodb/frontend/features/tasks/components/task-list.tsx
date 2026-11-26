"use client";

import type { ReactNode } from "react";
import type { Task } from "../schema";
import { TaskItem } from "./task-item";

type Props = {
  tasks: Task[];
  isPending: boolean;
  error: Error | null;
  hasFilters: boolean;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
};

function Empty({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-200 px-2.5 py-8 text-center leading-relaxed whitespace-pre-line text-slate-500">
      {children}
    </div>
  );
}

export function TaskList({ tasks, isPending, error, hasFilters, ...handlers }: Props) {
  if (isPending) {
    return (
      <ul className="flex flex-col gap-2">
        {[0, 1, 2].map((i) => (
          <li key={i} className="h-15.5 animate-pulse rounded-lg bg-slate-100" />
        ))}
      </ul>
    );
  }

  if (error) {
    return (
      <Empty>
        ⚠️ <b>Couldn&apos;t load tasks</b>
        <br />
        {error.message}
      </Empty>
    );
  }

  if (tasks.length === 0) {
    return <Empty>{hasFilters ? "No tasks match these filters." : "No tasks yet. Add your first one on the left 👈"}</Empty>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {tasks.map((task) => (
        <TaskItem key={task._id} task={task} {...handlers} />
      ))}
    </ul>
  );
}
