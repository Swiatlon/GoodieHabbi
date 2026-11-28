import { useState, useMemo } from 'react';
import dayjs from 'dayjs';

export interface SearchOptions<T> {
  data: T[];
  initialSearchValue?: string;
}

export const useSearch = <T,>({ data, initialSearchValue = '' }: SearchOptions<T>) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchValue);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const filteredData = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return data;
    }

    return data.filter(item => {
      const searchableTexts: string[] = [];
      const traversed = new WeakSet();

      const processStringValue = (value: string): void => {
        searchableTexts.push(value.toLowerCase());

        if (dayjs(value, 'YYYY-MM-DDTHH:mm:ssZ', true).isValid()) {
          const formatted = dayjs(value).format('DD.MM.YYYY').toLowerCase();
          searchableTexts.push(formatted);
        }
      };

      const traverse = (obj: unknown): void => {
        if (obj === null || obj === undefined) {
          return;
        }

        if (typeof obj === 'string') {
          processStringValue(obj);
        } else if (typeof obj === 'number' || typeof obj === 'boolean') {
          searchableTexts.push(String(obj).toLowerCase());
        } else if (typeof obj === 'object') {
          if (traversed.has(obj)) {
            return;
          }

          traversed.add(obj);

          if (Array.isArray(obj)) {
            obj.forEach(traverse);
          } else {
            Object.entries(obj).forEach(([key, value]) => {
              searchableTexts.push(key.toLowerCase());
              traverse(value);
            });
          }
        }
      };

      traverse(item);
      const searchableText = searchableTexts.join(' ');

      return searchableText.includes(query);
    });
  }, [data, searchQuery]);

  return {
    searchQuery,
    isSearchVisible,
    data: filteredData,
    setSearchQuery,
    setIsSearchVisible,
  };
};
