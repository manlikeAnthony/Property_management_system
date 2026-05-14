import { Link } from "react-router-dom";
import { AuthLayout } from "@/components/layouts/auth-layout";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { Card, CardContent } from "@/components/ui/card";

const ResetPasswordPage = () => (
  <AuthLayout>
    <div className="space-y-6">
      <Card className="border-border/60 bg-card/80">
        <CardContent className="space-y-4 p-6">
          <p className="text-sm font-medium text-primary">Reset password</p>
          <h1 className="text-4xl font-semibold tracking-tight">
            Set a new secure password.
          </h1>
          <p className="text-sm text-muted-foreground">
            Paste the token from the reset email and choose a new password.
          </p>
          <p className="text-sm text-muted-foreground">
            Need the email again?{" "}
            <Link
              to="/forgot-password"
              className="text-primary hover:underline"
            >
              Resend it
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
    <ResetPasswordForm />
  </AuthLayout>
);

export default ResetPasswordPage;
