import React from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

interface SwipeMonthAreaProps {
  children: React.ReactNode;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

const SWIPE_DISTANCE_THRESHOLD = 50;

const SwipeMonthArea: React.FC<SwipeMonthAreaProps> = ({ children, onSwipeLeft, onSwipeRight }) => {
  const panGesture = Gesture.Pan()
    .activeOffsetX([-20, 20])
    .failOffsetY([-15, 15])
    .onEnd(event => {
      if (event.translationX <= -SWIPE_DISTANCE_THRESHOLD) {
        runOnJS(onSwipeLeft)();
      } else if (event.translationX >= SWIPE_DISTANCE_THRESHOLD) {
        runOnJS(onSwipeRight)();
      }
    });

  return <GestureDetector gesture={panGesture}>{children}</GestureDetector>;
};

export default SwipeMonthArea;
