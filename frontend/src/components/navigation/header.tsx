import { LogOut, Menu, UserCircle2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/navigation/theme-toggle";
import { authLinks, publicNavLinks } from "@/lib/navigation";
import { authApi } from "@/services/api/auth";
import { queryClient } from "@/lib/query-client";
import { toast } from "@/components/ui/toaster";
import { unwrapApiError } from "@/services/api/client";
import { useAuthStore } from "@/store/auth-store";

export const Header = () => {
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);

  const dashboardHref = useMemo(() => {
    if (user?.roles.includes("ADMIN")) return "/dashboard/admin";
    if (user?.roles.includes("LANDLORD")) return "/dashboard/landlord";
    return "/dashboard/user";
  }, [user]);

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: (response) => {
      clearSession();
      queryClient.clear();
      setAccountOpen(false);
      toast.success(response.message, "You have been signed out.");
      navigate("/login", { replace: true });
    },
    onError: (error) => {
      clearSession();
      queryClient.clear();
      setAccountOpen(false);
      toast.error("Logout failed", unwrapApiError(error));
      navigate("/login", { replace: true });
    },
  });

  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/65 backdrop-blur-xl transition-all duration-300 supports-[backdrop-filter]:bg-background/55">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-sm font-semibold text-primary-foreground shadow-soft">
            H
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight">Homify</p>
            <p className="text-xs text-muted-foreground">
              Property management workspace
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {publicNavLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                `rounded-xl px-4 py-2 text-sm font-medium transition ${isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {isAuthenticated ? (
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setAccountOpen((current) => !current)}
              >
                <UserCircle2 className="h-4 w-4" />
                {user?.name ?? "Account"}
              </Button>
              {accountOpen ? (
                <div className="absolute right-0 top-[calc(100%+0.75rem)] w-64 rounded-2xl border border-border/60 bg-card/95 p-2 shadow-soft backdrop-blur-xl">
                  <div className="space-y-1 border-b border-border/60 px-3 py-3">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                  <div className="p-2">
                    <Link
                      to={dashboardHref}
                      onClick={() => setAccountOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-foreground transition hover:bg-accent"
                    >
                      <UserCircle2 className="h-4 w-4" />
                      Open dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={() => logoutMutation.mutate()}
                      className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-500/10 dark:text-rose-300"
                      disabled={logoutMutation.isPending}
                    >
                      <LogOut className="h-4 w-4" />
                      {logoutMutation.isPending ? "Signing out..." : "Sign out"}
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link to={authLinks[0].href}>{authLinks[0].label}</Link>
              </Button>
              <Button asChild>
                <Link to={authLinks[1].href}>{authLinks[1].label}</Link>
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setOpen((current) => !current)}
            aria-label="Toggle navigation menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="md:hidden"
          >
            <Card className="mx-4 mb-4 overflow-hidden border-border/60 bg-card/95 p-3 shadow-soft">
              <div className="space-y-1">
                {publicNavLinks.map((link) => (
                  <NavLink
                    key={link.href}
                    to={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
                  >
                    {link.label}
                  </NavLink>
                ))}
                <div className="flex gap-3 px-4 py-3">
                  {isAuthenticated ? (
                    <>
                      <Button className="w-full" asChild>
                        <Link to={dashboardHref}>Dashboard</Link>
                      </Button>
                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => logoutMutation.mutate()}
                        disabled={logoutMutation.isPending}
                      >
                        <LogOut className="h-4 w-4" />
                        {logoutMutation.isPending
                          ? "Signing out..."
                          : "Sign out"}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" className="w-full" asChild>
                        <Link to="/login">Login</Link>
                      </Button>
                      <Button className="w-full" asChild>
                        <Link to="/register">Register</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
};
