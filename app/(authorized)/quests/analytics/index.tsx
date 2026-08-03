import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import KpiCard from '@/components/shared/kpi-card/kpi-card';
import Loader from '@/components/shared/loader/loader';
import AnalyticsRangeSelector from '@/components/views/quests/analytics/analytics-range-selector';
import DailyRateHeatmap from '@/components/views/quests/analytics/daily-rate-heatmap';
import HabitRankingItem from '@/components/views/quests/analytics/habit-ranking-item';
import { useGetHabitsOverviewQuery } from '@/redux/api/quests/quests-analytics-api';
import { AnalyticsRangeDays, formatCompletionRate, mergeHabitSummaries, rangeStartFor } from '@/utils/quests/analytics';

const HabitsOverview = () => {
  const { t } = useTranslation();
  const [rangeDays, setRangeDays] = useState<AnalyticsRangeDays>(30);

  const { data: overview, isLoading, isFetching, error, refetch } = useGetHabitsOverviewQuery({ from: rangeStartFor(rangeDays) });

  // The endpoint currently repeats a quest once per occurrence period — see mergeHabitSummaries.
  const habits = useMemo(() => mergeHabitSummaries(overview?.quests ?? []), [overview?.quests]);

  if (isLoading) {
    return <Loader message={t('quests.analytics.loading')} />;
  }

  if (error || !overview) {
    return (
      <View className="flex-1 items-center justify-center p-8 bg-gray-50">
        <Ionicons name="stats-chart-outline" size={56} color="#d1d5db" />
        <Text className="text-gray-500 text-base mt-3 text-center">{t('quests.analytics.error.heading')}</Text>
        <Text className="text-gray-400 text-sm mt-1 text-center">{t('quests.analytics.error.hint')}</Text>
      </View>
    );
  }

  const { overall } = overview;

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 16 }}
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} colors={['#1987EE']} tintColor="#1987EE" />}
      >
        <View>
          <Text className="text-2xl font-bold text-primary">{t('quests.analytics.overview.title')}</Text>
          <Text className="text-xs text-gray-400 mt-0.5">{t('quests.analytics.rangeLabel', { from: overview.from, to: overview.to })}</Text>
        </View>

        <AnalyticsRangeSelector value={rangeDays} onChange={setRangeDays} />

        {habits.length === 0 ? (
          <View className="items-center py-12">
            <Ionicons name="repeat-outline" size={56} color="#d1d5db" />
            <Text className="text-gray-500 text-base mt-3 text-center">{t('quests.analytics.overview.emptyHeading')}</Text>
            <Text className="text-gray-400 text-sm mt-1 text-center">{t('quests.analytics.overview.emptyHint')}</Text>
          </View>
        ) : (
          <>
            <View className="flex-row gap-2">
              <KpiCard
                label={t('quests.analytics.summary.completionRate')}
                value={formatCompletionRate(overall.completionRate)}
                delta={t('quests.analytics.summary.inRange')}
                icon="checkmark-done-outline"
                color="#10B981"
              />
              <KpiCard
                label={t('quests.analytics.overview.donePeriods')}
                value={`${overall.completedPeriods}/${overall.evaluatedPeriods}`}
                delta={t('quests.analytics.summary.inRange')}
                icon="calendar-outline"
                color="#1987EE"
              />
              <KpiCard
                label={t('quests.analytics.overview.habitsCount')}
                value={String(habits.length)}
                delta={t('quests.analytics.overview.repeatable')}
                icon="repeat-outline"
                color="#8B5CF6"
              />
            </View>

            <DailyRateHeatmap dailyCompletionRate={overview.dailyCompletionRate} from={overview.from} to={overview.to} />

            <View className="bg-white rounded-2xl shadow-sm px-4 py-2">
              <Text className="text-sm font-bold text-gray-800 mt-2 mb-1">{t('quests.analytics.overview.rankingHeading')}</Text>
              <Text className="text-[11px] text-gray-400 mb-2">{t('quests.analytics.overview.rankingHint')}</Text>
              <View className="divide-y divide-gray-100">
                {habits.map(habit => (
                  <HabitRankingItem key={habit.questId} habit={habit} />
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default HabitsOverview;
