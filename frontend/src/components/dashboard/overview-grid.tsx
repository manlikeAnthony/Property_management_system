import { Card, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/common/stat-card";

type OverviewGridProps = {
  stats: Array<{ label: string; value: string; delta?: string; hint?: string }>;
};

export const OverviewGrid = ({ stats }: OverviewGridProps) => (
  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
    {stats.map((stat) => (
      <StatCard key={stat.label} {...stat} />
    ))}
  </div>
);

export const DashboardPanel = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Card className="border-border/60 bg-card/85 shadow-soft transition-all duration-300 hover:border-primary/20 hover:shadow-glow">
    <CardContent className="space-y-4 p-6">
      <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-4">
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        <div className="h-2 w-2 rounded-full bg-primary/60" />
      </div>
      {children}
    </CardContent>
  </Card>
);
