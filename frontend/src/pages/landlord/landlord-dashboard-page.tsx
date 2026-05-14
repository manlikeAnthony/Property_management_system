import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { DashboardPanel } from "@/components/dashboard/overview-grid";
import { SectionTitle } from "@/components/common/section-title";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RetryState } from "@/components/error/retry-state";
import { usePropertiesQuery } from "@/hooks/use-api-queries";
import { normalizeCollection } from "@/lib/collection";
import { useAuthStore } from "@/store/auth-store";

const LandlordDashboardPage = () => {
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
      <div className="space-y-8">
        <div className="flex items-start justify-between gap-4 md:items-center">
          <SectionTitle
            eyebrow="Landlord workspace"
            title="Manage properties"
            description="Create listings and keep property details up to date."
          />
          <Button asChild size="lg">
            <Link to="/dashboard/landlord/create-property">
              <Plus className="h-4 w-4" />
              Create property
            </Link>
          </Button>
        </div>

        <DashboardPanel title="Your listings">
          {query.isLoading ? (
            <div className="h-48 animate-pulse rounded-3xl bg-muted/50" />
          ) : query.isError ? (
            <RetryState
              title="Unable to load your listings"
              description="Please retry."
              onRetry={() => query.refetch()}
            />
          ) : listings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/40 bg-muted/20 p-8 text-center">
              <p className="text-sm text-muted-foreground">
                No properties yet. Create your first listing to get started.
              </p>
              <Button asChild className="mt-4">
                <Link to="/dashboard/landlord/create-property">
                  Create property
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {listings.map((property) => (
                <div
                  key={property._id}
                  className="rounded-2xl border border-border/60 bg-background/70 p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-soft"
                >
                  <div className="space-y-2">
                    <p className="font-medium">{property.title}</p>
                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                      <span>{property.type}</span>
                      <span>·</span>
                      <span>{property.status}</span>
                      {property.isPublished ? (
                        <>
                          <span>·</span>
                          <span className="text-emerald-600">Published</span>
                        </>
                      ) : (
                        <>
                          <span>·</span>
                          <span className="text-amber-600">Draft</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button size="sm" asChild>
                      <Link
                        to={`/dashboard/landlord/update-property/${property._id}`}
                      >
                        Edit
                      </Link>
                    </Button>
                    <Button size="sm" variant="ghost" asChild>
                      <Link to={`/properties/${property._id}`}>
                        View listing
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DashboardPanel>
      </div>
    </DashboardLayout>
  );
};

export default LandlordDashboardPage;
