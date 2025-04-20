import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { ITag } from "@/interfaces/tags.types";
import { XCircle } from "lucide-react-native";
type TagType = { onClear?: () => void } & Omit<ITag, "id">;
const Tag = ({ color, name, onClear }: TagType) => {
  return (
    <View
      className="py-1 rounded-full flex flex-row items-center gap-2"
      style={{ backgroundColor: `${color}30`, paddingInline: 10 }}
    >
      <Text style={{ color, fontSize: 16, textTransform: "capitalize" }}>
        {name}
      </Text>
      {onClear && (
        <TouchableOpacity onPress={onClear}>
          <XCircle color={color} size={18} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Tag;
