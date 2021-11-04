import React from "react";
import { Text, View } from "react-native";
import { tailwind } from "../lib/tailwind";

const ScreenHeader = ({ subtitle }) => (
  <View style={tailwind("mx-4")}>
    <Text style={tailwind("font-bold text-2xl")}>Heatzy Pilote Control</Text>
    <Text style={tailwind("text-medium-brown text-lg")}>{subtitle}</Text>
  </View>
);

export default ScreenHeader;
