import { AutocompleteDropdown } from "@/components/shared/autocomplete";
import Loader from "@/components/shared/loader";
import Tag from "@/components/shared/tag";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { PlusCircle } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Controller, useFormContext } from "react-hook-form";
import { AutocompleteDropdownItem } from "../autocomplete/types";
import { ITag, ITagOptionalId } from "@/interfaces/tags.types";
import { getRandomReadableColors } from "@/utils/helpers";
import { useToast } from "@/hooks/useToast";
import { useTagsStore } from "@/hooks/db/useTagsStore";

type LinkFormProps<T> = {
  color: string;
  fetchLinkData?: (url: string) => void;
  loading: boolean;
  onTagRemove?: (item: T) => void;
  selectedTags: T[];
  setSelectedTags: (items: T[]) => void;
  disabledField?: { [key: string]: boolean };
};
const LinkForm = ({
  color,
  fetchLinkData,
  loading,
  onTagRemove,
  selectedTags,
  setSelectedTags,
  disabledField,
}: LinkFormProps<ITagOptionalId>) => {
  const { getTags } = useTagsStore();
  const { showErrorMessage } = useToast();
  const [tags, setTags] = useState<ITag[]>([]);
  const { control } = useFormContext();
  const memoStyle = useMemo(() => {
    return { color: color };
  }, [color]);
  const fetchTags = async () => {
    try {
      const tags = await getTags();
      setTags(tags);
    } catch (error) {
      showErrorMessage({ message: "Oops", description: "Unable to get Tags." });
    }
  };
  useEffect(() => {
    fetchTags();
  }, []);
  const addTagToSelection = (item: AutocompleteDropdownItem | null) => {
    if (!item) return;
    const tag = tags.find((i) => i.id == Number.parseInt(item.id));
    tag && setSelectedTags([tag, ...selectedTags]);
  };
  const filteredTags = useMemo(() => {
    const selectedTagsIds = new Set(selectedTags.map((i) => i.id));
    const filterList: AutocompleteDropdownItem[] = [];
    tags.forEach((i) => {
      !selectedTagsIds.has(i.id) &&
        filterList.push({ id: i.id.toString(), title: i.name });
    });
    return filterList;
  }, [selectedTags, tags]);

  const addNewTag = (text: string) => {
    setSelectedTags([
      { color: getRandomReadableColors(), name: text },
      ...selectedTags,
    ]);
  };
  const removeTag = (index: number) => {
    const temp = [...selectedTags];
    const removed = temp.splice(index, 1);
    onTagRemove?.(removed[0]);
    setSelectedTags(temp);
  };
  return (
    <ScrollView>
      <View className="text-3xl rounded-md p-1 mt-4 mb-1.5 flex flex-col gap-2">
        <Controller
          name="url"
          control={control}
          render={({ field, fieldState }) => {
            return field.disabled || disabledField?.[field.name] ? (
              <ThemedView className="px-4 py-2 gap-2 rounded">
                <ScrollView horizontal>
                  <ThemedText className="" numberOfLines={1}>
                    {field.value}
                  </ThemedText>
                </ScrollView>
              </ThemedView>
            ) : (
              <>
                <ThemedView className="flex flex-row items-center justify-center px-4 gap-2 rounded">
                  <TextInput
                    style={memoStyle}
                    className="flex-1 h-12"
                    placeholder="URL"
                    onChangeText={(e) => fetchLinkData?.(e.trim())}
                    placeholderTextColor={color}
                    value={field.value}
                  />
                  {loading && <Loader color={color} />}
                </ThemedView>
                {fieldState.error && (
                  <Text className="text-red-500 text-sm">
                    {fieldState.error.message}
                  </Text>
                )}
              </>
            );
          }}
        />
        <Controller
          name="title"
          control={control}
          render={({ field, fieldState }) => (
            <>
              <ThemedView className="flex flex-row items-center justify-center px-4 gap-2 rounded">
                <TextInput
                  style={memoStyle}
                  className="flex-1 h-12"
                  placeholder="Title"
                  onChangeText={(e) => field.onChange({ target: { value: e } })}
                  placeholderTextColor={color}
                  multiline={false}
                  value={field.value}
                  editable={!field.disabled || !disabledField?.[field.name]}
                />
              </ThemedView>
              {fieldState.error && (
                <Text className="text-red-500 text-sm">
                  {fieldState.error.message}
                </Text>
              )}
            </>
          )}
        />
        <Controller
          name="desc"
          control={control}
          render={({ field, fieldState }) => (
            <>
              <ThemedView className="h-24 px-4 gap-2 rounded">
                <TextInput
                  style={memoStyle}
                  placeholder="Description"
                  onChangeText={(e) => field.onChange({ target: { value: e } })}
                  placeholderTextColor={color}
                  multiline
                  value={field.value}
                  editable={!field.disabled || !disabledField?.[field.name]}
                />
              </ThemedView>
              {fieldState.error && (
                <Text className="text-red-500 text-sm">
                  {fieldState.error.message}
                </Text>
              )}
            </>
          )}
        />
        <AutocompleteDropdown
          clearOnFocus={true}
          closeOnBlur={true}
          closeOnSubmit={false}
          value={null}
          showValueAfterSelect={false}
          onSelectItem={addTagToSelection}
          editable={!disabledField?.["tags"]}
          textInputProps={{
            placeholder: "Select tags",
          }}
          emptyResultCompWithAction={(e, handler) =>
            e.trim() ? (
              <TouchableOpacity
                onPress={() => {
                  handler();
                  addNewTag(e.trim());
                }}
              >
                <ThemedView className="p-2 flex flex-row flex-wrap">
                  <View className="flex flex-row items-center gap-2">
                    <PlusCircle color={color} size={16} />
                    <ThemedText>Create Tag - </ThemedText>
                  </View>
                  <ThemedText className="font-semibold">{e.trim()}</ThemedText>
                </ThemedView>
              </TouchableOpacity>
            ) : (
              <View className="p-2 flex flex-row flex-wrap">
                <ThemedText>No content</ThemedText>
              </View>
            )
          }
          dataSet={filteredTags}
        />
      </View>
      <View className="flex flex-row gap-2 flex-wrap mt-3 overflow-scroll mb-14">
        {selectedTags.map((i, idx) => (
          <Tag
            color={i.color}
            key={idx}
            name={i.name}
            onClear={() => removeTag(idx)}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default LinkForm;
