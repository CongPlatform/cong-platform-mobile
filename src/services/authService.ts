import { apiRequest } from "./api";
import {
  clearSession,
  saveSession,
} from "./sessionStorage";

// ==================================================
// TIPOS
// ==================================================

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  username?: string | null;
  avatarUrl?: string | null;
}

interface LoginApiResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
  user: AuthUser;
}

interface RegisterApiResponse {
  message: string;
  user: Pick<AuthUser, "id" | "name">;
}

interface MeApiResponse {
  user: AuthUser;
}

export interface LoginResult {
  user: AuthUser;
  expiresIn?: number;
}

// ==================================================
// CADASTRO
// ==================================================

export async function register(
  credentials: RegisterCredentials,
): Promise<Pick<AuthUser, "id" | "name">> {
  const response =
    await apiRequest<RegisterApiResponse>(
      "/api/auth/register",
      {
        method: "POST",
        authenticated: false,
        body: JSON.stringify({
          name: credentials.name.trim(),
          email: credentials.email
            .trim()
            .toLowerCase(),
          password: credentials.password,
        }),
      },
    );

  return response.user;
}

// ==================================================
// LOGIN
// ==================================================

export async function login(
  credentials: LoginCredentials,
): Promise<LoginResult> {
  const response =
    await apiRequest<LoginApiResponse>(
      "/api/auth/login",
      {
        method: "POST",
        authenticated: false,
        body: JSON.stringify({
          email: credentials.email
            .trim()
            .toLowerCase(),
          password: credentials.password,
        }),
      },
    );

  await saveSession(
    {
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    },
    credentials.rememberMe ?? false,
  );

  return {
    user: response.user,
    expiresIn: response.expiresIn,
  };
}

// ==================================================
// USUÁRIO AUTENTICADO
// ==================================================

export async function getCurrentUser(): Promise<AuthUser> {
  const response =
    await apiRequest<MeApiResponse>(
      "/api/auth/me",
    );

  return response.user;
}

// ==================================================
// LOGOUT
// ==================================================

export async function logout(): Promise<void> {
  try {
    await apiRequest<void>("/api/auth/logout", {
      method: "POST",
      retryOnUnauthorized: false,
    });
  } finally {
    await clearSession();
  }
}
