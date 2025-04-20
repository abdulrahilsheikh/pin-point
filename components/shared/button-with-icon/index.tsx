import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ReactNode, useEffect } from "react";
import { TouchableOpacity, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

export const ButtonWithIcon = ({
  onClick,
  icon = null,
  label,
}: {
  onClick: () => void;
  icon: ReactNode;
  label: string;
}) => {
  const translateY = useSharedValue<number>(120);
  useEffect(() => {
    translateY.value = 0;
    return () => {
      translateY.value = 120;
    };
  }, []);
  const animatedStyles = useAnimatedStyle(
    () => ({
      transform: [{ translateY: withSpring(translateY.value) }],
    }),
    [translateY]
  );

  return (
    <View className="pb-4">
      <Animated.View
        style={[animatedStyles]}
        className="flex flex-row items-center justify-center p-0"
      >
        <TouchableOpacity onPress={onClick}>
          <ThemedView className="shadow-md flex flex-row gap-2 p-4 py-2 rounded-md items-center">
            {icon}
            <ThemedText>{label}</ThemedText>
          </ThemedView>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};
