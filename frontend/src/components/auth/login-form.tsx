import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/toaster";
import { authApi } from "@/services/api/auth";
import { useAuthStore } from "@/store/auth-store";
import { unwrapApiError } from "@/services/api/client";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginValues = z.infer<typeof schema>;

export const LoginForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const form = useForm<LoginValues>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      setUser(response.data);
      toast.success(response.message);
      const roles = response.data.roles;

      const fromPath = (location.state as { from?: { pathname?: string } })
        ?.from?.pathname;
      if (fromPath?.startsWith("/dashboard")) {
        navigate(fromPath, { replace: true });
        return;
      }

      navigate(
        roles.includes("ADMIN")
          ? "/dashboard/admin"
          : roles.includes("LANDLORD")
            ? "/dashboard/landlord"
            : "/dashboard/user",
        { replace: true },
      );
    },
    onError: (error) => toast.error("Login failed", unwrapApiError(error)),
  });

  return (
    <Card className="border-border/60 bg-card/90 shadow-glow">
      <CardContent className="space-y-5 p-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to manage properties, ownership, and applications.
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
          <Input
            placeholder="Password"
            type="password"
            {...form.register("password")}
          />
          <div className="flex items-center justify-between text-sm">
            <Link
              to="/forgot-password"
              className="text-primary hover:underline"
            >
              Forgot password?
            </Link>
            <Link
              to="/register"
              className="text-muted-foreground hover:text-foreground"
            >
              Create account
            </Link>
          </div>
          <Button
            className="w-full"
            type="submit"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
