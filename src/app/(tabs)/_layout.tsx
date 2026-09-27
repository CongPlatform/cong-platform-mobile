import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { Tabs } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";


export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: Colors.white }}>
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,

        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.muted,

        tabBarStyle: {
          backgroundColor: Colors.white,
          paddingBottom: insets.bottom || 16,
          height: 60 + (insets.bottom || 0),
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          paddingTop: 10,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons
              name="home"
              size={Fonts["2xl"]}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="activities"
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons
              name="assignment"
              size={Fonts["2xl"]}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="community"
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons
              name="groups"
              size={Fonts["2xl"]}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons
              name="person"
              size={Fonts["2xl"]}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="about"
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons
              name="info"
              size={Fonts["2xl"]}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
    </SafeAreaView>
  );
}