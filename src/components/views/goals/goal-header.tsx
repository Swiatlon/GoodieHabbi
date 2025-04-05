import React from 'react';
import { Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { useTransformFade } from '@/hooks/animations/use-transform-fade-in';

const GoalHeader = ({ title }: { title: string }) => {
  const headerStyle = useTransformFade({ delay: 100 });

  return (
    <Animated.View style={headerStyle}>
      <Text className="text-3xl font-extrabold text-primary text-center tracking-wide">{title}</Text>
    </Animated.View>
  );
};

export default GoalHeader;
