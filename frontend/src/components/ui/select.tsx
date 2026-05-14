import type { SelectHTMLAttributes, ForwardedRef } from "react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = forwardRef(
  (
    { className, children, ...props }: SelectProps,
    ref: ForwardedRef<HTMLSelectElement>,
  ) => (
    <select
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-2xl border border-border/70 bg-background/80 px-4 py-2.5 text-sm text-foreground shadow-sm transition-all focus-visible:outline-none focus-visible:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  ),
);

Select.displayName = "Select";
