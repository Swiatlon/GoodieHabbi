import React from 'react';
import { Text, View } from 'react-native';

interface QuestItemDateMonthlyProps {
  startDay: number;
  endDay: number;
}

const CircleNumber = ({ text }: { text: string }) => (
  <View className="ml-1 px-3 py-1.5 bg-blue-500 rounded-full flex items-center justify-center">
    <Text className="text-white font-bold text-xs">{text}</Text>
  </View>
);

const QuestItemDateMonthly: React.FC<QuestItemDateMonthlyProps> = ({ startDay, endDay }) => {
  return (
    <View className="flex-row items-center gap-1">
      <Text className="text-sm text-gray-500">Repeats monthly:</Text>
      <CircleNumber
        text={
          startDay === endDay
            ? startDay.toString().padStart(2, '0')
            : `${startDay.toString().padStart(2, '0')} - ${endDay.toString().padStart(2, '0')}`
        }
      />
    </View>
  );
};

export default QuestItemDateMonthly;
