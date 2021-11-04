import React from "react";
import { ActivityIndicator, View } from "react-native";
import { tailwind } from "../lib/tailwind";

export default function LoadingScreen() {
  return (
    <View style={[tailwind("absolute w-full h-full flex flex-col justify-center items-center")]}>
      <ActivityIndicator color="black" />
    </View>
  );
}
