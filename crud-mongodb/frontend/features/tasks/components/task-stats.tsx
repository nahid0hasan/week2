import type { Task } from "../schema";

export function TaskStats({ tasks }: { tasks: Task[] }) {
  const count = (status: Task["status"]) => tasks.filter((t) => t.status === status).length;

  const stats = [
    { label: "Total", value: tasks.length },
    { label: "To do", value: count("todo") },
    { label: "In progress", value: count("in-progress") },
    { label: "Done", value: count("done") },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 border-t border-slate-200 pt-3.5">
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col rounded-lg bg-slate-50 p-2.5">
          <span className="text-xl font-bold">{s.value}</span>
          <small className="text-slate-500">{s.label}</small>
        </div>
      ))}
    </div>
  );
}
