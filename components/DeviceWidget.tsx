import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  LayoutAnimation,
  Platform,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { mediumBrown } from "../config/Colors";
import { HeatzyMode, HeatzyPilote, WeekSchedule } from "../heatzy/src/device";
import ConfortIcon from "../icons/Confort";
import EcoIcon from "../icons/Eco";
import FrostIcon from "../icons/Frost";
import HolidayIcon from "../icons/Holiday ";
import ManualIcon from "../icons/Manual";
import ProgIcon from "../icons/Prog";
import ShowMoreIcon from "../icons/ShowMoreIcon";
import { tailwind } from "../lib/tailwind";
import useDevice from "../lib/useDevice";
import { AquamarineGradient, BlueGradient, OrangeGradient } from "./Gradients";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type DeviceWidgetProps = {
  device: HeatzyPilote;
};

function ActionItem({ icon, text, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={tailwind("w-full flex flex-row items-center py-1")}
      activeOpacity={0.8}
    >
      <View style={tailwind("flex-shrink-0 w-8")}>{icon}</View>
      <Text style={tailwind("flex-grow font-bold text-base text-medium-brown")}>{text}</Text>
    </TouchableOpacity>
  );
}

const getNextScheduleChange = (
  currentMode: HeatzyMode,
  schedule: WeekSchedule
): { time: number; weekday: number; mode: HeatzyMode; dayDiff: number } | null => {
  const currentDate = new Date();
  const currentTime = currentDate.getHours() * 60 + currentDate.getMinutes();
  const currentWeekday = (currentDate.getDay() - 1 + 7) % 7; // schedule starts on monday for now (schedule[0] = monday)
  const currentSlotIndex = schedule[currentWeekday].findIndex(
    ({ start, end }) => currentTime >= start && currentTime < end
  );
  let nextSlotIndex = currentSlotIndex + 1;
  const scheduledMode = schedule[currentWeekday][currentSlotIndex].mode;
  let passedEndOfScheduledMode = false;

  for (let i = 0; i < 7; i++) {
    const weekday = i + currentWeekday;
    while (nextSlotIndex < schedule[weekday % 7].length) {
      if (
        !passedEndOfScheduledMode &&
        scheduledMode === schedule[weekday % 7][nextSlotIndex].mode
      ) {
        nextSlotIndex++;
        continue;
      } else {
        passedEndOfScheduledMode = true;
      }

      if (currentMode !== schedule[weekday % 7][nextSlotIndex].mode) {
        return {
          time: schedule[weekday % 7][nextSlotIndex].start,
          weekday: weekday % 7,
          mode: schedule[weekday % 7][nextSlotIndex].mode,
          dayDiff: weekday - currentWeekday,
        };
      }
      nextSlotIndex++;
    }
    nextSlotIndex = 0;
  }

  // Might happen if schedule is configured with the same mode every day of the week
  return null;
};

const formatTime = (time: number) => {
  return [`${Math.floor(time / 60)}`.padStart(2, "0"), `${time % 60}`.padStart(2, "0")].join("h"); // TODO i18n
};

