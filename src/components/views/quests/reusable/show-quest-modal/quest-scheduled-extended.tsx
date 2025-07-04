import React from 'react';
import { View, Text } from 'react-native';

interface QuestScheduledTimeExtendedProps {
  scheduledTime?: string | null;
}

const getTimeOfDay = (time: string) => {
  const hour = parseInt(time.split(':')[0], 10);
  if (hour < 6) return '🌙 Early Morning';
  if (hour < 12) return '☀️ Morning';
  if (hour < 17) return '🌤️ Afternoon';
  if (hour < 21) return '🌃 Evening';
  return '🌌 Night';
};

const QuestScheduledTimeExtended: React.FC<QuestScheduledTimeExtendedProps> = ({ scheduledTime }) => {
  if (!scheduledTime) return null;

  const timeContext = getTimeOfDay(scheduledTime);

  return (
    <View className="bg-white rounded-md p-4 shadow-sm border border-gray-200 flex-row items-center gap-4">
      <Text className="text-blue-500 text-2xl my-auto">⏰</Text>
      <View>
        <Text className="text-blue-600 font-semibold text-base">Scheduled Time</Text>
        <Text className="text-gray-600 text-base">
          {scheduledTime} ({timeContext})
        </Text>
      </View>
    </View>
  );
};

export default QuestScheduledTimeExtended;
