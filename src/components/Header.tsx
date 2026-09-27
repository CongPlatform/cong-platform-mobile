import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import { router } from "expo-router";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  
  function handleLogout() {
    router.replace("/");
  }

  return (
    <View style={styles.container}>
      <Text
        style={
          title === "CONG"
            ? styles.logoText
            : styles.titleText
        }
      >
        {title}
      </Text>

      <Pressable
        style={styles.logout}
        onPress={handleLogout}
        accessibilityRole="button"
        accessibilityLabel="Sair"
      >
        <MaterialIcons
          name="logout"
          size={Fonts.xl}
          color={Colors.white}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  // ==================================================
  // CABEÇALHO
  // ==================================================

  container: {
    height: 55,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    backgroundColor: Colors.primary,
  },

  titleText: {
    width: "90%",

    color: Colors.white,

    fontFamily: Fonts.body,
    fontSize: Fonts.xl,

    textAlign: "center",
  },

  logoText: {
    width: "90%",

    color: Colors.white,

    fontFamily: Fonts.brand,
    fontSize: Fonts["2xl"],

    textAlign: "center",
  },

  logout: {
    width: "10%",

    alignItems: "center",
    justifyContent: "center",
  },
});