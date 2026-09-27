import { apiRequest } from "./api";

// ==================================================
// TIPOS
// ==================================================

export interface OnboardingIdentityInput {
  displayName: string;
  pronouns: string | null;
  username: string;
}

export type OnboardingRepresentation =
  | "ngo"
  | "company";

export type CollaborationRole =
  | "developer"
  | "designer"
  | "translator"
  | "volunteer";

export interface OnboardingParticipationInput {
  roles: CollaborationRole[];
  representations: OnboardingRepresentation[];
}

interface MessageResponse {
  message: string;
}

// ==================================================
// IDENTIDADE
// ==================================================

export async function saveOnboardingIdentity(
  input: OnboardingIdentityInput,
): Promise<void> {
  await apiRequest<MessageResponse>(
    "/api/account/me/onboarding/identity",
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );
}

// ==================================================
// PARTICIPAÇÃO
// ==================================================

export async function saveOnboardingParticipation(
  input: OnboardingParticipationInput,
): Promise<void> {
  await apiRequest<MessageResponse>(
    "/api/account/me/onboarding/participation",
    {
      method: "PUT",
      body: JSON.stringify({
        roles: input.roles,
        representations:
          input.representations,
      }),
    },
  );
}

// ==================================================
// CONCLUSÃO
// ==================================================

export async function completeOnboarding(): Promise<void> {
  await apiRequest<MessageResponse>(
    "/api/account/me/onboarding/complete",
    {
      method: "POST",
      body: JSON.stringify({}),
    },
  );
}