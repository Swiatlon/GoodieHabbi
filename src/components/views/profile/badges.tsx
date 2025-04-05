import React from 'react';
import { View, Text, Animated } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { IBadge } from '@/contract/account/account';

interface BadgesProps {
  badges: IBadge[];
  fadeAnim: Animated.Value;
  scaleAnim: Animated.Value;
  slideAnim: Animated.Value;
}

const Badges: React.FC<BadgesProps> = ({ badges, fadeAnim, scaleAnim, slideAnim }) => {
  if (badges.length === 0) {
    return <Text className="text-center text-gray-400 mt-6">✨ No badges yet! Keep going!</Text>;
  }

  return (
    <ScrollView className="flex-row flex-nowrap gap-4 mt-6 max-h-[40px]" showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
      <View className="flex-row flex-nowrap gap-4">
        {badges.map((badge, index) => (
          <Animated.View
            key={index}
            className="bg-primary text-white p-2 px-3 rounded-full"
            style={{
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }, { translateX: slideAnim }],
            }}
          >
            <Text className="text-white text-sm">{badge.text}</Text>
          </Animated.View>
        ))}
      </View>
    </ScrollView>
  );
};

export default Badges;
