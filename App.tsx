import React from "react";
import { StatusBar } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Colors from "./config/Colors";
import { HeatzyClientContextProvider } from "./components/HeatzyClientContext";
import Navigator from "./screens/Navigator";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.snowWhite} />
      <HeatzyClientContextProvider>
        <Navigator />
      </HeatzyClientContextProvider>
    </SafeAreaProvider>
  );
}
