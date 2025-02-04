import { useState, useMemo } from 'react';

interface FilterOptions<T> {
  data: T[];
  initialFilter: Partial<Record<keyof T, unknown>>;
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

export const useFilter = <T,>({ data, initialFilter }: FilterOptions<T>) => {
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

  return {
    data: filteredData,
    setFilter,
    resetFilter,
    actualFilter,
  };
};
