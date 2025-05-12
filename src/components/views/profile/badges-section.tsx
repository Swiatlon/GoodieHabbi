import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { IAccountDataResponse } from '@/contract/account/account';
import { useTransformFade } from '@/hooks/animations/use-transform-fade-in';

interface BadgesSectionProps extends Pick<IAccountDataResponse, 'badges'> {
  isLoading: boolean;
}

const BadgesSection: React.FC<BadgesSectionProps> = ({ badges, isLoading }) => {
  const animationStyle = useTransformFade({ isContentLoading: isLoading, delay: 700 });

  return (
    <Animated.View style={animationStyle} className="px-4 py-6 bg-gray-100 rounded-lg shadow-lg flex w-full mb-6">
      <Text className="text-lg font-bold text-center mb-2">Achievements & Badges</Text>

      {badges.length > 0 ? (
        <ScrollView horizontal className="flex-row flex-nowrap mt-2" showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
          <View className="flex-row flex-nowrap gap-3 py-2">
            {badges.map((badge, index) => (
              <View key={index} className="bg-primary px-4 py-2 rounded-full items-center">
                <Text className="text-white font-bold">{badge.text}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View className="py-4 items-center">
          <Ionicons name="trophy-outline" size={32} color="#CBD5E0" />
          <Text className="text-center text-gray-400 mt-2">✨ No badges yet! Keep going!</Text>
        </View>
      )}
    </Animated.View>
  );
};

export default BadgesSection;
