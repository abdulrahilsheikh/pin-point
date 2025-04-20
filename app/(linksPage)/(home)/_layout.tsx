import { ThemedText } from "@/components/ThemedText";
import { SubscriberContextProvider } from "@/context/subscriber-context";
import { useTabBarContext } from "@/context/tab-bar-context";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Stack } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";

function Layout() {
  const { toggleHeaderShown } = useTabBarContext();
  const textColor = useThemeColor({}, "text");
  return (
    <SubscriberContextProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(stack)/add-new-link"
          options={{
            header: (props) => (
              <View className="px-4 flex flex-row gap-2 mt-2">
                <TouchableOpacity
                  onPress={() => {
                    toggleHeaderShown();
                    props.navigation.goBack();
                  }}
                >
                  <ArrowLeft color={textColor} />
                </TouchableOpacity>
                <ThemedText style={{ fontSize: 20 }}>Add New Link</ThemedText>
              </View>
            ),
          }}
        />
        <Stack.Screen
          name="(stack)/view-link"
          options={{
            header: (props) => (
              <View className="px-4 flex flex-row gap-2 mt-2">
                <TouchableOpacity
                  onPress={() => {
                    toggleHeaderShown();
                    props.navigation.goBack();
                  }}
                >
                  <ArrowLeft color={textColor} />
                </TouchableOpacity>
                <ThemedText style={{ fontSize: 20 }}>View Link</ThemedText>
              </View>
            ),
          }}
        />
        <Stack.Screen
          name="(stack)/edit-link"
          options={{
            header: (props) => (
              <View className="px-4 flex flex-row gap-2 mt-2">
                <TouchableOpacity
                  onPress={() => {
                    props.navigation.goBack();
                  }}
                >
                  <ArrowLeft color={textColor} />
                </TouchableOpacity>
                <ThemedText style={{ fontSize: 20 }}>Edit Link</ThemedText>
              </View>
            ),
          }}
        />
      </Stack>
    </SubscriberContextProvider>
  );
}

export default Layout;
