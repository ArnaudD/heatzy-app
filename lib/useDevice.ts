import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HeatzyMode, HeatzyPilote } from "../heatzy/src/device";

const getDeviceProps = (device) => {
  const { mode, schedule, isLocked, boost, holidays } = device;
  return { mode, schedule, isLocked, boost, holidays };
};

const useDevice = (device: HeatzyPilote) => {
  const [deviceProps, setDeviceProps] = useState(getDeviceProps(device));
  const refreshInterval = useRef<NodeJS.Timer>();

  const setMode = useCallback(
    async (mode: HeatzyMode) => {
      setDeviceProps((props) => ({ ...props, mode })); // optimistic update
      await device.setMode(mode);
    },
    [device]
  );

  const toggleScheduler = useCallback(
    async (active: boolean) => {
      setDeviceProps((props) => ({ ...props, schedule: { ...props.schedule, active } })); // optimistic update
      await device.toggleScheduler(active);
    },
    [device]
  );

  const refresh = useCallback(() => {
    console.log("refresh device");
    device.refresh();
  }, [device]);

  useEffect(() => {
    clearInterval(refreshInterval.current);
    refreshInterval.current = setInterval(refresh, 2000);

    const onChange = () => {
      console.log("device changed");
      setDeviceProps(getDeviceProps(device));
    };
    device.on("change", onChange);

    return () => {
      clearInterval(refreshInterval.current);
      device.removeListener("change", onChange);
    };
  }, [device]);

  return useMemo(
    () => ({
      ...deviceProps,
      setMode,
      toggleScheduler,
    }),
    [deviceProps, setMode]
  );
};

export default useDevice;
