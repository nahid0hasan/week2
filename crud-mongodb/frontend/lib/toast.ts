import { createStore } from "./create-store";

export type ToastType = "info" | "success" | "error";
export type Toast = { id: number; message: string; type: ToastType };

let nextId = 1;
export const toastStore = createStore<Toast[]>([]);

function show(message: string, type: ToastType = "info") {
  const id = nextId++;
  toastStore.setState((prev) => [...prev, { id, message, type }]);
  setTimeout(() => dismiss(id), 3500);
}

export function dismiss(id: number) {
  toastStore.setState((prev) => prev.filter((t) => t.id !== id));
}

export const toast = {
  info: (msg: string) => show(msg, "info"),
  success: (msg: string) => show(msg, "success"),
  error: (msg: string) => show(msg, "error"),
};
