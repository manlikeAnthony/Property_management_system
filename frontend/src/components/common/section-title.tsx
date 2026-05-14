import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
};

export const SectionTitle = ({
  eyebrow,
  title,
  description,
  action,
}: SectionTitleProps) => (
  <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
    <div className="space-y-3">
      {eyebrow ? (
        <Badge className="border-primary/10 bg-primary/5 text-primary">
          {eyebrow}
        </Badge>
      ) : null}
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
            {description}
          </p>
        ) : null}
      </div>
    </div>
    {action ? <div>{action}</div> : null}
  </div>
);
