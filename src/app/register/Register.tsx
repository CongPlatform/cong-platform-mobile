import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";

import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  StyleSheet,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { useAuthentication } from "@/hooks/useAuthentication";
import { ApiError } from "@/services/api";

// ==================================================
// TIPOS
// ==================================================

type RegisterFormData = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  conductAccepted: boolean;
  privacyAccepted: boolean;
};

type RegisterErrors = Partial<
  Record<
    | "fullName"
    | "email"
    | "password"
    | "confirmPassword"
    | "conductAccepted"
    | "privacyAccepted",
    string
  >
>;

type DocumentType = "conduct" | "privacy";

// ==================================================
// ESTADO INICIAL
// ==================================================

const initialFormData: RegisterFormData = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  conductAccepted: false,
  privacyAccepted: false,
};

// ==================================================
// COMPONENTE
// ==================================================

export default function Register() {
  const { signUp } = useAuthentication();
  const [formData, setFormData] =
    useState<RegisterFormData>(initialFormData);

  const [errors, setErrors] =
    useState<RegisterErrors>({});

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [documentModal, setDocumentModal] =
    useState<DocumentType | null>(null);

  const [conductOpened, setConductOpened] =
    useState(false);

  const [privacyOpened, setPrivacyOpened] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [submissionError, setSubmissionError] =
    useState("");

  // ==================================================
  // REGRAS DA SENHA
  // ==================================================

  const passwordChecks = useMemo(
    () => ({
      length: formData.password.length >= 10,
      uppercase: /[A-Z]/.test(formData.password),
      lowercase: /[a-z]/.test(formData.password),
      number: /\d/.test(formData.password),
      symbol: /[^A-Za-z0-9]/.test(formData.password),
      noSpaces: !/\s/.test(formData.password),
    }),
    [formData.password],
  );

  const passwordIsValid =
    passwordChecks.length &&
    passwordChecks.uppercase &&
    passwordChecks.lowercase &&
    passwordChecks.number &&
    passwordChecks.symbol &&
    passwordChecks.noSpaces;

  // ==================================================
  // ATUALIZAÇÃO DO FORMULÁRIO
  // ==================================================

  function updateField<K extends keyof RegisterFormData>(
    field: K,
    value: RegisterFormData[K],
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));

    setSubmissionError("");
  }

  // ==================================================
  // VALIDAÇÃO
  // ==================================================

  function validateForm() {
    const nextErrors: RegisterErrors = {};

    if (formData.fullName.trim().length < 2) {
      nextErrors.fullName =
        "Informe seu nome completo.";
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email.trim(),
      )
    ) {
      nextErrors.email =
        "Informe um e-mail válido.";
    }

    if (!passwordIsValid) {
      nextErrors.password =
        "A senha ainda não atende aos requisitos.";
    }

    if (
      formData.confirmPassword !==
      formData.password
    ) {
      nextErrors.confirmPassword =
        "As senhas não coincidem.";
    }

    if (!formData.conductAccepted) {
      nextErrors.conductAccepted =
        "Leia e aceite o Código de Conduta.";
    }

    if (!formData.privacyAccepted) {
      nextErrors.privacyAccepted =
        "Leia e aceite as informações de privacidade.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  // ==================================================
  // DOCUMENTOS
  // ==================================================

  function openDocument(type: DocumentType) {
    if (type === "conduct") {
      setConductOpened(true);
    }

    if (type === "privacy") {
      setPrivacyOpened(true);
    }

    setDocumentModal(type);
  }

  function acceptDocument() {
    if (documentModal === "conduct") {
      updateField("conductAccepted", true);
    }

    if (documentModal === "privacy") {
      updateField("privacyAccepted", true);
    }

    setDocumentModal(null);
  }

  // ==================================================
  // CADASTRO
  // ==================================================

  async function handleRegister() {
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmissionError("");

      const normalizedEmail = formData.email
        .trim()
        .toLowerCase();
      await signUp({
        name: formData.fullName,
        email: normalizedEmail,
        password: formData.password,
      });

      router.replace({
        pathname: "/emailverification/EmailVerification",
        params: {
          email: normalizedEmail,
        },
      });

    } catch (error) {
      console.error(
        "Erro ao criar conta:",
        error,
      );

      if (error instanceof ApiError) {
        if (error.status === 409) {
          setSubmissionError(
            "Já existe uma conta cadastrada com este e-mail.",
          );
          return;
        }

        if (error.status === 0) {
          setSubmissionError(
            "Não foi possível conectar ao servidor.",
          );
          return;
        }

        setSubmissionError(
          error.message ||
          "Não foi possível criar sua conta.",
        );

        return;
      }

      setSubmissionError(
        "Não foi possível criar sua conta. Tente novamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }
  
  // ==================================================
  // NAVEGAÇÃO
  // ==================================================

  function handleBack() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/login/Login");
  }

  function handleLogin() {
    router.replace("/login/Login");
  }

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <ScrollView
          contentContainerStyle={
            styles.contentContainer
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ==================================================
              CABEÇALHO
          ================================================== */}

          <View style={styles.header}>
            <Pressable
              style={({ pressed }) => [
                styles.backButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleBack}
              accessibilityRole="button"
              accessibilityLabel="Voltar"
            >
              <MaterialIcons
                name="arrow-back"
                size={21}
                color={Colors.ink}
              />
            </Pressable>

            <View style={styles.brand}>
              <Text style={styles.brandName}>
                CONG
              </Text>

              <Text style={styles.brandSubtitle}>
                Conectando pessoas e organizações
              </Text>
            </View>

            <Pressable
              onPress={handleLogin}
              accessibilityRole="button"
            >
              <Text style={styles.loginText}>
                Já tem conta?{"\n"}
                <Text
                  style={styles.loginTextStrong}
                >
                  Entrar
                </Text>
              </Text>
            </Pressable>
          </View>

          {/* ==================================================
              INTRODUÇÃO
          ================================================== */}

          <View style={styles.intro}>
            <View style={styles.mascotContainer}>
              <View style={styles.mascotGlow} />

              <Image
                source={require(
                  "../../../assets/images/Cong.png"
                )}
                style={styles.mascot}
                resizeMode="contain"
                accessibilityLabel="Mascote da CONG"
              />
            </View>

            <Text style={styles.eyebrow}>
              FAÇA PARTE DA CONG
            </Text>

            <Text style={styles.mainTitle}>
              Crie sua conta e comece sua{" "}
              <Text
                style={
                  styles.mainTitleHighlight
                }
              >
                jornada.
              </Text>
            </Text>

            <Text style={styles.mainDescription}>
              Um único cadastro para descobrir
              oportunidades, apoiar organizações e
              participar de ações que geram impacto
              real.
            </Text>

            <View style={styles.tags}>
              <View style={styles.tag}>
                <MaterialIcons
                  name="lock-outline"
                  size={14}
                  color={Colors.primary}
                />

                <Text style={styles.tagText}>
                  Seus dados protegidos
                </Text>
              </View>

              <View style={styles.tag}>
                <MaterialIcons
                  name="favorite-border"
                  size={14}
                  color={Colors.primary}
                />

                <Text style={styles.tagText}>
                  Feito para gerar impacto
                </Text>
              </View>
            </View>
          </View>

          {/* ==================================================
              FORMULÁRIO
          ================================================== */}

          <View style={styles.formSurface}>
            <View style={styles.formHeader}>
              <View style={styles.formHeaderText}>
                <Text style={styles.formEyebrow}>
                  CRIAR CONTA
                </Text>

                <Text style={styles.formTitle}>
                  Seus dados de acesso
                </Text>

                <Text
                  style={
                    styles.formDescription
                  }
                >
                  Comece com as informações
                  essenciais. Depois vamos conhecer
                  melhor como você quer participar
                  da CONG.
                </Text>
              </View>

              <View style={styles.formIcon}>
                <MaterialIcons
                  name="person-add"
                  size={23}
                  color={Colors.ink}
                />
              </View>
            </View>

            {/* PRIVACIDADE */}

            <View style={styles.privacyBox}>
              <MaterialIcons
                name="lock-outline"
                size={20}
                color={Colors.ink}
              />

              <Text style={styles.privacyText}>
                Seus dados são usados para criar
                sua conta e permitir sua
                participação na plataforma.
              </Text>
            </View>

            {/* NOME */}

            <View style={styles.field}>
              <Text style={styles.label}>
                Nome completo
              </Text>

              <View
                style={[
                  styles.inputWrapper,
                  errors.fullName &&
                  styles.inputWrapperError,
                ]}
              >
                <MaterialIcons
                  name="person-outline"
                  size={20}
                  color={Colors.primary}
                  style={styles.inputLeadingIcon}
                />

                <TextInput
                  style={styles.input}
                  value={formData.fullName}
                  onChangeText={(value) =>
                    updateField(
                      "fullName",
                      value,
                    )
                  }
                  placeholder="Seu nome completo"
                  placeholderTextColor={
                    Colors.gray500
                  }
                  autoCapitalize="words"
                  autoComplete="name"
                  textContentType="name"
                />
              </View>

              {!!errors.fullName && (
                <Text style={styles.errorText}>
                  {errors.fullName}
                </Text>
              )}
            </View>

            {/* E-MAIL */}

            <View style={styles.field}>
              <Text style={styles.label}>
                E-mail
              </Text>

              <View
                style={[
                  styles.inputWrapper,
                  errors.email &&
                  styles.inputWrapperError,
                ]}
              >
                <MaterialIcons
                  name="mail-outline"
                  size={20}
                  color={Colors.primary}
                  style={styles.inputLeadingIcon}
                />

                <TextInput
                  style={styles.input}
                  value={formData.email}
                  onChangeText={(value) =>
                    updateField(
                      "email",
                      value,
                    )
                  }
                  placeholder="nome@exemplo.com"
                  placeholderTextColor={
                    Colors.gray500
                  }
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  textContentType="emailAddress"
                />
              </View>

              {!!errors.email && (
                <Text style={styles.errorText}>
                  {errors.email}
                </Text>
              )}
            </View>

            {/* SENHA */}

            <View style={styles.field}>
              <Text style={styles.label}>
                Senha
              </Text>

              <View
                style={[
                  styles.inputWrapper,
                  errors.password &&
                  styles.inputWrapperError,
                ]}
              >
                <MaterialIcons
                  name="lock-outline"
                  size={20}
                  color={Colors.primary}
                  style={styles.inputLeadingIcon}
                />

                <TextInput
                  style={styles.input}
                  value={formData.password}
                  onChangeText={(value) =>
                    updateField(
                      "password",
                      value,
                    )
                  }
                  placeholder="Crie uma senha segura"
                  placeholderTextColor={
                    Colors.gray500
                  }
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="new-password"
                  textContentType="newPassword"
                />

                <Pressable
                  style={
                    styles.passwordButton
                  }
                  onPress={() =>
                    setShowPassword(
                      (current) => !current,
                    )
                  }
                  accessibilityRole="button"
                  accessibilityLabel={
                    showPassword
                      ? "Ocultar senha"
                      : "Mostrar senha"
                  }
                >
                  <MaterialIcons
                    name={
                      showPassword
                        ? "visibility-off"
                        : "visibility"
                    }
                    size={20}
                    color={Colors.gray500}
                  />
                </Pressable>
              </View>

              {!!errors.password && (
                <Text style={styles.errorText}>
                  {errors.password}
                </Text>
              )}
            </View>

            {/* REGRAS DA SENHA */}

            <View style={styles.passwordRules}>
              <Text
                style={
                  styles.passwordRulesTitle
                }
              >
                Sua senha precisa ter:
              </Text>

              <PasswordRule
                valid={passwordChecks.length}
                label="Pelo menos 10 caracteres"
              />

              <PasswordRule
                valid={
                  passwordChecks.uppercase
                }
                label="Uma letra maiúscula"
              />

              <PasswordRule
                valid={
                  passwordChecks.lowercase
                }
                label="Uma letra minúscula"
              />

              <PasswordRule
                valid={passwordChecks.number}
                label="Um número"
              />

              <PasswordRule
                valid={passwordChecks.symbol}
                label="Um caractere especial"
              />

              <PasswordRule
                valid={
                  passwordChecks.noSpaces
                }
                label="Sem espaços"
              />
            </View>

            {/* CONFIRMAR SENHA */}

            <View style={styles.field}>
              <Text style={styles.label}>
                Confirmar senha
              </Text>

              <View
                style={[
                  styles.inputWrapper,
                  errors.confirmPassword &&
                  styles.inputWrapperError,
                ]}
              >
                <MaterialIcons
                  name="lock-outline"
                  size={20}
                  color={Colors.primary}
                  style={styles.inputLeadingIcon}
                />

                <TextInput
                  style={styles.input}
                  value={
                    formData.confirmPassword
                  }
                  onChangeText={(value) =>
                    updateField(
                      "confirmPassword",
                      value,
                    )
                  }
                  placeholder="Digite a senha novamente"
                  placeholderTextColor={
                    Colors.gray500
                  }
                  secureTextEntry={
                    !showConfirmPassword
                  }
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="new-password"
                  textContentType="newPassword"
                />

                <Pressable
                  style={
                    styles.passwordButton
                  }
                  onPress={() =>
                    setShowConfirmPassword(
                      (current) => !current,
                    )
                  }
                  accessibilityRole="button"
                  accessibilityLabel={
                    showConfirmPassword
                      ? "Ocultar confirmação da senha"
                      : "Mostrar confirmação da senha"
                  }
                >
                  <MaterialIcons
                    name={
                      showConfirmPassword
                        ? "visibility-off"
                        : "visibility"
                    }
                    size={20}
                    color={Colors.gray500}
                  />
                </Pressable>
              </View>

              {!!errors.confirmPassword && (
                <Text style={styles.errorText}>
                  {errors.confirmPassword}
                </Text>
              )}
            </View>

            {/* ==================================================
                TERMOS
            ================================================== */}

            <View style={styles.acceptanceGroup}>
              <DocumentAcceptance
                label="Li e aceito o Código de Conduta da CONG."
                opened={conductOpened}
                accepted={
                  formData.conductAccepted
                }
                error={
                  errors.conductAccepted
                }
                onOpen={() =>
                  openDocument("conduct")
                }
                onToggle={() => {
                  if (!conductOpened) {
                    openDocument("conduct");
                    return;
                  }

                  updateField(
                    "conductAccepted",
                    !formData.conductAccepted,
                  );
                }}
              />

              <DocumentAcceptance
                label="Li e aceito as informações de privacidade."
                opened={privacyOpened}
                accepted={
                  formData.privacyAccepted
                }
                error={
                  errors.privacyAccepted
                }
                onOpen={() =>
                  openDocument("privacy")
                }
                onToggle={() => {
                  if (!privacyOpened) {
                    openDocument("privacy");
                    return;
                  }

                  updateField(
                    "privacyAccepted",
                    !formData.privacyAccepted,
                  );
                }}
              />
            </View>

            {!!submissionError && (
              <View
                style={
                  styles.submissionError
                }
              >
                <MaterialIcons
                  name="error-outline"
                  size={19}
                  color={Colors.error}
                />

                <Text
                  style={
                    styles.submissionErrorText
                  }
                >
                  {submissionError}
                </Text>
              </View>
            )}

            {/* ==================================================
                CRIAR CONTA
            ================================================== */}

            <Pressable
              style={({ pressed }) => [
                styles.submitButton,
                pressed &&
                styles.submitButtonPressed,
                isSubmitting &&
                styles.submitButtonDisabled,
              ]}
              onPress={handleRegister}
              disabled={isSubmitting}
              accessibilityRole="button"
            >
              <Text
                style={styles.submitButtonText}
              >
                {isSubmitting
                  ? "Criando conta..."
                  : "Criar conta"}
              </Text>

              {!isSubmitting && (
                <MaterialIcons
                  name="arrow-forward"
                  size={20}
                  color={Colors.white}
                />
              )}
            </Pressable>

            <Text style={styles.nextStepText}>
              Depois do cadastro, vamos conhecer
              seus interesses e como você quer
              participar da CONG.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ==================================================
          MODAL DE DOCUMENTO
      ================================================== */}

      <Modal
        visible={documentModal !== null}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setDocumentModal(null)
        }
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.documentModal}>
            <View
              style={styles.modalHeader}
            >
              <View
                style={
                  styles.modalTitleContainer
                }
              >
                <View
                  style={styles.modalIcon}
                >
                  <MaterialIcons
                    name={
                      documentModal ===
                        "conduct"
                        ? "gavel"
                        : "privacy-tip"
                    }
                    size={22}
                    color={Colors.ink}
                  />
                </View>

                <View style={styles.modalTitleText}>
                  <Text
                    style={styles.modalEyebrow}
                  >
                    CONG
                  </Text>

                  <Text
                    style={styles.modalTitle}
                  >
                    {documentModal ===
                      "conduct"
                      ? "Código de Conduta"
                      : "Privacidade"}
                  </Text>
                </View>
              </View>

              <Pressable
                style={styles.modalClose}
                onPress={() =>
                  setDocumentModal(null)
                }
              >
                <MaterialIcons
                  name="close"
                  size={21}
                  color={Colors.ink}
                />
              </Pressable>
            </View>

            <ScrollView
              style={styles.modalScroll}
              contentContainerStyle={
                styles.modalContent
              }
              showsVerticalScrollIndicator={
                false
              }
            >
              {documentModal ===
                "conduct" ? (
                <>
                  <Text
                    style={
                      styles.documentHeading
                    }
                  >
                    Convivência na CONG
                  </Text>

                  <Text
                    style={
                      styles.documentParagraph
                    }
                  >
                    A CONG é um espaço de
                    colaboração entre pessoas,
                    voluntários, doadores,
                    profissionais e organizações.
                  </Text>

                  <Text
                    style={
                      styles.documentParagraph
                    }
                  >
                    Ao utilizar a plataforma,
                    comprometa-se a agir com
                    respeito, responsabilidade e
                    boa-fé nas interações com
                    outros participantes.
                  </Text>

                  <Text
                    style={
                      styles.documentHeading
                    }
                  >
                    Compromissos
                  </Text>

                  <DocumentItem text="Respeitar todas as pessoas e organizações participantes." />

                  <DocumentItem text="Não utilizar a plataforma para assédio, discriminação, fraude ou atividades ilegais." />

                  <DocumentItem text="Fornecer informações verdadeiras sobre oportunidades, ações e organizações." />

                  <DocumentItem text="Utilizar os recursos da CONG de maneira responsável." />
                </>
              ) : (
                <>
                  <Text
                    style={
                      styles.documentHeading
                    }
                  >
                    Uso dos seus dados
                  </Text>

                  <Text
                    style={
                      styles.documentParagraph
                    }
                  >
                    As informações fornecidas no
                    cadastro são utilizadas para
                    criar sua conta e permitir o
                    funcionamento dos recursos da
                    CONG.
                  </Text>

                  <Text
                    style={
                      styles.documentParagraph
                    }
                  >
                    Dados adicionais sobre seu
                    perfil e suas preferências
                    serão solicitados somente nas
                    próximas etapas da
                    plataforma.
                  </Text>

                  <Text
                    style={
                      styles.documentHeading
                    }
                  >
                    Seus dados
                  </Text>

                  <DocumentItem text="Utilizamos os dados necessários para identificação e acesso à conta." />

                  <DocumentItem text="Suas preferências serão utilizadas para personalizar sua experiência na plataforma." />

                  <DocumentItem text="Informações sensíveis de autenticação não devem ser expostas publicamente." />
                </>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <Pressable
                style={({ pressed }) => [
                  styles.acceptButton,
                  pressed &&
                  styles.acceptButtonPressed,
                ]}
                onPress={acceptDocument}
              >
                <MaterialIcons
                  name="check"
                  size={19}
                  color={Colors.white}
                />

                <Text
                  style={
                    styles.acceptButtonText
                  }
                >
                  Li e aceito
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ==================================================
// REGRA DE SENHA
// ==================================================

function PasswordRule({
  valid,
  label,
}: {
  valid: boolean;
  label: string;
}) {
  return (
    <View style={styles.passwordRule}>
      <MaterialIcons
        name={
          valid
            ? "check-circle"
            : "radio-button-unchecked"
        }
        size={16}
        color={
          valid
            ? Colors.success
            : Colors.gray500
        }
      />

      <Text
        style={[
          styles.passwordRuleText,
          valid &&
          styles.passwordRuleTextValid,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

// ==================================================
// ACEITE DE DOCUMENTO
// ==================================================

function DocumentAcceptance({
  label,
  opened,
  accepted,
  error,
  onOpen,
  onToggle,
}: {
  label: string;
  opened: boolean;
  accepted: boolean;
  error?: string;
  onOpen: () => void;
  onToggle: () => void;
}) {
  return (
    <View style={styles.acceptanceItem}>
      <Pressable
        style={styles.acceptanceLabel}
        onPress={onToggle}
      >
        <View
          style={[
            styles.checkbox,
            accepted &&
            styles.checkboxSelected,
          ]}
        >
          {accepted && (
            <MaterialIcons
              name="check"
              size={15}
              color={Colors.ink}
            />
          )}
        </View>

        <Text style={styles.termsText}>
          {label}
        </Text>
      </Pressable>

      <Pressable
        style={styles.documentButton}
        onPress={onOpen}
      >
        <MaterialIcons
          name={
            opened
              ? "check-circle"
              : "article"
          }
          size={16}
          color={
            opened
              ? Colors.success
              : Colors.primary
          }
        />

        <Text
          style={styles.documentButtonText}
        >
          {opened
            ? "Documento lido"
            : "Ler documento"}
        </Text>
      </Pressable>

      {!!error && (
        <Text style={styles.acceptanceError}>
          {error}
        </Text>
      )}
    </View>
  );
}

// ==================================================
// ITEM DOS DOCUMENTOS
// ==================================================

function DocumentItem({
  text,
}: {
  text: string;
}) {
  return (
    <View style={styles.documentItem}>
      <View style={styles.documentBullet} />

      <Text style={styles.documentItemText}>
        {text}
      </Text>
    </View>
  );
}

// =========================================================
// ESTILOS
// =========================================================

const styles = StyleSheet.create({
  // ==================================================
  // ESTRUTURA
  // ==================================================

  safeArea: {
    flex: 1,
    backgroundColor: Colors.paper,
  },

  keyboard: {
    flex: 1,
  },

  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },

  // ==================================================
  // CABEÇALHO
  // ==================================================

  header: {
    minHeight: 62,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    gap: 10,
  },

  backButton: {
    width: 42,
    height: 42,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: Colors.white,

    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 13,
  },

  buttonPressed: {
    opacity: 0.7,
  },

  brand: {
    flex: 1,

    paddingHorizontal: 4,
  },

  brandName: {
    color: Colors.ink,

    fontFamily: Fonts.brand,
    fontSize: Fonts.xl,
  },

  brandSubtitle: {
    marginTop: 1,

    color: Colors.muted,

    fontFamily: Fonts.body,
    fontSize: Fonts["3xs"],
  },

  loginText: {
    color: Colors.muted,

    fontFamily: Fonts.body,
    fontSize: Fonts["2xs"],

    textAlign: "right",
  },

  loginTextStrong: {
    color: Colors.primary,

    fontFamily: Fonts.bodyBold,
    fontSize: Fonts["2xs"],
  },

  // ==================================================
  // INTRODUÇÃO
  // ==================================================

  intro: {
    alignItems: "center",

    paddingTop: 18,
    paddingBottom: 28,
  },

  mascotContainer: {
    position: "relative",

    width: 160,
    height: 125,

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 12,
  },

  mascotGlow: {
    position: "absolute",

    width: 120,
    height: 70,

    backgroundColor: Colors.accentPale,

    borderRadius: 100,

    opacity: 0.8,
  },

  mascot: {
    width: 120,
    height: 120,
  },

  eyebrow: {
    marginBottom: 8,

    color: Colors.primary,

    fontFamily: Fonts.bodyExtraBold,
    fontSize: Fonts.labelSmall,

    letterSpacing: 1.2,

    textAlign: "center",
  },

  mainTitle: {
    maxWidth: 390,

    color: Colors.ink,

    fontFamily: Fonts.brand,
    fontSize: Fonts.h2,

    lineHeight: 43,

    textAlign: "center",
  },

  mainTitleHighlight: {
    color: Colors.accentDark,

    fontFamily: Fonts.brand,
  },

  mainDescription: {
    maxWidth: 390,

    marginTop: 12,

    color: Colors.muted,

    fontFamily: Fonts.body,
    fontSize: Fonts.sm,

    lineHeight: 20,

    textAlign: "center",
  },

  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",

    gap: 7,

    marginTop: 17,
  },

  tag: {
    flexDirection: "row",
    alignItems: "center",

    gap: 5,

    paddingHorizontal: 10,
    paddingVertical: 7,

    backgroundColor: Colors.white,

    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 100,
  },

  tagText: {
    color: Colors.ink,

    fontFamily: Fonts.bodyBold,
    fontSize: Fonts["2xs"],
  },

  // ==================================================
  // FORMULÁRIO
  // ==================================================

  formSurface: {
    width: "100%",
    maxWidth: 520,

    alignSelf: "center",

    padding: 18,

    backgroundColor: Colors.white,

    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,

    ...Colors.shadow.xl,
  },

  formHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    gap: 12,

    paddingBottom: 18,
    marginBottom: 20,

    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  formHeaderText: {
    flex: 1,
  },

  formEyebrow: {
    marginBottom: 4,

    color: Colors.primary,

    fontFamily: Fonts.bodyExtraBold,
    fontSize: Fonts["3xs"],

    letterSpacing: 1,
  },

  formTitle: {
    color: Colors.ink,

    fontFamily: Fonts.brand,
    fontSize: Fonts["2xl"],

    lineHeight: 31,
  },

  formDescription: {
    marginTop: 5,

    color: Colors.muted,

    fontFamily: Fonts.body,
    fontSize: Fonts.xs,

    lineHeight: 18,
  },

  formIcon: {
    width: 45,
    height: 45,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: Colors.accentPale,

    borderRadius: 14,
  },

  // ==================================================
  // PRIVACIDADE
  // ==================================================

  privacyBox: {
    flexDirection: "row",
    alignItems: "flex-start",

    gap: 10,

    padding: 13,
    marginBottom: 20,

    backgroundColor: Colors.paperWarm,

    borderRadius: 14,
  },

  privacyText: {
    flex: 1,

    color: Colors.muted,

    fontFamily: Fonts.body,
    fontSize: Fonts["2xs"],

    lineHeight: 17,
  },

  // ==================================================
  // CAMPOS
  // ==================================================

  field: {
    marginBottom: 16,
  },

  label: {
    marginBottom: 7,

    color: Colors.ink,

    fontFamily: Fonts.bodySemiBold,
    fontSize: Fonts.label,
  },

  inputWrapper: {
    minHeight: 54,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor: Colors.white,

    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 14,
  },

  inputWrapperError: {
    borderColor: Colors.error,
  },

  inputLeadingIcon: {
    marginLeft: 14,
  },

  input: {
    flex: 1,

    minHeight: 52,

    paddingHorizontal: 11,
    paddingVertical: 0,

    color: Colors.ink,

    fontFamily: Fonts.body,
    fontSize: Fonts.sm,
  },

  passwordButton: {
    width: 45,
    height: 52,

    alignItems: "center",
    justifyContent: "center",
  },

  errorText: {
    marginTop: 5,

    color: Colors.error,

    fontFamily: Fonts.bodySemiBold,
    fontSize: Fonts["2xs"],
  },

  // ==================================================
  // REGRAS DA SENHA
  // ==================================================

  passwordRules: {
    padding: 13,
    marginTop: -5,
    marginBottom: 17,

    backgroundColor: Colors.paperSoft,

    borderRadius: 14,
  },

  passwordRulesTitle: {
    marginBottom: 9,

    color: Colors.ink,

    fontFamily: Fonts.bodyExtraBold,
    fontSize: Fonts["2xs"],
  },

  passwordRule: {
    flexDirection: "row",
    alignItems: "center",

    gap: 7,

    marginBottom: 6,
  },

  passwordRuleText: {
    color: Colors.muted,

    fontFamily: Fonts.body,
    fontSize: Fonts["2xs"],
  },

  passwordRuleTextValid: {
    color: Colors.success,

    fontFamily: Fonts.bodyBold,
  },

  // ==================================================
  // TERMOS
  // ==================================================

  acceptanceGroup: {
    gap: 18,

    marginTop: 4,
    marginBottom: 22,
  },

  acceptanceItem: {
    gap: 8,
  },

  acceptanceLabel: {
    flexDirection: "row",
    alignItems: "flex-start",

    gap: 10,
  },

  checkbox: {
    width: 22,
    height: 22,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: Colors.white,

    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 6,
  },

  checkboxSelected: {
    backgroundColor: Colors.accent,
    borderColor: Colors.ink,
  },

  termsText: {
    flex: 1,

    color: Colors.muted,

    fontFamily: Fonts.body,
    fontSize: Fonts.xs,

    lineHeight: 18,
  },

  documentButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",

    gap: 6,

    marginLeft: 32,

    paddingVertical: 3,
  },

  documentButtonText: {
    color: Colors.primary,

    fontFamily: Fonts.bodySemiBold,
    fontSize: Fonts.xs,
  },

  acceptanceError: {
    marginLeft: 32,

    color: Colors.error,

    fontFamily: Fonts.bodySemiBold,
    fontSize: Fonts["2xs"],
  },

  // ==================================================
  // ERRO GERAL
  // ==================================================

  submissionError: {
    flexDirection: "row",
    alignItems: "center",

    gap: 8,

    padding: 12,
    marginBottom: 16,

    backgroundColor: Colors.red50,

    borderRadius: 12,
  },

  submissionErrorText: {
    flex: 1,

    color: Colors.error,

    fontFamily: Fonts.bodySemiBold,
    fontSize: Fonts.xs,

    lineHeight: 17,
  },

  // ==================================================
  // BOTÃO PRINCIPAL
  // ==================================================

  submitButton: {
    width: "100%",
    minHeight: 55,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 9,

    backgroundColor: Colors.navy,

    borderRadius: 13,

    shadowColor: Colors.accentShadow,

    shadowOffset: {
      width: 0,
      height: 5,
    },

    shadowOpacity: 1,
    shadowRadius: 0,

    elevation: 4,
  },

  submitButtonPressed: {
    transform: [
      {
        translateY: 2,
      },
    ],
  },

  submitButtonDisabled: {
    opacity: 0.65,
  },

  submitButtonText: {
    color: Colors.white,

    fontFamily: Fonts.brand,
    fontSize: Fonts.md,
  },

  nextStepText: {
    marginTop: 16,

    color: Colors.muted,

    fontFamily: Fonts.body,
    fontSize: Fonts["2xs"],

    lineHeight: 17,

    textAlign: "center",
  },

  // ==================================================
  // MODAL
  // ==================================================

  modalBackdrop: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    padding: 18,

    //backgroundColor: Colors.overlayDark,
  },

  documentModal: {
    width: "100%",
    maxWidth: 500,
    maxHeight: "82%",

    backgroundColor: Colors.white,

    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 22,

    overflow: "hidden",
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    gap: 12,

    padding: 17,

    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  modalTitleContainer: {
    flex: 1,

    flexDirection: "row",
    alignItems: "center",

    gap: 10,
  },

  modalIcon: {
    width: 42,
    height: 42,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: Colors.accentPale,

    borderRadius: 13,
  },

  modalTitleText: {
    flex: 1,
  },

  modalEyebrow: {
    color: Colors.primary,

    fontFamily: Fonts.bodyExtraBold,
    fontSize: Fonts["3xs"],

    letterSpacing: 1,
  },

  modalTitle: {
    marginTop: 2,

    color: Colors.ink,

    fontFamily: Fonts.brand,
    fontSize: Fonts.xl,
  },

  modalClose: {
    width: 38,
    height: 38,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: Colors.paperSoft,

    borderRadius: 11,
  },

  modalScroll: {
    flexShrink: 1,
  },

  modalContent: {
    padding: 18,
  },

  documentHeading: {
    marginTop: 5,
    marginBottom: 8,

    color: Colors.ink,

    fontFamily: Fonts.bodyExtraBold,
    fontSize: Fonts.md,
  },

  documentParagraph: {
    marginBottom: 14,

    color: Colors.muted,

    fontFamily: Fonts.body,
    fontSize: Fonts.sm,

    lineHeight: 21,
  },

  documentItem: {
    flexDirection: "row",
    alignItems: "flex-start",

    gap: 9,

    marginBottom: 10,
  },

  documentBullet: {
    width: 7,
    height: 7,

    marginTop: 7,

    backgroundColor: Colors.accent,

    borderRadius: 4,
  },

  documentItemText: {
    flex: 1,

    color: Colors.muted,

    fontFamily: Fonts.body,
    fontSize: Fonts.sm,

    lineHeight: 20,
  },

  modalFooter: {
    padding: 16,

    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },

  acceptButton: {
    minHeight: 52,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 8,

    backgroundColor: Colors.navy,

    borderRadius: 13,
  },

  acceptButtonPressed: {
    opacity: 0.85,
  },

  acceptButtonText: {
    color: Colors.white,

    fontFamily: Fonts.bodyBold,
    fontSize: Fonts.sm,
  },
});
