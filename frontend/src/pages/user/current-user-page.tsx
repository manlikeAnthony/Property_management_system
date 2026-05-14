import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { SectionTitle } from "@/components/common/section-title";
import { Card, CardContent } from "@/components/ui/card";
import { useCurrentUserQuery } from "@/hooks/use-api-queries";
import { RetryState } from "@/components/error/retry-state";

const CurrentUserPage = () => {
  const query = useCurrentUserQuery();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <SectionTitle
          eyebrow="Current user"
          title="Current session"
          description="View the account currently signed in."
        />
        {query.isLoading ? (
          <div className="h-64 animate-pulse rounded-3xl bg-muted/50" />
        ) : query.isError ? (
          <RetryState
            title="Unable to load current user"
            description="The session may have expired."
            onRetry={() => query.refetch()}
          />
        ) : (
          <Card className="border-border/60 bg-card/85">
            <CardContent className="grid gap-4 p-6 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="text-xl font-semibold">{query.data?.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-xl font-semibold">{query.data?.email}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CurrentUserPage;
