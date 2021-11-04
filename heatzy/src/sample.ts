import { HeatzyMode, HeatzyPilote } from "./device";
import HeatzyClient from "./index";

const logDevice = (device: HeatzyPilote): void => {
  const { did, name, mode, isLocked, schedule, boost, holidays, time } = device;
  console.log({
    did,
    name,
    mode,
    isLocked,
    schedule,
    boost,
    holidays,
    time,
  });
};

const main = async () => {
  const heatzy = new HeatzyClient(process.env.HEATZY_EMAIL, process.env.HEATZY_PASSWORD);
  const devices = await heatzy.getDevices();

  // console.log(await devices[0].getData());
  console.log("previous", await devices[0].data.updated_at);
  logDevice(devices[0]);
  // console.log(devices[0].infos);

  await devices[0].setMode(HeatzyMode.CONFORT);
  await devices[0].pollRefreshUntilNextUpdate();

  console.log("next", await devices[0].data.updated_at);
  logDevice(devices[0]);

  await devices[0].setMode(HeatzyMode.ECO);

  // // await devices[0].refresh();
  // console.log(await devices[0].getSchedule());
  // await devices[0].setSchedule([
  //   [
  //     { start: 0, mode: HeatzyMode.ECO, end: 8.5 * 60 },
  //     { start: 8.5 * 60, mode: HeatzyMode.CONFORT, end: 1080 },
  //     { start: 1080, mode: HeatzyMode.ECO, end: 1440 },
  //   ],
  //   [
  //     { start: 0, mode: HeatzyMode.ECO, end: 480 },
  //     { start: 480, mode: HeatzyMode.CONFORT, end: 1080 },
  //     { start: 1080, mode: HeatzyMode.ECO, end: 1440 },
  //   ],
  //   [
  //     { start: 0, mode: HeatzyMode.ECO, end: 480 },
  //     { start: 480, mode: HeatzyMode.CONFORT, end: 1080 },
  //     { start: 1080, mode: HeatzyMode.ECO, end: 1440 },
  //   ],
  //   [
  //     { start: 0, mode: HeatzyMode.ECO, end: 480 },
  //     { start: 480, mode: HeatzyMode.CONFORT, end: 1080 },
  //     { start: 1080, mode: HeatzyMode.ECO, end: 1440 },
  //   ],
  //   [
  //     { start: 0, mode: HeatzyMode.ECO, end: 480 },
  //     { start: 480, mode: HeatzyMode.CONFORT, end: 1080 },
  //     { start: 1080, mode: HeatzyMode.ECO, end: 1440 },
  //   ],
  //   [{ start: 0, mode: HeatzyMode.ECO, end: 1440 }],
  //   [{ start: 0, mode: HeatzyMode.ECO, end: 1440 }],
  // ]);

  // console.log(await heatzy.request(`/devices/${devices[0].did}/scheduler`));
};

main();
