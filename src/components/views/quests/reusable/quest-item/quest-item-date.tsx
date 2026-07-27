import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';
import dayjs from '@/configs/day-js-config';
import { NullableString } from '@/types/global-types';
import { safeDateFormat } from '@/utils/utils/utils';

interface QuestItemDateProps {
  startDate: NullableString;
  endDate: NullableString;
}

const QuestItemDate: React.FC<QuestItemDateProps> = ({ startDate, endDate }) => {
  const { t } = useTranslation();

  if (!startDate && !endDate) {
    return null;
  }

  const formattedStartDate = safeDateFormat(startDate);
  const formattedEndDate = safeDateFormat(endDate);

  const daysLeft = endDate ? Math.floor(dayjs(endDate).diff(dayjs(), 'day', true)) : null;

  const getDaysLeftBadge = () => {
    if (daysLeft == null) return <Text className="text-sm text-gray-500">{t('quests.reusable.dates.noDeadline')}</Text>;
    if (daysLeft < 0) return <Text className="text-sm text-red-500">{t('quests.reusable.dates.expired')}</Text>;
    if (daysLeft === 0) return <Text className="text-sm text-yellow-600">{t('quests.reusable.dates.lastDay')}</Text>;
    if (daysLeft <= 5) return <Text className="text-sm text-red-500">{t('quests.reusable.dates.daysLeftUrgent', { count: daysLeft })}</Text>;
    if (daysLeft <= 10) return <Text className="text-sm text-yellow-500">{t('quests.reusable.dates.daysLeftWarning', { count: daysLeft })}</Text>;
    return <Text className="text-sm text-green-500">{t('quests.reusable.dates.daysLeftNormal', { count: daysLeft })}</Text>;
  };

  if (startDate && endDate) {
    return (
      <View className="gap-1">
        <View className="grid gap-1">
          <Text className="text-sm text-gray-600">{getDaysLeftBadge()}</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="gap-1">
      {startDate && (
        <View className="flex-row items-center gap-1">
          <Text className="text-sm text-gray-600">
            📅 {t('quests.reusable.dates.startDateLabel')} {formattedStartDate}
          </Text>
        </View>
      )}
      {endDate && (
        <View className="flex-row items-center gap-2">
          <Text className="text-sm text-gray-600">
            ⏳ {t('quests.reusable.dates.endDateLabel')} {formattedEndDate}
          </Text>
          {getDaysLeftBadge()}
        </View>
      )}
    </View>
  );
};

export default QuestItemDate;
