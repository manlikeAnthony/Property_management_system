import { Link, Navigate } from "react-router-dom";
import { AuthLayout } from "@/components/layouts/auth-layout";
import { LoginForm } from "@/components/auth/login-form";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth-store";

const LoginPage = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (isAuthenticated && user) {
    const destination = user.roles.includes("ADMIN")
      ? "/dashboard/admin"
      : user.roles.includes("LANDLORD")
        ? "/dashboard/landlord"
        : "/dashboard/user";

    return <Navigate to={destination} replace />;
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        <Card className="border-border/60 bg-card/80">
          <CardContent className="space-y-4 p-6">
            <p className="text-sm font-medium text-primary">Homify sign in</p>
            <h1 className="text-4xl font-semibold tracking-tight">
              Access your dashboard and account tools.
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in to continue managing properties and account activity.
            </p>
            <p className="text-sm text-muted-foreground">
              Need an account?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Register here
              </Link>
              .
            </p>
          </CardContent>
        </Card>
      </div>
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;
