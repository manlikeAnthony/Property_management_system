import axios from "axios";
import { API_BASE_URL } from "@/lib/constants";
import { useAuthStore } from "@/store/auth-store";

declare module "axios" {
  export interface AxiosRequestConfig {
    skipSessionExpiredHandling?: boolean;
  }
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error?.response?.status === 401 &&
      !error.config?.skipSessionExpiredHandling
    ) {
      useAuthStore.getState().clearSession();
      window.dispatchEvent(new Event("homify:session-expired"));
    }

    if (import.meta.env.DEV) {
      // Provide more debug info during development
      // eslint-disable-next-line no-console
      console.debug("API error:", {
        url: error?.config?.url,
        method: error?.config?.method,
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message,
      });
    }

    return Promise.reject(error);
  },
);

export const unwrapApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    // Prefer structured backend message if available
    const response = error.response;
    const serverMessage = response?.data?.message || response?.data?.error;
    if (serverMessage) return serverMessage;

    // Try common validation shape
    if (response?.data?.errors) {
      try {
        const errs = response.data.errors;
        if (Array.isArray(errs)) return errs.map((e) => e.msg || e).join("; ");
        if (typeof errs === "object") return JSON.stringify(errs);
      } catch (_) {}
    }

    return error.message || "Something went wrong. Please try again.";
  }

  return "Something went wrong. Please try again.";
};
