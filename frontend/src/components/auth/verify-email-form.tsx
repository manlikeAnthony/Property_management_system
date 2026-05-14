import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/toaster";
import { authApi } from "@/services/api/auth";
import { unwrapApiError } from "@/services/api/client";

const verifySchema = z.object({
  email: z.string().email(),
  token: z.string().min(4),
});

export const VerifyEmailForm = () => {
  const form = useForm<{ email: string; token: string }>({
    resolver: zodResolver(verifySchema),
  });

  const verifyMutation = useMutation({
    mutationFn: authApi.verifyEmail,
    onSuccess: (response) => toast.success(response.message),
    onError: (error) =>
      toast.error("Verification failed", unwrapApiError(error)),
  });

  const resendMutation = useMutation({
    mutationFn: authApi.resendVerificationEmail,
    onSuccess: (response) => toast.success(response.message),
    onError: (error) =>
      toast.error("Unable to resend email", unwrapApiError(error)),
  });

  return (
    <Card className="border-border/60 bg-card/90 shadow-glow">
      <CardContent className="space-y-5 p-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Verify your email</h1>
          <p className="text-sm text-muted-foreground">
            Enter the token we sent to your inbox.
          </p>
        </div>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((values) =>
            verifyMutation.mutate(values),
          )}
        >
          <Input
            placeholder="Email address"
            type="email"
            {...form.register("email")}
          />
          <Input placeholder="Verification token" {...form.register("token")} />
          <div className="grid gap-3 md:grid-cols-2">
            <Button type="submit" disabled={verifyMutation.isPending}>
              Verify email
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={resendMutation.isPending}
              onClick={() =>
                resendMutation.mutate({ email: form.getValues("email") })
              }
            >
              Resend email
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
