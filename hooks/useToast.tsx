import { CheckCircle, CircleCheck, CircleX } from "lucide-react-native";
import { showMessage } from "react-native-flash-message";
import { useThemeColor } from "./useThemeColor";

type MessageProp = {
  message: string;
  description: string;
};
export const useToast = () => {
  const showSuccessMessage = (prop: MessageProp) => {
    showMessage({
      ...prop,
      type: "success",
      icon: ({ ...props }) => <CircleCheck color={"white"} {...props} />,
    });
  };
  const showErrorMessage = (prop: MessageProp) => {
    showMessage({
      ...prop,
      type: "danger",
      icon: ({ ...props }) => <CircleX color={"white"} {...props} />,
    });
  };
  return {
    showSuccessMessage,
    showErrorMessage,
  };
};
