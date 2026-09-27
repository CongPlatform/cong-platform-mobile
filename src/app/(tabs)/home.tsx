import { StyleSheet, Text, View } from "react-native";

// =========================================================
// COMPONENTE
// =========================================================

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Início</Text>
      <Text style={styles.description}>
        O início da CONG será implementado em breve.
      </Text>
    </View>
  );
}

// =========================================================
// ESTILOS
// =========================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
  },

  description: {
    marginTop: 8,
    fontSize: 16,
    textAlign: "center",
  },
});