import React, { useRef } from 'react';
import { Animated, TouchableOpacity } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

interface SwipeableRowProps {
  children: React.ReactNode;
  onDelete: () => void;
  onCopy?: () => void;
}

const ACTION_WIDTH = 80;

const SwipeableRow: React.FC<SwipeableRowProps> = ({ children, onDelete, onCopy }) => {
  const swipeableRef = useRef<Swipeable>(null);
  const actionsWidth = onCopy ? ACTION_WIDTH * 2 : ACTION_WIDTH;

  const renderRightActions = (progress: Animated.AnimatedInterpolation<number>) => {
    const translateX = progress.interpolate({ inputRange: [0, 1], outputRange: [actionsWidth, 0] });
    return (
      <Animated.View style={{ transform: [{ translateX }], width: actionsWidth, flexDirection: 'row' }}>
        {onCopy && (
          <TouchableOpacity
            onPress={() => {
              swipeableRef.current?.close();
              onCopy();
            }}
            className="flex-1 bg-primary items-center justify-center"
          >
            <Ionicons name="copy-outline" size={20} color="white" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => {
            swipeableRef.current?.close();
            onDelete();
          }}
          className="flex-1 bg-red-500 items-center justify-center"
        >
          <Ionicons name="trash-outline" size={20} color="white" />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <Swipeable ref={swipeableRef} renderRightActions={renderRightActions} overshootRight={false} friction={2}>
      {children}
    </Swipeable>
  );
};

export default SwipeableRow;
