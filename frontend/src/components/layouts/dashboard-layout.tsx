import { Menu, Plus } from "lucide-react";
import type { PropsWithChildren } from "react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/navigation/theme-toggle";
import { dashboardNavLinks } from "@/lib/navigation";
import { authApi } from "@/services/api/auth";
import { queryClient } from "@/lib/query-client";
import { toast } from "@/components/ui/toaster";
import { unwrapApiError } from "@/services/api/client";
import { useAuthStore } from "@/store/auth-store";

export const DashboardLayout = ({ children }: PropsWithChildren) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);
  const role = user?.roles[0] ?? "USER";
  const links =
    dashboardNavLinks[role as keyof typeof dashboardNavLinks] ??
    dashboardNavLinks.USER;
  const showCreatePropertyCta = role === "LANDLORD" || role === "ADMIN";

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: (response) => {
      clearSession();
      queryClient.clear();
      toast.success(response.message, "You have been signed out.");
      navigate("/login", { replace: true });
    },
    onError: (error) => {
      clearSession();
      queryClient.clear();
      toast.error("Logout failed", unwrapApiError(error));
      navigate("/login", { replace: true });
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-border/50 bg-card/70 p-5 backdrop-blur-xl xl:block">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-2xl px-2 py-2 transition hover:bg-accent/60"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-sm font-semibold text-primary-foreground">
              H
            </div>
            <div>
              <p className="text-sm font-semibold">Homify</p>
              <p className="text-xs text-muted-foreground">{role} workspace</p>
            </div>
          </Link>

          <div className="mt-6 rounded-2xl border border-border/60 bg-background/60 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Signed in as
            </p>
            <p className="mt-1 text-sm font-medium">
              {user?.name ?? "Account"}
            </p>
            <p className="text-xs text-muted-foreground">{user?.email ?? ""}</p>
          </div>

          {showCreatePropertyCta ? (
            <Button className="mt-6 w-full" asChild>
              <Link to="/dashboard/landlord/create-property">
                <Plus className="h-4 w-4" />
                Create Property
              </Link>
            </Button>
          ) : null}

          <nav className="mt-6 space-y-2">
            {links.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  `block rounded-2xl px-4 py-3 text-sm font-medium transition ${isActive ? "bg-primary/10 text-foreground ring-1 ring-primary/20" : "text-muted-foreground hover:-translate-y-0.5 hover:bg-accent hover:text-accent-foreground"}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <Button
            className="mt-8 w-full"
            variant="outline"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? "Signing out..." : "Sign out"}
          </Button>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-border/50 bg-background/65 px-4 py-4 backdrop-blur-xl transition-all duration-300 sm:px-6 lg:px-8 supports-[backdrop-filter]:bg-background/55">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 xl:hidden">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setOpen((current) => !current)}
                >
                  <Menu className="h-4 w-4" />
                </Button>
                <div>
                  <p className="text-sm font-semibold">Homify</p>
                  <p className="text-xs text-muted-foreground">
                    {role} dashboard
                  </p>
                </div>
              </div>
              <div className="hidden xl:block">
                <p className="text-sm font-semibold">Dashboard</p>
                <p className="text-xs text-muted-foreground">
                  Workspace for property tasks
                </p>
              </div>
              <div className="flex items-center gap-3">
                {showCreatePropertyCta ? (
                  <Button size="sm" asChild>
                    <Link to="/dashboard/landlord/create-property">
                      <Plus className="h-4 w-4" />
                      Create Property
                    </Link>
                  </Button>
                ) : null}
                <ThemeToggle />
                <Button variant="outline" size="sm" asChild>
                  <Link to="/">Open site</Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                >
                  Sign out
                </Button>
              </div>
            </div>
          </header>

          {open ? (
            <div className="xl:hidden">
              <Card className="m-4 border-border/60 bg-card/95 p-4 shadow-soft">
                {showCreatePropertyCta ? (
                  <Button className="mb-3 w-full" asChild>
                    <Link
                      to="/dashboard/landlord/create-property"
                      onClick={() => setOpen(false)}
                    >
                      <Plus className="h-4 w-4" />
                      Create Property
                    </Link>
                  </Button>
                ) : null}
                <nav className="space-y-1">
                  {links.map((link) => (
                    <NavLink
                      key={link.href}
                      to={link.href}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `block rounded-xl px-4 py-3 text-sm font-medium transition ${isActive ? "bg-primary/10 text-foreground ring-1 ring-primary/20" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"}`
                      }
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </nav>
                <Button
                  className="mt-4 w-full"
                  variant="outline"
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                >
                  {logoutMutation.isPending ? "Signing out..." : "Sign out"}
                </Button>
              </Card>
            </div>
          ) : null}

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
};
