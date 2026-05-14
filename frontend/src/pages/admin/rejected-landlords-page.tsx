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
import { useRejectedLandlordsQuery } from "@/hooks/use-api-queries";
import { normalizeCollection } from "@/lib/collection";

const RejectedLandlordsPage = () => {
  const query = useRejectedLandlordsQuery({ limit: 20 });
  const landlords = normalizeCollection(query.data);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <SectionTitle
          eyebrow="Rejected"
          title="Rejected landlords"
          description="Applications that were declined."
        />
        {query.isLoading ? (
          <div className="h-64 animate-pulse rounded-3xl bg-muted/50" />
        ) : query.isError ? (
          <RetryState
            title="Unable to load rejected landlords"
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
                    {landlord.landlordProfile?.applicationStatus ?? "REJECTED"}
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

export default RejectedLandlordsPage;
