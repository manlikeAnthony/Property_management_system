import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/layouts/site-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const NotFoundPage = () => (
  <SiteLayout>
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="max-w-xl border-border/60 bg-card/90 text-center">
        <CardContent className="space-y-4 p-8">
          <p className="text-sm font-medium text-primary">404</p>
          <h1 className="text-4xl font-semibold tracking-tight">
            This page does not exist.
          </h1>
          <p className="text-sm text-muted-foreground">
            Use the navigation or return home to continue browsing Homify.
          </p>
          <Button asChild>
            <Link to="/">Go home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  </SiteLayout>
);

export default NotFoundPage;
