import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import Loader from '@/components/shared/loader/loader';
import AnalyticsRangeSelector from '@/components/views/quests/analytics/analytics-range-selector';
import CompletionHeatmap from '@/components/views/quests/analytics/completion-heatmap';
import CompletionTrendChart from '@/components/views/quests/analytics/completion-trend-chart';
import OutcomeLegend from '@/components/views/quests/analytics/outcome-legend';
import QuestAnalyticsSummary from '@/components/views/quests/analytics/quest-analytics-summary';
import WeekdayBreakdown from '@/components/views/quests/analytics/weekday-breakdown';
import { AnalyticsGranularityEnum } from '@/contract/quests/analytics/quests-analytics.contract';
import { useGetQuestAnalyticsQuery } from '@/redux/api/quests/quests-analytics-api';
import { AnalyticsRangeDays, rangeStartFor } from '@/utils/quests/analytics';

/** Longer windows would produce unreadably many buckets at day resolution. */
const granularityForRange = (days: AnalyticsRangeDays) => {
  if (days <= 30) return AnalyticsGranularityEnum.DAY;

  return days <= 90 ? AnalyticsGranularityEnum.WEEK : AnalyticsGranularityEnum.MONTH;
};

const QuestAnalytics = () => {
  const { t } = useTranslation();
  const { questId } = useLocalSearchParams<{ questId: string }>();
  const [rangeDays, setRangeDays] = useState<AnalyticsRangeDays>(90);

  const {
    data: analytics,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetQuestAnalyticsQuery({
    questId: Number(questId),
    from: rangeStartFor(rangeDays),
    granularity: granularityForRange(rangeDays),
  });

  if (isLoading) {
    return <Loader message={t('quests.analytics.loading')} />;
  }

  if (error || !analytics) {
    return (
      <View className="flex-1 items-center justify-center p-8 bg-gray-50">
        <Ionicons name="stats-chart-outline" size={56} color="#d1d5db" />
        <Text className="text-gray-500 text-base mt-3 text-center">{t('quests.analytics.error.heading')}</Text>
        <Text className="text-gray-400 text-sm mt-1 text-center">{t('quests.analytics.error.hint')}</Text>
      </View>
    );
  }

  const hasNoPeriods = analytics.range.totalPeriods === 0;

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 16 }}
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} colors={['#1987EE']} tintColor="#1987EE" />}
      >
        <View>
          <Text className="text-xl font-bold text-gray-800">{analytics.title}</Text>
          <Text className="text-xs text-gray-400 mt-0.5">
            {t('quests.analytics.rangeLabel', {
              from: analytics.from,
              to: analytics.to,
            })}
          </Text>
        </View>

        <AnalyticsRangeSelector value={rangeDays} onChange={setRangeDays} />

        {hasNoPeriods ? (
          <View className="items-center py-12">
            <Ionicons name="calendar-outline" size={56} color="#d1d5db" />
            <Text className="text-gray-500 text-base mt-3 text-center">{t('quests.analytics.empty.heading')}</Text>
            <Text className="text-gray-400 text-sm mt-1 text-center">{t('quests.analytics.empty.hint')}</Text>
          </View>
        ) : (
          <>
            <QuestAnalyticsSummary range={analytics.range} lifetime={analytics.lifetime} />
            <CompletionHeatmap calendar={analytics.calendar} from={analytics.from} to={analytics.to} />
            <OutcomeLegend />
            <CompletionTrendChart trend={analytics.trend} granularity={analytics.granularity} />
            <WeekdayBreakdown byWeekday={analytics.byWeekday} />
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default QuestAnalytics;
