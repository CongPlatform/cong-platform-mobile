import { apiRequest } from "./api";

// ==================================================
// TIPOS
// ==================================================

export type AccountAuthProvider = "email" | "google" | "github";

export interface AccountAuthentication {
  email: string;
  emailVerified: boolean;
  providers: AccountAuthProvider[];
}

export interface AccountUser {
  id: string;
  name: string;
  displayName: string | null;
  pronouns: string | null;
  username: string | null;
  bio: string | null;
  avatarPath: string | null;
  authentication: AccountAuthentication;
  onboardingStep:
    | "identity"
    | "roles"
    | "profiles"
    | "completed";
  onboardingRoles: string[];
  onboardingRepresentations: string[];
  createdAt: string;
  updatedAt: string;
}

interface UsernameAvailabilityApiResponse {
  username: string;
  available: boolean;
}

interface UpdateAccountApiResponse {
  message: string;
  user: AccountUser;
}

export interface UpdateAccountInput {
  name?: string;
  displayName?: string;
  pronouns?: string | null;
  username?: string;
  bio?: string | null;
}

// ==================================================
// DISPONIBILIDADE DO USERNAME
// ==================================================

export async function checkUsernameAvailability(
  username: string,
): Promise<boolean> {
  const normalizedUsername = username
    .trim()
    .replace(/^@+/, "")
    .toLowerCase();

  const response =
    await apiRequest<UsernameAvailabilityApiResponse>(
      `/api/account/me/username-availability?username=${encodeURIComponent(
        normalizedUsername,
      )}`,
    );

  return response.available;
}

// ==================================================
// CARREGAR CONTA
// ==================================================

export async function getMyAccount(): Promise<AccountUser> {
  const response = await apiRequest<{ user: AccountUser }>(
    "/api/account/me",
  );

  return response.user;
}

// ==================================================
// ATUALIZAR CONTA
// ==================================================

export async function updateAccount(
  data: UpdateAccountInput,
): Promise<AccountUser> {
  const response =
    await apiRequest<UpdateAccountApiResponse>(
      "/api/account/me",
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
    );

  return response.user;
}
