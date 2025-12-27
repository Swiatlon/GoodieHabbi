import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useNotifications } from '@/providers/notification-provider/notification-provider';

export const AchievementOverlay: React.FC = () => {
  const { notifications } = useNotifications();
  const [achievement, setAchievement] = useState<{ title: string; message: string } | null>(null);

  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const newAchievement = notifications.find(n => n.type === 'BadgeEarned');

    if (newAchievement) {
      setAchievement(newAchievement);

      scale.value = withSpring(1, { damping: 8, stiffness: 100 });
      opacity.value = withTiming(1, { duration: 300 });
    }
  }, [notifications]);

  const handleClose = () => {
    scale.value = withTiming(0.8, { duration: 200 });
    opacity.value = withTiming(0, { duration: 200 });
    setTimeout(() => setAchievement(null), 200);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  if (!achievement) return null;

  return (
    <Pressable onPress={handleClose} className="absolute inset-0 z-50 items-center justify-center bg-black/60">
      <Animated.View style={animatedStyle} className="mx-8 bg-amber-50 rounded-3xl overflow-hidden border-4 border-yellow-400">
        <TouchableOpacity
          onPress={handleClose}
          className="absolute top-3 right-3 z-10 bg-gray-700/80 rounded-full w-8 h-8 items-center justify-center"
        >
          <Text className="text-white text-xl font-bold">×</Text>
        </TouchableOpacity>
        <View className="p-8 items-center">
          <View className="mb-4 bg-yellow-400 rounded-full p-4">
            <Text className="text-5xl">🏆</Text>
          </View>
          <Text className="text-blue-600 text-xs font-bold tracking-widest uppercase mb-3">Achievement Unlocked</Text>
          <Text className="text-gray-800 text-2xl font-bold text-center mb-3">{achievement.title}</Text>
          <Text className="text-gray-700 text-base text-center leading-6">{achievement.message}</Text>
          <View className="flex-row mt-4 gap-2">
            <Text className="text-3xl">⭐</Text>
            <Text className="text-3xl">⭐</Text>
            <Text className="text-3xl">⭐</Text>
          </View>
        </View>
        <View className="h-2 bg-yellow-400" />
      </Animated.View>
    </Pressable>
  );
};
