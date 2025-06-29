import React from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import RatioBar from '@/components/shared/ratio-bar/ratio-bar';
import { IStatsProfileResponse } from '@/contract/stats/stats.contract';
import { useTransformFade } from '@/hooks/animations/use-transform-fade-in';

interface QuestsSectionProps {
  quests: IStatsProfileResponse['quests'];
  isLoading: boolean;
}

const QuestsSection: React.FC<QuestsSectionProps> = ({ quests, isLoading }) => {
  const animationStyle = useTransformFade({ isContentLoading: isLoading, delay: 500 });
  const { completed, inProgress, currentTotal } = quests;

  const segments = [
    { label: 'In Progress', value: inProgress, color: '#3b82f6' },
    { label: 'Completed', value: completed, color: '#22c55e' },
  ];

  return (
    <Animated.View style={animationStyle} className="px-4 py-6 bg-gray-100 rounded-lg shadow-lg w-full mb-6">
      <Text className="text-lg font-bold text-center mb-4">Quests Overview</Text>

      <View className="flex-row justify-around mb-4">
        <View className="items-center flex-1">
          <Text className="text-green-600 font-bold text-xl">{completed}</Text>
          <Text className="text-xs text-gray-600">Completed</Text>
        </View>
        <View className="items-center flex-1">
          <Text className="text-blue-600 font-bold text-xl">{inProgress}</Text>
          <Text className="text-xs text-gray-600">In Progress</Text>
        </View>
        <View className="items-center flex-1">
          <Text className="text-gray-800 font-bold text-xl">{currentTotal}</Text>
          <Text className="text-xs text-gray-600">Total</Text>
        </View>
      </View>

      <RatioBar segments={segments} />
    </Animated.View>
  );
};

export default QuestsSection;
