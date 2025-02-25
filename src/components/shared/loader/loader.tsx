import React, { useLayoutEffect } from 'react';
import { Text, ActivityIndicator, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface LoaderProps {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
  backgroundColor?: string;
  fullscreen?: boolean;
  children?: React.JSX.Element;
}

const Loader: React.FC<LoaderProps> = ({
  message = 'Loading...',
  size = 'large',
  color = '#1987EE',
  backgroundColor = 'bg-white',
  fullscreen = true,
  children,
}) => {
  const opacity = useSharedValue(0);

  useLayoutEffect(() => {
    opacity.value = withTiming(1, { duration: 500 });
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={animatedStyle}
      className={`${fullscreen ? 'flex-1 absolute inset-0 z-50' : 'justify-center items-center'} ${backgroundColor} flex justify-center items-center`}
    >
      <ActivityIndicator size={size} color={color} />
      {message && <Text className="mt-4 text-base text-gray-600">{message}</Text>}
      {fullscreen && children && <View className="hidden">{children}</View>}
    </Animated.View>
  );
};

export default Loader;
