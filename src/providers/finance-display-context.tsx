import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'finance.hideNumbers';

interface DisplayContextValue {
  hideNumbers: boolean;
  setHideNumbers: (v: boolean) => void;
}

const Context = createContext<DisplayContextValue>({ hideNumbers: false, setHideNumbers: () => {} });

export const FinanceDisplayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hideNumbers, setHideNumbersState] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw != null) setHideNumbersState(raw === '1');
      } catch {}
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, hideNumbers ? '1' : '0');
      } catch {}
    })();
  }, [hideNumbers]);

  const setHideNumbers = (v: boolean) => setHideNumbersState(v);

  return <Context.Provider value={{ hideNumbers, setHideNumbers }}>{children}</Context.Provider>;
};

export const useFinanceDisplay = () => useContext(Context);

export default FinanceDisplayProvider;
