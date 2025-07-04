import React from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { useTransformFade } from '@/hooks/animations/use-transform-fade-in';

interface Props {
  nickname: string;
  xp: number;
  index: number;
}

const RegularLeaderboardItem: React.FC<Props> = ({ nickname, xp, index }) => {
  const animation = useTransformFade({ direction: 'right', delay: (index - 3) * 100 });

  return (
    <Animated.View style={animation} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md mb-3 mx-4">
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center flex-1">
          <View className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full items-center justify-center mr-3">
            <Text className="text-gray-600 dark:text-gray-300 font-bold text-sm">{index + 1}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-lg font-semibold text-primary" numberOfLines={1} ellipsizeMode="tail">
              {nickname}
            </Text>
          </View>
        </View>
        <Text className="text-md text-gray-600 dark:text-gray-300 font-semibold">{xp.toLocaleString()} XP</Text>
      </View>
    </Animated.View>
  );
};

export default RegularLeaderboardItem;
