import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthSession, User } from "@/types/user";

type AuthState = AuthSession & {
  status: "idle" | "loading" | "authenticated" | "unauthenticated";
  hasBootstrapped: boolean;
  setLoading: () => void;
  setUser: (user: User | null) => void;
  clearSession: () => void;
  markUnauthenticated: () => void;
  markBootstrapped: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      status: "idle",
      hasBootstrapped: false,
      setLoading: () => set({ status: "loading" }),
      setUser: (user) =>
        set({
          user,
          isAuthenticated: Boolean(user),
          status: user ? "authenticated" : "unauthenticated",
        }),
      clearSession: () =>
        set({ user: null, isAuthenticated: false, status: "unauthenticated" }),
      markUnauthenticated: () =>
        set({ user: null, isAuthenticated: false, status: "unauthenticated" }),
      markBootstrapped: () => set({ hasBootstrapped: true }),
    }),
    {
      name: "homify-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        status: state.status,
      }),
    },
  ),
);
