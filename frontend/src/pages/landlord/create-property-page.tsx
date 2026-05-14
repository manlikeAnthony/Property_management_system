import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { SectionTitle } from "@/components/common/section-title";
import { PropertyForm } from "@/components/property/property-form";
import { toast } from "@/components/ui/toaster";
import { propertyApi } from "@/services/api/property";
import { unwrapApiError } from "@/services/api/client";
import { queryClient } from "@/lib/query-client";

const CreatePropertyPage = () => {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: propertyApi.createProperty,
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast.success(response.message, "Your listing was created as a draft.");
      navigate("/dashboard/landlord/my-properties", { replace: true });
    },
    onError: (error) =>
      toast.error("Unable to create property", unwrapApiError(error)),
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <SectionTitle
          eyebrow="Create"
          title="Create property"
          description="Create a draft listing with real validation, image upload, and location details."
        />
        <PropertyForm
          onSubmit={(values) => mutation.mutate(values)}
          submitLabel={mutation.isPending ? "Creating..." : "Create property"}
        />
      </div>
    </DashboardLayout>
  );
};

export default CreatePropertyPage;
