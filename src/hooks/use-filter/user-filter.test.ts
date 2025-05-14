/* eslint-disable sonarjs/no-duplicate-string */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { renderHook, act } from '@testing-library/react-native';
import { useFilter, ActualFilterData } from './use-filter';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

const testData = [
  { id: 1, name: 'John', active: true },
  { id: 2, name: 'Jane', active: false },
];

describe('useFilter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('filters data based on provided filter', () => {
    const { result } = renderHook(() =>
      useFilter({
        data: testData,
        initialFilter: { active: true },
      })
    );

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data[0].name).toBe('John');
  });

  test('setFilter updates actualFilter and filters data', () => {
    const { result } = renderHook(() =>
      useFilter({
        data: testData,
        initialFilter: {},
      })
    );

    act(() => {
      result.current.setFilter('active', false);
    });
    expect(result.current.actualFilter).toEqual({ active: false });
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data[0].name).toBe('Jane');
  });

  test('resetFilter restores initial filter', () => {
    const { result } = renderHook(() =>
      useFilter({
        data: testData,
        initialFilter: { active: true },
      })
    );

    act(() => {
      result.current.setFilter('active', false);
    });
    expect(result.current.actualFilter).toEqual({ active: false });

    act(() => {
      result.current.resetFilter();
    });
    expect(result.current.actualFilter).toEqual({ active: true });
    expect(result.current.data[0].name).toBe('John');
  });

  test('loads filter from AsyncStorage', async () => {
    const storedFilter: ActualFilterData = { active: false };
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(storedFilter));

    const { result } = renderHook(() =>
      useFilter({
        data: testData,
        initialFilter: {},
        secureStorageName: 'test-filter',
      })
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(AsyncStorage.getItem).toHaveBeenCalledWith('test-filter');
    expect(result.current.actualFilter).toEqual(storedFilter);
    expect(result.current.data).toHaveLength(1);
  });

  test('saves filter to AsyncStorage on change', () => {
    const { result } = renderHook(() =>
      useFilter({
        data: testData,
        initialFilter: {},
        secureStorageName: 'test-filter',
      })
    );

    act(() => {
      result.current.setFilter('active', true);
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith('test-filter', JSON.stringify({ active: true }));
  });
});
