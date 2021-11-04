import React from "react";
import { LinearGradient } from "expo-linear-gradient";

const commonProps = { start: { x: 0, y: 0 }, end: { x: 0.7, y: 0.7 } };

export function OrangeGradient(props) {
  return <LinearGradient {...commonProps} colors={["#F38B2B", "#F34949", "#F32B73"]} {...props} />;
}

export function AquamarineGradient(props) {
  return <LinearGradient {...commonProps} colors={["#00E9F8", "#12C6FF"]} {...props} />;
}

export function BlueGradient(props) {
  return (
    <LinearGradient
      {...commonProps}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      colors={["#36ABFF", "#7600D3"]}
      {...props}
    />
  );
}
