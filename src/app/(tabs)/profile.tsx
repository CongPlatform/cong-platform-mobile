import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { useAuthentication } from "@/hooks/useAuthentication";
import {
  checkUsernameAvailability,
  updateAccount,
} from "@/services/accountService";
import { ApiError } from "@/services/api";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { router } from "expo-router";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Alert,
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
import { SafeAreaView } from "react-native-safe-area-context";

const PRONOUN_OPTIONS = [
  "ele/dele",
  "ela/dela",
  "elu/delu",
] as const;

const USERNAME_PATTERN = /^[A-Za-z0-9._]+$/;

type PronounPreset = (typeof PRONOUN_OPTIONS)[number];
type PronounSelection = PronounPreset | "custom" | "skip";

type UsernameState =
  | "idle"
  | "checking"
  | "available"
  | "unavailable"
  | "error";

interface ProfileDraft {
  name: string;
  displayName: string;
  username: string;
  bio: string;
  pronounSelection: PronounSelection;
  customPronouns: string;
}

const ROLE_LABELS: Record<string, string> = {
  developer: "Desenvolvimento",
  designer: "Design",
  translator: "Tradução e acessibilidade",
  volunteer: "Voluntariado",
};

const REPRESENTATION_LABELS: Record<string, string> = {
  ngo: "Representa ONG",
  company: "Representa empresa",
};

function normalizeUsername(value: string): string {
  return value
    .trim()
    .replace(/^@+/, "")
    .toLowerCase();
}

function isPresetPronoun(value: string | null): value is PronounPreset {
  return PRONOUN_OPTIONS.some((option) => option === value);
}

function initials(value: string): string {
  return value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "C";
}

