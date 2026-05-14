import { useMutation } from "@tanstack/react-query";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { SectionTitle } from "@/components/common/section-title";
import { PropertyForm } from "@/components/property/property-form";
import { RetryState } from "@/components/error/retry-state";
import { usePropertyQuery } from "@/hooks/use-api-queries";
import { propertyApi } from "@/services/api/property";
import { toast } from "@/components/ui/toaster";
import { unwrapApiError } from "@/services/api/client";
import { queryClient } from "@/lib/query-client";

const UpdatePropertyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const query = usePropertyQuery(id);
  const mutation = useMutation({
    mutationFn: (values: Parameters<typeof propertyApi.updateProperty>[1]) =>
      propertyApi.updateProperty(id as string, values),
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["property", id] });
      await queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast.success(
        response.message,
        "Your listing details are now up to date.",
      );
      navigate("/dashboard/landlord/my-properties", { replace: true });
    },
    onError: (error) =>
      toast.error("Unable to update property", unwrapApiError(error)),
  });

  const defaultValues = useMemo(
    () => ({
      title: query.data?.title,
      description: query.data?.description,
      price: query.data?.price,
      type: query.data?.type,
      bedrooms: query.data?.bedrooms,
      bathrooms: query.data?.bathrooms,
      area: query.data?.area,
      street: query.data?.address.street,
      city: query.data?.address.city,
      state: query.data?.address.state,
      country: query.data?.address.country,
      images: [],
    }),
    [query.data],
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <SectionTitle
          eyebrow="Update"
          title="Update property"
          description="Edit listing details and refresh uploaded images."
        />
        {query.isLoading ? (
          <div className="h-64 animate-pulse rounded-3xl bg-muted/50" />
        ) : query.isError ? (
          <RetryState
            title="Unable to load property"
            description="Retry the request."
            onRetry={() => query.refetch()}
          />
        ) : (
          <PropertyForm
            requireImages={false}
            previewImageUrl={query.data?.images?.[0]?.url}
            defaultValues={defaultValues}
            onSubmit={(values) => mutation.mutate(values)}
            submitLabel={mutation.isPending ? "Saving..." : "Save changes"}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default UpdatePropertyPage;
