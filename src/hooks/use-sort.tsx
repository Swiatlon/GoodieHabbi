import { useState, useMemo } from 'react';

export const SortOrderEnum = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export type SortOrderEnumType = (typeof SortOrderEnum)[keyof typeof SortOrderEnum];

interface UseSortProps<T> {
  data: T[];
  initialSort: {
    key: string | null;
    order: SortOrderEnumType;
  };
}

export const useSort = <T,>({ data, initialSort: { key, order } }: UseSortProps<T>) => {
  const [sortKey, setSortKey] = useState<string | null>(key);
  const [sortOrder, setSortOrder] = useState<SortOrderEnumType>(order);

  const sortedData = useMemo(() => {
    if (!sortKey) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortKey as keyof T];
      const bValue = b[sortKey as keyof T];

      if (aValue === bValue) return 0;

      const sortMultiplier = sortOrder === SortOrderEnum.ASC ? 1 : -1;

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
