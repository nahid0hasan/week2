import { useSyncExternalStore } from "react";

/**
 * Tiny global store (no library needed) for UI-only state that lives
 * outside React Query, such as toasts and the request log.
 * React reads it with useSyncExternalStore.
 */
export function createStore<T>(initial: T) {
  let state = initial;
  const listeners = new Set<() => void>();

  const getState = () => state;

  const setState = (updater: (prev: T) => T) => {
    state = updater(state);
    listeners.forEach((l) => l());
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  function useStore() {
    return useSyncExternalStore(subscribe, getState, () => initial);
  }

  return { getState, setState, subscribe, useStore };
}
