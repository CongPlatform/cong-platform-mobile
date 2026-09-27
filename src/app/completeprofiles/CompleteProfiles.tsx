import { SafeAreaView } from "react-native-safe-area-context";
import DeveloperProfileForm, {
  type DeveloperProfileFormData,
} from "@/components/profileForms/DeveloperProfileForm";

import DesignerProfileForm, {
  type DesignerProfileFormData,
} from "@/components/profileForms/DesignerProfileForm";

import TranslatorProfileForm, {
  type TranslatorProfileFormData,
} from "@/components/profileForms/TranslatorProfileForm";

import VolunteerProfileForm, {
  type VolunteerProfileFormData,
} from "@/components/profileForms/VolunteerProfileForm";

import InstitutionRepresentationForm, {
  type RepresentationDraft,
} from "@/components/profileForms/InstitutionRepresentationForm";

import {
  createCollaborationProfile,
  type CollaborationProfileData,
} from "@/services/collaborationProfileService";

import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useSession } from "@/contexts/SessionContext";
import { completeOnboarding } from "@/services/onboardingService";
import { createMyRepresentation } from "@/services/representationService";
import { useEffect, useMemo, useState } from "react";

import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
  StyleSheet,
} from "react-native";


// =========================================================
// TIPOS
// =========================================================

type CollaborationRole =
  | "developer"
  | "designer"
  | "translator"
  | "volunteer";

type OnboardingRepresentation =
  | "ngo"
  | "company";

type WorkspaceKey =
  | `role:${CollaborationRole}`
  | `representation:${OnboardingRepresentation}`;

type WorkspaceItem = {
  key: WorkspaceKey;
  label: string;
  icon: string;
  type: "role" | "representation";
};

type RepresentationMode =
  | "choose"
  | "create";

interface PersonalDraftMap {
  developer: DeveloperProfileFormData;
  designer: DesignerProfileFormData;
  translator: TranslatorProfileFormData;
  volunteer: VolunteerProfileFormData;
}

// =========================================================
// LABELS
// =========================================================

const ROLE_LABELS: Record<
  CollaborationRole,
  string
> = {
  developer: "Desenvolvedor",
  designer: "Designer",
  translator: "Tradução e acessibilidade",
  volunteer: "Voluntário",
};

const ROLE_ICONS: Record<
  CollaborationRole,
  string
> = {
  developer: "code",
  designer: "palette",
  translator: "translate",
  volunteer: "person-outline",
};

const REPRESENTATION_LABELS: Record<
  OnboardingRepresentation,
  string
> = {
  ngo: "ONG ou projeto social",
  company: "Empresa apoiadora",
};

const REPRESENTATION_ICONS: Record<
  OnboardingRepresentation,
  string
> = {
  ngo: "business",
  company: "work-outline",
};

// =========================================================
// HELPERS
// =========================================================

function roleKey(
  role: CollaborationRole,
): WorkspaceKey {
  return `role:${role}`;
}

function representationKey(
  representation: OnboardingRepresentation,
): WorkspaceKey {
  return `representation:${representation}`;
}

function isCollaborationRole(
  value: string,
): value is CollaborationRole {
  return (
    value === "developer" ||
    value === "designer" ||
    value === "translator" ||
    value === "volunteer"
  );
}

function isRepresentation(
  value: string,
): value is OnboardingRepresentation {
  return (
    value === "ngo" ||
    value === "company"
  );
}

