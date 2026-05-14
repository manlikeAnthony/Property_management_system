import type { PropertyFilters } from "@/types/property";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

type PropertyFiltersProps = {
  value: PropertyFilters & { search?: string };
  onChange: (value: PropertyFilters & { search?: string }) => void;
};

export const PropertyFiltersBar = ({
  value,
  onChange,
}: PropertyFiltersProps) => (
  <Card className="border-border/60 bg-card/80">
    <CardContent className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-5">
      <Input
        placeholder="Search properties"
        value={value.search ?? ""}
        onChange={(event) => onChange({ ...value, search: event.target.value })}
      />
      <Input
        placeholder="City"
        value={value.city ?? ""}
        onChange={(event) => onChange({ ...value, city: event.target.value })}
      />
      <Input
        placeholder="State"
        value={value.state ?? ""}
        onChange={(event) => onChange({ ...value, state: event.target.value })}
      />
      <Input
        placeholder="Min price"
        inputMode="numeric"
        value={value.minPrice ?? ""}
        onChange={(event) =>
          onChange({
            ...value,
            minPrice: Number(event.target.value) || undefined,
          })
        }
      />
      <div className="flex gap-2 xl:justify-end">
        <Button
          variant="outline"
          className="w-full xl:w-auto"
          onClick={() => onChange({})}
        >
          Reset
        </Button>
      </div>
    </CardContent>
  </Card>
);
