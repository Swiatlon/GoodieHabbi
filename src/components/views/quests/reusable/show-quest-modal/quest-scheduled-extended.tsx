import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';
import dayjs from 'dayjs';
import { NullableString } from '@/types/global-types';

interface QuestScheduledTimeExtendedProps {
  scheduledTime?: NullableString;
  endDate: NullableString;
}

const getTimeOfDayKey = (time: string) => {
  const hour = parseInt(time.split(':')[0], 10);
  if (hour < 6) return 'quests.reusable.scheduled.timeOfDay.earlyMorning';
  if (hour < 12) return 'quests.reusable.scheduled.timeOfDay.morning';
  if (hour < 17) return 'quests.reusable.scheduled.timeOfDay.afternoon';
  if (hour < 21) return 'quests.reusable.scheduled.timeOfDay.evening';
  return 'quests.reusable.scheduled.timeOfDay.night';
};

const QuestScheduledTimeExtended: React.FC<QuestScheduledTimeExtendedProps> = ({ scheduledTime, endDate }) => {
  const { t } = useTranslation();

  if (!scheduledTime && !endDate) return null;
  const dayName = endDate ? dayjs(endDate).format('dddd') : null;

  const timeContext = scheduledTime ? t(getTimeOfDayKey(scheduledTime)) : '';

  return (
    <View className="bg-white rounded-md p-4 shadow-sm border border-gray-200 flex-row items-center gap-4">
      <Text className="text-blue-500 text-2xl my-auto">⏰</Text>
      <View>
        <Text className="text-blue-600 font-semibold text-base">{t('quests.reusable.scheduled.heading')}</Text>
        <Text className="text-gray-600 text-base">
          {scheduledTime} ({timeContext}) {dayName ? ` (${dayName})` : ''}
        </Text>
      </View>
    </View>
  );
};

export default QuestScheduledTimeExtended;
