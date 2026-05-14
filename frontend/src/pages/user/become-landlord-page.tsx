import { useMutation } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { SectionTitle } from "@/components/common/section-title";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import { landlordApi } from "@/services/api/landlord";
import { unwrapApiError } from "@/services/api/client";

const BecomeLandlordPage = () => {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: landlordApi.becomeLandlord,
    onSuccess: (response) => {
      toast.success(response.message);
      navigate("/dashboard/landlord");
    },
    onError: (error) =>
      toast.error("Application failed", unwrapApiError(error)),
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <SectionTitle
          eyebrow="Landlord access"
          title="Apply for landlord access"
          description="Create and manage property listings after your application is approved by an admin."
        />
        <Card className="border-border/60 bg-card/85">
          <CardContent className="space-y-5 p-6">
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">
                As a landlord, you'll be able to:
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  "Create and publish property listings",
                  "Upload images and detailed descriptions",
                  "Manage property availability and pricing",
                  "Review and update your listed properties",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-border/60 bg-muted/20 p-4"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-500" />
                    <p className="text-sm text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <Button
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending}
              size="lg"
            >
              {mutation.isPending
                ? "Submitting application..."
                : "Submit application"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default BecomeLandlordPage;
