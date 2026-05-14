import { useMemo, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useLandlordsQuery } from "@/hooks/use-api-queries";
import { normalizeCollection } from "@/lib/collection";

const AllLandlordsPage = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const query = useLandlordsQuery({ search: debouncedSearch, limit: 20 });
  const landlords = useMemo(
    () => normalizeCollection(query.data),
    [query.data],
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <SectionTitle
          eyebrow="Landlords"
          title="All landlords"
          description="A consolidated view of approved and pending landlords."
        />
        <Input
          placeholder="Search landlords"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        {query.isLoading ? (
          <div className="h-64 animate-pulse rounded-3xl bg-muted/50" />
        ) : query.isError ? (
          <RetryState
            title="Unable to load landlords"
            description="Retry the request."
            onRetry={() => query.refetch()}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Business</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {landlords.map((landlord) => (
                <TableRow key={landlord._id}>
                  <TableCell>{landlord.name}</TableCell>
                  <TableCell>{landlord.email}</TableCell>
                  <TableCell>
                    {landlord.landlordProfile?.businessName ?? "—"}
                  </TableCell>
                  <TableCell>
                    {landlord.landlordProfile?.applicationStatus ?? "—"}
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

export default AllLandlordsPage;
