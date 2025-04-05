import React from 'react';
import { View, Text, Animated } from 'react-native';

interface ProgressBarProps {
  width: Animated.Value;
  label: string;
  value: string;
  isComplete?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ width, label, value, isComplete = false }) => {
  return (
    <View className="flex items-center mt-3">
      <Text className="text-primary text-lg font-semibold">{label}</Text>
      <View className="relative w-full bg-gray-300 h-5 rounded-full mt-2">
        <Animated.View className={`${isComplete ? 'bg-green-500' : 'bg-primary'} h-5 rounded-full`} style={{ width }} />
        <Text className="absolute left-1/2 transform -translate-x-1/2 text-white font-bold -top-0.5">{value}</Text>
      </View>
    </View>
  );
};

export default ProgressBar;
