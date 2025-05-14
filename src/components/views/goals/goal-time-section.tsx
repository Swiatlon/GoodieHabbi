import React, { useCallback, useState } from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { useFocusEffect } from 'expo-router';
import { useTransformFade } from '@/hooks/animations/use-transform-fade-in';
import useTimer, { Frequency } from '@/hooks/use-timer';

interface TimeSectionProps {
  frequency: Frequency;
}

const GoalTimeSection: React.FC<TimeSectionProps> = ({ frequency }) => {
  const [isTimerEnabled, setIsTimerEnabled] = useState(false);
  const { timeLeft, timeColor } = useTimer({ frequency, enabled: isTimerEnabled });
  const timeParts = parseTime(timeLeft);
  const goalStyle = useTransformFade({ delay: 500 });

  useFocusEffect(
    useCallback(() => {
      setIsTimerEnabled(true);

      return () => {
        setIsTimerEnabled(false);
      };
    }, [])
  );

  return (
    <Animated.View className="flex-1 p-4 rounded-3xl bg-white border border-gray-100 shadow-lg gap-6 justify-center" style={goalStyle}>
      <Text className="text-lg font-semibold text-primary uppercase tracking-wider text-center">Time Left</Text>
      <View className="flex-row flex-wrap justify-center items-center gap-4 mb-6">
        {timeParts.map((part, index) => (
          <View key={index} className="items-center my-auto">
            <Text className={`text-3xl font-bold ${timeColor}`}>{part?.value.split(/(\d+)/)[1]}</Text>
            <Text className="text-sm text-gray-500 uppercase tracking-wide mt-1">{part?.type}</Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
};

export default GoalTimeSection;

const parseTime = (time: string) => {
  return time
    .split(':')
    .map(part => {
      if (part.includes('months')) return { value: part, type: 'months' };
      if (part.includes('weeks')) return { value: part, type: 'weeks' };
      if (part.includes('days')) return { value: part, type: 'days' };
      if (part.includes('hours')) return { value: part, type: 'hours' };
      if (part.includes('minutes')) return { value: part, type: 'minutes' };
      if (part.includes('seconds')) return { value: part, type: 'seconds' };
      return null;
    })
    .filter(Boolean);
};
