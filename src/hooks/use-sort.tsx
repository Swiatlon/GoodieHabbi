import { useState, useMemo } from 'react';

export enum SortOrderEnum {
  ASC = 'asc',
  DESC = 'desc',
}

interface UseSortProps<T> {
  data: T[];
  initialSort: {
    key: string | null;
    order: SortOrderEnum;
  };
}

export const useSort = <T,>({ data, initialSort: { key, order } }: UseSortProps<T>) => {
  const [sortKey, setSortKey] = useState<string | null>(key);
  const [sortOrder, setSortOrder] = useState<SortOrderEnum>(order);

  const sortedData = useMemo(() => {
    if (!sortKey) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortKey as keyof T];
      const bValue = b[sortKey as keyof T];

      if (aValue === bValue) return 0;

      const sortMultiplier = sortOrder === SortOrderEnum.ASC ? 1 : -1;

      // Ensure proper comparison for strings, numbers, or other types
      if (aValue < bValue) return -1 * sortMultiplier;
      if (aValue > bValue) return 1 * sortMultiplier;

      return 0;
    });
  }, [data, sortKey, sortOrder]);

  return {
    data: sortedData,
    actualSortKey: sortKey,
    actualSortOrder: sortOrder,
    setSortKey,
    setSortOrder,
  };
};
