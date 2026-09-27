import { apiRequest } from "./api";
import type { RepresentationDraft } from "@/components/profileForms/InstitutionRepresentationForm";
import type { OnboardingRepresentation } from "./onboardingService";

export async function createMyRepresentation(
  type: OnboardingRepresentation,
  draft: RepresentationDraft,
): Promise<void> {
  await apiRequest("/api/account/me/representations", {
    method: "POST",
    body: JSON.stringify({
      ...draft,
      organizationType: type,
      legalName: draft.legalName || undefined,
      cnpj: draft.cnpj || undefined,
      complement: draft.complement || undefined,
    }),
  });
}
