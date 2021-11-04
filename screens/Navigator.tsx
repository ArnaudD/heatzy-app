import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthScreen from "./Auth";
import { LightTheme } from "../config/Theme";
import { useHeatzyClientContext } from "../components/HeatzyClientContext";
import LoadingScreen from "./Loading";
import DevicesScreen from "./Devices";
import { Text, View } from "react-native";
import { snowWhite } from "../config/Colors";

const Stack = createNativeStackNavigator();

export default function Navigator() {
  const { client, initialized } = useHeatzyClientContext();

  let content;

  if (!initialized) {
    content = (
      <Stack.Screen name="Loading" options={{ headerShown: false }} component={LoadingScreen} />
    );
  } else if (client) {
    content = (
      <Stack.Screen
        name="Devices"
        options={{
          headerShown: false,
        }}
        component={DevicesScreen}
      />
    );
  } else {
    content = (
      <Stack.Screen
        name="Auth"
        options={{
          headerShown: false,
        }}
        component={AuthScreen}
      />
    );
  }

  return (
    <NavigationContainer theme={LightTheme}>
      <Stack.Navigator>{content}</Stack.Navigator>
    </NavigationContainer>
  );
}
