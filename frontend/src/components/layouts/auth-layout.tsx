import type { PropsWithChildren } from "react";
import { SiteLayout } from "@/components/layouts/site-layout";

export const AuthLayout = ({ children }: PropsWithChildren) => (
  <SiteLayout>
    <div className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      {children}
    </div>
  </SiteLayout>
);
