import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';
import { IQuestWeekdayBreakdown } from '@/contract/quests/analytics/quests-analytics.contract';
import { COMPLETION_COLOR, formatCompletionRate, WEEKDAY_ORDER } from '@/utils/quests/analytics';

interface WeekdayBreakdownProps {
  byWeekday: IQuestWeekdayBreakdown[];
}

const WeekdayBreakdown: React.FC<WeekdayBreakdownProps> = ({ byWeekday }) => {
  const { t } = useTranslation();

  // Empty for Monthly quests, where a weekday split says nothing about a multi-day period.
  if (byWeekday.length === 0) {
    return null;
  }

  const rows = WEEKDAY_ORDER.map(weekday => byWeekday.find(item => item.weekday === weekday)).filter((item): item is IQuestWeekdayBreakdown =>
    Boolean(item)
  );

  return (
    <View className="bg-white rounded-2xl shadow-sm p-4">
      <Text className="text-sm font-bold text-gray-800 mb-1">{t('quests.analytics.weekday.heading')}</Text>
      <Text className="text-[11px] text-gray-400 mb-4">{t('quests.analytics.weekday.hint')}</Text>

      <View className="gap-3">
        {rows.map(row => (
          <View key={row.weekday} className="flex-row items-center gap-3">
            <Text className="text-xs text-gray-500 w-8">{t(`quests.reusable.days.${row.weekday.toLowerCase()}`)}</Text>

            <View className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
              {row.completionRate !== null && (
                <View
                  className="h-full rounded-full"
                  style={{ width: `${Math.round(row.completionRate * 100)}%`, backgroundColor: COMPLETION_COLOR }}
                />
              )}
            </View>

            <Text className="text-xs font-bold text-gray-700 w-10 text-right">{formatCompletionRate(row.completionRate)}</Text>
            <Text className="text-[10px] text-gray-400 w-12 text-right">
              {row.completedPeriods}/{row.evaluatedPeriods}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default WeekdayBreakdown;
