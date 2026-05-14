import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { SectionTitle } from "@/components/common/section-title";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import { usePropertyQuery } from "@/hooks/use-api-queries";
import { ownershipApi } from "@/services/api/ownership";
import { unwrapApiError } from "@/services/api/client";
import { formatCurrency } from "@/lib/utils";

const PurchasePropertyPage = () => {
  const { id } = useParams();
  const query = usePropertyQuery(id);
  const mutation = useMutation({
    mutationFn: () => ownershipApi.purchaseProperty(id as string),
    onSuccess: (response) => toast.success(response.message),
    onError: (error) => toast.error("Purchase failed", unwrapApiError(error)),
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <SectionTitle
          eyebrow="Purchase"
          title="Complete a property purchase"
          description="Review the listing and submit your purchase request."
        />
        <Card className="border-border/60 bg-card/85">
          <CardContent className="space-y-4 p-6">
            <p className="text-sm text-muted-foreground">Property</p>
            <h2 className="text-2xl font-semibold">
              {query.data?.title ?? "Selected property"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {query.data?.description}
            </p>
            <p className="text-3xl font-semibold">
              {query.data
                ? formatCurrency(query.data.price, query.data.currency)
                : "—"}
            </p>
            <Button
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Processing..." : "Purchase now"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PurchasePropertyPage;
