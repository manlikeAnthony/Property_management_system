import type { PropsWithChildren, ReactNode } from "react";
import { Card } from "@/components/ui/card";

type PageShellProps = PropsWithChildren<{
  title: string;
  description?: string;
  action?: ReactNode;
}>;

export const PageShell = ({
  title,
  description,
  action,
  children,
}: PageShellProps) => (
  <div className="space-y-8">
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="max-w-3xl text-sm text-muted-foreground md:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
    <Card className="overflow-hidden border-border/60 bg-card/80">
      {children}
    </Card>
  </div>
);
