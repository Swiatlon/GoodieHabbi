import { withDelay, withTiming } from 'react-native-reanimated';
import { renderHook } from '@testing-library/react-native';
import { useTransformFade } from './use-transform-fade-in';

jest.mock('react-native-reanimated', () => ({
  withDelay: jest.fn((_delay: number, animation: unknown) => animation),
  withTiming: jest.fn((val: number, _config?: object) => val),
  useSharedValue: jest.fn(() => ({ value: 0 })),
  useAnimatedStyle: jest.fn((fn: () => object) => fn()),
}));

describe('useTransformFade', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('triggers animation when isContentLoading is false', () => {
    renderHook(() => useTransformFade({ isContentLoading: false, delay: 300, direction: 'bottom' }));

    expect(withDelay).toHaveBeenCalledWith(300, 1);
    expect(withTiming).toHaveBeenCalledWith(1, { duration: 500 });
  });

  it('does not animate opacity when preventOpacity is true', () => {
    const { result } = renderHook(() => useTransformFade({ isContentLoading: false, preventOpacity: true }));

    const style = result.current;

    expect(style.opacity).toBe(1);
  });

  it('returns correct transform for direction "top"', () => {
    const { result } = renderHook(() => useTransformFade({ isContentLoading: false, direction: 'top' }));

    const style = result.current;

    expect(style.transform).toEqual([{ translateX: 0 }, { translateY: -50 }]);
  });
});
