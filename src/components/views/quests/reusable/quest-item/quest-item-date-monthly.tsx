import React from 'react';
import { Text } from 'react-native';

interface QuestItemDateMonthlyProps {
  startDay: number;
  endDay: number;
}

const QuestItemDateMonthly: React.FC<QuestItemDateMonthlyProps> = ({ startDay, endDay }) => {
  if (startDay === endDay) {
    return (
      <Text className="text-sm text-gray-500">Repeats monthly every: {startDay!.toString().padStart(2, '0')}</Text>
    );
  }

  return (
    <Text className="text-sm text-gray-500">
      Repeats monthly bettwen: {startDay!.toString().padStart(2, '0')}-{endDay!.toString().padStart(2, '0')}
    </Text>
  );
};
export default QuestItemDateMonthly;
