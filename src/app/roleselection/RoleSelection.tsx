import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { saveOnboardingParticipation } from "@/services/onboardingService";
import { useSession } from "@/contexts/SessionContext";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
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

type RoleDefinition = {
  id: CollaborationRole;
  label: string;
  shortLabel: string;
  description: string;
  icon: string;
};

type RepresentationDefinition = {
  id: OnboardingRepresentation;
  label: string;
  shortLabel: string;
  description: string;
  icon: string;
};

type SelectedItem =
  | {
    type: "role";
    item: RoleDefinition;
  }
  | {
    type: "representation";
    item: RepresentationDefinition;
  };

// =========================================================
// OPÇÕES
// =========================================================

const ROLE_DEFINITIONS: readonly RoleDefinition[] = [
  {
    id: "developer",
    label: "Desenvolvedor",
    shortLabel: "Desenvolvedor",
    description:
      "Contribua com código, módulos e melhorias técnicas.",
    icon: "code",
  },
  {
    id: "designer",
    label: "Designer",
    shortLabel: "Designer",
    description:
      "Ajude com interfaces, experiências e templates.",
    icon: "palette",
  },
  {
    id: "translator",
    label: "Tradução e acessibilidade",
    shortLabel: "Tradução",
    description:
      "Amplie o acesso traduzindo conteúdos e recursos.",
    icon: "translate",
  },
  {
    id: "volunteer",
    label: "Voluntário",
    shortLabel: "Voluntário",
    description:
      "Participe de ações e encontre formas práticas de ajudar.",
    icon: "volunteer-activism",
  },
];

const REPRESENTATION_DEFINITIONS: readonly RepresentationDefinition[] = [
  {
    id: "ngo",
    label: "ONG ou projeto social",
    shortLabel: "ONG",
    description:
      "Represente uma organização existente ou cadastre uma nova na CONG.",
    icon: "business",
  },
  {
    id: "company",
    label: "Empresa apoiadora",
    shortLabel: "Empresa",
    description:
      "Represente uma empresa interessada em apoiar organizações e iniciativas.",
    icon: "work-outline",
  },
];

// =========================================================
// COMPONENTE
// =========================================================

