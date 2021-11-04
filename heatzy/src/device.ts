import EventEmitter from "eventemitter3";
import { isEqual } from "lodash";
import pick from "lodash/pick";
import HeatzyClient from ".";

export enum HeatzyMode {
  OFF = "OFF",
  ECO = "ECO",
  HGEL = "HGEL",
  CONFORT = "CONFORT",
}

export enum HeatzyPiloteProduct {
  Heatzy = "Heatzy",
  Pilote2 = "Pilote2",
  Pilote_Soc = "Pilote_Soc",
}

class UnsupportedError extends Error {
  constructor() {
    super();
    this.name = "UnsupportedError";
  }
}

export interface HeatzyPiloteResponse {
  did: string;
  dev_alias: string;
  product_name: HeatzyPiloteProduct;
}

export interface ScheduleRange {
  start: number;
  end: number;
  mode: HeatzyMode;
}

export type DaySchedule = ScheduleRange[];

export type WeekSchedule = DaySchedule[];

const BINARY_TO_MODE = {
  [0b00]: HeatzyMode.CONFORT,
  [0b01]: HeatzyMode.ECO,
  [0b10]: HeatzyMode.HGEL,
} as Record<number, HeatzyMode>;

const MODE_TO_BINARY = {
  [HeatzyMode.CONFORT]: 0b00,
  [HeatzyMode.ECO]: 0b01,
  [HeatzyMode.HGEL]: 0b10,
} as Record<HeatzyMode, number>;

