import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { userApi } from "@/services/api/user";
import { useAuthStore } from "@/store/auth-store";

const PUBLIC_AUTH_ROUTES = new Set([
  "/login",
  "/register",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
]);

export const AuthBootstrap = () => {
  const location = useLocation();
  const status = useAuthStore((state) => state.status);
  const hasBootstrapped = useAuthStore((state) => state.hasBootstrapped);
  const setLoading = useAuthStore((state) => state.setLoading);
  const setUser = useAuthStore((state) => state.setUser);
  const markUnauthenticated = useAuthStore(
    (state) => state.markUnauthenticated,
  );
  const markBootstrapped = useAuthStore((state) => state.markBootstrapped);

  useEffect(() => {
    if (PUBLIC_AUTH_ROUTES.has(location.pathname)) {
      return;
    }

    if (hasBootstrapped || status === "loading" || status === "authenticated") {
      return;
    }

    let mounted = true;

    const hydrate = async () => {
      setLoading();

      try {
        const response = await userApi.currentUser({
          skipSessionExpiredHandling: true,
        });

        if (mounted) setUser(response.data);
      } catch {
        if (mounted) markUnauthenticated();
      } finally {
        if (mounted) markBootstrapped();
      }
    };

    hydrate();

    return () => {
      mounted = false;
    };
  }, [
    hasBootstrapped,
    location.pathname,
    markBootstrapped,
    markUnauthenticated,
    setLoading,
    setUser,
    status,
  ]);

  return null;
};
