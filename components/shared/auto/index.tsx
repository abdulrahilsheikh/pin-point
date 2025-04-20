import { ThemedView } from "@/components/ThemedView";
import { Loader } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import { StyleProp, TextInput, TextStyle } from "react-native";

type Props<T> = {
  inputStyle?: StyleProp<TextStyle>;
  getLabel: (item: T) => string;
  getValue: (item: T) => string;
  placeholderTextColor?: string;
  loaderColor?: string;
  placeholder: string;
  value: T | null;
  loading?: boolean;
  options: T[];
};

const LocalAutocomplete = <T,>(props: Props<T>) => {
  const {
    inputStyle = {},
    placeholderTextColor,
    loaderColor,
    getLabel,
    getValue,
    value,
    placeholder,
    loading,
  } = props;
  const [open, setOpen] = useState(false);
  const openOnFocus = useCallback(() => {
    setOpen(true);
  }, []);

  return (
    <ThemedView className="flex flex-row items-center justify-center px-4 gap-2 rounded">
      <TextInput
        onFocus={openOnFocus}
        style={inputStyle}
        className="flex-1 h-10"
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        value={value == null ? "" : getValue(value)}
      />
      {loading && <Loader color={loaderColor} />}
    </ThemedView>
  );
};

export default LocalAutocomplete;