export default function RoleSelection() {
  const { signOut, restore } = useSession();
  const [selectedRoles, setSelectedRoles] =
    useState<CollaborationRole[]>([]);

  const [
    selectedRepresentations,
    setSelectedRepresentations,
  ] = useState<OnboardingRepresentation[]>([]);

  const [isSaving, setIsSaving] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  // =======================================================
  // SELEÇÕES
  // =======================================================

  const selectedItems = useMemo<SelectedItem[]>(() => {
    const roles: SelectedItem[] = selectedRoles
      .map((role) =>
        ROLE_DEFINITIONS.find(
          (item) => item.id === role,
        ),
      )
      .filter(
        (item): item is RoleDefinition =>
          Boolean(item),
      )
      .map((item) => ({
        type: "role",
        item,
      }));

    const representations: SelectedItem[] =
      selectedRepresentations
        .map((representation) =>
          REPRESENTATION_DEFINITIONS.find(
            (item) =>
              item.id === representation,
          ),
        )
        .filter(
          (
            item,
          ): item is RepresentationDefinition =>
            Boolean(item),
        )
        .map((item) => ({
          type: "representation",
          item,
        }));

    return [...roles, ...representations];
  }, [
    selectedRoles,
    selectedRepresentations,
  ]);

  const totalSelected = selectedItems.length;

  // =======================================================
  // PERFIS PESSOAIS
  // =======================================================

  function toggleRole(
    role: CollaborationRole,
  ) {
    setSelectedRoles((current) => {
      if (current.includes(role)) {
        return current.filter(
          (item) => item !== role,
        );
      }

      return [...current, role];
    });

    setErrorMessage("");
  }

  // =======================================================
  // REPRESENTAÇÕES
  // =======================================================

  function toggleRepresentation(
    representation: OnboardingRepresentation,
  ) {
    setSelectedRepresentations((current) => {
      if (current.includes(representation)) {
        return current.filter(
          (item) => item !== representation,
        );
      }

      return [...current, representation];
    });

    setErrorMessage("");
  }

  // =======================================================
  // REMOVER
  // =======================================================

  function removeSelectedItem(
    selectedItem: SelectedItem,
  ) {
    if (selectedItem.type === "role") {
      setSelectedRoles((current) =>
        current.filter(
          (item) =>
            item !== selectedItem.item.id,
        ),
      );
    } else {
      setSelectedRepresentations(
        (current) =>
          current.filter(
            (item) =>
              item !== selectedItem.item.id,
          ),
      );
    }

    setErrorMessage("");
  }

  // =======================================================
  // LIMPAR
  // =======================================================

  function clearSelection() {
    setSelectedRoles([]);
    setSelectedRepresentations([]);
    setErrorMessage("");
  }

  // =======================================================
  // CONFIRMAR
  // =======================================================

  async function handleConfirm() {
    if (totalSelected === 0) {
      setErrorMessage(
        "Escolha pelo menos uma forma de participar para continuar.",
      );
      return;
    }

    if (isSaving) {
      return;
    }

    setErrorMessage("");
    setIsSaving(true);

    try {
      await saveOnboardingParticipation({
        roles: selectedRoles,
        representations: selectedRepresentations,
      });

      router.push(
        `/completeprofiles/CompleteProfiles?roles=${encodeURIComponent(
          selectedRoles.join(","),
        )}&representations=${encodeURIComponent(
          selectedRepresentations.join(","),
        )}` as any,
      );
      void restore();
    } catch (error) {
      console.error(
        "Erro ao salvar participação:",
        error,
      );

      setErrorMessage(
        "Não foi possível salvar suas escolhas. Tente novamente.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  // =======================================================
  // LOGOUT
  // =======================================================

  async function handleLogout() {
    await signOut();
    router.replace("/login/Login");
  }



  // =======================================================
  // RENDER
  // =======================================================

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: Colors.pageBackground }}>
    <ScrollView
      style={styles.page}
      contentContainerStyle={
        styles.pageContent
      }
      showsVerticalScrollIndicator={false}
    >
      {/* =================================================
          TOPO
      ================================================= */}

      <View style={styles.topbar}>
        <Text style={styles.logo}>
          CONG
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            pressed &&
            styles.logoutButtonPressed,
          ]}
          onPress={handleLogout}
          disabled={isSaving}
          accessibilityRole="button"
          accessibilityLabel="Sair"
        >
          <MaterialIcons
            name="logout"
            size={18}
            color={Colors.navy}
          />
        </Pressable>
      </View>

      <View style={styles.content}>
        {/* =================================================
            HERO
        ================================================= */}

        <View style={styles.hero}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>
              2 de 2
            </Text>
          </View>

          <View style={styles.eyebrow}>
            <MaterialIcons
              name="auto-awesome"
              size={14}
              color={Colors.primaryDark}
            />

            <Text style={styles.eyebrowText}>
              SEU LUGAR NO BANDO
            </Text>
          </View>

          <Text style={styles.heroTitle}>
            Como você quer participar da{" "}
            <Text style={styles.congTitle}>
              CONG?
            </Text>
          </Text>

          <View
            style={styles.congUnderline}
          />

          <Text style={styles.heroText}>
            Você pode fazer parte do bando de
            mais de uma forma. Escolha perfis
            pessoais, represente uma instituição
            ou combine os dois.
          </Text>

          {/* ===============================================
              AVISO
          =============================================== */}

          <View style={styles.notice}>
            <View style={styles.noticeIcon}>
              <MaterialIcons
                name="info-outline"
                size={17}
                color={Colors.primaryDark}
              />
            </View>

            <Text style={styles.noticeText}>
              <Text
                style={styles.noticeStrong}
              >
                Você poderá adicionar outras
                formas depois.{" "}
              </Text>
              Para continuar agora, escolha pelo
              menos uma.
            </Text>
          </View>
        </View>

        {/* =================================================
            OPÇÕES
        ================================================= */}

        <View style={styles.optionsCard}>
          {/* ===============================================
              COMO PESSOA
          =============================================== */}

          <View style={styles.optionGroup}>
            <Text style={styles.groupTitle}>
              COMO PESSOA
            </Text>

            <View style={styles.optionGrid}>
              {ROLE_DEFINITIONS.map(
                (role) => {
                  const selected =
                    selectedRoles.includes(
                      role.id,
                    );

                  return (
                    <Pressable
                      key={role.id}
                      style={({ pressed }) => [
                        styles.optionCard,

                        selected &&
                        styles.optionCardSelected,

                        pressed &&
                        styles.optionCardPressed,
                      ]}
                      onPress={() =>
                        toggleRole(role.id)
                      }
                      accessibilityRole="button"
                      accessibilityState={{
                        selected,
                      }}
                    >
                      <View
                        style={styles.optionIcon}
                      >
                        <MaterialIcons
                          name={role.icon as any}
                          size={20}
                          color={
                            Colors.primaryDark
                          }
                        />
                      </View>

                      <View
                        style={styles.optionCopy}
                      >
                        <Text
                          style={
                            styles.optionTitle
                          }
                        >
                          {role.label}
                        </Text>

                        <Text
                          style={
                            styles.optionDescription
                          }
                        >
                          {role.description}
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.checkCircle,

                          selected &&
                          styles.checkCircleSelected,
                        ]}
                      >
                        {selected && (
                          <MaterialIcons
                            name="check"
                            size={14}
                            color={Colors.white}
                          />
                        )}
                      </View>
                    </Pressable>
                  );
                },
              )}
            </View>
          </View>

          {/* ===============================================
              INSTITUIÇÕES
          =============================================== */}

          <View
            style={[
              styles.optionGroup,
              styles.institutionGroup,
            ]}
          >
            <Text style={styles.groupTitle}>
              REPRESENTANDO UMA INSTITUIÇÃO
            </Text>

            <View style={styles.optionGrid}>
              {REPRESENTATION_DEFINITIONS.map(
                (representation) => {
                  const selected =
                    selectedRepresentations.includes(
                      representation.id,
                    );

                  return (
                    <Pressable
                      key={representation.id}
                      style={({ pressed }) => [
                        styles.optionCard,

                        selected &&
                        styles.optionCardSelected,

                        pressed &&
                        styles.optionCardPressed,
                      ]}
                      onPress={() =>
                        toggleRepresentation(
                          representation.id,
                        )
                      }
                      accessibilityRole="button"
                      accessibilityState={{
                        selected,
                      }}
                    >
                      <View
                        style={styles.optionIcon}
                      >
                        <MaterialIcons
                          name={
                            representation.icon as any
                          }
                          size={20}
                          color={
                            Colors.primaryDark
                          }
                        />
                      </View>

                      <View
                        style={styles.optionCopy}
                      >
                        <Text
                          style={
                            styles.optionTitle
                          }
                        >
                          {representation.label}
                        </Text>

                        <Text
                          style={
                            styles.optionDescription
                          }
                        >
                          {
                            representation.description
                          }
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.checkCircle,

                          selected &&
                          styles.checkCircleSelected,
                        ]}
                      >
                        {selected && (
                          <MaterialIcons
                            name="check"
                            size={14}
                            color={Colors.white}
                          />
                        )}
                      </View>
                    </Pressable>
                  );
                },
              )}
            </View>
          </View>
        </View>

        {/* =================================================
            SUA PARTICIPAÇÃO
        ================================================= */}

        <View style={styles.selectionCard}>
          <View style={styles.selectionHeading}>
            <View
              style={
                styles.selectionHeadingContent
              }
            >
              <Text
                style={styles.selectionEyebrow}
              >
                SUA PARTICIPAÇÃO
              </Text>

              <Text
                style={styles.selectionTitle}
              >
                {totalSelected === 0
                  ? "Nenhuma escolha ainda"
                  : `${totalSelected} ${totalSelected === 1
                    ? "escolha selecionada"
                    : "escolhas selecionadas"
                  }`}
              </Text>
            </View>

            {totalSelected > 0 && (
              <Pressable
                style={({ pressed }) => [
                  styles.clearButton,

                  pressed &&
                  styles.clearButtonPressed,
                ]}
                onPress={clearSelection}
              >
                <MaterialIcons
                  name="refresh"
                  size={15}
                  color={Colors.slate500}
                />

                <Text
                  style={styles.clearButtonText}
                >
                  Limpar
                </Text>
              </Pressable>
            )}
          </View>

          {/* ===============================================
              NENHUMA SELEÇÃO
          =============================================== */}

          {totalSelected === 0 ? (
            <View style={styles.emptySelection}>
              <View style={styles.emptyIcon}>
                <MaterialIcons
                  name="touch-app"
                  size={22}
                  color={Colors.primaryDark}
                />
              </View>

              <Text
                style={styles.emptySelectionTitle}
              >
                Escolha seu lugar no bando
              </Text>

              <Text
                style={styles.emptySelectionText}
              >
                Toque em uma das opções para
                adicioná-la à sua participação.
              </Text>
            </View>
          ) : (
            <View style={styles.selectedList}>
              {selectedItems.map(
                (selectedItem, index) => (
                  <View
                    key={`${selectedItem.type}-${selectedItem.item.id}`}
                    style={styles.selectedItem}
                  >
                    <View
                      style={styles.selectedOrder}
                    >
                      <Text
                        style={
                          styles.selectedOrderText
                        }
                      >
                        {index + 1}
                      </Text>
                    </View>

                    <MaterialIcons
                      name={
                        selectedItem.item
                          .icon as any
                      }
                      size={17}
                      color={Colors.primaryDark}
                    />

                    <Text
                      style={
                        styles.selectedItemTitle
                      }
                      numberOfLines={1}
                    >
                      {
                        selectedItem.item
                          .shortLabel
                      }
                    </Text>

                    <Pressable
                      style={({ pressed }) => [
                        styles.removeButton,

                        pressed &&
                        styles.removeButtonPressed,
                      ]}
                      onPress={() =>
                        removeSelectedItem(
                          selectedItem,
                        )
                      }
                      accessibilityLabel={`Remover ${selectedItem.item.shortLabel}`}
                    >
                      <MaterialIcons
                        name="close"
                        size={17}
                        color={Colors.slate500}
                      />
                    </Pressable>
                  </View>
                ),
              )}
            </View>
          )}

          {/* ===============================================
              MASCOTE
          =============================================== */}

          <View style={styles.mascotNote}>
            <Image
              source={require(
                "../../../assets/images/HappyCong.png"
              )}
              style={styles.mascot}
              resizeMode="contain"
            />

            <View style={styles.mascotCopy}>
              <Text
                style={styles.mascotTitle}
              >
                Seu bando pode crescer com
                você.
              </Text>

              <Text style={styles.mascotText}>
                Novos perfis poderão ser
                adicionados mais tarde.
              </Text>
            </View>
          </View>

          {/* ===============================================
              ERRO
          =============================================== */}

          {errorMessage ? (
            <View style={styles.error}>
              <MaterialIcons
                name="error-outline"
                size={17}
                color={Colors.dangerDark}
              />

              <Text style={styles.errorText}>
                {errorMessage}
              </Text>
            </View>
          ) : null}

          {/* ===============================================
              CONTINUAR
          =============================================== */}

          <Pressable
            style={({ pressed }) => [
              styles.confirmButton,

              pressed &&
              totalSelected > 0 &&
              styles.confirmButtonPressed,

              (totalSelected === 0 ||
                isSaving) &&
              styles.confirmButtonDisabled,
            ]}
            onPress={() =>
              void handleConfirm()
            }
            disabled={
              totalSelected === 0 || isSaving
            }
            accessibilityRole="button"
          >
            {isSaving ? (
              <ActivityIndicator
                size="small"
                color={Colors.white}
              />
            ) : (
              <>
                <Text
                  style={
                    styles.confirmButtonText
                  }
                >
                  Continuar
                </Text>

                <MaterialIcons
                  name="arrow-forward"
                  size={18}
                  color={Colors.white}
                />
              </>
            )}
          </Pressable>
        </View>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

