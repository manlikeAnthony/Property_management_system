import { CheckCircle2, Mail, MapPin, ShieldCheck } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { SiteLayout } from "@/components/layouts/site-layout";
import { SectionTitle } from "@/components/common/section-title";
import { PropertyGallery } from "@/components/property/property-gallery";
import { PropertyCard } from "@/components/property/property-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePropertyQuery, usePropertiesQuery } from "@/hooks/use-api-queries";
import { normalizeCollection } from "@/lib/collection";
import { formatCurrency } from "@/lib/utils";

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const propertyQuery = usePropertyQuery(id);
  const relatedQuery = usePropertiesQuery({ limit: 4 });
  const property = propertyQuery.data;
  const related = normalizeCollection(relatedQuery.data)
    .filter((item) => item._id !== id)
    .slice(0, 3);

  if (propertyQuery.isLoading || !property) {
    return (
      <SiteLayout>
        <div className="h-[60vh] animate-pulse rounded-3xl bg-muted/50" />
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="space-y-8">
        <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          <PropertyGallery property={property} />
          <Card className="h-fit border-border/60 bg-card/90 shadow-soft">
            <CardContent className="space-y-6 p-6">
              <div className="space-y-2">
                <Badge className="w-fit bg-primary/10 text-primary">
                  {property.type}
                </Badge>
                <h1 className="text-3xl font-semibold tracking-tight">
                  {property.title}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {property.formattedAddress ??
                    `${property.address.street}, ${property.address.city}`}
                </p>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-3xl font-semibold">
                  {formatCurrency(property.price, property.currency)}
                </p>
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-600 dark:text-emerald-300">
                  <CheckCircle2 className="h-4 w-4" />
                  {property.status}
                </span>
              </div>
              <p className="text-sm leading-7 text-muted-foreground">
                {property.description}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Bedrooms", value: property.bedrooms ?? "-" },
                  { label: "Bathrooms", value: property.bathrooms ?? "-" },
                  {
                    label: "Area",
                    value: property.area ? `${property.area} sqm` : "-",
                  },
                  { label: "Max tenants", value: property.maxTenants },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-border/60 bg-muted/20 p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="mt-1 text-lg font-medium">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-3 rounded-2xl border border-border/60 bg-muted/20 p-4">
                <p className="text-sm font-medium">Ownership</p>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Review ownership records before completing a purchase.
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  Contact the landlord for additional property details.
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Button asChild>
                  <Link to={`/dashboard/user/purchase/${property._id}`}>
                    Purchase property
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link
                    to={`/dashboard/user/ownership-history/${property._id}`}
                  >
                    <Mail className="h-4 w-4" />
                    View ownership history
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <section className="space-y-4">
          <SectionTitle
            eyebrow="Similar"
            title="Similar properties"
            description="More listings you might want to compare."
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {related.map((item) => (
              <PropertyCard key={item._id} property={item} compact />
            ))}
          </div>
        </section>
      </div>
    </SiteLayout>
  );
};

export default PropertyDetailsPage;
