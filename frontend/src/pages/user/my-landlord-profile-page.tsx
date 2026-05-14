import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { SectionTitle } from "@/components/common/section-title";
import { Card, CardContent } from "@/components/ui/card";
import { RetryState } from "@/components/error/retry-state";
import { useLandlordProfileQuery } from "@/hooks/use-api-queries";

const MyLandlordProfilePage = () => {
  const query = useLandlordProfileQuery();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <SectionTitle
          eyebrow="Landlord profile"
          title="Your landlord account"
          description="View the landlord profile currently associated with your session."
        />
        {query.isLoading ? (
          <div className="h-64 animate-pulse rounded-3xl bg-muted/50" />
        ) : query.isError ? (
          <RetryState
            title="Unable to load profile"
            description="The profile may not exist yet or the session expired."
            onRetry={() => query.refetch()}
          />
        ) : (
          <Card className="border-border/60 bg-card/85">
            <CardContent className="grid gap-4 p-6 md:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground">Business name</p>
                <p className="text-xl font-semibold">
                  {query.data?.landlordProfile?.businessName ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Application status
                </p>
                <p className="text-xl font-semibold">
                  {query.data?.landlordProfile?.applicationStatus ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active landlord</p>
                <p className="text-xl font-semibold">
                  {query.data?.landlordProfile?.isActiveLandlord ? "Yes" : "No"}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyLandlordProfilePage;
