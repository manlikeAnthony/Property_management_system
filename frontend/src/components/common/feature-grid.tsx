import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

type FeatureGridProps = {
  items: Array<{
    title: string;
    description: string;
    icon?: ReactNode;
  }>;
};

export const FeatureGrid = ({ items }: FeatureGridProps) => (
  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
    {items.map((item) => (
      <Card
        key={item.title}
        className="border-border/60 bg-card/85 transition hover:-translate-y-1 hover:shadow-soft"
      >
        <CardContent className="space-y-4 p-6">
          {item.icon ? <div className="text-primary">{item.icon}</div> : null}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);
