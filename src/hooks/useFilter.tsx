import { useState, useMemo } from 'react';

export type FilterValueType = string | number | null | boolean;

interface FilterOptions<T> {
  data: T[];
  initialFilter: {
    key: string;
    value: FilterValueType;
  };
}

export const useFilter = <T,>({ data, initialFilter }: FilterOptions<T>) => {
  const [actualFilter, setActualFilter] = useState(initialFilter);

  const setFilter = (key: string, value: FilterValueType) => {
    setActualFilter({ key, value });
  };

  const filteredData = useMemo(() => {
    const { key, value } = actualFilter;

    if (!key || value === null) {
      return data;
    }

    return data.filter(item => item[key as keyof T] === value);
  }, [data, actualFilter]);

  return {
    data: filteredData,
    actualFilterValue: actualFilter.value,
    setFilter,
  };
};