export default function Profile() {
  const {
    account,
    user,
    restore,
    signOut,
  } = useAuthentication();

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<ProfileDraft | null>(null);
  const [usernameState, setUsernameState] =
    useState<UsernameState>("idle");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const persistedUsername = normalizeUsername(
    account?.username ?? "",
  );
  const currentUsername = normalizeUsername(
    draft?.username ?? "",
  );

  const usernameChanged =
    editing && currentUsername !== persistedUsername;

  const usernameFormatValid =
    currentUsername.length >= 3 &&
    currentUsername.length <= 30 &&
    USERNAME_PATTERN.test(currentUsername);

  useEffect(() => {
    if (
      !editing ||
      !usernameChanged ||
      !usernameFormatValid
    ) {
      setUsernameState("idle");
      return;
    }

    let active = true;

    setUsernameState("checking");

    const timeout = setTimeout(async () => {
      try {
        const available = await checkUsernameAvailability(
          currentUsername,
        );

        if (!active) {
          return;
        }

        setUsernameState(
          available ? "available" : "unavailable",
        );
      } catch {
        if (active) {
          setUsernameState("error");
        }
      }
    }, 450);

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [
    currentUsername,
    editing,
    usernameChanged,
    usernameFormatValid,
  ]);

  const participation = useMemo(() => {
    if (!account) {
      return [];
    }

    return [
      ...account.onboardingRoles.map(
        (role) => ROLE_LABELS[role] ?? role,
      ),
      ...account.onboardingRepresentations.map(
        (representation) =>
          REPRESENTATION_LABELS[representation] ?? representation,
      ),
    ];
  }, [account]);

  if (!account) {
    return (
      <SafeAreaView style={styles.page}>
        <View style={styles.centerState}>
          <MaterialIcons
            name="person-outline"
            size={42}
            color={Colors.primary}
          />
          <Text style={styles.centerTitle}>
            Carregando seu perfil...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const displayedName =
    account.displayName || account.name;

  const email =
    account.authentication?.email || user?.email || "";

  const memberSince = new Date(
    account.createdAt,
  ).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  function startEditing() {
    if (!account) {
      return;
    }

    const currentPronouns = account.pronouns;
    const preset = isPresetPronoun(currentPronouns);

    const pronounSelection: PronounSelection = !currentPronouns
      ? "skip"
      : preset
        ? currentPronouns
        : "custom";

    setDraft({
      name: account.name,
      displayName: account.displayName || account.name,
      username: account.username || "",
      bio: account.bio || "",
      pronounSelection,
      customPronouns:
        currentPronouns && !preset
          ? currentPronouns
          : "",
    });

    setUsernameState("idle");
    setMessage("");
    setErrorMessage("");
    setEditing(true);
  }

  function cancelEditing() {
    setDraft(null);
    setUsernameState("idle");
    setErrorMessage("");
    setEditing(false);
  }

  function updateDraft<K extends keyof ProfileDraft>(
    field: K,
    value: ProfileDraft[K],
  ) {
    setDraft((current) =>
      current
        ? {
            ...current,
            [field]: value,
          }
        : current,
    );

    setMessage("");
    setErrorMessage("");
  }

  async function handleSave() {
    if (!draft || saving) {
      return;
    }

    const name = draft.name.trim();
    const displayName = draft.displayName.trim();
    const username = normalizeUsername(draft.username);
    const bio = draft.bio.trim();

    const pronouns =
      draft.pronounSelection === "skip"
        ? null
        : draft.pronounSelection === "custom"
          ? draft.customPronouns.trim()
          : draft.pronounSelection;

    if (name.length < 2 || name.length > 100) {
      setErrorMessage(
        "O nome completo precisa ter entre 2 e 100 caracteres.",
      );
      return;
    }

    if (!displayName || displayName.length > 60) {
      setErrorMessage(
        "O nome de exibição precisa ter entre 1 e 60 caracteres.",
      );
      return;
    }

    if (!usernameFormatValid) {
      setErrorMessage(
        "O @ precisa ter de 3 a 30 caracteres e usar apenas letras, números, ponto ou underline.",
      );
      return;
    }

    if (
      draft.pronounSelection === "custom" &&
      (!pronouns || pronouns.length > 60)
    ) {
      setErrorMessage(
        "Informe seus pronomes usando no máximo 60 caracteres.",
      );
      return;
    }

    if (bio.length > 300) {
      setErrorMessage(
        "A bio pode ter no máximo 300 caracteres.",
      );
      return;
    }

    if (usernameChanged) {
      if (usernameState === "checking") {
        setErrorMessage(
          "Aguarde a verificação do novo @.",
        );
        return;
      }

      if (usernameState === "unavailable") {
        setErrorMessage(
          "Esse @ já está sendo usado.",
        );
        return;
      }

      if (usernameState !== "available") {
        setErrorMessage(
          "Não foi possível confirmar a disponibilidade do @.",
        );
        return;
      }
    }

    setSaving(true);
    setErrorMessage("");
    setMessage("");

    try {
      await updateAccount({
        name,
        displayName,
        username,
        pronouns,
        bio: bio || null,
      });

      await restore(false);

      setDraft(null);
      setEditing(false);
      setUsernameState("idle");
      setMessage("Perfil atualizado com sucesso.");
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 409) {
          setErrorMessage(
            "Esse @ já está sendo usado. Escolha outro.",
          );
        } else if (error.status === 0) {
          setErrorMessage(
            "Não foi possível conectar ao servidor.",
          );
        } else {
          setErrorMessage(
            error.message ||
              "Não foi possível atualizar seu perfil.",
          );
        }
      } else {
        setErrorMessage(
          "Não foi possível atualizar seu perfil.",
        );
      }
    } finally {
      setSaving(false);
    }
  }

  function confirmSignOut() {
    Alert.alert(
      "Sair da CONG",
      "Deseja encerrar sua sessão neste dispositivo?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sair",
          style: "destructive",
          onPress: () => {
            void handleSignOut();
          },
        },
      ],
    );
  }

  async function handleSignOut() {
    await signOut();
    router.replace("/login/Login");
  }

  return (
    <SafeAreaView style={styles.page}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.eyebrow}>
                SUA CONTA NA CONG
              </Text>
              <Text style={styles.title}>
                Meu perfil
              </Text>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.editButton,
                pressed && styles.pressed,
              ]}
              onPress={editing ? cancelEditing : startEditing}
              accessibilityRole="button"
            >
              <MaterialIcons
                name={editing ? "close" : "edit"}
                size={18}
                color={Colors.primaryDark}
              />
              <Text style={styles.editButtonText}>
                {editing ? "Cancelar" : "Editar"}
              </Text>
            </Pressable>
          </View>

          <View style={styles.identityCard}>
            <View style={styles.avatar}>
              {account.avatarPath ? (
                <Image
                  source={{ uri: account.avatarPath }}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              ) : (
                <Text style={styles.avatarInitials}>
                  {initials(displayedName)}
                </Text>
              )}
            </View>

            <View style={styles.identityText}>
              <Text style={styles.displayName}>
                {displayedName}
              </Text>

              <Text style={styles.username}>
                {account.username
                  ? `@${account.username}`
                  : "Sem nome de usuário"}
              </Text>

              <Text style={styles.pronouns}>
                {account.pronouns ||
                  "Pronomes não informados"}
              </Text>
            </View>
          </View>

          {!!message && (
            <View style={styles.successBox}>
              <MaterialIcons
                name="check-circle"
                size={19}
                color={Colors.successStrong}
              />
              <Text style={styles.successText}>
                {message}
              </Text>
            </View>
          )}

          {!!errorMessage && (
            <View style={styles.errorBox}>
              <MaterialIcons
                name="error-outline"
                size={19}
                color={Colors.error}
              />
              <Text style={styles.errorText}>
                {errorMessage}
              </Text>
            </View>
          )}

          {editing && draft ? (
            <View style={styles.formCard}>
              <Text style={styles.sectionTitle}>
                Editar informações
              </Text>

              <ProfileField
                label="Nome completo"
                value={draft.name}
                onChangeText={(value) =>
                  updateDraft("name", value)
                }
                placeholder="Seu nome completo"
                icon="badge"
              />

              <ProfileField
                label="Nome de exibição"
                value={draft.displayName}
                onChangeText={(value) =>
                  updateDraft("displayName", value)
                }
                placeholder="Como você quer aparecer"
                icon="person-outline"
              />

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>
                  Nome de usuário
                </Text>

                <View style={styles.inputShell}>
                  <MaterialIcons
                    name="alternate-email"
                    size={19}
                    color={Colors.primary}
                  />
                  <TextInput
                    style={styles.input}
                    value={draft.username}
                    onChangeText={(value) =>
                      updateDraft("username", value)
                    }
                    placeholder="seu.usuario"
                    placeholderTextColor={Colors.slate500}
                    autoCapitalize="none"
                    autoCorrect={false}
                    maxLength={31}
                  />
                </View>

                {usernameChanged && usernameFormatValid && (
                  <Text
                    style={[
                      styles.helper,
                      usernameState === "available" &&
                        styles.helperSuccess,
                      usernameState === "unavailable" &&
                        styles.helperError,
                    ]}
                  >
                    {usernameState === "checking"
                      ? "Verificando disponibilidade..."
                      : usernameState === "available"
                        ? "Esse @ está disponível."
                        : usernameState === "unavailable"
                          ? "Esse @ já está em uso."
                          : usernameState === "error"
                            ? "Não foi possível verificar o @."
                            : ""}
                  </Text>
                )}
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>
                  Pronomes
                </Text>

                <View style={styles.chipsWrap}>
                  {PRONOUN_OPTIONS.map((option) => (
                    <ChoiceChip
                      key={option}
                      label={
                        option === "ele/dele"
                          ? "Ele/dele"
                          : option === "ela/dela"
                            ? "Ela/dela"
                            : "Elu/delu"
                      }
                      selected={
                        draft.pronounSelection === option
                      }
                      onPress={() =>
                        updateDraft(
                          "pronounSelection",
                          option,
                        )
                      }
                    />
                  ))}

                  <ChoiceChip
                    label="Outro"
                    selected={
                      draft.pronounSelection === "custom"
                    }
                    onPress={() =>
                      updateDraft(
                        "pronounSelection",
                        "custom",
                      )
                    }
                  />

                  <ChoiceChip
                    label="Prefiro não informar"
                    selected={
                      draft.pronounSelection === "skip"
                    }
                    onPress={() =>
                      updateDraft(
                        "pronounSelection",
                        "skip",
                      )
                    }
                  />
                </View>

                {draft.pronounSelection === "custom" && (
                  <View style={styles.inputShell}>
                    <MaterialIcons
                      name="chat-bubble-outline"
                      size={19}
                      color={Colors.primary}
                    />
                    <TextInput
                      style={styles.input}
                      value={draft.customPronouns}
                      onChangeText={(value) =>
                        updateDraft("customPronouns", value)
                      }
                      placeholder="Informe seus pronomes"
                      placeholderTextColor={Colors.slate500}
                      maxLength={60}
                    />
                  </View>
                )}
              </View>

              <View style={styles.fieldGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>
                    Bio
                  </Text>
                  <Text style={styles.counter}>
                    {draft.bio.length}/300
                  </Text>
                </View>

                <TextInput
                  style={styles.bioInput}
                  value={draft.bio}
                  onChangeText={(value) =>
                    updateDraft("bio", value)
                  }
                  placeholder="Conte um pouco sobre você e como quer colaborar."
                  placeholderTextColor={Colors.slate500}
                  multiline
                  textAlignVertical="top"
                  maxLength={300}
                />
              </View>

              <View style={styles.readOnlyBox}>
                <MaterialIcons
                  name="mail-outline"
                  size={20}
                  color={Colors.primary}
                />
                <View style={styles.readOnlyText}>
                  <Text style={styles.readOnlyLabel}>
                    E-mail da conta
                  </Text>
                  <Text style={styles.readOnlyValue}>
                    {email}
                  </Text>
                </View>
                <MaterialIcons
                  name="lock-outline"
                  size={18}
                  color={Colors.slate500}
                />
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.saveButton,
                  pressed && styles.pressed,
                  saving && styles.disabled,
                ]}
                onPress={() => void handleSave()}
                disabled={saving}
                accessibilityRole="button"
              >
                <MaterialIcons
                  name="save"
                  size={20}
                  color={Colors.white}
                />
                <Text style={styles.saveButtonText}>
                  {saving
                    ? "Salvando..."
                    : "Salvar alterações"}
                </Text>
              </Pressable>
            </View>
          ) : (
            <>
              <View style={styles.infoCard}>
                <Text style={styles.sectionTitle}>
                  Sobre você
                </Text>
                <Text
                  style={
                    account.bio
                      ? styles.bio
                      : styles.emptyText
                  }
                >
                  {account.bio ||
                    "Você ainda não adicionou uma bio. Toque em Editar para completar seu perfil."}
                </Text>
              </View>

              <View style={styles.infoCard}>
                <Text style={styles.sectionTitle}>
                  Sua participação
                </Text>

                {participation.length > 0 ? (
                  <View style={styles.chipsWrap}>
                    {participation.map((item) => (
                      <View
                        key={item}
                        style={styles.infoChip}
                      >
                        <Text style={styles.infoChipText}>
                          {item}
                        </Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.emptyText}>
                    Nenhuma forma de participação configurada.
                  </Text>
                )}
              </View>

              <View style={styles.infoCard}>
                <Text style={styles.sectionTitle}>
                  Conta
                </Text>

                <FactRow
                  icon="mail-outline"
                  label="E-mail"
                  value={email}
                />
                <FactRow
                  icon="verified-user"
                  label="Verificação"
                  value={
                    account.authentication?.emailVerified
                      ? "E-mail confirmado"
                      : "Confirmação pendente"
                  }
                />
                <FactRow
                  icon="calendar-today"
                  label="Membro desde"
                  value={memberSince}
                />
              </View>
            </>
          )}

          <Pressable
            style={({ pressed }) => [
              styles.logoutButton,
              pressed && styles.pressed,
            ]}
            onPress={confirmSignOut}
            accessibilityRole="button"
          >
            <MaterialIcons
              name="logout"
              size={20}
              color={Colors.error}
            />
            <Text style={styles.logoutText}>
              Sair da conta
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function ProfileField({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  icon: "badge" | "person-outline";
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>
        {label}
      </Text>
      <View style={styles.inputShell}>
        <MaterialIcons
          name={icon}
          size={19}
          color={Colors.primary}
        />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.slate500}
          autoCorrect={false}
        />
      </View>
    </View>
  );
}

function ChoiceChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.choiceChip,
        selected && styles.choiceChipSelected,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      accessibilityRole="button"
    >
      <Text
        style={[
          styles.choiceChipText,
          selected && styles.choiceChipTextSelected,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function FactRow({
  icon,
  label,
  value,
}: {
  icon: "mail-outline" | "verified-user" | "calendar-today";
  label: string;
  value: string;
}) {
  return (
    <View style={styles.factRow}>
      <View style={styles.factIcon}>
        <MaterialIcons
          name={icon}
          size={19}
          color={Colors.primary}
        />
      </View>
      <View style={styles.factText}>
        <Text style={styles.factLabel}>
          {label}
        </Text>
        <Text style={styles.factValue}>
          {value}
        </Text>
      </View>
    </View>
  );
}

// =========================================================
// ESTILOS
// =========================================================

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  page: {
    flex: 1,
    backgroundColor: Colors.paper,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 42,
    gap: 16,
  },

  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 24,
  },

  centerTitle: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: Fonts.md,
    color: Colors.ink,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },

  eyebrow: {
    fontFamily: Fonts.bodyBold,
    fontSize: Fonts.xs,
    letterSpacing: 1.2,
    color: Colors.primary,
  },

  title: {
    marginTop: 3,
    fontFamily: Fonts.brand,
    fontSize: Fonts["3xl"],
    color: Colors.primaryDark,
  },

  editButton: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary200,
    backgroundColor: Colors.primary50,
  },

  editButtonText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: Fonts.sm,
    color: Colors.primaryDark,
  },

  identityCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    ...Colors.shadow.xs,
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: Colors.primary100,
    borderWidth: 2,
    borderColor: Colors.white,
  },

  avatarImage: {
    width: "100%",
    height: "100%",
  },

  avatarInitials: {
    fontFamily: Fonts.bodyExtraBold,
    fontSize: Fonts.xl,
    color: Colors.primaryDark,
  },

  identityText: {
    flex: 1,
    minWidth: 0,
  },

  displayName: {
    fontFamily: Fonts.bodyBold,
    fontSize: Fonts.xl,
    color: Colors.ink,
  },

  username: {
    marginTop: 3,
    fontFamily: Fonts.bodySemiBold,
    fontSize: Fonts.sm,
    color: Colors.primary,
  },

  pronouns: {
    marginTop: 4,
    fontFamily: Fonts.body,
    fontSize: Fonts.sm,
    color: Colors.muted,
  },

  successBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
    padding: 13,
    borderRadius: 13,
    backgroundColor: Colors.successSoft,
  },

  successText: {
    flex: 1,
    fontFamily: Fonts.bodyMedium,
    fontSize: Fonts.sm,
    lineHeight: 20,
    color: Colors.successStrong,
  },

  errorBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
    padding: 13,
    borderRadius: 13,
    backgroundColor: Colors.errorSoft,
  },

  errorText: {
    flex: 1,
    fontFamily: Fonts.bodyMedium,
    fontSize: Fonts.sm,
    lineHeight: 20,
    color: Colors.errorStrong,
  },

  formCard: {
    gap: 15,
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },

  infoCard: {
    gap: 12,
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },

  sectionTitle: {
    fontFamily: Fonts.bodyBold,
    fontSize: Fonts.lg,
    color: Colors.primaryDark,
  },

  bio: {
    fontFamily: Fonts.body,
    fontSize: Fonts.md,
    lineHeight: 23,
    color: Colors.ink,
  },

  emptyText: {
    fontFamily: Fonts.body,
    fontSize: Fonts.sm,
    lineHeight: 21,
    color: Colors.muted,
  },

  fieldGroup: {
    gap: 7,
  },

  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  label: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: Fonts.sm,
    color: Colors.ink,
  },

  counter: {
    fontFamily: Fonts.body,
    fontSize: Fonts.xs,
    color: Colors.slate500,
  },

  inputShell: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    paddingHorizontal: 13,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: Colors.borderMedium,
    backgroundColor: Colors.paperWarm,
  },

  input: {
    flex: 1,
    paddingVertical: 12,
    fontFamily: Fonts.body,
    fontSize: Fonts.md,
    color: Colors.ink,
  },

  bioInput: {
    minHeight: 108,
    paddingHorizontal: 13,
    paddingVertical: 12,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: Colors.borderMedium,
    backgroundColor: Colors.paperWarm,
    fontFamily: Fonts.body,
    fontSize: Fonts.md,
    lineHeight: 22,
    color: Colors.ink,
  },

  helper: {
    fontFamily: Fonts.body,
    fontSize: Fonts.xs,
    color: Colors.muted,
  },

  helperSuccess: {
    color: Colors.successStrong,
  },

  helperError: {
    color: Colors.error,
  },

  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  choiceChip: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.borderMedium,
    backgroundColor: Colors.white,
  },

  choiceChipSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary50,
  },

  choiceChipText: {
    fontFamily: Fonts.bodyMedium,
    fontSize: Fonts.sm,
    color: Colors.muted,
  },

  choiceChipTextSelected: {
    fontFamily: Fonts.bodySemiBold,
    color: Colors.primaryDark,
  },

  infoChip: {
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.primary50,
  },

  infoChipText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: Fonts.xs,
    color: Colors.primaryDark,
  },

  readOnlyBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 13,
    borderRadius: 13,
    backgroundColor: Colors.surfaceMuted,
  },

  readOnlyText: {
    flex: 1,
  },

  readOnlyLabel: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: Fonts.xs,
    color: Colors.muted,
  },

  readOnlyValue: {
    marginTop: 2,
    fontFamily: Fonts.body,
    fontSize: Fonts.sm,
    color: Colors.ink,
  },

  saveButton: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    ...Colors.shadow.primary,
  },

  saveButtonText: {
    fontFamily: Fonts.bodyBold,
    fontSize: Fonts.md,
    color: Colors.white,
  },

  factRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },

  factIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary50,
  },

  factText: {
    flex: 1,
  },

  factLabel: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: Fonts.xs,
    color: Colors.muted,
  },

  factValue: {
    marginTop: 2,
    fontFamily: Fonts.bodyMedium,
    fontSize: Fonts.sm,
    color: Colors.ink,
  },

  logoutButton: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.errorSoft,
    backgroundColor: Colors.white,
  },

  logoutText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: Fonts.md,
    color: Colors.error,
  },

  pressed: {
    opacity: 0.76,
  },

  disabled: {
    opacity: 0.55,
  },
});