const wait = async (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

export class HeatzyPilote extends EventEmitter {
  client: HeatzyClient;
  did: string;
  name: string;
  infos: any;
  data: any;

  mode?: HeatzyMode | null;
  isLocked?: boolean | null; // data.lock_switch

  schedule?: {
    active: boolean;
    weekSchedule: WeekSchedule | null;
  } | null;
  boost?: { active: boolean; minutesRemaining: number } | null; // boost_switch & boost_time
  holidays?: { active: boolean; daysRemaining: number } | null; // derog_mode = 1 & derog_time

  time?: { hour: number; minute: number; weekday: number } | null; // time_hour &  time_min &  time_week

  static DECODE_MODE: Record<string, HeatzyMode>;
  static ENCODE_MODE: Record<HeatzyMode, any>;

  constructor(infos: HeatzyPiloteResponse, client: HeatzyClient) {
    super();
    this.client = client;
    this.did = infos.did;
    this.name = infos.dev_alias;
    this.infos = infos;
  }

  async refresh(): Promise<void> {
    this.data = await this.client.request(`/devdata/${this.did}/latest`);

    const dataAttr = this.data?.attr;

    const attrs = ["mode", "schedule", "isLocked", "boost", "holidays"];

    const previousSnapshot = pick(this, attrs);

    this.mode = (<typeof HeatzyPilote>this.constructor).DECODE_MODE[dataAttr.mode];
    this.schedule = { active: dataAttr.timer_switch === 1, weekSchedule: this.getSchedule() };
    this.isLocked = dataAttr.lock_switch === 1;
    this.boost = { active: dataAttr.boost_switch === 1, minutesRemaining: dataAttr.boost_time };
    this.holidays = {
      active: dataAttr.derog_mode === 1,
      daysRemaining: dataAttr.derog_mode === 1 ? dataAttr.derog_time : 0,
    };
    this.time = {
      hour: dataAttr.time_hour,
      minute: dataAttr.time_min,
      weekday: dataAttr.time_week,
    };

    const nextSnapshot = pick(this, attrs);

    if (!isEqual(previousSnapshot, nextSnapshot)) {
      this.emit("change");
    }
  }

  async getData() {
    if (!this.data) {
      await this.refresh();
    }

    return this.data;
  }

  async pollRefreshUntilNextUpdate(): Promise<void> {
    const lastUpdatedAt = this.data.updated_at;
    while (true) {
      await wait(700);
      await this.refresh();
      if (this.data.updated_at !== lastUpdatedAt) return;
    }
  }

  async setMode(mode: HeatzyMode): Promise<HeatzyPilote> {
    const ENCODE_MODE = (<typeof HeatzyPilote>this.constructor).ENCODE_MODE;

    if (!ENCODE_MODE) {
      throw new Error(`Mode ${mode} not supported.`);
    }

    console.log(`/control/${this.did} (mode: ${mode})`);

    await this.client.request(`/control/${this.did}`, {
      method: "POST",
      body: ENCODE_MODE[mode] as any,
    });

    return this;
  }

  async toggleBoost(toggle: boolean, minutes?: number): Promise<HeatzyPilote> {
    throw new UnsupportedError();
  }
  async toggleScheduler(toggle: boolean): Promise<HeatzyPilote> {
    throw new UnsupportedError();
  }
  async toggleHolidays(toggle: boolean, days?: number): Promise<HeatzyPilote> {
    throw new UnsupportedError();
  }
  async toggleLock(toggle: boolean): Promise<HeatzyPilote> {
    throw new UnsupportedError();
  }

  startBoost(minutes: number): Promise<HeatzyPilote> {
    return this.toggleBoost(true, minutes);
  }

  stopBoost(): Promise<HeatzyPilote> {
    return this.toggleBoost(false);
  }

  startScheduler(): Promise<HeatzyPilote> {
    return this.toggleScheduler(true);
  }

  stopScheduler(): Promise<HeatzyPilote> {
    return this.toggleScheduler(false);
  }

  startHolidays(days: number): Promise<HeatzyPilote> {
    return this.toggleHolidays(true, days);
  }

  stopHolidays(): Promise<HeatzyPilote> {
    return this.toggleHolidays(false);
  }

  lock(): Promise<HeatzyPilote> {
    return this.toggleLock(true);
  }

  unlock(): Promise<HeatzyPilote> {
    return this.toggleLock(false);
  }

  getSchedule(): WeekSchedule | null {
    return null;
  }

  async setSchedule(schedule: WeekSchedule): Promise<HeatzyPilote> {
    throw new UnsupportedError();
  }
}

export class HeatzyPilote1 extends HeatzyPilote {
  static DECODE_MODE = {
    停止: HeatzyMode.OFF,
    经济: HeatzyMode.ECO,
    解冻: HeatzyMode.HGEL,
    舒适: HeatzyMode.CONFORT,
  };

  static ENCODE_MODE = {
    [HeatzyMode.OFF]: { raw: [1, 1, 3] },
    [HeatzyMode.ECO]: { raw: [1, 1, 1] },
    [HeatzyMode.HGEL]: { raw: [1, 1, 2] },
    [HeatzyMode.CONFORT]: { raw: [1, 1, 0] },
  };
}

export class HeatzyPilote2 extends HeatzyPilote {
  static DECODE_MODE = {
    stop: HeatzyMode.OFF,
    eco: HeatzyMode.ECO,
    fro: HeatzyMode.HGEL,
    cft: HeatzyMode.CONFORT,
  };

  static ENCODE_MODE = {
    [HeatzyMode.OFF]: { attrs: { mode: "stop" } },
    [HeatzyMode.ECO]: { attrs: { mode: "eco" } },
    [HeatzyMode.HGEL]: { attrs: { mode: "fro" } },
    [HeatzyMode.CONFORT]: { attrs: { mode: "cft" } },
  };

  async toggleBoost(toggle: boolean, minutes?: number): Promise<HeatzyPilote> {
    const body = {
      attrs: {
        derog_mode: toggle ? 2 : 0,
      },
    } as any;

    if (toggle) {
      body.attrs.derog_time = minutes;
    }

    await this.client.request(`/control/${this.did}`, {
      method: "POST",
      body,
    });

    return this;
  }

  async toggleScheduler(toggle: boolean): Promise<HeatzyPilote> {
    console.log(`/control/${this.did} (scheduler: ${toggle ? "on" : "off"})`);

    await this.client.request(`/control/${this.did}`, {
      method: "POST",
      body: {
        attrs: {
          timer_switch: toggle ? 1 : 0,
        },
      } as any,
    });

    return this;
  }

  async toggleHolidays(toggle: boolean, days?: number): Promise<HeatzyPilote> {
    const body = {
      attrs: {
        derog_mode: toggle ? 1 : 0,
      },
    } as any;

    if (toggle) {
      body.attrs.derog_time = days;
    }

    await this.client.request(`/control/${this.did}`, {
      method: "POST",
      body,
    });

    return this;
  }

  async toggleLock(toggle: boolean): Promise<HeatzyPilote> {
    await this.client.request(`/control/${this.did}`, {
      method: "POST",
      body: {
        attrs: {
          lock_switch: toggle ? 1 : 0,
        },
      } as any,
    });

    return this;
  }

  getSchedule(): WeekSchedule {
    const { attr } = this.data;

    const result: WeekSchedule = [];

    for (let day = 1; day <= 7; day++) {
      const daySchedule: ScheduleRange[] = [];
      let currentRange = { start: 0 } as ScheduleRange;
      daySchedule.push(currentRange);
      for (let hour = 1; hour <= 12; hour++) {
        const rangeData = attr[`p${day}_data${hour}`] as number;

        for (let i = 0; i < 4; i++) {
          const mode = BINARY_TO_MODE[0b11 & (rangeData >> (i * 2))];

          if (hour === 1 && i === 0) {
            currentRange.mode = mode;
          } else if (mode !== currentRange.mode) {
            const time = (hour - 1) * 2 * 60 + i * 30;
            currentRange.end = time;
            currentRange = { start: time, mode } as ScheduleRange;
            daySchedule.push(currentRange);
          }
        }
      }

      currentRange.end = 24 * 60;
      result.push(daySchedule);
    }

    return result;
  }

  async setSchedule(schedule: WeekSchedule): Promise<HeatzyPilote> {
    const result = {} as any;

    for (let day = 1; day <= 7; day++) {
      for (let hour = 1; hour <= 12; hour++) {
        result[`p${day}_data${hour}`] = 0;
      }
    }

    for (let day = 1; day <= 7; day++) {
      for (const range of schedule[day - 1]) {
        for (let i = range.start / 30; i < range.end / 30; i++) {
          result[`p${day}_data${Math.floor(i / 4) + 1}`] |=
            MODE_TO_BINARY[range.mode] << ((i % 4) * 2);
        }
      }
    }

    await this.client.request(`/control/${this.did}`, {
      method: "POST",
      body: {
        attrs: result,
      },
    });

    return this;
  }
}

export class HeatzyPilote3 extends HeatzyPilote2 {
  async toggleBoost(toggle: boolean, minutes?: number): Promise<HeatzyPilote> {
    const body = {
      attrs: {
        boost_switch: toggle ? 1 : 0,
      },
    } as any;

    if (toggle) {
      body.attrs.boost_time = minutes;
    }

    await this.client.request(`/control/${this.did}`, {
      method: "POST",
      body,
    });

    return this;
  }

  async toggleHolidays(toggle: boolean, days?: number): Promise<HeatzyPilote> {
    const body = {
      attrs: {
        derog_mode: toggle ? 1 : 0,
      },
    } as any;

    if (toggle) {
      body.attrs.derog_time = days;
    }

    await this.client.request(`/control/${this.did}`, {
      method: "POST",
      body,
    });

    return this;
  }

  async toggleLock(toggle: boolean): Promise<HeatzyPilote> {
    await this.client.request(`/control/${this.did}`, {
      method: "POST",
      body: {
        attrs: {
          lock_switch: toggle ? 1 : 0,
        },
      } as any,
    });

    return this;
  }
}

export const PRODUCT_CLASSES = {
  [HeatzyPiloteProduct.Heatzy]: HeatzyPilote1,
  [HeatzyPiloteProduct.Pilote2]: HeatzyPilote2,
  [HeatzyPiloteProduct.Pilote_Soc]: HeatzyPilote3,
};
