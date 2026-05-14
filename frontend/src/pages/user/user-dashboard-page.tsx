import { Home, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { DashboardPanel } from "@/components/dashboard/overview-grid";
import { SectionTitle } from "@/components/common/section-title";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth-store";

const UserDashboardPage = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <SectionTitle
          eyebrow="User workspace"
          title={`Welcome back, ${user?.name ?? "member"}.`}
          description="Browse properties and track your activity."
        />

        <div className="grid gap-6">
          <DashboardPanel title="Quick actions">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { icon: Home, label: "Browse properties", href: "/properties" },
                {
                  icon: Users,
                  label: "Become landlord",
                  href: "/dashboard/user/become-landlord",
                },
              ].map(({ icon: Icon, label, href }) => (
                <Card
                  key={label}
                  className="group border-border/60 bg-background/70 transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-soft"
                >
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <Button
                      variant="ghost"
                      className="h-auto p-0 text-left font-medium text-foreground"
                      asChild
                    >
                      <Link to={href}>{label}</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DashboardPanel>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboardPage;
