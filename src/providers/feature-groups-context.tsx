import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'feature-groups.disabled';

export type FeatureGroupId = 'finance' | 'tasks' | 'workouts';

interface FeatureGroupsContextValue {
  isGroupEnabled: (group: FeatureGroupId) => boolean;
  setGroupEnabled: (group: FeatureGroupId, enabled: boolean) => void;
}

const Context = createContext<FeatureGroupsContextValue>({
  isGroupEnabled: () => true,
  setGroupEnabled: () => {},
});

export const FeatureGroupsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [disabledGroups, setDisabledGroups] = useState<FeatureGroupId[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw != null) setDisabledGroups(JSON.parse(raw));
      } catch {
        // ignore
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(disabledGroups));
      } catch {
        // ignore
      }
    })();
  }, [disabledGroups]);

  const isGroupEnabled = (group: FeatureGroupId) => !disabledGroups.includes(group);

  const setGroupEnabled = (group: FeatureGroupId, enabled: boolean) => {
    setDisabledGroups(prev => (enabled ? prev.filter(g => g !== group) : [...prev, group]));
  };

  return <Context.Provider value={{ isGroupEnabled, setGroupEnabled }}>{children}</Context.Provider>;
};

export const useFeatureGroups = () => useContext(Context);

export default FeatureGroupsProvider;
