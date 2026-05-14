import { Building2, Gauge, ShieldCheck, Sparkles } from "lucide-react";
import { SiteLayout } from "@/components/layouts/site-layout";
import { SectionTitle } from "@/components/common/section-title";
import { FeatureGrid } from "@/components/common/feature-grid";
import { Card, CardContent } from "@/components/ui/card";

const AboutPage = () => (
  <SiteLayout>
    <div className="space-y-10">
      <SectionTitle
        eyebrow="About"
        title="Built for day-to-day property work"
        description="Homify keeps listings, approvals, ownership, and tenancy records in one role-based interface."
      />
      <FeatureGrid
        items={[
          {
            title: "Listings and records",
            description:
              "Each dashboard focuses on the tasks a user actually needs to complete.",
            icon: <Gauge className="h-5 w-5" />,
          },
          {
            title: "Secure access",
            description:
              "Account access is role-based so each person sees the right workspace.",
            icon: <ShieldCheck className="h-5 w-5" />,
          },
          {
            title: "Property-specific views",
            description:
              "Property, landlord, and ownership details stay easy to review and update.",
            icon: <Building2 className="h-5 w-5" />,
          },
        ]}
      />
      <Card>
        <CardContent className="grid gap-6 p-6 md:grid-cols-2">
          <div className="space-y-3">
            <p className="text-sm font-medium text-primary">Product layout</p>
            <h2 className="text-2xl font-semibold">
              Clear screens for common actions.
            </h2>
          </div>
          <p className="text-sm text-muted-foreground md:text-base">
            The layout keeps the main actions visible on desktop and mobile so
            users can find listings, approvals, and account screens quickly.
          </p>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Clear onboarding",
            description:
              "Register, verify email, and land in the correct dashboard.",
          },
          {
            title: "Role-based workflows",
            description:
              "Admins, landlords, and users each have focused screens for daily tasks.",
          },
          {
            title: "Operational visibility",
            description:
              "Track listings, approvals, and ownership activity in one platform.",
          },
        ].map((item) => (
          <Card key={item.title} className="border-border/60 bg-card/80">
            <CardContent className="space-y-2 p-5">
              <Sparkles className="h-5 w-5 text-primary" />
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </SiteLayout>
);

export default AboutPage;
