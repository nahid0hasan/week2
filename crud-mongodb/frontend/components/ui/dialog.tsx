"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Native <dialog> controlled by an `open` prop. */
export function Dialog({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      className="m-auto w-[min(440px,92vw)] rounded-xl p-5.5 shadow-2xl backdrop:bg-slate-900/45"
    >
      {open && children}
    </dialog>
  );
}
