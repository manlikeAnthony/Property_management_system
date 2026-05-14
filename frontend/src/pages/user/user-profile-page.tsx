import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { SectionTitle } from "@/components/common/section-title";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const UserProfilePage = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <SectionTitle
          eyebrow="Profile"
          title="Your account"
          description="Review your login identity and status."
        />
        <Card className="border-border/60 bg-card/85">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-2xl font-semibold">
                  {user?.name ?? "Member"}
                </p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
              <Badge className="bg-primary/10 text-primary">
                {user?.accountStatus ?? "ACTIVE"}
              </Badge>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Roles
                </p>
                <p className="mt-1 font-medium">
                  {user?.roles.join(", ") ?? "USER"}
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Email verified
                </p>
                <p className="mt-1 font-medium">
                  {user?.isVerified ? "Yes" : "No"}
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Landlord status
                </p>
                <p className="mt-1 font-medium">
                  {user?.landlordProfile?.applicationStatus ?? "N/A"}
                </p>
              </div>
            </div>
            <Button variant="outline">Update profile</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default UserProfilePage;
