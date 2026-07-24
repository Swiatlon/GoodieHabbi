import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';

interface QuestMonthDaysExtendedProps {
  startDay?: number;
  endDay?: number;
}

const DayPill = ({ day }: { day: number }) => (
  <View className="rounded-full bg-primary shadow-sm w-10 h-10 justify-center items-center">
    <Text className="text-white font-extrabold text-sm">{day.toString().padStart(2, '0')}</Text>
  </View>
);

const QuestMonthDaysExtended: React.FC<QuestMonthDaysExtendedProps> = ({ startDay, endDay }) => {
  const { t } = useTranslation();

  if (!startDay && !endDay) return null;

  const isRange = startDay && endDay && startDay !== endDay;
  const singleDay = startDay ?? endDay!;

  return (
    <View className="bg-white rounded-md p-4 shadow-sm border border-gray-200">
      <View className="flex-row items-center mb-2 gap-2">
        <Text className="text-2xl">📅</Text>
        <Text className="font-semibold text-gray-700">{t('quests.reusable.monthly.heading')}</Text>
      </View>

      <View className="flex-row items-center justify-start gap-2 pl-8">
        {isRange ? (
          <>
            <DayPill day={startDay!} />
            <View className="w-12 h-0.5 bg-gray-400 rounded-full" />
            <DayPill day={endDay!} />
          </>
        ) : (
          <DayPill day={singleDay} />
        )}
      </View>
    </View>
  );
};

export default QuestMonthDaysExtended;
