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
import { useApprovedLandlordsQuery } from "@/hooks/use-api-queries";
import { normalizeCollection } from "@/lib/collection";

const ApprovedLandlordsPage = () => {
  const query = useApprovedLandlordsQuery({ limit: 20 });
  const landlords = normalizeCollection(query.data);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <SectionTitle
          eyebrow="Approved"
          title="Approved landlords"
          description="Verified and active landlord accounts."
        />
        {query.isLoading ? (
          <div className="h-64 animate-pulse rounded-3xl bg-muted/50" />
        ) : query.isError ? (
          <RetryState
            title="Unable to load approved landlords"
            description="Try again."
            onRetry={() => query.refetch()}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Business</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {landlords.map((landlord) => (
                <TableRow key={landlord._id}>
                  <TableCell>{landlord.name}</TableCell>
                  <TableCell>
                    {landlord.landlordProfile?.businessName ?? "—"}
                  </TableCell>
                  <TableCell>
                    {landlord.landlordProfile?.applicationStatus ?? "APPROVED"}
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

export default ApprovedLandlordsPage;
