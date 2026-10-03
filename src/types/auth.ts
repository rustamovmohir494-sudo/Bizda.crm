export enum UserAuthRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken?: string;
  refreshToken?: string;

  access_token?: string;
  refresh_token?: string;

  token?: string;

  data?: {
    accessToken?: string;
    refreshToken?: string;

    access_token?: string;
    refresh_token?: string;

    token?: string;
  };
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken?: string;
  refreshToken?: string;

  access_token?: string;
  refresh_token?: string;

  data?: {
    accessToken?: string;
    refreshToken?: string;

    access_token?: string;
    refresh_token?: string;
  };
}

export interface Admin {
  id?: number | string;
  email?: string;
  login?: string;

  firstName?: string;
  lastName?: string;

  phone?: string;
  avatar?: string | null;

  role?: UserAuthRole;
  isActive?: boolean;

  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  phone: string;
  avatar: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface AuthContextValue {
  admin: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<void>;

  logout: () => Promise<void>;

  refreshAdmin: () => Promise<void>;
}