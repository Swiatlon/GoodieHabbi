import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withDelay, interpolate, Extrapolate } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const PODIUM_HEIGHTS = [180, 160, 140];
const PODIUM_COLORS: readonly [string, string][] = [
  ['#FFD700', '#FFA500'],
  ['#C0C0C0', '#A0A0A0'],
  ['#CD7F32', '#8B4513'],
];
const ICONS = ['trophy', 'trophy', 'medal'] as const;
const ICON_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];

interface Props {
  nickname: string;
  xp: number;
  position: number;
  delay: number;
}

const PodiumUser: React.FC<Props> = ({ nickname, xp, position, delay }) => {
  const animatedValue = useSharedValue(0);
  const scaleValue = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withDelay(delay, withSpring(1));
    scaleValue.value = withDelay(delay + 200, withSpring(1));
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(animatedValue.value, [0, 1], [100, 0], Extrapolate.CLAMP) }],
    opacity: animatedValue.value,
  }));

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  const displayName = nickname.length > 12 ? `${nickname.slice(0, 10)}...` : nickname;

  return (
    <Animated.View style={[animatedStyle, { alignItems: 'center' }]} className="mx-2">
      <Animated.View style={[scaleStyle, { marginBottom: 8 }]}>
        <View className="relative">
          <Ionicons name={ICONS[position]} size={position === 1 ? 32 : 28} color={ICON_COLORS[position]} />
          {position === 1 && <View className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full opacity-80" />}
        </View>
      </Animated.View>

      <Animated.View style={scaleStyle}>
        <View
          className="bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-lg mb-3 border-2"
          style={{
            borderColor: ICON_COLORS[position],
            alignItems: 'center',
          }}
        >
          <View
            className="absolute -top-3 -right-3 w-8 h-8 rounded-full items-center justify-center shadow-md"
            style={{ backgroundColor: ICON_COLORS[position] }}
          >
            <Text className="text-white font-bold text-sm">{position + 1}</Text>
          </View>

          <View className="w-12 h-12 rounded-full items-center justify-center mb-2" style={{ backgroundColor: `${ICON_COLORS[position]}20` }}>
            <Ionicons name="person" size={20} color={ICON_COLORS[position]} />
          </View>

          <Text className="text-center font-bold text-gray-800 dark:text-white text-sm">{displayName}</Text>
          <Text className="text-center font-semibold text-xs mt-1" style={{ color: ICON_COLORS[position] }}>
            {xp.toLocaleString()} XP
          </Text>
        </View>
      </Animated.View>

      <Animated.View style={animatedStyle}>
        <LinearGradient
          colors={PODIUM_COLORS[position]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{
            height: PODIUM_HEIGHTS[position],
            width: 60,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <View className="absolute top-2 left-2 right-2 h-1 bg-white bg-opacity-30 rounded-full" />
          <View className="absolute top-4 left-3 right-3 h-0.5 bg-white bg-opacity-20 rounded-full" />
          <Text className="text-white font-bold text-3xl opacity-90">{position + 1}</Text>
        </LinearGradient>
      </Animated.View>
    </Animated.View>
  );
};

export default PodiumUser;
