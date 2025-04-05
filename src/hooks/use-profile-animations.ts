import { useCallback } from 'react';
import { Animated } from 'react-native';

export interface AnimationConfig {
  fadeDuration?: number;
  scaleConfig?: {
    friction?: number;
    tension?: number;
  };
  slideDuration?: number;
  progressDuration?: number;
}

/**
 * Custom hook for profile screen animations
 * @param config Optional configuration for animation timings and behaviors
 * @returns Animation values and start function
 */
const useProfileAnimations = (config: AnimationConfig = {}) => {
  const { fadeDuration = 500, scaleConfig = { friction: 8, tension: 40 }, slideDuration = 500, progressDuration = 1000 } = config;

  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);
  const slideAnim = new Animated.Value(50);
  const progressAnim = new Animated.Value(0);

  const startAnimations = useCallback(() => {
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.8);
    slideAnim.setValue(50);
    progressAnim.setValue(0);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: fadeDuration,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: scaleConfig.friction,
        tension: scaleConfig.tension,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: slideDuration,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: progressDuration,
        useNativeDriver: false,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim, slideAnim, progressAnim, fadeDuration, scaleConfig, slideDuration, progressDuration]);

  return {
    fadeAnim,
    scaleAnim,
    slideAnim,
    progressAnim,
    startAnimations,
  };
};

export default useProfileAnimations;
