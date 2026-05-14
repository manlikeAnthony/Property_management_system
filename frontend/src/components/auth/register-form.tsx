import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/toaster";
import { authApi } from "@/services/api/auth";
import { unwrapApiError } from "@/services/api/client";

const schema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

type RegisterValues = z.infer<typeof schema>;

export const RegisterForm = () => {
  const navigate = useNavigate();
  const form = useForm<RegisterValues>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (response) => {
      toast.success(response.message);
      navigate(
        `/verify-email?email=${encodeURIComponent(form.getValues("email"))}`,
        { replace: true },
      );
    },
    onError: (error) =>
      toast.error("Registration failed", unwrapApiError(error)),
  });

  return (
    <Card className="border-border/60 bg-card/90 shadow-glow">
      <CardContent className="space-y-5 p-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Create your account</h1>
          <p className="text-sm text-muted-foreground">
            Start managing listings, tenants, and ownership in one place.
          </p>
        </div>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        >
          <Input placeholder="Full name" {...form.register("name")} />
          <Input
            placeholder="Email address"
            type="email"
            {...form.register("email")}
          />
          <Input
            placeholder="Password"
            type="password"
            {...form.register("password")}
          />
          <Button
            className="w-full"
            type="submit"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Creating account..." : "Create account"}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          Already registered?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};
