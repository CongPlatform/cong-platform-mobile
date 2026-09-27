import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  Image,
  Pressable,
  Text,
  View,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function EmailVerification() {
  const params = useLocalSearchParams<{
    email?: string | string[];
  }>();

  const email = Array.isArray(params.email)
    ? params.email[0]
    : params.email;

  function handleGoToLogin() {
    router.replace("/login/Login");
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Image
            source={require(
              "../../../assets/images/Cong.png"
            )}
            style={styles.mascot}
            resizeMode="contain"
            accessibilityLabel="Mascote da CONG"
          />

          <View style={styles.iconContainer}>
            <MaterialIcons
              name="mark-email-unread"
              size={38}
              style={styles.icon}
            />
          </View>

          <Text style={styles.title}>
            Verifique seu e-mail
          </Text>

          <Text style={styles.description}>
            Enviamos um link de confirmação para:
          </Text>

          {!!email && (
            <Text style={styles.email}>
              {email}
            </Text>
          )}

          <Text style={styles.instructions}>
            Abra o e-mail enviado pela CONG e confirme
            sua conta. Depois, volte para o aplicativo
            para entrar.
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.loginButton,
              pressed && styles.loginButtonPressed,
            ]}
            onPress={handleGoToLogin}
            accessibilityRole="button"
          >
            <Text style={styles.loginButtonText}>
              Ir para o login
            </Text>

            <MaterialIcons
              name="arrow-forward"
              size={20}
              style={styles.buttonIcon}
            />
          </Pressable>

          <View style={styles.helpRow}>
            <MaterialIcons
              name="info-outline"
              size={18}
              style={styles.helpIcon}
            />

            <Text style={styles.helpText}>
              O e-mail pode levar alguns instantes para
              chegar. Confira também a caixa de spam.
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

// =========================================================
// ESTILOS
// =========================================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.paper,
  },

  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },

  content: {
    alignItems: "center",
  },

  mascot: {
    width: 105,
    height: 105,
    marginBottom: 22,
  },

  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary50,
    marginBottom: 22,
  },

  icon: {
    color: Colors.primary,
  },

  title: {
    fontFamily: Fonts.bodyBold,
    fontSize: 28,
    lineHeight: 34,
    color: Colors.slate900,
    textAlign: "center",
    marginBottom: 12,
  },

  description: {
    fontFamily: Fonts.body,
    fontSize: 15,
    lineHeight: 22,
    color: Colors.slate600,
    textAlign: "center",
  },

  email: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 15,
    lineHeight: 22,
    color: Colors.primary,
    textAlign: "center",
    marginTop: 3,
  },

  instructions: {
    fontFamily: Fonts.body,
    fontSize: 15,
    lineHeight: 23,
    color: Colors.slate600,
    textAlign: "center",
    marginTop: 18,
    maxWidth: 340,
  },

  loginButton: {
    width: "100%",
    minHeight: 54,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    marginTop: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 20,
  },

  loginButtonPressed: {
    opacity: 0.88,
  },

  loginButtonText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 16,
    color: Colors.white,
  },

  buttonIcon: {
    color: Colors.white,
  },

  helpRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginTop: 24,
    paddingHorizontal: 8,
  },

  helpIcon: {
    color: Colors.slate500,
    marginTop: 1,
  },

  helpText: {
    flex: 1,
    fontFamily: Fonts.body,
    fontSize: 13,
    lineHeight: 19,
    color: Colors.slate500,
  },
});
