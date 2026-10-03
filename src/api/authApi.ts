import { apiRequest } from "./client";

import {
  clearTokens,
  getRefreshToken,
  setTokens,
} from "./token";

import type {
  Admin,
  ChangePasswordRequest,
  LoginRequest,
  LoginResponse,
  RefreshResponse,
  UpdateProfileRequest,
} from "../types/auth";

/* =========================
   RESPONSE TYPES
========================= */

interface AdminResponse {
  success: boolean;
  data: Admin;
}

interface ProfileUpdateResponse {
  success: boolean;
  data: {
    firstName: string;
    lastName: string;
    phone: string;
    avatar: string;
  };
}

/* =========================
   TOKEN HELPERS
========================= */

function extractAccessToken(
  data: LoginResponse | RefreshResponse
): string | null {
  const responseData =
    data?.data ?? data;

  return (
    responseData?.accessToken ??
    responseData?.access_token ??
    null
  );
}

function extractRefreshToken(
  data: LoginResponse | RefreshResponse
): string | null {
  const responseData =
    data?.data ?? data;

  return (
    responseData?.refreshToken ??
    responseData?.refresh_token ??
    null
  );
}

/* =========================
   LOGIN
========================= */

export async function loginAdmin(
  payload: LoginRequest
): Promise<LoginResponse> {
  const response =
    await apiRequest<LoginResponse>(
      "/api/admin/auth/login",
      {
        method: "POST",
        auth: false,
        body: JSON.stringify(payload),
      }
    );

  const accessToken =
    extractAccessToken(response);

  const refreshToken =
    extractRefreshToken(response);

  if (!accessToken) {
    throw new Error(
      "Login muvaffaqiyatli bo'lmadi: access token kelmadi."
    );
  }

  setTokens(
    accessToken,
    refreshToken ?? undefined
  );

  return response;
}

/* =========================
   REFRESH TOKEN
========================= */

export async function refreshAccessToken(): Promise<string> {
  const refreshToken =
    getRefreshToken();

  if (!refreshToken) {
    throw new Error(
      "Refresh token mavjud emas."
    );
  }

  const response =
    await apiRequest<RefreshResponse>(
      "/api/admin/auth/refresh",
      {
        method: "POST",
        auth: false,
        body: JSON.stringify({
          refreshToken,
        }),
      }
    );

  const accessToken =
    extractAccessToken(response);

  const newRefreshToken =
    extractRefreshToken(response);

  if (!accessToken) {
    throw new Error(
      "Yangi access token kelmadi."
    );
  }

  setTokens(
    accessToken,
    newRefreshToken ?? undefined
  );

  return accessToken;
}

/* =========================
   GET CURRENT ADMIN
========================= */

export async function getCurrentAdmin(): Promise<Admin> {
  const response =
    await apiRequest<AdminResponse>(
      "/api/admin/auth/me",
      {
        method: "GET",
        auth: true,
      }
    );

  return response.data;
}

/* =========================
   UPDATE PROFILE
========================= */

export async function updateAdminProfile(
  payload: UpdateProfileRequest
): Promise<ProfileUpdateResponse> {
  const response =
    await apiRequest<ProfileUpdateResponse>(
      "/api/admin/auth/profile",
      {
        method: "PATCH",
        auth: true,
        body: JSON.stringify(payload),
      }
    );

  return response;
}

/* =========================
   CHANGE PASSWORD
========================= */

export async function changeAdminPassword(
  payload: ChangePasswordRequest
): Promise<void> {
  await apiRequest<void>(
    "/api/admin/auth/change-password",
    {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(payload),
    }
  );
}

/* =========================
   LOGOUT
========================= */

export async function logoutAdmin(): Promise<void> {
  const refreshToken =
    getRefreshToken();

  try {
    if (refreshToken) {
      await apiRequest<void>(
        "/api/admin/auth/logout",
        {
          method: "POST",
          auth: false,
          body: JSON.stringify({
            refreshToken,
          }),
        }
      );
    }
  } catch {
    // Backend logout xato bersa ham
    // tokenlarni o'chiramiz.
  } finally {
    clearTokens();
  }
}
