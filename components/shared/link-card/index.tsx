import React from "react";
import { TouchableOpacity, View } from "react-native";
import Tag from "@/components/shared/tag";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Image } from "expo-image";
import { Clipboard, Heart, SquareArrowOutUpRight } from "lucide-react-native";
import { ITag } from "@/interfaces/tags.types";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export type LinkCardProps = {
  title: string;
  link: string;
  src: string;
  description: string;
  onItemClick: (linkId: number) => void;
  tags: ITag[];
  linkId: number;
  onClipboardClick: (url: string) => void;
  onFavoriteClick: (id: number) => void;
  onRedirectClick: (url: string) => void;
  favorite: boolean;
};
export const LinkCard = ({
  link,
  title,
  src,
  description,
  onItemClick,
  tags,
  linkId,
  favorite,
  onClipboardClick,
  onFavoriteClick,
  onRedirectClick,
}: LinkCardProps) => {
  const theme = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  return (
    <View
      style={{ backgroundColor: theme }}
      className="p-2 my-1.5 mx-1.5 rounded-lg"
    >
      <View className="relative">
        <TouchableOpacity onPress={() => onItemClick(linkId)}>
          <Image
            placeholder={{ blurhash }}
            source={{ uri: src }}
            style={{ height: 200, borderRadius: 4 }}
          />
        </TouchableOpacity>
      </View>
      <View className="flex flex-row mt-4 gap-3 px-2">
        <TouchableOpacity onPress={() => onClipboardClick(link)}>
          <Clipboard color={textColor} size={22} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onRedirectClick(link)}>
          <SquareArrowOutUpRight color={textColor} size={22} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onFavoriteClick(linkId)}>
          <Heart
            color={favorite ? "red" : textColor}
            size={22}
            fill={favorite ? "red" : "transparent"}
          />
        </TouchableOpacity>
      </View>
      <View className="p-2 mt-2 mb-0 flex flex-col gap-1">
        <ThemedText
          style={{ fontSize: 24 }}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {title}
        </ThemedText>
        <ThemedText style={{ fontSize: 14, opacity: 0.25 }} numberOfLines={1}>
          {link}
        </ThemedText>
        <ThemedText style={{ fontSize: 16 }} numberOfLines={3}>
          {description}
        </ThemedText>
        <View className="flex flex-row gap-2 flex-wrap mt-3">
          {tags?.map((tag) => (
            <Tag
              key={`${linkId}-${tag.id}`}
              color={tag.color}
              name={tag.name}
            />
          ))}
        </View>
      </View>
    </View>
  );
};