// =========================================================
// ESTILOS
// =========================================================

const styles = StyleSheet.create({
  // =========================================================
  // PÁGINA
  // =========================================================

  page: {
    flex: 1,
    backgroundColor: Colors.pageBackground,
  },

  pageContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },

  // =========================================================
  // TOPO
  // =========================================================

  topbar: {
    minHeight: 62,

    paddingHorizontal: 13,
    paddingVertical: 10,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    gap: 16,
  },

  logo: {
    color: Colors.ink,

    fontFamily: Fonts.brand,
    fontSize: Fonts["2xl"],
  },

  logoutButton: {
    width: 42,
    height: 42,

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: Colors.border,

    borderRadius: 999,

    backgroundColor: Colors.white,
  },

  logoutButtonPressed: {
    opacity: 0.7,
  },

  // =========================================================
  // CONTEÚDO
  // =========================================================

  content: {
    width: "100%",

    paddingHorizontal: 8,
    paddingTop: 2,
  },

  // =========================================================
  // HERO
  // =========================================================

  hero: {
    alignItems: "center",

    marginBottom: 14,

    paddingHorizontal: 5,
  },

  stepBadge: {
    alignSelf: "center",

    marginBottom: 5,

    paddingHorizontal: 9,
    paddingVertical: 5,

    borderRadius: 999,

    backgroundColor: Colors.primary100,
  },

  stepBadgeText: {
    color: Colors.primaryDark,

    fontFamily: Fonts.bodyBold,
    fontSize: 11,
  },

  eyebrow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 6,
  },

  eyebrowText: {
    color: Colors.primaryDark,

    fontFamily: Fonts.bodyBold,
    fontSize: 11,

    letterSpacing: 0.8,
  },

  heroTitle: {
    marginTop: 5,

    color: Colors.navy,

    fontFamily: Fonts.brand,
    fontSize: 40,

    lineHeight: 42,

    letterSpacing: -1.4,

    textAlign: "center",
  },

  congTitle: {
    color: Colors.navy,
  },

  /*
   * Representa a linha amarela que o Web
   * coloca embaixo de "CONG?".
   */

  congUnderline: {
    width: 105,
    height: 4,

    marginTop: -2,

    alignSelf: "center",

    borderRadius: 999,

    backgroundColor: Colors.accent,

    transform: [
      {
        rotate: "-1.2deg",
      },
    ],
  },

  heroText: {
    width: "100%",

    marginTop: 9,
    paddingHorizontal: 10,

    color: Colors.slate600,

    fontFamily: Fonts.body,
    fontSize: 13,

    lineHeight: 19,

    textAlign: "center",
  },

  // =========================================================
  // AVISO
  // =========================================================

  notice: {
    width: "100%",

    marginTop: 11,

    paddingHorizontal: 11,
    paddingVertical: 10,

    flexDirection: "row",
    alignItems: "center",

    gap: 10,

    borderWidth: 1,
    borderColor: Colors.primary100,

    borderRadius: 12,

    backgroundColor: Colors.white,
  },

  noticeIcon: {
    width: 30,
    height: 30,

    flexShrink: 0,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 10,

    backgroundColor: Colors.primary50,
  },

  noticeText: {
    flex: 1,

    color: Colors.slate600,

    fontFamily: Fonts.body,
    fontSize: 11,

    lineHeight: 16,
  },

  noticeStrong: {
    color: Colors.navy,

    fontFamily: Fonts.bodyBold,
  },

  // =========================================================
  // CARD DE OPÇÕES
  // =========================================================

  optionsCard: {
    padding: 13,

    borderWidth: 1,
    borderColor: Colors.border,

    borderRadius: 19,

    backgroundColor: Colors.white,

    shadowColor: Colors.navy,
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.06,
    shadowRadius: 20,

    elevation: 3,
  },

  optionGroup: {
    width: "100%",
  },

  institutionGroup: {
    marginTop: 14,
  },

  groupTitle: {
    marginHorizontal: 4,
    marginBottom: 7,

    color: Colors.primaryDark,

    fontFamily: Fonts.bodyBold,
    fontSize: Fonts.xs,

    letterSpacing: 0.75,
  },

  optionGrid: {
    width: "100%",

    gap: 8,
  },

  // =========================================================
  // OPÇÃO
  // =========================================================

  optionCard: {
    width: "100%",
    minHeight: 78,

    paddingHorizontal: 10,
    paddingVertical: 9,

    flexDirection: "row",
    alignItems: "center",

    gap: 9,

    borderWidth: 1,
    borderColor: Colors.slate200,

    borderRadius: 13,

    backgroundColor: Colors.white,
  },

  optionCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary50,
  },

  optionCardPressed: {
    opacity: 0.75,
  },

  optionIcon: {
    width: 36,
    height: 36,

    flexShrink: 0,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 11,

    backgroundColor: Colors.primary50,
  },

  optionCopy: {
    flex: 1,
    minWidth: 0,

    gap: 4,
  },

  optionTitle: {
    color: Colors.navy,

    fontFamily: Fonts.bodyBold,
    fontSize: 13,

    lineHeight: 16,
  },

  optionDescription: {
    color: Colors.slate500,

    fontFamily: Fonts.body,
    fontSize: 11,

    lineHeight: 16,
  },

  // =========================================================
  // CHECK
  // =========================================================

  checkCircle: {
    width: 21,
    height: 21,

    flexShrink: 0,

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: Colors.slate300,

    borderRadius: 999,
  },

  checkCircleSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },

  // =========================================================
  // CARD SUA PARTICIPAÇÃO
  // =========================================================

  selectionCard: {
    marginTop: 12,

    padding: 13,

    borderWidth: 1,
    borderColor: Colors.border,

    borderRadius: 19,

    backgroundColor: Colors.white,

    shadowColor: Colors.navy,
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.06,
    shadowRadius: 20,

    elevation: 3,
  },

  selectionHeading: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",

    gap: 16,
  },

  selectionHeadingContent: {
    flex: 1,

    gap: 4,
  },

  selectionEyebrow: {
    color: Colors.primaryDark,

    fontFamily: Fonts.bodyBold,
    fontSize: Fonts.xs,

    letterSpacing: 0.75,
  },

  selectionTitle: {
    color: Colors.navy,

    fontFamily: Fonts.bodyBold,
    fontSize: 14,
  },

  // =========================================================
  // LIMPAR
  // =========================================================

  clearButton: {
    flexDirection: "row",
    alignItems: "center",

    gap: 5,

    paddingVertical: 3,
  },

  clearButtonPressed: {
    opacity: 0.6,
  },

  clearButtonText: {
    color: Colors.slate500,

    fontFamily: Fonts.bodySemiBold,
    fontSize: 11,
  },

  // =========================================================
  // SELEÇÃO VAZIA
  // =========================================================

  emptySelection: {
    minHeight: 110,

    alignItems: "center",
    justifyContent: "center",

    gap: 7,

    paddingVertical: 15,
  },

  emptyIcon: {
    width: 44,
    height: 44,

    marginBottom: 3,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 14,

    backgroundColor: Colors.primary50,
  },

  emptySelectionTitle: {
    color: Colors.navy,

    fontFamily: Fonts.bodyBold,
    fontSize: 13,

    textAlign: "center",
  },

  emptySelectionText: {
    maxWidth: 230,

    color: Colors.slate500,

    fontFamily: Fonts.body,
    fontSize: 11,

    lineHeight: 16,

    textAlign: "center",
  },

  // =========================================================
  // SELECIONADOS
  // =========================================================

  selectedList: {
    marginTop: 15,

    gap: 7,
  },

  selectedItem: {
    width: "100%",
    minHeight: 47,

    paddingHorizontal: 8,
    paddingVertical: 7,

    flexDirection: "row",
    alignItems: "center",

    gap: 7,

    borderWidth: 1,
    borderColor: Colors.primary200,

    borderRadius: 11,

    backgroundColor: Colors.primary50,
  },

  selectedOrder: {
    width: 25,
    height: 25,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 999,

    backgroundColor: Colors.white,
  },

  selectedOrderText: {
    color: Colors.primaryDark,

    fontFamily: Fonts.bodyBold,
    fontSize: 10,
  },

  selectedItemTitle: {
    flex: 1,

    color: Colors.primaryDark,

    fontFamily: Fonts.bodyBold,
    fontSize: 12,
  },

  removeButton: {
    width: 27,
    height: 27,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 8,
  },

  removeButtonPressed: {
    opacity: 0.55,
  },

  // =========================================================
  // MASCOTE
  // =========================================================

  mascotNote: {
    position: "relative",

    minHeight: 78,

    marginTop: 13,

    paddingTop: 12,
    paddingRight: 11,
    paddingBottom: 12,
    paddingLeft: 72,

    flexDirection: "row",
    alignItems: "center",

    borderWidth: 1,
    borderColor: Colors.primary100,

    borderRadius: 15,

    backgroundColor: Colors.primary50,

    overflow: "hidden",
  },

  mascot: {
    position: "absolute",

    left: -5,
    bottom: -8,

    width: 84,
    height: 84,
  },

  mascotCopy: {
    flex: 1,
  },

  mascotTitle: {
    marginBottom: 3,

    color: Colors.navy,

    fontFamily: Fonts.bodyBold,
    fontSize: 12,
  },

  mascotText: {
    color: Colors.slate600,

    fontFamily: Fonts.body,
    fontSize: 11,

    lineHeight: 16,
  },

  // =========================================================
  // ERRO
  // =========================================================

  error: {
    marginTop: 12,

    paddingHorizontal: 13,
    paddingVertical: 12,

    flexDirection: "row",
    alignItems: "flex-start",

    gap: 8,

    borderWidth: 1,
    borderColor: Colors.red200,

    borderRadius: 11,

    backgroundColor: Colors.dangerSoft,
  },

  errorText: {
    flex: 1,

    color: Colors.dangerDark,

    fontFamily: Fonts.body,
    fontSize: 11,

    lineHeight: 16,
  },

  // =========================================================
  // BOTÃO
  // =========================================================

  confirmButton: {
    width: "100%",
    minHeight: 47,

    marginTop: 12,

    paddingHorizontal: 16,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 8,

    borderRadius: 13,

    backgroundColor: Colors.primary,

    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.17,
    shadowRadius: 10,

    elevation: 3,
  },

  confirmButtonPressed: {
    backgroundColor: Colors.primaryDark,
  },

  confirmButtonDisabled: {
    opacity: 0.45,
  },

  confirmButtonText: {
    color: Colors.white,

    fontFamily: Fonts.bodyBold,
    fontSize: Fonts.sm,
  },
});
