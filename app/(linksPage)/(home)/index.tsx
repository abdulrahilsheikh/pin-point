import React, { Fragment, useCallback, useEffect, useState } from "react";
import {
  FlatList,
  ListRenderItemInfo,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { LinkCard } from "@/components/shared/link-card";
import { ThemedView } from "@/components/ThemedView";
import { useLoadingContext } from "@/context/loading-context";
import { useSubscriberContext } from "@/context/subscriber-context";
import { useTabBarContext } from "@/context/tab-bar-context";
import { useLinksStore } from "@/hooks/db/useLinksStore";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useToast } from "@/hooks/useToast";
import { ILInkWithTags } from "@/interfaces/links.types";
import { useRouter } from "expo-router";
import { Filter, Link, Search, X } from "lucide-react-native";
import { ThemedText } from "@/components/ThemedText";


const index = () => {
  const { addListener, removeListener } = useSubscriberContext();

  const theme = useThemeColor({}, 'text')

  const router = useRouter();
  const [items, setItems] = useState<ILInkWithTags[]>([]);
  const { getLinks, toggleIsLinkFavorite } = useLinksStore();
  const { toggleHeaderShown } = useTabBarContext();
  const { showLoader, hideLoader } = useLoadingContext();
  const { showErrorMessage } = useToast();
  const fetchLinks = useCallback(async () => {
    showLoader();
    try {
      const data = await getLinks();
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
  useEffect(() => {
    fetchLinks();
    addListener("GET_LINKS", fetchLinks);
    return () => {
      removeListener("GET_LINKS", fetchLinks);
    };
  }, []);
  const viewLinkDetails = useCallback((linkId: number) => {
    toggleHeaderShown();
    router.push(`/(linksPage)/(home)/(stack)/view-link?linkId=${linkId}`);
  }, []);
  const addToFavorite = async (linkId: number) => {
    showLoader();
    try {
      const link = items.find((i) => i.id === linkId);
      if (link) {
        const updatedItem = await toggleIsLinkFavorite(
          linkId,
          link.favorite === 0 ? 1 : 0
        );

        if (!updatedItem) return;
        const newList = items.map((i) =>
          i.id === linkId ? { ...i, favorite: updatedItem.favorite } : i
        );

        setItems(newList);
      }
    } catch (error) {
      console.error(error);
    } finally {
      hideLoader();
    }
  };
  const ListRenderItem = useCallback(
    ({ item }: ListRenderItemInfo<ILInkWithTags>) => (
      <LinkCard
        onItemClick={viewLinkDetails}
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
        onFavoriteClick={addToFavorite}
        onRedirectClick={(link) => {
          console.log(link);
        }}
      />
    ),
    [viewLinkDetails, addToFavorite]
  );

  return (
    <Fragment>
      <View className="flex items-center flex-row justify-center gap-2 pb-2 shadow-md z-10">
        <ThemedView className="flex flex-row items-center justify-center px-4 gap-2 rounded-full w-[70%]">
          <Search color={theme} size={18} />
          <TextInput
            style={{ color: theme }}
            className="flex-1 h-12"
            placeholder="Search urls..."
            onChangeText={(e) => console.log(e)}
            placeholderTextColor={theme}
            clearButtonMode="always"
            editable
          />
          <TouchableOpacity>
            <X color={theme} size={18} />
          </TouchableOpacity>
        </ThemedView>
        <TouchableOpacity>
          <ThemedView className="p-3 rounded-full">
            <Filter color={theme} size={18} />
          </ThemedView>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            showLoader();
            toggleHeaderShown();
            router.push("/(linksPage)/(home)/(stack)/add-new-link");
          }}
        >
          <ThemedView className="p-3 rounded-full">
            <Link color={theme} size={18} />
          </ThemedView>
        </TouchableOpacity>
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
    </Fragment>
  );
};

export default index;
