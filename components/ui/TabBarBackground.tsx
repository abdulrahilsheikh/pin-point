// This is a shim for web and Android where the tab bar is generally opaque.
export default undefined;

export function useBottomTabOverflow() {
  return 0;
}

// import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
// import { BlurView } from "expo-blur";
// import { StyleSheet } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// export default function BlurTabBarBackground() {
//   return (
//     <BlurView
//       // System chrome material automatically adapts to the system's theme
//       // and matches the native tab bar appearance on iOS.
//       tint="light"
//       style={{ backgroundColor: "red" }}
//     />
//   );
// }

// export function useBottomTabOverflow() {
//   const tabHeight = useBottomTabBarHeight();
//   const { bottom } = useSafeAreaInsets();
//   return tabHeight - bottom;
// }
