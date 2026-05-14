import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { SectionTitle } from "@/components/common/section-title";
import { PropertyCard } from "@/components/property/property-card";
import { Button } from "@/components/ui/button";
import { RetryState } from "@/components/error/retry-state";
import { usePropertiesQuery } from "@/hooks/use-api-queries";
import { normalizeCollection } from "@/lib/collection";
import { useAuthStore } from "@/store/auth-store";

const MyListedPropertiesPage = () => {
  const user = useAuthStore((state) => state.user);
  const query = usePropertiesQuery({ limit: 100, sort: "-createdAt" });
  const properties = normalizeCollection(query.data);

  const listings = properties.filter((property) => {
    if (user?.roles?.includes("ADMIN")) return true;

    const listedBy =
      typeof property.listedBy === "string"
        ? property.listedBy
        : property.listedBy?._id;

    return listedBy === user?._id;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <SectionTitle
          eyebrow="Inventory"
          title="My listed properties"
          description="View and manage all your property listings."
          action={
            <Button asChild>
              <Link to="/dashboard/landlord/create-property">
                Create property
              </Link>
            </Button>
          }
        />

        {query.isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-96 animate-pulse rounded-3xl bg-muted/50"
              />
            ))}
          </div>
        ) : query.isError ? (
          <RetryState
            title="Unable to load your properties"
            description="Please retry."
            onRetry={() => query.refetch()}
          />
        ) : listings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/40 bg-muted/20 p-8 text-center">
            <p className="text-sm text-muted-foreground">
              You have not listed any properties yet.
            </p>
            <Button asChild className="mt-4">
              <Link to="/dashboard/landlord/create-property">
                Create property
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {listings.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyListedPropertiesPage;
