import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';
import { QuestPeriodOutcomeEnum } from '@/contract/quests/analytics/quests-analytics.contract';
import { OUTCOME_COLORS, UNSCHEDULED_COLOR } from '@/utils/quests/analytics';

/**
 * Outcome colours never travel alone — this legend is what makes them readable for anyone who
 * cannot separate the green from the red.
 */
const OutcomeLegend: React.FC = () => {
  const { t } = useTranslation();

  const items = [
    { key: 'completed', color: OUTCOME_COLORS[QuestPeriodOutcomeEnum.COMPLETED], dot: false },
    { key: 'backfilled', color: OUTCOME_COLORS[QuestPeriodOutcomeEnum.COMPLETED], dot: true },
    { key: 'missed', color: OUTCOME_COLORS[QuestPeriodOutcomeEnum.MISSED], dot: false },
    { key: 'pending', color: OUTCOME_COLORS[QuestPeriodOutcomeEnum.PENDING], dot: false },
    { key: 'unscheduled', color: UNSCHEDULED_COLOR, dot: false },
  ];

  return (
    <View className="flex-row flex-wrap gap-x-4 gap-y-2">
      {items.map(item => (
        <View key={item.key} className="flex-row items-center gap-1.5">
          <View className="w-3 h-3 rounded items-center justify-center" style={{ backgroundColor: item.color }}>
            {item.dot && <View className="w-1 h-1 rounded-full bg-white" />}
          </View>
          <Text className="text-[11px] text-gray-500">{t(`quests.analytics.outcome.${item.key}`)}</Text>
        </View>
      ))}
    </View>
  );
};

export default OutcomeLegend;
