import { useParams } from "react-router-dom";
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
import { useOwnershipHistoryQuery } from "@/hooks/use-api-queries";
import { normalizeCollection } from "@/lib/collection";
import { formatDate } from "@/lib/utils";

const OwnershipHistoryPage = () => {
  const { id } = useParams();
  const query = useOwnershipHistoryQuery(id);
  const history = normalizeCollection(query.data);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <SectionTitle
          eyebrow="Ownership"
          title="Ownership history"
          description="Audit the transfer record for a property."
        />
        {query.isLoading ? (
          <div className="h-64 animate-pulse rounded-3xl bg-muted/50" />
        ) : query.isError ? (
          <RetryState
            title="Unable to load ownership history"
            description="Try again in a moment."
            onRetry={() => query.refetch()}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ownership ID</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Acquired</TableHead>
                <TableHead>Disposed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item._id}</TableCell>
                  <TableCell>
                    {typeof item.owner === "string"
                      ? item.owner
                      : item.owner.name}
                  </TableCell>
                  <TableCell>{formatDate(item.acquiredAt)}</TableCell>
                  <TableCell>{formatDate(item.disposedAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default OwnershipHistoryPage;
