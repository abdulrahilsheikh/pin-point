
import { LoadingContextProvider } from "@/context/loading-context";
import { TabBarContextProvider } from "@/context/tab-bar-context";
import { migrateDbIfNeeded } from "@/db/db-setup";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import Constants from "expo-constants";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { Suspense, useEffect, useRef } from "react";
import { ActivityIndicator } from "react-native";
import "react-native-reanimated";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import "../global.css";
import FlashMessage from "react-native-flash-message";
import { AutocompleteDropdownContextProvider } from "@/components/shared/autocomplete/context/dropdown-context";
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

  const theme = colorScheme === "dark" ? DarkTheme : DefaultTheme;

  return (
    <Suspense fallback={<ActivityIndicator size="large" />}>
      <SQLiteProvider
        databaseName={process.env.EXPO_PUBLIC_DB_NAME!}
        onInit={migrateDbIfNeeded}
        useSuspense
        options={{ enableChangeListener: true, useNewConnection: true }}
      >
        <ThemeProvider value={theme}>
          <LoadingContextProvider>
            <TabBarContextProvider>
              <AutocompleteDropdownContextProvider>
                <SafeAreaProvider>
                  <SafeAreaView style={{ flex: 1 }}>
                    <StatusBar
                      style={theme.dark ? "light" : "dark"}
                      backgroundColor={theme.colors.background}
                    />
                    <FlashMessage
                      position="top"
                      floating
                      statusBarHeight={Constants.statusBarHeight}
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
              </AutocompleteDropdownContextProvider>
            </TabBarContextProvider>
          </LoadingContextProvider>
        </ThemeProvider>
      </SQLiteProvider>
    </Suspense>
  );
}
