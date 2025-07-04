import React from 'react';
import { View, Text } from 'react-native';
import dayjs from 'dayjs';
import { safeDateFormat } from '@/utils/utils/utils';

interface QuestDatesExtendedProps {
  startDate: string | null;
  endDate: string | null;
}

const QuestDatesExtended: React.FC<QuestDatesExtendedProps> = ({ startDate, endDate }) => {
  if (!startDate && !endDate) {
    return null;
  }

  const formattedStartDate = startDate ? safeDateFormat(startDate) : 'Not set';
  const formattedEndDate = endDate ? safeDateFormat(endDate) : 'Not set';

  const daysLeft = endDate ? Math.ceil(dayjs(endDate).diff(dayjs(), 'day', true)) : null;

  const renderDaysLeftBadge = () => {
    if (daysLeft == null) return <Text className="text-sm text-gray-500">(No deadline)</Text>;
    if (daysLeft < 0) return <Text className="text-sm text-red-600">(⏰ Expired)</Text>;
    if (daysLeft === 0) return <Text className="text-sm text-yellow-600">(⚡ Last day!)</Text>;
    if (daysLeft <= 5) return <Text className="text-sm text-red-500">(⏳ {daysLeft} days left)</Text>;
    if (daysLeft <= 10) return <Text className="text-sm text-yellow-500">(🕒 {daysLeft} days left)</Text>;
    return <Text className="text-sm text-green-600">({daysLeft} days left)</Text>;
  };

  return (
    <View className="bg-white rounded-md p-4 shadow-sm border border-gray-200">
      <View className="flex-row items-center mb-2 gap-2">
        <Text className="text-2xl">📅</Text>
        <Text className="font-semibold text-gray-700">Dates</Text>
      </View>

      <View className="flex-row items-center gap-2 mb-1">
        <Text className="text-lg">🚀</Text>
        <Text className="text-sm font-medium text-gray-700">Start Date:</Text>
        <Text className="text-sm text-gray-600">{formattedStartDate}</Text>
      </View>

      <View className="flex-row items-center gap-2 mb-1">
        <Text className="text-lg">🏁</Text>
        <Text className="text-sm font-medium text-gray-700">End Date:</Text>
        <Text className="text-sm text-gray-600">{formattedEndDate}</Text>
      </View>

      <View className="flex-row items-center gap-2">
        <Text className="text-lg">⏳</Text>
        <Text className="text-sm font-medium text-gray-700">Time Remaining:</Text>
        {renderDaysLeftBadge()}
      </View>
    </View>
  );
};

export default QuestDatesExtended;
