import fetch from "cross-fetch";
import { HeatzyPilote, HeatzyPiloteResponse, PRODUCT_CLASSES } from "./device";

const HOST = "euapi.gizwits.com";
const HEATZYAPPID = "c70a66ff039d41b4a220e198b0fcc8b3";

interface Token {
  token: string;
  uid: string;
  expireAt: number;
}

interface RequestOptions {
  method: string;
  body: any;
}

class HeatzyClient {
  username: string;
  password: string;
  token: Token | Promise<Token> | null;

  constructor(username: string, password: string) {
    this.token = null;
    this.username = username;
    this.password = password;
  }

  async request(path: string, options?: RequestOptions): Promise<any> {
    const response = await fetch(`https://${HOST}/app${path}`, {
      method: options?.method || "GET",
      body: options?.body ? JSON.stringify(options.body) : undefined,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Gizwits-Application-Id": "c70a66ff039d41b4a220e198b0fcc8b3",
        "X-Gizwits-User-Token": (await this.getToken()).token,
      },
    });

    return await response.json();
  }

  async fetchToken(): Promise<Token> {
    const response = await fetch(`https://${HOST}/app/login`, {
      method: "post",
      body: JSON.stringify({ username: this.username, password: this.password }),
      headers: {
        "Content-Type": "text/plain",
        "X-Gizwits-Application-Id": "c70a66ff039d41b4a220e198b0fcc8b3",
      },
    });

    const json = (await response.json()) as any;

    return {
      token: json.token,
      uid: json.uid,
      expireAt: json.expire_at,
    };
  }

  async getToken(): Promise<Token> {
    if (this.token) {
      return Promise.resolve(this.token);
    }

    this.token = this.fetchToken();

    return this.token;
  }

  async getDevices(): Promise<HeatzyPilote[]> {
    const { devices } = (await this.request("/bindings")) as { devices: HeatzyPiloteResponse[] };

    return (
      await Promise.all(
        devices.map(async (d) => {
          let PiloteClass = PRODUCT_CLASSES[d.product_name];

          if (PiloteClass) {
            const device = new PiloteClass(d, this);
            await device.refresh();
            return device;
          }

          return null;
        })
      )
    ).filter((d) => d !== null) as HeatzyPilote[];
  }
}

export default HeatzyClient;
