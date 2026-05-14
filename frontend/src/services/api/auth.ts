import { api } from "@/services/api/client";
import type { ApiResponse } from "@/types/api";
import type { User } from "@/types/user";

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type VerifyEmailPayload = {
  email: string;
  token: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  email: string;
  token: string;
  password: string;
};

export type ResendVerificationPayload = {
  email: string;
};

export const authApi = {
  register: async (payload: RegisterPayload) => {
    const { data } = await api.post<ApiResponse<null>>(
      "/auth/register",
      payload,
    );
    return data;
  },
  login: async (payload: LoginPayload) => {
    const { data } = await api.post<ApiResponse<User>>("/auth/login", payload);
    return data;
  },
  logout: async () => {
    const { data } = await api.delete<ApiResponse<null>>("/auth/logout");
    return data;
  },
  verifyEmail: async (payload: VerifyEmailPayload) => {
    const { data } = await api.post<ApiResponse<User>>(
      "/auth/verify-email",
      payload,
    );
    return data;
  },
  forgotPassword: async (payload: ForgotPasswordPayload) => {
    const { data } = await api.post<ApiResponse<null>>(
      "/auth/forgot-password",
      payload,
    );
    return data;
  },
  resetPassword: async (payload: ResetPasswordPayload) => {
    const { data } = await api.post<ApiResponse<null>>(
      "/auth/reset-password",
      payload,
    );
    return data;
  },
  resendVerificationEmail: async (payload: ResendVerificationPayload) => {
    const { data } = await api.post<ApiResponse<User>>(
      "/auth/resend-verification-email",
      payload,
    );
    return data;
  },
};
