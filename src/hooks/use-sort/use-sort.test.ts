/* eslint-disable sonarjs/no-duplicate-string */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { renderHook, act } from '@testing-library/react-native';
import { useSort, SortOrderEnum } from './use-sort';
import { PriorityEnum } from '@/contract/quests/base-quests';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

const testData = [
  { name: 'John', priority: PriorityEnum.LOW, timeLeft: '2023-12-01' },
  { name: 'Jane', priority: PriorityEnum.HIGH, timeLeft: '2023-10-15' },
  { name: 'Doe', priority: PriorityEnum.MEDIUM, timeLeft: '2023-11-01' },
];

const initialSort = {
  key: 'name',
  objKey: 'name',
  order: SortOrderEnum.ASC,
};

describe('useSort', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('sorts data based on initial config', () => {
    const { result } = renderHook(() =>
      useSort({
        data: testData,
        initialSort,
      })
    );

    expect(result.current.data[0].name).toBe('Doe');
    expect(result.current.data[1].name).toBe('Jane');
    expect(result.current.data[2].name).toBe('John');
  });

  test('setSort updates sort and data', () => {
    const { result } = renderHook(() =>
      useSort({
        data: testData,
        initialSort,
      })
    );

    act(() => {
      result.current.setSortKey('priority');
      result.current.setSortObjKey('priority');
      result.current.setSortOrder(SortOrderEnum.DESC);
    });

    expect(result.current.actualSortKey).toBe('priority');
    expect(result.current.actualSortOrder).toBe(SortOrderEnum.DESC);
    expect(result.current.data[0].priority).toBe(PriorityEnum.HIGH);
    expect(result.current.data[1].priority).toBe(PriorityEnum.MEDIUM);
    expect(result.current.data[2].priority).toBe(PriorityEnum.LOW);
  });

  test('loads sort from AsyncStorage', async () => {
    const storedSort = { key: 'priority', objKey: 'priority', order: SortOrderEnum.DESC };
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(storedSort));

    const { result } = renderHook(() =>
      useSort({
        data: testData,
        initialSort,
        secureStorageName: 'sort-key',
      })
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(AsyncStorage.getItem).toHaveBeenCalledWith('sort-key');
    expect(result.current.actualSortKey).toBe('priority');
    expect(result.current.actualSortOrder).toBe(SortOrderEnum.DESC);
  });

  test('saves sort to AsyncStorage when updated', () => {
    const { result } = renderHook(() =>
      useSort({
        data: testData,
        initialSort,
        secureStorageName: 'sort-key',
      })
    );

    act(() => {
      result.current.setSortKey('priority');
      result.current.setSortObjKey('priority');
      result.current.setSortOrder(SortOrderEnum.ASC);
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith('sort-key', JSON.stringify({ key: 'priority', objKey: 'priority', order: SortOrderEnum.ASC }));
  });

  test('handles null values during sort', () => {
    const dataWithNulls = [
      { name: 'A', priority: 'low' },
      { name: 'B', priority: null },
      { name: 'C', priority: 'high' },
    ];

    const { result } = renderHook(() =>
      useSort({
        data: dataWithNulls,
        initialSort: { key: 'priority', objKey: 'priority', order: SortOrderEnum.ASC },
      })
    );

    expect(result.current.data[0].priority).toBe('high');
    expect(result.current.data[1].priority).toBe('low');
    expect(result.current.data[2].priority).toBeNull();
  });
});
