import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as SecureStore from "expo-secure-store";
import HeatzyClient from "../heatzy/src";
import { HeatzyPilote } from "../heatzy/src/device";

interface HeatzyClientContextProps {
  setCredentials?: (username: string, password: string) => Promise<HeatzyClient | null>;
  clearCredentials?: () => Promise<void>;
  client: HeatzyClient | null;
  initialized: boolean;
}

const emptyContext = { client: null, initialized: false } as HeatzyClientContextProps;
const HeatzyClientContext = createContext(emptyContext);

export const HeatzyClientContextProvider = ({ children }) => {
  const [client, setClient] = useState<HeatzyClient | null>();
  const [initialized, setInitialized] = useState<boolean>(false);

  const clearCredentials = useCallback(async () => {
    setClient(null);
    await Promise.all([
      SecureStore.deleteItemAsync("username"),
      SecureStore.deleteItemAsync("password"),
    ]);
  }, [setClient]);

  const setCredentials = useCallback(async (username: string, password: string) => {
    const c = new HeatzyClient(username, password);
    const result = await c.getToken();

    if (result.token) {
      setClient(c);
      await Promise.all([
        SecureStore.setItemAsync("username", username),
        SecureStore.setItemAsync("password", password),
      ]);
      return c;
    } else {
      return null;
    }
  }, []);

  const initialize = useCallback(async () => {
    const [username, password] = await Promise.all([
      SecureStore.getItemAsync("username"),
      SecureStore.getItemAsync("password"),
    ]);
    if (username && password) {
      if (!(await setCredentials(username, password))) {
        await clearCredentials();
      }
    }
    setInitialized(true);
  }, [setInitialized]);

  useEffect(() => {
    initialize();
  }, []);

  const value = useMemo(() => {
    return {
      setCredentials,
      clearCredentials,
      client,
      initialized,
    };
  }, [client, initialized]);

  return <HeatzyClientContext.Provider value={value}>{children}</HeatzyClientContext.Provider>;
};

export const useHeatzyClientContext = () => {
  return useContext(HeatzyClientContext);
};

export const useHeatzyClient = (): HeatzyClient | null => {
  return useHeatzyClientContext().client;
};

export const useDevices = (): { loading: boolean; devices: HeatzyPilote[] } => {
  const client = useHeatzyClient();
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState<HeatzyPilote[]>([]);

  const loadDevices = useCallback(async () => {
    const devices = await client.getDevices();
    setDevices(devices);
    setLoading(false);
  }, [client]);

  useEffect(() => {
    loadDevices();
  }, [client]);

  return useMemo(() => ({ devices, loading }), [devices, loading]);
};

export default HeatzyClientContext;
