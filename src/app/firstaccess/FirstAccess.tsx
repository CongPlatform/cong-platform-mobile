import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { getCurrentUser } from "@/services/authService";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import { router } from "expo-router";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  StyleSheet,
} from "react-native";
import { checkUsernameAvailability } from "@/services/accountService";
import { saveOnboardingIdentity } from "@/services/onboardingService";
import { useSession } from "@/contexts/SessionContext";


// =========================================================
// TIPOS
// =========================================================

type PronounValue =
  | "ele/dele"
  | "ela/dela"
  | "elu/delu"
  | null;

type PronounOption = {
  id: string;
  label: string;
  value: PronounValue;
};

type UsernameAvailabilityState =
  | {
    state: "idle";
  }
  | {
    state: "checking";
  }
  | {
    state: "available";
    username: string;
  }
  | {
    state: "unavailable";
    username: string;
  }
  | {
    state: "error";
  };

// =========================================================
// CONSTANTES
// =========================================================

const PRONOUN_OPTIONS: PronounOption[] = [
  {
    id: "he",
    label: "Ele/dele",
    value: "ele/dele",
  },
  {
    id: "she",
    label: "Ela/dela",
    value: "ela/dela",
  },
  {
    id: "they",
    label: "Elu/delu",
    value: "elu/delu",
  },
  {
    id: "skip",
    label: "Prefiro não informar",
    value: null,
  },
];

const USERNAME_PATTERN = /^[A-Za-z0-9._]+$/;

// =========================================================
// FIRST ACCESS
// =========================================================

