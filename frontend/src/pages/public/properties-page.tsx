import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/layouts/site-layout";
import { SectionTitle } from "@/components/common/section-title";
import { PropertyCard } from "@/components/property/property-card";
import { PropertyFiltersBar } from "@/components/property/property-filters";
import { Pagination } from "@/components/common/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { RetryState } from "@/components/error/retry-state";
import { useDebounce } from "@/hooks/use-debounce";
import { usePropertiesQuery } from "@/hooks/use-api-queries";
import { normalizeCollection } from "@/lib/collection";
import type { PropertyFilters } from "@/types/property";

const PropertiesPage = () => {
  const [filters, setFilters] = useState<PropertyFilters & { search?: string }>(
    {},
  );
  const [page, setPage] = useState(1);
  const debouncedFilters = useDebounce(filters, 350);
  const query = usePropertiesQuery({
    ...debouncedFilters,
    page,
    limit: 12,
    sort: "-createdAt",
  });

  const properties = useMemo(
    () => normalizeCollection(query.data),
    [query.data],
  );

  return (
    <SiteLayout>
      <div className="space-y-6">
        <SectionTitle
          eyebrow="Properties"
          title="Browse listings"
          description="Search and filter available properties."
        />
        <PropertyFiltersBar
          value={filters}
          onChange={(next) => setFilters(next)}
        />

        {query.isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-96 animate-pulse rounded-3xl bg-muted/50"
              />
            ))}
          </div>
        ) : query.isError ? (
          <RetryState
            title="Unable to load properties"
            description="Check your connection and retry."
            onRetry={() => query.refetch()}
          />
        ) : properties.length === 0 ? (
          <EmptyState
            title="No properties found"
            description="Try a different search term or clear the filters."
          />
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {properties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
            <Pagination
              page={page}
              hasPreviousPage={page > 1}
              hasNextPage={properties.length >= 12}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </SiteLayout>
  );
};

export default PropertiesPage;
