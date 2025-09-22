import React from 'react';
import { View, Text } from 'react-native';
import dayjs from 'dayjs';
import { NullableString } from '@/types/global-types';

interface QuestScheduledTimeExtendedProps {
  scheduledTime?: NullableString;
  endDate: NullableString;
}

const getTimeOfDay = (time: string) => {
  const hour = parseInt(time.split(':')[0], 10);
  if (hour < 6) return '🌙 Early Morning';
  if (hour < 12) return '☀️ Morning';
  if (hour < 17) return '🌤️ Afternoon';
  if (hour < 21) return '🌃 Evening';
  return '🌌 Night';
};

const QuestScheduledTimeExtended: React.FC<QuestScheduledTimeExtendedProps> = ({ scheduledTime, endDate }) => {
  if (!scheduledTime && !endDate) return null;
  const dayName = endDate ? dayjs(endDate).format('dddd') : null;

  const timeContext = scheduledTime ? getTimeOfDay(scheduledTime) : '';

  return (
    <View className="bg-white rounded-md p-4 shadow-sm border border-gray-200 flex-row items-center gap-4">
      <Text className="text-blue-500 text-2xl my-auto">⏰</Text>
      <View>
        <Text className="text-blue-600 font-semibold text-base">Scheduled Time</Text>
        <Text className="text-gray-600 text-base">
          {scheduledTime} ({timeContext}) {dayName ? ` (${dayName})` : ''}
        </Text>
      </View>
    </View>
  );
};

export default QuestScheduledTimeExtended;
