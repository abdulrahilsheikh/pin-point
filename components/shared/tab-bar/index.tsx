import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useColorScheme } from "@/hooks/useColorScheme";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { House } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, View, Text } from "react-native";

const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginInline: "auto",
        position: "absolute",
        bottom: 10,
        left: 0,
        right: 0,
      }}
    >
      <BlurView
        tint="dark"
        intensity={100}
        style={{
          flexDirection: "row",
          backgroundColor: "#212528",
          borderRadius: 50,
          justifyContent: "center",
          alignItems: "center",
          marginInline: "auto",
          overflow: "hidden",
          gap: 2,
          padding: 6,
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={{ selected: isFocused }}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{
                alignItems: "center",
                backgroundColor: isFocused ? "#fdffff" : "transparent",
                padding: 10,
                display: "flex",
                justifyContent: "center",
                borderRadius: 20,
              }}
            >
              {options.tabBarIcon?.({
                focused: isFocused,
                color: isFocused ? "#673ab7" : "#fdffff",
                size: 20,
              })}
            </TouchableOpacity>
          );
        })}
      </BlurView>
    </View>
  );
};

export default TabBar;
