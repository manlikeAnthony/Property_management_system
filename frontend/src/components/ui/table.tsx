import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export const Table = ({
  className,
  ...props
}: HTMLAttributes<HTMLTableElement>) => (
  <div className="w-full overflow-x-auto rounded-3xl border border-border/60 bg-card/95 shadow-soft">
    <table className={cn("w-full text-sm", className)} {...props} />
  </div>
);

export const TableHeader = ({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) => (
  <thead
    className={cn("border-b border-border/60 bg-muted/30", className)}
    {...props}
  />
);

export const TableBody = ({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={cn("divide-y divide-border/60", className)} {...props} />
);

export const TableRow = ({
  className,
  ...props
}: HTMLAttributes<HTMLTableRowElement>) => (
  <tr
    className={cn("transition-colors hover:bg-muted/40", className)}
    {...props}
  />
);

export const TableHead = ({
  className,
  ...props
}: HTMLAttributes<HTMLTableCellElement>) => (
  <th
    className={cn(
      "px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground",
      className,
    )}
    {...props}
  />
);

export const TableCell = ({
  className,
  ...props
}: HTMLAttributes<HTMLTableCellElement>) => (
  <td className={cn("px-4 py-4 align-middle text-sm", className)} {...props} />
);

export const TableCaption = ({
  className,
  ...props
}: HTMLAttributes<HTMLTableCaptionElement>) => (
  <caption
    className={cn("mt-3 text-left text-sm text-muted-foreground", className)}
    {...props}
  />
);

export const TableRowPlaceholder = ({ label }: { label: ReactNode }) => (
  <div className="p-6 text-sm text-muted-foreground">{label}</div>
);
