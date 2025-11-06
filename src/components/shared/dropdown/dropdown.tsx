import React, { useState, useCallback, useEffect, FC, ReactNode, RefObject } from 'react';
import { View, TouchableOpacity, Text, Dimensions } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withSpring } from 'react-native-reanimated';

interface DropdownProps {
  visible: boolean;
  onDismiss: () => void;
  anchor: RefObject<View>;
  children: ReactNode;
}

interface DropdownItemProps {
  onPress: () => void;
  title: string;
  leadingIcon?: ReactNode;
}

const DropdownItem: FC<DropdownItemProps> = ({ onPress, title, leadingIcon }) => (
  <TouchableOpacity onPress={onPress} className="flex-row items-center px-4 py-3 border-b border-gray-100 active:bg-gray-50">
    {leadingIcon && <View className="mr-3">{leadingIcon}</View>}
    <Text className="text-gray-800 font-medium">{title}</Text>
  </TouchableOpacity>
);

const Dropdown: FC<DropdownProps> & { Item: typeof DropdownItem } = ({ visible, onDismiss, anchor, children }) => {
  const [position, setPosition] = useState({ top: 0, right: 0 });
  const { width: windowWidth } = Dimensions.get('window');

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-10);
  const scale = useSharedValue(0.95);

  const updatePosition = useCallback(() => {
    if (!anchor.current) return;

    anchor.current.measureInWindow((x, y, width, height) => {
      setPosition({
        top: y + height + 8,
        right: windowWidth - (x + width),
      });
    });
  }, [anchor, windowWidth]);

  useEffect(() => {
    if (visible) {
      requestAnimationFrame(updatePosition);

      opacity.value = withTiming(1, { duration: 220 });
      translateY.value = withSpring(0, { damping: 14, stiffness: 120 });
      scale.value = withSpring(1, { damping: 15, stiffness: 120 });
    } else {
      opacity.value = withTiming(0, { duration: 150 });
      translateY.value = withTiming(-8, { duration: 150 });
      scale.value = withTiming(0.96, { duration: 150 });
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  if (!visible) return null;

  return (
    <TouchableOpacity activeOpacity={1} onPress={onDismiss} className="absolute left-0 right-0 top-0 bottom-0">
      <Animated.View
        className="absolute bg-white rounded-lg shadow-lg overflow-hidden"
        style={[
          {
            top: position.top,
            right: position.right,
            minWidth: 180,
            maxWidth: windowWidth - 32,
            elevation: 5,
          },
          animatedStyle,
        ]}
      >
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

Dropdown.Item = DropdownItem;

export { Dropdown };
