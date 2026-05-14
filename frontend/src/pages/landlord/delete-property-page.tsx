import { useMutation } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { SectionTitle } from "@/components/common/section-title";
import { RetryState } from "@/components/error/retry-state";
import { usePropertyQuery } from "@/hooks/use-api-queries";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { propertyApi } from "@/services/api/property";
import { toast } from "@/components/ui/toaster";
import { unwrapApiError } from "@/services/api/client";

const DeletePropertyPage = () => {
  const { id } = useParams();
  const query = usePropertyQuery(id);
  const mutation = useMutation({
    mutationFn: () => propertyApi.deleteProperty(id as string),
    onSuccess: (response) => toast.success(response.message),
    onError: (error) =>
      toast.error("Unable to delete property", unwrapApiError(error)),
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <SectionTitle
          eyebrow="Delete"
          title="Delete property"
          description="Permanently remove this property listing."
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
          <Card className="border-border/60 bg-card/85">
            <CardContent className="space-y-4 p-6">
              <p className="text-2xl font-semibold">{query.data?.title}</p>
              <p className="text-sm text-muted-foreground">
                This action cannot be undone. The property and all its data will
                be permanently deleted.
              </p>
              <div className="flex gap-3">
                <Button asChild variant="outline">
                  <Link to="/dashboard/landlord/my-properties">Cancel</Link>
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => mutation.mutate()}
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Deleting..." : "Delete property"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DeletePropertyPage;
