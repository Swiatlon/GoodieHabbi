import React from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import ProgressBar from '@/components/shared/progress-bar/progress-bar';
import { IAccountDataResponse } from '@/contract/account/account';
import { useTransformFade } from '@/hooks/animations/use-transform-fade-in';

interface LevelExperienceSectionProps
  extends Pick<IAccountDataResponse, 'level' | 'userXp' | 'nextLevelTotalXpRequired' | 'isMaxLevel' | 'completedQuests' | 'totalQuests'> {
  isLoading: boolean;
}

const LevelExperienceSection: React.FC<LevelExperienceSectionProps> = ({
  level,
  userXp,
  nextLevelTotalXpRequired,
  isMaxLevel,
  completedQuests,
  totalQuests,
  isLoading,
}) => {
  const animationStyle = useTransformFade({ isContentLoading: isLoading, delay: 300 });

  return (
    <Animated.View style={animationStyle} className="px-4 py-6 bg-gray-100 rounded-lg shadow-lg flex w-full mb-6">
      <Text className="text-lg font-bold text-center mb-3">Level & Experience</Text>
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
          current={userXp}
          total={nextLevelTotalXpRequired}
          maxColor={isMaxLevel ? 'bg-yellow-500' : 'bg-green-500'}
          label={`${userXp} / ${nextLevelTotalXpRequired} XP`}
        />
      </View>
      <Text className="text-lg font-bold text-center mb-3">Quest Completion</Text>
      <View className="flex items-center">
        <ProgressBar current={completedQuests} total={totalQuests} maxColor="bg-yellow-500" label={`${completedQuests} / ${totalQuests} Quests`} />
      </View>
    </Animated.View>
  );
};

export default LevelExperienceSection;
