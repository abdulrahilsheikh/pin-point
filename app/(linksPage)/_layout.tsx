import { HapticTab } from "@/components/HapticTab";
import TabBar from "@/components/shared/tab-bar";
import { useTabBarContext } from "@/context/tab-bar-context";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { Tabs } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { House, SwatchBook, Link, Cog, Heart } from "lucide-react-native";
import React, { useEffect, useState } from "react";

export default function TabLayout() {
  const db = useSQLiteContext();
  useDrizzleStudio(db);
  const { showHeader } = useTabBarContext();
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
      tabBar={(props) => <TabBar {...props} showHeader={showHeader} />}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <House color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="favourites/index"
        options={{
          title: "Favourite",
          tabBarIcon: ({ color, size }) => <Heart color={color} size={size} />,
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
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => <Cog color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
