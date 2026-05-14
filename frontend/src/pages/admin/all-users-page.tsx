import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
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
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";
import { useUsersQuery } from "@/hooks/use-api-queries";
import { normalizeCollection } from "@/lib/collection";

const AllUsersPage = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const query = useUsersQuery({
    search: debouncedSearch,
    limit: 20,
    sort: "-createdAt",
  });
  const users = useMemo(() => normalizeCollection(query.data), [query.data]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <SectionTitle
          eyebrow="Users"
          title="All users"
          description="Search and inspect platform members."
        />
        <Input
          placeholder="Search users"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        {query.isLoading ? (
          <div className="h-64 animate-pulse rounded-3xl bg-muted/50" />
        ) : query.isError ? (
          <RetryState
            title="Unable to load users"
            description="Retry the request."
            onRetry={() => query.refetch()}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.roles.join(", ")}</TableCell>
                  <TableCell>{user.accountStatus}</TableCell>
                  <TableCell>
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/dashboard/admin/users/${user._id}`}>
                        View
                      </Link>
                    </Button>
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

export default AllUsersPage;
