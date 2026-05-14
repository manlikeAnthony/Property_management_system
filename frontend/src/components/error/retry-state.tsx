import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

type RetryStateProps = {
  title: string;
  description: string;
  onRetry: () => void;
};

export const RetryState = ({
  title,
  description,
  onRetry,
}: RetryStateProps) => (
  <Card>
    <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
      <Button onClick={onRetry} variant="outline">
        <RefreshCcw className="h-4 w-4" />
        Retry
      </Button>
    </CardContent>
  </Card>
);
