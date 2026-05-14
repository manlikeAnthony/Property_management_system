import {
  ArrowRight,
  Building2,
  ClipboardList,
  KeyRound,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/layouts/site-layout";
import { SectionTitle } from "@/components/common/section-title";
import { FeatureGrid } from "@/components/common/feature-grid";
import { StatCard } from "@/components/common/stat-card";
import { PropertyCard } from "@/components/property/property-card";
import { RetryState } from "@/components/error/retry-state";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePropertiesQuery } from "@/hooks/use-api-queries";
import { normalizeCollection } from "@/lib/collection";

const LandingPage = () => {
  const query = usePropertiesQuery({ limit: 12, sort: "-createdAt" });
  const properties = normalizeCollection(query.data);
  const featuredProperties = properties.slice(0, 6);

  const publishedListings = properties.filter(
    (property) => property.isPublished,
  ).length;

  const availableListings = properties.filter(
    (property) => property.status === "AVAILABLE",
  ).length;

  const rentedListings = properties.filter(
    (property) => property.status === "RENTED",
  ).length;

  const previewStats = [
    {
      label: "Total listings",
      value: String(properties.length),
      hint: "Properties currently in the system",
    },
    {
      label: "Published",
      value: String(publishedListings),
      hint: "Listings visible to users",
    },
    {
      label: "For rent",
      value: String(
        properties.filter((property) => property.type === "RENT").length,
      ),
      hint: "Rental properties",
    },
    {
      label: "For sale",
      value: String(
        properties.filter((property) => property.type === "SALE").length,
      ),
      hint: "Properties available for purchase",
    },
  ];

  return (
    <SiteLayout>
      <section className="grid gap-8 overflow-hidden rounded-[2rem] border border-border/60 bg-card/90 p-6 shadow-soft lg:grid-cols-[1.05fr_0.95fr] lg:p-10">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
            <ClipboardList className="h-4 w-4" />
            Property management workspace
          </div>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
              Manage properties, landlords, and tenants in one place.
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
              Create listings, review landlord applications, and track ownership
              and tenancy records from a single dashboard.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/properties">
                View properties
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/dashboard">View dashboard</Link>
            </Button>
          </div>
          <div className="grid gap-4 pt-2 sm:grid-cols-3">
            <StatCard
              label="Published listings"
              value={String(publishedListings)}
              hint="Listings visible in the catalog"
            />
            <StatCard
              label="Available properties"
              value={String(availableListings)}
              hint="Units ready for assignment"
            />
            <StatCard
              label="Active rentals"
              value={String(rentedListings)}
              hint="Units currently occupied"
            />
          </div>
        </div>

        <Card className="relative overflow-hidden border-border/60 bg-slate-950 text-white shadow-glow">
          <CardContent className="space-y-6 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">Dashboard preview</p>
                <h2 className="text-2xl font-semibold">
                  Property management dashboard
                </h2>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {previewStats.map((stat) => (
                <Card
                  key={stat.label}
                  className="border-white/10 bg-white/5 text-white shadow-none"
                >
                  <CardContent className="space-y-2 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-semibold">{stat.value}</p>
                    <p className="text-sm text-white/70">{stat.hint}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { icon: Building2, label: "Properties" },
                { icon: ShieldCheck, label: "Verification" },
                { icon: Users, label: "Teams" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="rounded-2xl bg-white/10 p-2">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-white/60">{label}</p>
                    <p className="font-medium">
                      {label === "Properties"
                        ? "Create, edit, and publish listings"
                        : label === "Verification"
                          ? "Review accounts and approval status"
                          : "Assign access by role"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-6 py-16">
        <SectionTitle
          eyebrow="Why Homify"
          title="Workflows for property teams"
          description="Clear screens for listings, approvals, ownership, and tenancy records."
        />
        <FeatureGrid
          items={[
            {
              title: "Create and manage property listings",
              description:
                "Add property details, upload images, and publish listings from the dashboard.",
              icon: <Building2 className="h-5 w-5" />,
            },
            {
              title: "Approve or reject landlord applications",
              description:
                "Review pending landlord requests and move them through a clear approval flow.",
              icon: <ShieldCheck className="h-5 w-5" />,
            },
            {
              title: "Track ownership and tenancy history",
              description:
                "Check who owns a property, who occupies it, and how the record changed over time.",
              icon: <Users className="h-5 w-5" />,
            },
            {
              title: "Role-based access control",
              description:
                "Each user role sees only the screens and actions they need for their job.",
              icon: <KeyRound className="h-5 w-5" />,
            },
          ]}
        />
      </section>

      <section className="space-y-6 py-8">
        <SectionTitle
          eyebrow="Featured"
          title="Featured properties"
          description="Browse available listings and property details."
          action={
            <Button asChild variant="outline">
              <Link to="/properties">View all listings</Link>
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
            title="Unable to load featured properties"
            description="Please retry in a moment."
            onRetry={() => query.refetch()}
          />
        ) : featuredProperties.length === 0 ? (
          <EmptyState
            title="No properties available"
            description="Listings will appear here as properties are added."
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredProperties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </section>

      <section className="rounded-[2rem] border border-border/60 bg-card/80 p-6 text-center md:p-12">
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold tracking-tight">
            Get started today
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Create your first listing or apply for landlord access to manage
            properties.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Button asChild size="lg">
              <Link to="/properties">Browse properties</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/register">Sign up</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default LandingPage;
