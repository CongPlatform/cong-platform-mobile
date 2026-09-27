import { StyleSheet, Text, View } from "react-native";

// =========================================================
// COMPONENTE
// =========================================================

export default function Community() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comunidade</Text>
      <Text style={styles.description}>
        A comunidade da CONG será implementada em breve.
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