import { useState, useMemo } from 'react';

export type FilterValueType = string | number | null | boolean;

export interface ActualFilterData {
  key: string;
  value: FilterValueType;
}

interface FilterOptions<T> {
  data: T[];
  initialFilter: {
    key: keyof T;
    value: FilterValueType;
  };
}

export const useFilter = <T,>({ data, initialFilter }: FilterOptions<T>) => {
  const [actualFilter, setActualFilter] = useState(initialFilter);

  const setFilter = (key: keyof T, value: FilterValueType) => {
    setActualFilter({ key, value });
  };

  const setActualFilterKey = (key: keyof T) => {
    setActualFilter(prev => ({ ...prev, key }));
  };

  const filteredData = useMemo(() => {
    const { key, value } = actualFilter;

    if (!key || value === null) {
      return data;
    }

    return data.filter(item => item[key] === value);
  }, [data, actualFilter]);

  return {
    data: filteredData,
    actualFilterData: {
      key: actualFilter.key,
      value: actualFilter.value,
    },
    setFilter,
    setActualFilterKey,
  };
};
