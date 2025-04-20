import { ButtonWithIcon } from "@/components/shared/button-with-icon";
import Tag from "@/components/shared/tag";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useLoadingContext } from "@/context/loading-context";
import { useLinksStore } from "@/hooks/db/useLinksStore";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useToast } from "@/hooks/useToast";
import { ITag } from "@/interfaces/tags.types";
import { Image } from "expo-image";
import {
  useFocusEffect,
  useLocalSearchParams,
  usePathname,
  useRouter,
} from "expo-router";
import { FilePenLine } from "lucide-react-native";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const ViewLink = () => {
  const { linkId } = useLocalSearchParams<{
    linkId: string;
  }>();
  const _linkId = Math.abs(Number.parseInt(linkId));
  const path = usePathname();
  const [formValue, setFormValue] = useState({
    desc: "",
    image: "",
    title: "",
    url: "",
  });

  const { showLoader, hideLoader } = useLoadingContext();
  const router = useRouter();
  const { getLinkById } = useLinksStore();

  const textTheme = useThemeColor({}, "text");
  const { showErrorMessage } = useToast();
  const [selectedTags, setSelectedTags] = useState<
    (Omit<ITag, "id"> & { id?: number })[]
  >([]);
  const goToEditPage = () => {
    router.navigate(`/edit-link?linkId=${_linkId}`);
  };
  const setFormData = useCallback(async () => {
    showLoader();
    try {
      const link = await getLinkById(_linkId);
      if (link) {
        setFormValue({
          desc: link.description,
          image: link.preview_image_url,
          title: link.title,
          url: link.url,
        });
        setSelectedTags(link.tags);
      }
    } catch (error) {
      showErrorMessage({
        message: "Oops",
        description: "Something went wrong.",
      });
    } finally {
      hideLoader();
    }
  }, []);
  const getData = useCallback(() => {
    setFormData();
  }, []);
  useFocusEffect(getData);
  return (
    <Fragment>
      <View className="flex-1">
        <View className="p-2 pb-0 my-2 mx-2 rounded-md flex-1 h-full overflow-hidden flex flex-col">
          <Image
            placeholder={{ blurhash }}
            source={{ uri: formValue.image }}
            transition={2000}
            style={{ height: 200, borderRadius: 4 }}
          />
          <ScrollView>
            <View className="text-3xl rounded-md p-1 mt-4 mb-1.5 flex flex-col gap-2">
              <ThemedView className="px-4 py-2 gap-2 rounded">
                <ScrollView horizontal>
                  <ThemedText className="" numberOfLines={1}>
                    {formValue.url}
                  </ThemedText>
                </ScrollView>
              </ThemedView>
              <ThemedView className="px-4 py-2 gap-2 rounded">
                <ScrollView horizontal>
                  <ThemedText className="" numberOfLines={1}>
                    {formValue.title}
                  </ThemedText>
                </ScrollView>
              </ThemedView>
              <ThemedView className="px-4 py-2 gap-2 rounded">
                <ScrollView className="max-h-40">
                  <ThemedText>{formValue.desc}</ThemedText>
                </ScrollView>
              </ThemedView>
            </View>
            <View className="flex flex-row gap-2 flex-wrap mt-3 overflow-scroll mb-14">
              {selectedTags.map((i, idx) => (
                <Tag color={i.color} key={idx} name={i.name} />
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
      <ButtonWithIcon
        icon={<FilePenLine size={20} color={textTheme} />}
        onClick={goToEditPage}
        label="Edit Link"
      />
    </Fragment>
  );
};

export default ViewLink;
