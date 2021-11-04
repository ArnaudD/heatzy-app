import React from "react";
import { Text, TextInput, View } from "react-native";
import { tailwind } from "../lib/tailwind";

export default function TextField({ label, ...props }) {
  return (
    <View style={tailwind("w-full my-2")}>
      <Text style={tailwind("w-full mb-2 text-medium-brown font-bold")}>{label}</Text>
      <TextInput
        {...props}
        style={tailwind("bg-white py-2 px-4 text-base text-dark-brown rounded-md elevation-1")}
      />
    </View>
  );
}
