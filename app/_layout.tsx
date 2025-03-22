import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import "../global.css";
import { useColorScheme } from "@/hooks/useColorScheme";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  const theme = colorScheme === "dark" ? DarkTheme : DefaultTheme;
  return (
    <ThemeProvider value={theme}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar
            style={theme.dark ? "light" : "dark"}
            backgroundColor={theme.colors.background}
          />
          <Stack>
            <Stack.Screen
              name="(linksPage)"
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen name="+not-found" />
          </Stack>
        </SafeAreaView>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
