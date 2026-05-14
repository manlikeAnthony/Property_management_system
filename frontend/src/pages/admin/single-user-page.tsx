import { useMutation } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { SectionTitle } from "@/components/common/section-title";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RetryState } from "@/components/error/retry-state";
import { useUserQuery } from "@/hooks/use-api-queries";
import { userApi } from "@/services/api/user";
import { toast } from "@/components/ui/toaster";
import { unwrapApiError } from "@/services/api/client";

const SingleUserPage = () => {
  const { id } = useParams();
  const query = useUserQuery(id);
  const mutation = useMutation({
    mutationFn: () => userApi.deleteUser(id as string),
    onSuccess: (response) => toast.success(response.message),
    onError: (error) =>
      toast.error("Unable to delete user", unwrapApiError(error)),
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <SectionTitle
          eyebrow="User details"
          title="User account"
          description="View user information and manage account."
        />
        {query.isLoading ? (
          <div className="h-64 animate-pulse rounded-3xl bg-muted/50" />
        ) : query.isError ? (
          <RetryState
            title="Unable to load user"
            description="Try again."
            onRetry={() => query.refetch()}
          />
        ) : (
          <Card className="border-border/60 bg-card/85">
            <CardContent className="space-y-4 p-6">
              <p className="text-2xl font-semibold">{query.data?.name}</p>
              <p className="text-muted-foreground">{query.data?.email}</p>
              <div className="flex gap-3">
                <Button asChild variant="outline">
                  <Link to="/dashboard/admin/users">Back</Link>
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => mutation.mutate()}
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Deleting..." : "Delete user"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SingleUserPage;
