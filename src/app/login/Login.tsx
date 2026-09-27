import FontAwesome from "@react-native-vector-icons/fontawesome";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { router } from "expo-router";
import { useState } from "react";
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

import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { ApiError } from "@/services/api";
import { useAuthentication } from "@/hooks/useAuthentication";


// =========================================================
// TIPOS
// =========================================================

type LoginFormData = {
  email: string;
  password: string;
};

// =========================================================
// COMPONENTE
// =========================================================

export default function Login() {
  const { signIn } = useAuthentication();
  const [formData, setFormData] =
    useState<LoginFormData>({
      email: "",
      password: "",
    });

  const [showPassword, setShowPassword] =
    useState(false);

  const [rememberMe, setRememberMe] =
    useState(false);

  const [isLoggingIn, setIsLoggingIn] =
    useState(false);

  const [loginError, setLoginError] =
    useState("");

  // =======================================================
  // LOGIN
  // =======================================================

  async function handleLogin() {
    if (isLoggingIn) {
      return;
    }

    const email = formData.email
      .trim()
      .toLowerCase();

    const password = formData.password;

    // -----------------------------------------------------
    // VALIDAÇÃO
    // -----------------------------------------------------

    if (!email) {
      setLoginError(
        "Informe seu e-mail.",
      );
      return;
    }

    if (!password) {
      setLoginError(
        "Informe sua senha.",
      );
      return;
    }

    setLoginError("");
    setIsLoggingIn(true);

    try {
      const account = await signIn({
        email,
        password,
        rememberMe,
      });

      switch (account.onboardingStep) {
        case "identity":
          router.replace("/firstaccess/FirstAccess");
          break;

        case "roles":
          router.replace("/roleselection/RoleSelection");
          break;

        case "profiles":
          router.replace("/completeprofiles/CompleteProfiles");
          break;

        case "completed":
          router.replace("/(tabs)/community");
          break;
      }
    } catch (error) {
      console.error(
        "Erro ao entrar na CONG:",
        error,
      );

      // ---------------------------------------------------
      // ERRO DESCONHECIDO
      // ---------------------------------------------------

      if (!(error instanceof ApiError)) {
        setLoginError(
          "Não foi possível entrar. Tente novamente.",
        );
        return;
      }

      // ---------------------------------------------------
      // SEM CONEXÃO COM O BACKEND
      // ---------------------------------------------------

      if (error.status === 0) {
        setLoginError(
          "Não foi possível conectar ao servidor. Verifique sua conexão.",
        );
        return;
      }

      // ---------------------------------------------------
      // CREDENCIAIS INCORRETAS
      // ---------------------------------------------------

      if (error.status === 401) {
        setLoginError(
          "E-mail ou senha incorretos.",
        );
        return;
      }

      // ---------------------------------------------------
      // CONTA SEM PERMISSÃO
      // ---------------------------------------------------

      if (error.status === 403) {
        setLoginError(
          "Não foi possível acessar esta conta. Verifique se seu e-mail foi confirmado.",
        );
        return;
      }

      // ---------------------------------------------------
      // MUITAS TENTATIVAS
      // ---------------------------------------------------

      if (error.status === 429) {
        setLoginError(
          "Muitas tentativas de acesso. Aguarde alguns minutos.",
        );
        return;
      }

      // ---------------------------------------------------
      // OUTROS ERROS DA API
      // ---------------------------------------------------

      setLoginError(
        error.message ||
          "Não foi possível entrar. Tente novamente.",
      );
    } finally {
      setIsLoggingIn(false);
    }
  }

  // =======================================================
  // NAVEGAÇÃO
  // =======================================================

  function handleSignup() {
    router.push("/register/Register");
  }

  function handleForgotPassword() {
    router.push(
      "/recoverpassword/Recoverpassword",
    );
  }

  // =======================================================
  // LOGIN SOCIAL
  // =======================================================

  function handleGithubLogin() {
    Alert.alert(
      "Login com GitHub",
      "Nesta entrega, a autenticação principal da CONG é por e-mail e senha.",
    );
  }

  function handleGoogleLogin() {
    Alert.alert(
      "Login com Google",
      "Nesta entrega, a autenticação principal da CONG é por e-mail e senha.",
    );
  }

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ==================================================
              MASCOTE
          ================================================== */}

          <View style={styles.mascotArea}>
            <View style={styles.mascotGlow} />

            <Image
              source={require(
                "../../../assets/images/Cong.png"
              )}
              style={styles.logo}
              resizeMode="contain"
              accessibilityLabel="Mascote da CONG"
            />
          </View>

          {/* ==================================================
              BOAS-VINDAS
          ================================================== */}

          <View style={styles.welcome}>
            <Text style={styles.eyebrow}>
              ACESSO À PLATAFORMA
            </Text>

            <Text style={styles.title}>
              Bem-vindo de volta!
            </Text>

            <View
              style={
                styles.descriptionContainer
              }
            >
              <Text
                style={styles.description}
              >
                Faça login para continuar
                construindo
              </Text>

              <View
                style={
                  styles.highlightContainer
                }
              >
                <Text
                  style={styles.highlight}
                >
                  impacto real.
                </Text>

                <View
                  style={
                    styles.highlightUnderline
                  }
                />
              </View>
            </View>
          </View>

          {/* ==================================================
              CARD DE LOGIN
          ================================================== */}

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text
                style={styles.cardEyebrow}
              >
                CONG
              </Text>

              <Text
                style={styles.cardTitle}
              >
                Entrar na sua conta
              </Text>

              <Text
                style={
                  styles.cardDescription
                }
              >
                Use seu e-mail e senha para
                acessar a plataforma.
              </Text>
            </View>

            {/* ==================================================
                E-MAIL
            ================================================== */}

            <View
              style={styles.fieldContainer}
            >
              <Text style={styles.label}>
                E-mail
              </Text>

              <View style={styles.inputGroup}>
                <View
                  style={styles.inputIcon}
                >
                  <MaterialIcons
                    name="person"
                    size={18}
                    color={Colors.primary}
                  />
                </View>

                <TextInput
                  style={styles.input}
                  placeholder="nome@exemplo.com"
                  placeholderTextColor={
                    Colors.gray500
                  }
                  value={formData.email}
                  onChangeText={(email) => {
                    setFormData(
                      (current) => ({
                        ...current,
                        email,
                      }),
                    );

                    if (loginError) {
                      setLoginError("");
                    }
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  textContentType="emailAddress"
                  accessibilityLabel="E-mail"
                  editable={!isLoggingIn}
                />
              </View>
            </View>

            {/* ==================================================
                SENHA
            ================================================== */}

            <View
              style={styles.fieldContainer}
            >
              <Text style={styles.label}>
                Senha
              </Text>

              <View style={styles.inputGroup}>
                <View
                  style={styles.inputIcon}
                >
                  <MaterialIcons
                    name="lock"
                    size={18}
                    color={Colors.primary}
                  />
                </View>

                <TextInput
                  style={styles.input}
                  placeholder="Digite sua senha"
                  placeholderTextColor={
                    Colors.gray500
                  }
                  value={formData.password}
                  onChangeText={(
                    password,
                  ) => {
                    setFormData(
                      (current) => ({
                        ...current,
                        password,
                      }),
                    );

                    if (loginError) {
                      setLoginError("");
                    }
                  }}
                  secureTextEntry={
                    !showPassword
                  }
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="password"
                  textContentType="password"
                  accessibilityLabel="Senha"
                  editable={!isLoggingIn}
                  onSubmitEditing={
                    handleLogin
                  }
                />

                <Pressable
                  style={
                    styles.passwordButton
                  }
                  onPress={() =>
                    setShowPassword(
                      (current) =>
                        !current,
                    )
                  }
                  accessibilityRole="button"
                  accessibilityLabel={
                    showPassword
                      ? "Ocultar senha"
                      : "Mostrar senha"
                  }
                  disabled={isLoggingIn}
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
            </View>

            {/* ==================================================
                OPÇÕES
            ================================================== */}

            <View style={styles.options}>
              <Pressable
                style={styles.remember}
                onPress={() =>
                  setRememberMe(
                    (current) =>
                      !current,
                  )
                }
                accessibilityRole="checkbox"
                accessibilityState={{
                  checked: rememberMe,
                }}
                disabled={isLoggingIn}
              >
                <View
                  style={[
                    styles.checkbox,
                    rememberMe &&
                      styles.activeCheckbox,
                  ]}
                >
                  {rememberMe && (
                    <MaterialIcons
                      name="check"
                      size={14}
                      color={Colors.white}
                    />
                  )}
                </View>

                <Text
                  style={
                    styles.rememberText
                  }
                >
                  Lembrar de mim
                </Text>
              </Pressable>

              <Pressable
                onPress={
                  handleForgotPassword
                }
                accessibilityRole="button"
                disabled={isLoggingIn}
              >
                <Text
                  style={
                    styles.forgotPasswordText
                  }
                >
                  Esqueceu sua senha?
                </Text>
              </Pressable>
            </View>

            {/* ==================================================
                ERRO DE LOGIN
            ================================================== */}

            {loginError ? (
              <View
                style={{
                  marginBottom: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  borderRadius: 8,
                  backgroundColor:
                    Colors.surfaceSoft,
                }}
              >
                <Text
                  style={{
                    color: Colors.ink,
                    fontSize: 14,
                  }}
                >
                  {loginError}
                </Text>
              </View>
            ) : null}

            {/* ==================================================
                BOTÃO DE LOGIN
            ================================================== */}

            <Pressable
              style={({ pressed }) => [
                styles.loginButton,

                pressed &&
                  !isLoggingIn &&
                  styles.loginButtonPressed,

                isLoggingIn && {
                  opacity: 0.65,
                },
              ]}
              onPress={handleLogin}
              disabled={isLoggingIn}
              accessibilityRole="button"
              accessibilityLabel={
                isLoggingIn
                  ? "Entrando na CONG"
                  : "Entrar na CONG"
              }
              accessibilityState={{
                disabled: isLoggingIn,
                busy: isLoggingIn,
              }}
            >
              <Text
                style={
                  styles.loginButtonText
                }
              >
                {isLoggingIn
                  ? "Entrando..."
                  : "Entrar"}
              </Text>

              <MaterialIcons
                name="login"
                size={19}
                color={Colors.white}
              />
            </Pressable>

            {/* ==================================================
                DIVISOR
            ================================================== */}

            <View style={styles.divider}>
              <View
                style={styles.dividerLine}
              />

              <Text
                style={styles.dividerText}
              >
                ou continue com
              </Text>

              <View
                style={styles.dividerLine}
              />
            </View>

            {/* ==================================================
                LOGIN SOCIAL
            ================================================== */}

            <View style={styles.socialGrid}>
              <Pressable
                style={({ pressed }) => [
                  styles.socialButton,
                  pressed &&
                    styles.socialButtonPressed,
                ]}
                onPress={handleGithubLogin}
                accessibilityRole="button"
                accessibilityLabel="Entrar com GitHub"
                disabled={isLoggingIn}
              >
                <FontAwesome
                  name="github"
                  size={22}
                  color={Colors.purple500}
                />

                <Text
                  style={styles.socialText}
                >
                  GitHub
                </Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.socialButton,
                  pressed &&
                    styles.socialButtonPressed,
                ]}
                onPress={handleGoogleLogin}
                accessibilityRole="button"
                accessibilityLabel="Entrar com Google"
                disabled={isLoggingIn}
              >
                <Text
                  style={styles.googleLogo}
                >
                  G
                </Text>

                <Text
                  style={styles.socialText}
                >
                  Google
                </Text>
              </Pressable>
            </View>

            {/* ==================================================
                CRIAR CONTA
            ================================================== */}

            <View style={styles.signup}>
              <Text
                style={styles.signupText}
              >
                Ainda não tem uma conta?
              </Text>

              <Pressable
                onPress={handleSignup}
                accessibilityRole="button"
                disabled={isLoggingIn}
              >
                <Text
                  style={styles.signupLink}
                >
                  Criar conta
                </Text>
              </Pressable>
            </View>
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
  // ==================================================
  // TELA
  // ==================================================

  container: {
    flex: 1,
    backgroundColor: Colors.paper,
  },

  keyboard: {
    flex: 1,
  },

  scroll: {
    flexGrow: 1,
    alignItems: "center",

    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },

  // ==================================================
  // MASCOTE
  // ==================================================

  mascotArea: {
    position: "relative",

    width: "100%",
    height: 200,

    alignItems: "center",
    justifyContent: "flex-end",
  },

  mascotGlow: {
    position: "absolute",

    bottom: 5,

    width: 180,
    height: 180,

    backgroundColor: Colors.cardBlue,

    borderRadius: 90,

    opacity: 0.78,
  },

  logo: {
    zIndex: 2,

    width: 175,
    height: 175,
  },

  // ==================================================
  // BOAS-VINDAS
  // ==================================================

  welcome: {
    alignItems: "center",

    marginTop: 8,
    marginBottom: 36,

    paddingHorizontal: 8,
  },

  eyebrow: {
    color: Colors.primary,

    fontFamily: Fonts.bodyExtraBold,
    fontSize: Fonts.xs,

    letterSpacing: 1.2,

    textAlign: "center",
  },

  title: {
    marginTop: 8,

    color: Colors.navy,

    fontFamily: Fonts.brand,
    fontSize: Fonts.h2,

    lineHeight: 41,

    textAlign: "center",
  },

  descriptionContainer: {
    maxWidth: 320,

    marginTop: 12,

    alignItems: "center",
  },

  description: {
    color: Colors.muted,

    fontFamily: Fonts.body,
    fontSize: Fonts.xs,

    lineHeight: 20,

    textAlign: "center",
  },

  highlightContainer: {
    position: "relative",
    alignSelf: "center",
  },

  highlight: {
    zIndex: 2,

    color: Colors.navy,

    fontFamily: Fonts.body,
    fontSize: Fonts.xs,

    lineHeight: 20,
  },

  highlightUnderline: {
    position: "absolute",

    right: -1,
    bottom: 0,
    left: -1,

    height: 3,

    backgroundColor: Colors.accent,

    borderRadius: 999,
  },

  // ==================================================
  // CARD
  // ==================================================

  card: {
    width: "100%",
    maxWidth: 430,

    paddingTop: 26,
    paddingHorizontal: 18,
    paddingBottom: 22,

    backgroundColor: Colors.white,

    borderWidth: 1,
    borderColor: Colors.border,

    borderRadius: 17,

    ...Colors.shadow.xl,
  },

  cardHeader: {
    alignItems: "center",

    marginBottom: 24,
  },

  cardEyebrow: {
    color: Colors.primary,

    fontFamily: Fonts.bodyExtraBold,
    fontSize: Fonts.xs,

    letterSpacing: 1.2,
  },

  cardTitle: {
    marginTop: 7,

    color: Colors.navy,

    fontFamily: Fonts.brand,
    fontSize: Fonts["2xl"],

    lineHeight: 30,

    textAlign: "center",
  },

  cardDescription: {
    maxWidth: 300,

    marginTop: 9,

    color: Colors.muted,

    fontFamily: Fonts.body,
    fontSize: Fonts.xs,

    lineHeight: 18,

    textAlign: "center",
  },

  // ==================================================
  // CAMPOS
  // ==================================================

  fieldContainer: {
    width: "100%",

    marginBottom: 16,
  },

  label: {
    marginBottom: 7,
    marginLeft: 3,

    color: Colors.navy,

    fontFamily: Fonts.bodyBold,
    fontSize: Fonts.xs,
  },

  inputGroup: {
    width: "100%",
    minHeight: 54,

    flexDirection: "row",
    alignItems: "center",

    paddingLeft: 8,
    paddingRight: 7,

    backgroundColor: Colors.white,

    borderWidth: 1.5,
    borderColor: Colors.border,

    borderRadius: 14,
  },

  inputIcon: {
    width: 36,
    height: 36,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 10,

    backgroundColor: Colors.cardBlue,

    borderRadius: 11,
  },

  input: {
    flex: 1,

    minHeight: 50,

    paddingHorizontal: 2,
    paddingVertical: 0,

    color: Colors.gray900,

    fontFamily: Fonts.body,
    fontSize: Fonts.sm,
  },

  passwordButton: {
    width: 34,
    height: 34,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 9,
  },

  // ==================================================
  // OPÇÕES
  // ==================================================

  options: {
    width: "100%",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    flexWrap: "wrap",

    marginTop: 0,
    marginBottom: 21,

    gap: 12,
  },

  remember: {
    flexDirection: "row",
    alignItems: "center",
  },

  checkbox: {
    width: 17,
    height: 17,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 7,

    backgroundColor: Colors.white,

    borderWidth: 1.5,
    borderColor: Colors.border,

    borderRadius: 5,
  },

  activeCheckbox: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  rememberText: {
    color: Colors.muted,

    fontFamily: Fonts.body,
    fontSize: Fonts.xs,
  },

  forgotPasswordText: {
    color: Colors.primary,

    fontFamily: Fonts.bodyBold,
    fontSize: Fonts.xs,
  },

  // ==================================================
  // BOTÃO DE LOGIN
  // ==================================================

  loginButton: {
    width: "100%",
    minHeight: 54,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 10,

    backgroundColor: Colors.navy,

    borderWidth: 1,
    borderColor: Colors.navy,

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

  loginButtonPressed: {
    transform: [
      {
        translateY: 2,
      },
    ],
  },

  loginButtonText: {
    color: Colors.white,

    fontFamily: Fonts.brand,
    fontSize: Fonts.md,
  },

  // ==================================================
  // DIVISOR
  // ==================================================

  divider: {
    width: "100%",

    flexDirection: "row",
    alignItems: "center",

    marginTop: 25,
    marginBottom: 18,
  },

  dividerLine: {
    flex: 1,

    height: 1,

    backgroundColor: Colors.border,
  },

  dividerText: {
    marginHorizontal: 12,

    color: Colors.gray500,

    fontFamily: Fonts.body,
    fontSize: Fonts.xs,
  },

  // ==================================================
  // LOGIN SOCIAL
  // ==================================================

  socialGrid: {
    width: "100%",

    flexDirection: "row",

    gap: 11,
  },

  socialButton: {
    flex: 1,

    minWidth: 0,
    minHeight: 49,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 8,

    paddingHorizontal: 8,

    backgroundColor: Colors.white,

    borderWidth: 1,
    borderColor: Colors.border,

    borderRadius: 11,
  },

  socialButtonPressed: {
    transform: [
      {
        translateY: 1,
      },
    ],
  },

  socialText: {
    color: Colors.gray900,

    fontFamily: Fonts.bodySemiBold,
    fontSize: Fonts.sm,
  },

  googleLogo: {
    color: "#4285F4",

    fontFamily: Fonts.bodyBold,
    fontSize: Fonts.xl,
  },

  // ==================================================
  // CRIAR CONTA
  // ==================================================

  signup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    flexWrap: "wrap",

    marginTop: 22,

    gap: 5,
  },

  signupText: {
    color: Colors.muted,

    fontFamily: Fonts.body,
    fontSize: Fonts.sm,
  },

  signupLink: {
    color: Colors.primary,

    fontFamily: Fonts.bodyBold,
    fontSize: Fonts.sm,
  },
});
