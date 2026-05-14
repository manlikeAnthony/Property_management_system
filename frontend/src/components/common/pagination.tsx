import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type PaginationProps = {
  page: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => void;
};

export const Pagination = ({
  page,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
}: PaginationProps) => (
  <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card/80 p-4">
    <p className="text-sm text-muted-foreground">Page {page}</p>
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={!hasPreviousPage}
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNextPage}
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  </div>
);
