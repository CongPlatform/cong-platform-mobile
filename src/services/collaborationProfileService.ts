import { apiRequest } from "./api";

// ==================================================
// TIPOS
// ==================================================

export type CollaborationRole =
  | "developer"
  | "designer"
  | "translator"
  | "volunteer";

export type DeveloperExperienceLevel =
  | "beginner"
  | "intermediate"
  | "advanced";

export type VolunteerOpportunityPreference =
  | "recurring"
  | "punctual"
  | "both";

export type VolunteerFrequency =
  | "punctual"
  | "monthly"
  | "weekly"
  | "flexible";

// ==================================================
// DESENVOLVEDOR
// ==================================================

export interface DeveloperProfileData {
  technologies: string[];
  experienceLevel: DeveloperExperienceLevel;
  portfolioUrl?: string;
}

// ==================================================
// DESIGNER
// ==================================================

export interface DesignerProfileData {
  specialties: string[];
  tools: string[];
  portfolioUrl?: string;
}

// ==================================================
// TRADUTOR / ACESSIBILIDADE
// ==================================================

export interface TranslatorProfileData {
  languages: string[];
  accessibilitySkills: string[];
  notes?: string;
}

// ==================================================
// VOLUNTÁRIO
// ==================================================

export interface VolunteerLocation {
  city: string;
  state: string;
  radiusKm: number;
  remote: boolean;
}

export interface VolunteerAvailabilityDetails {
  days: string[];
  periods: string[];
  frequency: VolunteerFrequency;
}

export interface VolunteerProfileData {
  interestAreas: string[];
  availability?: string;
  causes: string[];
  location: VolunteerLocation;
  availabilityDetails: VolunteerAvailabilityDetails;
  opportunityPreference: VolunteerOpportunityPreference;
}

// ==================================================
// PROFILE DATA
// ==================================================

export type CollaborationProfileData =
  | DeveloperProfileData
  | DesignerProfileData
  | TranslatorProfileData
  | VolunteerProfileData;

// ==================================================
// PERFIL RETORNADO PELO BACKEND
// ==================================================

export interface CollaborationProfile {
  id: string;
  role: CollaborationRole;
  profileData: CollaborationProfileData;
  isActive: boolean;
}

// ==================================================
// RESPOSTAS
// ==================================================

interface CollaborationProfilesResponse {
  profiles: CollaborationProfile[];
}

interface CollaborationProfileResponse {
  profile: CollaborationProfile;
}

// ==================================================
// LISTAR PERFIS
// ==================================================

export async function listCollaborationProfiles(): Promise<
  CollaborationProfile[]
> {
  const response =
    await apiRequest<CollaborationProfilesResponse>(
      "/api/account/me/collaboration-profiles",
      {
        method: "GET",
      },
    );

  return response.profiles;
}

// ==================================================
// CRIAR PERFIL
// ==================================================

export async function createCollaborationProfile(
  role: CollaborationRole,
  profileData: CollaborationProfileData,
): Promise<CollaborationProfile> {
  const response =
    await apiRequest<CollaborationProfileResponse>(
      "/api/account/me/collaboration-profiles",
      {
        method: "POST",
        body: JSON.stringify({
          role,
          profileData,
        }),
      },
    );

  return response.profile;
}

// ==================================================
// ATUALIZAR PERFIL
// ==================================================

export async function updateCollaborationProfile(
  profileId: string,
  profileData: CollaborationProfileData,
): Promise<CollaborationProfile> {
  const response =
    await apiRequest<CollaborationProfileResponse>(
      `/api/account/me/collaboration-profiles/${profileId}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          profileData,
        }),
      },
    );

  return response.profile;
}

// ==================================================
// ATIVAR PERFIL
// ==================================================

export async function activateCollaborationProfile(
  profileId: string,
): Promise<CollaborationProfile> {
  const response =
    await apiRequest<CollaborationProfileResponse>(
      "/api/account/me/collaboration-profiles/active",
      {
        method: "PATCH",
        body: JSON.stringify({
          profileId,
        }),
      },
    );

  return response.profile;
}

// ==================================================
// EXCLUIR PERFIL
// ==================================================

export async function deleteCollaborationProfile(
  profileId: string,
): Promise<void> {
  await apiRequest<void>(
    `/api/account/me/collaboration-profiles/${profileId}`,
    {
      method: "DELETE",
    },
  );
}