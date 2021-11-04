import React, { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import DeviceWidget from "../components/DeviceWidget";
import { useDevices } from "../components/HeatzyClientContext";
import ScreenHeader from "../components/ScreenHeader";
import { HeatzyPilote } from "../heatzy/src/device";
import { tailwind } from "../lib/tailwind";

type DeviceListProps = {
  devices: HeatzyPilote[];
};

const DeviceList = ({ devices }) => {
  return devices.map((device) => (
    <View style={[tailwind("my-3")]} key={device.did}>
      <DeviceWidget device={device} />
    </View>
  ));
};

export default function DevicesScreen() {
  const { loading, devices } = useDevices();

  return (
    <View>
      <ScreenHeader subtitle="Mes appareils" />
      <View style={[tailwind("px-4 mt-3")]}>
        {loading ? (
          <View style={[tailwind("w-full flex flex-row justify-center items-center my-8")]}>
            <ActivityIndicator color="black" />
          </View>
        ) : (
          <DeviceList devices={devices} />
        )}
      </View>
    </View>
  );
}
