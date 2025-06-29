import React from 'react';
import { View, Text } from 'react-native';
import dayjs from '@/configs/day-js-config';
import { NullableString } from '@/types/global-types';
import { safeDateFormat } from '@/utils/utils/utils';

interface QuestItemDateProps {
  startDate: NullableString;
  endDate: NullableString;
}

const QuestItemDate: React.FC<QuestItemDateProps> = ({ startDate, endDate }) => {
  const formattedStartDate = safeDateFormat(startDate);
  const formattedEndDate = safeDateFormat(endDate);

  const daysLeft = endDate ? Math.ceil(dayjs(endDate).diff(dayjs(), 'day', true)) : null;

  const getDaysLeftBadge = () => {
    if (daysLeft == null) return null;
    if (daysLeft < 0) return <Text className="text-sm text-red-500">(⏰ Expired)</Text>;
    if (daysLeft === 0) return <Text className="text-sm text-yellow-600">(⚡ Last day!)</Text>;
    if (daysLeft <= 5) return <Text className="text-sm text-red-500">(⏳ {daysLeft} days left)</Text>;
    if (daysLeft <= 10) return <Text className="text-sm text-yellow-500">(🕒 {daysLeft} days left)</Text>;
    return <Text className="text-sm text-green-500">({daysLeft} days left)</Text>;
  };

  return (
    <View className="gap-1">
      {startDate && (
        <View className="flex-row items-center gap-1">
          <Text className="text-base text-gray-600">📅 Start: {formattedStartDate}</Text>
        </View>
      )}
      {endDate && (
        <View className="flex-row items-center gap-2">
          <Text className="text-base text-gray-600">⏳ End: {formattedEndDate}</Text>
          {getDaysLeftBadge()}
        </View>
      )}
    </View>
  );
};

export default QuestItemDate;
