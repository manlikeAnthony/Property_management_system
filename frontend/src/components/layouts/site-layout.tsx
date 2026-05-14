import type { PropsWithChildren } from "react";
import { Header } from "@/components/navigation/header";

export const SiteLayout = ({ children }: PropsWithChildren) => (
  <div className="min-h-screen">
    <Header />
    <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      {children}
    </main>
  </div>
);
