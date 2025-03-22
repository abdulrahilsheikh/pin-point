import { HapticTab } from "@/components/HapticTab";
import TabBar from "@/components/shared/tab-bar";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Tabs } from "expo-router";
import { House, SwatchBook, Link, Cog } from "lucide-react-native";
import React from "react";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarButton: HapticTab,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "transparent",
          position: "absolute",
          elevation: 0, // Remove shadow (Android)
          borderTopWidth: 0, // Remove top border
        },
        animation: "shift",
      }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <House color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="favourites/index"
        options={{
          title: "Favourite",
          tabBarIcon: ({ color, size }) => <House color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="tags/index"
        options={{
          title: "Tags",
          tabBarIcon: ({ color, size }) => (
            <SwatchBook color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="addNewLink/index"
        options={{
          title: "Add New Link",
          tabBarIcon: ({ color, size }) => <Link color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => <Cog color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
