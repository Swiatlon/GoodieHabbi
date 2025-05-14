import { renderHook, act } from '@testing-library/react-native';
import { useSearch } from './use-search';

const testData = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  // eslint-disable-next-line sonarjs/no-duplicate-string
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
];

const complexTestData = [
  {
    id: 1,
    user: {
      name: 'John Doe',
      contact: {
        email: 'john@example.com',
        phone: '555-1234',
      },
    },
    tags: ['important', 'priority'],
    createdAt: '2023-01-15T00:00:00Z',
  },
  {
    id: 2,
    user: {
      name: 'Jane Smith',
      contact: {
        email: 'jane@example.com',
        phone: '555-5678',
      },
    },
    tags: ['normal'],
    createdAt: '2023-05-20T12:30:45Z',
  },
];

const mixedTypesData = [
  { id: 1, name: 'John', active: true, score: 42 },
  { id: 2, name: 'Jane', active: false, score: 98 },
];

describe('useSearch', () => {
  test('returns all data when search query is empty', () => {
    const { result } = renderHook(() => useSearch({ data: testData }));

    expect(result.current.data).toEqual(testData);
    expect(result.current.data.length).toBe(3);
  });

  test('handles empty data array', () => {
    const { result } = renderHook(() => useSearch({ data: [] }));
    expect(result.current.data).toEqual([]);
    expect(result.current.data.length).toBe(0);
  });

  test('handles null or undefined data safely', () => {
    // @ts-expect-error - Intentionally testing incorrect usage
    renderHook(() => useSearch({ data: null }));

    expect(() => {}).not.toThrow();
  });

  test('filters by simple string match', () => {
    const { result } = renderHook(() => useSearch({ data: testData }));

    act(() => {
      result.current.setSearchQuery('John');
    });

    expect(result.current.data).toHaveLength(2);
    expect(result.current.data[0].id).toBe(1);
    expect(result.current.data[0].name).toBe('John Doe');
  });

  test('performs case-insensitive search', () => {
    const { result } = renderHook(() => useSearch({ data: testData }));

    act(() => {
      result.current.setSearchQuery('john');
    });

    expect(result.current.data).toHaveLength(2);
    expect(result.current.data[0].name).toBe('John Doe');

    act(() => {
      result.current.setSearchQuery('JANE');
    });

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data[0].name).toBe('Jane Smith');
  });

  test('matches partial words', () => {
    const { result } = renderHook(() => useSearch({ data: testData }));

    act(() => {
      result.current.setSearchQuery('ja');
    });

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data[0].name).toBe('Jane Smith');
  });

  test('matches by email domain', () => {
    const { result } = renderHook(() => useSearch({ data: testData }));

    act(() => {
      result.current.setSearchQuery('example.com');
    });

    expect(result.current.data).toHaveLength(3);
  });

  test('initializes with provided search value', () => {
    const { result } = renderHook(() =>
      useSearch({
        data: testData,
        initialSearchValue: 'John',
      })
    );

    expect(result.current.searchQuery).toBe('John');
    expect(result.current.data).toHaveLength(2);
    expect(result.current.data[0].name).toBe('John Doe');
  });

  test('toggles search visibility', () => {
    const { result } = renderHook(() => useSearch({ data: testData }));

    expect(result.current.isSearchVisible).toBe(false);
    act(() => {
      result.current.setIsSearchVisible(true);
    });
    expect(result.current.isSearchVisible).toBe(true);
  });

  test('searches through nested object properties', () => {
    const { result } = renderHook(() => useSearch({ data: complexTestData }));

    act(() => {
      result.current.setSearchQuery('555-1234');
    });
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data[0].id).toBe(1);

    act(() => {
      result.current.setSearchQuery('jane@example');
    });
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data[0].id).toBe(2);
  });

  test('searches through array values', () => {
    const { result } = renderHook(() => useSearch({ data: complexTestData }));

    act(() => {
      result.current.setSearchQuery('important');
    });
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data[0].id).toBe(1);

    act(() => {
      result.current.setSearchQuery('normal');
    });
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data[0].id).toBe(2);
  });

  test('includes object keys in search', () => {
    const { result } = renderHook(() => useSearch({ data: complexTestData }));

    act(() => {
      result.current.setSearchQuery('email');
    });
    expect(result.current.data).toHaveLength(2);
  });

  test('searches through non-string primitive values', () => {
    const { result } = renderHook(() => useSearch({ data: mixedTypesData }));

    act(() => {
      result.current.setSearchQuery('42');
    });
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data[0].id).toBe(1);

    act(() => {
      result.current.setSearchQuery('true');
    });
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data[0].id).toBe(1);

    act(() => {
      result.current.setSearchQuery('false');
    });
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data[0].id).toBe(2);
  });

  test('searches through formatted dates', () => {
    const { result } = renderHook(() => useSearch({ data: complexTestData }));

    act(() => {
      result.current.setSearchQuery('15.01.2023');
    });
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data[0].id).toBe(1);
    act(() => {
      result.current.setSearchQuery('20.05');
    });
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data[0].id).toBe(2);
  });

  test('reacts to changes in data prop', () => {
    const { result, rerender } = renderHook(props => useSearch(props), { initialProps: { data: testData } });
    expect(result.current.data).toHaveLength(3);

    const newData = [
      { id: 4, name: 'Alice Wonder', email: 'alice@example.com' },
      { id: 5, name: 'Tom Jones', email: 'tom@example.com' },
    ];

    rerender({ data: newData });
    expect(result.current.data).toHaveLength(2);
    expect(result.current.data[0].id).toBe(4);

    act(() => {
      result.current.setSearchQuery('alice');
    });
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data[0].name).toBe('Alice Wonder');
  });

  test('handles whitespace in search query', () => {
    const { result } = renderHook(() => useSearch({ data: testData }));

    act(() => {
      result.current.setSearchQuery('  John  ');
    });
    expect(result.current.data).toHaveLength(2);
    expect(result.current.data[0].name).toBe('John Doe');
  });

  test('handles multiple words in search query as single search term', () => {
    const { result } = renderHook(() => useSearch({ data: testData }));

    act(() => {
      result.current.setSearchQuery('John Doe');
    });
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data[0].name).toBe('John Doe');
  });

  test('clears search results when query is emptied', () => {
    const { result } = renderHook(() => useSearch({ data: testData }));

    act(() => {
      result.current.setSearchQuery('John');
    });
    expect(result.current.data).toHaveLength(2);
    act(() => {
      result.current.setSearchQuery('');
    });
    expect(result.current.data).toHaveLength(3);
  });
});
