"use client";

import { useState } from "react";
import { MethodTag } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Panel, PanelTitle } from "@/components/ui/panel";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { buildTasksPath } from "../api/tasks.api";
import { useCreateTask, useDeleteTask, useToggleTaskStatus } from "../hooks/use-task-mutations";
import { useTasks } from "../hooks/use-tasks";
import type { Task, TaskFilters as Filters } from "../schema";
import { EditTaskDialog } from "./edit-task-dialog";
import { TaskFilters } from "./task-filters";
import { TaskForm } from "./task-form";
import { TaskList } from "./task-list";
import { TaskStats } from "./task-stats";

const INITIAL_FILTERS: Omit<Filters, "search"> = { status: "", priority: "", sort: "" };

/**
 * The tasks screen. Owns filter state and wires hooks to components.
 * Renders two grid cells: the create panel and the list panel.
 */
export function TasksView() {
  const [baseFilters, setBaseFilters] = useState(INITIAL_FILTERS);
  const [searchInput, setSearchInput] = useState("");
  const search = useDebouncedValue(searchInput.trim(), 350);
  const filters: Filters = { ...baseFilters, search };

  const [editingId, setEditingId] = useState<string | null>(null);

  const tasksQuery = useTasks(filters);
  const createTask = useCreateTask();
  const deleteTask = useDeleteTask();
  const toggleStatus = useToggleTaskStatus();

  const tasks = tasksQuery.data ?? [];
  const hasFilters = Object.values(filters).some(Boolean);

  const handleToggle = (task: Task) =>
    toggleStatus.mutate({ id: task._id, status: task.status === "done" ? "todo" : "done" });

  const handleDelete = (task: Task) => {
    if (confirm(`Delete "${task.title}"?`)) deleteTask.mutate(task._id);
  };

  return (
    <>
      <Panel>
        <PanelTitle>
          New task <MethodTag method="POST" />
        </PanelTitle>
        <TaskForm submitLabel="Add task" isPending={createTask.isPending} onSubmit={(input) => createTask.mutateAsync(input)} />
        <TaskStats tasks={tasks} />
      </Panel>

      <Panel>
        <div className="flex items-center justify-between">
          <PanelTitle>
            Tasks <MethodTag method="GET" />
            {tasksQuery.isFetching && !tasksQuery.isPending && (
              <span className="text-xs font-normal text-slate-400">updating…</span>
            )}
          </PanelTitle>
          <Button variant="ghost" onClick={() => tasksQuery.refetch()} title="Reload from server">
            ↻ Refresh
          </Button>
        </div>

        <TaskFilters
          filters={filters}
          searchInput={searchInput}
          onSearchInput={setSearchInput}
          onChange={(patch) => setBaseFilters((f) => ({ ...f, ...patch }))}
          queryPreview={buildTasksPath(filters)}
        />

        <TaskList
          tasks={tasks}
          isPending={tasksQuery.isPending}
          error={tasksQuery.error}
          hasFilters={hasFilters}
          onToggle={handleToggle}
          onEdit={(task) => setEditingId(task._id)}
          onDelete={handleDelete}
        />
      </Panel>

      <EditTaskDialog taskId={editingId} onClose={() => setEditingId(null)} />
    </>
  );
}
