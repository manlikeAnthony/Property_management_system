import { useMutation } from "@tanstack/react-query";
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
import { toast } from "@/components/ui/toaster";
import { useLandlordApplicationsQuery } from "@/hooks/use-api-queries";
import { normalizeCollection } from "@/lib/collection";
import { landlordApi } from "@/services/api/landlord";
import { unwrapApiError } from "@/services/api/client";

const LandlordApplicationsPage = () => {
  const query = useLandlordApplicationsQuery({ limit: 20 });
  const applications = normalizeCollection(query.data);
  const approve = useMutation({
    mutationFn: landlordApi.approveLandlord,
    onSuccess: (response) => toast.success(response.message),
    onError: (error) => toast.error("Approval failed", unwrapApiError(error)),
  });
  const reject = useMutation({
    mutationFn: landlordApi.rejectLandlord,
    onSuccess: (response) => toast.success(response.message),
    onError: (error) => toast.error("Rejection failed", unwrapApiError(error)),
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <SectionTitle
          eyebrow="Approvals"
          title="Landlord applications"
          description="Review and action pending landlord requests."
        />
        {query.isLoading ? (
          <div className="h-64 animate-pulse rounded-3xl bg-muted/50" />
        ) : query.isError ? (
          <RetryState
            title="Unable to load applications"
            description="Retry the request."
            onRetry={() => query.refetch()}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application._id}>
                  <TableCell>{application.name}</TableCell>
                  <TableCell>{application.email}</TableCell>
                  <TableCell>
                    {application.landlordProfile?.applicationStatus ??
                      "PENDING"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        onClick={() => approve.mutate(application._id)}
                        disabled={approve.isPending}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => reject.mutate(application._id)}
                        disabled={reject.isPending}
                      >
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LandlordApplicationsPage;
