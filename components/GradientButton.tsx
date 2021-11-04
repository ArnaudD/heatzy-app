import React from "react";
import { Text, TouchableOpacity } from "react-native";
import tailwind from "tailwind-rn";
import { OrangeGradient } from "./Gradients";

export default function GradientButton({ title, onPress, fullWidth }) {
  const Gradient = OrangeGradient;
  const fullWidthStyle = fullWidth ? tailwind("w-full") : null;
  return (
    <TouchableOpacity onPress={onPress} style={fullWidthStyle}>
      <Gradient style={[tailwind("rounded-lg py-3 px-8"), fullWidthStyle]}>
        <Text style={tailwind("text-white font-bold text-lg text-center")}>{title}</Text>
      </Gradient>
    </TouchableOpacity>
  );
}
