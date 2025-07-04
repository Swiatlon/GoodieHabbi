import React from 'react';
import { View, Text } from 'react-native';
import { NullableString } from '@/types/global-types';

interface QuestItemScheduledTimeProps {
  scheduledTime: NullableString;
}

const QuestItemScheduledTime: React.FC<QuestItemScheduledTimeProps> = ({ scheduledTime }) => {
  if (!scheduledTime) return null;

  return (
    <View className="flex-row items-center gap-1">
      <Text className="text-base text-gray-600">⏰ {scheduledTime}</Text>
    </View>
  );
};

export default QuestItemScheduledTime;
