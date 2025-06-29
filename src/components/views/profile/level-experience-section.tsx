import React from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import ProgressBar from '@/components/shared/progress-bar/progress-bar';
import { IStatsProfileResponse } from '@/contract/stats/stats.contract';
import { useTransformFade } from '@/hooks/animations/use-transform-fade-in';

interface LevelExperienceSectionProps {
  xpProgress: IStatsProfileResponse['xpProgress'];
  isLoading: boolean;
}

const LevelExperienceSection: React.FC<LevelExperienceSectionProps> = ({ xpProgress, isLoading }) => {
  const { level, currentXp, nextLevelXpRequirement, isMaxLevel } = xpProgress;
  const animationStyle = useTransformFade({ isContentLoading: isLoading, delay: 300 });

  return (
    <Animated.View style={animationStyle} className="px-4 py-6 bg-gray-100 rounded-lg shadow-lg flex w-full mb-6">
      <Text className="text-lg font-bold text-center mb-3">Experience Overview</Text>

      <View className="flex items-center mb-4">
        <View className="flex-row items-center justify-between w-full">
          <Text className="text-primary text-lg font-semibold text-center w-full">Level: {level}</Text>
          {isMaxLevel && (
            <View className="bg-yellow-500 px-3 py-1 rounded-full">
              <Text className="text-white font-bold text-xs">MAX LEVEL</Text>
            </View>
          )}
        </View>

        <ProgressBar
          current={currentXp}
          total={nextLevelXpRequirement}
          maxColor={isMaxLevel ? 'bg-yellow-500' : 'bg-green-500'}
          label={`${currentXp} / ${nextLevelXpRequirement} XP`}
        />
      </View>
    </Animated.View>
  );
};

export default LevelExperienceSection;
