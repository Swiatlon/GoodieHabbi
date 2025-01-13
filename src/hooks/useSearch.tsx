import { useState, useMemo } from 'react';

export interface SearchOptions<T> {
  data: T[];
  initialSearch: {
    key: keyof T;
    value: string;
  };
}

export const useSearch = <T,>({ data, initialSearch: { key, value } }: SearchOptions<T>) => {
  const [searchQuery, setSearchQuery] = useState(value || '');
  const [searchKey, setSearchKey] = useState<keyof T>(key);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const filteredData = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return data;
    }

    return data.filter(item => {
      const fieldValue = item[searchKey];

      if (typeof fieldValue === 'string') {
        return fieldValue.toLowerCase().includes(query);
      }

      return false;
    });
  }, [data, searchKey, searchQuery]);

  return {
    searchQuery,
    searchKey,
    isSearchVisible,
    data: filteredData,
    setSearchQuery,
    setSearchKey,
    setIsSearchVisible,
  };
};
