import { Loader2 } from "lucide-react-native";
import React from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

type Props = { color: string };

const Loader = ({ color }: Props) => {
  const rotation = useSharedValue(360);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotateZ: `${rotation.value}deg`,
      },
    ],
  }));
  React.useEffect(() => {
    rotation.value = withRepeat(
      withTiming(-rotation.value, { duration: 1500, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  return (
    <Animated.View style={[animatedStyle]}>
      <Loader2 color={color} />
    </Animated.View>
  );
};

export default Loader;
