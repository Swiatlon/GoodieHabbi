import { LayoutChangeEvent } from 'react-native';
import { renderHook, act } from '@testing-library/react-native';
import { useComponentSize } from './use-component-size';

describe('useComponentSize', () => {
  test('initial size is null', () => {
    const { result } = renderHook(() => useComponentSize());

    const [size] = result.current;
    expect(size).toBeNull();
  });

  test('updates size on layout event', () => {
    const { result } = renderHook(() => useComponentSize());

    const mockEvent = {
      nativeEvent: {
        layout: {
          width: 200,
          height: 100,
        },
      },
    } as LayoutChangeEvent;

    act(() => {
      const [, onLayout] = result.current;
      onLayout(mockEvent);
    });

    const [size] = result.current;
    expect(size).toEqual({ width: 200, height: 100 });
  });
});
