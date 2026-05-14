import { Link, Navigate } from "react-router-dom";
import { AuthLayout } from "@/components/layouts/auth-layout";
import { RegisterForm } from "@/components/auth/register-form";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth-store";

const RegisterPage = () => {
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
            <p className="text-sm font-medium text-primary">Join Homify</p>
            <h1 className="text-4xl font-semibold tracking-tight">
              Build a verified presence in the platform.
            </h1>
            <p className="text-sm text-muted-foreground">
              Register once, then verify your email before accessing your
              role-based workspace.
            </p>
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in here
              </Link>
              .
            </p>
          </CardContent>
        </Card>
      </div>
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterPage;
