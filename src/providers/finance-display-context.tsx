import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'finance.hideNumbers';
const MASKED_VALUE = '***';

interface DisplayContextValue {
  hideNumbers: boolean;
  setHideNumbers: (v: boolean) => void;
  // Formats a value for display, replacing it with a placeholder while hideNumbers is on — every screen
  // that shows an amount needs this, so it lives here once instead of being re-derived per component.
  mask: (v: string) => string;
}

const identityMask = (v: string) => v;

const Context = createContext<DisplayContextValue>({ hideNumbers: false, setHideNumbers: () => {}, mask: identityMask });

export const FinanceDisplayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hideNumbers, setHideNumbers] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw != null) setHideNumbers(raw === '1');
      } catch {
        // Best-effort: fall back to the default (numbers shown) if storage can't be read.
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, hideNumbers ? '1' : '0');
      } catch {
        // Best-effort: the preference just won't survive an app restart.
      }
    })();
  }, [hideNumbers]);

  const mask = (v: string) => (hideNumbers ? MASKED_VALUE : v);

  return <Context.Provider value={{ hideNumbers, setHideNumbers, mask }}>{children}</Context.Provider>;
};

export const useFinanceDisplay = () => useContext(Context);

export default FinanceDisplayProvider;
