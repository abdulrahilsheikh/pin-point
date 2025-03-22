import { View, Text, SafeAreaView, FlatList, TextInput } from "react-native";
import React, { Fragment } from "react";
import { BlurView } from "expo-blur";

import { StyleSheet, Image, Platform } from "react-native";

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { HelloWave } from "@/components/HelloWave";
import { SearchBar } from "react-native-screens";

const DATA = Array.from({ length: 10 }, (_, idx) => {
  return {
    id: `id-${idx}`,
    title: `Url ${idx + 1}`,
    imageUrl: "https://images.unsplash.com/photo-1741850826368-12d515927617",
  };
});

type ItemProps = { title: string; src: string };
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: "#fffcf2",
    padding: 8,
    marginVertical: 6,
    marginHorizontal: 12,
    borderRadius: 10,
  },
  subContainer: {
    fontSize: 32,
    borderRadius: 4,
    padding: 4,
    marginTop: 4,
    marginBottom: 6,
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
});

const Item = ({ title, src }: ItemProps) => (
  <View style={styles.item}>
    <Image source={{ uri: src }} style={{ height: 300, borderRadius: 2 }} />
    <View style={styles.subContainer}>
      <Text style={{ fontSize: 24 }}>{title}</Text>
      <Text style={{ fontSize: 16 }}>{title}</Text>
      <View className="flex flex-row gap-2 flex-wrap">
        {"*"
          .repeat(Math.ceil(6 * Math.random()))
          .split("")
          .map((i) => (
            <View className="px-3 pt-1.5 pb-1 rounded-full bg-blue-500/20">
              <Text className=" text-blue-500">
                {"A".repeat(Math.ceil(10 * Math.random()))}
              </Text>
            </View>
          ))}
      </View>
    </View>
  </View>
);
const index = () => {
  return (
    <Fragment>
      <View className="h-10">
        <TextInput
          placeholder="Type something..."
          onChangeText={(e) => console.log(e)}
          value={"inputText"}
        />
      </View>
      <FlatList
        data={DATA}
        renderItem={({ item }) => (
          <Item title={item.title} src={item.imageUrl} />
        )}
        keyExtractor={(item) => item.id}
      />
    </Fragment>
  );
};

export default index;
