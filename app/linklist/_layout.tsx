import { View, Text, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { getLinkData } from "@/utils/link-utils";

export default function ListLayout() {
  const [state, setState] = useState({ title: "", image: "" });
  const getData = async () => {
    const temp = await getLinkData(
      "https://dev.to/nickkeepkind/game-design-cannibals-whos-eating-aaa-games-and-why-2c0c"
    );
    setState(temp as any);
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <View>
      <Text>_layout</Text>
      <Image src={state.image}></Image>
    </View>
  );
}
