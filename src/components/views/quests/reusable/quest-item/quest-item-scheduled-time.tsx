import React from 'react';
import { View, Text } from 'react-native';
import dayjs from 'dayjs';
import { NullableString } from '@/types/global-types';

interface QuestItemScheduledTimeProps {
  scheduledTime: NullableString;
  endDate: NullableString;
}

const QuestItemScheduledTime: React.FC<QuestItemScheduledTimeProps> = ({ scheduledTime, endDate }) => {
  if (!scheduledTime && !endDate) return null;
  const dayName = endDate ? dayjs(endDate).format('dddd') : null;

  return (
    <View className="flex-row items-center gap-1">
      <Text className="text-base text-gray-600">
        ⏰ {scheduledTime ?? ''} {dayName ? ` (${dayName})` : ''}
      </Text>
    </View>
  );
};

export default QuestItemScheduledTime;
