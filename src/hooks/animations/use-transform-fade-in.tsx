import { useEffect, useMemo, useCallback } from 'react';
import { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

const DEFAULT_ANIMATION_CONFIG = { duration: 500 };
const DEFAULT_DELAY = 500;
const DEFAULT_DIRECTION = 'bottom';
const TRANSLATION_DISTANCE = 50;

interface TransformFadeProps {
  isContentLoading?: boolean;
  delay?: number;
  direction?: 'top' | 'bottom' | 'left' | 'right';
  preventOpacity?: boolean;
}

export const useTransformFade = ({
  isContentLoading = false,
  delay = DEFAULT_DELAY,
  direction = DEFAULT_DIRECTION,
  preventOpacity = false,
}: TransformFadeProps) => {
  const progress = useSharedValue(0);

  const initialTranslation = useMemo(() => getTranslationForDirection(direction), [direction]);

  const triggerAnimation = useCallback(() => {
    if (!isContentLoading) {
      progress.value = withDelay(delay, withTiming(1, DEFAULT_ANIMATION_CONFIG));
    }
  }, [isContentLoading, delay, progress]);

  useEffect(() => {
    triggerAnimation();
  }, [triggerAnimation, isContentLoading]);

  const animatedStyle = useAnimatedStyle(() => {
    const currentTranslateX = initialTranslation.x * (1 - progress.value);
    const currentTranslateY = initialTranslation.y * (1 - progress.value);

    return {
      transform: [{ translateX: currentTranslateX }, { translateY: currentTranslateY }],
      opacity: preventOpacity ? 1 : progress.value,
    };
  });

  return animatedStyle;
};

const getTranslationForDirection = (direction: 'top' | 'bottom' | 'left' | 'right') => {
  const translation = { x: 0, y: 0 };

  switch (direction) {
    case 'top':
      translation.y = -TRANSLATION_DISTANCE;
      break;
    case 'bottom':
      translation.y = TRANSLATION_DISTANCE;
      break;
    case 'left':
      translation.x = -TRANSLATION_DISTANCE;
      break;
    case 'right':
      translation.x = TRANSLATION_DISTANCE;
      break;
  }

  return translation;
};
