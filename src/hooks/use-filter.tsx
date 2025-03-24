import { useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FilterOptions<T> {
  data: T[];
  initialFilter: Partial<Record<keyof T, unknown>>;
  secureStorageName?: string;
}

export type ActualFilterData = Record<string, unknown>;
export type FilterValueType = string | number | boolean | null;

const matchesFilter = <T,>(item: T, filter: ActualFilterData): boolean => {
  return Object.entries(filter).every(([key, value]) => {
    if (value === null) {
      return true;
    }
    return item[key as keyof T] === value;
  });
};

export const useFilter = <T,>({ data, initialFilter, secureStorageName }: FilterOptions<T>) => {
  const [actualFilter, setActualFilter] = useState<ActualFilterData>(initialFilter);

  const setFilter = (key: string, value: FilterValueType) => {
    setActualFilter(prevFilter => ({
      ...prevFilter,
      [key]: value,
    }));
  };

  const resetFilter = () => {
    setActualFilter(initialFilter);
  };

  const filteredData = useMemo(() => {
    return data.filter(item => matchesFilter(item, actualFilter));
  }, [data, actualFilter]);

  useEffect(() => {
    if (secureStorageName) {
      const loadFilter = async () => {
        const storedFilter = await AsyncStorage.getItem(secureStorageName);

        if (storedFilter) {
          setActualFilter(JSON.parse(storedFilter));
        }
      };

      loadFilter();
    }
  }, []);

  useEffect(() => {
    if (secureStorageName) {
      const saveFilter = async () => {
        await AsyncStorage.setItem(secureStorageName, JSON.stringify(actualFilter));
      };

      saveFilter();
    }
  }, [actualFilter, secureStorageName]);

  return {
    data: filteredData,
    setFilter,
    resetFilter,
    actualFilter,
  };
};
