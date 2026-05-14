import { useSearchParams, Link } from "react-router-dom";
import { AuthLayout } from "@/components/layouts/auth-layout";
import { VerifyEmailForm } from "@/components/auth/verify-email-form";
import { Card, CardContent } from "@/components/ui/card";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") ?? "";

  return (
    <AuthLayout>
      <div className="space-y-6">
        <Card className="border-border/60 bg-card/80">
          <CardContent className="space-y-4 p-6">
            <p className="text-sm font-medium text-primary">Verify email</p>
            <h1 className="text-4xl font-semibold tracking-tight">
              Confirm your account and unlock the platform.
            </h1>
            <p className="text-sm text-muted-foreground">
              If you did not receive the message, resend the verification email
              from this page.
            </p>
            <p className="text-sm text-muted-foreground">
              Back to{" "}
              <Link to="/login" className="text-primary hover:underline">
                login
              </Link>
              .
            </p>
          </CardContent>
        </Card>
      </div>
      <VerifyEmailForm />
      <input type="hidden" value={email} />
    </AuthLayout>
  );
};

export default VerifyEmailPage;
