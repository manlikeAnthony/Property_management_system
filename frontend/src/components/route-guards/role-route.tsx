import { Navigate, useLocation } from "react-router-dom";
import type { PropsWithChildren } from "react";
import { useAuthStore } from "@/store/auth-store";
import type { UserRole } from "@/types/user";

type RoleRouteProps = PropsWithChildren<{
  roles: UserRole[];
}>;

export const RoleRoute = ({ roles, children }: RoleRouteProps) => {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const status = useAuthStore((state) => state.status);

  if (status === "loading" || status === "idle") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading session...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const hasAccess = user.roles.some((role) => roles.includes(role));
  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  return children;
};
