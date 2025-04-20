import { ButtonWithIcon } from "@/components/shared/button-with-icon";
import LinkForm from "@/components/shared/link-form";
import { useLoadingContext } from "@/context/loading-context";
import { useSubscriberContext } from "@/context/subscriber-context";
import { useLinksStore } from "@/hooks/db/useLinksStore";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useToast } from "@/hooks/useToast";
import { ITag } from "@/interfaces/tags.types";
import { getLinkData } from "@/utils/link-utils";
import { Image } from "expo-image";
import { useNavigation } from "expo-router";
import { PlusIcon } from "lucide-react-native";
import React, { Fragment, useRef, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { View } from "react-native";
import { yupResolver } from "@hookform/resolvers/yup";
import { LinkFormSchema } from "@/components/shared/link-form/schema";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const index = () => {
  const form = useForm({
    defaultValues: { desc: "", image: "", title: "", url: "" },
    resolver: yupResolver(LinkFormSchema),
  });

  const { handleSubmit, setValue, reset, getValues, control } = form;
  const { broadcast } = useSubscriberContext();
  const { showLoader, hideLoader } = useLoadingContext();
  const navigate = useNavigation();
  const { addNewLink } = useLinksStore();
  const debounceRef = useRef<any>();
  const abortControllerRef = useRef<AbortController>();
  const textTheme = useThemeColor({}, "text");
  const { showSuccessMessage, showErrorMessage } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState<
    (Omit<ITag, "id"> & { id?: number })[]
  >([]);
  const imageUrl = useWatch({ control, name: "image" });
  const linkData = async (text: string) => {
    try {
      abortControllerRef.current?.abort("Abort the request");
      abortControllerRef.current = new AbortController();
      const temp = await getLinkData(text, abortControllerRef.current.signal);
      reset({ ...temp, url: text });
    } catch (error) {}
  };

  const fetchLinkData = async (text: string) => {
    setValue("url", text);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      await linkData(text);
      setLoading(false);
    }, 250);
  };
  const segregateTags = () => {
    const newTags: Omit<ITag, "id">[] = [];
    const existingTags: ITag[] = [];
    selectedTags.forEach((i) => {
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
  const addLinkToDB = async (data: any) => {
    showLoader();
    try {
      const tags = segregateTags();
      await addNewLink({
        description: data.desc,
        preview_image_url: data.image,
        title: data.title,
        url: data.url,
        tags,
      });
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
              fetchLinkData={fetchLinkData}
              loading={loading}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
            />
          </FormProvider>
        </View>
      </View>
      <ButtonWithIcon
        icon={<PlusIcon size={20} color={textTheme} />}
        onClick={handleSubmit(addLinkToDB)}
        label="Add Link"
      />
    </Fragment>
  );
};

export default index;
