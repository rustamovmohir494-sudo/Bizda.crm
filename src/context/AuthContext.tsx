import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getCurrentAdmin,
  loginAdmin,
  logoutAdmin,
  refreshAccessToken,
} from "../api/authApi";

import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
} from "../api/token";

import type {
  Admin,
  AuthContextValue,
} from "../types/auth";

const AuthContext =
  createContext<
    AuthContextValue | undefined
  >(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [admin, setAdmin] =
    useState<Admin | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const loadAdmin =
    useCallback(async () => {
      const accessToken =
        getAccessToken();

      const refreshToken =
        getRefreshToken();

      if (!accessToken && !refreshToken) {
        setAdmin(null);
        setIsLoading(false);
        return;
      }

      try {
        const currentAdmin =
          await getCurrentAdmin();

        setAdmin(currentAdmin);
        return;
      } catch {
        if (!refreshToken) {
          clearTokens();
          setAdmin(null);
          return;
        }

        try {
          await refreshAccessToken();

          const currentAdmin =
            await getCurrentAdmin();

          setAdmin(currentAdmin);
        } catch {
          clearTokens();
          setAdmin(null);
        }
      } finally {
        setIsLoading(false);
      }
    }, []);

  useEffect(() => {
    void loadAdmin();
  }, [loadAdmin]);

  const login =
    useCallback(
      async (
        email: string,
        password: string,
      ) => {
        await loginAdmin({
          email,
          password,
        });

        const currentAdmin =
          await getCurrentAdmin();

        setAdmin(currentAdmin);
      },
      [],
    );

  const logout =
    useCallback(async () => {
      await logoutAdmin();

      setAdmin(null);
    }, []);

  const refreshAdmin =
    useCallback(async () => {
      const currentAdmin =
        await getCurrentAdmin();

      setAdmin(currentAdmin);
    }, []);

  const value =
    useMemo<AuthContextValue>(
      () => ({
        admin,
        isAuthenticated:
          Boolean(admin),
        isLoading,
        login,
        logout,
        refreshAdmin,
      }),
      [
        admin,
        isLoading,
        login,
        logout,
        refreshAdmin,
      ],
    );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider",
    );
  }

  return context;
}

