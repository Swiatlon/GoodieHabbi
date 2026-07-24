import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';
import dayjs from 'dayjs';
import { safeDateFormat } from '@/utils/utils/utils';

interface QuestDatesExtendedProps {
  startDate: string | null;
  endDate: string | null;
}

const QuestDatesExtended: React.FC<QuestDatesExtendedProps> = ({ startDate, endDate }) => {
  const { t } = useTranslation();

  if (!startDate && !endDate) {
    return null;
  }

  const notSetLabel = t('quests.reusable.dates.notSet');
  const formattedStartDate = startDate ? safeDateFormat(startDate) : notSetLabel;
  const formattedEndDate = endDate ? safeDateFormat(endDate) : notSetLabel;

  const daysLeft = endDate ? Math.floor(dayjs(endDate).diff(dayjs(), 'day', true)) : null;

  const renderDaysLeftBadge = () => {
    if (daysLeft == null) return <Text className="text-sm text-gray-500">{t('quests.reusable.dates.noDeadline')}</Text>;
    if (daysLeft < 0) return <Text className="text-sm text-red-600">{t('quests.reusable.dates.expired')}</Text>;
    if (daysLeft === 0) return <Text className="text-sm text-yellow-600">{t('quests.reusable.dates.lastDay')}</Text>;
    if (daysLeft <= 5) return <Text className="text-sm text-red-500">{t('quests.reusable.dates.daysLeftUrgent', { count: daysLeft })}</Text>;
    if (daysLeft <= 10) return <Text className="text-sm text-yellow-500">{t('quests.reusable.dates.daysLeftWarning', { count: daysLeft })}</Text>;
    return <Text className="text-sm text-green-600">{t('quests.reusable.dates.daysLeftNormal', { count: daysLeft })}</Text>;
  };

  return (
    <View className="bg-white rounded-md p-4 shadow-sm border border-gray-200">
      <View className="flex-row items-center mb-2 gap-2">
        <Text className="text-2xl">📅</Text>
        <Text className="font-semibold text-gray-700">{t('quests.reusable.dates.heading')}</Text>
      </View>

      <View className="flex-row items-center gap-2 mb-1">
        <Text className="text-lg">🚀</Text>
        <Text className="text-sm font-medium text-gray-700">{t('quests.reusable.dates.startDateLabel')}</Text>
        <Text className="text-sm text-gray-600">{formattedStartDate}</Text>
      </View>

      <View className="flex-row items-center gap-2 mb-1">
        <Text className="text-lg">🏁</Text>
        <Text className="text-sm font-medium text-gray-700">{t('quests.reusable.dates.endDateLabel')}</Text>
        <Text className="text-sm text-gray-600">{formattedEndDate}</Text>
      </View>

      <View className="flex-row items-center gap-2">
        <Text className="text-lg">⏳</Text>
        <Text className="text-sm font-medium text-gray-700">{t('quests.reusable.dates.timeRemainingLabel')}</Text>
        {renderDaysLeftBadge()}
      </View>
    </View>
  );
};

export default QuestDatesExtended;