export default function FirstAccess() {
  const { signOut, restore } = useSession();
  const [registeredName, setRegisteredName] =
    useState("Seu nome");

  const [displayName, setDisplayName] =
    useState("");

  const [pronouns, setPronouns] =
    useState<PronounValue | undefined>(undefined);

  const [useCustomPronouns, setUseCustomPronouns] =
    useState(false);

  const [customPronouns, setCustomPronouns] =
    useState("");

  const [username, setUsername] =
    useState("");

  const [
    usernameAvailability,
    setUsernameAvailability,
  ] = useState<UsernameAvailabilityState>({
    state: "idle",
  });

  const [errorMessage, setErrorMessage] =
    useState("");

  const [isSaving, setIsSaving] =
    useState(false);

  const usernameCheckIdRef = useRef(0);

  // =======================================================
  // USUÁRIO AUTENTICADO
  // =======================================================

  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const user = await getCurrentUser();

        setRegisteredName(user.name);
      } catch (error) {
        console.error(
          "Erro ao carregar usuário autenticado:",
          error,
        );
      }
    }

    void loadCurrentUser();
  }, []);

  // =======================================================
  // VALORES DERIVADOS
  // =======================================================

  const normalizedUsername = username
    .trim()
    .replace(/^@+/, "")
    .toLowerCase();

  const usernameHasValidFormat =
    normalizedUsername.length >= 3 &&
    normalizedUsername.length <= 30 &&
    USERNAME_PATTERN.test(normalizedUsername);

  const finalPronouns = useCustomPronouns
    ? customPronouns.trim() || null
    : pronouns === undefined
      ? undefined
      : pronouns;

  const displayArticle = useMemo(() => {
    if (useCustomPronouns) {
      return "";
    }

    if (pronouns === "ele/dele") {
      return "o";
    }

    if (pronouns === "ela/dela") {
      return "a";
    }

    return "";
  }, [pronouns, useCustomPronouns]);

  // =======================================================
  // VALIDAÇÃO
  // =======================================================

  const validationMessage = useMemo(() => {
    const name = displayName.trim();

    if (!name) {
      return "Digite como você gostaria de ser chamado.";
    }

    if (name.length > 60) {
      return "Use no máximo 60 caracteres no nome de exibição.";
    }

    if (finalPronouns === undefined) {
      return "Escolha seus pronomes ou marque que prefere não informar.";
    }

    if (
      finalPronouns &&
      finalPronouns.length > 60
    ) {
      return "Use no máximo 60 caracteres nos pronomes.";
    }

    if (normalizedUsername.length < 3) {
      return "Seu @ precisa ter pelo menos 3 caracteres.";
    }

    if (normalizedUsername.length > 30) {
      return "Seu @ pode ter no máximo 30 caracteres.";
    }

    if (
      !USERNAME_PATTERN.test(normalizedUsername)
    ) {
      return "No @, use apenas letras, números, ponto e underline.";
    }

    if (
      usernameAvailability.state ===
      "unavailable" &&
      usernameAvailability.username ===
      normalizedUsername
    ) {
      return "Esse @ já está sendo usado. Tente outro nome de usuário.";
    }

    return "";
  }, [
    displayName,
    finalPronouns,
    normalizedUsername,
    usernameAvailability,
  ]);

  // =======================================================
  // VERIFICAÇÃO DO USERNAME
  // =======================================================

  useEffect(() => {
    usernameCheckIdRef.current += 1;

    const requestId =
      usernameCheckIdRef.current;

    if (!usernameHasValidFormat) {
      setUsernameAvailability({
        state: "idle",
      });

      return;
    }

    setUsernameAvailability({
      state: "checking",
    });

    const timeout = setTimeout(() => {
      async function checkAvailability() {
        try {
          const available =
            await checkUsernameAvailability(
              normalizedUsername,
            );

          if (
            requestId !==
            usernameCheckIdRef.current
          ) {
            return;
          }

          setUsernameAvailability(
            available
              ? {
                state: "available",
                username:
                  normalizedUsername,
              }
              : {
                state: "unavailable",
                username:
                  normalizedUsername,
              },
          );
        } catch (error) {
          if (
            requestId !==
            usernameCheckIdRef.current
          ) {
            return;
          }

          console.error(
            "Erro ao verificar disponibilidade do username:",
            error,
          );

          setUsernameAvailability({
            state: "error",
          });
        }
      }

      void checkAvailability();
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [
    normalizedUsername,
    usernameHasValidFormat,
  ]);

  // =======================================================
  // EVENTOS
  // =======================================================

  function handleUsernameChange(
    value: string,
  ) {
    const sanitizedValue =
      value.replace(/^@+/, "");

    usernameCheckIdRef.current += 1;

    setUsername(sanitizedValue);

    setUsernameAvailability({
      state: "idle",
    });

    setErrorMessage("");
  }

  function handlePronoun(
    option: PronounOption,
  ) {
    setUseCustomPronouns(false);
    setPronouns(option.value);
    setErrorMessage("");
  }

  function handleCustomPronouns() {
    setUseCustomPronouns(true);
    setPronouns(undefined);
    setErrorMessage("");
  }

  async function handleContinue() {
    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }

    if (
      usernameAvailability.state === "checking"
    ) {
      setErrorMessage(
        "Aguarde a verificação do seu @.",
      );
      return;
    }

    if (
      usernameAvailability.state !== "available"
    ) {
      setErrorMessage(
        "Não foi possível confirmar a disponibilidade do seu @.",
      );
      return;
    }

    setErrorMessage("");
    setIsSaving(true);

    try {
      await saveOnboardingIdentity({
        displayName: displayName.trim(),
        pronouns: finalPronouns ?? null,
        username: normalizedUsername,
      });

      router.push(
        "/roleselection/RoleSelection",
      );
      void restore();
    } catch (error) {
      console.error(
        "Erro ao salvar primeiro acesso:",
        error,
      );

      setErrorMessage(
        "Não foi possível salvar suas informações. Tente novamente.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleLogout() {
    await signOut();
    router.replace("/login/Login");
  }

  // =======================================================
  // INTERFACE
  // =======================================================

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: Colors.pageBackground }}>
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <ScrollView
        style={styles.page}
        contentContainerStyle={
          styles.pageContent
        }
        keyboardShouldPersistTaps="handled"
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

        {/* =================================================
            INTRODUÇÃO
        ================================================= */}

        <View style={styles.intro}>
          <Text style={styles.kicker}>
            PRIMEIRO ACESSO
          </Text>

          <View style={styles.helloBlock}>
            <Text style={styles.helloText}>
              Oi, eu sou
              {displayArticle
                ? ` ${displayArticle}`
                : ""}
            </Text>

            <View style={styles.nameSlot}>
              <TextInput
                style={styles.nameInput}
                value={displayName}
                onChangeText={(value) => {
                  setDisplayName(value);
                  setErrorMessage("");
                }}
                placeholder="seu nome aqui"
                placeholderTextColor={
                  Colors.primaryDark
                }
                maxLength={60}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="next"
                accessibilityLabel="Como você gostaria de ser chamado?"
              />

              <View
                style={
                  styles.nameUnderline
                }
              >
                <View
                  style={
                    styles.nameUnderlineAccent
                  }
                />

                <View
                  style={
                    styles.nameUnderlinePrimary
                  }
                />
              </View>
            </View>
          </View>

          {!displayName.trim() && (
            <View style={styles.nameHint}>
              <MaterialIcons
                name="chevron-right"
                size={17}
                color={Colors.accentDark}
              />

              <Text
                style={styles.nameHintText}
              >
                Digite o nome que você quer
                usar na CONG.
              </Text>
            </View>
          )}

          <Text
            style={styles.registeredName}
          >
            Seu cadastro continua vinculado a{" "}
            <Text
              style={
                styles.registeredNameStrong
              }
            >
              {registeredName}
            </Text>
            . Aqui você escolhe apenas como
            quer aparecer. Seu nome de exibição
            pode se repetir; o @ é o
            identificador único da sua conta.
          </Text>

          <View style={styles.bandMoment}>
            <View style={styles.bandDot} />

            <Text style={styles.bandText}>
              Seu lugar no bando CONG começa
              aqui.
            </Text>
          </View>

          <Image
            source={require(
              "../../../assets/images/Cong_Pensativo.png"
            )}
            style={styles.mascot}
            resizeMode="contain"
          />
        </View>

        {/* =================================================
            CARD
        ================================================= */}

        <View style={styles.formCard}>
          <View style={styles.formHeading}>
            <View style={styles.stepBadge}>
              <Text
                style={styles.stepBadgeText}
              >
                1 de 2
              </Text>
            </View>

            <View
              style={
                styles.formHeadingContent
              }
            >
              <Text style={styles.formTitle}>
                Antes de começar
              </Text>

              <Text
                style={
                  styles.formDescription
                }
              >
                Três escolhas rápidas para
                deixar seu perfil com a sua
                cara.
              </Text>
            </View>
          </View>

          {/* ===============================================
              PRONOMES
          =============================================== */}

          <View style={styles.fieldset}>
            <Text style={styles.fieldLabel}>
              Quais pronomes você usa?
            </Text>

            <View style={styles.chipGrid}>
              {PRONOUN_OPTIONS.map(
                (option) => {
                  const selected =
                    !useCustomPronouns &&
                    pronouns !== undefined &&
                    pronouns ===
                    option.value;

                  return (
                    <Pressable
                      key={option.id}
                      style={({ pressed }) => [
                        styles.choiceChip,

                        selected &&
                        styles.choiceChipSelected,

                        pressed &&
                        styles.choiceChipPressed,
                      ]}
                      onPress={() =>
                        handlePronoun(
                          option,
                        )
                      }
                      accessibilityRole="button"
                      accessibilityState={{
                        selected,
                      }}
                    >
                      {selected && (
                        <MaterialIcons
                          name="check"
                          size={15}
                          color={
                            Colors.primaryDark
                          }
                        />
                      )}

                      <Text
                        style={[
                          styles.choiceChipText,

                          selected &&
                          styles.choiceChipTextSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                },
              )}

              <Pressable
                style={({ pressed }) => [
                  styles.choiceChip,

                  useCustomPronouns &&
                  styles.choiceChipSelected,

                  pressed &&
                  styles.choiceChipPressed,
                ]}
                onPress={
                  handleCustomPronouns
                }
                accessibilityRole="button"
                accessibilityState={{
                  selected:
                    useCustomPronouns,
                }}
              >
                {useCustomPronouns && (
                  <MaterialIcons
                    name="check"
                    size={15}
                    color={
                      Colors.primaryDark
                    }
                  />
                )}

                <Text
                  style={[
                    styles.choiceChipText,

                    useCustomPronouns &&
                    styles.choiceChipTextSelected,
                  ]}
                >
                  Outro
                </Text>
              </Pressable>
            </View>

            {useCustomPronouns && (
              <View
                style={
                  styles.customPronouns
                }
              >
                <Text
                  style={
                    styles.customPronounsLabel
                  }
                >
                  Como devemos mostrar?
                </Text>

                <TextInput
                  style={
                    styles.customPronounsInput
                  }
                  value={customPronouns}
                  onChangeText={(value) => {
                    setCustomPronouns(
                      value,
                    );
                    setErrorMessage("");
                  }}
                  placeholder="Ex.: ela/dela"
                  maxLength={60}
                  autoCapitalize="none"
                />
              </View>
            )}
          </View>

          {/* ===============================================
              USERNAME
          =============================================== */}

          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>
              Escolha seu @
            </Text>

            <Text
              style={
                styles.fieldDescription
              }
            >
              Ele identifica seu perfil
              público na comunidade.
            </Text>

            <View
              style={[
                styles.usernameField,

                usernameAvailability.state ===
                "available" &&
                styles.usernameFieldAvailable,

                usernameAvailability.state ===
                "unavailable" &&
                styles.usernameFieldUnavailable,
              ]}
            >
              <Text style={styles.atSign}>
                @
              </Text>

              <TextInput
                style={
                  styles.usernameInput
                }
                value={username}
                onChangeText={
                  handleUsernameChange
                }
                placeholder="seu.usuario"
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={30}
              />
            </View>

            <View
              style={
                styles.usernameStatus
              }
            >
              {usernameAvailability.state ===
                "checking" && (
                  <View
                    style={
                      styles.statusContent
                    }
                  >
                    <ActivityIndicator
                      size="small"
                      color={Colors.primary}
                    />

                    <Text
                      style={
                        styles.statusChecking
                      }
                    >
                      Verificando
                      disponibilidade...
                    </Text>
                  </View>
                )}

              {usernameAvailability.state ===
                "available" && (
                  <View
                    style={
                      styles.statusContent
                    }
                  >
                    <MaterialIcons
                      name="check"
                      size={15}
                      color={
                        Colors.primaryDark
                      }
                    />

                    <Text
                      style={
                        styles.statusAvailable
                      }
                    >
                      @
                      {
                        usernameAvailability.username
                      }{" "}
                      está disponível.
                    </Text>
                  </View>
                )}

              {usernameAvailability.state ===
                "unavailable" && (
                  <View
                    style={
                      styles.statusContent
                    }
                  >
                    <MaterialIcons
                      name="close"
                      size={15}
                      color={
                        Colors.dangerDark
                      }
                    />

                    <Text
                      style={
                        styles.statusUnavailable
                      }
                    >
                      @
                      {
                        usernameAvailability.username
                      }{" "}
                      já está em uso.
                    </Text>
                  </View>
                )}

              {usernameAvailability.state ===
                "error" && (
                  <Text
                    style={
                      styles.statusChecking
                    }
                  >
                    Não foi possível verificar
                    agora.
                  </Text>
                )}
            </View>

            <Text
              style={
                styles.fieldFootnote
              }
            >
              Letras, números, ponto e
              underline. Você poderá editar
              depois.
            </Text>
          </View>

          {/* ===============================================
              ERRO
          =============================================== */}

          {errorMessage ? (
            <View style={styles.error}>
              <MaterialIcons
                name="error-outline"
                size={18}
                color={
                  Colors.dangerDark
                }
              />

              <Text
                style={styles.errorText}
              >
                {errorMessage}
              </Text>
            </View>
          ) : null}

          {/* ===============================================
              CONTINUAR
          =============================================== */}

          <Pressable
            style={({ pressed }) => [
              styles.continueButton,

              pressed &&
              styles.continueButtonPressed,

              isSaving &&
              styles.continueButtonDisabled,
            ]}
            onPress={() =>
              void handleContinue()
            }
            disabled={isSaving}
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
                    styles.continueButtonText
                  }
                >
                  Continuar
                </Text>

                <MaterialIcons
                  name="arrow-forward"
                  size={19}
                  color={Colors.white}
                />
              </>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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

  keyboardView: {
    flex: 1,
    backgroundColor: Colors.pageBackground,
  },

  page: {
    flex: 1,
    backgroundColor: Colors.pageBackground,
  },

  pageContent: {
    flexGrow: 1,
    paddingBottom: 56,
  },

  // =========================================================
  // TOPO
  // =========================================================

  topbar: {
    minHeight: 66,

    paddingHorizontal: 14,
    paddingVertical: 12,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  logo: {
    color: Colors.ink,

    fontFamily: Fonts.brand,
    fontSize: Fonts["2xl"],
  },

  logoutButton: {
    width: 40,
    height: 40,

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: Colors.border,

    borderRadius: 999,

    backgroundColor: Colors.white,
  },

  logoutButtonPressed: {
    opacity: 0.72,
  },

  // =========================================================
  // INTRODUÇÃO
  // =========================================================

  intro: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  kicker: {
    marginBottom: 18,

    color: Colors.primaryDark,

    fontFamily: Fonts.bodyBold,
    fontSize: Fonts.xs,

    letterSpacing: 1.4,
  },

  // =========================================================
  // "OI, EU SOU..."
  // =========================================================

  helloBlock: {
    width: "100%",
  },

  helloText: {
    color: Colors.ink,

    fontFamily: Fonts.brand,
    fontSize: 46,

    lineHeight: 51,

    letterSpacing: -1.5,
  },

  nameSlot: {
    width: "100%",
    marginTop: 3,
  },

  nameInput: {
    width: "100%",

    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 6,

    color: Colors.primary,

    fontFamily: Fonts.brand,
    fontSize: 46,

    lineHeight: 53,

    letterSpacing: -1.5,
  },

  /*
   * No CSS Web a linha usa:
   *
   * linear-gradient(
   *   90deg,
   *   accent,
   *   primary
   * )
   *
   * Como não estamos adicionando biblioteca
   * apenas para um gradiente, ela é dividida
   * entre as duas cores já existentes no Web.
   */

  nameUnderline: {
    width: "100%",
    height: 3,

    flexDirection: "row",

    overflow: "hidden",

    borderRadius: 999,
  },

  nameUnderlineAccent: {
    flex: 1,
    backgroundColor: Colors.accent,
  },

  nameUnderlinePrimary: {
    flex: 1,
    backgroundColor: Colors.primary,
  },

  nameHint: {
    marginTop: 16,
    marginLeft: 4,

    flexDirection: "row",
    alignItems: "center",

    gap: 5,
  },

  nameHintText: {
    flex: 1,

    color: Colors.slate600,

    fontFamily: Fonts.body,
    fontSize: Fonts.sm,
  },

  registeredName: {
    marginTop: 22,

    color: Colors.slate600,

    fontFamily: Fonts.body,
    fontSize: 13,

    lineHeight: 21,
  },

  registeredNameStrong: {
    color: Colors.ink,

    fontFamily: Fonts.bodyBold,
  },

  // =========================================================
  // BANDO CONG
  // =========================================================

  bandMoment: {
    alignSelf: "flex-start",

    marginTop: 22,

    paddingHorizontal: 12,
    paddingVertical: 9,

    flexDirection: "row",
    alignItems: "center",

    gap: 9,

    borderWidth: 1,
    borderColor: Colors.primary100,

    borderRadius: 14,

    backgroundColor: Colors.white,
  },

  bandDot: {
    width: 7,
    height: 7,

    borderRadius: 999,

    backgroundColor: Colors.primary,
  },

  bandText: {
    color: Colors.slate600,

    fontFamily: Fonts.bodySemiBold,
    fontSize: Fonts.xs,
  },

  // =========================================================
  // MASCOTE
  // =========================================================

  mascot: {
    width: 122,
    height: 122,

    alignSelf: "center",

    marginTop: 16,
    marginBottom: -8,

    transform: [
      {
        rotate: "-4deg",
      },
    ],
  },

  // =========================================================
  // CARD
  // =========================================================

  formCard: {
    marginHorizontal: 10,
    marginTop: 29,

    padding: 17,

    borderWidth: 1,
    borderColor: Colors.border,

    borderRadius: 20,

    backgroundColor: Colors.white,

    shadowColor: Colors.navy,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.09,
    shadowRadius: 24,

    elevation: 4,
  },

  // =========================================================
  // CABEÇALHO DO CARD
  // =========================================================

  formHeading: {
    flexDirection: "row",
    alignItems: "flex-start",

    gap: 10,

    marginBottom: 26,
  },

  stepBadge: {
    marginTop: 3,

    paddingHorizontal: 9,
    paddingVertical: 6,

    borderRadius: 999,

    backgroundColor: Colors.primary100,
  },

  stepBadgeText: {
    color: Colors.primaryDark,

    fontFamily: Fonts.bodyBold,
    fontSize: Fonts.xs,
  },

  formHeadingContent: {
    flex: 1,
  },

  formTitle: {
    color: Colors.ink,

    fontFamily: Fonts.brand,
    fontSize: 27,

    lineHeight: 31,
  },

  formDescription: {
    marginTop: 7,

    color: Colors.slate600,

    fontFamily: Fonts.body,
    fontSize: Fonts.sm,

    lineHeight: 21,
  },

  // =========================================================
  // PRONOMES
  // =========================================================

  fieldset: {
    width: "100%",
  },

  fieldLabel: {
    color: Colors.navy,

    fontFamily: Fonts.bodyBold,
    fontSize: Fonts.sm,
  },

  chipGrid: {
    marginTop: 13,

    flexDirection: "row",
    flexWrap: "wrap",

    gap: 9,
  },

  choiceChip: {
    minHeight: 38,

    paddingHorizontal: 11,
    paddingVertical: 8,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 5,

    borderWidth: 1,
    borderColor: Colors.slate300,

    borderRadius: 12,

    backgroundColor: Colors.white,
  },

  choiceChipSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary50,
  },

  choiceChipPressed: {
    opacity: 0.75,
  },

  choiceChipText: {
    color: Colors.slate700,

    fontFamily: Fonts.bodyMedium,
    fontSize: Fonts.sm,
  },

  choiceChipTextSelected: {
    color: Colors.primaryDark,
  },

  // =========================================================
  // PRONOMES PERSONALIZADOS
  // =========================================================

  customPronouns: {
    marginTop: 14,
  },

  customPronounsLabel: {
    marginBottom: 7,

    color: Colors.slate700,

    fontFamily: Fonts.bodySemiBold,
    fontSize: Fonts.xs,
  },

  customPronounsInput: {
    width: "100%",
    minHeight: 46,

    paddingHorizontal: 14,

    borderWidth: 1,
    borderColor: Colors.slate300,

    borderRadius: 12,

    backgroundColor: Colors.white,

    color: Colors.navy,

    fontFamily: Fonts.body,
    fontSize: Fonts.md,
  },

  // =========================================================
  // USERNAME
  // =========================================================

  fieldBlock: {
    marginTop: 26,
  },

  fieldDescription: {
    marginTop: 5,

    color: Colors.slate600,

    fontFamily: Fonts.body,
    fontSize: Fonts.xs,
  },

  usernameField: {
    width: "100%",
    minHeight: 46,

    marginTop: 12,

    paddingHorizontal: 13,

    flexDirection: "row",
    alignItems: "center",

    gap: 7,

    borderWidth: 1,
    borderColor: Colors.slate300,

    borderRadius: 12,

    backgroundColor: Colors.white,
  },

  usernameFieldAvailable: {
    borderColor: Colors.primary,
  },

  usernameFieldUnavailable: {
    borderColor: Colors.dangerDark,
  },

  atSign: {
    color: Colors.primary,

    fontFamily: Fonts.bodySemiBold,
    fontSize: 18,
  },

  usernameInput: {
    flex: 1,

    minWidth: 0,

    paddingVertical: 0,

    color: Colors.navy,

    fontFamily: Fonts.body,
    fontSize: Fonts.md,
  },

  // =========================================================
  // STATUS DO USERNAME
  // =========================================================

  usernameStatus: {
    minHeight: 20,

    marginTop: 8,

    justifyContent: "center",
  },

  statusContent: {
    flexDirection: "row",
    alignItems: "center",

    gap: 6,
  },

  statusChecking: {
    color: Colors.slate500,

    fontFamily: Fonts.bodySemiBold,
    fontSize: 12,
  },

  statusAvailable: {
    flex: 1,

    color: Colors.primaryDark,

    fontFamily: Fonts.bodySemiBold,
    fontSize: 12,
  },

  statusUnavailable: {
    flex: 1,

    color: Colors.dangerDark,

    fontFamily: Fonts.bodySemiBold,
    fontSize: 12,
  },

  fieldFootnote: {
    marginTop: 7,

    color: Colors.slate500,

    fontFamily: Fonts.body,
    fontSize: 12,

    lineHeight: 17,
  },

  // =========================================================
  // ERRO
  // =========================================================

  error: {
    marginTop: 20,

    paddingHorizontal: 14,
    paddingVertical: 12,

    flexDirection: "row",
    alignItems: "flex-start",

    gap: 9,

    borderWidth: 1,
    borderColor: Colors.red200,

    borderRadius: 12,

    backgroundColor: Colors.dangerSoft,
  },

  errorText: {
    flex: 1,

    color: Colors.dangerDark,

    fontFamily: Fonts.body,
    fontSize: Fonts.sm,

    lineHeight: 20,
  },

  // =========================================================
  // CONTINUAR
  // =========================================================

  continueButton: {
    width: "100%",
    minHeight: 50,

    marginTop: 21,

    paddingHorizontal: 16,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 9,

    borderRadius: 14,

    backgroundColor: Colors.primary,

    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,

    elevation: 3,
  },

  continueButtonPressed: {
    backgroundColor: Colors.primaryDark,
  },

  continueButtonDisabled: {
    opacity: 0.65,
  },

  continueButtonText: {
    color: Colors.white,

    fontFamily: Fonts.bodyBold,
    fontSize: Fonts.sm,
  },
});
