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

const schema = z.object({ email: z.string().email() });

export const ForgotPasswordForm = () => {
  const form = useForm<{ email: string }>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: (response) => toast.success(response.message),
    onError: (error) =>
      toast.error("Unable to send reset email", unwrapApiError(error)),
  });

  return (
    <Card className="border-border/60 bg-card/90 shadow-glow">
      <CardContent className="space-y-5 p-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Forgot password</h1>
          <p className="text-sm text-muted-foreground">
            We’ll send a secure reset link to your inbox.
          </p>
        </div>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        >
          <Input
            type="email"
            placeholder="Email address"
            {...form.register("email")}
          />
          <Button
            className="w-full"
            type="submit"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Sending..." : "Send reset link"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
