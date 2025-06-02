import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { calculateProgress } from '@/utils/utils/utils';

export interface ProgressBarProps {
  current: number;
  total: number;
  activeColor?: string;
  maxColor?: string;
  label?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, activeColor = 'bg-primary', maxColor = 'bg-green-500', label }) => {
  const progressPercentage = useMemo(() => calculateProgress(current, total), [current, total]);

  const barColor = useMemo(() => (progressPercentage >= 100 ? maxColor : activeColor), [progressPercentage, maxColor, activeColor]);

  return (
    <View className="relative w-full bg-gray-300 h-5 rounded-full mt-2">
      <View className={`${barColor} h-5 rounded-full`} style={{ width: `${progressPercentage}%` }} testID="progress-bar-fill" />
      <Text
        testID="progress-bar-label"
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-xs"
      >
        {label || `${current} / ${total}`}
      </Text>
    </View>
  );
};

export default ProgressBar;
