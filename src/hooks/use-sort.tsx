import { useState, useMemo, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dayjs } from 'dayjs';
import dayjs from '@/configs/day-js-config';
import { PriorityEnum, PriorityEnumType } from '@/contract/quests/base-quests';

export const SortOrderEnum = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export type SortOrderEnumType = (typeof SortOrderEnum)[keyof typeof SortOrderEnum];

interface SortConfig {
  key: string | null;
  order: SortOrderEnumType;
}

interface UseSortProps<T> {
  data: T[];
  secureStorageName?: string;
  initialSort: SortConfig;
}

export const useSort = <T,>({ data, initialSort, secureStorageName }: UseSortProps<T>) => {
  const [sortKey, setSortKey] = useState(initialSort.key);
  const [sortOrder, setSortOrder] = useState(initialSort.order);

  const sortedData = useMemo(() => {
    if (!sortKey) {
      return data;
    }

    const [validItems, nullItems] = separateItems(data, sortKey as keyof T);
    const sortedValidItems = sortItems(validItems, sortKey as keyof T, sortOrder);

    return [...sortedValidItems, ...nullItems];
  }, [data, sortKey, sortOrder]);

  useEffect(() => {
    if (secureStorageName) {
      const loadSort = async () => {
        const storedSort = await AsyncStorage.getItem(secureStorageName);

        if (storedSort) {
          const { key, order } = JSON.parse(storedSort) as SortConfig;

          setSortKey(key);
          setSortOrder(order);
        }
      };

      loadSort();
    }
  }, []);

  useEffect(() => {
    if (secureStorageName) {
      const saveSort = async () => {
        await AsyncStorage.setItem(secureStorageName, JSON.stringify({ key: sortKey, order: sortOrder }));
      };

      saveSort();
    }
  }, [sortKey, sortOrder, secureStorageName]);

  return {
    data: sortedData,
    actualSortKey: sortKey,
    actualSortOrder: sortOrder,
    setSortKey,
    setSortOrder,
  };
};

const hasValue = (value: unknown) => {
  return value !== null && value !== undefined;
};

const separateItems = <T,>(data: T[], sortKey: keyof T) => {
  if (!sortKey) {
    return [[], data];
  }

  return data.reduce<[T[], T[]]>(
    (acc, item) => {
      const value = item[sortKey];

      if (hasValue(value)) {
        acc[0].push(item);
      } else {
        acc[1].push(item);
      }

      return acc;
    },
    [[], []]
  );
};

const comparePriorityValues = (aValue: PriorityEnumType, bValue: PriorityEnumType, sortMultiplier: number) => {
  const priorityValues = Object.values(PriorityEnum);

  const aScore = priorityValues.indexOf(aValue);
  const bScore = priorityValues.indexOf(bValue);

  return (aScore - bScore) * sortMultiplier;
};

const compareStrings = (aValue: string, bValue: string, sortMultiplier: number) => {
  return aValue.localeCompare(bValue) * sortMultiplier;
};

const compareDates = (aValue: Dayjs, bValue: Dayjs, sortMultiplier: number) => {
  const aDate = dayjs(aValue);
  const bDate = dayjs(bValue);

  return (aDate.valueOf() - bDate.valueOf()) * sortMultiplier;
};

const compareBooleans = (aValue: boolean, bValue: boolean, sortMultiplier: number) => {
  return (aValue === bValue ? 0 : aValue ? -1 : 1) * sortMultiplier;
};

const compareNumbers = (aValue: number, bValue: number, sortMultiplier: number) => {
  return (aValue - bValue) * sortMultiplier;
};

const compareValues = (aValue: unknown, bValue: unknown, sortOrder: SortOrderEnumType) => {
  const sortMultiplier = sortOrder === SortOrderEnum.ASC ? 1 : -1;

  if (Object.values(PriorityEnum).includes(aValue as PriorityEnumType) && Object.values(PriorityEnum).includes(bValue as PriorityEnumType)) {
    return comparePriorityValues(aValue as PriorityEnumType, bValue as PriorityEnumType, sortMultiplier);
  }

  if (typeof aValue === 'string' && typeof bValue === 'string') {
    return compareStrings(aValue, bValue, sortMultiplier);
  }

  if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
    return compareBooleans(aValue, bValue, sortMultiplier);
  }

  if (typeof aValue === 'number' && typeof bValue === 'number') {
    return compareNumbers(aValue, bValue, sortMultiplier);
  }

  const aDate = dayjs(aValue as Date);
  const bDate = dayjs(bValue as Date);

  if (aDate.isValid() && bDate.isValid()) {
    return compareDates(aDate, bDate, sortMultiplier);
  }

  return 0;
};

const sortItems = <T,>(validItems: T[], sortKey: keyof T, sortOrder: SortOrderEnumType) => {
  return [...validItems].sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];

    return compareValues(aValue, bValue, sortOrder);
  });
};
