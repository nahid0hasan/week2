import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "icon" | "icon-danger";

const variants: Record<Variant, string> = {
  primary: "bg-indigo-600 text-white hover:bg-indigo-700 px-3.5 py-2 disabled:opacity-60 disabled:cursor-wait",
  ghost: "border border-slate-200 bg-transparent text-slate-800 hover:bg-slate-100 px-3.5 py-2",
  icon: "px-2 py-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800",
  "icon-danger": "px-2 py-1.5 text-slate-500 hover:bg-red-100 hover:text-red-600",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant };

export function Button({ variant = "primary", className, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn("cursor-pointer rounded-md text-sm font-semibold transition-colors", variants[variant], className)}
      {...props}
    />
  );
}
