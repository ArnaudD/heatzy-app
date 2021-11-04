import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { tailwind } from "../lib/tailwind";
import TextField from "../components/TextField";
import GradientButton from "../components/GradientButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHeatzyClientContext } from "../components/HeatzyClientContext";

export default function AuthScreen() {
  const [username, onChangeUserName] = React.useState(process.env.HEATZY_EMAIL);
  const [password, onChangePassword] = React.useState(process.env.HEATZY_PASSWORD);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>();
  const { setCredentials } = useHeatzyClientContext();

  const onLoginPressed = async () => {
    setLoading(true);

    try {
      if (!(await setCredentials(username, password))) {
        setError("Email et/ou mot de passe incorrect");
      }
    } catch (e) {
      // TODO
      console.log(e);
    }

    setLoading(false);
  };

  return (
    <>
      <SafeAreaView style={tailwind("h-full flex flex-col justify-center items-center px-8")}>
        <Text style={tailwind("text-3xl font-bold text-dark-brown")}>Heatzy Pilote Control</Text>
        <Text style={tailwind("text-lg text-center text-medium-brown leading-6")}>
          Connecte-toi avec ton compte Heatzy pour contrôler tes appareils
        </Text>
        <View style={tailwind("my-6 w-full")}>
          <TextField label="Adresse email" onChangeText={onChangeUserName} value={username} />
          <TextField
            label="Mot de passe"
            onChangeText={onChangePassword}
            value={password}
            secureTextEntry
          />
        </View>
        <GradientButton title="Me connecter" onPress={onLoginPressed} fullWidth />
        {error && (
          <Text style={tailwind("my-6 p-4 bg-red-100 w-full text-center text-red-800 rounded-lg")}>
            {error}
          </Text>
        )}
      </SafeAreaView>
      {false && (
        <View
          style={[
            tailwind(
              "absolute bg-snow-white bg-opacity-50 w-full h-full flex flex-col justify-center items-center z-10"
            ),
            { elevation: 3 },
          ]}
        >
          <ActivityIndicator color="black" />
        </View>
      )}
    </>
  );
}
