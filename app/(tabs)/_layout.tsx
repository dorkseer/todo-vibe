import { Tabs } from "expo-router";
import { useWindowDimensions } from "react-native";

export default function TabLayout() {
  const { width } = useWindowDimensions();
  const isWide = width >= 1024;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#18181b",
        tabBarInactiveTintColor: "#a1a1aa",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopColor: "#e4e4e7",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Todos",
          tabBarIcon: ({ color, size }) => null,
        }}
      />
      <Tabs.Screen
        name="weather"
        options={{
          title: "Weather",
          // Hide weather tab on wide screens (shown as sidebar instead)
          href: isWide ? null : "/weather",
          tabBarIcon: ({ color, size }) => null,
        }}
      />
    </Tabs>
  );
}
