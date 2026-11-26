"use client";

import { Input, Select } from "@/components/ui/field";
import { Hint } from "@/components/ui/panel";
import { cn } from "@/lib/utils";
import { PRIORITY_LABEL, STATUS_LABEL, TASK_PRIORITIES, TASK_STATUSES, type TaskFilters as Filters } from "../schema";

type Props = {
  filters: Filters;
  /** search box value (debounced before it reaches `filters`) */
  searchInput: string;
  onSearchInput: (value: string) => void;
  onChange: (patch: Partial<Filters>) => void;
  queryPreview: string;
};

const tabs = [{ value: "", label: "All" }, ...TASK_STATUSES.map((s) => ({ value: s, label: STATUS_LABEL[s] }))] as const;

export function TaskFilters({ filters, searchInput, onSearchInput, onChange, queryPreview }: Props) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex w-fit flex-wrap gap-1 rounded-lg bg-slate-100 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange({ status: tab.value })}
            className={cn(
              "cursor-pointer rounded-md px-3 py-1.5 text-sm font-semibold transition-colors",
              filters.status === tab.value ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_140px_140px]">
        <Input type="search" placeholder="Search title…" value={searchInput} onChange={(e) => onSearchInput(e.target.value)} />
        <Select value={filters.priority} onChange={(e) => onChange({ priority: e.target.value as Filters["priority"] })}>
          <option value="">Any priority</option>
          {TASK_PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {PRIORITY_LABEL[p]}
            </option>
          ))}
        </Select>
        <Select value={filters.sort} onChange={(e) => onChange({ sort: e.target.value as Filters["sort"] })}>
          <option value="">Newest first</option>
          <option value="dueDate">Due date</option>
          <option value="priority">Priority</option>
        </Select>
      </div>

      <Hint>
        Filters are sent to your backend as query params →{" "}
        <code className="rounded bg-slate-100 px-1.5 py-px font-mono text-xs text-slate-700">{queryPreview}</code>
      </Hint>
    </div>
  );
}
