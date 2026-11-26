import { ConnectionStatus, RequestLogPanel } from "@/features/request-log";
import { TasksView } from "@/features/tasks";

// Page stays thin: layout + feature components, no logic.
export default function Home() {
  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-6 py-3.5">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-[9px] bg-indigo-600 font-bold text-white">✓</span>
          <div>
            <h1 className="text-lg font-bold">TaskFlow</h1>
            <p className="text-xs text-slate-500">Node · Express · MongoDB CRUD practice</p>
          </div>
        </div>
        <ConnectionStatus />
      </header>

      <main className="grid items-start gap-4.5 px-6 py-4.5 xl:grid-cols-[300px_1fr_320px]">
        <TasksView />
        <RequestLogPanel />
      </main>
    </>
  );
}
