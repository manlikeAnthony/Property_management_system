import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { SectionTitle } from "@/components/common/section-title";
import { RetryState } from "@/components/error/retry-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { usePropertiesQuery } from "@/hooks/use-api-queries";
import { normalizeCollection } from "@/lib/collection";
import { propertyApi } from "@/services/api/property";
import { toast } from "@/components/ui/toaster";
import { unwrapApiError } from "@/services/api/client";
import { queryClient } from "@/lib/query-client";

const PropertyManagementPage = () => {
  const query = usePropertiesQuery({ limit: 20, sort: "-createdAt" });
  const properties = normalizeCollection(query.data);
  const deleteMutation = useMutation({
    mutationFn: propertyApi.deleteProperty,
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast.success(response.message);
    },
    onError: (error) => toast.error("Delete failed", unwrapApiError(error)),
  });
  const deletingId = deleteMutation.variables;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <SectionTitle
          eyebrow="Properties"
          title="Property management"
          description="Review listings, edit property details, and remove records when needed."
        />
        {query.isLoading ? (
          <div className="h-64 animate-pulse rounded-3xl bg-muted/50" />
        ) : query.isError ? (
          <RetryState
            title="Unable to load properties"
            description="Try again."
            onRetry={() => query.refetch()}
          />
        ) : properties.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/50 bg-muted/20 p-10 text-center">
            <p className="text-sm font-medium text-foreground">
              No properties found.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Listings will appear here as landlords create them.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/70">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[45%]">Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.map((property) => (
                  <TableRow key={property._id}>
                    <TableCell className="py-4">
                      <div className="space-y-1">
                        <p className="font-medium">{property.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {property.formattedAddress ??
                            `${property.address.city}, ${property.address.state}`}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{property.type}</TableCell>
                    <TableCell>{property.status}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link
                            to={`/dashboard/landlord/update-property/${property._id}`}
                          >
                            Edit listing
                          </Link>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteMutation.mutate(property._id)}
                          disabled={
                            deleteMutation.isPending &&
                            deletingId === property._id
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                          {deleteMutation.isPending &&
                          deletingId === property._id
                            ? "Deleting..."
                            : "Delete"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PropertyManagementPage;
