import React from 'react';
import { Text, View } from 'react-native';

interface QuestItemDateMonthlyProps {
  startDay?: number;
  endDay?: number;
}

const DayCircle = ({ day }: { day: number }) => (
  <View className="rounded-full bg-blue-500 justify-center items-center shadow-lg" style={{ width: 32, height: 32 }}>
    <Text className="text-white font-extrabold text-sm">{day.toString().padStart(2, '0')}</Text>
  </View>
);

const QuestItemDateMonthly: React.FC<QuestItemDateMonthlyProps> = ({ startDay, endDay }) => {
  if (!startDay && !endDay) {
    return null;
  }

  if (startDay === endDay || !startDay || !endDay) {
    const singleDay = startDay ?? endDay!;

    return (
      <View className="my-4 items-center">
        <DayCircle day={singleDay} />
      </View>
    );
  }
  return (
    <View className="flex-row items-center">
      <DayCircle day={startDay} />
      <View className="bg-blue-500 justify-center items-center shadow-lg" style={{ width: 12, height: 4, marginLeft: 2, marginRight: 2 }} />
      <DayCircle day={endDay} />
    </View>
  );
};

export default QuestItemDateMonthly;
