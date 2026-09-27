import { useEffect, useState } from "react";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";

import { Colors } from "@/constants/Colors";
import {
  SessionProvider,
  useSession,
} from "@/contexts/SessionContext";

// Mantém a splash nativa até concluir a inicialização.
if (Platform.OS !== "web") {
  void SplashScreen.preventAutoHideAsync().catch(() => {
    // As telas de carregamento continuam disponíveis se a splash falhar.
  });
}

async function hideSplashScreen(): Promise<void> {
  if (Platform.OS === "web") return;

  try {
    await SplashScreen.hideAsync();
  } catch {
    // Não interrompe o aplicativo se a splash já estiver fechada.
  }
}

const APP_FONTS: Record<string, number> = {
  Inter: require("../../assets/fonts/Inter-Regular.ttf"),

  // Temporário: o arquivo Inter-Medium original está inválido.
  InterMedium: require("../../assets/fonts/Inter-Regular.ttf"),

  InterSemiBold: require("../../assets/fonts/Inter-SemiBold.ttf"),
  InterBold: require("../../assets/fonts/Inter-Bold.ttf"),
  InterExtraBold: require("../../assets/fonts/Inter-ExtraBold.ttf"),
  InterBlack: require("../../assets/fonts/Inter-Black.ttf"),
  ShortStack: require("../../assets/fonts/ShortStack-Regular.ttf"),

  "MaterialIcons-Regular": require(
    "../../node_modules/@react-native-vector-icons/material-icons/fonts/MaterialIcons.ttf"
  ),

  FontAwesome: require(
    "../../node_modules/@react-native-vector-icons/fontawesome/fonts/FontAwesome.ttf"
  ),
};

async function loadAppFont(
  name: string,
  source: number,
  signal: AbortSignal
): Promise<void> {
  if (signal.aborted || Font.isLoaded(name)) return;

  if (Platform.OS === "web") {
    await Font.loadAsync(name, source);
    return;
  }

  const asset = Asset.fromModule(source);

  const localUri =
    asset.localUri ??
    (asset.uri.startsWith("file://") ? asset.uri : null);

  if (localUri) {
    await Font.loadAsync(name, { uri: localUri });
    return;
  }

  const response = await fetch(asset.uri, { signal });

  if (!response.ok) {
    throw new Error(
      "Não foi possível baixar os recursos do aplicativo."
    );
  }

  const bytes = new Uint8Array(await response.arrayBuffer());

  const isTrueType =
    bytes[0] === 0x00 &&
    bytes[1] === 0x01 &&
    bytes[2] === 0x00 &&
    bytes[3] === 0x00;

  const isOpenType =
    bytes[0] === 0x4f &&
    bytes[1] === 0x54 &&
    bytes[2] === 0x54 &&
    bytes[3] === 0x4f;

  if (!isTrueType && !isOpenType) {
    throw new Error(
      "Um dos recursos recebidos está em formato inválido."
    );
  }

  if (signal.aborted) return;

  const { File, Paths } = await import("expo-file-system");

  if (signal.aborted) return;

  const file = new File(
    Paths.cache,
    `cong-${name}-${asset.hash ?? "local"}.ttf`
  );

  file.create({ overwrite: true });
  await file.write(bytes);

  if (signal.aborted) return;

  await Font.loadAsync(name, { uri: file.uri });
}

function LoadingScreen({ message }: { message: string }) {
  return (
    <SafeAreaView style={styles.center}>
      <ActivityIndicator
        size="large"
        color={Colors.primary}
      />

      <Text style={styles.loadingTitle}>
        Carregando CONG...
      </Text>

      <Text style={styles.loadingText}>
        {message}
      </Text>
    </SafeAreaView>
  );
}

function ErrorScreen({
  title,
  message,
  onRetry,
}: {
  title: string;
  message: string;
  onRetry: () => void;
}) {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.errorContainer}>
        <Text style={styles.errorTitle}>
          {title}
        </Text>

        <Text style={styles.errorText}>
          {message}
        </Text>

        <Pressable
          accessibilityRole="button"
          onPress={onRetry}
          style={styles.retryButton}
        >
          <Text style={styles.retryText}>
            Tentar novamente
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function AppNavigator() {
  const { user, loading, error, restore } = useSession();

  useEffect(() => {
    // As fontes já estão prontas quando este componente é montado.
    if (!loading || error) {
      void hideSplashScreen();
    }
  }, [loading, error]);

  if (loading) {
    return (
      <LoadingScreen message="Preparando sua conta..." />
    );
  }

  if (error) {
    return (
      <ErrorScreen
        title="Não foi possível carregar sua conta"
        message={error}
        onRetry={() => void restore(true)}
      />
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        title: "CONG",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="login/Login" />
      <Stack.Screen name="register/Register" />
      <Stack.Screen name="emailverification/EmailVerification" />

      <Stack.Protected guard={!!user}>
        <Stack.Screen name="firstaccess/FirstAccess" />
        <Stack.Screen name="roleselection/RoleSelection" />
        <Stack.Screen name="completeprofiles/CompleteProfiles" />
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
    </Stack>
  );
}

function FontLoader({ onRetry }: { onRetry: () => void }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [fontError, setFontError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    async function loadFonts() {
      try {
        for (const [name, source] of Object.entries(APP_FONTS)) {
          if (!active) return;

          const timeout = setTimeout(
            () => controller.abort(),
            30000
          );

          try {
            await loadAppFont(
              name,
              source,
              controller.signal
            );
          } finally {
            clearTimeout(timeout);
          }

          if (controller.signal.aborted) {
            throw new Error("Tempo de carregamento excedido.");
          }
        }

        if (active) {
          setFontsLoaded(true);
        }
      } catch {
        if (!active) return;

        setFontError(
          controller.signal.aborted
            ? "O carregamento demorou mais que o esperado. Verifique sua conexão e tente novamente."
            : "Não foi possível preparar os recursos do aplicativo. Verifique sua conexão e tente novamente."
        );
      }
    }

    void loadFonts();

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (fontError) {
      void hideSplashScreen();
    }
  }, [fontError]);

  if (fontError) {
    return (
      <ErrorScreen
        title="Não foi possível iniciar a CONG"
        message={fontError}
        onRetry={onRetry}
      />
    );
  }

  if (!fontsLoaded) {
    return (
      <LoadingScreen message="Preparando o aplicativo..." />
    );
  }

  return <AppNavigator />;
}

export default function RootLayout() {
  const [attempt, setAttempt] = useState(0);

  return (
    <SafeAreaProvider>
      <View style={styles.screen}>
        <StatusBar style="dark" />

        <SessionProvider>
          <FontLoader
            key={attempt}
            onRetry={() => {
              setAttempt((current) => current + 1);
            }}
          />
        </SessionProvider>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.paper,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: Colors.paper,
  },

  errorContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },

  // Fontes do sistema: disponíveis antes das fontes personalizadas.
  loadingTitle: {
    marginTop: 16,
    color: Colors.primary,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },

  loadingText: {
    marginTop: 12,
    color: Colors.muted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },

  retryButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.primary,
  },

  retryText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },

  errorTitle: {
    color: Colors.error,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },

  errorText: {
    marginTop: 12,
    color: Colors.muted,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },
});