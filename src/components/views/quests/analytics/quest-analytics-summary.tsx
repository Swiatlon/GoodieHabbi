import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';
import KpiCard from '@/components/shared/kpi-card/kpi-card';
import RatioBar from '@/components/shared/ratio-bar/ratio-bar';
import { ILifetimeQuestStats, IQuestAnalyticsSummary, QuestPeriodOutcomeEnum } from '@/contract/quests/analytics/quests-analytics.contract';
import { formatCompletionRate, OUTCOME_COLORS } from '@/utils/quests/analytics';

interface QuestAnalyticsSummaryProps {
  range: IQuestAnalyticsSummary;
  lifetime: ILifetimeQuestStats | null;
}

const QuestAnalyticsSummary: React.FC<QuestAnalyticsSummaryProps> = ({ range, lifetime }) => {
  const { t } = useTranslation();

  // Streaks come from `lifetime`: the range figures are clipped to the window, so a 200-day streak
  // would show up as 90 on the default range.
  const currentStreak = lifetime?.currentStreak ?? 0;
  const longestStreak = lifetime?.longestStreak ?? 0;

  const segments = [
    { label: t('quests.analytics.outcome.completed'), value: range.completedPeriods, color: OUTCOME_COLORS[QuestPeriodOutcomeEnum.COMPLETED] },
    { label: t('quests.analytics.outcome.missed'), value: range.missedPeriods, color: OUTCOME_COLORS[QuestPeriodOutcomeEnum.MISSED] },
    { label: t('quests.analytics.outcome.pending'), value: range.pendingPeriods, color: OUTCOME_COLORS[QuestPeriodOutcomeEnum.PENDING] },
  ].filter(segment => segment.value > 0);

  return (
    <View className="gap-4">
      <View className="flex-row gap-2">
        <KpiCard
          label={t('quests.analytics.summary.completionRate')}
          value={formatCompletionRate(range.completionRate)}
          delta={t('quests.analytics.summary.inRange')}
          icon="checkmark-done-outline"
          color="#10B981"
        />
        <KpiCard
          label={t('quests.analytics.summary.currentStreak')}
          value={String(currentStreak)}
          delta={t('quests.analytics.summary.allTime')}
          icon="flame-outline"
          color="#F97316"
        />
        <KpiCard
          label={t('quests.analytics.summary.longestStreak')}
          value={String(longestStreak)}
          delta={t('quests.analytics.summary.allTime')}
          icon="trophy-outline"
          color="#8B5CF6"
        />
      </View>

      {segments.length > 0 && (
        <View className="bg-white rounded-2xl shadow-sm p-4 gap-3">
          <Text className="text-sm font-bold text-gray-800">{t('quests.analytics.summary.periodsHeading')}</Text>
          <RatioBar segments={segments} />
          <Text className="text-[11px] text-gray-400">
            {t('quests.analytics.summary.periodsBreakdown', {
              completed: range.completedPeriods,
              missed: range.missedPeriods,
              pending: range.pendingPeriods,
            })}
          </Text>
        </View>
      )}
    </View>
  );
};

export default QuestAnalyticsSummary;