function parseParam(
  value: string | string[] | undefined,
): string[] {
  if (!value) {
    return [];
  }

  const rawValue = Array.isArray(value)
    ? value[0]
    : value;

  if (!rawValue) {
    return [];
  }

  return rawValue
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

// =========================================================
// DRAFTS
// =========================================================

function createDeveloperDraft(): DeveloperProfileFormData {
  return {
    technologies: [],
    experienceLevel: "",
    portfolioUrl: "",
  };
}

function createDesignerDraft(): DesignerProfileFormData {
  return {
    specialties: [],
    tools: [],
    portfolioUrl: "",
  };
}

function createTranslatorDraft(): TranslatorProfileFormData {
  return {
    languages: [],
    accessibilitySkills: [],
    notes: "",
  };
}

function createVolunteerDraft(): VolunteerProfileFormData {
  return {
    causes: [],
    interestAreas: [],
    availability: "",

    location: {
      city: "",
      state: "",
      radiusKm: 10,
      remote: false,
    },

    availabilityDetails: {
      days: [],
      periods: [],
      frequency: undefined,
    },

    opportunityPreference: "both",
  };
}

function createRepresentationDraft(): RepresentationDraft {
  return {
    name: "",
    legalName: "",
    cnpj: "",
    email: "",
    phone: "",
    description: "",
    cep: "",
    street: "",
    district: "",
    number: "",
    complement: "",
    city: "",
    state: "",
    initiativeKind: "formal",
    areas: [],
    supportTypes: [],
  };
}

// =========================================================
// COMPONENTE
// =========================================================

export default function CompleteProfiles() {
  const { restore } = useSession();
  const [finishError, setFinishError] = useState("");
  const params = useLocalSearchParams<{
    roles?: string;
    representations?: string;
  }>();

  // =======================================================
  // OPÇÕES VINDAS DO ROLE SELECTION
  // =======================================================

  const roles = useMemo<
    CollaborationRole[]
  >(() => {
    return parseParam(params.roles).filter(
      isCollaborationRole,
    );
  }, [params.roles]);

  const representationTypes = useMemo<
    OnboardingRepresentation[]
  >(() => {
    return parseParam(
      params.representations,
    ).filter(isRepresentation);
  }, [params.representations]);

  // =======================================================
  // WORKSPACE
  // =======================================================

  const workspaceItems =
    useMemo<WorkspaceItem[]>(() => {
      const roleItems =
        roles.map<WorkspaceItem>(
          (role) => ({
            key: roleKey(role),
            label: ROLE_LABELS[role],
            icon: ROLE_ICONS[role],
            type: "role",
          }),
        );

      const representationItems =
        representationTypes.map<WorkspaceItem>(
          (representation) => ({
            key: representationKey(
              representation,
            ),
            label:
              REPRESENTATION_LABELS[
              representation
              ],
            icon:
              REPRESENTATION_ICONS[
              representation
              ],
            type: "representation",
          }),
        );

      return [
        ...roleItems,
        ...representationItems,
      ];
    }, [roles, representationTypes]);

  const [activeKey, setActiveKey] =
    useState<WorkspaceKey | null>(
      null,
    );

  useEffect(() => {
    if (
      !activeKey &&
      workspaceItems.length > 0
    ) {
      setActiveKey(
        workspaceItems[0].key,
      );
    }
  }, [activeKey, workspaceItems]);

  // =======================================================
  // ESTADOS
  // =======================================================

  const [
    completedItems,
    setCompletedItems,
  ] = useState<WorkspaceKey[]>([]);

  const [saving, setSaving] =
    useState(false);

  const [
    welcomeOpen,
    setWelcomeOpen,
  ] = useState(false);

  const [
    representationMode,
    setRepresentationMode,
  ] =
    useState<RepresentationMode>(
      "choose",
    );

  // =======================================================
  // DRAFTS DOS PERFIS
  // =======================================================

  const [
    developerDraft,
    setDeveloperDraft,
  ] = useState<DeveloperProfileFormData>(
    createDeveloperDraft,
  );

  const [
    designerDraft,
    setDesignerDraft,
  ] = useState<DesignerProfileFormData>(
    createDesignerDraft,
  );

  const [
    translatorDraft,
    setTranslatorDraft,
  ] =
    useState<TranslatorProfileFormData>(
      createTranslatorDraft,
    );

  const [
    volunteerDraft,
    setVolunteerDraft,
  ] =
    useState<VolunteerProfileFormData>(
      createVolunteerDraft,
    );

  const [
    representationDrafts,
    setRepresentationDrafts,
  ] = useState<
    Record<
      OnboardingRepresentation,
      RepresentationDraft
    >
  >({
    ngo: createRepresentationDraft(),
    company:
      createRepresentationDraft(),
  });

  // =======================================================
  // ITEM ATUAL
  // =======================================================

  const activeItem =
    workspaceItems.find(
      (item) =>
        item.key === activeKey,
    ) ?? null;

  const activeRole:
    | CollaborationRole
    | null =
    activeItem?.type === "role"
      ? (activeItem.key.replace(
        "role:",
        "",
      ) as CollaborationRole)
      : null;

  const activeRepresentation:
    | OnboardingRepresentation
    | null =
    activeItem?.type ===
      "representation"
      ? (activeItem.key.replace(
        "representation:",
        "",
      ) as OnboardingRepresentation)
      : null;

  // =======================================================
  // PROGRESSO
  // =======================================================

  const completedCount =
    workspaceItems.filter((item) =>
      completedItems.includes(
        item.key,
      ),
    ).length;

  const totalCount =
    workspaceItems.length;

  const allCompleted =
    totalCount > 0 &&
    completedCount === totalCount;

  const progress =
    totalCount === 0
      ? 0
      : (completedCount /
        totalCount) *
      100;

  // =======================================================
  // MARCAR COMO CONCLUÍDO
  // =======================================================

  function markCompleted(
    key: WorkspaceKey,
  ) {
    setCompletedItems(
      (current) => {
        if (
          current.includes(key)
        ) {
          return current;
        }

        return [
          ...current,
          key,
        ];
      },
    );
  }

  // =======================================================
  // PRÓXIMO ITEM
  // =======================================================

  function moveToNext(
    currentKey: WorkspaceKey,
  ) {
    const currentIndex =
      workspaceItems.findIndex(
        (item) =>
          item.key ===
          currentKey,
      );

    const nextItem =
      workspaceItems[
      currentIndex + 1
      ];

    if (nextItem) {
      setActiveKey(
        nextItem.key,
      );

      setRepresentationMode(
        "choose",
      );
    }
  }

  // =======================================================
  // SALVAR PERFIL
  // =======================================================

  async function saveRole<
    R extends CollaborationRole,
  >(
    role: R,
    data: PersonalDraftMap[R],
  ) {
    if (saving) {
      return;
    }

    setSaving(true);

    try {
      let profileData: CollaborationProfileData;

      if (role === "developer") {
        const developerData =
          data as PersonalDraftMap["developer"];

        setDeveloperDraft(developerData);

        if (!developerData.experienceLevel) {
          throw new Error(
            "Selecione seu nível de experiência.",
          );
        }

        profileData = {
          technologies:
            developerData.technologies,

          experienceLevel:
            developerData.experienceLevel,

          portfolioUrl:
            developerData.portfolioUrl.trim() ||
            undefined,
        };
      } else if (role === "designer") {
        const designerData =
          data as PersonalDraftMap["designer"];

        setDesignerDraft(designerData);

        profileData = {
          specialties:
            designerData.specialties,
          tools:
            designerData.tools,
          portfolioUrl:
            designerData.portfolioUrl.trim() ||
            undefined,
        };
      } else if (role === "translator") {
        const translatorData =
          data as PersonalDraftMap["translator"];

        setTranslatorDraft(translatorData);

        profileData = {
          languages:
            translatorData.languages,
          accessibilitySkills:
            translatorData.accessibilitySkills,
          notes:
            translatorData.notes.trim() ||
            undefined,
        };
      } else {
        const volunteerData =
          data as PersonalDraftMap["volunteer"];

        setVolunteerDraft(volunteerData);

        if (
          !volunteerData.location ||
          !volunteerData.availabilityDetails ||
          !volunteerData.availabilityDetails.frequency
        ) {
          throw new Error(
            "Dados obrigatórios do perfil de voluntário não foram preenchidos.",
          );
        }

        profileData = {
          causes:
            volunteerData.causes,

          interestAreas:
            volunteerData.interestAreas,

          availability:
            volunteerData.availability.trim() ||
            undefined,

          location: {
            city:
              volunteerData.location.city?.trim() ??
              "",
            state:
              volunteerData.location.state?.trim() ??
              "",
            radiusKm:
              volunteerData.location.radiusKm ??
              10,
            remote:
              volunteerData.location.remote,
          },

          availabilityDetails: {
            days:
              volunteerData.availabilityDetails.days,

            periods:
              volunteerData.availabilityDetails.periods,

            frequency:
              volunteerData.availabilityDetails.frequency,
          },

          opportunityPreference:
            volunteerData.opportunityPreference,
        };
      }

      await createCollaborationProfile(
        role,
        profileData,
      );

      const key = roleKey(role);

      markCompleted(key);
      moveToNext(key);
    } catch (error) {
      console.error(
        `Erro ao salvar perfil ${role}:`,
        error,
      );
    } finally {
      setSaving(false);
    }
  }

  // =======================================================
  // REPRESENTAÇÃO
  // =======================================================

  function updateRepresentationDraft<
    K extends keyof RepresentationDraft,
  >(
    field: K,
    value: RepresentationDraft[K],
  ) {
    if (
      !activeRepresentation
    ) {
      return;
    }

    const type =
      activeRepresentation;

    setRepresentationDrafts(
      (current) => ({
        ...current,

        [type]: {
          ...current[type],
          [field]: value,
        },
      }),
    );
  }

  async function saveRepresentation() {
    if (
      !activeRepresentation ||
      saving
    ) {
      return;
    }

    setSaving(true);

    try {
      await createMyRepresentation(
        activeRepresentation,
        representationDrafts[activeRepresentation],
      );
      const key =
        representationKey(
          activeRepresentation,
        );

      markCompleted(key);

      setRepresentationMode(
        "choose",
      );

      moveToNext(key);
    } catch (error) {
      console.error("Erro ao cadastrar representação:", error);
      setFinishError("Não foi possível cadastrar a organização. Confira os dados e tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  // =======================================================
  // REVER ESCOLHAS
  // =======================================================

  function handleReviewChoices() {
    router.replace(
      "/roleselection/RoleSelection",
    );
  }

  // =======================================================
  // FINALIZAR
  // =======================================================

  function handleFinish() {
    if (
      !allCompleted ||
      saving
    ) {
      return;
    }

    setWelcomeOpen(true);
  }

  async function handleFinishOnboarding() {
    if (saving) return;
    setSaving(true);
    setFinishError("");
    setFinishError("");
    try {
      await completeOnboarding();
      const account = await restore();
      if (account?.onboardingStep !== "completed") {
        throw new Error("Não foi possível confirmar a conclusão do cadastro.");
      }
      setWelcomeOpen(false);
      router.replace("/(tabs)/community");
    } catch {
      setFinishError("Não foi possível concluir seu cadastro. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  // =======================================================
  // SEM PERFIS
  // =======================================================

  if (
    workspaceItems.length === 0
  ) {
    return (
      <View
        style={
          styles.emptyPage
        }
      >
        <MaterialIcons
          name="person-search"
          size={42}
          color={Colors.primary}
        />

        <Text
          style={
            styles.emptyPageTitle
          }
        >
          Nenhum perfil selecionado
        </Text>

        <Text
          style={
            styles.emptyPageText
          }
        >
          Volte e escolha pelo menos
          uma forma de participar da
          CONG.
        </Text>

        <Pressable
          style={
            styles.emptyPageButton
          }
          onPress={
            handleReviewChoices
          }
        >
          <Text
            style={
              styles.emptyPageButtonText
            }
          >
            Escolher perfis
          </Text>
        </Pressable>
      </View>
    );
  }

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <SafeAreaView edges={["top"]} style={styles.page}>
      {/* =================================================
          TOPO
      ================================================= */}

      <View style={styles.topbar}>
        <Text style={styles.logo}>
          CONG
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed &&
            styles.buttonPressed,
          ]}
          onPress={
            handleReviewChoices
          }
          disabled={saving}
        >
          <MaterialIcons
            name="arrow-back"
            size={17}
            color={
              Colors.primaryDark
            }
          />

          <Text
            style={
              styles.backButtonText
            }
          >
            Rever escolhas
          </Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
        keyboardShouldPersistTaps="handled"
      >
        {/* =================================================
            HERO
        ================================================= */}

        <View style={styles.hero}>
          <Text
            style={styles.eyebrow}
          >
            SEU LUGAR NO BANDO
          </Text>

          <View
            style={
              styles.titleWrapper
            }
          >
            <Text
              style={styles.title}
            >
              Complete seus{" "}
              <Text
                style={
                  styles.titleAccentText
                }
              >
                perfis
              </Text>
            </Text>

            <View
              style={
                styles.titleAccentLine
              }
            />
          </View>

          <Text
            style={styles.subtitle}
          >
            Complete as informações
            essenciais para ativar suas
            formas de participação.
          </Text>
        </View>

        {/* =================================================
            PROGRESSO + NAVEGAÇÃO
        ================================================= */}

        <View style={styles.sidebar}>
          <View
            style={
              styles.progressHeader
            }
          >
            <View
              style={
                styles.progressMeta
              }
            >
              <Text
                style={
                  styles.progressLabel
                }
              >
                PROGRESSO
              </Text>

              <Text
                style={
                  styles.progressValue
                }
              >
                {completedCount} de{" "}
                {totalCount} concluídos
              </Text>
            </View>

            <View
              style={
                styles.progressTrack
              }
            >
              <View
                style={[
                  styles.progressBar,
                  {
                    width:
                      `${Math.min(
                        100,
                        Math.max(
                          0,
                          progress,
                        ),
                      )}%` as `${number}%`,
                  },
                ]}
              />
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={
              false
            }
            contentContainerStyle={
              styles.navigation
            }
          >
            {workspaceItems.map(
              (item) => {
                const active =
                  activeKey ===
                  item.key;

                const completed =
                  completedItems.includes(
                    item.key,
                  );

                return (
                  <Pressable
                    key={item.key}
                    style={({
                      pressed,
                    }) => [
                        styles.navItem,

                        active &&
                        styles.navItemActive,

                        pressed &&
                        styles.buttonPressed,
                      ]}
                    onPress={() => {
                      setActiveKey(
                        item.key,
                      );

                      if (
                        item.type ===
                        "representation"
                      ) {
                        setRepresentationMode(
                          "choose",
                        );
                      }
                    }}
                  >
                    <View
                      style={
                        styles.navIcon
                      }
                    >
                      <MaterialIcons
                        name={
                          item.icon as any
                        }
                        size={17}
                        color={
                          Colors.primaryDark
                        }
                      />
                    </View>

                    <View
                      style={
                        styles.navCopy
                      }
                    >
                      <Text
                        style={
                          styles.navTitle
                        }
                        numberOfLines={
                          1
                        }
                      >
                        {item.label}
                      </Text>

                      <Text
                        style={
                          styles.navStatus
                        }
                      >
                        {completed
                          ? item.type ===
                            "representation"
                            ? "Configurada"
                            : "Concluído"
                          : active
                            ? "Em edição"
                            : "Pendente"}
                      </Text>
                    </View>

                    <View
                      style={
                        styles.statusIcon
                      }
                    >
                      <MaterialIcons
                        name={
                          completed
                            ? "check-circle"
                            : "radio-button-unchecked"
                        }
                        size={18}
                        color={
                          completed ||
                            active
                            ? Colors.primary
                            : Colors.slate300
                        }
                      />
                    </View>
                  </Pressable>
                );
              },
            )}
          </ScrollView>
        </View>

        {/* =================================================
            PAINEL
        ================================================= */}

        <View style={styles.panel}>
          <View
            style={
              styles.panelAccent
            }
          />

          {activeItem ? (
            <>
              <View
                style={
                  styles.profileHeading
                }
              >
                <View
                  style={
                    styles.profileIcon
                  }
                >
                  <MaterialIcons
                    name={
                      activeItem.icon as any
                    }
                    size={22}
                    color={
                      Colors.primaryDark
                    }
                  />
                </View>

                <View
                  style={
                    styles.profileHeadingCopy
                  }
                >
                  <Text
                    style={
                      styles.profileEyebrow
                    }
                  >
                    {activeItem.type ===
                      "role"
                      ? "SEU PERFIL"
                      : "REPRESENTAÇÃO"}
                  </Text>

                  <Text
                    style={
                      styles.profileTitle
                    }
                  >
                    {activeItem.label}
                  </Text>
                </View>
              </View>

              {/* =========================================
                  DESENVOLVEDOR
              ========================================= */}

              {activeRole ===
                "developer" && (
                  <DeveloperProfileForm
                    technologies={
                      developerDraft.technologies
                    }
                    experienceLevel={
                      developerDraft.experienceLevel
                    }
                    portfolioUrl={
                      developerDraft.portfolioUrl
                    }
                    completed={completedItems.includes(
                      roleKey(
                        "developer",
                      ),
                    )}
                    saving={saving}
                    onTechnologiesChange={(
                      technologies,
                    ) =>
                      setDeveloperDraft(
                        (current) => ({
                          ...current,
                          technologies,
                        }),
                      )
                    }
                    onExperienceLevelChange={(
                      experienceLevel,
                    ) =>
                      setDeveloperDraft(
                        (current) => ({
                          ...current,
                          experienceLevel,
                        }),
                      )
                    }
                    onPortfolioUrlChange={(
                      portfolioUrl,
                    ) =>
                      setDeveloperDraft(
                        (current) => ({
                          ...current,
                          portfolioUrl,
                        }),
                      )
                    }
                    onSubmit={(data) =>
                      saveRole(
                        "developer",
                        data,
                      )
                    }
                  />
                )}

              {/* =========================================
                  DESIGNER
              ========================================= */}

              {activeRole ===
                "designer" && (
                  <DesignerProfileForm
                    specialties={
                      designerDraft.specialties
                    }
                    tools={
                      designerDraft.tools
                    }
                    portfolioUrl={
                      designerDraft.portfolioUrl
                    }
                    completed={completedItems.includes(
                      roleKey(
                        "designer",
                      ),
                    )}
                    saving={saving}
                    onSpecialtiesChange={(
                      specialties,
                    ) =>
                      setDesignerDraft(
                        (current) => ({
                          ...current,
                          specialties,
                        }),
                      )
                    }
                    onToolsChange={(
                      tools,
                    ) =>
                      setDesignerDraft(
                        (current) => ({
                          ...current,
                          tools,
                        }),
                      )
                    }
                    onPortfolioUrlChange={(
                      portfolioUrl,
                    ) =>
                      setDesignerDraft(
                        (current) => ({
                          ...current,
                          portfolioUrl,
                        }),
                      )
                    }
                    onSubmit={(data) =>
                      saveRole(
                        "designer",
                        data,
                      )
                    }
                  />
                )}

              {/* =========================================
                  TRADUTOR
              ========================================= */}

              {activeRole ===
                "translator" && (
                  <TranslatorProfileForm
                    languages={
                      translatorDraft.languages
                    }
                    accessibilitySkills={
                      translatorDraft.accessibilitySkills
                    }
                    notes={
                      translatorDraft.notes
                    }
                    completed={completedItems.includes(
                      roleKey(
                        "translator",
                      ),
                    )}
                    saving={saving}
                    onLanguagesChange={(
                      languages,
                    ) =>
                      setTranslatorDraft(
                        (current) => ({
                          ...current,
                          languages,
                        }),
                      )
                    }
                    onAccessibilitySkillsChange={(
                      accessibilitySkills,
                    ) =>
                      setTranslatorDraft(
                        (current) => ({
                          ...current,
                          accessibilitySkills,
                        }),
                      )
                    }
                    onNotesChange={(
                      notes,
                    ) =>
                      setTranslatorDraft(
                        (current) => ({
                          ...current,
                          notes,
                        }),
                      )
                    }
                    onSubmit={(data) =>
                      saveRole(
                        "translator",
                        data,
                      )
                    }
                  />
                )}

              {/* =========================================
                  VOLUNTÁRIO
              ========================================= */}

              {activeRole ===
                "volunteer" && (
                  <VolunteerProfileForm
                    causes={
                      volunteerDraft.causes
                    }
                    interestAreas={
                      volunteerDraft.interestAreas
                    }
                    availability={
                      volunteerDraft.availability
                    }
                    location={
                      volunteerDraft.location
                    }
                    availabilityDetails={
                      volunteerDraft.availabilityDetails
                    }
                    opportunityPreference={
                      volunteerDraft.opportunityPreference
                    }
                    completed={completedItems.includes(
                      roleKey(
                        "volunteer",
                      ),
                    )}
                    saving={saving}
                    onChange={(
                      data,
                    ) =>
                      setVolunteerDraft(
                        data,
                      )
                    }
                    onOpenParticipationChoices={
                      handleReviewChoices
                    }
                    onSubmit={(data) =>
                      saveRole(
                        "volunteer",
                        data,
                      )
                    }
                  />
                )}

              {/* =========================================
                  REPRESENTAÇÃO
              ========================================= */}

              {activeRepresentation && (
                <View
                  style={
                    styles.representationArea
                  }
                >
                  {completedItems.includes(
                    representationKey(
                      activeRepresentation,
                    ),
                  ) ? (
                    <View
                      style={
                        styles.completedCard
                      }
                    >
                      <View
                        style={
                          styles.completedIcon
                        }
                      >
                        <MaterialIcons
                          name="check"
                          size={20}
                          color={
                            Colors.greenVivid
                          }
                        />
                      </View>

                      <View
                        style={
                          styles.completedCopy
                        }
                      >
                        <Text
                          style={
                            styles.completedTitle
                          }
                        >
                          Representação
                          configurada
                        </Text>

                        <Text
                          style={
                            styles.completedText
                          }
                        >
                          As informações
                          desta representação
                          já foram
                          preenchidas.
                        </Text>

                        <Pressable
                          style={
                            styles.editRepresentationButton
                          }
                          onPress={() =>
                            setRepresentationMode(
                              "create",
                            )
                          }
                        >
                          <Text
                            style={
                              styles.editRepresentationText
                            }
                          >
                            Editar dados
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  ) : representationMode ===
                    "choose" ? (
                    <View
                      style={
                        styles.choiceGrid
                      }
                    >
                      <Pressable
                        style={({
                          pressed,
                        }) => [
                            styles.choiceCard,
                            pressed &&
                            styles.buttonPressed,
                          ]}
                        onPress={() =>
                          setRepresentationMode(
                            "create",
                          )
                        }
                      >
                        <View
                          style={
                            styles.choiceIcon
                          }
                        >
                          <MaterialIcons
                            name="add-business"
                            size={24}
                            color={
                              Colors.primaryDark
                            }
                          />
                        </View>

                        <Text
                          style={
                            styles.choiceTitle
                          }
                        >
                          {activeRepresentation ===
                            "ngo"
                            ? "Cadastrar organização ou iniciativa"
                            : "Cadastrar empresa"}
                        </Text>

                        <Text
                          style={
                            styles.choiceText
                          }
                        >
                          {activeRepresentation ===
                            "ngo"
                            ? "Cadastre uma organização formal, projeto independente ou ação pontual."
                            : "Cadastre os dados essenciais da empresa apoiadora."}
                        </Text>

                        <View
                          style={
                            styles.choiceAction
                          }
                        >
                          <Text
                            style={
                              styles.choiceActionText
                            }
                          >
                            Cadastrar
                          </Text>

                          <MaterialIcons
                            name="arrow-forward"
                            size={17}
                            color={
                              Colors.primary
                            }
                          />
                        </View>
                      </Pressable>
                    </View>
                  ) : (
                    <>
                    {finishError ? <Text style={{ color: Colors.error, marginBottom: 12 }}>{finishError}</Text> : null}
                    <InstitutionRepresentationForm
                      type={
                        activeRepresentation
                      }
                      draft={
                        representationDrafts[
                        activeRepresentation
                        ]
                      }
                      saving={saving}
                      onBack={() =>
                        setRepresentationMode(
                          "choose",
                        )
                      }
                      onChange={
                        updateRepresentationDraft
                      }
                      onSubmit={
                        saveRepresentation
                      }
                    />
                    </>
                  )}
                </View>
              )}
            </>
          ) : null}
        </View>

        {/* =================================================
            MASCOTE
        ================================================= */}

        <View
          style={styles.bandoCard}
        >
          <Image
            source={require(
              "../../../assets/images/HappyCong.png"
            )}
            style={
              styles.bandoMascot
            }
            resizeMode="contain"
          />

          <View
            style={styles.bandoCopy}
          >
            <Text
              style={
                styles.bandoTitle
              }
            >
              Tá quase!
            </Text>

            <Text
              style={
                styles.bandoText
              }
            >
              Complete cada item para
              liberar seu acesso ao
              restante da CONG.
            </Text>
          </View>
        </View>

        {/* =================================================
            FINALIZAR
        ================================================= */}

        <Pressable
          style={({ pressed }) => [
            styles.finishButton,

            !allCompleted &&
            styles.finishButtonDisabled,

            pressed &&
            allCompleted &&
            styles.finishButtonPressed,
          ]}
          disabled={
            !allCompleted ||
            saving
          }
          onPress={handleFinish}
        >
          <MaterialIcons
            name="check"
            size={18}
            color={
              allCompleted
                ? Colors.white
                : Colors.slate500
            }
          />

          <Text
            style={[
              styles.finishButtonText,

              !allCompleted &&
              styles.finishButtonTextDisabled,
            ]}
          >
            Finalizar perfis
          </Text>
        </Pressable>
      </ScrollView>

      {/* ===================================================
          MODAL FINAL
      =================================================== */}

      <Modal
        visible={welcomeOpen}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setWelcomeOpen(false)
        }
      >
        <View
          style={
            styles.modalOverlay
          }
        >
          <View
            style={styles.modalCard}
          >
            <Image
              source={require(
                "../../../assets/images/HappyCong.png"
              )}
              style={
                styles.welcomeMascot
              }
              resizeMode="contain"
            />

            <Text
              style={
                styles.welcomeTitle
              }
            >
              Seu lugar no bando está
              pronto!
            </Text>

            <Text
              style={
                styles.welcomeText
              }
            >
              Seus perfis foram
              configurados. Agora você já
              pode explorar a CONG e
              encontrar novas formas de
              participar.
            </Text>
            {finishError ? (
              <Text style={{ color: Colors.error, textAlign: "center", marginBottom: 12 }}>
                {finishError}
              </Text>
            ) : null}

            <Pressable
              style={({ pressed }) => [
                styles.welcomeButton,
                pressed &&
                styles.buttonPressed,
              ]}
              onPress={
                handleFinishOnboarding
              }
            >
              <Text
                style={
                  styles.welcomeButtonText
                }
              >
                {saving ? "Concluindo..." : "Entrar na CONG"}
              </Text>

              <MaterialIcons
                name="arrow-forward"
                size={18}
                color={Colors.white}
              />
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// =========================================================
// ESTILOS
// =========================================================

const styles = StyleSheet.create({
  // =========================================================
  // BASE
  // =========================================================

  page: {
    flex: 1,
    backgroundColor: Colors.paper,
  },

  scroll: {
    flex: 1,
  },

  content: {
    width: "100%",
    paddingHorizontal: 14,
    paddingTop: 18,
    paddingBottom: 40,
  },

  buttonPressed: {
    opacity: 0.72,
  },

  // =========================================================
  // TOPO
  // =========================================================

  topbar: {
    minHeight: 58,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate200,
    backgroundColor: Colors.white,
  },

  logo: {
    color: Colors.ink,
    fontFamily: Fonts.brand,
    fontSize: 22,
  },

  backButton: {
    minHeight: 36,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 9,
  },

  backButtonText: {
    color: Colors.primaryDark,
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
  },

  // =========================================================
  // HERO
  // =========================================================

  hero: {
    alignItems: "center",
    gap: 7,
    marginBottom: 20,
    paddingHorizontal: 8,
  },

  eyebrow: {
    color: Colors.primary,
    fontFamily: Fonts.bodyExtraBold,
    fontSize: 11,
    letterSpacing: 1.1,
  },

  titleWrapper: {
    position: "relative",
    alignItems: "center",
  },

  title: {
    color: Colors.ink,
    fontFamily: Fonts.bodyExtraBold,
    fontSize: 32,
    lineHeight: 39,
    textAlign: "center",
  },

  titleAccentText: {
    color: Colors.ink,
  },

  titleAccentLine: {
    width: 84,
    height: 6,
    marginTop: -2,
    marginLeft: 105,
    borderRadius: 999,
    backgroundColor: Colors.accent,
    transform: [
      {
        rotate: "-1deg",
      },
    ],
  },

  subtitle: {
    width: "100%",
    maxWidth: 500,
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },

  // =========================================================
  // PROGRESSO / NAVEGAÇÃO
  // =========================================================

  sidebar: {
    width: "100%",
    marginBottom: 12,
    padding: 12,
    gap: 11,
    borderWidth: 1,
    borderColor: Colors.slate200,
    borderRadius: 15,
    backgroundColor: Colors.white,
  },

  progressHeader: {
    gap: 8,
  },

  progressMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  progressLabel: {
    color: Colors.primaryDark,
    fontFamily: Fonts.bodyExtraBold,
    fontSize: 10,
    letterSpacing: 0.8,
  },

  progressValue: {
    flexShrink: 1,
    color: Colors.ink,
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    textAlign: "right",
  },

  progressTrack: {
    width: "100%",
    height: 5,
    overflow: "hidden",
    borderRadius: 999,
    backgroundColor: Colors.slate200,
  },

  progressBar: {
    height: 5,
    borderRadius: 999,
    backgroundColor: Colors.primary,
  },

  navigation: {
    gap: 8,
    paddingRight: 4,
  },

  navItem: {
    width: 190,
    minHeight: 60,
    paddingHorizontal: 9,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.slate200,
    borderRadius: 12,
    backgroundColor: Colors.white,
  },

  navItemActive: {
    borderColor: Colors.primary200,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    backgroundColor: Colors.primary50,
  },

  navIcon: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: Colors.primary50,
  },

  navCopy: {
    flex: 1,
    gap: 2,
  },

  navTitle: {
    color: Colors.ink,
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
  },

  navStatus: {
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 11,
  },

  statusIcon: {
    width: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  // =========================================================
  // PAINEL
  // =========================================================

  panel: {
    position: "relative",
    width: "100%",
    overflow: "hidden",
    padding: 17,
    paddingTop: 23,
    borderWidth: 1,
    borderColor: Colors.slate200,
    borderRadius: 17,
    backgroundColor: Colors.white,
  },

  panelAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 5,
    backgroundColor: Colors.accent,
  },

  profileHeading: {
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },

  profileIcon: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
    backgroundColor: Colors.primary50,
  },

  profileHeadingCopy: {
    flex: 1,
    gap: 2,
  },

  profileEyebrow: {
    color: Colors.primary,
    fontFamily: Fonts.bodyExtraBold,
    fontSize: 10,
    letterSpacing: 0.9,
  },

  profileTitle: {
    color: Colors.ink,
    fontFamily: Fonts.bodyExtraBold,
    fontSize: 20,
  },

  // =========================================================
  // REPRESENTAÇÃO
  // =========================================================

  representationArea: {
    width: "100%",
    gap: 14,
  },

  choiceGrid: {
    width: "100%",
    gap: 12,
  },

  choiceCard: {
    width: "100%",
    minHeight: 160,
    padding: 17,
    gap: 9,
    borderWidth: 1,
    borderColor: Colors.slate200,
    borderRadius: 15,
    backgroundColor: Colors.white,
  },

  choiceIcon: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: Colors.primary50,
  },

  choiceTitle: {
    color: Colors.ink,
    fontFamily: Fonts.bodyExtraBold,
    fontSize: 15,
    lineHeight: 20,
  },

  choiceText: {
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 13,
    lineHeight: 19,
  },

  choiceAction: {
    marginTop: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  choiceActionText: {
    color: Colors.primary,
    fontFamily: Fonts.bodyExtraBold,
    fontSize: 13,
  },

  // =========================================================
  // REPRESENTAÇÃO CONCLUÍDA
  // =========================================================

  completedCard: {
    width: "100%",
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 11,
    borderWidth: 1,
    borderColor: Colors.slate200,
    borderRadius: 14,
    backgroundColor: Colors.slate50,
  },

  completedIcon: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    backgroundColor: Colors.secondary50,
  },

  completedCopy: {
    flex: 1,
    gap: 4,
  },

  completedTitle: {
    color: Colors.ink,
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
  },

  completedText: {
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 13,
    lineHeight: 19,
  },

  editRepresentationButton: {
    alignSelf: "flex-start",
    marginTop: 4,
  },

  editRepresentationText: {
    color: Colors.primaryDark,
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
  },

  // =========================================================
  // MASCOTE
  // =========================================================

  bandoCard: {
    width: "100%",
    minHeight: 100,
    marginTop: 13,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.slate200,
    borderRadius: 15,
    backgroundColor: Colors.white,
  },

  bandoMascot: {
    width: 76,
    height: 76,
  },

  bandoCopy: {
    flex: 1,
    gap: 3,
  },

  bandoTitle: {
    color: Colors.ink,
    fontFamily: Fonts.bodyExtraBold,
    fontSize: 15,
  },

  bandoText: {
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 13,
    lineHeight: 19,
  },

  // =========================================================
  // FINALIZAR
  // =========================================================

  finishButton: {
    width: "100%",
    minHeight: 46,
    marginTop: 13,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    borderRadius: 11,
    backgroundColor: Colors.primary,
  },

  finishButtonDisabled: {
    backgroundColor: Colors.slate100,
    borderWidth: 1,
    borderColor: Colors.slate200,
  },

  finishButtonPressed: {
    opacity: 0.82,
  },

  finishButtonText: {
    color: Colors.white,
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
  },

  finishButtonTextDisabled: {
    color: Colors.slate500,
  },

  // =========================================================
  // SEM PERFIL
  // =========================================================

  emptyPage: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: Colors.paper,
  },

  emptyPageTitle: {
    color: Colors.ink,
    fontFamily: Fonts.bodyExtraBold,
    fontSize: 20,
    textAlign: "center",
  },

  emptyPageText: {
    width: "100%",
    maxWidth: 330,
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },

  emptyPageButton: {
    minHeight: 43,
    marginTop: 5,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: Colors.accent,
  },

  emptyPageButtonText: {
    color: Colors.ink,
    fontFamily: Fonts.bodyExtraBold,
    fontSize: 14,
  },

  // =========================================================
  // MODAL FINAL
  // =========================================================

  modalOverlay: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:
      "rgba(9, 22, 38, 0.48)",
  },

  modalCard: {
    width: "100%",
    maxWidth: 480,
    padding: 23,
    alignItems: "center",
    gap: 9,
    borderRadius: 20,
    backgroundColor: Colors.white,
  },

  welcomeMascot: {
    width: 115,
    height: 115,
    marginBottom: 2,
  },

  welcomeTitle: {
    color: Colors.ink,
    fontFamily: Fonts.bodyExtraBold,
    fontSize: 22,
    lineHeight: 28,
    textAlign: "center",
  },

  welcomeText: {
    width: "100%",
    color: Colors.muted,
    fontFamily: Fonts.body,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },

  welcomeButton: {
    width: "100%",
    minHeight: 45,
    marginTop: 7,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    borderRadius: 10,
    backgroundColor: Colors.primary,
  },

  welcomeButtonText: {
    color: Colors.white,
    fontFamily: Fonts.bodyExtraBold,
    fontSize: 14,
  },
});
