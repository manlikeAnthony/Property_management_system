import { ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type StatCardProps = {
  label: string;
  value: string;
  delta?: string;
  hint?: string;
};

export const StatCard = ({ label, value, delta, hint }: StatCardProps) => (
  <Card className="group relative overflow-hidden border-border/60 bg-card/90 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-glow">
    <CardContent className="space-y-4 p-6">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {delta ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <ArrowUpRight className="h-3 w-3" />
            {delta}
          </span>
        ) : null}
      </div>
      <div className="space-y-1">
        <p className="text-4xl font-semibold tracking-tight">{value}</p>
        {hint ? (
          <p className="max-w-[18rem] text-sm leading-6 text-muted-foreground">
            {hint}
          </p>
        ) : null}
      </div>
    </CardContent>
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary/0 via-primary/25 to-primary/0 opacity-0 transition-opacity group-hover:opacity-100" />
  </Card>
);
