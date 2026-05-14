import { Link } from "react-router-dom";
import { AuthLayout } from "@/components/layouts/auth-layout";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { Card, CardContent } from "@/components/ui/card";

const ForgotPasswordPage = () => (
  <AuthLayout>
    <div className="space-y-6">
      <Card className="border-border/60 bg-card/80">
        <CardContent className="space-y-4 p-6">
          <p className="text-sm font-medium text-primary">Account recovery</p>
          <h1 className="text-4xl font-semibold tracking-tight">
            Reset access without friction.
          </h1>
          <p className="text-sm text-muted-foreground">
            We’ll email a secure token to recover your account.
          </p>
          <p className="text-sm text-muted-foreground">
            Remembered your password?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Return to sign in
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
    <ForgotPasswordForm />
  </AuthLayout>
);

export default ForgotPasswordPage;
