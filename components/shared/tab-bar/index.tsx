import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import React, { useEffect } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginInline: "auto",
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 0,
    bottom: 10,
  },
  blurView: {
    flexDirection: "row",
    backgroundColor: "#212528",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginInline: "auto",
    overflow: "hidden",
    gap: 2,
    padding: 6,
  },
  btnContainer: {
    alignItems: "center",
    padding: 10,
    display: "flex",
    justifyContent: "center",
    borderRadius: 20,
  },
});

const TabBar = ({
  state,
  descriptors,
  navigation,
  showHeader,
}: BottomTabBarProps & { showHeader: boolean }) => {
  const translateY = useSharedValue<number>(0);
  useEffect(() => {
    translateY.value = showHeader ? 0 : 120;
  }, [showHeader]);
  const animatedStyles = useAnimatedStyle(
    () => ({
      transform: [{ translateY: withSpring(translateY.value) }],
    }),
    [translateY]
  );

  return (
    <Animated.View style={[styles.toolbar, animatedStyles]}>
      <BlurView tint="dark" intensity={100} style={styles.blurView}>
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
              style={[
                styles.btnContainer,
                { backgroundColor: isFocused ? "#fdffff" : "transparent" },
              ]}
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
    </Animated.View>
  );
};

export default TabBar;
