import { ButtonWithIcon } from "@/components/shared/button-with-icon";
import LinkForm from "@/components/shared/link-form";
import { LinkFormSchema } from "@/components/shared/link-form/schema";
import { useLoadingContext } from "@/context/loading-context";
import { useSubscriberContext } from "@/context/subscriber-context";
import { useLinksStore } from "@/hooks/db/useLinksStore";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useToast } from "@/hooks/useToast";
import { ITag, ITagOptionalId } from "@/interfaces/tags.types";
import { yupResolver } from "@hookform/resolvers/yup";
import { Image } from "expo-image";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Save } from "lucide-react-native";
import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { View } from "react-native";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const index = () => {
  const { linkId } = useLocalSearchParams<{
    linkId: string;
  }>();
  const _linkId = Math.abs(Number.parseInt(linkId));
  const form = useForm({
    defaultValues: { desc: "", image: "", title: "", url: "", tags: [] },
    resolver: yupResolver(LinkFormSchema as any),
  });

  const { handleSubmit, reset, control, formState } = form;
  const { broadcast } = useSubscriberContext();
  const { showLoader, hideLoader, loading } = useLoadingContext();
  const navigate = useNavigation();
  const { updateLink, getLinkById } = useLinksStore();
  const textTheme = useThemeColor({}, "text");
  const { showSuccessMessage, showErrorMessage } = useToast();
  const existingTagsRef = useRef<Set<number>>(new Set());
  const [selectedTags, setSelectedTags] = useState<
    (Omit<ITag, "id"> & { id?: number })[]
  >([]);
  const [removedTags, setRemoveTags] = useState<ITag[]>([]);

  const imageUrl = useWatch({ control, name: "image" });

  const segregateTags = () => {
    const newTags: Omit<ITag, "id">[] = [];
    const existingTags: ITag[] = [];
    selectedTags.forEach((i) => {
      if (i.id != undefined && existingTagsRef.current.has(i.id)) return;
      if (i.id && i.id !== undefined) {
        existingTags.push(i as ITag);
      } else {
        newTags.push(i);
      }
    });
    return {
      newTags,
      existingTags,
    };
  };
  const editLink = async (data: any) => {
    showLoader();
    try {
      const tags = segregateTags();
      await updateLink(
        _linkId,
        {
          description: data.desc,
          title: data.title,
        },
        {
          newTags: tags.newTags,
          addedTags: tags.existingTags,
          removedTags: removedTags,
        }
      );
      hideLoader();
      broadcast("GET_LINKS");
      navigate.goBack();
      showSuccessMessage({
        message: "Yoo",
        description: "Link saved successfully.",
      });
    } catch (error: any) {
      showErrorMessage({ message: "Oops", description: error.message });
      hideLoader();
    }
  };
  const setFormData = useCallback(async () => {
    showLoader();
    try {
      const link = await getLinkById(_linkId);
      if (link) {
        reset({
          desc: link.description,
          image: link.preview_image_url,
          title: link.title,
          url: link.url,
        });
        existingTagsRef.current = new Set(link.tags.map((i) => i.id));
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
  useEffect(() => {
    setFormData();
  }, []);

  const onTagRemove = (item: ITagOptionalId) => {
    if (item.id) {
      setRemoveTags([...removedTags, item as ITag]);
    }
  };
  return (
    <Fragment>
      <View className="flex-1">
        <View className="p-2 pb-0 my-2 mx-2 rounded-md flex-1 h-full overflow-hidden flex flex-col">
          <Image
            placeholder={{ blurhash }}
            source={{ uri: imageUrl }}
            transition={2000}
            style={{ height: 200, borderRadius: 4 }}
          />
          <FormProvider {...form}>
            <LinkForm
              color={textTheme}
              loading={loading}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              disabledField={{ url: true }}
              onTagRemove={onTagRemove}
            />
          </FormProvider>
        </View>
      </View>
      {removedTags.length ||
      selectedTags.length != existingTagsRef.current.size ||
      formState.isDirty ? (
        <ButtonWithIcon
          icon={<Save size={20} color={textTheme} />}
          onClick={handleSubmit(editLink)}
          label="Save Link"
        />
      ) : null}
    </Fragment>
  );
};

export default index;
