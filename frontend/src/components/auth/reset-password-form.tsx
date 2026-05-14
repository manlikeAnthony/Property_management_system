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

const schema = z.object({
  email: z.string().email(),
  token: z.string().min(4),
  password: z.string().min(6),
});

export const ResetPasswordForm = () => {
  const form = useForm<{ email: string; token: string; password: string }>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: (response) => toast.success(response.message),
    onError: (error) =>
      toast.error("Unable to reset password", unwrapApiError(error)),
  });

  return (
    <Card className="border-border/60 bg-card/90 shadow-glow">
      <CardContent className="space-y-5 p-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Reset password</h1>
          <p className="text-sm text-muted-foreground">
            Use the email and token from your reset message.
          </p>
        </div>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        >
          <Input
            placeholder="Email address"
            type="email"
            {...form.register("email")}
          />
          <Input placeholder="Reset token" {...form.register("token")} />
          <Input
            placeholder="New password"
            type="password"
            {...form.register("password")}
          />
          <Button
            className="w-full"
            type="submit"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Resetting..." : "Reset password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
