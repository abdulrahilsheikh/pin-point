import { View, Text, FlatList, ListRenderItemInfo } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useLinksStore } from "@/hooks/db/useLinksStore";
import { useLoadingContext } from "@/context/loading-context";
import { useToast } from "@/hooks/useToast";
import { ILInkWithTags } from "@/interfaces/links.types";
import { ThemedText } from "@/components/ThemedText";
import { LinkCard } from "@/components/shared/link-card";
import { useFocusEffect } from "expo-router";

const index = () => {
  const [items, setItems] = useState<ILInkWithTags[]>([]);
  const { getFavouriteLinks } = useLinksStore();
  const { showLoader, hideLoader } = useLoadingContext();
  const { showErrorMessage } = useToast();
  const fetchLinks = useCallback(async () => {
    showLoader();
    try {
      const data = await getFavouriteLinks();
      setItems(data);
    } catch (error) {
      showErrorMessage({
        message: "Oops",
        description: "Something went wrong",
      });
    } finally {
      hideLoader;
    }
  }, []);
  const ListRenderItem = useCallback(
    ({ item }: ListRenderItemInfo<ILInkWithTags>) => (
      <LinkCard
        onItemClick={() => { }}
        title={item.title}
        src={item.preview_image_url}
        description={item.description}
        link={item.url}
        tags={item.tags}
        linkId={item.id}
        favorite={!!item.favorite}
        onClipboardClick={(link) => {
          console.log(link);
        }}
        onFavoriteClick={() => { }}
        onRedirectClick={(link) => {
          console.log(link);
        }}
      />
    ),
    []
  );

  const getData = useCallback(() => {
    fetchLinks();
  }, []);
  useFocusEffect(getData);
  return (
    <View>
      <View className="px-4 py-2">
        <ThemedText style={{ fontSize: 24 }}>My Favourites</ThemedText>
      </View>
      <FlatList
        data={items}
        renderItem={ListRenderItem}
        keyExtractor={(item) => `${item.id}`}
        ListEmptyComponent={
          <View className="p-4 rounded">
            <ThemedText>No Links available</ThemedText>
          </View>
        }
        ListFooterComponent={<View className="h-20" />}
      />
    </View>
  );
};

export default index;