export default function DeviceWidget({ device }: DeviceWidgetProps) {
  const { mode, schedule, setMode, toggleScheduler } = useDevice(device);

  const [collapsed, setCollapsed] = useState(false);

  const collapseAnimation = useRef(new Animated.Value(0)).current;

  const toggleCollapsed = useCallback(() => {
    Animated.timing(collapseAnimation, {
      toValue: collapsed ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setCollapsed(!collapsed);
  }, [collapsed]);

  const enableScheduler = useCallback(async () => {
    await toggleScheduler(true);
  }, [toggleScheduler]);

  const disableScheduler = useCallback(async () => {
    await toggleScheduler(false);
  }, [toggleScheduler]);

  const onEcoPressed = useCallback(async () => {
    await setMode(HeatzyMode.ECO);
  }, [setMode]);

  const onConfortPressed = useCallback(async () => {
    await setMode(HeatzyMode.CONFORT);
  }, [setMode]);

  const onFrostPressed = useCallback(async () => {
    await setMode(HeatzyMode.HGEL);
  }, [setMode]);

  const interpolateRotation = collapseAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  let Gradient;
  let textColorStyle = tailwind("text-white");
  let borderColorStyle = tailwind("border-white");
  let showMoreIconColor = "white";
  let modeIcon = <View></View>;
  let modeText = null;

  if (mode === HeatzyMode.CONFORT) {
    Gradient = OrangeGradient;
    modeText = "Confort";
    modeIcon = <ConfortIcon color="white" />;
  } else if (mode === HeatzyMode.ECO) {
    Gradient = BlueGradient;
    modeText = "Éco";
    modeIcon = <EcoIcon color="white" />;
  } else if (mode === HeatzyMode.HGEL) {
    Gradient = AquamarineGradient;
    modeText = "Hors-gel";
    modeIcon = <FrostIcon color="white" />;
  } else {
    Gradient = View;
    textColorStyle = tailwind("text-medium-brown");
    borderColorStyle = tailwind("border-medium-brown");
    showMoreIconColor = mediumBrown;
  }

  let nextProgChange;

  if (schedule?.active) {
    const nextSchedule = getNextScheduleChange(mode, schedule.weekSchedule);
    if (nextSchedule) {
      const nextSlotDate = new Date();
      nextSlotDate.setDate(new Date().getDate() + nextSchedule.dayDiff);
      nextSlotDate.setHours(Math.floor(nextSchedule.time / 60));
      nextSlotDate.setMinutes(nextSchedule.time % 60);
      nextProgChange = (
        <Text style={[textColorStyle, tailwind("text-lg font-bold"), { opacity: 0.7 }]}>
          {" "}
          (jusqu'à{" "}
          {nextSlotDate.toLocaleDateString("fr", {
            weekday: "long",
            hour: "numeric",
            minute: "2-digit",
          })}
          )
        </Text>
      );
    }
  }

  return (
    <View style={[tailwind("rounded-lg w-full bg-white"), { elevation: 1, overflow: "hidden" }]}>
      <TouchableOpacity onPress={toggleCollapsed} style={tailwind("w-full")} activeOpacity={0.8}>
        <Gradient style={[tailwind("w-full p-4 text-white")]}>
          <View style={tailwind("flex flex-row items-start justify-between")}>
            <View style={tailwind("flex flex-row items-center")}>
              <Text style={[tailwind("font-bold leading-4 mr-2"), textColorStyle]}>
                {device.name}
              </Text>
              <Text
                style={[
                  tailwind("font-bold text-center text-xs border border-white rounded-md px-1"),
                  borderColorStyle,
                  textColorStyle,
                ]}
              >
                {schedule?.active ? "PROG" : "MANUEL"}
              </Text>
            </View>
            <Animated.View style={{ transform: [{ rotate: interpolateRotation }] }}>
              <ShowMoreIcon color={showMoreIconColor} />
            </Animated.View>
          </View>
          <View style={tailwind("flex flex-row items-center mt-2")}>
            <View style={tailwind("mr-2")}>{modeIcon}</View>
            <Text style={[textColorStyle, tailwind("text-lg font-bold")]}>{modeText}</Text>
            {nextProgChange}
          </View>
        </Gradient>
      </TouchableOpacity>
      {!collapsed && (
        <View style={[tailwind("p-4 bg-white")]}>
          {mode !== HeatzyMode.ECO && (
            <ActionItem icon={<EcoIcon />} text="Forcer le mode Éco" onPress={onEcoPressed} />
          )}
          {mode !== HeatzyMode.CONFORT && (
            <ActionItem
              icon={<ConfortIcon />}
              text="Forcer le mode Confort"
              onPress={onConfortPressed}
            />
          )}
          {mode !== HeatzyMode.HGEL && (
            <ActionItem
              icon={<FrostIcon />}
              text="Forcer le mode Hors-gel"
              onPress={onFrostPressed}
            />
          )}
          <ActionItem
            icon={<HolidayIcon />}
            text="Activer le mode Vacances"
            onPress={onFrostPressed}
          />
          <ActionItem icon={<ProgIcon />} text="Modifier le planning" onPress={onFrostPressed} />
          {schedule.active ? (
            <ActionItem
              icon={<ManualIcon />}
              text="Passer en mode manuel"
              onPress={disableScheduler}
            />
          ) : (
            <ActionItem
              icon={<ManualIcon />}
              text="Passer en mode programmé"
              onPress={enableScheduler}
            />
          )}
        </View>
      )}
    </View>
  );
}
