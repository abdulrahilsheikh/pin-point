import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";
import {
  Modal,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
 View,
  ViewStyle,
} from "react-native"; 
 
type ILoadingContext = {
  loading: boolean;
  showLoader: () => void;
  hideLoader: () => void;
};
export const LoadingContext = createContext({} as ILoadingContext);
export const useLoadingContext = () => useContext(LoadingContext);
export const LoadingContextProvider = ({ children }: PropsWithChildren) => {
  const [loading, setLoading] = useState(false);

  const showLoader = useCallback(() => {
    setLoading(true);
  }, []);
  const hideLoader = useCallback(() => {
    setLoading(false);
  }, []);
  return (
    <LoadingContext.Provider
      value={{
        loading,
        showLoader,
        hideLoader,
      }}
    >
      {/* {loading&&<View style={modalStyle}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
          }}
        >
           
        </View>
      </View>} */}
      {children}
    </LoadingContext.Provider> 
  );
};

const modalStyle: StyleProp<ViewStyle> = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0,0,0,0.5)",
  position: "absolute",
  zIndex: 100,
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
};
